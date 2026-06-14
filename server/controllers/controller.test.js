import Test from '../models/model.test.js';
import { DEPARTMENTS } from '../models/model.test.js';
import { fetchTestPrices } from '../utils/service.mainserver.js';
import { mapTestToDepartment } from '../utils/util.departmentMapper.js';

/**
 * GET /api/tests
 * Serves test data from local MongoDB cache.
 * Only active tests are shown on the public frontend.
 * Supports optional ?search=, ?category=, and ?department= query params.
 */
export const getTests = async (req, res) => {
  try {
    const { search, category, department } = req.query;
    const query = { isActive: true };

    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { category: { $regex: search.trim(), $options: 'i' } },
        { code: { $regex: search.trim(), $options: 'i' } },
        { department: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    if (category && category.trim()) {
      query.category = { $regex: category.trim(), $options: 'i' };
    }

    if (department && department.trim() && department.trim().toLowerCase() !== 'all') {
      query.department = department.trim();
    }

    const tests = await Test.find(query).sort({ department: 1, name: 1 }).lean();

    res.status(200).json({
      success: true,
      count: tests.length,
      data: tests,
    });
  } catch (error) {
    console.error('getTests error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch tests.' });
  }
};

/**
 * GET /api/tests/categories
 * Returns distinct active categories for the filter UI.
 */
export const getCategories = async (req, res) => {
  try {
    const categories = await Test.distinct('category', { isActive: true });
    res.status(200).json({ success: true, data: categories.sort() });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch categories.' });
  }
};

/**
 * GET /api/tests/departments
 * Returns distinct active departments with test counts for the filter UI.
 */
export const getDepartments = async (req, res) => {
  try {
    const departments = await Test.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Return both the ordered list and the counts map
    const departmentList = departments.map((d) => d._id).filter(Boolean);
    const departmentCounts = {};
    departments.forEach((d) => {
      if (d._id) departmentCounts[d._id] = d.count;
    });

    res.status(200).json({
      success: true,
      data: departmentList,
      counts: departmentCounts,
    });
  } catch (error) {
    console.error('getDepartments error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch departments.' });
  }
};

/**
 * Sync test catalog from the main server (GetCharge).
 * Calls GET_TEST_PRICE → maps response → SMART incremental upsert into MongoDB.
 *
 * Main server returns tests with: name, id, price, status (active / deactive)
 *   - "active"   → isActive: true  (show on frontend)
 *   - "deactive" → isActive: false (hide from frontend)
 *
 * SMART SYNC RULES:
 *   1. DO NOT mass-deactivate all tests before syncing.
 *   2. Only update fields that come from the main server (name, price, isActive).
 *   3. For NEW tests (not in our DB): auto-assign department via keyword mapper.
 *   4. For EXISTING tests: preserve the department if it was manually set.
 *   5. Only update price/name/isActive if they actually changed.
 *
 * Can be called:
 *   1. On server startup (auto-sync — once per day only)
 *   2. Via POST /api/tests/sync (admin-triggered — always runs)
 */
export const syncTestsFromMainServer = async () => {
  try {
    console.log('[TestSync] Fetching test catalog from main server...');
    const response = await fetchTestPrices();

    // Main server response: { data: [...], api_type: "GET_TEST_PRICE", status: "SUCCESS" }
    let tests = [];
    if (response?.data && Array.isArray(response.data)) {
      tests = response.data;
    } else if (Array.isArray(response)) {
      tests = response;
    } else if (response?.tests && Array.isArray(response.tests)) {
      tests = response.tests;
    } else {
      console.warn('[TestSync] Unexpected response structure:', JSON.stringify(response).slice(0, 200));
      return { success: false, message: 'Unexpected response format from main server.' };
    }

    if (tests.length === 0) {
      console.log('[TestSync] No tests received from main server.');
      return { success: true, synced: 0, message: 'No tests received.' };
    }

    // Filter out placeholder/blank entries
    const validTests = tests.filter((t) => {
      const name = (t.TEST_NAME || t.name || '').trim();
      return name && !['BLANK', 'Remarks'].includes(name);
    });

    console.log(`[TestSync] Received ${tests.length} tests, ${validTests.length} valid after filtering.`);

    // Fetch all existing tests from our DB (by code) for smart comparison
    const existingTests = await Test.find({}).select('code name price isActive department').lean();
    const existingMap = new Map();
    existingTests.forEach((t) => existingMap.set(String(t.code), t));

    // Track incoming test codes to identify removed tests
    const incomingCodes = new Set();

    let inserted = 0;
    let updated = 0;
    let unchanged = 0;

    // Build bulk operations — only update what actually changed
    const operations = [];

    for (const test of validTests) {
      const testName = (test.TEST_NAME || test.name || '').trim();
      const testCode = String(test.TEST_ID || test.code || test.id || '');
      const testPrice = Number(test.TEST_PRICE || test.price) || 0;
      const testStatus = (test.TEST_STATUS || test.status || '').toLowerCase();
      const isActive = testStatus === 'active';

      incomingCodes.add(testCode);

      const existing = existingMap.get(testCode);

      if (!existing) {
        // ── NEW TEST — auto-assign department ──
        const autoDepartment = mapTestToDepartment(testName);

        operations.push({
          updateOne: {
            filter: { code: testCode },
            update: {
              $set: {
                name: testName,
                code: testCode,
                price: testPrice,
                department: autoDepartment,
                category: test.category || 'General',
                description: test.description || '',
                turnaroundHours: test.turnaroundHours || 24,
                isActive,
                lastSyncedAt: new Date(),
              },
            },
            upsert: true,
          },
        });
        inserted++;
      } else {
        // ── EXISTING TEST — only update changed fields ──
        const updates = {};
        let hasChanges = false;

        if (existing.name !== testName) {
          updates.name = testName;
          hasChanges = true;
        }
        if (existing.price !== testPrice) {
          updates.price = testPrice;
          hasChanges = true;
        }
        if (existing.isActive !== isActive) {
          updates.isActive = isActive;
          hasChanges = true;
        }

        // Always update lastSyncedAt to track when we last checked
        updates.lastSyncedAt = new Date();

        if (hasChanges) {
          operations.push({
            updateOne: {
              filter: { code: testCode },
              update: { $set: updates },
            },
          });
          updated++;
        } else {
          // Only update the sync timestamp
          operations.push({
            updateOne: {
              filter: { code: testCode },
              update: { $set: { lastSyncedAt: new Date() } },
            },
          });
          unchanged++;
        }
      }
    }

    // Execute bulk operations
    if (operations.length > 0) {
      await Test.bulkWrite(operations);
    }

    const summary = {
      success: true,
      synced: validTests.length,
      inserted,
      updated,
      unchanged,
    };

    console.log(
      `[TestSync] ✅ Smart sync complete — ${inserted} new, ${updated} updated, ${unchanged} unchanged (total: ${validTests.length})`
    );

    return summary;
  } catch (error) {
    console.error('[TestSync] ❌ Failed to sync tests:', error.message);
    return { success: false, message: error.message };
  }
};

/**
 * POST /api/tests/sync  (Admin-only)
 * Triggers a manual sync of the test catalog from the main server.
 */
export const syncTests = async (req, res) => {
  try {
    const result = await syncTestsFromMainServer();

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Test catalog synchronized from main server.',
        ...result,
      });
    } else {
      res.status(502).json({
        success: false,
        message: result.message || 'Failed to sync tests from main server.',
      });
    }
  } catch (error) {
    console.error('syncTests error:', error);
    res.status(500).json({ success: false, message: 'Failed to sync tests.' });
  }
};
