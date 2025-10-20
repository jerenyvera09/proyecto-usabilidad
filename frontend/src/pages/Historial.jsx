import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useI18n } from '../contexts/I18nContext'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'

export default function Historial() {
  const { t } = useI18n()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [predicciones, setPredicciones] = useState([])
  const [loading, setLoading] = useState(true)

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
      case 'bajo': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20'
      case 'medio': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20'
      case 'alto': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20'
      default: return 'text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800'
    }
  }

  if (!isAuthenticated()) {
    return null
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-12">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold gradient-text mb-2">
            📜 {t('nav_history') || 'Historial de Predicciones'}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            {t('history_subtitle') || 'Revisa tus predicciones anteriores y tu progreso'}
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent" />
          </div>
        ) : predicciones.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card p-12 text-center"
          >
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold mb-2">
              {t('history_empty') || 'No hay predicciones todavía'}
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              {t('history_empty_desc') || 'Realiza tu primera predicción para comenzar'}
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-primary"
            >
              🎯 {t('predict_button') || 'Hacer Predicción'}
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
                className="card p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-4 py-2 rounded-full font-bold uppercase text-sm ${getRiesgoColor(pred.riesgo)}`}>
                        {pred.riesgo}
                      </span>
                      <span className="text-2xl font-bold text-neutral-700 dark:text-neutral-300">
                        {pred.score}/100
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-neutral-500 dark:text-neutral-400 mb-1">📊 Promedio</p>
                        <p className="font-semibold">{pred.nota_promedio}</p>
                      </div>
                      <div>
                        <p className="text-neutral-500 dark:text-neutral-400 mb-1">✅ Asistencia</p>
                        <p className="font-semibold">{pred.asistencia}%</p>
                      </div>
                      <div>
                        <p className="text-neutral-500 dark:text-neutral-400 mb-1">📚 Hrs. Estudio</p>
                        <p className="font-semibold">{pred.horas_estudio}h</p>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700">
                      <p className="text-sm">
                        <span className="font-medium">💡 Recomendación:</span> {pred.recomendacion}
                      </p>
                    </div>
                  </div>

                  <div className="text-sm text-neutral-500 dark:text-neutral-400 md:text-right">
                    <p className="font-medium mb-1">📅 Fecha</p>
                    <p>{new Date(pred.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</p>
                    <p className="text-xs mt-1">
                      {new Date(pred.created_at).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {predicciones.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-primary"
            >
              ➕ {t('predict_new') || 'Nueva Predicción'}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
