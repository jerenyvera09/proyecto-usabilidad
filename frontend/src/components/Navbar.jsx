import React, { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaBars, FaTimes, FaSearch, FaChevronDown, FaHome, FaRegChartBar, FaTachometerAlt, FaHistory, FaSignInAlt, FaUserCircle } from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext.jsx'
import SearchModal from './SearchModal'
import { I18nContext } from '../contexts/I18nContext.jsx'
import { ThemeContext } from '../contexts/ThemeContext.jsx'

export default function Navbar(){
  const { t, lang, setLang } = useContext(I18nContext)
  const { dark, /* setDark removed from navbar - moved to AccessibilityMenu */ highContrast, setHighContrast, friendlyFont, setFriendlyFont, readingComfort, setReadingComfort, textSize, setTextSize } = useContext(ThemeContext)
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    console.log('[Navbar] Montado correctamente')
  }, [])

  

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
            <Link to="/" className="inline-flex items-center gap-2 transition-colors hover:text-primary-600">
              <FaHome aria-hidden /> <span>{t('home')}</span>
            </Link>
            <Link to="/prediction" className="inline-flex items-center gap-2 transition-colors hover:text-primary-600">
              <FaRegChartBar aria-hidden /> <span>{t('prediction')}</span>
            </Link>
            <Link to="/dashboard" className="inline-flex items-center gap-2 transition-colors hover:text-primary-600">
              <FaTachometerAlt aria-hidden /> <span>{t('dashboard')}</span>
            </Link>
            <Link to="/history" className="inline-flex items-center gap-2 transition-colors hover:text-primary-600">
              <FaHistory aria-hidden /> <span>{t('history')}</span>
            </Link>
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
            {/* Modo oscuro se gestiona ahora desde el menú de accesibilidad */}

            {/* Auth actions: mostrar usuario o enlace de inicio de sesión */}
            {!user ? (
              <Link to="/usuarios" className="inline-flex items-center gap-2 px-3 py-1 rounded-md border transition-colors hover:text-primary-600">
                <FaSignInAlt aria-hidden /> <span className="text-sm">{t('login') || 'Login'}</span>
              </Link>
            ) : (
              <div className="relative">
                <button className="inline-flex items-center gap-2 px-3 py-1 rounded-md border" aria-haspopup="menu" aria-expanded="false" title={user?.nombre || user?.email}>
                  <FaUserCircle aria-hidden /> <span className="text-sm">{user?.nombre || user?.email}</span>
                </button>
                <div className="absolute mt-2 right-0 bg-white dark:bg-gray-800 border rounded-lg shadow-lg w-48 py-2 z-50">
                  <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => {}}>{t('dashboard')}</Link>
                  {user?.is_admin && (
                    <Link to="/admin" className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700">Administrar usuarios</Link>
                  )}
                  <button onClick={() => logout()} className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700">{t('logout') || 'Logout'}</button>
                </div>
              </div>
            )}
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
            <Link to="/" className="block py-2 hover:text-primary-600" onClick={() => setMobileOpen(false)}>{t('home')}</Link>
            <Link to="/prediction" className="block py-2 hover:text-primary-600" onClick={() => setMobileOpen(false)}>{t('prediction')}</Link>
            <Link to="/dashboard" className="block py-2 hover:text-primary-600" onClick={() => setMobileOpen(false)}>{t('dashboard')}</Link>
            <Link to="/history" className="block py-2 hover:text-primary-600" onClick={() => setMobileOpen(false)}>{t('history')}</Link>
            <details className="py-2">
              <summary className="cursor-pointer inline-flex items-center gap-2">{t('about')}</summary>
              <div className="ml-4 mt-2 space-y-2">
                <Link to="/about" className="block hover:text-primary-600" onClick={() => setMobileOpen(false)}>{t('about')}</Link>
                <Link to="/accesibilidad" className="block hover:text-primary-600" onClick={() => setMobileOpen(false)}>{t('accessibility_menu') || 'Accesibilidad'}</Link>
                <Link to="/contact" className="block hover:text-primary-600" onClick={() => setMobileOpen(false)}>{t('contact')}</Link>
              </div>
            </details>
            <button
              onClick={() => { setSearchOpen(true); setMobileOpen(false) }}
              className="w-full mt-2 inline-flex items-center gap-2 px-3 py-2 rounded-lg border"
              aria-label="Buscar"
            >
              <FaSearch aria-hidden /> <span>{t('search') || 'Buscar'}</span>
            </button>
            {!user ? (
              <Link to="/usuarios" className="block py-2 mt-2 hover:text-primary-600" onClick={() => setMobileOpen(false)}>{t('login') || 'Login'}</Link>
            ) : (
              <button onClick={() => { logout(); setMobileOpen(false) }} className="block py-2 mt-2 text-left hover:text-primary-600">{t('logout') || 'Logout'}</button>
            )}
          </nav>
        </div>
      )}

      {/* Accessibility menu moved to its own component (AccessibilityMenu) to avoid duplication */}

      {/* Buscador */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
