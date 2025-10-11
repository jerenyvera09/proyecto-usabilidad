import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { I18nContext } from '../contexts/I18nContext.jsx'

export default function Home(){
  const { t } = useContext(I18nContext)
  const features = [
    {title: 'Predicción Inteligente', desc: 'Modelos que anticipan riesgos y apoyan decisiones.'},
    {title: 'Visualización de Datos', desc: 'Dashboards claros para supervisión y análisis.'},
    {title: 'Privacidad', desc: 'Datos anonimizados y uso responsable.'},
    {title: 'Beneficios', desc: 'Intervenciones tempranas para mejorar el rendimiento.'},
  ]

  return (
    <section className="space-y-12">
      <div className="grid md:grid-cols-2 gap-8 items-center rounded-xl p-6 md:p-10 hero-bg">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight headline-animate">{t('home_title')}</h1>
          <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-xl subtitle-fade">{t('home_subtitle')}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/dashboard" className="btn-primary shadow">{t('cta_dashboard')}</Link>
            <Link to="/prediction" className="px-5 py-3 rounded-full border border-gray-200 dark:border-gray-700">{t('cta_learn_more')}</Link>
          </div>
        </div>
        <div className="order-first md:order-last flex justify-center md:justify-end">
          <div className="hero-card hidden md:block w-80">
            <div className="text-sm font-semibold mb-2">{t('hero_card_title')}</div>
            <div className="text-xs text-[var(--muted)] mb-4">{t('hero_card_subtitle')}</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-white/90 rounded-lg shadow-sm">{t('hero_item_1')}</div>
              <div className="p-3 bg-white/90 rounded-lg shadow-sm">{t('hero_item_2')}</div>
              <div className="p-3 bg-white/90 rounded-lg shadow-sm">{t('hero_item_3')}</div>
              <div className="p-3 bg-white/90 rounded-lg shadow-sm">{t('hero_item_4')}</div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 headline-animate">{t('offers_title') || t('offers_title') }</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className={`p-6 bg-white dark:bg-gray-800 rounded-xl shadow card-animate stagger-1`}>
            <div className="font-semibold mb-2">{t('feature_1_title')}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{t('feature_1_desc')}</div>
          </div>
          <div className={`p-6 bg-white dark:bg-gray-800 rounded-xl shadow card-animate stagger-2`}>
            <div className="font-semibold mb-2">{t('feature_2_title')}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{t('feature_2_desc')}</div>
          </div>
          <div className={`p-6 bg-white dark:bg-gray-800 rounded-xl shadow card-animate stagger-3`}>
            <div className="font-semibold mb-2">{t('feature_3_title')}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{t('feature_3_desc')}</div>
          </div>
          <div className={`p-6 bg-white dark:bg-gray-800 rounded-xl shadow card-animate stagger-4`}>
            <div className="font-semibold mb-2">{t('feature_4_title')}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{t('feature_4_desc')}</div>
          </div>
        </div>
      </div>
    </section>
  )
}
