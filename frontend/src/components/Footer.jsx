import { useI18n } from '../contexts/I18nContext'
import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa'

export default function Footer() {
  const { t } = useI18n()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-16 bg-gradient-to-b from-bg900 via-bg800 to-bg900 border-t border-white/10 text-textMuted">
      <div className="container-custom py-12 space-y-10">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="card-glass p-5 border-white/5">
            <div className="flex items-center gap-3 mb-3">
              <picture>
                <source srcSet="/uleam-logo.avif" type="image/avif" />
                <source srcSet="/uleam-logo.webp" type="image/webp" />
                <img
                  src="/uleam-logo.png"
                  alt="ULEAM"
                  loading="lazy"
                  className="w-[48px] h-[48px] object-contain"
                  width="48"
                  height="48"
                />
              </picture>
              <div>
                <h3 className="font-bold text-lg text-textPrimary">EduPredict</h3>
                <p className="text-xs">Universidad Laica Eloy Alfaro de Manabi</p>
              </div>
            </div>
            <p className="text-sm text-textMuted">
              Facultad de Ciencias Informaticas.
            </p>
          </div>

          <div className="card-glass p-5 border-white/5">
            <h4 className="font-semibold mb-4 text-textPrimary">{t('links') || 'Enlaces'}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-accentBlue focus-visible">{t('privacy') || 'Politicas de Privacidad'}</a></li>
              <li><Link to="/contact" className="hover:text-accentBlue focus-visible">{t('contact') || 'Contactanos'}</Link></li>
              <li><a href="#" className="hover:text-accentBlue focus-visible">{t('support') || 'Soporte Tecnico'}</a></li>
            </ul>
          </div>

          <div className="card-glass p-5 border-white/5">
            <h4 className="font-semibold mb-4 text-textPrimary">{t('navigation') || 'Navegacion'}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-accentBlue focus-visible">{t('home') || 'Inicio'}</Link></li>
              <li><Link to="/prediction" className="hover:text-accentBlue focus-visible">{t('prediction') || 'Formulario'}</Link></li>
              <li><Link to="/history" className="hover:text-accentBlue focus-visible">{t('history') || 'Historial'}</Link></li>
            </ul>
          </div>

          <div className="card-glass p-5 border-white/5">
            <h4 className="font-semibold mb-4 text-textPrimary">Redes Sociales</h4>
            <div className="flex gap-3" role="group" aria-label="Redes sociales">
              <a href="https://www.facebook.com/uleam.ec" target="_blank" rel="noopener noreferrer" aria-label="Facebook ULEAM" className="p-2 rounded-full bg-white/10 border border-white/10 hover:bg-accentBlue/20 hover:text-accentBlue transition-all">
                <FaFacebook aria-hidden />
              </a>
              <a href="https://www.instagram.com/uleam_ec/" target="_blank" rel="noopener noreferrer" aria-label="Instagram ULEAM" className="p-2 rounded-full bg-white/10 border border-white/10 hover:bg-accentBlue/20 hover:text-accentBlue transition-all">
                <FaInstagram aria-hidden />
              </a>
              <a href="https://www.youtube.com/@ULEAMTV" target="_blank" rel="noopener noreferrer" aria-label="YouTube ULEAM" className="p-2 rounded-full bg-white/10 border border-white/10 hover:bg-red-500/20 hover:text-red-300 transition-all">
                <FaYoutube aria-hidden />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 text-center text-sm">
          <p className="text-textMuted">© {currentYear} Universidad Laica Eloy Alfaro de Manabi · Facultad de Ciencias Informaticas.</p>
          <p className="mt-2 text-xs">Cumplimiento de accesibilidad: WCAG 2.2 Nivel AA</p>
        </div>
      </div>
    </footer>
  )
}
