const express = require('express');
const router = express.Router();
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');
const { protect, admin } = require('../middleware/auth');
const { body } = require('express-validator');

// Validation middleware
const eventValidation = [
  body('name').notEmpty().withMessage('Event name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('venue').notEmpty().withMessage('Venue is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('image').notEmpty().withMessage('Image URL is required'),
];

// Routes
router.route('/')
  .get(getEvents)
  .post(protect, admin, eventValidation, createEvent);

router.route('/:id')
  .get(getEventById)
  .put(protect, admin, eventValidation, updateEvent)
  .delete(protect, admin, deleteEvent);

module.exports = router; 