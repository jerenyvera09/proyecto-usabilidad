import { useI18n } from '../contexts/I18nContext'
import { Link } from 'react-router-dom'

export default function Footer() {
  const { t } = useI18n()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-neutral-100 dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 mt-20">
      <div className="container-custom py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Branding */}
          <div>
            <h3 className="font-bold text-lg mb-4 gradient-text">EduPredict</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {t('footer_desc')}
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer_quick_links')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400 focus-visible">{t('nav_home')}</Link></li>
              <li><Link to="/about" className="hover:text-primary-600 dark:hover:text-primary-400 focus-visible">{t('nav_about')}</Link></li>
              <li><Link to="/contact" className="hover:text-primary-600 dark:hover:text-primary-400 focus-visible">{t('nav_contact')}</Link></li>
              <li><Link to="/accesibilidad" className="hover:text-primary-600 dark:hover:text-primary-400 focus-visible">{t('nav_accessibility')}</Link></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer_contact')}</h4>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li>📧 info@uleam.edu.ec</li>
              <li>📞 +593 5 262 3740</li>
              <li>📍 Manta, Ecuador</li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer_legal')}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 focus-visible">{t('footer_privacy')}</a></li>
              <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 focus-visible">{t('footer_terms')}</a></li>
              <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 focus-visible">{t('footer_cookies')}</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-700 text-center text-sm text-neutral-600 dark:text-neutral-400">
          <p>© {currentYear} ULEAM - Universidad Laica Eloy Alfaro de Manabí. {t('footer_rights')}</p>
          <p className="mt-2 text-xs">
            {t('footer_wcag')} | WCAG 2.2 Level AA Compliant ♿
          </p>
        </div>
      </div>
    </footer>
  )
}
