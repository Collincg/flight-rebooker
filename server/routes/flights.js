// This is a simple Express router for handling flight data.
// It imports the necessary modules, loads flight data from a JSON file, and defines a route to get all flights.
// It uses Express to create a router and exports it for use in other parts of the application.

// Contains route handlers for flight-related endpoints. Defines how our application
// responds to requests for flight data.

// import required modules
const express = require('express'); // Import the express module to create a web server and define routes.
const router = express.Router(); //creates a modular router object to define routes for the /api/flights endpoint.
const flights = require('../data/flights.json'); // Load flight data from a JSON file. This file contains an array of flight objects with various properties.
const req = require('express/lib/request');

// Define a route to get all flights
// This route handles GET requests to the root URL of the flights API (e.g., /api/flights)
router.get('/', (req, res) => {
  res.json(flights);
});

// Define a route to filter flights by destination, date, or airline
// This route handles GET requests to /api/flights/filter
/**Extracts query parameters from the request (req.query).
 * Filters the flights array based on the provided parameters.
 * Returns the filtered flights as a JSON response.
 */
router.get('/filter', (req, res) => {
  const { destination, date, airline } = req.query; 

  // Filter flights based on query parameters
 let filteredFlights = flights;

  // Check if destination, date, or airline is provided in the query parameters
  // If so, filter the flights array accordingly

  // filter() is used to create a new array containing only flights that match the condition.
  if (destination) {
    filteredFlights = filteredFlights.filter(flight => flight.destination.toLowerCase() === destination.toLowerCase());
  }

  if (date) {
    filteredFlights = filteredFlights.filter(flight => flight.departureTime.startsWith(date));
  }

  if (airline) {
    filteredFlights = filteredFlights.filter(flight => flight.airline.toLowerCase() === airline.toLowerCase());
  }

  // check if no flight matches the filter criteria
  if (filteredFlights.length === 0) {
    return res.status(404).json({ error: 'No flights found matching the criteria' }); // Return a 404 error if no flights match the criteria
  }

  res.json(filteredFlights);
})

// Define a route to rebook a flight
// This route handles PUT requests to /api/flights/rebook/:id and allows updating the status of a specific flight.
// The :id in the route allows the client to specify which flight to update (e.g., /api/flights/rebook/AA123).
router.put('/rebook/:id', (req, res) => {

  // The PUT request sends data in the body (e.g., { "newStatus": "rebooked" }).
  const { id } = req.params; // Extract flight ID from the URL parameters
  const { newStatus } = req.body; // Extract new status from the request body

  // Find the flight by ID
  const flight = flights.find(flight => flight.id === id); 

  // If flight not found, return 404 error
  if (!flight) {
    return res.status(404).json({ error: 'Flight not found' }); 
  }

  flight.status = newStatus || 'rebooked'; // Update flight status to 'rebooked' or the new status provided

  // Return success message and the updated flight as JSON response
  res.json({ message: 'Flight rebooked successfully', flight }); 
});

// export the router so it can be used in other files (like app.js)
module.exports = router;
