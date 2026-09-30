const express = require('express');
const router = express.Router();
const {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration,
  getEventAttendees
} = require('../controllers/registrationController');
const { protect, requireOrganizer } = require('../middleware/authMiddleware');

// Get current user's registrations
router.get('/my', protect, getMyRegistrations);

// Register for an event
router.post('/:eventId', protect, registerForEvent);

// Cancel a registration
router.delete('/:id', protect, cancelRegistration);

// Get event attendees (Organizer only)
router.get('/event/:eventId', protect, requireOrganizer, getEventAttendees);

module.exports = router;
