import Test from '../models/model.test.js';
import { fetchTestPrices } from '../utils/service.mainserver.js';

/**
 * GET /api/tests
 * Serves test data from local MongoDB cache.
 * Only active tests are shown on the public frontend.
 * Supports optional ?search= and ?category= query params.
 */
export const getTests = async (req, res) => {
  try {
    const { search, category } = req.query;
    const query = { isActive: true };

    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { category: { $regex: search.trim(), $options: 'i' } },
        { code: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    if (category && category.trim()) {
      query.category = { $regex: category.trim(), $options: 'i' };
    }

    const tests = await Test.find(query).sort({ category: 1, name: 1 }).lean();

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
 * Sync test catalog from the main server (GetCharge).
 * Calls GET_TEST_PRICE → maps response → bulk-upserts into MongoDB.
 *
 * Main server returns tests with: name, id, price, status (active / deactive)
 *   - "active"   → isActive: true  (show on frontend)
 *   - "deactive" → isActive: false (hide from frontend)
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

    // Map main server field names (TEST_NAME, TEST_ID, TEST_PRICE, TEST_STATUS)
    // to our local schema (name, code, price, isActive)
    const operations = validTests.map((test) => {
      const testName = (test.TEST_NAME || test.name || '').trim();
      const testCode = test.TEST_ID || test.code || test.id || '';
      const testPrice = Number(test.TEST_PRICE || test.price) || 0;
      const testStatus = (test.TEST_STATUS || test.status || '').toLowerCase();

      return {
        updateOne: {
          filter: { code: testCode },
          update: {
            $set: {
              name: testName,
              code: testCode,
              price: testPrice,
              category: test.category || 'General',
              description: test.description || '',
              turnaroundHours: test.turnaroundHours || 24,
              // "active" → show on frontend, anything else → hide
              isActive: testStatus === 'active',
              lastSyncedAt: new Date(),
            },
          },
          upsert: true,
        },
      };
    });

    // Step 1: Mark ALL existing tests as deactive (will be re-activated by the upsert if they exist on main server)
    await Test.updateMany({}, { $set: { isActive: false } });

    // Step 2: Upsert all tests from main server — this re-activates tests that exist and adds new ones
    const result = await Test.bulkWrite(operations);

    const summary = {
      success: true,
      synced: validTests.length,
      inserted: result.upsertedCount,
      updated: result.modifiedCount,
    };

    console.log(
      `[TestSync] ✅ Synced ${validTests.length} tests — ${result.upsertedCount} inserted, ${result.modifiedCount} updated`
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
