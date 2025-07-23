const express = require('express');
const router = express.Router();
const {
  getAllFlights,
  getFilteredFlights,
  getUserFlight,
  getUserFlightStatus,
  getRebookingOptions,
  rebookFlight,
  cancelFlight
} = require('../controllers/flightController');
const {
  validateUserId,
  validateFlightId,
  validateFlightFilters,
  sanitizeInput
} = require('../middleware/validation');

router.use(sanitizeInput);

router.get('/', getAllFlights);

router.get('/filter', validateFlightFilters, getFilteredFlights);

router.get('/user-flight', validateUserId, getUserFlight);

router.get('/user-flight/status', validateUserId, getUserFlightStatus);

router.get('/user-flight/rebooking-options', validateUserId, getRebookingOptions);

router.post('/user-flight/rebook', validateUserId, validateFlightId, rebookFlight);

router.post('/user-flight/cancel', validateUserId, cancelFlight);

module.exports = router;