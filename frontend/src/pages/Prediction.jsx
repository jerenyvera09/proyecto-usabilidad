import { useState } from 'react'
import { motion } from 'framer-motion'
import { useI18n } from '../contexts/I18nContext'

export default function Prediction() {
  const { t } = useI18n()
  const [formData, setFormData] = useState({
    grades: '',
    attendance: '',
    studyHours: '',
    previousGPA: ''
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulación de predicción (aquí conectarías con el backend)
    setTimeout(() => {
      const prediction = Math.random() * 100
      setResult({
        score: prediction.toFixed(1),
        risk: prediction < 60 ? 'alto' : prediction < 75 ? 'medio' : 'bajo'
      })
      setLoading(false)
    }, 1500)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto"
      >
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-4">
              🎯 {t('prediction') || 'Predicción de Rendimiento'}
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Ingresa tus datos académicos para obtener una predicción personalizada
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="grades" className="block text-sm font-medium mb-2">
                Promedio de Calificaciones Actual
              </label>
              <input
                type="number"
                id="grades"
                name="grades"
                value={formData.grades}
                onChange={handleChange}
                min="0"
                max="10"
                step="0.1"
                required
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Ej: 8.5"
              />
            </div>

            <div>
              <label htmlFor="attendance" className="block text-sm font-medium mb-2">
                Porcentaje de Asistencia (%)
              </label>
              <input
                type="number"
                id="attendance"
                name="attendance"
                value={formData.attendance}
                onChange={handleChange}
                min="0"
                max="100"
                required
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Ej: 90"
              />
            </div>

            <div>
              <label htmlFor="studyHours" className="block text-sm font-medium mb-2">
                Horas de Estudio Semanales
              </label>
              <input
                type="number"
                id="studyHours"
                name="studyHours"
                value={formData.studyHours}
                onChange={handleChange}
                min="0"
                required
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Ej: 15"
              />
            </div>

            <div>
              <label htmlFor="previousGPA" className="block text-sm font-medium mb-2">
                Promedio del Semestre Anterior
              </label>
              <input
                type="number"
                id="previousGPA"
                name="previousGPA"
                value={formData.previousGPA}
                onChange={handleChange}
                min="0"
                max="10"
                step="0.1"
                required
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Ej: 8.0"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '🔄 Analizando...' : '🚀 Realizar Predicción'}
            </button>
          </form>

          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className={`mt-8 p-6 rounded-xl ${
                result.risk === 'alto' 
                  ? 'bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700' 
                  : result.risk === 'medio'
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-700'
                  : 'bg-green-50 dark:bg-green-900/20 border-2 border-green-300 dark:border-green-700'
              }`}
            >
              <h3 className="text-2xl font-bold mb-4 text-center">
                Resultado de la Predicción
              </h3>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">
                  {result.score}%
                </div>
                <div className={`text-lg font-semibold ${
                  result.risk === 'alto' ? 'text-red-700 dark:text-red-400' :
                  result.risk === 'medio' ? 'text-yellow-700 dark:text-yellow-400' :
                  'text-green-700 dark:text-green-400'
                }`}>
                  Riesgo: {result.risk.toUpperCase()}
                </div>
                <p className="mt-4 text-neutral-700 dark:text-neutral-300">
                  {result.risk === 'alto' 
                    ? '⚠️ Se recomienda buscar apoyo académico adicional y revisar hábitos de estudio.'
                    : result.risk === 'medio'
                    ? '💡 Buen desempeño. Considera aumentar las horas de estudio para mejorar.'
                    : '✅ ¡Excelente! Continúa con tus buenos hábitos académicos.'}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
