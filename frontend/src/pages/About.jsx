import { motion } from 'framer-motion'
import { useI18n } from '../contexts/I18nContext'

export default function About() {
  const { t } = useI18n()

  const team = [
    {
      name: 'ULEAM',
      role: 'Universidad Laica Eloy Alfaro de Manabí',
      desc: 'Institución de educación superior comprometida con la excelencia académica'
    }
  ]

  const values = [
    {
      icon: '🎯',
      title: 'Misión',
      desc: 'Proporcionar herramientas tecnológicas que mejoren el rendimiento académico de los estudiantes universitarios mediante predicciones basadas en datos'
    },
    {
      icon: '👁️',
      title: 'Visión',
      desc: 'Ser la plataforma líder en análisis predictivo educativo, ayudando a instituciones y estudiantes a tomar decisiones informadas'
    },
    {
      icon: '💎',
      title: 'Valores',
      desc: 'Innovación, accesibilidad, privacidad, excelencia académica y compromiso con la educación inclusiva'
    }
  ]

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {t('nav_about') || 'Acerca de EduPredict'}
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              {t('about_subtitle') || 'Sistema inteligente de predicción de rendimiento académico desarrollado para ULEAM'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ¿Qué es EduPredict? */}
      <section className="py-20 container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-4xl font-bold gradient-text mb-6 text-center">
            ❓ ¿Qué es EduPredict?
          </h2>
          <div className="card p-8 text-lg leading-relaxed space-y-4 text-neutral-700 dark:text-neutral-300">
            <p>
              <strong>EduPredict</strong> es una plataforma web desarrollada para la Universidad Laica Eloy Alfaro de Manabí (ULEAM) 
              que utiliza algoritmos de predicción para analizar el rendimiento académico de los estudiantes.
            </p>
            <p>
              Mediante la evaluación de tres factores clave (nota promedio, asistencia y horas de estudio), 
              el sistema calcula un score de riesgo académico y proporciona recomendaciones personalizadas 
              para mejorar el desempeño estudiantil.
            </p>
            <p>
              El proyecto fue diseñado siguiendo los estándares de <strong>usabilidad y accesibilidad WCAG 2.2 Level AA</strong>, 
              garantizando una experiencia inclusiva para todos los usuarios.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Misión, Visión y Valores */}
      <section className="py-20 bg-white dark:bg-neutral-800">
        <div className="container-custom">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center gradient-text mb-12"
          >
            🌟 Nuestros Principios
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="card p-8 text-center"
              >
                <div className="text-6xl mb-4">{value.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tecnologías */}
      <section className="py-20 container-custom">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-4xl font-bold gradient-text mb-8 text-center">
            🛠️ Tecnologías Utilizadas
          </h2>
          <div className="card p-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold mb-3 text-primary-600 dark:text-primary-400">
                  🎨 Frontend
                </h3>
                <ul className="space-y-2 text-neutral-700 dark:text-neutral-300">
                  <li>• React 18.3.1</li>
                  <li>• Vite 5.4.6</li>
                  <li>• TailwindCSS 3.4.11</li>
                  <li>• Framer Motion 11.5.4</li>
                  <li>• Axios 1.7.7</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3 text-primary-600 dark:text-primary-400">
                  ⚙️ Backend
                </h3>
                <ul className="space-y-2 text-neutral-700 dark:text-neutral-300">
                  <li>• FastAPI 0.104.1</li>
                  <li>• SQLModel 0.0.14</li>
                  <li>• SQLite (Base de datos)</li>
                  <li>• JWT (python-jose)</li>
                  <li>• bcrypt (passlib)</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
              <h3 className="text-xl font-bold mb-3 text-primary-600 dark:text-primary-400">
                ♿ Accesibilidad
              </h3>
              <ul className="space-y-2 text-neutral-700 dark:text-neutral-300">
                <li>• WCAG 2.2 Level AA Compliance</li>
                <li>• Web Speech API (TTS)</li>
                <li>• Navegación por teclado completa</li>
                <li>• Alto contraste y texto redimensionable</li>
                <li>• ARIA labels y roles semánticos</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Equipo */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-8">👥 Institución</h2>
            <div className="max-w-md mx-auto card p-8 bg-white/10 backdrop-blur-lg">
              <div className="text-6xl mb-4">🎓</div>
              <h3 className="text-2xl font-bold mb-2">{team[0].name}</h3>
              <p className="text-lg opacity-90 mb-2">{team[0].role}</p>
              <p className="text-sm opacity-75">{team[0].desc}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 container-custom text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-4xl font-bold gradient-text mb-6">
            ¿Listo para comenzar?
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
            Únete a EduPredict y mejora tu rendimiento académico
          </p>
          <a href="/usuarios" className="btn btn-primary px-10 py-4 text-lg font-semibold">
            🚀 Comenzar Ahora
          </a>
        </motion.div>
      </section>
    </div>
  )
}
