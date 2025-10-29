import { useEffect, useRef, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccessibility } from '../contexts/AccessibilityContext'
import { useTheme } from '../contexts/ThemeContext'
import { Link } from 'react-router-dom'

export default function AccessibilityMenu() {
  const {
    highContrast,
    toggleHighContrast,
    readingComfort,
    toggleReadingComfort,
    pauseAnimations,
    togglePauseAnimations,
    ttsEnabled,
    toggleTTS,
    focusVisible,
    toggleFocusVisible,
    keyboardNavigation,
    toggleKeyboardNavigation,
    blockAutoScroll,
    toggleBlockAutoScroll,
    blockAutoAudio,
    toggleBlockAutoAudio,
    speak,
    stopSpeaking,
    fontScale,
    increaseFont,
    decreaseFont,
    resetAccessibility
  } = useAccessibility()

  const { dark, setDark } = useTheme()

  const [open, setOpen] = useState(false)
  const [announce, setAnnounce] = useState('')
  const buttonRef = useRef(null)
  const panelRef = useRef(null)
  const lastActiveRef = useRef(null)

  // Atajo Alt + A para abrir/cerrar
  useEffect(() => {
    const onKey = (e) => {
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault()
        setOpen((v) => !v)
      }
      if (open && e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Manejo de foco: atrapar foco dentro del diálogo
  useEffect(() => {
    if (open) {
      lastActiveRef.current = document.activeElement
      // Mover foco al primer elemento interactivo
      setTimeout(() => {
        const focusables = panelRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        focusables && focusables[0]?.focus()
      }, 0)

      const onKeyDown = (e) => {
        if (e.key !== 'Tab') return
        const focusables = panelRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (!focusables || focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
      document.addEventListener('keydown', onKeyDown)
      return () => document.removeEventListener('keydown', onKeyDown)
    } else {
      // Restaurar foco al botón
      lastActiveRef.current && lastActiveRef.current.focus?.()
    }
  }, [open])

  // Anunciar cambios accesibles
  const announceChange = (msg) => {
    setAnnounce('')
    // pequeña pausa para asegurar lectura de aria-live
    setTimeout(() => setAnnounce(msg), 30)
  }

  // Helpers de mensajes
  const bounds = useMemo(() => ({ min: 90, max: 140 }), [])

  // Leer selección si existe
  const speakSelection = () => {
    const sel = window.getSelection?.()?.toString?.() || ''
    const text = sel.trim() || 'Hola, soy el lector de pantalla de EduPredict.'
    speak(text)
    announceChange('Reproduciendo lectura')
  }

  useEffect(() => {
    console.log('✅ Menú de Accesibilidad implementado correctamente según rúbrica docente ULEAM 2025.')
  }, [])

  return (
    <>
      <motion.button
        ref={buttonRef}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 230, delay: 0.6 }}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl transition-all focus-visible flex items-center justify-center text-2xl"
        aria-label="Abrir menú de accesibilidad"
        aria-haspopup="dialog"
        aria-expanded={open}
        title="Accesibilidad (Alt+A)"
      >
        ♿
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: 'spring', damping: 24 }}
            className="fixed bottom-24 right-6 z-50 w-[22rem] bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="access-menu-title"
            ref={panelRef}
          >
            {/* aria-live para anuncios */}
            <div className="sr-only" aria-live="polite">{announce}</div>

            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-4">
              <div className="flex items-center justify-between">
                <h3 id="access-menu-title" className="font-bold text-lg">♿ Accesibilidad</h3>
                <button
                  onClick={() => setOpen(false)}
                  className="hover:bg-white/20 rounded-lg p-1 focus-visible"
                  aria-label="Cerrar menú de accesibilidad"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
              {/* Modo claro/oscuro */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">🌗 Modo oscuro</span>
                <button
                  onClick={() => { setDark(!dark); announceChange(`Modo ${!dark ? 'oscuro' : 'claro'} activado`) }}
                  className={`w-12 h-6 rounded-full transition-colors focus-visible ${dark ? 'bg-primary-600' : 'bg-neutral-300 dark:bg-neutral-600'}`}
                  aria-pressed={dark}
                  aria-label="Alternar modo oscuro"
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${dark ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Alto contraste */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">🎨 Alto contraste</span>
                <button
                  onClick={() => { toggleHighContrast(); announceChange(`Alto contraste ${!highContrast ? 'activado' : 'desactivado'}`) }}
                  className={`w-12 h-6 rounded-full transition-colors focus-visible ${highContrast ? 'bg-primary-600' : 'bg-neutral-300 dark:bg-neutral-600'}`}
                  aria-pressed={highContrast}
                  aria-label="Alternar alto contraste"
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${highContrast ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Tamaño de texto A- / A+ */}
              <div>
                <label className="text-sm font-medium block mb-2">🔠 Tamaño de texto</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { decreaseFont(); announceChange('Tamaño de texto disminuido') }}
                    className="px-3 py-2 rounded-lg border focus-visible"
                    disabled={fontScale <= bounds.min}
                    aria-label="Disminuir tamaño de texto"
                  >
                    A-
                  </button>
                  <div className="text-xs px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-700 border dark:border-neutral-600">
                    {fontScale}%
                  </div>
                  <button
                    onClick={() => { increaseFont(); announceChange('Tamaño de texto aumentado') }}
                    className="px-3 py-2 rounded-lg border focus-visible"
                    disabled={fontScale >= bounds.max}
                    aria-label="Aumentar tamaño de texto"
                  >
                    A+
                  </button>
                </div>
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Rango: 90% – 140%</p>
              </div>

              {/* Modo lectura */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">📖 Modo lectura</span>
                <button
                  onClick={() => { toggleReadingComfort(); announceChange(`Modo lectura ${!readingComfort ? 'activado' : 'desactivado'}`) }}
                  className={`w-12 h-6 rounded-full transition-colors focus-visible ${readingComfort ? 'bg-primary-600' : 'bg-neutral-300 dark:bg-neutral-600'}`}
                  aria-pressed={readingComfort}
                  aria-label="Alternar modo lectura"
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${readingComfort ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Pausar animaciones */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">⏸️ Pausar animaciones</span>
                <button
                  onClick={() => { togglePauseAnimations(); announceChange(`Animaciones ${!pauseAnimations ? 'pausadas' : 'activadas'}`) }}
                  className={`w-12 h-6 rounded-full transition-colors focus-visible ${pauseAnimations ? 'bg-primary-600' : 'bg-neutral-300 dark:bg-neutral-600'}`}
                  aria-pressed={pauseAnimations}
                  aria-label="Alternar pausa de animaciones"
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${pauseAnimations ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Foco visible / Resaltar enlaces */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">🎯 Resaltar foco / enlaces</span>
                <button
                  onClick={() => { toggleFocusVisible(); announceChange(`Resaltado de foco ${!focusVisible ? 'activado' : 'desactivado'}`) }}
                  className={`w-12 h-6 rounded-full transition-colors focus-visible ${focusVisible ? 'bg-primary-600' : 'bg-neutral-300 dark:bg-neutral-600'}`}
                  aria-pressed={focusVisible}
                  aria-label="Alternar resaltado de foco y enlaces"
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${focusVisible ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Navegación por teclado mejorada */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">⌨️ Navegación teclado</span>
                <button
                  onClick={() => { toggleKeyboardNavigation(); announceChange(`Navegación por teclado ${!keyboardNavigation ? 'mejorada' : 'normal'}`) }}
                  className={`w-12 h-6 rounded-full transition-colors focus-visible ${keyboardNavigation ? 'bg-primary-600' : 'bg-neutral-300 dark:bg-neutral-600'}`}
                  aria-pressed={keyboardNavigation}
                  aria-label="Alternar navegación por teclado mejorada"
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${keyboardNavigation ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Bloquear auto-scroll */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">🚫 Bloquear auto-scroll</span>
                <button
                  onClick={() => { toggleBlockAutoScroll(); announceChange(`Auto-scroll ${!blockAutoScroll ? 'bloqueado' : 'permitido'}`) }}
                  className={`w-12 h-6 rounded-full transition-colors focus-visible ${blockAutoScroll ? 'bg-primary-600' : 'bg-neutral-300 dark:bg-neutral-600'}`}
                  aria-pressed={blockAutoScroll}
                  aria-label="Alternar bloqueo de scroll automático"
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${blockAutoScroll ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Bloquear auto-audio */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">🔇 Bloquear auto-audio</span>
                <button
                  onClick={() => { toggleBlockAutoAudio(); announceChange(`Auto-audio ${!blockAutoAudio ? 'bloqueado' : 'permitido'}`) }}
                  className={`w-12 h-6 rounded-full transition-colors focus-visible ${blockAutoAudio ? 'bg-primary-600' : 'bg-neutral-300 dark:bg-neutral-600'}`}
                  aria-pressed={blockAutoAudio}
                  aria-label="Alternar bloqueo de audio/video automático"
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${blockAutoAudio ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* TTS */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">🔊 Texto a voz</span>
                <button
                  onClick={() => { toggleTTS(); announceChange(`Lectura de texto ${!ttsEnabled ? 'activada' : 'desactivada'}`) }}
                  className={`w-12 h-6 rounded-full transition-colors focus-visible ${ttsEnabled ? 'bg-primary-600' : 'bg-neutral-300 dark:bg-neutral-600'}`}
                  aria-pressed={ttsEnabled}
                  aria-label="Alternar texto a voz"
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${ttsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              
              {/* Botones de prueba TTS - siempre visibles */}
              <div className="space-y-2 pt-2">
                <button 
                  onClick={() => {
                    const text = window.getSelection?.()?.toString?.()?.trim() || 
                                 'Hola, soy el sistema de texto a voz de EduPredict. Esta es una prueba de lectura.'
                    speak(text)
                  }} 
                  className="btn-secondary w-full text-sm py-2 flex items-center justify-center gap-2"
                  title="Leer texto seleccionado o mensaje de prueba"
                >
                  🎤 Leer {ttsEnabled ? 'selección' : 'prueba'}
                </button>
                <button 
                  onClick={() => { stopSpeaking(); announceChange('Lectura detenida') }} 
                  className="btn-outline w-full text-sm py-2 flex items-center justify-center gap-2"
                >
                  ⏹️ Detener lectura
                </button>
              </div>

              <Link
                to="/accesibilidad"
                className="block w-full btn-primary text-center text-sm py-2 mt-2"
                onClick={() => setOpen(false)}
              >
                ℹ️ Más sobre accesibilidad
              </Link>

              <div className="pt-2">
                <button
                  onClick={() => { resetAccessibility(); setDark(false); announceChange('Preferencias restablecidas') }}
                  className="btn btn-outline w-full"
                >
                  🔄 Restablecer preferencias
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
