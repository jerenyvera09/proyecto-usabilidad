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

  // Escala de fuente (90% - 140%) para A-/A+
  const [fontScale, setFontScale] = useState(() => {
    try {
      const saved = parseInt(localStorage.getItem('fontScale') || '100', 10)
      if (Number.isFinite(saved)) return Math.min(140, Math.max(90, saved))
      return 100
    } catch {
      return 100
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

  const [ttsEnabled, setTtsEnabled] = useState(() => {
    try {
      return localStorage.getItem('ttsEnabled') === 'true'
    } catch {
      return false
    }
  })

  const [focusVisible, setFocusVisible] = useState(() => {
    try {
      return localStorage.getItem('focusVisible') === 'true'
    } catch {
      return false
    }
  })

  const [keyboardNavigation, setKeyboardNavigation] = useState(() => {
    try {
      return localStorage.getItem('keyboardNavigation') === 'true'
    } catch {
      return false
    }
  })

  const [blockAutoScroll, setBlockAutoScroll] = useState(() => {
    try {
      return localStorage.getItem('blockAutoScroll') === 'true'
    } catch {
      return false
    }
  })

  const [blockAutoAudio, setBlockAutoAudio] = useState(() => {
    try {
      return localStorage.getItem('blockAutoAudio') === 'true'
    } catch {
      return false
    }
  })

  // Aplicar alto contraste
  useEffect(() => {
    try {
      localStorage.setItem('highContrast', highContrast.toString())
      if (highContrast) {
        document.documentElement.classList.add('high-contrast')
        document.documentElement.setAttribute('data-theme', 'high-contrast')
      } else {
        document.documentElement.classList.remove('high-contrast')
        document.documentElement.removeAttribute('data-theme')
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

  // Aplicar escala de fuente (A-/A+)
  useEffect(() => {
    try {
      localStorage.setItem('fontScale', String(fontScale))
      // 62.5% technique no usada aquí; ajustamos directamente el html font-size en porcentaje
      document.documentElement.style.fontSize = `${fontScale}%`
    } catch (error) {
      console.warn('Error aplicando escala de fuente:', error)
    }
  }, [fontScale])

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

  // Persistir TTS habilitado
  useEffect(() => {
    try {
      localStorage.setItem('ttsEnabled', ttsEnabled.toString())
    } catch (error) {
      console.warn('Error guardando preferencia TTS:', error)
    }
  }, [ttsEnabled])

  // Aplicar foco visible mejorado
  useEffect(() => {
    try {
      localStorage.setItem('focusVisible', focusVisible.toString())
      if (focusVisible) {
        document.documentElement.classList.add('focus-visible-enhanced')
      } else {
        document.documentElement.classList.remove('focus-visible-enhanced')
      }
    } catch (error) {
      console.warn('Error aplicando foco visible:', error)
    }
  }, [focusVisible])

  // Aplicar navegación por teclado mejorada
  useEffect(() => {
    try {
      localStorage.setItem('keyboardNavigation', keyboardNavigation.toString())
      if (keyboardNavigation) {
        document.documentElement.classList.add('keyboard-navigation-enhanced')
      } else {
        document.documentElement.classList.remove('keyboard-navigation-enhanced')
      }
    } catch (error) {
      console.warn('Error aplicando navegación por teclado:', error)
    }
  }, [keyboardNavigation])

  // Bloquear auto-scroll
  useEffect(() => {
    try {
      localStorage.setItem('blockAutoScroll', blockAutoScroll.toString())
      if (blockAutoScroll) {
        document.documentElement.style.scrollBehavior = 'auto'
        document.documentElement.classList.add('block-auto-scroll')
      } else {
        document.documentElement.style.scrollBehavior = ''
        document.documentElement.classList.remove('block-auto-scroll')
      }
    } catch (error) {
      console.warn('Error bloqueando auto-scroll:', error)
    }
  }, [blockAutoScroll])

  // Bloquear auto-audio
  useEffect(() => {
    try {
      localStorage.setItem('blockAutoAudio', blockAutoAudio.toString())
      if (blockAutoAudio) {
        document.documentElement.classList.add('block-auto-audio')
        // Pausar todos los elementos de audio y video
        document.querySelectorAll('audio, video').forEach(media => {
          media.pause()
          media.autoplay = false
        })
      } else {
        document.documentElement.classList.remove('block-auto-audio')
      }
    } catch (error) {
      console.warn('Error bloqueando auto-audio:', error)
    }
  }, [blockAutoAudio])

  // Función de lectura por voz (TTS)
  const speak = (text) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Tu navegador no soporta la API de síntesis de voz')
      alert('Tu navegador no soporta la función de texto a voz. Intenta usar Chrome, Edge o Safari.')
      return
    }

    try {
      // Cancelar cualquier lectura en curso
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'es-ES'
      utterance.rate = 0.95
      utterance.pitch = 1
      utterance.volume = 1

      // Listeners para debugging
      utterance.onstart = () => {
        console.log('🔊 TTS iniciado:', text.substring(0, 50) + '...')
      }

      utterance.onend = () => {
        console.log('✅ TTS finalizado')
      }

      utterance.onerror = (event) => {
        console.error('❌ Error en TTS:', event)
      }

      // Esperar a que las voces estén cargadas (fix para Chrome)
      const voices = window.speechSynthesis.getVoices()
      if (voices.length > 0) {
        // Buscar voz en español
        const spanishVoice = voices.find(voice => voice.lang.startsWith('es'))
        if (spanishVoice) {
          utterance.voice = spanishVoice
          console.log('🎤 Usando voz:', spanishVoice.name)
        }
      }

      window.speechSynthesis.speak(utterance)
    } catch (error) {
      console.error('Error en TTS:', error)
      alert('Error al reproducir el texto a voz: ' + error.message)
    }
  }

  const stopSpeaking = () => {
    try {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel()
        console.log('⏹️ TTS detenido')
      }
    } catch (error) {
      console.error('Error deteniendo TTS:', error)
    }
  }

  // Helpers/togglers expuestos al UI
  const toggleHighContrast = () => setHighContrast((v) => !v)
  const toggleReadingComfort = () => setReadingComfort((v) => !v)
  const togglePauseAnimations = () => setPauseAnimations((v) => !v)
  const toggleTTS = () => setTtsEnabled((v) => !v)
  const toggleFocusVisible = () => setFocusVisible((v) => !v)
  const toggleKeyboardNavigation = () => setKeyboardNavigation((v) => !v)
  const toggleBlockAutoScroll = () => setBlockAutoScroll((v) => !v)
  const toggleBlockAutoAudio = () => setBlockAutoAudio((v) => !v)

  const changeTextSize = (size) => {
    setTextSize(size)
    // Mantener coherencia con escala (normal=100, large=120)
    if (size === 'large') setFontScale((prev) => Math.max(prev, 120))
    if (size === 'normal') setFontScale((prev) => Math.min(prev, 100))
  }

  const increaseFont = () => setFontScale((s) => Math.min(140, s + 10))
  const decreaseFont = () => setFontScale((s) => Math.max(90, s - 10))

  // Resetear todas las preferencias
  const resetAccessibility = () => {
    setHighContrast(false)
    setTextSize('normal')
    setFontScale(100)
    setReadingComfort(false)
    setPauseAnimations(false)
    setTtsEnabled(false)
    setFocusVisible(false)
    setKeyboardNavigation(false)
    setBlockAutoScroll(false)
    setBlockAutoAudio(false)
    stopSpeaking()
  }

  const value = {
    highContrast,
    setHighContrast,
    toggleHighContrast,
    textSize,
    setTextSize,
    changeTextSize,
    fontScale,
    setFontScale,
    increaseFont,
    decreaseFont,
    readingComfort,
    setReadingComfort,
    toggleReadingComfort,
    pauseAnimations,
    setPauseAnimations,
    togglePauseAnimations,
    ttsEnabled,
    setTtsEnabled,
    toggleTTS,
    focusVisible,
    setFocusVisible,
    toggleFocusVisible,
    keyboardNavigation,
    setKeyboardNavigation,
    toggleKeyboardNavigation,
    blockAutoScroll,
    setBlockAutoScroll,
    toggleBlockAutoScroll,
    blockAutoAudio,
    setBlockAutoAudio,
    toggleBlockAutoAudio,
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
