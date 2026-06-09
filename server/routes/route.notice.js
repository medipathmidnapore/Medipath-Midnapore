import express from 'express';
import { getActiveNotices, getAllNotices, createNotice, deleteNotice, toggleNoticeStatus } from '../controllers/controller.notice.js';
import { verifyAdmin } from '../middleware/middleware.auth.js';

const router = express.Router();

// Public route
router.get('/active', getActiveNotices);

// Admin routes
router.get('/', verifyAdmin, getAllNotices);
router.post('/', verifyAdmin, createNotice);
router.delete('/:id', verifyAdmin, deleteNotice);
router.put('/:id/toggle', verifyAdmin, toggleNoticeStatus);

export default router;
