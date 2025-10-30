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
    search: 'Buscar',
    no_results: 'Sin resultados',
    accessibility_menu: 'Accesibilidad',
    accessibility_dark_mode: 'Modo oscuro',
    aria_toggle_dark_mode: 'Alternar modo oscuro',
    accessibility_high_contrast: 'Alto contraste',
    accessibility_font_friendly: 'Fuente amigable',
    accessibility_text_size: 'Tamaño de texto',
    accessibility_reading_comfort: 'Comodidad de lectura',
    accessibility_pause_animations: 'Pausar animaciones',
    accessibility_tts: 'Texto a voz',
    accessibility_tts_test: 'Hola, soy el sistema de texto a voz de EduPredict. Puedo leer cualquier contenido en voz alta para ayudarte.',
    accessibility_tts_play: 'Reproducir',
    accessibility_tts_stop: 'Detener',
    accessibility_learn_more: 'Más sobre accesibilidad',
    accessibility_reset: 'Restablecer Preferencias',
    accessibility_features_title: 'Funciones Disponibles',
    accessibility_shortcuts_title: 'Atajos de Teclado',
    accessibility_active: 'Activo',
    announce_high_contrast_activated: 'Alto contraste activado',
    announce_high_contrast_deactivated: 'Alto contraste desactivado',
  accessibility_feature_high_contrast_title: 'Alto Contraste',
  accessibility_feature_high_contrast_desc: 'Mejora la visibilidad con un contraste mínimo de 4.5:1 (WCAG)',
  accessibility_feature_text_size_title: 'Ajuste de Texto',
  accessibility_feature_text_size_desc: 'Aumenta el tamaño del texto para mayor legibilidad',
  accessibility_feature_reading_title: 'Modo Lectura',
  accessibility_feature_reading_desc: 'Mejora el espaciado y formato para lectura prolongada',
  accessibility_feature_pause_title: 'Pausar Animaciones',
  accessibility_feature_pause_desc: 'Desactiva animaciones y transiciones',
  accessibility_feature_tts_title: 'Texto a Voz (TTS)',
  accessibility_feature_tts_desc: 'Lee el contenido en voz alta con la API Web Speech',
  shortcut_open_menu: 'Abrir menú de accesibilidad',
  shortcut_tab: 'Navegar entre elementos',
  shortcut_activate: 'Activar elemento',
  shortcut_close: 'Cerrar modales/menús',
  access_denied: 'Acceso denegado',
  access_admin_required: 'Necesitas permisos de administrador para acceder a esta sección.',
  admin_create_user: 'Crear usuario / administrador',
  label_name: 'Nombre',
  label_email: 'Email',
  label_password: 'Contraseña',
  label_role: 'Rol',
  creating: 'Creando...',
  create_user: 'Crear usuario',
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
    ,
    news_latest_title: 'Últimas mejoras',
    news_latest_desc: 'Optimización de carga inicial y mejora de accesibilidad (WCAG 2.2 AA).',
    news_new_title: 'Nuevas funciones',
    news_new_desc: 'Ayuda contextual accesible y rutas mejor definidas para el formulario.',
    news_next_title: 'Próximas versiones',
    news_next_desc: 'Historial de predicciones con exportación y panel de seguimiento.'
  },
  en: {
    language: 'Language', darkMode: 'Dark mode', lightMode: 'Light mode', dashboard: 'Dashboard', prediction: 'Prediction', about: 'About', history: 'History', contact: 'Contact', login: 'Login', logout: 'Logout',
    home: 'Home',
    search: 'Search',
    no_results: 'No results',
    accessibility_menu: 'Accessibility',
    accessibility_dark_mode: 'Dark mode',
    aria_toggle_dark_mode: 'Toggle dark mode',
    accessibility_high_contrast: 'High contrast',
    accessibility_font_friendly: 'Friendly font',
    accessibility_text_size: 'Text size',
    accessibility_reading_comfort: 'Reading comfort',
    accessibility_pause_animations: 'Pause animations',
    accessibility_tts: 'Text to speech',
    accessibility_tts_test: 'Hello, I am EduPredict text-to-speech. I can read content aloud to help you.',
    accessibility_tts_play: 'Play',
    accessibility_tts_stop: 'Stop',
    accessibility_learn_more: 'Learn more about accessibility',
    accessibility_reset: 'Reset preferences',
    accessibility_features_title: 'Available features',
    accessibility_shortcuts_title: 'Keyboard shortcuts',
    accessibility_active: 'Active',
    announce_high_contrast_activated: 'High contrast enabled',
    announce_high_contrast_deactivated: 'High contrast disabled',
  accessibility_feature_high_contrast_title: 'High Contrast',
  accessibility_feature_high_contrast_desc: 'Improves visibility with a minimum contrast of 4.5:1 (WCAG)',
  accessibility_feature_text_size_title: 'Text Adjustment',
  accessibility_feature_text_size_desc: 'Increase text size for better legibility',
  accessibility_feature_reading_title: 'Reading Mode',
  accessibility_feature_reading_desc: 'Improve spacing and formatting for prolonged reading',
  accessibility_feature_pause_title: 'Pause Animations',
  accessibility_feature_pause_desc: 'Disable animations and transitions',
  accessibility_feature_tts_title: 'Text to Speech (TTS)',
  accessibility_feature_tts_desc: 'Reads content aloud using the Web Speech API',
  shortcut_open_menu: 'Open accessibility menu',
  shortcut_tab: 'Navigate between elements',
  shortcut_activate: 'Activate element',
  shortcut_close: 'Close modals/menus',
  access_denied: 'Access denied',
  access_admin_required: 'You need administrator permissions to access this section.',
  admin_create_user: 'Create user / administrator',
  label_name: 'Name',
  label_email: 'Email',
  label_password: 'Password',
  label_role: 'Role',
  creating: 'Creating...',
  create_user: 'Create user',
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
    ,
    news_latest_title: 'Latest improvements',
    news_latest_desc: 'Initial load optimization and accessibility improvements (WCAG 2.2 AA).',
    news_new_title: 'New features',
    news_new_desc: 'Accessible contextual help and better form routes.',
    news_next_title: 'Next releases',
    news_next_desc: 'Prediction history with export and monitoring panel.'
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
