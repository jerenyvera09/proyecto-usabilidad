import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useI18n } from '../contexts/I18nContext'
import Breadcrumb from '../components/Breadcrumb'
import HelpModal from '../components/HelpModal'
import NewsSection from '../components/NewsSection'
import { Section, GlassPanel, Button } from '../components/ui/Primitives'

export default function Home() {
  const { t } = useI18n()
  const [helpOpen, setHelpOpen] = useState(false)
  const helpBtnRef = useRef(null)

  useEffect(() => {
    console.log('Home cargado con estilo híbrido 2025.')
  }, [])

  const features = [
    { icon: '🤖', title: t('feature_1_title') || 'Inteligencia Artificial', desc: t('feature_1_desc') || 'Algoritmo avanzado de prediccion de rendimiento academico.' },
    { icon: '📊', title: t('feature_2_title') || 'Visualizacion de Datos', desc: t('feature_2_desc') || 'Graficos intuitivos y reportes detallados.' },
    { icon: '🔒', title: t('feature_3_title') || 'Privacidad Garantizada', desc: t('feature_3_desc') || 'Tus datos estan seguros y protegidos.' },
    { icon: '🚀', title: t('feature_4_title') || 'Beneficios', desc: t('feature_4_desc') || 'Intervenciones tempranas para mejorar el rendimiento.' }
  ]

  return (
    <div className="space-y-14">
      <div className="pt-20 md:pt-24">
        <div className="container-custom">
          <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Formulario Principal' }]} />
        </div>
      </div>

      <section className="relative overflow-hidden bg-gradient-to-br from-uleamRed via-bg900 to-accentPurple text-white py-16 md:py-24 rounded-3xl mx-4 md:mx-0 shadow-soft border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5 opacity-70" aria-hidden />
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
              className="text-5xl md:text-7xl font-extrabold leading-tight drop-shadow-neon"
            >
              {t('home_title') || 'Predice tu Rendimiento Academico'}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto"
            >
              {t('home_subtitle') || 'Sistema inteligente de prediccion del rendimiento academico para estudiantes universitarios.'}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button as={Link} to="/prediction" className="px-8 py-4 text-lg font-semibold bg-white text-grayDark hover:shadow-glow">
                🚀 {t('prediction') || 'Prediccion'}
              </Button>
              <Button as={Link} to="/about" variant="outline" className="px-8 py-4 text-lg font-semibold border-white text-white hover:bg-white/10">
                ℹ️ {t('cta_learn_more') || 'Conocer mas'}
              </Button>
            </motion.div>
          </motion.div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" aria-hidden />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" aria-hidden />
      </section>

      <div className="container-custom space-y-12">
        <Section className="space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-3"
          >
            <h2 className="text-4xl md:text-5xl font-bold gradient-text">{t('offers_title') || 'Caracteristicas Principales'}</h2>
            <p className="text-lg text-textMuted max-w-2xl mx-auto">
              {t('hero_card_subtitle') || 'Descubre por que EduPredict es la mejor herramienta para estudiantes.'}
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
                whileHover={{ scale: 1.03, y: -5 }}
              >
                <GlassPanel neon className="p-7 text-center space-y-3 h-full">
                  <div className="text-5xl" aria-hidden>{feat.icon}</div>
                  <h3 className="text-xl font-bold text-textPrimary">{feat.title}</h3>
                  <p className="text-textMuted">{feat.desc}</p>
                </GlassPanel>
              </motion.div>
            ))}
          </div>
        </Section>

        <GlassPanel neon className="p-10 text-grayDark bg-gradient-to-r from-uleamRed to-accentPurple shadow-soft border border-white/10">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { value: '95%', label: t('hero_item_4') || 'Precision del Modelo' },
              { value: '1,000+', label: t('hero_item_1') || 'Estudiantes Beneficiados' },
              { value: '24/7', label: t('hero_item_3') || 'Soporte Disponible' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="space-y-1"
              >
                <div className="text-5xl md:text-6xl font-bold text-grayLight">{stat.value}</div>
                <div className="text-lg text-grayLight/80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </GlassPanel>

        <Section className="text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text">{t('cta_dashboard') || '¿Listo para comenzar?'}</h2>
          <p className="text-lg text-textMuted max-w-3xl mx-auto">
            {t('home_subtitle') || 'Unete a cientos de estudiantes que ya estan mejorando su rendimiento academico.'}
          </p>
          <Button as={Link} to="/usuarios" variant="neon" className="px-10 py-4 text-lg font-semibold">
            🔑 {t('login') || 'Crear Cuenta'}
          </Button>
        </Section>
      </div>

      <NewsSection />

      <div className="fixed bottom-6 right-6 md:right-10 z-50">
        <button
          ref={helpBtnRef}
          onClick={() => setHelpOpen(true)}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-uleamRed to-uleamRedDark text-grayLight shadow-soft hover:shadow-glow transition-all focus-visible flex items-center justify-center text-xl"
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
