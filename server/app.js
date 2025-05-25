// app.js serves as the central hub where we configure middleware, routes, 
// and other settings for our Express application (behavior of server).

// import required modules. We use express to create the server and cors to allow cross-origin requests.
const express = require('express');
const app = express();

const cors = require('cors');
const flightsRoute = require('./routes/flights');


// define routes to handle different endpoints.
// Define a route for the root URL (without this: it would be a 404 error)
app.get('/', (req, res) => {
    res.send('Welcome to the Flight Rebooking API!');
});

// Middleware to handle CORS and parse JSON requests
// if your frontend is hosted on http://localhost:3000 and your backend API is on http://localhost:8000, the browser will block requests from the frontend to the backend unless CORS is explicitly allowed.
// the cors middleware is used to enable cross-origin requests.
// CORS (Cross-Origin Resource Sharing) is a security feature implemented by web browsers to prevent malicious websites from making requests to a different domain than the one that served the original web page.
app.use(cors());
app.use(express.json());
app.use('/api/flights', flightsRoute);

// const path = require('path');

// // Serve static files from the React app
// app.use(express.static(path.join(__dirname, '../client/dist')));

// // For any route not handled by your API, serve index.html (for React Router)
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../client/dist/index.html'));
// });

// export the app so it can be used in other files (like index.js)
module.exports = app;
