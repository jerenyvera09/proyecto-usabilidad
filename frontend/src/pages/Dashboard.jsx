import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'
import { useI18n } from '../contexts/I18nContext'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import ResultCard from '../components/ResultCard'
import { Card, GlassPanel, Section, Button, InputField, GlassStat } from '../components/ui/Primitives'
import { chartTheme, chartColors, datasetStyles } from '../lib/chartTheme'
import { FaBell, FaChartPie, FaShieldAlt, FaTrophy } from 'react-icons/fa'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

const initialForm = {
  promedio: '',
  asistencia: '',
  horas_estudio: '',
  tendencia: '',
  puntualidad: '',
  habitos: ''
}

export default function Dashboard() {
  const { t } = useI18n()
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [stats, setStats] = useState(null)
  const [formData, setFormData] = useState(initialForm)
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/usuarios')
      return
    }
    loadStats()
  }, [isAuthenticated, navigate])

  const loadStats = async () => {
    setLoadingStats(true)
    try {
      const response = await api.get('/stats')
      setStats(response.data)
    } catch (error) {
      console.error('Error al cargar estadisticas:', error)
    } finally {
      setLoadingStats(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const payload = {
        promedio: parseFloat(formData.promedio),
        asistencia: parseFloat(formData.asistencia),
        horas_estudio: parseFloat(formData.horas_estudio),
        tendencia: parseFloat(formData.tendencia),
        puntualidad: parseFloat(formData.puntualidad),
        habitos: parseFloat(formData.habitos)
      }

      const response = await api.post('/predict', payload)
      setResult(response.data)
      setFormData(initialForm)
      loadStats()
    } catch (error) {
      console.error('Error en prediccion:', error)
      alert(t('msg_error') || 'Error al realizar la prediccion')
    } finally {
      setLoading(false)
    }
  }

  const getRiesgoColor = (riesgo) => {
    switch (riesgo?.toLowerCase()) {
      case 'bajo':
        return 'text-green-400'
      case 'medio':
        return 'text-amber-300'
      case 'alto':
        return 'text-red-400'
      default:
        return 'text-textMuted'
    }
  }

  if (!isAuthenticated()) {
    return null
  }

  const metrics = [
    {
      label: 'Total predicciones',
      value: stats?.total_predicciones ?? '—',
      helper: 'Historial acumulado',
      icon: FaChartPie,
      accent: 'red',
    },
    {
      label: 'Score promedio',
      value: stats?.score_promedio ? `${stats.score_promedio.toFixed(1)}%` : '—',
      helper: 'Rendimiento global',
      icon: FaShieldAlt,
      accent: 'blue',
    },
    {
      label: 'Alertas',
      value: stats?.alertas_tempranas ?? '0',
      helper: 'Detecciones tempranas',
      icon: FaBell,
      accent: 'red',
    },
    {
      label: 'Mejor modelo (F1)',
      value: stats?.modelo?.metrics?.f1_weighted ? stats.modelo.metrics.f1_weighted.toFixed(3) : '—',
      helper: stats?.modelo?.best_model || 'Sin modelo',
      icon: FaTrophy,
      accent: 'blue',
    },
  ]

  const riskChartData = {
    labels: ['Alto', 'Medio', 'Bajo'],
    datasets: [
      {
        label: 'Riesgo',
        data: stats
          ? [stats.riesgo_alto || 0, stats.riesgo_medio || 0, stats.riesgo_bajo || 0]
          : [1, 1, 1],
        backgroundColor: [chartColors.red, chartColors.amber, chartColors.green],
        ...datasetStyles(chartColors.border),
        hoverOffset: 10,
      }
    ]
  }

  const barData = {
    labels: ['Score promedio', 'Alertas tempranas'],
    datasets: [
      {
        label: 'Métrica',
        data: [stats?.score_promedio || 0, stats?.alertas_tempranas || 0],
        backgroundColor: [chartColors.blue, chartColors.red],
        ...datasetStyles(chartColors.border),
      }
    ]
  }

  const donutOptions = chartTheme({
    cutout: '70%',
    scales: false,
    plugins: {
      legend: { position: 'top', align: 'end' },
    },
  })

  const barOptions = chartTheme()

  return (
    <div className="space-y-8">
      <Section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-uleamRed/15 via-grayDark/30 to-uleamRedDark/15 blur-3xl" aria-hidden />
        <div className="relative space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-textMuted">Panel de control</p>
          <h1 className="text-3xl md:text-4xl font-extrabold gradient-text">Tech Dashboard 2025</h1>
          <p className="text-textMuted">Visión general de tus predicciones y estado del modelo. Bienvenido/a, <span className="text-textPrimary font-semibold">{user?.nombre}</span></p>
        </div>
      </Section>

      <div className="grid grid-cols-12 gap-6">
        {loadingStats
          ? Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="col-span-12 sm:col-span-6 lg:col-span-3">
              <div className="card-glass p-5 skeleton h-full" />
            </div>
          ))
          : metrics.map((item) => (
            <div key={item.label} className="col-span-12 sm:col-span-6 lg:col-span-3">
              <GlassStat {...item} />
            </div>
          ))
        }
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-7">
          <Card className="p-6 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-textMuted uppercase tracking-wide">Prediccion rapida</p>
                <h2 className="text-2xl font-bold text-textPrimary">Nueva Prediccion</h2>
                <p className="text-sm text-textMuted">Usa punto decimal (2.4) para mayor precision.</p>
              </div>
              {loading && <div className="text-xs text-accentBlue animate-pulse-soft">Procesando...</div>}
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'promedio', label: 'Promedio (0-10)', min: 0, max: 10, step: 0.1, placeholder: '8.5' },
                { name: 'asistencia', label: 'Asistencia %', min: 0, max: 100, placeholder: '92' },
                { name: 'horas_estudio', label: 'Horas de estudio (0-60)', min: 0, max: 60, placeholder: '14' },
                { name: 'tendencia', label: 'Tendencia academica', min: -10, max: 10, step: 0.1, placeholder: '0.3' },
                { name: 'puntualidad', label: 'Puntualidad %', min: 0, max: 100, placeholder: '90' },
                { name: 'habitos', label: 'Habitos (0-10)', min: 0, max: 10, step: 0.1, placeholder: '7' }
              ].map((input) => (
                <InputField
                  key={input.name}
                  label={input.label}
                  type="number"
                  required
                  min={input.min}
                  max={input.max}
                  step={input.step || 1}
                  value={formData[input.name]}
                  onChange={(e) => setFormData({ ...formData, [input.name]: e.target.value })}
                  placeholder={input.placeholder}
                  helper="Usa punto decimal (2.4)"
                />
              ))}

              <div className="md:col-span-2">
                <Button
                  type="submit"
                  variant="neon"
                  disabled={loading}
                  className="w-full py-3 text-lg font-semibold"
                >
                  {loading ? 'Procesando...' : 'Calcular Prediccion'}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-5 space-y-4">
          {loadingStats ? (
            <div className="card-glass p-5 skeleton h-[220px]" />
          ) : (
            <Card className="p-5 space-y-4">
              <h3 className="text-xl font-bold text-textPrimary">Resumen</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-textMuted">Total predicciones</p>
                  <p className="text-xl font-semibold">{stats?.total_predicciones ?? 0}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-textMuted">Alertas</p>
                  <p className="text-xl font-semibold text-red-400">{stats?.alertas_tempranas ?? 0}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-textMuted">Score promedio</p>
                  <p className="text-xl font-semibold">{stats?.score_promedio ? stats.score_promedio.toFixed(1) : '—'}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-textMuted">Ultimo entrenamiento</p>
                  <p className="text-sm font-semibold">{stats?.modelo?.trained_at ? new Date(stats.modelo.trained_at).toLocaleString() : 'Pendiente'}</p>
                </div>
              </div>
            </Card>
          )}

          {result && (
            <ResultCard
              riesgo={result.riesgo}
              score={result.score}
              recomendacion={result.recomendacion}
              recomendaciones={result.recomendaciones}
            />
          )}

          <Button variant="outline" className="w-full" onClick={() => navigate('/historial')}>
            {t('nav_history') || 'Ver Historial Completo'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 items-stretch">
        <div className="col-span-12 lg:col-span-6">
          <GlassPanel neon className="p-4 md:p-6 h-[320px]">
            {loadingStats ? (
              <div className="skeleton h-full w-full" />
            ) : (
              <Doughnut data={riskChartData} options={donutOptions} />
            )}
          </GlassPanel>
        </div>
        <div className="col-span-12 lg:col-span-6">
          <GlassPanel neon className="p-4 md:p-6 h-[320px]">
            {loadingStats ? (
              <div className="skeleton h-full w-full" />
            ) : (
              <Bar data={barData} options={barOptions} />
            )}
          </GlassPanel>
        </div>
      </div>
    </div>
  )
}
