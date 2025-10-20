import { createContext, useContext, useEffect, useState } from 'react'

export const I18nContext = createContext({ t: (k)=>k, lang: 'es', setLang: ()=>{} })

export const useI18n = () => {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider')
  }
  return context
}

const dict = {
  es: {
    language: 'Idioma', darkMode: 'Modo oscuro', lightMode: 'Modo claro', dashboard: 'Dashboard', prediction: 'Predicción', about: 'Acerca', history: 'Historial', contact: 'Contacto', login: 'Ingresar', logout: 'Salir',
    home: 'Inicio',
    home_title: 'Sistema Web de Predicción del Rendimiento Académico',
    home_subtitle: 'IA que analiza notas, hábitos de estudio y asistencia para anticipar riesgos de deserción estudiantil y facilitar intervenciones tempranas.',
    cta_dashboard: 'Ir al dashboard',
    cta_learn_more: 'Conocer más',
    offers_title: 'Qué ofrecemos',
    feature_1_title: 'Predicción Inteligente',
    feature_1_desc: 'Modelos que anticipan riesgos y apoyan decisiones.',
    feature_2_title: 'Visualización de Datos',
    feature_2_desc: 'Dashboards claros para supervisión y análisis.',
    feature_3_title: 'Privacidad',
    feature_3_desc: 'Datos anonimizados y uso responsable.',
    feature_4_title: 'Beneficios',
    feature_4_desc: 'Intervenciones tempranas para mejorar el rendimiento.',
    hero_card_title: 'Visión rápida',
    hero_card_subtitle: 'Interfaz simple con recomendaciones accionables y paneles claros para seguimiento.',
    hero_item_1: 'Estudiantes',
    hero_item_2: 'Predicciones',
    hero_item_3: 'Alertas',
    hero_item_4: 'Reportes'
  },
  en: {
    language: 'Language', darkMode: 'Dark mode', lightMode: 'Light mode', dashboard: 'Dashboard', prediction: 'Prediction', about: 'About', history: 'History', contact: 'Contact', login: 'Login', logout: 'Logout',
    home: 'Home',
    home_title: 'Academic Performance Prediction Web System',
    home_subtitle: 'AI that analyzes grades, study habits and attendance to anticipate dropout risks and enable early interventions.',
    cta_dashboard: 'Go to dashboard',
    cta_learn_more: 'Learn more',
    offers_title: 'What we offer',
    feature_1_title: 'Intelligent Prediction',
    feature_1_desc: 'Models that anticipate risks and support decisions.',
    feature_2_title: 'Data Visualization',
    feature_2_desc: 'Clear dashboards for monitoring and analysis.',
    feature_3_title: 'Privacy',
    feature_3_desc: 'Anonymized data and responsible use.',
    feature_4_title: 'Benefits',
    feature_4_desc: 'Early interventions to improve outcomes.',
    hero_card_title: 'Quick overview',
    hero_card_subtitle: 'Simple interface with actionable recommendations and clear panels for monitoring.',
    hero_item_1: 'Students',
    hero_item_2: 'Predictions',
    hero_item_3: 'Alerts',
    hero_item_4: 'Reports'
  },
}

// Helper seguro para localStorage
const safeGetLang = () => {
  try {
    const stored = localStorage.getItem('lang')
    return stored && (stored === 'es' || stored === 'en') ? stored : 'es'
  } catch (e) {
    console.warn('[I18nContext] Error leyendo idioma de localStorage:', e)
    return 'es'
  }
}

const safeSetLang = (lang) => {
  try {
    localStorage.setItem('lang', lang)
  } catch (e) {
    console.warn('[I18nContext] Error guardando idioma:', e)
  }
}

export function I18nProvider({ children }){
  const [lang, setLang] = useState(() => safeGetLang())
  
  useEffect(() => {
    safeSetLang(lang)
  }, [lang])
  
  const t = (k) => {
    try {
      return (dict[lang] && dict[lang][k]) || k
    } catch (e) {
      console.warn('[I18nContext] Error traduciendo clave:', k, e)
      return k
    }
  }
  
  return (
    <I18nContext.Provider value={{ t, lang, setLang }}>
      {children}
    </I18nContext.Provider>
  )
}
