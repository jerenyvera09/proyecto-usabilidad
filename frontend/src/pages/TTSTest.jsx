import { useState } from 'react'
import { useAccessibility } from '../contexts/AccessibilityContext'

export default function TTSTest() {
  const { speak, stopSpeaking, ttsEnabled, toggleTTS } = useAccessibility()
  const [customText, setCustomText] = useState('Hola, soy el sistema de texto a voz de EduPredict. Esta es una demostración de la funcionalidad de lectura de texto.')

  const testMessages = [
    'Bienvenido a EduPredict',
    'Sistema web de predicción del rendimiento académico para estudiantes universitarios',
    'La accesibilidad es importante para todos',
    'Prueba número uno, dos, tres'
  ]

  const handleSpeak = (text) => {
    console.log('🎤 Intentando reproducir:', text)
    speak(text)
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-12">
      <div className="container-custom max-w-3xl">
        <h1 className="text-4xl font-bold mb-8 text-center">🔊 Prueba de Texto a Voz</h1>

        {/* Estado del TTS */}
        <div className="card p-6 mb-6 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold">Estado del TTS</h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {ttsEnabled ? '✅ Activado' : '⚠️ Desactivado (pero funciona igual)'}
              </p>
            </div>
            <button
              onClick={toggleTTS}
              className={`px-4 py-2 rounded-lg font-medium ${
                ttsEnabled 
                  ? 'bg-green-600 text-white' 
                  : 'bg-neutral-300 dark:bg-neutral-600'
              }`}
            >
              {ttsEnabled ? 'Desactivar' : 'Activar'} TTS
            </button>
          </div>

          {/* Información del navegador */}
          <div className="text-sm space-y-1">
            <p>Navegador soporta TTS: {('speechSynthesis' in window) ? '✅ Sí' : '❌ No'}</p>
            <p>Voces disponibles: {window.speechSynthesis?.getVoices().length || 0}</p>
          </div>
        </div>

        {/* Mensajes predefinidos */}
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">📝 Mensajes de Prueba</h2>
          <div className="space-y-3">
            {testMessages.map((msg, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <button
                  onClick={() => handleSpeak(msg)}
                  className="btn btn-primary flex-shrink-0"
                >
                  ▶️ Reproducir
                </button>
                <p className="text-sm">{msg}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Texto personalizado */}
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">✍️ Texto Personalizado</h2>
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            className="w-full p-3 border rounded-lg mb-3 min-h-[120px]"
            placeholder="Escribe aquí el texto que quieres escuchar..."
          />
          <div className="flex gap-3">
            <button
              onClick={() => handleSpeak(customText)}
              className="btn btn-primary"
              disabled={!customText.trim()}
            >
              ▶️ Reproducir Texto
            </button>
            <button
              onClick={stopSpeaking}
              className="btn btn-outline"
            >
              ⏹️ Detener
            </button>
          </div>
        </div>

        {/* Controles adicionales */}
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4">🎛️ Controles</h2>
          <div className="space-y-3">
            <button
              onClick={() => {
                const voices = window.speechSynthesis.getVoices()
                console.log('🎤 Voces disponibles:', voices)
                alert(`Voces disponibles: ${voices.length}\n\n${voices.slice(0, 5).map(v => `${v.name} (${v.lang})`).join('\n')}`)
              }}
              className="btn btn-secondary w-full"
            >
              🔍 Ver Voces Disponibles
            </button>
            
            <button
              onClick={() => {
                window.speechSynthesis.cancel()
                console.log('🔄 TTS reiniciado')
                alert('Motor de TTS reiniciado')
              }}
              className="btn btn-outline w-full"
            >
              🔄 Reiniciar Motor TTS
            </button>
          </div>
        </div>

        {/* Instrucciones */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="font-bold mb-2">💡 Instrucciones</h3>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>Haz clic en "Reproducir" para escuchar los mensajes de prueba</li>
            <li>Escribe tu propio texto y presiona "Reproducir Texto"</li>
            <li>Usa "Detener" para cancelar la reproducción actual</li>
            <li>Si no escuchas nada, verifica el volumen de tu sistema</li>
            <li>Algunos navegadores requieren interacción del usuario antes de reproducir</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
