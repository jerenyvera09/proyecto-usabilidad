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
      title: t('accessibility_feature_high_contrast_title') || 'Alto Contraste',
      desc: t('accessibility_feature_high_contrast_desc') || 'Mejora la visibilidad con un contraste mínimo de 4.5:1 (WCAG 2.2 Level AA)',
      active: highContrast,
      toggle: toggleHighContrast
    },
    {
      icon: '🔠',
      title: t('accessibility_feature_text_size_title') || 'Ajuste de Texto',
      desc: t('accessibility_feature_text_size_desc') || 'Aumenta el tamaño del texto para mayor legibilidad',
      active: textSize === 'large',
      toggle: () => changeTextSize(textSize === 'large' ? 'normal' : 'large')
    },
    {
      icon: '📖',
      title: t('accessibility_feature_reading_title') || 'Modo Lectura',
      desc: t('accessibility_feature_reading_desc') || 'Mejora el espaciado entre líneas y letras para facilitar la lectura',
      active: readingComfort,
      toggle: toggleReadingComfort
    },
    {
      icon: '⏸️',
      title: t('accessibility_feature_pause_title') || 'Pausar Animaciones',
      desc: t('accessibility_feature_pause_desc') || 'Desactiva todas las animaciones y transiciones',
      active: pauseAnimations,
      toggle: togglePauseAnimations
    },
    {
      icon: '🔊',
      title: t('accessibility_feature_tts_title') || 'Texto a Voz (TTS)',
      desc: t('accessibility_feature_tts_desc') || 'Lee el contenido en voz alta con la API Web Speech',
      active: ttsEnabled,
      toggle: toggleTTS
    }
  ]

  const shortcuts = [
    { key: 'Alt + 1', action: t('shortcut_open_menu') || 'Abrir menú de accesibilidad' },
    { key: 'Tab', action: t('shortcut_tab') || 'Navegar entre elementos' },
    { key: 'Enter / Espacio', action: t('shortcut_activate') || 'Activar elemento' },
    { key: 'Esc', action: t('shortcut_close') || 'Cerrar modales/menús' }
  ]

  return (
    <div className="min-h-screen py-12">
      <div className="container-custom max-w-5xl space-y-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold gradient-text mb-4">
            ♿ {t('accessibility_menu') || 'Accesibilidad'}
          </h1>
          <p className="text-xl text-textMuted max-w-3xl mx-auto">
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
          <h2 className="text-3xl font-bold mb-6">🛠️ {t('accessibility_features_title') || 'Funciones Disponibles'}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`card-glass p-6 border transition-all ${
                  feat.active 
                    ? 'border-uleamRed/60 shadow-glow'
                    : 'border-white/10'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-4xl mb-3">{feat.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{feat.title}</h3>
                    <p className="text-sm text-textMuted mb-4">
                      {feat.desc}
                    </p>
                  </div>
                  <button
                    onClick={feat.toggle}
                    className={`w-12 h-6 rounded-full transition-colors focus-visible ${
                      feat.active ? 'bg-uleamRed' : 'bg-white/20'
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
                    className="mt-3 pt-3 border-t border-white/10"
                  >
                    <span className="text-sm font-medium text-uleamRed">
                      ✅ {t('accessibility_active') || 'Activo'}
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
            className="card-glass p-6 mb-12"
          >
            <h3 className="text-xl font-bold mb-4">🎤 {t('accessibility_tts') || 'Prueba el Texto a Voz'}</h3>
              <p className="mb-4 text-textMuted">
                {t('accessibility_tts_test')}
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
          <h2 className="text-3xl font-bold mb-6">⌨️ {t('accessibility_shortcuts_title') || 'Atajos de Teclado'}</h2>
          <div className="card-glass p-6">
            <div className="grid md:grid-cols-2 gap-4">
              {shortcuts.map((shortcut, i) => (
                <div 
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
                >
                  <kbd className="px-3 py-2 bg-white/10 rounded-lg font-mono text-sm font-bold">
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
          className="card-glass p-8 bg-gradient-to-br from-uleamRed to-accentPurple text-white"
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
