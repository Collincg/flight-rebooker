import { useState, useEffect } from 'react';
import LoadingSpinner from './components/LoadingSpinner';
import FlightCard from './components/FlightCard';
import flightService from './services/flightService';
import './App.css';


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
        const fetchFlights = async () => {
            try {
                setLoading(true);
                const data = await flightService.getAllFlights();
                setFlights(data.data || data);
            } catch (error) {
                console.error('Error fetching flights:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchFlights();
    }, []);

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
    setTimeout(async () => {
      try {
        const data = await flightService.getFilteredFlights(params);
        setFlights(data.data || data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setFlights([]);
        } else {
          console.error('Error filtering flights:', error);
        }
      } finally {
        setFiltering(false);
      }
    }, 200);
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
    setTimeout(async () => {
      try {
        const data = await flightService.getAllFlights();
        setFlights(data.data || data);
      } catch (error) {
        console.error('Error fetching flights:', error);
      } finally {
        setFiltering(false);
      }
    }, 200);
  };

  const handleBookFlight = async (flightId) => {
    try {
      await flightService.bookFlight(flightId);
      if (window.showToast) {
        window.showToast('success', 'Flight booked successfully!');
      }
      onFlightBooked();
    } catch (error) {
      console.error('Booking failed:', error);
      if (window.showToast) {
        window.showToast('error', 'Booking failed. Please try again.');
      }
    }
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