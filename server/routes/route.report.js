import { Router } from 'express';
import { lookupReport, createReport } from '../controllers/controller.report.js';

const router = Router();

// Public lookup by billNo + mobile
router.get('/lookup', lookupReport);

// Admin: create or update a report entry
router.post('/', createReport);

export default router;
