import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useI18n } from '../contexts/I18nContext'

export default function History() {
  const { t } = useI18n()
  const [predictions, setPredictions] = useState([])

  useEffect(() => {
    // Simulación de historial (aquí conectarías con el backend)
    const mockHistory = [
      {
        id: 1,
        date: '2025-10-15',
        score: 85.5,
        risk: 'bajo',
        grades: 8.5,
        attendance: 95,
        studyHours: 20
      },
      {
        id: 2,
        date: '2025-09-20',
        score: 72.3,
        risk: 'medio',
        grades: 7.5,
        attendance: 85,
        studyHours: 12
      },
      {
        id: 3,
        date: '2025-08-10',
        score: 58.7,
        risk: 'alto',
        grades: 6.8,
        attendance: 75,
        studyHours: 8
      }
    ]
    setPredictions(mockHistory)
  }, [])

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'alto':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
      case 'medio':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
      case 'bajo':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
    }
  }

  return (
    <div className="min-h-screen py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            📊 {t('history') || 'Historial de Predicciones'}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Revisa el historial de tus predicciones anteriores y tu progreso académico
          </p>
        </div>

        {predictions.length === 0 ? (
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-semibold mb-2">
              No hay predicciones aún
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Realiza tu primera predicción para comenzar a ver tu historial
            </p>
            <a
              href="/prediction"
              className="inline-block bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Hacer una Predicción
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {predictions.map((pred, index) => (
              <motion.div
                key={pred.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm text-neutral-500 dark:text-neutral-400">
                        {new Date(pred.date).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskColor(pred.risk)}`}>
                        Riesgo: {pred.risk.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-3xl font-bold gradient-text mb-3">
                      {pred.score}%
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-neutral-500 dark:text-neutral-400">Promedio</div>
                        <div className="font-semibold">{pred.grades}</div>
                      </div>
                      <div>
                        <div className="text-neutral-500 dark:text-neutral-400">Asistencia</div>
                        <div className="font-semibold">{pred.attendance}%</div>
                      </div>
                      <div>
                        <div className="text-neutral-500 dark:text-neutral-400">Horas/sem</div>
                        <div className="font-semibold">{pred.studyHours}h</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-neutral-100 dark:bg-neutral-700 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors">
                      Ver Detalles
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {predictions.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold mb-4">
              📈 Resumen de Progreso
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-sm opacity-90 mb-1">Total de Predicciones</div>
                <div className="text-3xl font-bold">{predictions.length}</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-sm opacity-90 mb-1">Promedio General</div>
                <div className="text-3xl font-bold">
                  {(predictions.reduce((acc, p) => acc + p.score, 0) / predictions.length).toFixed(1)}%
                </div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-sm opacity-90 mb-1">Tendencia</div>
                <div className="text-3xl font-bold">
                  {predictions[0].score > predictions[predictions.length - 1].score ? '📈 Mejorando' : '📊 Estable'}
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
