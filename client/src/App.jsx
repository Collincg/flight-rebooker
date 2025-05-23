import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import FlightList from './FlightList.jsx'
import UserFlight from './UserFlight.jsx'

function App() {
  return (
    <div className="App">
      <h1>Flight Rebooking Assistant</h1>
      <UserFlight />  {/* Show user's flight info*/}
      <hr />
      <FlightList />  {/* All flights */}
    </div>
  )
}

export default App
