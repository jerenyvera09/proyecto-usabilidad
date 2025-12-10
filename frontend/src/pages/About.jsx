import { motion } from 'framer-motion'
import { useI18n } from '../contexts/I18nContext'
import { Link } from 'react-router-dom'
import { Section, GlassPanel, Button } from '../components/ui/Primitives'

export default function About() {
  const { t } = useI18n()

  const values = [
    {
      icon: '🎯',
      title: 'Mision',
      desc: 'Proporcionar herramientas tecnologicas que mejoren el rendimiento academico de los estudiantes universitarios mediante predicciones basadas en datos.',
    },
    {
      icon: '🚀',
      title: 'Vision',
      desc: 'Ser la plataforma lider en analisis predictivo educativo, ayudando a instituciones y estudiantes a tomar decisiones informadas.',
    },
    {
      icon: '🤝',
      title: 'Valores',
      desc: 'Innovacion, accesibilidad, privacidad, excelencia academica y compromiso con la educacion inclusiva.',
    },
  ]

  return (
    <div className="space-y-14">
      <section className="relative overflow-hidden bg-gradient-to-br from-uleamRed via-grayDark to-uleamRedDark text-white py-16 md:py-24 rounded-3xl mx-4 md:mx-0 shadow-soft border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5 opacity-70" aria-hidden />
        <div className="container-custom text-center relative z-10 space-y-4">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl md:text-5xl font-extrabold drop-shadow-neon">
            {t('nav_about') || 'Acerca de EduPredict'}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }} className="text-lg md:text-2xl text-white/90 max-w-3xl mx-auto">
            {t('about_subtitle') || 'Sistema inteligente de prediccion de rendimiento academico desarrollado para ULEAM'}
          </motion.p>
        </div>
      </section>

      <div className="container-custom space-y-12">
        <Section className="space-y-6">
          <h2 className="text-3xl font-bold gradient-text text-center">{t('about_title') || '¿Que es EduPredict?'}</h2>
          <GlassPanel neon className="p-8 space-y-4">
            <p className="text-lg text-textPrimary">
              {t('about_description') || 'EduPredict es una plataforma de analisis predictivo que utiliza datos academicos para estimar el rendimiento de los estudiantes y ofrecer recomendaciones personalizadas.'}
            </p>
            <p className="text-textMuted">
              {t('about_detail') || 'Este proyecto institucional se enfoca en la mejora continua y el acompanamiento oportuno, ofreciendo paneles visuales, reportes y alertas tempranas para docentes y autoridades.'}
            </p>
          </GlassPanel>
        </Section>

        <Section className="space-y-8">
          <h2 className="text-3xl font-bold gradient-text text-center">{t('about_values') || 'Pilares institucionales'}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {values.map((item, idx) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.05 }}>
                <GlassPanel className="p-6 h-full">
                  <div className="text-4xl mb-3" aria-hidden>{item.icon}</div>
                  <h3 className="text-xl font-bold text-textPrimary mb-2">{item.title}</h3>
                  <p className="text-textMuted text-sm leading-relaxed">{item.desc}</p>
                </GlassPanel>
              </motion.div>
            ))}
          </div>
        </Section>

        <GlassPanel neon className="p-8 text-center space-y-4">
          <h3 className="text-2xl font-bold text-textPrimary">Institucion ULEAM</h3>
          <p className="text-textMuted max-w-3xl mx-auto">
            {t('about_commitment') || 'Proyecto desarrollado para fortalecer la toma de decisiones academicas y ofrecer un acompanamiento proactivo a nuestros estudiantes.'}
          </p>
          <Button as={Link} to="/contact" variant="neon" className="px-8 py-3">
            {t('contact') || 'Contactar al equipo'}
          </Button>
        </GlassPanel>
      </div>
    </div>
  )
}
