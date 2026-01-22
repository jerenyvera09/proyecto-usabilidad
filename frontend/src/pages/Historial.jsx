import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useI18n } from '../contexts/I18nContext'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')

export default function Historial() {
  const { t, lang } = useI18n()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [predicciones, setPredicciones] = useState([])
  const [loading, setLoading] = useState(true)

  // Helper para formatear fechas según el idioma
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString(lang === 'en' ? 'en-US' : 'es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString(lang === 'en' ? 'en-US' : 'es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/usuarios')
      return
    }
    loadHistorial()
  }, [isAuthenticated, navigate])

  const loadHistorial = async () => {
    try {
      const response = await api.get('/students/me/predicciones')
      setPredicciones(response.data)
    } catch (error) {
      console.error('Error al cargar historial:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRiesgoColor = (riesgo) => {
    switch (riesgo?.toLowerCase()) {
      case 'bajo':
        return 'bg-accentBlue/15 text-accentBlue'
      case 'medio':
        return 'bg-accentPurple/15 text-accentPurple'
      case 'alto':
        return 'bg-uleamRed/20 text-uleamRed'
      default:
        return 'bg-white/10 text-textPrimary'
    }
  }

  if (!isAuthenticated()) {
    return null
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container-custom">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">
            {t('history_page_title')}
          </h1>
          <p className="text-textMuted">
            {t('history_user_subtitle')}
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-uleamRed border-t-transparent" />
          </div>
        ) : predicciones.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-glass p-12 text-center space-y-3"
          >
            <div className="text-6xl mb-4">i</div>
            <h3 className="text-2xl font-bold mb-2">{t('history_empty')}</h3>
            <p className="text-textMuted mb-6">
              {t('history_empty_desc')}
            </p>
            <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
              {t('btn_make_prediction')}
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {predicciones.map((pred, index) => (
              <motion.div
                key={pred.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card-glass p-6 hover:shadow-soft transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-4 py-2 rounded-full font-bold uppercase text-sm ${getRiesgoColor(pred.riesgo)}`}>
                        {pred.riesgo}
                      </span>
                      <span className="text-2xl font-bold text-textPrimary">
                        {pred.score}/100
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-textMuted mb-1">{t('card_average')}</p>
                        <p className="font-semibold">{pred.promedio}</p>
                      </div>
                      <div>
                        <p className="text-textMuted mb-1">{t('card_attendance')}</p>
                        <p className="font-semibold">{pred.asistencia}%</p>
                      </div>
                      <div>
                        <p className="text-textMuted mb-1">{t('card_hours_study')}</p>
                        <p className="font-semibold">{pred.horas_estudio}h</p>
                      </div>
                    </div>

                    <div className="text-xs text-textMuted mt-1">
                      {t('card_trend')}: {pred.tendencia} | {t('card_punctuality')}: {pred.puntualidad}% | {t('card_habits')}: {pred.habitos}
                    </div>

                    <div className="mt-3 pt-3 border-t border-white/10">
                      <p className="text-sm">
                        <span className="font-medium">{t('card_recommendation')}:</span> {pred.recomendacion}
                      </p>
                    </div>
                  </div>

                  <div className="text-sm text-textMuted md:text-right space-y-2">
                    <div>
                      <p className="font-medium mb-1">{t('card_date')}</p>
                      <p>
                        {formatDate(pred.created_at)}
                      </p>
                      <p className="text-xs mt-1">
                        {formatTime(pred.created_at)}
                      </p>
                    </div>
                    {pred.pdf_url && (
                      <a className="btn btn-outline" href={`${API_BASE}${pred.pdf_url}`}>
                        {t('btn_download_pdf')}
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {predicciones.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8 text-center">
            <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
              {t('btn_new_prediction')}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
