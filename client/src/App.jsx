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
    error: (message) => setToastMessage({ type: 'error', message })
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
            type={toastMessage.type}
            message={toastMessage.message}
            onClose={() => setToastMessage(null)}
          />
        )}
      </div>
    </ErrorBoundary>
  )
}

export default App
