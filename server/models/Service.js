const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  contactInfo: { type: String, required: true },
  // Optionally add more fields like price, location, etc.
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema); 