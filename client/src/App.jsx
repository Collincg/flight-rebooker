import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import FlightList from './FlightList.jsx'
import UserFlight from './UserFlight.jsx'

function App() {
  const [refreshUserFlight, setRefreshUserFlight] = useState(false);

  return (
    <div className="App">
      <h1>Flight Rebooking Assistant</h1>
      <UserFlight refreshTrigger={refreshUserFlight} />
      <hr />
      <FlightList onFlightBooked={() => setRefreshUserFlight(prev => !prev)} />
    </div>
  )
}

export default App
