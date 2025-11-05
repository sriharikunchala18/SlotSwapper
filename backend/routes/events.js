const express = require('express');
const Event = require('../models/Event');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all events for user
router.get('/', auth, async (req, res) => {
  try {
    const events = await Event.find({ user: req.user.id });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create event
router.post('/', auth, async (req, res) => {
  const { title, description, startTime, endTime, status } = req.body;
  try {
    const event = new Event({ user: req.user.id, title, description, startTime, endTime, status });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update event
router.put('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete event
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get available events for swapping (equivalent to GET /api/swappable-slots)
router.get('/available', auth, async (req, res) => {
  try {
    const events = await Event.find({ status: 'SWAPPABLE', user: { $ne: req.user.id } });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
