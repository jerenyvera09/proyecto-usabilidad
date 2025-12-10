import { useState } from 'react'
import { motion } from 'framer-motion'
import { useI18n } from '../contexts/I18nContext'
import { Section, GlassPanel, Button, InputField } from '../components/ui/Primitives'

export default function Contact() {
  const { t } = useI18n()
  const [formData, setFormData] = useState({ nombre: '', email: '', asunto: '', mensaje: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      setFormData({ nombre: '', email: '', asunto: '', mensaje: '' })
      setTimeout(() => setSubmitted(false), 5000)
    }, 1500)
  }

  const contactInfo = [
    { icon: '📧', title: 'Email', value: 'info@uleam.edu.ec', link: 'mailto:info@uleam.edu.ec' },
    { icon: '📞', title: 'Telefono', value: '+593 5 262 3740', link: 'tel:+59352623740' },
    { icon: '📍', title: 'Direccion', value: 'Manta, Manabi, Ecuador', link: 'https://goo.gl/maps/uleam' },
    { icon: '⏰', title: 'Horario', value: 'Lun - Vie: 8:00 AM - 5:00 PM', link: null },
  ]

  const socialMedia = [
    { name: 'Facebook', icon: '📘', url: 'https://facebook.com/uleam' },
    { name: 'Twitter', icon: '🐦', url: 'https://twitter.com/uleam' },
    { name: 'Instagram', icon: '📸', url: 'https://instagram.com/uleam' },
    { name: 'YouTube', icon: '▶️', url: 'https://youtube.com/uleam' },
  ]

  return (
    <div className="space-y-12">
      <div className="container-custom">
        <Section className="text-center space-y-4">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold gradient-text">
            {t('nav_contact') || 'Contactanos'}
          </motion.h1>
          <p className="text-lg text-textMuted max-w-3xl mx-auto">
            {t('contact_subtitle') || '¿Tienes preguntas o sugerencias? Estamos aqui para ayudarte.'}
          </p>
        </Section>

        <div className="grid lg:grid-cols-2 gap-8">
          <GlassPanel className="p-8 space-y-6">
            <h2 className="text-2xl font-bold text-textPrimary">{t('contact_title') || 'Envia un mensaje'}</h2>
            {submitted && (
              <div className="p-4 rounded-xl border border-green-500/60 bg-green-500/10 text-green-100 text-sm">
                ✅ {t('contact_success') || 'Mensaje enviado correctamente.'}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField
                label={t('auth_name') || 'Nombre Completo'}
                name="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
              <InputField
                label={t('auth_email') || 'Correo Electronico'}
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <InputField
                label={t('contact_subject') || 'Asunto'}
                name="asunto"
                value={formData.asunto}
                onChange={(e) => setFormData({ ...formData, asunto: e.target.value })}
                required
              />
              <div>
                <label className="label">{t('contact_message') || 'Mensaje'}</label>
                <textarea
                  className="input resize-none"
                  rows="4"
                  required
                  value={formData.mensaje}
                  onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                />
              </div>
              <Button type="submit" variant="neon" className="w-full py-3 text-lg font-semibold" disabled={loading}>
                {loading ? 'Enviando...' : t('contact_send') || 'Enviar mensaje'}
              </Button>
            </form>
          </GlassPanel>

          <div className="space-y-6">
            <GlassPanel className="p-8 space-y-4">
              <h2 className="text-2xl font-bold text-textPrimary">Datos de contacto</h2>
              <div className="space-y-4">
                {contactInfo.map((info) => (
                  <div key={info.title} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-2xl" aria-hidden>{info.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-textPrimary mb-1">{info.title}</h3>
                      {info.link ? (
                        <a href={info.link} className="text-accentBlue hover:underline focus-visible">{info.value}</a>
                      ) : (
                        <p className="text-textMuted">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </GlassPanel>

            <GlassPanel className="p-8 space-y-4">
              <h2 className="text-2xl font-bold text-textPrimary">Redes Sociales</h2>
              <div className="grid grid-cols-2 gap-4">
                {socialMedia.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-accentBlue/10 transition-colors focus-visible"
                  >
                    <span className="text-xl">{social.icon}</span>
                    <span className="font-medium text-textPrimary">{social.name}</span>
                  </a>
                ))}
              </div>
            </GlassPanel>
          </div>
        </div>
      </div>
    </div>
  )
}
