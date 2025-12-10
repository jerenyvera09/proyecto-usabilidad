import { motion } from 'framer-motion'
import { FaBolt, FaFlask, FaRocket } from 'react-icons/fa'
import { useI18n } from '../contexts/I18nContext.jsx'

const items = (t) => [
  {
    icon: <FaBolt className="text-[#8b5cf6]" aria-hidden />,
    title: t('news_latest_title') || 'Últimas mejoras',
    desc: t('news_latest_desc') || 'Optimización de carga inicial y mejora de accesibilidad (WCAG 2.2 AA).'
  },
  {
    icon: <FaFlask className="text-[#1e3a8a]" aria-hidden />,
    title: t('news_new_title') || 'Nuevas funciones',
    desc: t('news_new_desc') || 'Ayuda contextual accesible y rutas mejor definidas para el formulario.'
  },
  {
    icon: <FaRocket className="text-[#3b82f6]" aria-hidden />,
    title: t('news_next_title') || 'Próximas versiones',
    desc: t('news_next_desc') || 'Historial de predicciones con exportación y panel de seguimiento.'
  }
]

export default function NewsSection(){
  const { t } = useI18n()

  return (
    <section className="py-14 bg-gradient-to-br from-bg800/60 via-bg900 to-bg900/90">
      <div className="container-custom">
        <div className="grid md:grid-cols-3 gap-6">
          {items(t).map((card, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -4, scale: 1.01 }}
              className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-soft"
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl" aria-hidden>{card.icon}</div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{card.title}</h3>
                  <p className="text-sm text-textMuted">{card.desc}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
