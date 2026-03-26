import Booking from '../models/Booking.js';
import Room from '../models/Room.js';
import Payment from '../models/Payment.js';
import { createSystemNotification } from './notificationController.js';

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private (Admin/Receptionist)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('guest', 'name email')
      .populate({ path: 'room', populate: { path: 'type' } });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server Fault fetching booking lists', error: error.message });
  }
};

// @desc    Get logged in user bookings
// @route   GET /api/bookings/my
// @access  Private (Guest)
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ guest: req.user._id })
      .populate({ path: 'room', populate: { path: 'type' } });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server Fault fetching personal bookings', error: error.message });
  }
};

// @desc    Check-in a guest
// @route   PUT /api/bookings/:id/checkin
// @access  Private (Receptionist/Admin)
export const checkInGuest = async (req, res) => {
  try {
    const { idDocument } = req.body; 
    
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'Confirmed' && booking.status !== 'Pending') {
      return res.status(400).json({ message: 'Booking is not in a valid state for check-in' });
    }

    const room = await Room.findById(booking.room);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    room.status = 'Occupied';
    await room.save();

    booking.status = 'Checked-in';
    booking.checkInTime = new Date();
    if (req.body.idDocumentUrl) {
      booking.idDocumentUrl = req.body.idDocumentUrl;
    }
    await booking.save();

    await createSystemNotification('Booking', `Guest successfully checked into Room ${room.roomNumber}. Identity verified.`);

    res.json({ message: 'Check-in successful', booking, room });
  } catch (error) {
    res.status(500).json({ message: 'Server Error during check-in', error: error.message });
  }
};

// @desc    Check-out a guest
// @route   PUT /api/bookings/:id/checkout
// @access  Private (Receptionist/Admin)
export const checkOutGuest = async (req, res) => {
  try {
    const { paymentStatus, amountPaid, paymentMethod } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'Checked-in') {
      return res.status(400).json({ message: 'Guest is not currently checked-in' });
    }

    const payment = new Payment({
      booking: booking._id,
      amount: amountPaid,
      status: paymentStatus || 'Paid',
      method: paymentMethod || 'Cash'
    });
    await payment.save();

    const room = await Room.findById(booking.room);
    if (room) {
      room.status = 'Cleaning';
      await room.save();
    }

    booking.status = 'Checked-out';
    booking.checkOutTime = new Date();
    await booking.save();

    await createSystemNotification('System', `Room ${room?.roomNumber || 'Unknown'} checkout complete. Night Audit cleared.`);

    res.json({ message: 'Check-out successful, room queued for cleaning', booking, payment });
  } catch (error) {
    res.status(500).json({ message: 'Server Error during check-out', error: error.message });
  }
};

// @desc    Create a new booking (with precise overlap check)
// @route   POST /api/bookings
// @access  Private (Guest/Receptionist)
export const createBooking = async (req, res) => {
  try {
    const { room, checkIn, checkOut, guest } = req.body;
    
    const newCheckIn = new Date(checkIn);
    const newCheckOut = new Date(checkOut);

    if (newCheckIn >= newCheckOut) {
      return res.status(400).json({ message: 'Check-out date parameter must fall chronologically after check-in date.' });
    }

    // Check overlapping dates via MongoDB queries targeting Active reservations
    const overlappingBookings = await Booking.find({
      room,
      status: { $in: ['Confirmed', 'Pending', 'Checked-in'] },
      $or: [
        { checkIn: { $lt: newCheckOut }, checkOut: { $gt: newCheckIn } }
      ]
    });

    if (overlappingBookings.length > 0) {
      return res.status(400).json({ message: 'Room booking conflict: Room is already engaged for these target dates.' });
    }

    const roomDoc = await Room.findById(room).populate('type');
    const nights = Math.max(1, Math.ceil((newCheckOut - newCheckIn) / (1000 * 60 * 60 * 24)));
    const totalAmount = nights * (roomDoc?.type?.basePrice || 0);

    const booking = new Booking({
      guest,
      room,
      checkIn: newCheckIn,
      checkOut: newCheckOut,
      status: 'Pending',
      totalAmount
    });

    const createdBooking = await booking.save();
    
    await createSystemNotification('Booking', `New Reservation acquired. Action pending validation.`);

    res.status(201).json({ message: 'Booking algorithm deployed securely.', booking: createdBooking });

  } catch (error) {
    res.status(500).json({ message: 'Server Fault during chronological overlap validation.', error: error.message });
  }
};
