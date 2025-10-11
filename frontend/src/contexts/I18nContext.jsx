import { createContext, useEffect, useState } from 'react'

export const I18nContext = createContext({ t: (k)=>k, lang: 'es', setLang: ()=>{} })

const dict = {
  es: { language: 'Idioma', darkMode: 'Modo oscuro', lightMode: 'Modo claro', dashboard: 'Dashboard', prediction: 'Predicción', about: 'Acerca', history: 'Historial', contact: 'Contacto', login: 'Ingresar', logout: 'Salir' },
  en: { language: 'Language', darkMode: 'Dark mode', lightMode: 'Light mode', dashboard: 'Dashboard', prediction: 'Prediction', about: 'About', history: 'History', contact: 'Contact', login: 'Login', logout: 'Logout' },
}

export function I18nProvider({ children }){
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'es')
  useEffect(()=> localStorage.setItem('lang', lang), [lang])
  const t = (k)=> (dict[lang] && dict[lang][k]) || k
  return <I18nContext.Provider value={{ t, lang, setLang }}>{children}</I18nContext.Provider>
}
