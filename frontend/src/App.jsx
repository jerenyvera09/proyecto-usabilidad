import React, { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Prediction from './pages/Prediction.jsx'
import History from './pages/History.jsx'
import Historial from './pages/Historial.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Accesibilidad from './pages/Accesibilidad.jsx'
import Usuarios from './pages/Usuarios.jsx'
import AdminUsers from './pages/AdminUsers.jsx'
import TTSTest from './pages/TTSTest.jsx'

export default function App(){
  const location = useLocation()
  
  useEffect(() => {
    console.log('[App] Navegando a:', location.pathname)
  }, [location])
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/prediction" element={<Prediction />} />
          <Route path="/history" element={<History />} />
          <Route path="/historial" element={<Historial />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/accesibilidad" element={<Accesibilidad />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/admin" element={<AdminUsers />} />
          <Route path="/tts-test" element={<TTSTest />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </Layout>
  )
}
