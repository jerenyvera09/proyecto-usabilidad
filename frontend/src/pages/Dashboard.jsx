import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useI18n } from '../contexts/I18nContext'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'

export default function Dashboard() {
  const { t } = useI18n()
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [stats, setStats] = useState(null)
  
  const [formData, setFormData] = useState({
    nota_promedio: '',
    asistencia: '',
    horas_estudio: ''
  })

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/usuarios')
      return
    }
    loadStats()
  }, [isAuthenticated, navigate])

  const loadStats = async () => {
    try {
      const response = await api.get('/stats')
      setStats(response.data)
    } catch (error) {
      console.error('Error al cargar estadísticas:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const response = await api.post('/predict', {
        nota_promedio: parseFloat(formData.nota_promedio),
        asistencia: parseInt(formData.asistencia),
        horas_estudio: parseInt(formData.horas_estudio)
      })
      
      setResult(response.data)
      setFormData({ nota_promedio: '', asistencia: '', horas_estudio: '' })
      loadStats() // Recargar stats después de nueva predicción
    } catch (error) {
      console.error('Error en predicción:', error)
      alert(t('msg_error') || 'Error al realizar la predicción')
    } finally {
      setLoading(false)
    }
  }

  const getRiesgoColor = (riesgo) => {
    switch (riesgo?.toLowerCase()) {
      case 'bajo': return 'text-green-600 dark:text-green-400'
      case 'medio': return 'text-yellow-600 dark:text-yellow-400'
      case 'alto': return 'text-red-600 dark:text-red-400'
      default: return 'text-neutral-600 dark:text-neutral-400'
    }
  }

  const getRiesgoBg = (riesgo) => {
    switch (riesgo?.toLowerCase()) {
      case 'bajo': return 'bg-green-100 dark:bg-green-900/20'
      case 'medio': return 'bg-yellow-100 dark:bg-yellow-900/20'
      case 'alto': return 'bg-red-100 dark:bg-red-900/20'
      default: return 'bg-neutral-100 dark:bg-neutral-800'
    }
  }

  if (!isAuthenticated()) {
    return null // El useEffect redireccionará
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-12">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold gradient-text mb-2">
            {t('dashboard_title') || 'Dashboard'}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            {t('dashboard_welcome') || 'Bienvenido/a'}, <span className="font-semibold">{user?.nombre}</span>
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulario de Predicción */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="card p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                🎯 {t('predict_title') || 'Nueva Predicción'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="label">
                    📊 {t('predict_average') || 'Nota Promedio'} (0-10)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    required
                    className="input"
                    value={formData.nota_promedio}
                    onChange={(e) => setFormData({ ...formData, nota_promedio: e.target.value })}
                    placeholder="8.5"
                  />
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Ingresa tu promedio de calificaciones actual
                  </p>
                </div>

                <div>
                  <label className="label">
                    ✅ {t('predict_attendance') || 'Porcentaje de Asistencia'} (0-100)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    className="input"
                    value={formData.asistencia}
                    onChange={(e) => setFormData({ ...formData, asistencia: e.target.value })}
                    placeholder="85"
                  />
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Porcentaje de clases a las que has asistido
                  </p>
                </div>

                <div>
                  <label className="label">
                    📚 {t('predict_hours') || 'Horas de Estudio Semanal'} (0-50)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    required
                    className="input"
                    value={formData.horas_estudio}
                    onChange={(e) => setFormData({ ...formData, horas_estudio: e.target.value })}
                    placeholder="15"
                  />
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Horas promedio que dedicas al estudio por semana
                  </p>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn btn-primary w-full py-3 text-lg font-semibold"
                >
                  {loading ? (
                    <>⏳ {t('msg_loading') || 'Procesando...'}</>
                  ) : (
                    <>🚀 {t('predict_button') || 'Calcular Predicción'}</>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Estadísticas */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Resultado de predicción */}
            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`card p-6 ${getRiesgoBg(result.riesgo)}`}
              >
                <h3 className="text-xl font-bold mb-4">📈 {t('predict_result') || 'Resultado'}</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Nivel de Riesgo</p>
                    <p className={`text-3xl font-bold uppercase ${getRiesgoColor(result.riesgo)}`}>
                      {result.riesgo}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Score</p>
                    <p className="text-2xl font-bold">{result.score}/100</p>
                  </div>
                  <div className="pt-3 border-t border-neutral-300 dark:border-neutral-600">
                    <p className="text-sm font-medium">💡 Recomendación:</p>
                    <p className="text-sm mt-1">{result.recomendacion}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Stats generales */}
            {stats && (
              <div className="card p-6">
                <h3 className="text-xl font-bold mb-4">📊 {t('stats_title') || 'Tus Estadísticas'}</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Total predicciones:</span>
                    <span className="font-bold">{stats.total_predicciones || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Promedio Score:</span>
                    <span className="font-bold">{stats.promedio_score?.toFixed(1) || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Última predicción:</span>
                    <span className="font-bold text-xs">
                      {stats.ultima_prediccion 
                        ? new Date(stats.ultima_prediccion).toLocaleDateString() 
                        : 'N/A'
                      }
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Enlace al historial */}
            <button
              onClick={() => navigate('/historial')}
              className="btn btn-outline w-full"
            >
              📜 {t('nav_history') || 'Ver Historial Completo'}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
