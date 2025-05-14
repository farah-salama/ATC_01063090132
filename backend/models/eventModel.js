const mongoose = require('mongoose')

const CATEGORIES = [
  'Arts & Entertainment',
  'Sports & Outdoors',
  'Learning & Career',
  'Community & Causes'
];

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: [String],
    required: true,
    validate: {
      validator: function(categories) {
        return categories.every(cat => CATEGORIES.includes(cat));
      },
      message: props => `${props.value} contains invalid categories. Valid categories are: ${CATEGORIES.join(', ')}`
    }
  },
  date: {
    type: Date,
    required: true
  },
  venue: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Event', eventSchema)