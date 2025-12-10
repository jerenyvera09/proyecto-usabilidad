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
import ResultCard from '../components/ResultCard'
import api from '../lib/api'
import { Card, GlassPanel, Section, Button, InputField } from '../components/ui/Primitives'
import { chartTheme, chartColors, datasetStyles } from '../lib/chartTheme'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

const initialForm = {
  promedio: '',
  asistencia: '',
  horas_estudio: '',
  tendencia: '',
  puntualidad: '',
  habitos: ''
}

export default function Prediction() {
  const { t } = useI18n()
  const [formData, setFormData] = useState(initialForm)
  const [result, setResult] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    loadStats()
  }, [])

  const showToast = (type, message) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3000)
  }

  const loadStats = async () => {
    try {
      const { data } = await api.get('/stats')
      setStats(data)
    } catch (err) {
      console.error('Error cargando stats', err)
      showToast('error', 'No pudimos cargar las estadisticas')
    }
  }

  const validateForm = () => {
    const promedio = parseFloat(formData.promedio)
    const asistencia = parseFloat(formData.asistencia)
    const horas = parseFloat(formData.horas_estudio)
    const tendencia = parseFloat(formData.tendencia)
    const puntualidad = parseFloat(formData.puntualidad)
    const habitos = parseFloat(formData.habitos)

    if (Number.isNaN(promedio) || promedio < 0 || promedio > 10) return 'El promedio debe estar entre 0 y 10 (usa punto decimal).'
    if (Number.isNaN(asistencia) || asistencia < 0 || asistencia > 100) return 'La asistencia debe estar entre 0 y 100.'
    if (Number.isNaN(horas) || horas < 0) return 'Las horas de estudio deben ser 0 o mas.'
    if (Number.isNaN(tendencia) || tendencia < -10 || tendencia > 10) return 'La tendencia debe estar entre -10 y 10.'
    if (Number.isNaN(puntualidad) || puntualidad < 0 || puntualidad > 100) return 'La puntualidad debe estar entre 0 y 100.'
    if (Number.isNaN(habitos) || habitos < 0 || habitos > 10) return 'Habitos debe estar entre 0 y 10.'
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setResult(null)

    const errorMsg = validateForm()
    if (errorMsg) {
      showToast('error', errorMsg)
      return
    }

    setLoading(true)
    try {
      const payload = {
        promedio: parseFloat(formData.promedio),
        asistencia: parseFloat(formData.asistencia),
        horas_estudio: parseFloat(formData.horas_estudio),
        tendencia: parseFloat(formData.tendencia),
        puntualidad: parseFloat(formData.puntualidad),
        habitos: parseFloat(formData.habitos)
      }
      const { data } = await api.post('/predict', payload)
      setResult(data)
      setFormData(initialForm)
      loadStats()
      showToast('success', 'Prediccion generada con exito')
    } catch (err) {
      console.error('Predict error:', err)
      showToast('error', 'No pudimos procesar la prediccion. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleDownloadPdf = async () => {
    if (!result?.pdf_url) return
    setPdfLoading(true)
    try {
      const base = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')
      const pdfEndpoint = `${base}${result.pdf_url}`
      const response = await fetch(pdfEndpoint)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'reporte-prediccion.pdf'
      a.click()
      window.URL.revokeObjectURL(url)
      showToast('success', 'PDF generado')
    } catch (err) {
      console.error('PDF error', err)
      showToast('error', 'No se pudo generar el PDF. Intenta nuevamente.')
    } finally {
      setPdfLoading(false)
    }
  }

  const riskChartData = {
    labels: ['Alto', 'Medio', 'Bajo'],
    datasets: [
      {
        label: 'Distribucion de riesgo',
        data: stats
          ? [stats.riesgo_alto || 0, stats.riesgo_medio || 0, stats.riesgo_bajo || 0]
          : [1, 1, 1],
        backgroundColor: [chartColors.red, chartColors.amber, chartColors.green],
        ...datasetStyles(chartColors.border),
        hoverOffset: 10,
      }
    ]
  }

  const scoreChartData = {
    labels: ['Score promedio', 'Alertas'],
    datasets: [
      {
        label: 'Metrica global',
        data: [stats?.score_promedio || 0, stats?.alertas_tempranas || 0],
        backgroundColor: [chartColors.blue, chartColors.red],
        ...datasetStyles(chartColors.border),
      }
    ]
  }

  const donutOptions = chartTheme({ cutout: '70%', scales: false })
  const barOptions = chartTheme()

  return (
    <div className="space-y-8">
      <Section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-uleamRed/15 via-grayDark/25 to-uleamRedDark/15 blur-3xl" aria-hidden />
        <div className="relative space-y-3">
          <p className="text-sm uppercase tracking-[0.25em] text-textMuted">Prediccion 2025</p>
          <h1 className="text-3xl md:text-4xl font-extrabold gradient-text">
            {t('prediction') || 'Prediccion de Rendimiento'}
          </h1>
          <p className="text-textMuted">Ingresa tus datos academicos y habitos. Usa punto decimal (2.4) para obtener mayor precision.</p>
        </div>
      </Section>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-7 space-y-4">
          <Card className="p-6 space-y-6">
            {toast && (
              <div className={`rounded-xl px-4 py-3 text-sm border ${toast.type === 'success' ? 'border-green-500/60 bg-green-500/10 text-green-200' : 'border-red-500/60 bg-red-500/10 text-red-200'}`}>
                {toast.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Promedio general (0-10)"
                name="promedio"
                type="number"
                min="0"
                max="10"
                step="0.1"
                required
                value={formData.promedio}
                onChange={handleChange}
                placeholder="Ej: 8.5"
                helper="Usa punto decimal (2.4)"
              />
              <InputField
                label="Asistencia (%)"
                name="asistencia"
                type="number"
                min="0"
                max="100"
                required
                value={formData.asistencia}
                onChange={handleChange}
                placeholder="Ej: 92"
                helper="Usa punto decimal (92.5)"
              />
              <InputField
                label="Horas de estudio semanales"
                name="horas_estudio"
                type="number"
                min="0"
                max="60"
                required
                value={formData.horas_estudio}
                onChange={handleChange}
                placeholder="Ej: 14"
              />
              <InputField
                label="Tendencia academica (variacion)"
                name="tendencia"
                type="number"
                min="-10"
                max="10"
                step="0.1"
                required
                value={formData.tendencia}
                onChange={handleChange}
                placeholder="Ej: 0.3"
                helper="Usa punto decimal (0.3)"
              />
              <InputField
                label="Puntualidad (%)"
                name="puntualidad"
                type="number"
                min="0"
                max="100"
                required
                value={formData.puntualidad}
                onChange={handleChange}
                placeholder="Ej: 90"
              />
              <InputField
                label="Habitos de estudio (0-10)"
                name="habitos"
                type="number"
                min="0"
                max="10"
                step="0.1"
                required
                value={formData.habitos}
                onChange={handleChange}
                placeholder="Ej: 7"
                helper="Usa punto decimal (7.5)"
              />

              <div className="md:col-span-2">
                <Button
                  type="submit"
                  variant="neon"
                  disabled={loading}
                  className="w-full py-3 text-lg font-semibold"
                >
                  {loading ? 'Analizando...' : 'Realizar prediccion'}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-5 space-y-4">
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <ResultCard
                riesgo={result.riesgo}
                score={result.score}
                recomendacion={result.recomendacion}
                recomendaciones={result.recomendaciones}
              />
              <div className="flex flex-wrap gap-3 mt-4">
                <Button
                  onClick={handleDownloadPdf}
                  disabled={pdfLoading}
                  variant="outline"
                >
                  {pdfLoading ? 'Generando PDF...' : 'Generar PDF'}
                </Button>
                <Button
                  onClick={loadStats}
                  variant="ghost"
                >
                  Actualizar dashboard
                </Button>
              </div>
            </motion.div>
          )}

          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Mini dashboard</h2>
                <p className="text-textMuted text-sm">Metrica global, distribucion de riesgo y estado del modelo</p>
              </div>
              {stats?.modelo?.best_model && (
                <div className="px-3 py-2 rounded-lg bg-white/10 text-xs text-textPrimary">
                  Mejor modelo: {stats.modelo.best_model} (F1: {stats.modelo.metrics?.f1_weighted?.toFixed(3)})
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-xs text-textMuted">Total predicciones</p>
                <p className="text-xl font-bold">{stats?.total_predicciones ?? '—'}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-xs text-textMuted">Score promedio</p>
                <p className="text-xl font-bold">{stats?.score_promedio ? `${stats.score_promedio}%` : '—'}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-xs text-textMuted">Ultimo entrenamiento</p>
                <p className="text-xs font-semibold">{stats?.modelo?.trained_at ? new Date(stats.modelo.trained_at).toLocaleString() : 'Pendiente'}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <GlassPanel neon className="p-5 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-[280px]">
            <Doughnut data={riskChartData} options={donutOptions} />
          </div>
          <div className="h-[280px]">
            <Bar data={scoreChartData} options={barOptions} />
          </div>
        </div>
      </GlassPanel>

      {toast && (
        <div className="fixed top-24 right-6 z-50">
          <div className={`px-4 py-3 rounded-xl shadow-soft border ${toast.type === 'success' ? 'border-green-500/50 bg-green-500/15 text-green-100' : 'border-red-500/50 bg-red-500/15 text-red-100'}`}>
            {toast.message}
          </div>
        </div>
      )}
    </div>
  )
}
