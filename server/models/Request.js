const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  resident: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'in_progress', 'completed', 'rejected'], default: 'pending' },
  // Optionally add more fields like message, scheduledTime, etc.
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema); 