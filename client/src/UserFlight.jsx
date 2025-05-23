import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

export default function UserFlight() {
  const [flight, setFlight] = useState(null)
  const [status, setStatus] = useState(null)
  const [rebookingOptions, setRebookingOptions] = useState([])
  const [showRebooking, setShowRebooking] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/flights/user-flight')
      .then(res => {
        setFlight(res.data.bookedFlight)
        setLoading(false)
        if (res.data.bookedFlight) {
          axios.get('/api/flights/user-flight/status')
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
  }, []);

  const handleShowRebooking = () => {
    axios.get('/api/flights/user-flight/rebooking-options')
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

  const handleRebook = (flightId) => {
    axios.post('/api/flights/user-flight/rebook', { newFlightId: flightId })
      .then(res => {
        alert('Rebooked successfully!')
        window.location.reload()
      })
      .catch(err => {
        alert('Failed to rebook.')
        console.error(err)
      });
  }

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