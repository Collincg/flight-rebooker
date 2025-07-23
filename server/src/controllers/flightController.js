const pool = require('../config/database');
const { ensureUserExists, getUserWithFlight } = require('../utils/userHelpers');
const { asyncHandler } = require('../middleware/errorHandler');

const getAllFlights = asyncHandler(async (req, res) => {
  const result = await pool.query('SELECT * FROM flights ORDER BY departure_time');
  
  res.json({
    success: true,
    data: result.rows,
    count: result.rows.length
  });
});

const getFilteredFlights = asyncHandler(async (req, res) => {
  const { origin, destination, departureTime, airline, layovers } = req.query;

  let query = 'SELECT * FROM flights WHERE 1=1';
  const queryParams = [];

  if (origin) {
    queryParams.push(origin.toLowerCase());
    query += ` AND LOWER(origin) = $${queryParams.length}`;
  }
  
  if (destination) {
    queryParams.push(destination.toLowerCase());
    query += ` AND LOWER(destination) = $${queryParams.length}`;
  }

  if (departureTime) {
    queryParams.push(departureTime);
    query += ` AND departure_time::TEXT LIKE $${queryParams.length} || '%'`;
  }

  if (airline) {
    queryParams.push(airline.toLowerCase());
    query += ` AND LOWER(airline) = $${queryParams.length}`;
  }

  if (layovers !== undefined) {
    queryParams.push(Number(layovers));
    query += ` AND layovers <= $${queryParams.length}`;
  }

  query += ' ORDER BY departure_time';

  const result = await pool.query(query, queryParams);

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'No flights found matching the criteria'
    });
  }

  res.json({
    success: true,
    data: result.rows,
    count: result.rows.length
  });
});

const getUserFlight = asyncHandler(async (req, res) => {
  const { userId } = req.query;

  await ensureUserExists(userId);
  const bookedFlight = await getUserWithFlight(userId);

  res.json({
    success: true,
    data: {
      userId,
      bookedFlight: bookedFlight || null
    }
  });
});

const getUserFlightStatus = asyncHandler(async (req, res) => {
  const { userId } = req.query;

  await ensureUserExists(userId);
  const flight = await getUserWithFlight(userId);

  if (!flight || !flight.id) {
    return res.status(404).json({
      success: false,
      error: 'No booked flight found for the user'
    });
  }

  const statusMessages = {
    'on time': 'Your flight is on time',
    'delayed': 'Your flight is delayed',
    'canceled': 'Your flight is canceled'
  };

  const message = statusMessages[flight.status] || 'Flight status is unknown';

  res.json({
    success: true,
    data: {
      message,
      bookedFlight: flight,
      status: flight.status
    }
  });
});

const getRebookingOptions = asyncHandler(async (req, res) => {
  const { userId } = req.query;

  await ensureUserExists(userId);
  const bookedFlight = await getUserWithFlight(userId);
  
  if (!bookedFlight || !bookedFlight.id) {
    return res.status(404).json({
      success: false,
      error: 'No booked flight found for the user'
    });
  }

  if (!bookedFlight.departure_time) {
    return res.status(500).json({
      success: false,
      error: 'Invalid departure time for the booked flight'
    });
  }

  const departureTime = new Date(bookedFlight.departure_time);

  const result = await pool.query(
    `SELECT * FROM flights
     WHERE id != $1
     AND origin = $2
     AND destination = $3
     AND status != 'canceled'
     AND ABS(EXTRACT(EPOCH FROM (departure_time - $4)) / 3600) <= 24
     ORDER BY departure_time`,
     [bookedFlight.id, bookedFlight.origin, bookedFlight.destination, departureTime]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'No rebooking options available'
    });
  }

  res.json({
    success: true,
    data: result.rows,
    count: result.rows.length
  });
});

const rebookFlight = asyncHandler(async (req, res) => {
  const { userId, newFlightId } = req.body;

  await ensureUserExists(userId);

  const newFlightResult = await pool.query('SELECT * FROM flights WHERE id = $1', [newFlightId]);
  if (newFlightResult.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'New flight not found'
    });
  }

  const newFlight = newFlightResult.rows[0];

  if (newFlight.status === 'canceled') {
    return res.status(400).json({
      success: false,
      error: 'Cannot rebook to a canceled flight'
    });
  }

  await pool.query(`
    INSERT INTO user_flights (user_id, booked_flight_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id) DO UPDATE SET booked_flight_id = EXCLUDED.booked_flight_id
  `, [userId, newFlightId]);

  res.json({
    success: true,
    message: 'Flight rebooked successfully',
    data: {
      newFlight
    }
  });
});

const cancelFlight = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  await ensureUserExists(userId);

  await pool.query(`
    UPDATE user_flights SET booked_flight_id = NULL WHERE user_id = $1
  `, [userId]);

  res.json({
    success: true,
    message: 'Booking cancelled successfully',
    data: {
      userId
    }
  });
});

module.exports = {
  getAllFlights,
  getFilteredFlights,
  getUserFlight,
  getUserFlightStatus,
  getRebookingOptions,
  rebookFlight,
  cancelFlight
};