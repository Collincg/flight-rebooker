// This is a simple Express router for handling flight data.
// It imports the necessary modules, loads flight data from a JSON file, and defines a route to get all flights.
// It uses Express to create a router and exports it for use in other parts of the application.

// Contains route handlers for flight-related endpoints. Defines how our application
// responds to requests for flight data.

// import required modules
const express = require('express'); // Import the express module to create a web server and define routes.
const router = express.Router(); //creates a modular router object to define routes for the /api/flights endpoint.
// const flights = require('../data/flights.json'); // Load flight data from a JSON file. This file contains an array of flight objects with various properties.
const req = require('express/lib/request'); // Import the request object from express to handle incoming requests.



// Database connection code
require('dotenv').config(); // Load environment variables from a .env file

const { Pool } = require('pg'); // Import the pg module to connect to PostgreSQL database

const pool = new Pool({
  // // Database connection configuration for local development
  // user: process.env.DB_USER, // Database username from environment variables
  // host: process.env.DB_HOST, // Database host from environment variables
  // database: process.env.DB_NAME, // Database name from environment variables
  // password: process.env.DB_PASSWORD || null, // Use null if password is not provided
  // port: process.env.DB_PORT, // Database port from environment variables

  // connection configuration for Railway
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // required for Railway deployment
  }
})

// This will test the connection to the database and log the current timestamp if successful.
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Database connected successfully:', res.rows[0]);
  }
});

// Hard Code a simulated user with a booked filght
let userFlight = {
  userId: 'user123',
  bookedFlightId: "AA123", // hardcoded for now
};

// Define a route to get all flights
// This route handles GET requests to the root URL of the flights API (e.g., /api/flights)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM flights'); // Query the database to get all flights
    res.json(result.rows); // Return the flight data as a JSON response
  }
  catch (error) {
    console.error('Error fetching flights:', error); // Log any errors that occur during the query
    res.status(500).json({ error: 'Internal server error' }); // Return a 500 error if something goes wrong
  }
});


// Route to get the user's current booked flight
// This route handles GET requests to /api/flights/user-flight
router.get('/user-flight', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM flights WHERE id = $1', [userFlight.bookedFlightId]); // Query the database to get the user's booked flight
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No booked flight found for the user' }); // Return a 404 error if no flight is found
    }

    res.json({ userId: userFlight.userId, bookedFlight: result.rows[0] }); // Return the user's booked flight as a JSON response
  }
  catch (err) {
    console.error('Error fetching user flight:', err); // Log any errors that occur during the query
    res.status(500).json({ error: 'Internal server error' }); // Return a 500 error if something goes wrong
  }
});


