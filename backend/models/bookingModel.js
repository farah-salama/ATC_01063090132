const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled'],
    default: 'confirmed'
  }
}, { timestamps: true })

module.exports = mongoose.model('Booking', bookingSchema)