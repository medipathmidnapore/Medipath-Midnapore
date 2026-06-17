import { Router } from 'express';
import { lookupReport, verifyOtp } from '../controllers/controller.report.js';

const router = Router();

// Step 1: Lookup report by mobile + collectionDate → returns ticketId (for REPORT_READY)
router.get('/lookup', lookupReport);

// Step 2: Verify OTP → returns reportUrl on success (one-time use)
router.post('/verify-otp', verifyOtp);

export default router;