// Route to monitor the status of the user's booked flight
router.get('/user-flight/status', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM flights WHERE id = $1', [userFlight.bookedFlightId]); // Query the database to get the user's booked flight
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No booked flight found for the user' }); 
    }

    const bookedFlight = result.rows[0]; // Get the booked flight from the query result

    if (bookedFlight.status === 'on time') {
      return res.json({ message: 'Your flight is on time', bookedFlight });
    }
    else if (bookedFlight.status === 'delayed') {
      return res.json({ message: 'Your flight is delayed', bookedFlight });
    }
    else if (bookedFlight.status === 'canceled') {
      return res.json({ message: 'Your flight is canceled', bookedFlight });
    }
    else {
      return res.status(400).json({ error: 'Flight status is unknown' });
    }
  }
  catch (err) {
    console.error('Error fetching flight status: ', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Define a route to filter flights by destination, date, or airline
// This route handles GET requests to /api/flights/filter
/**Extracts query parameters from the request (req.query).
 * Filters the flights array based on the provided parameters.
 * Returns the filtered flights as a JSON response.
 */
router.get('/filter', async (req, res) => {
  const { origin, destination, departureTime, airline, layovers } = req.query; // Extract query parameters from the request

  try {
    // Build the base query
    let query = 'SELECT * FROM flights WHERE 1=1'; // "1=1" is a placeholder to simplify adding conditions
    const queryParams = [];

    // Add filters dynamically based on the query parameters
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
      query += ` AND departure_time::TEXT LIKE $${queryParams.length} || '%'`; // Match the start of the date string. This works if departureTime is passed as a date string like "2025-05-07"
    }

    if (airline) {
      queryParams.push(airline.toLowerCase());
      query += ` AND LOWER(airline) = $${queryParams.length}`;
    }

    if (layovers !== undefined) {
      queryParams.push(Number(layovers));
      query += ` AND layovers <= $${queryParams.length}`;
    }

    // Execute the query
    const result = await pool.query(query, queryParams);

    // Check if no flights match the filter criteria
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No flights found matching the criteria' });
    }

    // Return the filtered flights
    res.json(result.rows);
  } catch (err) {
    console.error('Error filtering flights:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Route to get rebooking options for the user's booked flight
// This route handles GET requests to /api/flights/rebooking-options
router.get('/user-flight/rebooking-options', async (req, res) => {
  
  try {
    const bookedFlightResult = await pool.query('SELECT * FROM flights WHERE id = $1', [userFlight.bookedFlightId]);
    
    if (bookedFlightResult.rows.length === 0){
      return res.status(404).json({ error: 'No booked flight found for the user'});
    }

    const bookedFlight = bookedFlightResult.rows[0]; // Get the booked flight from the query result
    
    // Ensure departure_time is valid and convert it to a Date object
    if (!bookedFlight.departure_time) {
      return res.status(500).json({ error: 'Invalid departure time for the booked flight' });
    }
    const departureTime = new Date(bookedFlight.departure_time); // Convert departure_time to a Date object

    const rebookingOptionsResult = await pool.query(
      `SELECT * FROM flights
       WHERE id != $1
       AND origin = $2
       AND destination = $3
       AND status != 'canceled'
       AND ABS(EXTRACT(EPOCH FROM (departure_time - $4)) / 3600) <= 24`, // make sure the new flight is within 24 hours of the original flight
       [bookedFlight.id, bookedFlight.origin, bookedFlight.destination, departureTime]
    );

    if (rebookingOptionsResult.rows.length === 0){
      return res.status(404).json({ error: 'No rebooking options available' });
    }

    res.json(rebookingOptionsResult.rows); // Return the rebooking options as a JSON response (array of flights)
  } catch (err) {
    console.error('Error fetching rebooking options: ', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Route to rebook the user's flight
router.post('/user-flight/rebook', async (req, res) => {
  const { newFlightId } = req.body; // Extract new flight ID from the request body

  try {
    // Check if the new flight exists in the database
    const newFlightResult = await pool.query('SELECT * FROM flights WHERE id = $1', [newFlightId]);
    if (newFlightResult.rows.length === 0) {
      return res.status(404).json({ error: 'New flight not found' });
    }

    const newFlight = newFlightResult.rows[0]; // Get the new flight from the query result

    // Check if the new flight has the same origin and destination as the currently booked flight
    const currentFlightResult = await pool.query('SELECT * FROM flights WHERE id = $1', [userFlight.bookedFlightId]);
    if (currentFlightResult.rows.length === 0) {
      return res.status(404).json({ error: 'Current booked flight not found' });
    }

    const currentFlight = currentFlightResult.rows[0];
    if (newFlight.origin !== currentFlight.origin || newFlight.destination !== currentFlight.destination) {
      return res.status(400).json({ error: 'New flight must have the same origin and destination' });
    }

    // Check if the new flight is canceled
    if (newFlight.status === 'canceled') {
      return res.status(400).json({ error: 'New flight is canceled. Cannot rebook' });
    }

    // Update the hardcoded user's booked flight ID
    userFlight.bookedFlightId = newFlightId;

    res.json({ message: 'Flight rebooked successfully', newFlight }); // Return success message and the new flight as JSON response
  } catch (err) {
    console.error('Error rebooking flight:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// export the router so it can be used in other files (like app.js)
module.exports = router;
