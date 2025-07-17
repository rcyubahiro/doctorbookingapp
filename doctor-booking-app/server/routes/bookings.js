const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Doctor = require('../models/Doctor');

// Book an appointment
router.post('/', async (req, res) => {
  const { userId, doctorId, date, time } = req.body;

  try {
    // Check for double booking
    const existing = await Booking.findOne({ doctorId, date, time });
    if (existing) return res.status(400).json({ msg: 'Slot already booked' });

    const booking = new Booking({ userId, doctorId, date, time });
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ msg: 'Error booking appointment' });
  }
});

// Get bookings for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId }).populate('doctorId');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching user bookings' });
  }
});

// Get bookings for a doctor
router.get('/doctor/:doctorId', async (req, res) => {
  try {
    const bookings = await Booking.find({ doctorId: req.params.doctorId }).populate('userId');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching doctor bookings' });
  }
});
// Only logged-in users can access this
router.get('/my-bookings', auth, async (req, res) => {
  const userId = req.user.id;
  try {
    const bookings = await Booking.find({ userId }).populate('doctorId');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ msg: 'Error getting your bookings' });
  }
});
module.exports = router;
