import { createContext, useContext, useEffect, useState } from 'react'

export const ThemeContext = createContext({ 
  dark: false, 
  setDark: ()=>{},
  highContrast: false, 
  setHighContrast: ()=>{}, 
  friendlyFont: false, 
  setFriendlyFont: ()=>{}, 
  readingComfort: false, 
  setReadingComfort: ()=>{}, 
  textSize: 'normal', 
  setTextSize: ()=>{} 
})

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

// Helper seguro para leer localStorage
const safeGetStorage = (key, defaultValue = null) => {
  try {
    const value = localStorage.getItem(key)
    return value !== null ? value : defaultValue
  } catch (e) {
    console.warn(`[ThemeContext] Error leyendo localStorage.${key}:`, e)
    return defaultValue
  }
}

// Helper seguro para escribir localStorage
const safeSetStorage = (key, value) => {
  try {
    localStorage.setItem(key, value)
  } catch (e) {
    console.warn(`[ThemeContext] Error escribiendo localStorage.${key}:`, e)
  }
}

export function ThemeProvider({ children }){
  const [dark, setDark] = useState(() => safeGetStorage('dark') === '1')
  const [highContrast, setHighContrast] = useState(() => safeGetStorage('highContrast') === '1')
  const [friendlyFont, setFriendlyFont] = useState(() => safeGetStorage('friendlyFont') === '1')
  const [readingComfort, setReadingComfort] = useState(() => safeGetStorage('readingComfort') === '1')
  const [textSize, setTextSize] = useState(() => safeGetStorage('textSize', 'normal'))

  useEffect(()=>{
    safeSetStorage('dark', dark ? '1' : '0')
    try {
      document.documentElement.classList.toggle('dark', dark)
    } catch (e) {
      console.warn('[ThemeContext] Error aplicando dark mode:', e)
    }
  }, [dark])

  useEffect(()=>{
    safeSetStorage('highContrast', highContrast ? '1' : '0')
    try {
      document.documentElement.classList.toggle('high-contrast', highContrast)
    } catch (e) {
      console.warn('[ThemeContext] Error aplicando high contrast:', e)
    }
  }, [highContrast])

  useEffect(()=>{
    safeSetStorage('friendlyFont', friendlyFont ? '1' : '0')
    try {
      document.documentElement.classList.toggle('font-friendly', friendlyFont)
    } catch (e) {
      console.warn('[ThemeContext] Error aplicando friendly font:', e)
    }
  }, [friendlyFont])

  useEffect(()=>{
    safeSetStorage('readingComfort', readingComfort ? '1' : '0')
    try {
      document.documentElement.classList.toggle('reading-comfort', readingComfort)
    } catch (e) {
      console.warn('[ThemeContext] Error aplicando reading comfort:', e)
    }
  }, [readingComfort])

  useEffect(()=>{
    safeSetStorage('textSize', textSize)
    try {
      document.documentElement.classList.toggle('text-size-large', textSize === 'large')
    } catch (e) {
      console.warn('[ThemeContext] Error aplicando text size:', e)
    }
  }, [textSize])

  return (
    <ThemeContext.Provider value={{ dark, setDark, highContrast, setHighContrast, friendlyFont, setFriendlyFont, readingComfort, setReadingComfort, textSize, setTextSize }}>
      {children}
    </ThemeContext.Provider>
  )
}
