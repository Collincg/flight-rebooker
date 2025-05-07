const express = require('express');
const cors = require('cors');
const flightsRoute = require('./routes/flights');

const app = express();

// Define a route for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the Flight Rebooking API!');
});

app.use(cors());
app.use(express.json());
app.use('/api/flights', flightsRoute);

module.exports = app;
