const express = require('express');
const router = express.Router();
const flights = require('../data/flights.json');

router.get('/', (req, res) => {
  res.json(flights);
});

module.exports = router;
