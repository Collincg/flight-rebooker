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
  validateFlightId,
  validateFlightFilters,
  sanitizeInput
} = require('../middleware/validation');
const { verifyToken } = require('../middleware/auth');

router.use(sanitizeInput);

router.get('/', getAllFlights);

router.get('/filter', validateFlightFilters, getFilteredFlights);

router.get('/user-flight', verifyToken, getUserFlight);

router.get('/user-flight/status', verifyToken, getUserFlightStatus);

router.get('/user-flight/rebooking-options', verifyToken, getRebookingOptions);

router.post('/user-flight/rebook', verifyToken, validateFlightId, rebookFlight);

router.post('/user-flight/cancel', verifyToken, cancelFlight);

module.exports = router;