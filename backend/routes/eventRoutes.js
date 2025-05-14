const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getEvents,
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');
const Event = require('../models/eventModel');

// Get top booked events
router.get('/top-booked', async (req, res) => {
  try {
    const events = await Event.aggregate([
      {
        $lookup: {
          from: 'bookings',
          localField: '_id',
          foreignField: 'event',
          as: 'bookings'
        }
      },
      {
        $addFields: {
          bookingCount: { $size: '$bookings' }
        }
      },
      {
        $sort: { bookingCount: -1 }
      },
      {
        $limit: 3
      }
    ]);
    res.json(events);
  } catch (error) {
    console.error('Error fetching top booked events:', error);
    res.status(500).json({ message: 'Error fetching top booked events' });
  }
});

// Use controller functions for all other routes
router.get('/', getEvents);
router.post('/', protect, admin, createEvent);
router.get('/:id', getEventById);
router.put('/:id', protect, admin, updateEvent);
router.delete('/:id', protect, admin, deleteEvent);

module.exports = router; 