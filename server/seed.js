// server/seed.js
require('dotenv').config(); // Load environment variables from a .env file

const { Client } = require('pg');
const fs = require('fs'); // File system module to read files
const path = require('path'); // Path module to handle file paths

// Load JSON flight data
const flights = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'flights.json'), 'utf8')
);

// DB connection from .env
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function seedFlights() {
  try {
    // 1️⃣ Connect to your PostgreSQL database using the client
    await client.connect();

    // 2️⃣ Loop through each flight in your flights.json array
    for (const flight of flights) {

      // 3️⃣ Insert this flight into the database using a parameterized SQL query
      await client.query(
        `INSERT INTO flights 
          (id, airline, origin, destination, departure_time, arrival_time, layovers, status, prices, seats_available)
         VALUES 
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT (id) DO NOTHING`,  // This makes it idempotent
          // ON CONFLICT (id) DO NOTHING tells PostgreSQL to skip the 
          // insert if a row with that id already exists.


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

    console.log('✅ Flights seeded successfully');
  } catch (err) {
    console.error('❌ Error seeding flights:', err);
  } finally {
    await client.end(); // Always close the connection at the end
  }
}

seedFlights();
