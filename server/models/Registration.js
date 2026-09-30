const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
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
    ticketsCount: {
      type: Number,
      default: 1,
      min: [1, 'Must book at least 1 ticket']
    },
    totalAmount: {
      type: Number,
      default: 0
    },
    attendeeName: {
      type: String,
      required: true,
      trim: true
    },
    attendeeEmail: {
      type: String,
      required: true,
      trim: true
    },
    attendeePhone: {
      type: String,
      default: '',
      trim: true
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed'
    },
    ticketCode: {
      type: String,
      default: () => 'EP-' + Math.random().toString(36).substring(2, 9).toUpperCase()
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate active registration for the same user and event
registrationSchema.index({ user: 1, event: 1, status: 1 });

module.exports = mongoose.model('Registration', registrationSchema);
