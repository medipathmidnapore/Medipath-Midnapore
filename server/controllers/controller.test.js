import Test from '../models/model.test.js';

/**
 * GET /api/tests
 * Serves test data strictly from local MongoDB cache (populated by webhook from main server).
 * Supports optional ?search= and ?category= query params.
 *
 * NOTE: Tests are READ-ONLY from this proxy server.
 *       All test creation, updates, and deletions are handled exclusively
 *       by the main server via the /api/webhook/lab-sync endpoint.
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

// ─── All write operations below are intentionally DISABLED ───────────────────
// Tests are managed exclusively by the main lab server via webhook (POST /api/webhook/lab-sync).
// Do NOT expose these endpoints in the routes.

export const createTest = async (req, res) => {
  res.status(403).json({
    success: false,
    message: 'Test catalog is managed by the main lab server via webhook sync. Manual creation is not allowed.',
  });
};

export const updateTest = async (req, res) => {
  res.status(403).json({
    success: false,
    message: 'Test catalog is managed by the main lab server via webhook sync. Manual updates are not allowed.',
  });
};

export const deleteTest = async (req, res) => {
  res.status(403).json({
    success: false,
    message: 'Test catalog is managed by the main lab server via webhook sync. Manual deletion is not allowed.',
  });
};
