// This is the entry point of the backend server. 
// (dumb translation: this is where the server starts. It is the main file that runs when you start the server.
// It doesn't know anything about routes or flights)

// Load Express app config from src/app.js (dumb translation: import all routing logic)
const app = require('./src/app');
const PORT = process.env.PORT || 8000;

// Start the server and listen on the specified port
// (dumb translation: start the server and listen for incoming requests)
app.listen(PORT, () => {
    console.log(`Flight Rebooking API running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});
