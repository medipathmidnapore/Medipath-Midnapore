import { Router } from 'express';
import { getTests, getCategories } from '../controllers/controller.test.js';

const router = Router();

// ─── Public read-only endpoints ───────────────────────────────────────────────
// The test catalog is populated exclusively by the main lab server webhook.
// No admin create/update/delete routes are exposed here.
router.get('/', getTests);
router.get('/categories', getCategories);

export default router;
