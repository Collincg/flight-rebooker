import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
const API = import.meta.env.VITE_API_URL;

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

export default function UserFlight({ refreshTrigger }) {
  const [flight, setFlight] = useState(null)
  const [status, setStatus] = useState(null)
  const [rebookingOptions, setRebookingOptions] = useState([])
  const [showRebooking, setShowRebooking] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${API}/api/flights/user-flight`, { params: { userId } })
      .then(res => {
        setFlight(res.data.bookedFlight)
        setLoading(false)
        if (res.data.bookedFlight) {
          axios.get(`${API}/api/flights/user-flight/status`, { params: { userId } })
            .then(statusRes => setStatus(statusRes.data.status))
            .catch(err => {
              setStatus('unknown');
              console.error(err);
            });
        }
      })
      .catch(err => {
        setLoading(false);
        setFlight(null);
        console.error(err);
      });
  }, [refreshTrigger]); // Dependency on refreshTrigger to re-fetch flight data when it changes

  const handleShowRebooking = () => {
    axios.get(`${API}/api/flights/user-flight/rebooking-options`, { params: { userId } })
      .then(res => {
        setRebookingOptions(res.data) // Assuming the response is an array of rebooking options
        setShowRebooking(true)
      })
      .catch(err => {
        setRebookingOptions([])
        setShowRebooking(true)
        console.error(err)
      });
  }

  const handleHideRebooking = () => {
    setShowRebooking(false);
    setRebookingOptions([]); // optional: clears the options
  };

  const handleRebook = (flightId) => {
    axios.post(`${API}/api/flights/user-flight/rebook`, { userId, newFlightId: flightId })
      .then(res => {
        alert('Rebooked successfully!')
        window.location.reload()
      })
      .catch(err => {
        alert('Failed to rebook.')
        console.error(err)
      });
  }

  const handleCancel = () => {
    axios.post(`${API}/api/flights/user-flight/cancel`, { userId })
        .then(() => {
        alert("Flight canceled!");
        setFlight(null); // Clear current flight state
        setShowRebooking(false); // Reset rebooking state
        })
        .catch(err => {
        alert("Failed to cancel the flight.");
        console.error(err);
        });
    };


  if (loading) return <div>Loading your flight...</div>

  if (!flight) return <div><h2>Your Current Flight</h2><p>You have no booked flights.</p></div>

  return (
    <div>
      <h2>Your Current Flight</h2>
      <div className="flight-card">
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
              minute: '2-digit',
              weekday: 'short'
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
          <span className={`flight-status ${status ? status.toLowerCase() : flight.status.toLowerCase()}`}>
            Status: {status || flight.status}
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
      {(status === 'delayed' || status === 'canceled' || flight.status === 'delayed' || flight.status === 'canceled') && !showRebooking && (
        <button onClick={handleShowRebooking}>See Rebooking Options</button>
      )}
      <button onClick={handleCancel} style={{ marginTop: '10px' }}>
        Cancel My Booking
      </button>
      <button onClick={handleHideRebooking} style={{ marginTop: '10px' }}>
        Hide Rebooking Options
      </button>
      {showRebooking && (
        <div>
            <h3>Rebooking Options</h3>
            {Array.isArray(rebookingOptions) && rebookingOptions.length === 0 ? (
            <p>No rebooking options available.</p>
            ) : (
            <div className="rebooking-options-list">
                {Array.isArray(rebookingOptions) && rebookingOptions.map(opt => (
                <div className="flight-card" key={opt.id}>
                    <div className="flight-header">
                    <span>{opt.airline}</span>
                    <span>{opt.id}</span>
                    </div>
                    <div className="flight-route">
                    {opt.origin} ✈️ {opt.destination}
                    </div>
                    <div className="flight-times">
                    <span>
                        🛫 {new Date(opt.departure_time).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        weekday: 'short'
                        })}
                    </span>
                    <span>
                        🛬 {new Date(opt.arrival_time).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        weekday: 'short'
                        })}
                    </span>
                    </div>
                    <div className="flight-details">
                    <span>Layovers: {opt.layovers}</span>
                    </div>
                    <div className="flight-price">
                    💺 {opt.prices?.economy?.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD'
                    })}
                    </div>
                    <button onClick={() => handleRebook(opt.id)}>Rebook</button>
                </div>
                ))}
            </div>
            )}
        </div>
        )}
    </div>
  )
}