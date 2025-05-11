const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  cancelBooking,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
const { body } = require('express-validator');

// Validation middleware
const bookingValidation = [
  body('eventId').notEmpty().withMessage('Event ID is required'),
];

// Routes
router.route('/')
  .get(protect, getUserBookings)
  .post(protect, bookingValidation, createBooking);

router.route('/:id/cancel')
  .put(protect, cancelBooking);

module.exports = router; 