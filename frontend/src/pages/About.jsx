import { motion } from 'framer-motion'
import { useI18n } from '../contexts/I18nContext'
import { Link } from 'react-router-dom'
import { Section, GlassPanel, Button } from '../components/ui/Primitives'

export default function About() {
  const { t } = useI18n()

  // Array de pilares definido DENTRO del componente para acceder a t()
  const values = [
    {
      icon: '🎯',
      title: t('mission_title'),
      desc: t('mission_desc'),
    },
    {
      icon: '🚀',
      title: t('vision_title'),
      desc: t('vision_desc'),
    },
    {
      icon: '🤝',
      title: t('values_title'),
      desc: t('values_desc'),
    },
  ]

  return (
    <div className="space-y-14">
      <section className="relative overflow-hidden bg-gradient-to-br from-uleamRed via-grayDark to-uleamRedDark text-white py-16 md:py-24 rounded-3xl mx-4 md:mx-0 shadow-soft border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5 opacity-70" aria-hidden />
        <div className="container-custom text-center relative z-10 space-y-4">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl md:text-5xl font-extrabold drop-shadow-neon">
            {t('nav_about')}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }} className="text-lg md:text-2xl text-white/90 max-w-3xl mx-auto">
            {t('about_subtitle')}
          </motion.p>
        </div>
      </section>

      <div className="container-custom space-y-12">
        <Section className="space-y-6">
          <h2 className="text-3xl font-bold gradient-text text-center">{t('about_title')}</h2>
          <GlassPanel neon className="p-8 space-y-4">
            <p className="text-lg text-textPrimary">
              {t('about_description')}
            </p>
            <p className="text-textMuted">
              {t('about_detail')}
            </p>
          </GlassPanel>
        </Section>

        <Section className="space-y-8">
          <h2 className="text-3xl font-bold gradient-text text-center">{t('about_values')}</h2>
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
          <h3 className="text-2xl font-bold text-textPrimary">{t('about_institution')}</h3>
          <p className="text-textMuted max-w-3xl mx-auto">
            {t('about_commitment')}
          </p>
          <Button as={Link} to="/contact" variant="neon" className="px-8 py-3">
            {t('about_contact_btn')}
          </Button>
        </GlassPanel>
      </div>
    </div>
  )
}
