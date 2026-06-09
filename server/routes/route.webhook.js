import { Router } from 'express';
import { syncTests } from '../controllers/controller.webhook.js';
import validateWebhookSecret from '../middleware/middleware.webhook.js';

const router = Router();

// POST /api/webhook/lab-sync
router.post('/lab-sync', validateWebhookSecret, syncTests);

export default router;
