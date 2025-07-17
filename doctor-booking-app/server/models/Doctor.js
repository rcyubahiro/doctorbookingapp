const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  specialization: { type: String, required: true },
  availability: [{
    date: String,  // Format: YYYY-MM-DD
    slots: [String] // e.g., ["10:00", "11:00", "14:00"]
  }]
}, { timestamps: true });

module.exports = mongoose.model('Doctor', DoctorSchema);
