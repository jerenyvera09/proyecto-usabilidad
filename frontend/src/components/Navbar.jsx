import React, { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaBars, FaTimes, FaSearch, FaChevronDown } from 'react-icons/fa'
import SearchModal from './SearchModal'
import { I18nContext } from '../contexts/I18nContext.jsx'
import { ThemeContext } from '../contexts/ThemeContext.jsx'

export default function Navbar(){
  const { t, lang, setLang } = useContext(I18nContext)
  const { dark, setDark, highContrast, setHighContrast, friendlyFont, setFriendlyFont, readingComfort, setReadingComfort, textSize, setTextSize } = useContext(ThemeContext)
  const [openAcc, setOpenAcc] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    console.log('[Navbar] Montado correctamente')
  }, [])

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
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100 dark:bg-gray-900/80 dark:border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 gap-4">
          <Link to="/" className="flex items-center gap-3 logo-link" title="EduPredict - ULEAM" aria-label="Ir al inicio">
            <div className="logo-animate" id="navbar-logo-wrap">
              <picture>
                <source srcSet="/uleam-logo.avif" type="image/avif" />
                <source srcSet="/uleam-logo.webp" type="image/webp" />
                <img 
                  src="/uleam-logo.png" 
                  alt="ULEAM" 
                  className="w-16 h-16 object-contain logo-img" 
                  width="64"
                  height="64"
                  loading="lazy"
                  onError={(e) => {
                    console.warn('[Navbar] Logo no encontrado')
                    e.currentTarget.style.opacity = '0.3'
                  }}
                />
              </picture>
            </div>
            <span className="font-extrabold text-lg tracking-tight">EduPredict</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="hover:text-brand transition-colors">{t('home')}</Link>
            <Link to="/prediction" className="hover:text-brand transition-colors">{t('prediction')}</Link>
            <Link to="/dashboard" className="hover:text-brand transition-colors">{t('dashboard')}</Link>
            <Link to="/history" className="hover:text-brand transition-colors">{t('history')}</Link>
            <div className="relative">
              <button
                className="inline-flex items-center gap-1 hover:text-brand transition-colors"
                onClick={() => setAboutOpen((v) => !v)}
                aria-expanded={aboutOpen}
                aria-haspopup="menu"
              >
                {t('about')} <FaChevronDown aria-hidden />
              </button>
              {aboutOpen && (
                <div role="menu" className="absolute mt-2 right-0 bg-white dark:bg-gray-800 border rounded-lg shadow-lg w-56 py-2 z-50">
                  <Link to="/about" className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700" role="menuitem" onClick={() => setAboutOpen(false)}>
                    {t('about')}
                  </Link>
                  <Link to="/accesibilidad" className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700" role="menuitem" onClick={() => setAboutOpen(false)}>
                    {t('accessibility_menu') || 'Accesibilidad'}
                  </Link>
                  <Link to="/contact" className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700" role="menuitem" onClick={() => setAboutOpen(false)}>
                    {t('contact')}
                  </Link>
                </div>
              )}
            </div>
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border hover:bg-white/60 dark:hover:bg-gray-800"
              aria-label="Buscar"
              title="Buscar (Ctrl+K)"
            >
              <FaSearch aria-hidden />
              <span className="text-sm">{t('search') || 'Buscar'}</span>
            </button>
            <select 
              value={lang} 
              onChange={e=> setLang(e.target.value)} 
              className="bg-white/90 dark:bg-gray-800/80 border rounded px-2 py-1 text-sm"
              aria-label="Seleccionar idioma"
            >
              <option value="es">ES</option>
              <option value="en">EN</option>
            </select>
            <button 
              onClick={()=> setDark(!dark)} 
              className="px-3 py-1 rounded-full bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] text-white shadow-sm hover:shadow-md transition-shadow" 
              aria-label={dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {dark ? '☀' : '🌙'}
            </button>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden p-2 rounded-lg border ml-1"
              aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </header>

      {/* Menú móvil */}
      {mobileOpen && (
        <div className="fixed top-[64px] left-0 right-0 z-40 md:hidden bg-white dark:bg-gray-900 border-b dark:border-gray-800 shadow-lg">
          <nav className="px-6 py-4 space-y-2">
            <Link to="/" className="block py-2" onClick={() => setMobileOpen(false)}>{t('home')}</Link>
            <Link to="/prediction" className="block py-2" onClick={() => setMobileOpen(false)}>{t('prediction')}</Link>
            <Link to="/dashboard" className="block py-2" onClick={() => setMobileOpen(false)}>{t('dashboard')}</Link>
            <Link to="/history" className="block py-2" onClick={() => setMobileOpen(false)}>{t('history')}</Link>
            <details className="py-2">
              <summary className="cursor-pointer inline-flex items-center gap-2">{t('about')}</summary>
              <div className="ml-4 mt-2 space-y-2">
                <Link to="/about" className="block" onClick={() => setMobileOpen(false)}>{t('about')}</Link>
                <Link to="/accesibilidad" className="block" onClick={() => setMobileOpen(false)}>{t('accessibility_menu') || 'Accesibilidad'}</Link>
                <Link to="/contact" className="block" onClick={() => setMobileOpen(false)}>{t('contact')}</Link>
              </div>
            </details>
            <button
              onClick={() => { setSearchOpen(true); setMobileOpen(false) }}
              className="w-full mt-2 inline-flex items-center gap-2 px-3 py-2 rounded-lg border"
              aria-label="Buscar"
            >
              <FaSearch aria-hidden /> <span>{t('search') || 'Buscar'}</span>
            </button>
          </nav>
        </div>
      )}

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

      {/* Buscador */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
