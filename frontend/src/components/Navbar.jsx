import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { I18nContext } from '../contexts/I18nContext.jsx'
import { ThemeContext } from '../contexts/ThemeContext.jsx'

export default function Navbar(){
  const { t, lang, setLang } = useContext(I18nContext)
  const { dark, setDark } = useContext(ThemeContext)
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100 dark:bg-gray-900/70 dark:border-gray-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 gap-4">
        <Link to="/" className="flex items-center gap-3 logo-link" title="EduPredict - ULEAM" aria-label="Ir al inicio">
          <div className="logo-animate" id="navbar-logo-wrap">
            <img src="/uleam-logo.png" srcSet="/uleam-logo.png 1x" alt="ULEAM" className="w-16 h-16 object-contain logo-img" role="img" />
          </div>
          <span className="font-extrabold text-lg tracking-tight">EduPredict</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="hover:text-brand">Inicio</Link>
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
          <button onClick={()=> setDark(!dark)} className="px-3 py-1 rounded-full bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] text-white shadow-sm">{dark ? '☀' : '🌙'}</button>
        </div>
      </div>
    </header>
  )
}
