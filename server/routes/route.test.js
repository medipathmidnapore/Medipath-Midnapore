import { Router } from 'express';
import { getTests, getCategories, createTest, updateTest, deleteTest } from '../controllers/controller.test.js';
import { verifyAdmin } from '../middleware/middleware.auth.js';

const router = Router();

router.get('/', getTests);
router.get('/categories', getCategories);

// Admin Routes
router.post('/', verifyAdmin, createTest);
router.put('/:id', verifyAdmin, updateTest);
router.delete('/:id', verifyAdmin, deleteTest);

export default router;
