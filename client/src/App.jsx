import { useState } from 'react'
import './App.css'
import FlightList from './FlightList.jsx'
import UserFlight from './UserFlight.jsx'
import Toast from './components/Toast'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  const [refreshUserFlight, setRefreshUserFlight] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const toast = {
    success: (message) => setToastMessage({ type: 'success', message }),
    error: (message) => setToastMessage({ type: 'error', message }),
    info: (message) => {
      const id = Date.now();
      setToastMessage({ type: 'info', message, id });
      return id;
    }
  };

  // Expose toast functions globally for service layer
  window.showToast = (type, message) => {
    const id = Date.now();
    setToastMessage({ type, message, id });
    return id;
  };
  
  window.hideToast = (id) => {
    setToastMessage(prev => prev && prev.id === id ? null : prev);
  };

  return (
    <ErrorBoundary>
      <div className="App">
        <h1>Flight Rebooking Assistant</h1>
        <ErrorBoundary>
          <UserFlight refreshTrigger={refreshUserFlight} toast={toast} />
        </ErrorBoundary>
        <hr />
        <ErrorBoundary>
          <FlightList onFlightBooked={() => setRefreshUserFlight(prev => !prev)} />
        </ErrorBoundary>
        {toastMessage && (
          <Toast
            toast={{
              id: toastMessage.id || Date.now(),
              type: toastMessage.type,
              message: toastMessage.message,
              duration: toastMessage.type === 'info' ? 0 : 3000
            }}
            onRemove={() => setToastMessage(null)}
          />
        )}
      </div>
    </ErrorBoundary>
  )
}

export default App
