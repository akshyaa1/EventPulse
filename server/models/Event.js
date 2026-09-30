const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an event title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide an event description'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Please specify an event category'],
      enum: ['Tech', 'Music', 'Business', 'Design', 'Workshops', 'Social', 'Other'],
      default: 'Tech'
    },
    date: {
      type: Date,
      required: [true, 'Please provide the event date']
    },
    time: {
      type: String,
      required: [true, 'Please provide the event time (e.g. 10:00 AM)']
    },
    locationType: {
      type: String,
      enum: ['venue', 'online'],
      default: 'venue'
    },
    location: {
      type: String,
      required: [true, 'Please provide the venue address or online link'],
      trim: true
    },
    capacity: {
      type: Number,
      required: [true, 'Please specify the maximum attendee capacity'],
      min: [1, 'Capacity must be at least 1']
    },
    registeredCount: {
      type: Number,
      default: 0,
      min: 0
    },
    price: {
      type: Number,
      default: 0,
      min: [0, 'Price cannot be negative']
    },
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80'
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming'
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ]
  },
  {
    timestamps: true
  }
);

// Virtual for available seats
eventSchema.virtual('seatsLeft').get(function () {
  return Math.max(0, this.capacity - this.registeredCount);
});

eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);
