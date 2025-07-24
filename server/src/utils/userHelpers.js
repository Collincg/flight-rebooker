const pool = require('../config/database');

const isValidUUID = (uuid) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

const ensureUserExists = async (userId) => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  if (!isValidUUID(userId)) {
    throw new Error('Invalid user ID format - must be a valid UUID');
  }

  try {
    await pool.query(`
      INSERT INTO user_flights (user_id)
      VALUES ($1)
      ON CONFLICT (user_id) DO NOTHING
    `, [userId]);
  } catch (error) {
    console.error('Error ensuring user exists:', error);
    throw new Error('Failed to create user record');
  }
};

const getUserWithFlight = async (userId) => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  if (!isValidUUID(userId)) {
    throw new Error('Invalid user ID format - must be a valid UUID');
  }

  try {
    const result = await pool.query(`
      SELECT f.* 
      FROM user_flights uf
      LEFT JOIN flights f ON uf.booked_flight_id = f.id
      WHERE uf.user_id = $1
    `, [userId]);

    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching user flight:', error);
    throw new Error('Failed to fetch user flight data');
  }
};

const clearUserBooking = async (userId) => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  if (!isValidUUID(userId)) {
    throw new Error('Invalid user ID format - must be a valid UUID');
  }

  try {
    await pool.query(`
      UPDATE user_flights 
      SET booked_flight_id = NULL 
      WHERE user_id = $1
    `, [userId]);
  } catch (error) {
    console.error('Error clearing user booking:', error);
    throw new Error('Failed to clear user booking');
  }
};

module.exports = {
  ensureUserExists,
  getUserWithFlight,
  clearUserBooking,
  isValidUUID
};