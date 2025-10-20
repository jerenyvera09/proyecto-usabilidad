import React, { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Prediction from './pages/Prediction.jsx'
import History from './pages/History.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'

export default function App(){
  const location = useLocation()
  
  useEffect(() => {
    console.log('[App] Navegando a:', location.pathname)
  }, [location])
  
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 pt-28 pb-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/prediction" element={<Prediction />} />
          <Route path="/history" element={<History />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </div>
  )
}
