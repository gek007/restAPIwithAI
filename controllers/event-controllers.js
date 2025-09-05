import {
    createEvent,
    updateEvent,
    deleteEvent,
    getEventById,
    getAllEvents
  } from '../models/Event.js';
  
  import { 
    createRegistration, 
    deleteRegistration, 
    isUserRegisteredForEvent 
  } from '../models/Registration.js';
  
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
      if (!title || !address || !date) {
        console.log('❌ Missing required fields');
        return res.status(400).json({
          success: false,
          message: 'Title, address, and date are required'
        });
      }

      const user_id = req.user && req.user.id ? req.user.id : null;
      const newEvent = await createEvent({ title, description, address, date, user_id });

      console.log('✅ Event created successfully:', newEvent.id);
      return res.status(201).json({
        success: true,
        message: 'Event created successfully',
        event: newEvent
      });
    } catch (error) {
      console.error('Create event error:', error);
      return res.status(500).json({
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
  
  
// Update an event by ID
const updateEventController = async (req, res) => {
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

    // Fetch the event to check ownership
    const event = await getEventById(parseInt(id, 10));
    if (!event) {
      console.log('❌ Event not found for update with ID:', id);
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if the user is the owner of the event
    if (!req.user || !req.user.id || event.user_id !== req.user.id) {
      console.log('❌ User not authorized to update this event');
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this event'
      });
    }

    const updatedEvent = await updateEvent(parseInt(id, 10), { title, description, address, date });
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
  
      // Fetch the event to check ownership
      const event = await getEventById(parseInt(id, 10));
      if (!event) {
        console.log('❌ Event not found for deletion with ID:', id);
        return res.status(404).json({
          success: false,
          message: 'Event not found'
        });
      }
  
      // Check if the user is the owner of the event
      if (!req.user || !req.user.id || event.user_id !== req.user.id) {
        console.log('❌ User not authorized to delete this event');
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to delete this event'
        });
      }
  
      const deleted = await deleteEvent(parseInt(id, 10));
      if (!deleted) {
        // This should not happen, but handle just in case
        console.log('❌ Event not found for deletion with ID:', id);
        return res.status(404).json({
          success: false,
          message: 'Event not found'
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Event deleted successfully'
      });

    } 
      catch (error) {
      console.error('Delete event error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };
  
  // Register a user for an event
  
  const registerEventController = async (req, res) => {
    console.log('📝 registerEventController called for event ID:', req.params.id);
    try {
      const { id } = req.params;
      const userId = req.user && req.user.id ? req.user.id : null;
  
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }
  
      // Check if user is already registered in registrations table
      const alreadyRegistered = await isUserRegisteredForEvent(userId, parseInt(id, 10));
      if (alreadyRegistered) {
        return res.status(400).json({
          success: false,
          message: 'User already registered for this event'
        });
      }
  
      // Register user for event in registrations table
      await createRegistration(userId, parseInt(id, 10));
  
      res.status(200).json({
        success: true,
        message: 'User registered for event successfully'
      });
    } catch (error) {
      console.error('Register event error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };
  
  const unregisterEventController = async (req, res) => {
    console.log('📝 unregisterEventController called for event ID:', req.params.id);
    try {
      const { id } = req.params;
      const userId = req.user && req.user.id ? req.user.id : null;
  
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }
  
      // Check if user is registered for the event
      const isRegistered = await isUserRegisteredForEvent(userId, parseInt(id, 10));
      if (!isRegistered) {
        return res.status(400).json({
          success: false,
          message: 'User is not registered for this event'
        });
      }
  
      // Remove the registration from the registrations table
      const deleted = await deleteRegistration(userId, parseInt(id, 10));
      if (!deleted) {
        return res.status(500).json({
          success: false,
          message: 'Failed to unregister user from event'
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'User unregistered from event successfully'
      });
    } catch (error) {
      console.error('Unregister event error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };
  
  
  export {
    registerEventController,
    unregisterEventController,
    createEventController,
    getAllEventsController,
    getEventByIdController,
    updateEventController,
    deleteEventController
  };
  