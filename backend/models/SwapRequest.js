const mongoose = require('mongoose');

const swapRequestSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requestedEvent: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  offeredEvent: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  status: { type: String, enum: ['PENDING', 'ACCEPTED', 'REJECTED'], default: 'PENDING' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SwapRequest', swapRequestSchema);
