import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import FlightList from './FlightList.jsx'

function App() {
  return (
    <div className="App">
      <h1>Flight Rebooking Assistant</h1>
      <FlightList />  {/* ✅ Use your real component here */}
    </div>
  )
}

export default App
