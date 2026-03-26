import express from 'express';
import { checkInGuest, checkOutGuest, createBooking, getAllBookings, getMyBookings } from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getAllBookings);
router.get('/my', protect, getMyBookings);
router.post('/', protect, createBooking);
router.put('/:id/checkin', protect, checkInGuest);
router.put('/:id/checkout', protect, checkOutGuest);

export default router;
