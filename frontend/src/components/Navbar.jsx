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

  const navLinkBase = 'nav-link inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all text-textPrimary border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-accentPurple'

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10 shadow-soft">
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/0 pointer-events-none" aria-hidden />
        <div className="relative w-full flex items-center justify-between px-3 py-2 gap-3">
          <Link to="/" className="flex items-center gap-2 logo-link focus-visible pl-1 ml-0 max-w-[45%] sm:max-w-[38%] overflow-hidden" title="EduPredict - ULEAM" aria-label="Ir al inicio">
            <img src="/uleam-official.png" alt="Logo ULEAM" className="logo-img h-10 w-auto object-contain shrink-0" />
            <div className="flex flex-col leading-tight min-w-0">
              <span className="header-text font-extrabold text-2xl sm:text-[1.65rem] tracking-tight">Uleam</span>
              <span className="header-subtext font-medium text-[10px] sm:text-[11px] leading-[1.05rem] tracking-normal uppercase break-words">
                UNIVERSIDAD LAICA ELOY ALFARO DE MANABÍ
              </span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="header-subtext font-semibold text-xs tracking-tight">EduPredict</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            <Link to="/" className={navLinkBase}>
              <span className="nav-icon"><HiHome aria-hidden /></span> <span>{t('home')}</span>
            </Link>
            <Link to="/prediction" className={navLinkBase}>
              <span className="nav-icon"><HiChartBar aria-hidden /></span> <span>{t('prediction')}</span>
            </Link>
            <Link to="/dashboard" className={navLinkBase}>
              <span className="nav-icon"><HiTemplate aria-hidden /></span> <span>{t('dashboard')}</span>
            </Link>
            <Link to="/history" className={navLinkBase}>
              <span className="nav-icon"><HiClock aria-hidden /></span> <span>{t('history')}</span>
            </Link>
            <div className="relative">
              <button
                className={`${navLinkBase} gap-1`}
                onClick={() => setAboutOpen((v) => !v)}
                aria-expanded={aboutOpen}
                aria-haspopup="menu"
              >
                {t('about')} <span className="nav-icon"><HiChevronDown aria-hidden /></span>
              </button>
              {aboutOpen && (
                <div role="menu" className="absolute mt-3 right-0 w-56 rounded-2xl border border-white/10 bg-bg800/95 shadow-soft p-2">
                  <Link to="/about" className="block px-3 py-2 rounded-xl hover:bg-white/10" role="menuitem" onClick={() => setAboutOpen(false)}>
                    {t('about')}
                  </Link>
                  <Link to="/accesibilidad" className="block px-3 py-2 rounded-xl hover:bg-white/10" role="menuitem" onClick={() => setAboutOpen(false)}>
                    {t('accessibility_menu') || 'Accesibilidad'}
                  </Link>
                  <Link to="/contact" className="block px-3 py-2 rounded-xl hover:bg-white/10" role="menuitem" onClick={() => setAboutOpen(false)}>
                    {t('contact')}
                  </Link>
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setSearchOpen(true)}
              className={`${navLinkBase} hidden md:inline-flex`}
              aria-label="Buscar"
              title="Buscar (Ctrl+K)"
            >
              <span className="nav-icon"><HiSearch aria-hidden /></span>
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
              className="lang-select bg-transparent text-textPrimary border-0 px-2 py-2 text-sm focus-visible"
              aria-label="Seleccionar idioma"
            >
              <option value="es">ES</option>
              <option value="en">EN</option>
            </select>

            {!user ? (
              <Link to="/usuarios" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-uleamRed to-accentBlue text-white shadow-glow hover:opacity-95 transition text-sm ml-2">
                <HiLogin aria-hidden /> <span className="text-sm">{t('login') || 'Login'}</span>
              </Link>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-sm"
                  aria-haspopup="menu"
                  aria-expanded={profileOpen}
                  title={user?.nombre || user?.email}
                >
                  <HiUserCircle aria-hidden /> <span className="text-sm">{user?.nombre || user?.email}</span>
                </button>
                {profileOpen && (
                  <div className="absolute mt-3 right-0 bg-bg800/95 border border-white/10 rounded-2xl shadow-soft w-56 py-2 z-50 backdrop-blur-xl">
                    <Link to="/dashboard" className="block px-4 py-2 text-sm hover:bg-white/10" onClick={() => setProfileOpen(false)}>{t('dashboard')}</Link>
                    {user?.is_admin && (
                      <Link to="/admin" className="block px-4 py-2 text-sm hover:bg-white/10" onClick={() => setProfileOpen(false)}>Administrar usuarios</Link>
                    )}
                    <button onClick={() => { logout(); setProfileOpen(false) }} className="w-full text-left px-4 py-2 text-sm hover:bg-white/10">{t('logout') || 'Logout'}</button>
                  </div>
                )}
              </div>
            )}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden p-2 rounded-xl border border-white/10 bg-white/10"
              aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <HiX /> : <HiMenu />}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed top[70px] left-0 right-0 z-40 md:hidden bg-bg900/95 border-b border-white/10 shadow-soft">
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
              className={`${navLinkBase} w-full mt-2`}
              aria-label="Buscar"
            >
              <HiSearch aria-hidden /> <span>{t('search') || 'Buscar'}</span>
            </button>
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={() => setDark((prev) => !prev)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/10 text-sm"
              >
                {dark ? <HiSun aria-hidden /> : <HiMoon aria-hidden />}
                <span className="text-sm">{dark ? 'Claro' : 'Oscuro'}</span>
              </button>
              <select
                value={lang}
                onChange={e=> setLang(e.target.value)}
                className="lang-select bg-transparent text-textPrimary border-0 px-2 py-2 text-sm"
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
