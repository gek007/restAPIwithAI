import { db_runAsync, db_getAsync, db_allAsync } from '../database.js';

/**
 * Checks if a user is registered for an event.
 * @param {number} userId - The user ID.
 * @param {number} eventId - The event ID.
 * @returns {Promise<boolean>} - True if registered, false otherwise.
 */
const isUserRegisteredForEvent = async (userId, eventId) => {
    const row = await db_getAsync(
      `SELECT 1 FROM registrations WHERE user_id = ? AND event_id = ?`,
      [userId, eventId]
    );
    return !!row;
  };
  
  /**
   * Creates a registration for a user to an event.
   * @param {number} userId - The user ID.
   * @param {number} eventId - The event ID.
   * @returns {Promise<object>} - The registration object.
   */
  const createRegistration = async (userId, eventId) => {
    const result = await db_runAsync(
      `INSERT INTO registrations (user_id, event_id) VALUES (?, ?)`,
      [userId, eventId]
    );
    return {
      id: result.lastID,
      user_id: userId,
      event_id: eventId
    };
  };
  
  /**
   * Deletes a registration for a user from an event.
   * @param {number} userId - The user ID.
   * @param {number} eventId - The event ID.
   * @returns {Promise<boolean>} - True if deleted, false otherwise.
   */
  const deleteRegistration = async (userId, eventId) => {
    const result = await db_runAsync(
      `DELETE FROM registrations WHERE user_id = ? AND event_id = ?`,
      [userId, eventId]
    );
    return result.changes > 0;
  };
  
  export {
    isUserRegisteredForEvent,
    createRegistration,
    deleteRegistration
  };
  