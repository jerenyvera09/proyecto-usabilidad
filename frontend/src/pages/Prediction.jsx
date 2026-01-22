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
      showToast('error', t('toast_stats_error'))
    }
  }

  const validateForm = () => {
    const promedio = parseFloat(formData.promedio)
    const asistencia = parseFloat(formData.asistencia)
    const horas = parseFloat(formData.horas_estudio)
    const tendencia = parseFloat(formData.tendencia)
    const puntualidad = parseFloat(formData.puntualidad)
    const habitos = parseFloat(formData.habitos)

    if (Number.isNaN(promedio) || promedio < 0 || promedio > 10) return t('validation_promedio')
    if (Number.isNaN(asistencia) || asistencia < 0 || asistencia > 100) return t('validation_asistencia')
    if (Number.isNaN(horas) || horas < 0) return t('validation_horas')
    if (Number.isNaN(tendencia) || tendencia < -10 || tendencia > 10) return t('validation_tendencia')
    if (Number.isNaN(puntualidad) || puntualidad < 0 || puntualidad > 100) return t('validation_puntualidad')
    if (Number.isNaN(habitos) || habitos < 0 || habitos > 10) return t('validation_habitos')
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
      showToast('success', t('toast_prediction_success'))
    } catch (err) {
      console.error('Predict error:', err)
      showToast('error', t('toast_prediction_error'))
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
      showToast('success', t('toast_pdf_success'))
    } catch (err) {
      console.error('PDF error', err)
      showToast('error', t('toast_pdf_error'))
    } finally {
      setPdfLoading(false)
    }
  }

  const riskChartData = {
    labels: [t('chart_risk_high'), t('chart_risk_medium'), t('chart_risk_low')],
    datasets: [
      {
        label: t('chart_risk_distribution'),
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
    labels: [t('stat_avg_score'), t('stat_alerts')],
    datasets: [
      {
        label: t('chart_global_metric'),
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
          <p className="text-sm uppercase tracking-[0.25em] text-textMuted">{t('pred_page_subtitle')}</p>
          <h1 className="text-3xl md:text-4xl font-extrabold gradient-text">
            {t('pred_page_title')}
          </h1>
          <p className="text-textMuted">{t('pred_page_desc')}</p>
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
                label={t('label_promedio_full')}
                name="promedio"
                type="number"
                min="0"
                max="10"
                step="0.1"
                required
                value={formData.promedio}
                onChange={handleChange}
                placeholder="Ej: 8.5"
                helper={t('prediction_hint')}
              />
              <InputField
                label={t('label_asistencia_full')}
                name="asistencia"
                type="number"
                min="0"
                max="100"
                required
                value={formData.asistencia}
                onChange={handleChange}
                placeholder="Ej: 92"
                helper={t('prediction_hint')}
              />
              <InputField
                label={t('label_horas_full')}
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
                label={t('label_tendencia_full')}
                name="tendencia"
                type="number"
                min="-10"
                max="10"
                step="0.1"
                required
                value={formData.tendencia}
                onChange={handleChange}
                placeholder="Ej: 0.3"
                helper={t('prediction_hint')}
              />
              <InputField
                label={t('label_puntualidad_full')}
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
                label={t('label_habitos_full')}
                name="habitos"
                type="number"
                min="0"
                max="10"
                step="0.1"
                required
                value={formData.habitos}
                onChange={handleChange}
                placeholder="Ej: 7"
                helper={t('prediction_hint')}
              />

              <div className="md:col-span-2">
                <Button
                  type="submit"
                  variant="neon"
                  disabled={loading}
                  className="w-full py-3 text-lg font-semibold"
                >
                  {loading ? t('btn_analyzing') : t('btn_run_prediction')}
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
                  {pdfLoading ? t('btn_generating_pdf') : t('btn_generate_pdf')}
                </Button>
                <Button
                  onClick={loadStats}
                  variant="ghost"
                >
                  {t('btn_update_dashboard')}
                </Button>
              </div>
            </motion.div>
          )}

          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">{t('mini_dash_title')}</h2>
                <p className="text-textMuted text-sm">{t('mini_dash_desc')}</p>
              </div>
              {stats?.modelo?.best_model && (
                <div className="px-3 py-2 rounded-lg bg-white/10 text-xs text-textPrimary">
                  {t('best_model_label')} {stats.modelo.best_model} (F1: {stats.modelo.metrics?.f1_weighted?.toFixed(3)})
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-xs text-textMuted">{t('stat_total')}</p>
                <p className="text-xl font-bold">{stats?.total_predicciones ?? '—'}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-xs text-textMuted">{t('stat_avg_score')}</p>
                <p className="text-xl font-bold">{stats?.score_promedio ? `${stats.score_promedio}%` : '—'}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-xs text-textMuted">{t('stat_last_train')}</p>
                <p className="text-xs font-semibold">{stats?.modelo?.trained_at ? new Date(stats.modelo.trained_at).toLocaleString() : t('stat_pending')}</p>
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
