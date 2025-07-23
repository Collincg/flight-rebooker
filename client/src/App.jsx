import { useState } from 'react'
import './App.css'
import FlightList from './FlightList.jsx'
import UserFlight from './UserFlight 2.jsx'
import Toast from './components/Toast'

function App() {
  const [refreshUserFlight, setRefreshUserFlight] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const toast = {
    success: (message) => setToastMessage({ type: 'success', message }),
    error: (message) => setToastMessage({ type: 'error', message })
  };

  return (
    <div className="App">
      <h1>Flight Rebooking Assistant</h1>
      <UserFlight refreshTrigger={refreshUserFlight} toast={toast} />
      <hr />
      <FlightList onFlightBooked={() => setRefreshUserFlight(prev => !prev)} />
      {toastMessage && (
        <Toast
          type={toastMessage.type}
          message={toastMessage.message}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  )
}

export default App
