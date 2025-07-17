const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const auth = require('../middleware/auth');

// Add a new doctor (only admin or doctor role maybe)
router.post('/', auth, async (req, res) => {
  if (!['admin', 'doctor'].includes(req.user.role)) {
    return res.status(403).json({ msg: 'Access denied' });
  }
  const { userId, specialization, availability } = req.body;
  try {
    const doctor = new Doctor({ userId, specialization, availability });
    await doctor.save();
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ msg: 'Error creating doctor' });
  }
});

// Get all doctors (public or protected)
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find().populate('userId', 'name email');
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching doctors' });
  }
});

module.exports = router;
