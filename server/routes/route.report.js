import { Router } from 'express';
import { lookupReport } from '../controllers/controller.report.js';

const router = Router();

// Public lookup by billNo + mobile
router.get('/lookup', lookupReport);

export default router;
