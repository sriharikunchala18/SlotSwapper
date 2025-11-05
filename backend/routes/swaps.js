const express = require('express');
const SwapRequest = require('../models/SwapRequest');
const Event = require('../models/Event');
const auth = require('../middleware/auth');

const router = express.Router();

// Get swap requests for user
router.get('/', auth, async (req, res) => {
  try {
    const swaps = await SwapRequest.find({
      $or: [{ requester: req.user.id }, { requestedEvent: { $in: await Event.find({ user: req.user.id }).select('_id') } }]
    }).populate('requester requestedEvent offeredEvent');
    res.json(swaps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create swap request (equivalent to POST /api/swap-request)
router.post('/', auth, async (req, res) => {
  const { requestedEventId, offeredEventId } = req.body;
  try {
    const requestedEventDoc = await Event.findById(requestedEventId);
    if (!requestedEventDoc || requestedEventDoc.status !== 'SWAPPABLE') return res.status(400).json({ message: 'Event not available for swap' });

    const offeredEventDoc = await Event.findOne({ _id: offeredEventId, user: req.user.id });
    if (!offeredEventDoc || offeredEventDoc.status !== 'SWAPPABLE') return res.status(400).json({ message: 'Offered event not available' });

    // Set both events to SWAP_PENDING
    requestedEventDoc.status = 'SWAP_PENDING';
    offeredEventDoc.status = 'SWAP_PENDING';
    await requestedEventDoc.save();
    await offeredEventDoc.save();

    const swap = new SwapRequest({
      requester: req.user.id,
      requestedEvent: requestedEventId,
      offeredEvent: offeredEventId,
    });
    await swap.save();
    res.status(201).json(swap);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Accept/Reject swap (equivalent to POST /api/swap-response)
router.put('/:id', auth, async (req, res) => {
  const { status } = req.body;
  try {
    const swap = await SwapRequest.findById(req.params.id).populate('requestedEvent offeredEvent');
    if (!swap) return res.status(404).json({ message: 'Swap not found' });

    if (swap.requestedEvent.user.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    swap.status = status;
    if (status === 'ACCEPTED') {
      // Swap the events
      const tempUser = swap.requestedEvent.user;
      swap.requestedEvent.user = swap.offeredEvent.user;
      swap.offeredEvent.user = tempUser;
      // Set both events back to BUSY
      swap.requestedEvent.status = 'BUSY';
      swap.offeredEvent.status = 'BUSY';
      await swap.requestedEvent.save();
      await swap.offeredEvent.save();

      // Real-time notification to requester
      const io = req.app.get('io');
      io.to(swap.requester.toString()).emit('swapAccepted', {
        message: 'Your swap request has been accepted!',
        swap: swap
      });
    } else if (status === 'REJECTED') {
      // Reset both events to SWAPPABLE
      swap.requestedEvent.status = 'SWAPPABLE';
      swap.offeredEvent.status = 'SWAPPABLE';
      await swap.requestedEvent.save();
      await swap.offeredEvent.save();

      // Real-time notification to requester
      const io = req.app.get('io');
      io.to(swap.requester.toString()).emit('swapRejected', {
        message: 'Your swap request has been rejected.',
        swap: swap
      });
    }
    await swap.save();
    res.json(swap);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
