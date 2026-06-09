import Test from '../models/model.test.js';

/**
 * GET /api/tests
 * Serves test data strictly from local MongoDB cache.
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
 * Returns distinct categories for filter UI.
 */
export const getCategories = async (req, res) => {
  try {
    const categories = await Test.distinct('category', { isActive: true });
    res.status(200).json({ success: true, data: categories.sort() });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch categories.' });
  }
};

// Admin Endpoints
export const createTest = async (req, res) => {
  try {
    const test = await Test.create(req.body);
    res.status(201).json({ success: true, data: test });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTest = async (req, res) => {
  try {
    const test = await Test.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!test) return res.status(404).json({ success: false, message: 'Test not found' });
    res.status(200).json({ success: true, data: test });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTest = async (req, res) => {
  try {
    const test = await Test.findByIdAndDelete(req.params.id);
    if (!test) return res.status(404).json({ success: false, message: 'Test not found' });
    res.status(200).json({ success: true, message: 'Test deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
