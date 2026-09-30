const Registration = require('../models/Registration');
const Event = require('../models/Event');

// @desc    Register / RSVP for an event
// @route   POST /api/registrations/:eventId
// @access  Private
const registerForEvent = async (req, res) => {
  try {
    const { ticketsCount = 1, attendeePhone, notes } = req.body;
    const count = Number(ticketsCount) || 1;

    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Cannot register for a cancelled event' });
    }

    // Check if user is the organizer
    if (event.organizer.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot register for your own event' });
    }

    // Check if user already registered and active
    const existingRegistration = await Registration.findOne({
      user: req.user._id,
      event: event._id,
      status: 'confirmed'
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'You have already registered for this event. Check your bookings page.'
      });
    }

    // Check capacity
    const seatsAvailable = event.capacity - event.registeredCount;
    if (seatsAvailable < count) {
      return res.status(400).json({
        success: false,
        message: `Only ${seatsAvailable} seat(s) remaining for this event.`
      });
    }

    // Calculate total amount
    const totalAmount = event.price * count;

    // Create registration
    const registration = await Registration.create({
      user: req.user._id,
      event: event._id,
      ticketsCount: count,
      totalAmount,
      attendeeName: req.user.name,
      attendeeEmail: req.user.email,
      attendeePhone: attendeePhone || '',
      status: 'confirmed'
    });

    // Increment event registeredCount
    event.registeredCount += count;
    await event.save();

    await registration.populate('event', 'title date time location category price imageUrl');

    res.status(201).json({
      success: true,
      message: 'Registration confirmed! Your ticket is ready.',
      data: registration
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user's registered events
// @route   GET /api/registrations/my
// @access  Private
const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({
      user: req.user._id,
      status: 'confirmed'
    })
      .populate({
        path: 'event',
        populate: { path: 'organizer', select: 'name email organization' }
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: registrations.length,
      data: registrations
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel a registration
// @route   DELETE /api/registrations/:id
// @access  Private
const cancelRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    // Check ownership
    if (registration.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this registration'
      });
    }

    if (registration.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Registration is already cancelled' });
    }

    // Update status to cancelled
    registration.status = 'cancelled';
    await registration.save();

    // Decrement event registered count
    const event = await Event.findById(registration.event);
    if (event) {
      event.registeredCount = Math.max(0, event.registeredCount - registration.ticketsCount);
      await event.save();
    }

    res.json({
      success: true,
      message: 'Registration successfully cancelled'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get attendees for an event (Organizer only)
// @route   GET /api/registrations/event/:eventId
// @access  Private (Organizer)
const getEventAttendees = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Verify ownership
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view attendees for this event'
      });
    }

    const attendees = await Registration.find({
      event: event._id,
      status: 'confirmed'
    })
      .populate('user', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: attendees.length,
      data: attendees
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration,
  getEventAttendees
};
