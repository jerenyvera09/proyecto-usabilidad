import React from 'react'
import { motion } from 'framer-motion'
import { FaShieldAlt, FaArrowUp } from 'react-icons/fa'

export default function ResultCard({ riesgo, score, recomendacion, recomendaciones = [] }) {
  const riskLevel = (riesgo || '').toLowerCase()
  const badge = {
    alto: { color: 'bg-red-500/15 text-red-200 border-red-500/40', label: 'Alto' },
    medio: { color: 'bg-amber-500/15 text-amber-200 border-amber-500/40', label: 'Medio' },
    bajo: { color: 'bg-green-500/15 text-green-200 border-green-500/40', label: 'Bajo' },
  }[riskLevel] || { color: 'bg-white/10 text-textPrimary border-white/20', label: riesgo || '—' }

  const itemsRaw = Array.isArray(recomendaciones) && recomendaciones.length > 0 ? recomendaciones : [recomendacion]
  const items = itemsRaw.filter(Boolean)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-glass p-5 space-y-4 border-white/10"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-uleamRed to-uleamRedDark flex items-center justify-center text-white shadow-glow">
            <FaShieldAlt aria-hidden />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-textMuted">Resultado</p>
            <h3 className="text-xl font-bold text-textPrimary">Prediccion generada</h3>
          </div>
        </div>
        <span className={`badge border ${badge.color}`}>{badge.label}</span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-sm text-textMuted">Score</p>
            <div className="h-3 rounded-full bg-white/10 overflow-hidden mt-2">
              <div
                className="h-full bg-gradient-to-r from-uleamRed to-accentBlue rounded-full transition-all"
                style={{ width: `${Math.min(100, Number(score) || 0)}%` }}
              />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-textPrimary min-w-[72px] text-right">
            {String(score)}%
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center text-accentBlue">
            <FaArrowUp aria-hidden />
          </div>
          <div>
            <p className="text-sm text-textMuted">Recomendacion clave</p>
            <p className="text-sm text-textPrimary">{recomendacion}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((rec, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="p-3 rounded-xl bg-white/5 border border-white/10 text-sm text-textPrimary"
          >
            {rec}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
