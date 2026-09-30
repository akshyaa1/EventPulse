const Event = require('../models/Event');
const Registration = require('../models/Registration');

// @desc    Get all events with search and filters
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const { search, category, status } = req.query;
    let query = {};

    // Search by title or description or tags
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by status (default to upcoming & ongoing unless specified)
    if (status && status !== 'All') {
      query.status = status;
    }

    const events = await Event.find(query)
      .populate('organizer', 'name email organization avatar')
      .sort({ date: 1 });

    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email organization bio avatar');

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private (Organizer)
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      date,
      time,
      locationType,
      location,
      capacity,
      price,
      imageUrl,
      tags
    } = req.body;

    const event = await Event.create({
      title,
      description,
      category,
      date,
      time,
      locationType: locationType || 'venue',
      location,
      capacity: Number(capacity),
      price: price ? Number(price) : 0,
      imageUrl: imageUrl || undefined,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
      organizer: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private (Organizer owner)
const updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Verify ownership
    if (
      event.organizer.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event'
      });
    }

    if (req.body.tags && typeof req.body.tags === 'string') {
      req.body.tags = req.body.tags.split(',').map(t => t.trim());
    }

    // Prevent capacity from being lower than currently registered attendees
    if (req.body.capacity && Number(req.body.capacity) < event.registeredCount) {
      return res.status(400).json({
        success: false,
        message: `Capacity cannot be less than current registrations (${event.registeredCount})`
      });
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('organizer', 'name email organization');

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: event
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private (Organizer owner)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Verify ownership
    if (
      event.organizer.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event'
      });
    }

    // Delete associated registrations
    await Registration.deleteMany({ event: event._id });
    await event.deleteOne();

    res.json({
      success: true,
      message: 'Event and associated registrations deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get events organized by logged-in user
// @route   GET /api/events/my/organized
// @access  Private (Organizer)
const getMyOrganizedEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user._id }).sort({ createdAt: -1 });

    // Calculate aggregated stats
    const totalEvents = events.length;
    const totalRegistrations = events.reduce((sum, e) => sum + e.registeredCount, 0);
    const totalRevenue = events.reduce((sum, e) => sum + (e.registeredCount * e.price), 0);
    const totalCapacity = events.reduce((sum, e) => sum + e.capacity, 0);

    res.json({
      success: true,
      stats: {
        totalEvents,
        totalRegistrations,
        totalRevenue,
        totalCapacity,
        averageFillRate: totalCapacity > 0 ? Math.round((totalRegistrations / totalCapacity) * 100) : 0
      },
      data: events
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyOrganizedEvents
};
