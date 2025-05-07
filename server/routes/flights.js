// This is a simple Express router for handling flight data.
// It imports the necessary modules, loads flight data from a JSON file, and defines a route to get all flights.
// It uses Express to create a router and exports it for use in other parts of the application.

// Contains route handlers for flight-related endpoints. Defines how our application
// responds to requests for flight data.

// import required modules
const express = require('express');
const router = express.Router();
const flights = require('../data/flights.json');

// Define a route to get all flights
// This route handles GET requests to the root URL of the flights API (e.g., /api/flights)
router.get('/', (req, res) => {
  res.json(flights);
});

// export the router so it can be used in other files (like app.js)
module.exports = router;
