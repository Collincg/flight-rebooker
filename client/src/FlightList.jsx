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
import LoadingSpinner from './components/LoadingSpinner';
import FlightCard from './components/FlightCard';
import './App.css'; // Import CSS styles for the component

const API = import.meta.env.VITE_API_URL; // Get the API URL from environment variables
// set an API URL for testing locally: http://localhost:8000/api/flights
// const API = 'http://localhost:8000/api/flights';

// Function to get or create a unique user ID
const getOrCreateUserId = () => {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substring(2, 10);
    localStorage.setItem('userId', userId);
  }
  return userId;
};

const userId = getOrCreateUserId();


/**
 * FlightList component to display a list of flights
 * This code runs once when the component loads:
 * It calls your backend API (/flights)
   Then stores the result in the flights array.
   The [] at the end tells it to run only once, just like componentDidMount() in older React.
 * */ 

function FlightList({ onFlightBooked }) {
    const [flights, setFlights] = useState([]); // State to hold flight data
    const [loading, setLoading] = useState(true); // State for initial loading
    const [filters, setFilters] = useState({
        origin: '',
        destination: '',
        departureTime: '', // this will be a date (no hours/minutes)
        airline: '',
        layovers: '',
    }); // State to hold filter options
    const [filtering, setFiltering] = useState(false); // <-- animation state

    useEffect(() => {
        setLoading(true);
        axios.get(`${API}/api/flights`) // Fetch flight data from the backend API
            .then(res => {
                console.log("Fetched flights API response:", res.data); // Log the fetched data
                setFlights(res.data.data || res.data); // Handle both old and new API format
                setLoading(false);
            }) // Update state with the fetched data
            .catch(err => {
                console.error('Error fetching flights:', err);
                setLoading(false);
            }); // Handle any errors

    }, []); // Fetch flight data when the component mounts

    // Handle filter input changes
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Fetch filtered flights
  const handleFilter = (e) => {
    e.preventDefault();
    setFiltering(true); // Set filtering state to true to start fade out animation

    // Build query string
    const params = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params[key] = value;
    });
    setTimeout(() => {
      axios.get(`${API}/api/flights/filter`, { params })
        .then(res => setFlights(res.data.data || res.data))
        .catch(err => {
          if (err.response && err.response.status === 404) {
            setFlights([]);
          } else {
            console.error('Error filtering flights:', err);
          }
        })
        .finally(() => setFiltering(false)); // Fade in after data loads
    }, 200); // 200ms fade out before fetching
  };

  // Reset filters and show all flights
  const handleReset = () => {
    setFilters({
      origin: '',
      destination: '',
      airline: '',
      departureTime: '',
      layovers: ''
    });
    setFiltering(true);
    setTimeout(() => {
      axios.get(`${API}/api/flights`)
        .then(res => setFlights(res.data.data || res.data))
        .catch(err => console.error('Error fetching flights:', err))
        .finally(() => setFiltering(false));
    }, 200);
  };

  const handleBookFlight = (flightId) => {
    axios.post(`${API}/api/flights/user-flight/rebook`, {
        userId,
        newFlightId: flightId
    })
    .then(() => {
        alert("Flight booked!");
        onFlightBooked(); // trigger the refresh in UserFlight
    })
    .catch(err => {
        alert("Booking failed.");
        console.error(err);
    });
  };

    if (loading) return <LoadingSpinner message="Loading available flights..." />;

    return (
    <div>
      <h2>All Flights</h2>
      <form className="flight-filter-form" onSubmit={handleFilter}>
        <input
          type="text"
          name="origin"
          placeholder="Origin"
          value={filters.origin}
          onChange={handleChange}
        />
        <input
          type="text"
          name="destination"
          placeholder="Destination"
          value={filters.destination}
          onChange={handleChange}
        />
        <input
          type="text"
          name="airline"
          placeholder="Airline"
          value={filters.airline}
          onChange={handleChange}
        />
        <input
          type="date"
          name="departureTime"
          value={filters.departureTime}
          onChange={handleChange}
        />
        <input
          type="number"
          name="layovers"
          min="0"
          placeholder="Max Layovers"
          value={filters.layovers}
          onChange={handleChange}
        />
        <button type="submit">Filter</button>
        <button type="button" onClick={handleReset}>Reset</button>
      </form>
      {filtering && <LoadingSpinner size="small" message="Filtering flights..." />}
      <div className={`flight-list ${filtering ? 'fade' : 'fade-in'}`}>
        {flights.length === 0 ? (
          <p>No flights found.</p>
        ) : (
          flights.map(flight => (
            <FlightCard
              key={flight.id}
              flight={flight}
              onAction={handleBookFlight}
              actionText="Book This Flight"
            />
          ))
        )}
      </div>
    </div>
  );
}

export default FlightList; // Export the FlightList component for use in other files