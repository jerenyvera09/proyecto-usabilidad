import { motion } from 'framer-motion'
import { FaBolt, FaFlask, FaRocket } from 'react-icons/fa'

const items = [
  {
    icon: <FaBolt className="text-[#8b5cf6]" aria-hidden />,
    title: 'Últimas mejoras',
    desc: 'Optimización de carga inicial y mejora de accesibilidad (WCAG 2.2 AA).'
  },
  {
    icon: <FaFlask className="text-[#1e3a8a]" aria-hidden />,
    title: 'Nuevas funciones',
    desc: 'Ayuda contextual accesible y rutas mejor definidas para el formulario.'
  },
  {
    icon: <FaRocket className="text-[#3b82f6]" aria-hidden />,
    title: 'Próximas versiones',
    desc: 'Historial de predicciones con exportación y panel de seguimiento.'
  }
]

export default function NewsSection(){
  return (
    <section className="py-14 bg-white dark:bg-neutral-900">
      <div className="container-custom">
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((card, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -4, scale: 1.01 }}
              className="p-6 rounded-2xl border bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl" aria-hidden>{card.icon}</div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{card.title}</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">{card.desc}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
