import React, { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  HiMenu,
  HiX,
  HiSearch,
  HiChevronDown,
  HiHome,
  HiChartBar,
  HiTemplate,
  HiClock,
  HiLogin,
  HiUserCircle,
  HiSun,
  HiMoon
} from 'react-icons/hi'
import { useAuth } from '../contexts/AuthContext.jsx'
import SearchModal from './SearchModal'
import { I18nContext } from '../contexts/I18nContext.jsx'
import { ThemeContext } from '../contexts/ThemeContext.jsx'

export default function Navbar(){
  const { t, lang, setLang } = useContext(I18nContext)
  const { dark, setDark } = useContext(ThemeContext)
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    console.log('[Navbar] Montado correctamente')
  }, [])

  const navLinkBase = 'inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all hover:text-white hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accentBlue'

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-uleamRed/20 via-bg900/90 to-uleamRedDark/25 backdrop-blur-lg border-b border-white/10 shadow-soft">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 gap-4">
          <Link to="/" className="flex items-center gap-3 logo-link focus-visible" title="EduPredict - ULEAM" aria-label="Ir al inicio">
            <div className="h-11 w-11 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center shadow-soft">
              <picture>
                <source srcSet="/uleam-logo.avif" type="image/avif" />
                <source srcSet="/uleam-logo.webp" type="image/webp" />
                <img 
                  src="/uleam-logo.png" 
                  alt="ULEAM" 
                  className="w-10 h-10 object-contain logo-img"
                  width="40"
                  height="40"
                  loading="lazy"
                  onError={(e) => {
                    console.warn('[Navbar] Logo no encontrado')
                    e.currentTarget.style.opacity = '0.3'
                  }}
                />
              </picture>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-extrabold text-lg tracking-tight text-grayLight drop-shadow-neon">EduPredict</span>
              <span className="text-[11px] text-textMuted bg-white/5 px-2 py-0.5 rounded-full border border-white/10 w-fit">
                ULEAM · Académico
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            <Link to="/" className={navLinkBase}>
              <HiHome aria-hidden /> <span>{t('home')}</span>
            </Link>
            <Link to="/prediction" className={navLinkBase}>
              <HiChartBar aria-hidden /> <span>{t('prediction')}</span>
            </Link>
            <Link to="/dashboard" className={navLinkBase}>
              <HiTemplate aria-hidden /> <span>{t('dashboard')}</span>
            </Link>
            <Link to="/history" className={navLinkBase}>
              <HiClock aria-hidden /> <span>{t('history')}</span>
            </Link>
            <div className="relative">
              <button
                className={`${navLinkBase} gap-1`}
                onClick={() => setAboutOpen((v) => !v)}
                aria-expanded={aboutOpen}
                aria-haspopup="menu"
              >
                {t('about')} <HiChevronDown aria-hidden />
              </button>
              {aboutOpen && (
                <div role="menu" className="absolute mt-3 right-0 w-56 rounded-2xl border border-white/10 bg-bg800 shadow-soft p-2">
                  <Link to="/about" className="block px-3 py-2 rounded-xl hover:bg-white/5" role="menuitem" onClick={() => setAboutOpen(false)}>
                    {t('about')}
                  </Link>
                  <Link to="/accesibilidad" className="block px-3 py-2 rounded-xl hover:bg-white/5" role="menuitem" onClick={() => setAboutOpen(false)}>
                    {t('accessibility_menu') || 'Accesibilidad'}
                  </Link>
                  <Link to="/contact" className="block px-3 py-2 rounded-xl hover:bg-white/5" role="menuitem" onClick={() => setAboutOpen(false)}>
                    {t('contact')}
                  </Link>
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm"
              aria-label="Buscar"
              title="Buscar (Ctrl+K)"
            >
              <HiSearch aria-hidden />
              <span className="text-sm">{t('search') || 'Buscar'}</span>
            </button>
            <button
              onClick={() => setDark((prev) => !prev)}
              className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm focus-visible"
              aria-label={dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {dark ? <HiSun aria-hidden /> : <HiMoon aria-hidden />}
              <span className="text-sm">{dark ? 'Claro' : 'Oscuro'}</span>
            </button>
            <select 
              value={lang} 
              onChange={e=> setLang(e.target.value)} 
              className="bg-white/5 text-textPrimary border border-white/10 rounded-xl px-3 py-2 text-sm focus-visible"
              aria-label="Seleccionar idioma"
            >
              <option value="es">ES</option>
              <option value="en">EN</option>
            </select>

            {!user ? (
              <Link to="/usuarios" className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition text-sm">
                <HiLogin aria-hidden /> <span className="text-sm">{t('login') || 'Login'}</span>
              </Link>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-sm"
                  aria-haspopup="menu"
                  aria-expanded={profileOpen}
                  title={user?.nombre || user?.email}
                >
                  <HiUserCircle aria-hidden /> <span className="text-sm">{user?.nombre || user?.email}</span>
                </button>
                {profileOpen && (
                  <div className="absolute mt-3 right-0 bg-bg800 border border-white/10 rounded-2xl shadow-soft w-56 py-2 z-50">
                    <Link to="/dashboard" className="block px-4 py-2 text-sm hover:bg-white/5" onClick={() => setProfileOpen(false)}>{t('dashboard')}</Link>
                    {user?.is_admin && (
                      <Link to="/admin" className="block px-4 py-2 text-sm hover:bg-white/5" onClick={() => setProfileOpen(false)}>Administrar usuarios</Link>
                    )}
                    <button onClick={() => { logout(); setProfileOpen(false) }} className="w-full text-left px-4 py-2 text-sm hover:bg-white/5">{t('logout') || 'Logout'}</button>
                  </div>
                )}
              </div>
            )}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden p-2 rounded-xl border border-white/10 bg-white/5"
              aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <HiX /> : <HiMenu />}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed top-[70px] left-0 right-0 z-40 md:hidden bg-bg900 border-b border-white/10 shadow-soft">
          <nav className="px-6 py-4 space-y-2">
            <Link to="/" className="block py-2 hover:text-white" onClick={() => setMobileOpen(false)}>{t('home')}</Link>
            <Link to="/prediction" className="block py-2 hover:text-white" onClick={() => setMobileOpen(false)}>{t('prediction')}</Link>
            <Link to="/dashboard" className="block py-2 hover:text-white" onClick={() => setMobileOpen(false)}>{t('dashboard')}</Link>
            <Link to="/history" className="block py-2 hover:text-white" onClick={() => setMobileOpen(false)}>{t('history')}</Link>
            <details className="py-2">
              <summary className="cursor-pointer inline-flex items-center gap-2">{t('about')}</summary>
              <div className="ml-4 mt-2 space-y-2">
                <Link to="/about" className="block hover:text-white" onClick={() => setMobileOpen(false)}>{t('about')}</Link>
                <Link to="/accesibilidad" className="block hover:text-white" onClick={() => setMobileOpen(false)}>{t('accessibility_menu') || 'Accesibilidad'}</Link>
                <Link to="/contact" className="block hover:text-white" onClick={() => setMobileOpen(false)}>{t('contact')}</Link>
              </div>
            </details>
            <button
              onClick={() => { setSearchOpen(true); setMobileOpen(false) }}
              className="w-full mt-2 inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-white/5"
              aria-label="Buscar"
            >
              <HiSearch aria-hidden /> <span>{t('search') || 'Buscar'}</span>
            </button>
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={() => setDark((prev) => !prev)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-sm"
              >
                {dark ? <FaSun aria-hidden /> : <FaMoon aria-hidden />}
                <span className="text-sm">{dark ? 'Claro' : 'Oscuro'}</span>
              </button>
              <select 
                value={lang} 
                onChange={e=> setLang(e.target.value)} 
                className="bg-white/5 text-textPrimary border border-white/10 rounded-xl px-3 py-2 text-sm"
                aria-label="Seleccionar idioma"
              >
                <option value="es">ES</option>
                <option value="en">EN</option>
              </select>
            </div>
            {!user ? (
              <Link to="/usuarios" className="block py-2 mt-2 hover:text-white" onClick={() => setMobileOpen(false)}>{t('login') || 'Login'}</Link>
            ) : (
              <button onClick={() => { logout(); setMobileOpen(false) }} className="block py-2 mt-2 text-left hover:text-white">{t('logout') || 'Logout'}</button>
            )}
          </nav>
        </div>
      )}

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
