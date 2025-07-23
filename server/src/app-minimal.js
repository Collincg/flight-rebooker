const express = require('express');
const app = express();
const config = require('./config');
const { errorHandler } = require('./middleware/errorHandler');
const corsMiddleware = require('./middleware/cors');
const flightsRoute = require('./routes/flights');

app.use(corsMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the Flight Rebooking API!',
    version: '2.0.0',
    environment: config.NODE_ENV
  });
});

app.use('/api/flights', flightsRoute);

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;