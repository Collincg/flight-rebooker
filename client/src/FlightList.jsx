// FlightList.jsx
/**
 * React Hooks:
 * UseState: Allows your component to have data that can change (like flight data). 
 *           To manage the state of the flight data. 
 * UseEffect: Runs code when the component loads (similar to "on page load"). 
 *            To fetch flight data when the component mounts.
 */
import { useState, useEffect, use } from 'react';
import axios from 'axios'; // Axios is a library for making HTTP requests
import './App.css'; // Import CSS styles for the component

/**
 * FlightList component to display a list of flights
 * This code runs once when the component loads:
 * It calls your backend API (/flights)
   Then stores the result in the flights array.
   The [] at the end tells it to run only once, just like componentDidMount() in older React.
 * */ 

function FlightList() {
    const [flights, setFlights] = useState([]); // State to hold flight data

    useEffect(() => {
        axios.get('http://localhost:8000/api/flights') // Fetch flight data from the backend API
            .then(res => {
                console.log("Fetched flights API response:", res.data); // Log the fetched data
                setFlights(res.data);
            }) // Update state with the fetched data
            .catch(err => {
                console.error('Error fetching flights:', err);
            }); // Handle any errors

    }, []); // Fetch flight data when the component mounts

    return (
        <div>
            <h1>Available Flights:</h1>
            {flights.length === 0 && <p>No flights found.</p>}
            {flights.map((flight) => (
                <div key={flight.id} className="flight-card">
                    <div className="flight-header">
                    <span>{flight.airline}</span>
                    <span>{flight.id}</span>
                    </div>
                    <div className="flight-route">
                    {flight.origin} ✈️ {flight.destination}
                    </div>
                    <div className="flight-times">
                    <span>
                        🛫 {new Date(flight.departure_time).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                        </span>

                        <span>
                        🛬 {new Date(flight.arrival_time).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            weekday: 'short'
                        })}
                        </span>
                    </div>
                    <div className="flight-details">
                    <span className={`flight-status ${flight.status.toLowerCase()}`}>
                        Status: {flight.status}
                    </span>
                    <span>Layovers: {flight.layovers}</span>
                    </div>
                    <div className="flight-price">
                    💺 {flight.prices.economy.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD'
                    })}
                    </div>
                </div>
                ))}

        </div>
    )
}

export default FlightList; // Export the FlightList component for use in other files