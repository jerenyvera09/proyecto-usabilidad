import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useI18n } from '../contexts/I18nContext'
import api from '../lib/api'

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')

export default function History() {
  const { t } = useI18n()
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/students')
        setPredictions(data || [])
      } catch (err) {
        console.error('Error cargando historial', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'alto':
        return 'bg-uleamRed/20 text-uleamRed'
      case 'medio':
        return 'bg-accentPurple/15 text-accentPurple'
      case 'bajo':
        return 'bg-accentBlue/15 text-accentBlue'
      default:
        return 'bg-white/10 text-textPrimary'
    }
  }

  return (
    <div className="min-h-screen py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto space-y-6"
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            {t('history') || 'Historial de Predicciones'}
          </h1>
          <p className="text-textMuted">
            Revisa el historial global de predicciones y tendencias
          </p>
        </div>

        {loading ? (
          <div className="card-glass p-8 text-center">Cargando...</div>
        ) : predictions.length === 0 ? (
          <div className="card-glass p-12 text-center space-y-4">
            <div className="text-6xl mb-4">i</div>
            <h3 className="text-2xl font-semibold mb-2">No hay predicciones aun</h3>
            <p className="text-textMuted mb-6">
              Realiza tu primera prediccion para comenzar a ver el historial
            </p>
            <a
              href="/prediction"
              className="btn btn-primary px-6 py-3 rounded-lg font-semibold shadow-soft"
            >
              Hacer una Prediccion
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {predictions.map((pred, index) => (
              <motion.div
                key={pred.id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="card-glass p-6 hover:shadow-soft transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm text-textMuted">
                        {pred.created_at
                          ? new Date(pred.created_at).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : 'Fecha desconocida'}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskColor(pred.riesgo)}`}>
                        Riesgo: {pred.riesgo?.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-3xl font-bold gradient-text mb-3">{pred.score}%</div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-textMuted">Promedio</div>
                        <div className="font-semibold">{pred.promedio}</div>
                      </div>
                      <div>
                        <div className="text-textMuted">Asistencia</div>
                        <div className="font-semibold">{pred.asistencia}%</div>
                      </div>
                      <div>
                        <div className="text-textMuted">Horas/sem</div>
                        <div className="font-semibold">{pred.horas_estudio}h</div>
                      </div>
                    </div>
                    <div className="text-xs text-textMuted mt-2">
                      Tendencia: {pred.tendencia} | Puntualidad: {pred.puntualidad}% | Habitos: {pred.habitos}
                    </div>
                  </div>
                  {pred.pdf_url && (
                    <div className="flex items-center gap-2">
                      <a
                        href={`${API_BASE}${pred.pdf_url}`}
                        className="btn btn-secondary px-4 py-2"
                      >
                        Descargar PDF
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
