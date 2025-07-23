const pool = require('../config/database');

const ensureUserExists = async (userId) => {
  if (!userId) {
    throw new Error('User ID is required');
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

module.exports = {
  ensureUserExists,
  getUserWithFlight
};