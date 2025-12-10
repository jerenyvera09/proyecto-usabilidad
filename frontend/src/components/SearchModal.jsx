import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'
import { useI18n } from '../contexts/I18nContext'

export default function SearchModal({ open, onClose }){
  const { t } = useI18n()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const [active, setActive] = useState(0)

  // Rutas disponibles (mostrar traducido)
  const routes = useMemo(() => ([
    { to: '/', label: t('home') },
    { to: '/prediction', label: t('prediction') },
    { to: '/dashboard', label: t('dashboard') },
    { to: '/history', label: t('history') },
    { to: '/about', label: t('about') },
    { to: '/accesibilidad', label: t('accessibility_menu') || 'Accesibilidad' },
    { to: '/contact', label: t('contact') },
  ]), [t])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if(!q) return routes
    return routes.filter(r => r.label.toLowerCase().includes(q))
  }, [query, routes])

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        onClose?.(true) // abrir desde navbar
      }
      if (!open) return
      if (e.key === 'Escape') onClose?.()
      if (e.key === 'ArrowDown') setActive(a => Math.min(a + 1, filtered.length - 1))
      if (e.key === 'ArrowUp') setActive(a => Math.max(a - 1, 0))
      if (e.key === 'Enter') {
        const item = filtered[active]
        if (item) {
          navigate(item.to)
          onClose?.()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, filtered, active, navigate, onClose])

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0)
    } else {
      setQuery('')
      setActive(0)
    }
  }, [open])

  if(!open) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-start sm:items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Buscador">
      <button className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden onClick={() => onClose?.()} />
      <div className="relative w-full max-w-lg rounded-2xl bg-gradient-to-br from-bg800/95 via-bg900 to-bg800/90 border border-white/10 shadow-soft overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 text-textPrimary">
          <FaSearch aria-hidden className="text-uleamRed" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e)=> setQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none placeholder:text-textMuted"
            placeholder={`${t('search') || 'Buscar'}… (Ctrl+K)`}
            aria-label={t('search') || 'Buscar'}
          />
        </div>
        <ul ref={listRef} className="max-h-80 overflow-y-auto py-2 text-textPrimary">
          {filtered.length === 0 && (
            <li className="px-4 py-3 text-sm text-textMuted">{t('no_results') || 'Sin resultados'}</li>
          )}
          {filtered.map((item, idx) => (
            <li key={item.to}>
              <button
                onClick={() => { navigate(item.to); onClose?.() }}
                className={`w-full text-left px-4 py-2 rounded-lg transition ${idx===active ? 'bg-white/10' : 'hover:bg-white/5'}`}
                aria-current={idx===active}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
