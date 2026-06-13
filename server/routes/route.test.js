import { Router } from 'express';
import { getTests, getCategories, syncTests } from '../controllers/controller.test.js';
import { verifyAdmin } from '../middleware/middleware.auth.js';

const router = Router();

// ─── Public read-only endpoints ───────────────────────────────────────────────
// The test catalog is populated from the main server via GET_TEST_PRICE.
// Only active tests are returned.
router.get('/', getTests);
router.get('/categories', getCategories);

// ─── Admin endpoint ───────────────────────────────────────────────────────────
// Manually trigger a test catalog sync from the main server
router.post('/sync', verifyAdmin, syncTests);

export default router;
