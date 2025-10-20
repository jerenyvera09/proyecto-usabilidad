import { useState } from 'react'
import { motion } from 'framer-motion'
import { useI18n } from '../contexts/I18nContext'

export default function Contact() {
  const { t } = useI18n()
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Simular envío (en producción esto se conectaría a un backend)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      setFormData({ nombre: '', email: '', asunto: '', mensaje: '' })

      // Reset después de 5 segundos
      setTimeout(() => {
        setSubmitted(false)
      }, 5000)
    }, 1500)
  }

  const contactInfo = [
    {
      icon: '📧',
      title: 'Email',
      value: 'info@uleam.edu.ec',
      link: 'mailto:info@uleam.edu.ec'
    },
    {
      icon: '📞',
      title: 'Teléfono',
      value: '+593 5 262 3740',
      link: 'tel:+59352623740'
    },
    {
      icon: '📍',
      title: 'Dirección',
      value: 'Manta, Manabí, Ecuador',
      link: 'https://goo.gl/maps/uleam'
    },
    {
      icon: '🕐',
      title: 'Horario',
      value: 'Lun - Vie: 8:00 AM - 5:00 PM',
      link: null
    }
  ]

  const socialMedia = [
    { name: 'Facebook', icon: '📘', url: 'https://facebook.com/uleam' },
    { name: 'Twitter', icon: '🐦', url: 'https://twitter.com/uleam' },
    { name: 'Instagram', icon: '📷', url: 'https://instagram.com/uleam' },
    { name: 'YouTube', icon: '▶️', url: 'https://youtube.com/uleam' }
  ]

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-12">
      <div className="container-custom max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold gradient-text mb-4">
            📬 {t('nav_contact') || 'Contáctanos'}
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
            {t('contact_subtitle') || '¿Tienes preguntas o sugerencias? Estamos aquí para ayudarte'}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulario de contacto */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="card p-8">
              <h2 className="text-2xl font-bold mb-6">
                ✉️ {t('contact_form_title') || 'Envíanos un Mensaje'}
              </h2>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 text-center bg-green-50 dark:bg-green-900/20 rounded-xl"
                >
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-2xl font-bold mb-2 text-green-700 dark:text-green-400">
                    {t('contact_success') || '¡Mensaje Enviado!'}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    {t('contact_success_desc') || 'Gracias por contactarnos. Te responderemos pronto.'}
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="label">{t('auth_name') || 'Nombre Completo'}</label>
                    <input
                      type="text"
                      required
                      className="input"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      placeholder="Juan Pérez"
                    />
                  </div>

                  <div>
                    <label className="label">{t('auth_email') || 'Correo Electrónico'}</label>
                    <input
                      type="email"
                      required
                      className="input"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="tu.email@uleam.edu.ec"
                    />
                  </div>

                  <div>
                    <label className="label">{t('contact_subject') || 'Asunto'}</label>
                    <input
                      type="text"
                      required
                      className="input"
                      value={formData.asunto}
                      onChange={(e) => setFormData({ ...formData, asunto: e.target.value })}
                      placeholder="Consulta sobre el sistema"
                    />
                  </div>

                  <div>
                    <label className="label">{t('contact_message') || 'Mensaje'}</label>
                    <textarea
                      required
                      rows={5}
                      className="input resize-none"
                      value={formData.mensaje}
                      onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                      placeholder="Escribe tu mensaje aquí..."
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="btn btn-primary w-full py-3 text-lg font-semibold"
                  >
                    {loading ? (
                      <>⏳ {t('msg_loading') || 'Enviando...'}</>
                    ) : (
                      <>📤 {t('contact_send') || 'Enviar Mensaje'}</>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Información de contacto */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Info Cards */}
            <div className="card p-8">
              <h2 className="text-2xl font-bold mb-6">
                📞 {t('contact_info') || 'Información de Contacto'}
              </h2>
              <div className="space-y-4">
                {contactInfo.map((info, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="flex items-start gap-4 p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <div className="text-3xl">{info.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{info.title}</h3>
                      {info.link ? (
                        <a 
                          href={info.link} 
                          className="text-primary-600 dark:text-primary-400 hover:underline focus-visible"
                          target={info.link.startsWith('http') ? '_blank' : '_self'}
                          rel={info.link.startsWith('http') ? 'noopener noreferrer' : ''}
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-neutral-600 dark:text-neutral-400">{info.value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Redes Sociales */}
            <div className="card p-8">
              <h2 className="text-2xl font-bold mb-6">
                🌐 {t('contact_social') || 'Síguenos'}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {socialMedia.map((social, i) => (
                  <motion.a
                    key={i}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-3 p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors focus-visible"
                  >
                    <span className="text-2xl">{social.icon}</span>
                    <span className="font-medium">{social.name}</span>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Mapa placeholder */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="card p-8 bg-gradient-to-br from-primary-600 to-primary-700 text-white text-center"
            >
              <div className="text-5xl mb-4">🗺️</div>
              <h3 className="text-xl font-bold mb-2">Universidad ULEAM</h3>
              <p className="opacity-90">Manta, Manabí, Ecuador</p>
              <a 
                href="https://goo.gl/maps/uleam" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block mt-4 btn bg-white text-primary-700 hover:bg-neutral-100 font-semibold"
              >
                📍 Ver en Google Maps
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-center gradient-text mb-8">
            ❓ Preguntas Frecuentes
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                q: '¿Quién puede usar EduPredict?',
                a: 'Cualquier estudiante de ULEAM con un correo institucional @uleam.edu.ec puede registrarse y usar el sistema.'
              },
              {
                q: '¿Es gratis?',
                a: 'Sí, EduPredict es completamente gratuito para todos los estudiantes de ULEAM.'
              },
              {
                q: '¿Cómo funciona la predicción?',
                a: 'El sistema analiza tu nota promedio, asistencia y horas de estudio para calcular un score de riesgo académico.'
              },
              {
                q: '¿Mis datos están seguros?',
                a: 'Sí, todos los datos están protegidos con encriptación y solo tú puedes acceder a tu información.'
              }
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-6"
              >
                <h3 className="font-bold mb-2 text-primary-600 dark:text-primary-400">
                  {faq.q}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  {faq.a}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  )
}
