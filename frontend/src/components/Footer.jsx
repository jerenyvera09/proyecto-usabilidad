import { useI18n } from '../contexts/I18nContext'
import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa'

export default function Footer() {
  const { t } = useI18n()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-neutral-100 dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 mt-20">
      <div className="container-custom py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Institucional ULEAM */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <picture>
                <source srcSet="/uleam-logo.avif" type="image/avif" />
                <source srcSet="/uleam-logo.webp" type="image/webp" />
                <img
                  src="/uleam-logo.png"
                  alt="ULEAM"
                  loading="lazy"
                  className="w-[60px] h-[60px] object-contain"
                  width="60"
                  height="60"
                />
              </picture>
              <div>
                <h3 className="font-bold text-lg">EduPredict</h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">Universidad Laica Eloy Alfaro de Manabí</p>
              </div>
            </div>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              Facultad de Ciencias Informáticas.
            </p>
          </div>

          {/* Enlaces */}
          <div>
            <h4 className="font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 focus-visible">Políticas de Privacidad</a></li>
              <li><Link to="/contact" className="hover:text-primary-600 dark:hover:text-primary-400 focus-visible">Contáctanos</Link></li>
              <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 focus-visible">Soporte Técnico</a></li>
            </ul>
          </div>

          {/* Navegación */}
          <div>
            <h4 className="font-semibold mb-4">Navegación</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400 focus-visible">Inicio</Link></li>
              <li><Link to="/prediction" className="hover:text-primary-600 dark:hover:text-primary-400 focus-visible">Formulario</Link></li>
              <li><Link to="/history" className="hover:text-primary-600 dark:hover:text-primary-400 focus-visible">Historial</Link></li>
            </ul>
          </div>

          {/* Redes sociales accesibles */}
          <div>
            <h4 className="font-semibold mb-4">Redes Sociales</h4>
            <div className="flex gap-3" role="group" aria-label="Redes sociales">
              <a href="https://www.facebook.com/uleam.ec" target="_blank" rel="noopener noreferrer" aria-label="Facebook ULEAM" className="p-2 rounded-full bg-white dark:bg-neutral-700 border hover:shadow">
                <FaFacebook aria-hidden />
              </a>
              <a href="https://www.instagram.com/uleam_ec/" target="_blank" rel="noopener noreferrer" aria-label="Instagram ULEAM" className="p-2 rounded-full bg-white dark:bg-neutral-700 border hover:shadow">
                <FaInstagram aria-hidden />
              </a>
              <a href="https://www.youtube.com/@ULEAMTV" target="_blank" rel="noopener noreferrer" aria-label="YouTube ULEAM" className="p-2 rounded-full bg-white dark:bg-neutral-700 border hover:shadow">
                <FaYoutube aria-hidden />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-700 text-center text-sm text-neutral-600 dark:text-neutral-400">
          <p>© {currentYear} Universidad Laica Eloy Alfaro de Manabí – Facultad de Ciencias Informáticas.</p>
          <p className="mt-2 text-xs">Cumplimiento de accesibilidad: WCAG 2.2 Nivel AA ♿</p>
        </div>
      </div>
    </footer>
  )
}
