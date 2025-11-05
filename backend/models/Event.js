const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { type: String, enum: ['BUSY', 'SWAPPABLE', 'SWAP_PENDING'], default: 'BUSY' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Event', eventSchema);
