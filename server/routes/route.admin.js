import express from 'express';
import { loginAdmin, getAllBookings, syncBookingToMain } from '../controllers/controller.admin.js';
import { verifyAdmin } from '../middleware/middleware.auth.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/bookings', verifyAdmin, getAllBookings);
router.post('/bookings/:id/sync', verifyAdmin, syncBookingToMain);

export default router;
