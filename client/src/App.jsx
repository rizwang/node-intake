import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import IntakeForm from './components/IntakeForm'
import AdminQueue from './components/AdminQueue'
import IntakeDetail from './components/IntakeDetail'

function Navigation() {
  const location = useLocation()

  return (
    <nav className="nav">
      <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
        Submit Intake
      </Link>
      <Link to="/admin" className={location.pathname.startsWith('/admin') ? 'active' : ''}>
        Admin Queue
      </Link>
    </nav>
  )
}

function App() {
  return (
    <Router>
      <div className="container">
        <Navigation />
        <Routes>
          <Route path="/" element={<IntakeForm />} />
          <Route path="/admin" element={<AdminQueue />} />
          <Route path="/admin/intakes/:id" element={<IntakeDetail />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

