import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccessibility } from '../contexts/AccessibilityContext'
import { useI18n } from '../contexts/I18nContext'
import { Link } from 'react-router-dom'

export default function AccessibilityButton() {
  const [isOpen, setIsOpen] = useState(false)
  const { 
    highContrast, 
    toggleHighContrast, 
    textSize, 
    changeTextSize,
    readingComfort,
    toggleReadingComfort,
    pauseAnimations,
    togglePauseAnimations,
    ttsEnabled,
    toggleTTS,
    speak,
    stopSpeaking
  } = useAccessibility()
  const { t } = useI18n()

  const handleSpeak = (text) => {
    if (ttsEnabled) {
      speak(text)
    }
  }

  return (
    <>
      {/* Botón flotante */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl transition-all focus-visible flex items-center justify-center text-2xl"
        aria-label={t('aria_accessibility_menu')}
        title={t('accessibility_menu')}
      >
        ♿
      </motion.button>

      {/* Panel de accesibilidad */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed bottom-24 right-6 z-50 w-80 bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">♿ {t('accessibility_menu')}</h3>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-white/20 rounded-lg p-1 focus-visible"
                  aria-label={t('aria_close')}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
              {/* Alto contraste */}
              <div className="flex items-center justify-between">
                <label htmlFor="high-contrast" className="text-sm font-medium">
                  🎨 {t('accessibility_high_contrast')}
                </label>
                <button
                  id="high-contrast"
                  onClick={toggleHighContrast}
                  className={`w-12 h-6 rounded-full transition-colors focus-visible ${
                    highContrast ? 'bg-primary-600' : 'bg-neutral-300 dark:bg-neutral-600'
                  }`}
                  aria-pressed={highContrast}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    highContrast ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* Tamaño de texto */}
              <div>
                <label className="text-sm font-medium block mb-2">
                  🔠 {t('accessibility_text_size')}
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => changeTextSize('normal')}
                    className={`flex-1 py-2 px-3 rounded-lg border focus-visible ${
                      textSize === 'normal' 
                        ? 'bg-primary-600 text-white border-primary-600' 
                        : 'border-neutral-300 dark:border-neutral-600'
                    }`}
                  >
                    A
                  </button>
                  <button
                    onClick={() => changeTextSize('large')}
                    className={`flex-1 py-2 px-3 rounded-lg border text-lg focus-visible ${
                      textSize === 'large' 
                        ? 'bg-primary-600 text-white border-primary-600' 
                        : 'border-neutral-300 dark:border-neutral-600'
                    }`}
                  >
                    A
                  </button>
                </div>
              </div>

              {/* Modo lectura */}
              <div className="flex items-center justify-between">
                <label htmlFor="reading-comfort" className="text-sm font-medium">
                  📖 {t('accessibility_reading_comfort')}
                </label>
                <button
                  id="reading-comfort"
                  onClick={toggleReadingComfort}
                  className={`w-12 h-6 rounded-full transition-colors focus-visible ${
                    readingComfort ? 'bg-primary-600' : 'bg-neutral-300 dark:bg-neutral-600'
                  }`}
                  aria-pressed={readingComfort}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    readingComfort ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* Pausar animaciones */}
              <div className="flex items-center justify-between">
                <label htmlFor="pause-animations" className="text-sm font-medium">
                  ⏸️ {t('accessibility_pause_animations')}
                </label>
                <button
                  id="pause-animations"
                  onClick={togglePauseAnimations}
                  className={`w-12 h-6 rounded-full transition-colors focus-visible ${
                    pauseAnimations ? 'bg-primary-600' : 'bg-neutral-300 dark:bg-neutral-600'
                  }`}
                  aria-pressed={pauseAnimations}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    pauseAnimations ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* TTS (Texto a voz) */}
              <div className="flex items-center justify-between">
                <label htmlFor="tts-toggle" className="text-sm font-medium">
                  🔊 {t('accessibility_tts')}
                </label>
                <button
                  id="tts-toggle"
                  onClick={toggleTTS}
                  className={`w-12 h-6 rounded-full transition-colors focus-visible ${
                    ttsEnabled ? 'bg-primary-600' : 'bg-neutral-300 dark:bg-neutral-600'
                  }`}
                  aria-pressed={ttsEnabled}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    ttsEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* Prueba TTS */}
              {ttsEnabled && (
                <div className="space-y-2">
                  <button
                    onClick={() => handleSpeak(t('accessibility_tts_test'))}
                    className="btn-secondary w-full text-sm py-2"
                  >
                    🎤 {t('accessibility_test_tts')}
                  </button>
                  <button
                    onClick={stopSpeaking}
                    className="btn-outline w-full text-sm py-2"
                  >
                    ⏹️ {t('accessibility_stop_tts')}
                  </button>
                </div>
              )}

              {/* Enlace a página de accesibilidad */}
              <Link 
                to="/accesibilidad" 
                className="block w-full btn-primary text-center text-sm py-2 mt-4"
                onClick={() => setIsOpen(false)}
              >
                ℹ️ {t('accessibility_learn_more')}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
