import { createContext, useContext, useState, useEffect } from 'react'

const AccessibilityContext = createContext()

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider')
  }
  return context
}

export const AccessibilityProvider = ({ children }) => {
  // Estados de accesibilidad
  const [highContrast, setHighContrast] = useState(() => {
    try {
      return localStorage.getItem('highContrast') === 'true'
    } catch {
      return false
    }
  })

  const [textSize, setTextSize] = useState(() => {
    try {
      return localStorage.getItem('textSize') || 'normal'
    } catch {
      return 'normal'
    }
  })

  const [readingComfort, setReadingComfort] = useState(() => {
    try {
      return localStorage.getItem('readingComfort') === 'true'
    } catch {
      return false
    }
  })

  const [pauseAnimations, setPauseAnimations] = useState(() => {
    try {
      return localStorage.getItem('pauseAnimations') === 'true'
    } catch {
      return false
    }
  })

  const [ttsEnabled, setTtsEnabled] = useState(false)

  // Aplicar alto contraste
  useEffect(() => {
    try {
      localStorage.setItem('highContrast', highContrast.toString())
      if (highContrast) {
        document.documentElement.classList.add('high-contrast')
      } else {
        document.documentElement.classList.remove('high-contrast')
      }
    } catch (error) {
      console.warn('Error aplicando alto contraste:', error)
    }
  }, [highContrast])

  // Aplicar tamaño de texto
  useEffect(() => {
    try {
      localStorage.setItem('textSize', textSize)
      if (textSize === 'large') {
        document.documentElement.classList.add('text-large')
      } else {
        document.documentElement.classList.remove('text-large')
      }
    } catch (error) {
      console.warn('Error aplicando tamaño de texto:', error)
    }
  }, [textSize])

  // Aplicar lectura cómoda
  useEffect(() => {
    try {
      localStorage.setItem('readingComfort', readingComfort.toString())
      if (readingComfort) {
        document.documentElement.classList.add('reading-comfort')
      } else {
        document.documentElement.classList.remove('reading-comfort')
      }
    } catch (error) {
      console.warn('Error aplicando lectura cómoda:', error)
    }
  }, [readingComfort])

  // Pausar animaciones
  useEffect(() => {
    try {
      localStorage.setItem('pauseAnimations', pauseAnimations.toString())
      if (pauseAnimations) {
        document.documentElement.classList.add('no-animations')
      } else {
        document.documentElement.classList.remove('no-animations')
      }
    } catch (error) {
      console.warn('Error pausando animaciones:', error)
    }
  }, [pauseAnimations])

  // Función de lectura por voz (TTS)
  const speak = (text) => {
    if (!ttsEnabled || !('speechSynthesis' in window)) return

    try {
      // Cancelar cualquier lectura en curso
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'es-ES'
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 1

      window.speechSynthesis.speak(utterance)
    } catch (error) {
      console.error('Error en TTS:', error)
    }
  }

  const stopSpeaking = () => {
    try {
      window.speechSynthesis.cancel()
    } catch (error) {
      console.error('Error deteniendo TTS:', error)
    }
  }

  // Resetear todas las preferencias
  const resetAccessibility = () => {
    setHighContrast(false)
    setTextSize('normal')
    setReadingComfort(false)
    setPauseAnimations(false)
    setTtsEnabled(false)
    stopSpeaking()
  }

  const value = {
    highContrast,
    setHighContrast,
    textSize,
    setTextSize,
    readingComfort,
    setReadingComfort,
    pauseAnimations,
    setPauseAnimations,
    ttsEnabled,
    setTtsEnabled,
    speak,
    stopSpeaking,
    resetAccessibility
  }

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  )
}
