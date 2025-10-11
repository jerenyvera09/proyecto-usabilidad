import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { I18nContext } from '../contexts/I18nContext.jsx'
import { ThemeContext } from '../contexts/ThemeContext.jsx'

export default function Navbar(){
  const { t, lang, setLang } = useContext(I18nContext)
  const { dark, setDark, highContrast, setHighContrast, friendlyFont, setFriendlyFont, readingComfort, setReadingComfort, textSize, setTextSize } = useContext(ThemeContext)
  const [openAcc, setOpenAcc] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  const openPanel = () => {
    setIsClosing(false)
    setOpenAcc(true)
  }

  const closePanel = () => {
    setIsClosing(true)
    window.setTimeout(() => {
      setOpenAcc(false)
      setIsClosing(false)
    }, 240)
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100 dark:bg-gray-900/70 dark:border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 gap-4">
          <Link to="/" className="flex items-center gap-3 logo-link" title="EduPredict - ULEAM" aria-label="Ir al inicio">
            <div className="logo-animate" id="navbar-logo-wrap">
              <img src="/uleam-logo.png" srcSet="/uleam-logo.png 1x" alt="ULEAM" className="w-16 h-16 object-contain logo-img" role="img" />
            </div>
            <span className="font-extrabold text-lg tracking-tight">EduPredict</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="hover:text-brand">{t('home')}</Link>
            <Link to="/prediction" className="hover:text-brand">{t('prediction')}</Link>
            <Link to="/dashboard" className="hover:text-brand">{t('dashboard')}</Link>
            <Link to="/history" className="hover:text-brand">{t('history')}</Link>
            <Link to="/about" className="hover:text-brand">{t('about')}</Link>
            <Link to="/contact" className="hover:text-brand">{t('contact')}</Link>
          </nav>
          <div className="flex items-center gap-2">
            <select value={lang} onChange={e=> setLang(e.target.value)} className="bg-white/90 dark:bg-gray-800/80 border rounded px-2 py-1 text-sm">
              <option value="es">ES</option>
              <option value="en">EN</option>
            </select>
            <button onClick={()=> setDark(!dark)} className="px-3 py-1 rounded-full bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] text-white shadow-sm" aria-label="toggle theme">{dark ? '☀' : '🌙'}</button>
          </div>
        </div>
      </header>

      <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
        <button
          onClick={() => (openAcc ? closePanel() : openPanel()) }
          className="pointer-events-auto floating-settings w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
          aria-label={openAcc ? 'Cerrar ajustes' : 'Abrir ajustes'}
          title="Ajustes"
        >
          {openAcc ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M6 6L18 18M6 18L18 6" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z" fill="white" opacity="0.95" />
              <path d="M19.4 15a1 1 0 0 0 .2 1.09l.07.07a1 1 0 0 1 0 1.41l-1.41 1.41a1 1 0 0 1-1.41 0l-.07-.07A1 1 0 0 0 15 19.4a7 7 0 0 1-6 0 1 1 0 0 0-1.09.2l-.07.07a1 1 0 0 1-1.41 0L4 18.26a1 1 0 0 1 0-1.41l.07-.07A1 1 0 0 0 4.6 15a7 7 0 0 1 0-6 1 1 0 0 0-.2-1.09l-.07-.07a1 1 0 0 1 0-1.41L5.74 4a1 1 0 0 1 1.41 0l.07.07A1 1 0 0 0 8.6 4.6a7 7 0 0 1 6 0 1 1 0 0 0 1.09-.2l.07-.07a1 1 0 0 1 1.41 0L19.4 6a1 1 0 0 1 0 1.41l-.07.07A1 1 0 0 0 19.4 9a7 7 0 0 1 0 6z" fill="rgba(0,0,0,0.12)" />
            </svg>
          )}
        </button>

        {(openAcc || isClosing) && (
          <>
            {/* removed overlay so background page doesn't blur or dim */}

            <div role="dialog" aria-modal="true" className={`pointer-events-auto settings-panel w-80 md:w-96 bg-white dark:bg-gray-800 border rounded-xl p-4 shadow-2xl ${isClosing ? 'panel-exit' : 'panel-enter'}`}>
              <div className="flex items-start justify-between">
                <div className="text-sm font-semibold">Ajustes de accesibilidad</div>
              </div>
              <div className="mt-3">
                <label className="flex items-start justify-between text-sm mb-3">
                  <div>
                    <div className="font-medium">Alto contraste</div>
                    <div className="text-xs text-gray-500">Aumenta el contraste entre texto y fondo para mejorar la legibilidad.</div>
                  </div>
                  <input type="checkbox" checked={highContrast} onChange={e=> setHighContrast(e.target.checked)} />
                </label>
                <label className="flex items-start justify-between text-sm mb-3">
                  <div>
                    <div className="font-medium">Fuente amigable</div>
                    <div className="text-xs text-gray-500">Activa una tipografía optimizada para dislexia y fatiga visual.</div>
                  </div>
                  <input type="checkbox" checked={friendlyFont} onChange={e=> setFriendlyFont(e.target.checked)} />
                </label>
                <label className="flex items-start justify-between text-sm mb-3">
                  <div>
                    <div className="font-medium">Comodidad de lectura</div>
                    <div className="text-xs text-gray-500">Ajusta interlineado y espaciado para facilitar la lectura prolongada.</div>
                  </div>
                  <input type="checkbox" checked={readingComfort} onChange={e=> setReadingComfort(e.target.checked)} />
                </label>
                <div className="mt-2 text-sm font-medium">Tamaño del texto</div>
                <div className="flex gap-2 mt-1">
                  <button className={`px-2 py-1 border rounded ${textSize==='normal' ? 'bg-gray-100' : ''}`} onClick={()=> setTextSize('normal')}>Normal</button>
                  <button className={`px-2 py-1 border rounded ${textSize==='large' ? 'bg-gray-100' : ''}`} onClick={()=> setTextSize('large')}>Grande</button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
