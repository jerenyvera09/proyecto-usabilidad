import React from 'react'
import { motion } from 'framer-motion'

const cx = (...classes) => classes.filter(Boolean).join(' ')

export function Card({ children, className = '', interactive = false }) {
  return (
    <div className={cx('card', interactive && 'card-hover', className)}>
      {children}
    </div>
  )
}

export function GlassPanel({ children, className = '', neon = false }) {
  return (
    <div className={cx('card-glass', neon && 'neon-border', className)}>
      {children}
    </div>
  )
}

export function Section({ children, className = '' }) {
  return (
    <section className={cx('section', className)}>
      {children}
    </section>
  )
}

export function Button({
  children,
  variant = 'primary',
  className = '',
  icon: Icon,
  as: Component = 'button',
  ...props
}) {
  const variants = {
    primary: 'btn btn-primary',
    outline: 'btn btn-outline',
    ghost: 'btn btn-secondary',
    neon: 'btn gradient-primary text-white shadow-glow',
  }
  return (
    <Component className={cx(variants[variant] || variants.primary, 'active:scale-[0.98]', className)} {...props}>
      {Icon && <Icon className="text-sm" aria-hidden />}
      {children}
    </Component>
  )
}

export function InputField({
  label,
  helper,
  error,
  className = '',
  inputClassName = '',
  ...props
}) {
  return (
    <div className={cx('space-y-2', className)}>
      {label && (
        <label className="label">
          {label}
        </label>
      )}
      <input className={cx('input', error && 'input-error', inputClassName)} {...props} />
      {(helper || error) && (
        <p className={cx('text-xs', error ? 'text-red-400' : 'text-textMuted')}>
          {error || helper}
        </p>
      )}
    </div>
  )
}

export function Loader({ label = 'Cargando...' }) {
  return (
    <div className="flex items-center gap-3 text-textMuted">
      <div className="h-3 w-3 rounded-full bg-uleamRed animate-ping" />
      <div className="h-3 w-3 rounded-full bg-accentBlue animate-pulse" />
      <span className="text-sm">{label}</span>
    </div>
  )
}

export function GlassStat({ label, value, icon: Icon, accent = 'red', helper }) {
  const accentClass = accent === 'blue' ? 'text-accentBlue' : accent === 'green' ? 'text-accentGreen' : 'text-uleamRed'
  return (
    <GlassPanel neon className="p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-textMuted">{label}</p>
          <p className="text-2xl font-bold text-textPrimary mt-1">{value}</p>
          {helper && <p className="text-xs text-textMuted mt-1">{helper}</p>}
        </div>
        {Icon && (
          <div className={cx('h-11 w-11 rounded-2xl flex items-center justify-center bg-white/10 shadow-glow', accentClass)}>
            <Icon aria-hidden />
          </div>
        )}
      </div>
    </GlassPanel>
  )
}

export function StaggerList({ items = [], renderItem }) {
  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
        >
          {renderItem(item, idx)}
        </motion.div>
      ))}
    </div>
  )
}

export function Sidebar({ items = [], className = '' }) {
  return (
    <aside className={cx('card-glass p-4 space-y-2', className)}>
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/10 text-sm text-textPrimary"
        >
          <span className="flex items-center gap-2">
            {item.icon}
            {item.label}
          </span>
          {item.badge && <span className="px-2 py-0.5 text-xs rounded-full bg-white/10">{item.badge}</span>}
        </a>
      ))}
    </aside>
  )
}
