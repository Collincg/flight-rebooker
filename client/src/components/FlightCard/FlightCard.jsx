import { formatFlightTime, formatPrice } from '../../utils/dateFormatter';
import './FlightCard.css';

const FlightCard = ({ 
  flight, 
  onAction, 
  actionText = 'Book This Flight',
  showAction = true,
  className = ''
}) => {
  if (!flight) return null;

  const handleAction = () => {
    if (onAction) {
      onAction(flight.id);
    }
  };

  return (
    <div className={`flight-card ${className}`}>
      <div className="flight-header">
        <span className="airline">{flight.airline}</span>
        <span className="flight-id">{flight.id}</span>
      </div>
      
      <div className="flight-route">
        <span className="route-text">
          {flight.origin} ✈️ {flight.destination}
        </span>
      </div>
      
      <div className="flight-times">
        <div className="time-item">
          <span className="time-icon">🛫</span>
          <span className="time-text">
            {formatFlightTime(flight.departure_time || flight.departureTime)}
          </span>
        </div>
        <div className="time-item">
          <span className="time-icon">🛬</span>
          <span className="time-text">
            {formatFlightTime(flight.arrival_time || flight.arrivalTime)}
          </span>
        </div>
      </div>
      
      <div className="flight-details">
        <span className={`flight-status ${flight.status?.toLowerCase()?.replace(/\s+/g, '-')}`}>
          Status: {flight.status}
        </span>
        <span className="layovers">Layovers: {flight.layovers}</span>
      </div>
      
      <div className="flight-price">
        <span className="price-icon">💺</span>
        <span className="price-text">
          {formatPrice(flight.prices?.economy)}
        </span>
      </div>
      
      {showAction && (
        <button 
          className="flight-action-btn"
          onClick={handleAction}
          disabled={flight.status === 'canceled'}
        >
          {flight.status === 'canceled' ? 'Flight Canceled' : actionText}
        </button>
      )}
    </div>
  );
};

export default FlightCard;