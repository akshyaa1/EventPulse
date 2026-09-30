const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyOrganizedEvents
} = require('../controllers/eventController');
const { protect, requireOrganizer } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getEvents);

// Organizer specific routes (must be before /:id)
router.get('/my/organized', protect, requireOrganizer, getMyOrganizedEvents);

// Single event by id
router.get('/:id', getEventById);

// Protected routes (Organizer only)
router.post('/', protect, requireOrganizer, createEvent);
router.put('/:id', protect, requireOrganizer, updateEvent);
router.delete('/:id', protect, requireOrganizer, deleteEvent);

module.exports = router;
