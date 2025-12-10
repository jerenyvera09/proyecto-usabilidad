import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export default function HelpModal({ open, onClose }) {
  const dialogRef = useRef(null)
  const closeBtnRef = useRef(null)

  useEffect(() => {
    function handleKey(e){
      if(e.key === 'Escape') onClose()
    }
    if(open){
      document.addEventListener('keydown', handleKey)
      // foco inicial
      setTimeout(()=> closeBtnRef.current?.focus(), 0)
    }
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  useEffect(() => {
    // Atrapar el foco dentro del modal
    function trapFocus(e){
      if(!dialogRef.current) return
      if(open && !dialogRef.current.contains(e.target)){
        e.stopPropagation()
        closeBtnRef.current?.focus()
      }
    }
    document.addEventListener('focus', trapFocus, true)
    return () => document.removeEventListener('focus', trapFocus, true)
  }, [open])

  if(!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="help-title" id="help-modal">
      <button aria-hidden className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        ref={dialogRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="relative w-full max-w-lg rounded-2xl bg-gradient-to-br from-bg800/95 via-bg900 to-bg800/90 shadow-soft border border-white/10 text-textPrimary"
      >
        <div className="px-6 py-5 border-b border-white/10">
          <h2 id="help-title" className="text-xl font-bold">Ayuda de EduPredict</h2>
        </div>
        <div className="px-6 py-5 space-y-4 text-textMuted">
          <section>
            <h3 className="font-semibold text-uleamRed">¿Qué es EduPredict?</h3>
            <p>
              EduPredict es un sistema web de la ULEAM que permite predecir el rendimiento académico de estudiantes universitarios
              para apoyar la toma de decisiones académicas y el acompañamiento estudiantil.
            </p>
          </section>
          <section>
            <h3 className="font-semibold text-uleamRed">¿Cómo llenar el formulario?</h3>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Accede al botón "Comenzar" en la página de inicio.</li>
              <li>Completa cada campo del formulario con información verídica.</li>
              <li>Revisa los datos y presiona "Calcular predicción".</li>
            </ol>
          </section>
        </div>
        <div className="px-6 py-4 flex justify-end gap-3 bg-white/5 border-t border-white/10 rounded-b-2xl">
          <button
            ref={closeBtnRef}
            onClick={onClose}
            className="btn btn-primary px-4 py-2"
          >
            Cerrar ayuda
          </button>
        </div>
      </motion.div>
    </div>
  )
}
