const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  date: { type: String, required: true },    // YYYY-MM-DD
  time: { type: String, required: true },    // e.g., "10:00"
  status: { type: String, enum: ['booked', 'completed', 'cancelled'], default: 'booked' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
