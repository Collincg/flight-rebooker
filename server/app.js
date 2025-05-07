const express = require('express');
const cors = require('cors');
const flightsRoute = require('./routes/flights');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/flights', flightsRoute);

module.exports = app;
