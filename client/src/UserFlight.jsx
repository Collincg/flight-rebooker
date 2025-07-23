import { useEffect, useState } from 'react';
import FlightCard from './components/FlightCard';
import LoadingSpinner from './components/LoadingSpinner';
import flightService from './services/flightService';
import { getOrCreateUserId } from './utils/userService';
import './App.css';

const userId = getOrCreateUserId();

export default function UserFlight({ refreshTrigger, toast }) {
  const [flight, setFlight] = useState(null)
  const [status, setStatus] = useState(null)
  const [rebookingOptions, setRebookingOptions] = useState([])
  const [showRebooking, setShowRebooking] = useState(false)
  const [loading, setLoading] = useState(true)
  const [rebookingLoading, setRebookingLoading] = useState(false)

  useEffect(() => {
    const fetchUserFlight = async () => {
      try {
        const data = await flightService.getUserFlight(userId);
        const bookedFlight = data.data?.bookedFlight || data.bookedFlight;
        setFlight(bookedFlight);
        setLoading(false);
        
        if (bookedFlight) {
          try {
            const statusData = await flightService.getUserFlightStatus(userId);
            setStatus(statusData.data?.status || statusData.status);
          } catch (err) {
            setStatus('unknown');
            console.error(err);
          }
        }
      } catch (err) {
        setLoading(false);
        setFlight(null);
        console.error(err);
      }
    };

    fetchUserFlight();
  }, [refreshTrigger]);

  const handleShowRebooking = async () => {
    try {
      setRebookingLoading(true);
      const data = await flightService.getRebookingOptions(userId);
      setRebookingOptions(Array.isArray(data) ? data : data.data || []);
      setShowRebooking(true);
    } catch (err) {
      setRebookingOptions([]);
      setShowRebooking(true);
      toast?.error('Failed to load rebooking options');
      console.error(err);
    } finally {
      setRebookingLoading(false);
    }
  };

  const handleHideRebooking = () => {
    setShowRebooking(false);
    setRebookingOptions([]); // optional: clears the options
  };

  const handleRebook = async (flightId) => {
    try {
      await flightService.bookFlight(userId, flightId);
      toast?.success('Flight rebooked successfully!');
      window.location.reload();
    } catch (err) {
      toast?.error('Failed to rebook flight. Please try again.');
      console.error(err);
    }
  };

  const handleCancel = async () => {
    try {
      await flightService.cancelFlight(userId);
      alert("Flight canceled!");
      setFlight(null);
      setShowRebooking(false);
    } catch (err) {
      alert("Failed to cancel the flight.");
      console.error(err);
    }
  };


  if (loading) return <LoadingSpinner message="Loading your flight..." />

  if (!flight) return <div><h2>Your Current Flight</h2><p>You have no booked flights.</p></div>

  return (
    <div>
      <h2>Your Current Flight</h2>
      <FlightCard
        flight={{...flight, status: status || flight.status}}
        showAction={false}
      />
      {(status === 'delayed' || status === 'canceled' || flight.status === 'delayed' || flight.status === 'canceled') && !showRebooking && (
        <button onClick={handleShowRebooking} disabled={rebookingLoading}>
          {rebookingLoading ? 'Loading Options...' : 'See Rebooking Options'}
        </button>
      )}
      {rebookingLoading && <LoadingSpinner size="small" message="Loading rebooking options..." />}
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
                  <FlightCard
                    key={opt.id}
                    flight={opt}
                    onAction={handleRebook}
                    actionText="Rebook"
                  />
                ))}
            </div>
            )}
        </div>
        )}
    </div>
  )
}