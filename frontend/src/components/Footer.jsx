import { useI18n } from '../contexts/I18nContext'
import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa'

export default function Footer() {
  const { t } = useI18n()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-16 bg-gradient-to-b from-bg800/50 via-bg900 to-bg900 border-t border-white/10 text-textMuted">
      <div className="container-custom py-12 space-y-10">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="card-glass p-5 border-white/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-uleamRed/20 to-accentBlue/10 border border-white/20 flex items-center justify-center shadow-soft">
                <img
                  src="/uleam-logo.svg"
                  alt="ULEAM"
                  loading="lazy"
                  className="h-9 w-auto object-contain"
                  width="48"
                  height="48"
                />
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-lg text-textPrimary bg-gradient-to-r from-uleamRed via-accentPurple to-accentBlue bg-clip-text text-transparent">EduPredict</h3>
                <p className="text-[10px] text-textMuted">Universidad Laica Eloy Alfaro</p>
              </div>
            </div>
            <p className="text-sm text-textMuted leading-relaxed">
              Facultad de Ciencias Informáticas. Inteligencia Artificial al servicio de la educación.
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
              <a href="https://www.facebook.com/uleam.ec" target="_blank" rel="noopener noreferrer" aria-label="Facebook ULEAM" className="p-2 rounded-full bg-white/10 border border-white/10 hover:bg-uleamRed/20 hover:text-uleamRed transition-all">
                <FaFacebook aria-hidden />
              </a>
              <a href="https://www.instagram.com/uleam_ec/" target="_blank" rel="noopener noreferrer" aria-label="Instagram ULEAM" className="p-2 rounded-full bg-white/10 border border-white/10 hover:bg-uleamRed/20 hover:text-uleamRed transition-all">
                <FaInstagram aria-hidden />
              </a>
              <a href="https://www.youtube.com/@ULEAMTV" target="_blank" rel="noopener noreferrer" aria-label="YouTube ULEAM" className="p-2 rounded-full bg-white/10 border border-white/10 hover:bg-red-500/20 hover:text-red-300 transition-all">
                <FaYoutube aria-hidden />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <img
              src="/uleam-logo.svg"
              alt="ULEAM"
              loading="lazy"
              className="h-8 w-auto object-contain opacity-80"
              width="32"
              height="32"
            />
            <p className="text-textMuted text-sm">© {currentYear} Universidad Laica Eloy Alfaro de Manabí</p>
          </div>
          <p className="text-textMuted text-sm">Facultad de Ciencias Informáticas</p>
          <p className="mt-2 text-xs text-textMuted/70">Cumplimiento de accesibilidad: WCAG 2.2 Nivel AA</p>
        </div>
      </div>
    </footer>
  )
}
