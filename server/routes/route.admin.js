import express from 'express';
import { loginAdmin, getAllBookings } from '../controllers/controller.admin.js';
import { verifyAdmin } from '../middleware/middleware.auth.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/bookings', verifyAdmin, getAllBookings);

export default router;
