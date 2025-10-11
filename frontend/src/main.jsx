import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { I18nProvider } from './contexts/I18nContext.jsx'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import './styles/index.css'

const DEFAULT_SPLASH = 1000 // ms
const SPLASH_DURATION = Number(import.meta.env.VITE_SPLASH_DURATION || DEFAULT_SPLASH)

function Root(){
  const [splash, setSplash] = useState(true)
  useEffect(()=>{
    const t = setTimeout(()=> {
      setSplash(false)
      // trigger navbar logo bounce after splash finishes
      try{
        const el = document.getElementById('navbar-logo-wrap')
        if(el){ el.classList.add('logo-animate'); setTimeout(()=> el.classList.remove('logo-animate'), 900) }
      }catch(e){/* ignore */}
    }, SPLASH_DURATION)
    return ()=> clearTimeout(t)
  }, [])

  if(splash){
    return (
      <div className="min-h-screen grid place-items-center splash-wrap">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <img src="/uleam-logo.png" alt="ULEAM" className="w-28 h-28 object-contain drop-shadow-sm splash-logo" />
          <div className="text-center">
            <div className="text-lg font-semibold bg-clip-text text-transparent" style={{background: 'linear-gradient(90deg, var(--gradient-start), var(--gradient-end))'}}>EduPredict</div>
            <div className="text-sm text-gray-500">Cargando aplicación...</div>
          </div>
          <div className="mt-4">
            <div className="splash-spinner" aria-hidden></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <I18nProvider>
      <ThemeProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </I18nProvider>
  )
}

// add a minimal fade-in animation style if tailwind plugin not configured for it
const styleId = 'edupredict-splash-style'
if(!document.getElementById(styleId)){
  const s = document.createElement('style')
  s.id = styleId
  s.innerHTML = `@keyframes edupredict-fade{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}.animate-fade-in{animation:edupredict-fade 600ms ease both}`
  document.head.appendChild(s)
}

// add spinner styles if not present
const splashStyleId = 'edupredict-splash-spinner-style'
  if(!document.getElementById(splashStyleId)){
  const ss = document.createElement('style')
  ss.id = splashStyleId
  ss.innerHTML = `.splash-spinner{width:36px;height:36px;border-radius:50%;background:linear-gradient(90deg,var(--gradient-start),var(--gradient-end));position:relative;box-shadow:0 6px 18px rgba(12,12,20,0.08);animation:spin-scale 900ms infinite ease-in-out}@keyframes spin-scale{0%{transform:scale(0.96) rotate(0)}50%{transform:scale(1.04) rotate(120deg)}100%{transform:scale(0.96) rotate(240deg)}}`
  document.head.appendChild(ss)
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />)
