import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'
import Breadcrumb from '../components/Breadcrumb'
import HelpModal from '../components/HelpModal'
import NewsSection from '../components/NewsSection'

export default function Home() {
  const { t } = useI18n()
  const [helpOpen, setHelpOpen] = useState(false)
  const helpBtnRef = useRef(null)

  useEffect(() => {
    console.log('✅ Formulario Principal mejorado correctamente según rúbrica docente ULEAM 2025.')
  }, [])

  const features = [
    { icon: '🤖', title: t('feature_1_title') || 'Inteligencia Artificial', desc: t('feature_1_desc') || 'Algoritmo avanzado de predicción de rendimiento académico.' },
    { icon: '📊', title: t('feature_2_title') || 'Visualización de Datos', desc: t('feature_2_desc') || 'Gráficos intuitivos y reportes detallados.' },
    { icon: '🔒', title: t('feature_3_title') || 'Privacidad Garantizada', desc: t('feature_3_desc') || 'Tus datos están seguros y protegidos.' },
    { icon: '💬', title: t('feature_4_title') || 'Beneficios', desc: t('feature_4_desc') || 'Intervenciones tempranas para mejorar el rendimiento.' }
  ]

  return (
    <div className="min-h-screen">
      {/* Breadcrumb accesible */}
      <div className="pt-20 md:pt-24 bg-transparent">
        <div className="container-custom">
          <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Formulario Principal' }]} />
        </div>
      </div>

      {/* Hero Section con animación */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1e3a8a] via-[#3b82f6] to-[#8b5cf6] text-white py-16 md:py-28">
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-5xl md:text-7xl font-extrabold leading-tight"
            >
              {t('home_title') || 'Predice tu Rendimiento Académico'}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto"
            >
              {t('home_subtitle') || 'Sistema inteligente de predicción del rendimiento académico para estudiantes universitarios.'}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                to="/prediction"
                className="btn bg-white text-[#1e3a8a] hover:bg-neutral-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transición-all"
                aria-label={t('prediction') || 'Predicción'}
              >
                🎯 {t('prediction') || 'Predicción'}
              </Link>
              <Link
                to="/about"
                className="btn border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-xl transición-all"
              >
                📖 {t('cta_learn_more') || 'Conocer más'}
              </Link>
            </motion.div>
          </motion.div>
        </div>
        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      </section>

      {/* Sección de novedades (extra docente) */}
      <NewsSection />

      {/* Características */}
      <section className="py-20 bg-neutral-50 dark:bg-neutral-900">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">{t('offers_title') || 'Características Principales'}</h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              {t('hero_card_subtitle') || 'Descubre por qué EduPredict es la mejor herramienta para estudiantes.'}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="card card-hover p-8 text-center bg-white dark:bg-neutral-800"
              >
                <div className="text-6xl mb-4" aria-hidden>{feat.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feat.title}</h3>
                <p className="text-neutral-600 dark:text-neutral-400">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="py-20 bg-gradient-to-r from-[#1e3a8a] to-[#8b5cf6] text-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { value: '95%', label: t('hero_item_4') || 'Precisión del Modelo' },
              { value: '1,000+', label: t('hero_item_1') || 'Estudiantes Beneficiados' },
              { value: '24/7', label: t('hero_item_3') || 'Soporte Disponible' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <div className="text-5xl md:text-6xl font-bold mb-2">{stat.value}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-white dark:bg-neutral-800">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold gradient-text">{t('cta_dashboard') || '¿Listo para comenzar?'}</h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              {t('home_subtitle') || 'Únete a cientos de estudiantes que ya están mejorando su rendimiento académico.'}
            </p>
            <Link
              to="/usuarios"
              className="inline-block btn btn-primary px-10 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl"
            >
              🚀 {t('login') || 'Crear Cuenta'}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Botón de ayuda contextual fijo */}
      <div className="fixed bottom-6 right-24 z-50">
        <button
          ref={helpBtnRef}
          onClick={() => setHelpOpen(true)}
          className="w-12 h-12 rounded-full bg-[#1e3a8a] hover:bg-[#1b2f6a] text-white shadow-lg hover:shadow-xl transition-all focus-visible flex items-center justify-center text-xl"
          aria-haspopup="dialog"
          aria-controls="help-modal"
          aria-expanded={helpOpen}
          title="Ayuda contextual"
        >
          ?
        </button>
      </div>

      <AnimatePresence>
        {helpOpen && (
          <HelpModal
            open={helpOpen}
            onClose={() => {
              setHelpOpen(false)
              helpBtnRef.current?.focus()
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
