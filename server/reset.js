// script to reset the database to the original test flights

require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const readline = require('readline'); // For user input

// Load JSON flight data
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD || null,
  port: process.env.DB_PORT,
});

const flights = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'flights.json'), 'utf8')
); // at this point, flights is an array of flight objects

async function resetDatabase() {
    try {
        console.log('Resetting database...');
        await pool.query('DELETE FROM flights'); // Delete all existing records from the flights table
        console.log('Flights table cleared.');

        for (const flight of flights) {
            await pool.query(
                `INSERT INTO flights (id, airline, origin, destination, departure_time, arrival_time, layovers, status, prices, seats_available)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
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
        console.log('Flights table reseeded.');
    } catch (error) {
        console.error('Error resetting database:', error);
    }
    finally {
        await pool.end(); // Close the database connection
        console.log('Database connection closed.');
    }
}

// Function to ask for user confirmation
function promptConfirmation() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.question('ARE YOU SURE you want to reset the database? (yes/no): ', (answer) => {
        if (answer.toLowerCase() === 'yes') {
            resetDatabase().then(() => {
                console.log('Database reset completed.');
            });
        } else {
            console.log('Database reset cancelled.');
        }
        rl.close();
    });
}

// Start the script
console.log('This script will reset the database to its original state.');
console.log('All existing flight data will be deleted and replaced with the original test flights.');
promptConfirmation();