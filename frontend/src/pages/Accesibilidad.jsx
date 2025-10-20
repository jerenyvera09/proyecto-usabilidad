import { motion } from 'framer-motion'
import { useI18n } from '../contexts/I18nContext'
import { useAccessibility } from '../contexts/AccessibilityContext'

export default function Accesibilidad() {
  const { t } = useI18n()
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
    stopSpeaking,
    resetAccessibility
  } = useAccessibility()

  const features = [
    {
      icon: '🎨',
      title: 'Alto Contraste',
      desc: 'Mejora la visibilidad con un contraste mínimo de 4.5:1 (WCAG 2.2 Level AA)',
      active: highContrast,
      toggle: toggleHighContrast
    },
    {
      icon: '🔠',
      title: 'Ajuste de Texto',
      desc: 'Aumenta el tamaño del texto para mayor legibilidad',
      active: textSize === 'large',
      toggle: () => changeTextSize(textSize === 'large' ? 'normal' : 'large')
    },
    {
      icon: '📖',
      title: 'Modo Lectura',
      desc: 'Mejora el espaciado entre líneas y letras para facilitar la lectura',
      active: readingComfort,
      toggle: toggleReadingComfort
    },
    {
      icon: '⏸️',
      title: 'Pausar Animaciones',
      desc: 'Desactiva todas las animaciones y transiciones',
      active: pauseAnimations,
      toggle: togglePauseAnimations
    },
    {
      icon: '🔊',
      title: 'Texto a Voz (TTS)',
      desc: 'Lee el contenido en voz alta con la API Web Speech',
      active: ttsEnabled,
      toggle: toggleTTS
    }
  ]

  const shortcuts = [
    { key: 'Alt + 1', action: 'Abrir menú de accesibilidad' },
    { key: 'Tab', action: 'Navegar entre elementos' },
    { key: 'Enter / Espacio', action: 'Activar elemento' },
    { key: 'Esc', action: 'Cerrar modales/menús' }
  ]

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-12">
      <div className="container-custom max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold gradient-text mb-4">
            ♿ {t('accessibility_menu') || 'Accesibilidad'}
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
            {t('accessibility_subtitle') || 'EduPredict está diseñado para ser accesible para todos. Descubre todas las funciones disponibles.'}
          </p>
        </motion.div>

        {/* Características de accesibilidad */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-6">🛠️ Funciones Disponibles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`card p-6 border-2 transition-all ${
                  feat.active 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' 
                    : 'border-transparent'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-4xl mb-3">{feat.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{feat.title}</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                      {feat.desc}
                    </p>
                  </div>
                  <button
                    onClick={feat.toggle}
                    className={`w-12 h-6 rounded-full transition-colors focus-visible ${
                      feat.active ? 'bg-primary-600' : 'bg-neutral-300 dark:bg-neutral-600'
                    }`}
                    aria-pressed={feat.active}
                    aria-label={`${feat.active ? 'Desactivar' : 'Activar'} ${feat.title}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      feat.active ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                {feat.active && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 pt-3 border-t border-primary-200 dark:border-primary-800"
                  >
                    <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                      ✅ Activo
                    </span>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Prueba TTS */}
        {ttsEnabled && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6 mb-12 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20"
          >
            <h3 className="text-xl font-bold mb-4">🎤 Prueba el Texto a Voz</h3>
            <p className="mb-4 text-neutral-700 dark:text-neutral-300">
              {t('accessibility_tts_test') || 'Hola, soy el sistema de texto a voz de EduPredict. Puedo leer cualquier contenido en voz alta para ayudarte.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => speak(t('accessibility_tts_test') || 'Hola, soy el sistema de texto a voz de EduPredict.')}
                className="btn btn-primary"
              >
                ▶️ Reproducir
              </button>
              <button
                onClick={stopSpeaking}
                className="btn btn-outline"
              >
                ⏹️ Detener
              </button>
            </div>
          </motion.section>
        )}

        {/* Atajos de teclado */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-6">⌨️ Atajos de Teclado</h2>
          <div className="card p-6">
            <div className="grid md:grid-cols-2 gap-4">
              {shortcuts.map((shortcut, i) => (
                <div 
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800"
                >
                  <kbd className="px-3 py-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg font-mono text-sm font-bold">
                    {shortcut.key}
                  </kbd>
                  <span className="text-sm">{shortcut.action}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Cumplimiento WCAG */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="card p-8 bg-gradient-to-br from-primary-600 to-primary-700 text-white"
        >
          <h2 className="text-3xl font-bold mb-4">✅ Cumplimiento WCAG 2.2 Level AA</h2>
          <p className="text-lg mb-6 opacity-90">
            EduPredict cumple con las directrices de accesibilidad web WCAG 2.2 Nivel AA:
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span>✓</span>
              <span>Contraste de color mínimo 4.5:1 para texto normal</span>
            </li>
            <li className="flex items-start gap-2">
              <span>✓</span>
              <span>Navegación completa por teclado</span>
            </li>
            <li className="flex items-start gap-2">
              <span>✓</span>
              <span>Indicadores de foco visibles</span>
            </li>
            <li className="flex items-start gap-2">
              <span>✓</span>
              <span>Etiquetas ARIA descriptivas</span>
            </li>
            <li className="flex items-start gap-2">
              <span>✓</span>
              <span>Soporte para lectores de pantalla</span>
            </li>
            <li className="flex items-start gap-2">
              <span>✓</span>
              <span>Texto redimensionable hasta 200%</span>
            </li>
          </ul>
        </motion.section>

        {/* Restablecer preferencias */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <button
            onClick={resetAccessibility}
            className="btn btn-outline"
          >
            🔄 {t('accessibility_reset') || 'Restablecer Preferencias'}
          </button>
        </motion.div>
      </div>
    </div>
  )
}
