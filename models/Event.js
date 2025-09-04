import { db_runAsync, db_getAsync, db_allAsync } from '../database.js';

/**
 * Creates a new event.
 * @param {object} eventData - The event data (title, description, address, date).
 * @returns {Promise<object>} - The created event.
 */
const createEvent = async (eventData) => {
  const createdAt = new Date().toISOString();
  const result = await db_runAsync(
    `INSERT INTO events (title, description, address, date, createdAt) VALUES (?, ?, ?, ?, ?)`,
    [eventData.title, eventData.description, eventData.address, eventData.date, createdAt]
  );
  return await getEventById(result.lastID);
};

/**
 * Updates an event by ID.
 * @param {number} id - The event ID.
 * @param {object} eventData - The event data to update.
 * @returns {Promise<object|null>} - The updated event or null if not found.
 */
const updateEvent = async (id, eventData) => {
  await db_runAsync(
    `UPDATE events SET title = ?, description = ?, address = ?, date = ? WHERE id = ?`,
    [eventData.title, eventData.description, eventData.address, eventData.date, id]
  );
  return await getEventById(id);
};

/**
 * Deletes an event by ID.
 * @param {number} id - The event ID.
 * @returns {Promise<boolean>} - True if deleted, false if not found.
 */
const deleteEvent = async (id) => {
  const result = await db_runAsync(`DELETE FROM events WHERE id = ?`, [id]);
  return result.changes > 0;
};

/**
 * Gets a single event by ID.
 * @param {number} id - The event ID.
 * @returns {Promise<object|null>} - The event or null if not found.
 */
const getEventById = async (id) => {
  const row = await db_getAsync(`SELECT * FROM events WHERE id = ?`, [id]);
  return row || null;
};

/**
 * Gets all events.
 * @returns {Promise<Array>} - Array of event objects.
 */
const getAllEvents = async () => {
  const rows = await db_allAsync(`SELECT * FROM events ORDER BY date ASC`);
  return rows;
};

export {
  createEvent,
  updateEvent,
  deleteEvent,
  getEventById,
  getAllEvents
};
