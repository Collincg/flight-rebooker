// server/seed.js
// This script seeds the PostgreSQL database with flight data from the flights.json JSON file.

require('dotenv').config(); // Load environment variables from a .env file
// These variables are used to securely store sensitive information like your database credentials (e.g., username, password, host, etc.).

const { Client } = require('pg'); // Import the pg module to connect to PostgreSQL database
// The Client class is used to create a new client instance that can connect to the database.

const fs = require('fs'); // File system module to read files. Used here to read the JSON file.
const path = require('path'); // Path module to handle file paths in a way that works across different operating systems.

// Load JSON flight data
const flights = JSON.parse(

  // Constructs the full path to the flights.json file, assuming it’s located in a data folder inside the same directory as this script.  
  fs.readFileSync(path.join(__dirname, 'data', 'flights.json'), 'utf8')

); // at this point, flights is an array of flight objects


// DB connection from .env
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// This function is asynchronous and is responsible for seeding the database with flight data.
// It is async because it involves I/O operations (like connecting to the database and executing queries) that can take time to complete.
// The function is defined using the async keyword, which allows you to use await inside it to handle asynchronous operations more easily.
async function seedFlights() {
  try {
    // 1 Connect to your PostgreSQL database using the client
    await client.connect();

    // 2 Loop through each flight in your flights.json array
    for (const flight of flights) {

      // 3 client.query() executes a SQL query to insert the flight into the flights table.
      await client.query(

        // INSERT INTO is a SQL command used to add new rows to a table.
        // The query uses parameterized queries (the $1, $2, etc.) to safely insert data into the database.
        // This prevents SQL injection attacks by ensuring that user input is treated as data, not executable code.
        `INSERT INTO flights 
          (id, airline, origin, destination, departure_time, arrival_time, layovers, status, prices, seats_available)
         VALUES 
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT (id) DO NOTHING`,  // This makes it idempotent
          // ON CONFLICT (id) DO NOTHING tells PostgreSQL to skip the 
          // insert if a row with that id already exists.

        // The array [flight.id, flight.airline, ...] provides the actual values for the placeholders ($1, $2, etc.).
        [
          flight.id,
          flight.airline,
          flight.origin,
          flight.destination,
          flight.departureTime,
          flight.arrivalTime,
          flight.layovers,
          flight.status,
          flight.prices,
          flight.seatsAvailable,
        ]
      );
    }

    console.log('Flights seeded successfully');
  } catch (err) {
    console.error('Error seeding flights:', err);
  } finally {
    await client.end(); // Always close the connection at the end
  }
}

// Call the seedFlights function to start the seeding process
seedFlights();
