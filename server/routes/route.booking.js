import { Router } from 'express';
import { createBooking, getBooking } from '../controllers/controller.booking.js';

const router = Router();

router.post('/', createBooking);
router.get('/:id', getBooking);

export default router;
