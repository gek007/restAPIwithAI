import {
  createEvent,
  updateEvent,
  deleteEvent,
  getEventById,
  getAllEvents
} from '../models/Event.js';

// Create a new event
const createEventController = async (req, res) => {
  console.log('🚀 createEventController called');
  console.log('📝 Request body:', req.body);

  if (!req.body) {
    console.log('❌ No request body provided');
    return res.status(400).json({
      success: false,
      message: 'Request body is required'
    });
  }

  try {
    const { title, description, address, date } = req.body;

    // Validate required fields
    if (!title || !address || !date) {
      console.log('❌ Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Title, address, and date are required'
      });
    }

    const newEvent = await createEvent({ title, description, address, date });

    console.log('✅ Event created successfully:', newEvent.id);
    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event: newEvent
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all events
const getAllEventsController = async (req, res) => {
  console.log('📋 getAllEventsController called');
  try {
    const events = await getAllEvents();
    res.status(200).json({
      success: true,
      message: 'Events retrieved successfully',
      events,
      count: events.length
    });
  } catch (error) {
    console.error('Get all events error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get event by ID
const getEventByIdController = async (req, res) => {
  console.log('🔍 getEventByIdController called with ID:', req.params.id);
  try {
    const { id } = req.params;
    const event = await getEventById(parseInt(id, 10));
    if (!event) {
      console.log('❌ Event not found with ID:', id);
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Event retrieved successfully',
      event
    });
  } catch (error) {
    console.error('Get event by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update (edit) an event by ID
const updateEventController = async (req, res) => {
  console.log('✏️ updateEventController called with ID:', req.params.id);
  if (!req.body) {
    console.log('❌ No request body provided');
    return res.status(400).json({
      success: false,
      message: 'Request body is required'
    });
  }
  try {
    const { id } = req.params;
    const { title, description, address, date } = req.body;

    // Validate required fields
    if (!title || !address || !date) {
      console.log('❌ Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Title, address, and date are required'
      });
    }

    const updatedEvent = await updateEvent(parseInt(id, 10), { title, description, address, date });
    if (!updatedEvent) {
      console.log('❌ Event not found for update with ID:', id);
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      event: updatedEvent
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete an event by ID
const deleteEventController = async (req, res) => {
  console.log('🗑️ deleteEventController called with ID:', req.params.id);
  try {
    const { id } = req.params;
    const deleted = await deleteEvent(parseInt(id, 10));
    if (!deleted) {
      console.log('❌ Event not found for deletion with ID:', id);
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export {
  createEventController,
  getAllEventsController,
  getEventByIdController,
  updateEventController,
  deleteEventController
};
