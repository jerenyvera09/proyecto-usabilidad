import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { HiAcademicCap, HiChartSquareBar, HiShieldCheck, HiSparkles } from 'react-icons/hi'
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
    { icon: HiAcademicCap, title: t('feature_1_title') || 'Ruta académica guiada', desc: t('feature_1_desc') || 'Modelos de IA que entienden la trayectoria universitaria ULEAM.' },
    { icon: HiChartSquareBar, title: t('feature_2_title') || 'Indicadores ejecutivos', desc: t('feature_2_desc') || 'Paneles con métricas claras para decisiones académicas rápidas.' },
    { icon: HiShieldCheck, title: t('feature_3_title') || 'Privacidad institucional', desc: t('feature_3_desc') || 'Protección de datos y cumplimiento de estándares universitarios.' },
    { icon: HiSparkles, title: t('feature_4_title') || 'Acompañamiento continuo', desc: t('feature_4_desc') || 'Alertas tempranas y seguimiento para estudiantes en todo el campus.' }
  ]

  return (
    <div className="space-y-14">
      <div className="pt-20 md:pt-24">
        <div className="container-custom">
          <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Formulario Principal' }]} />
        </div>
      </div>

      <section
        className="relative overflow-hidden text-white py-16 md:py-24 rounded-3xl mx-4 md:mx-0 shadow-soft border border-white/10"
        style={{
          backgroundImage:
            "linear-gradient(120deg, rgba(9,34,59,0.92), rgba(4,16,31,0.94)), url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-uleamRed/40 via-transparent to-accentBlue/30" aria-hidden />
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
              className="text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-neon"
            >
              {t('home_title') || 'El poder de la predicción académica al servicio de los estudiantes ULEAM'}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto"
            >
              {t('home_subtitle') || 'Una experiencia ejecutiva con enfoque educativo, basada en datos reales del campus y acompañamiento continuo.'}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button as={Link} to="/prediction" className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-accentBlue to-uleamRed text-white hover:shadow-glow">
                🚀 {t('prediction') || 'Ver Predicción'}
              </Button>
              <Button as={Link} to="/about" variant="outline" className="px-8 py-4 text-lg font-semibold border-white text-white hover:bg-white/10">
                ℹ️ {t('cta_learn_more') || 'Conocer más'}
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
                <GlassPanel neon className="p-7 text-left space-y-3 h-full">
                  <div className="h-12 w-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-2xl text-uleamRed">
                    <feat.icon aria-hidden />
                  </div>
                  <h3 className="text-xl font-bold text-textPrimary">{feat.title}</h3>
                  <p className="text-textMuted">{feat.desc}</p>
                </GlassPanel>
              </motion.div>
            ))}
          </div>
        </Section>

        <GlassPanel neon className="p-10 text-grayDark bg-gradient-to-r from-uleamRed to-accentBlue shadow-soft border border-white/10">
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
