import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PasswordRecoveryModal({ open, onClose }){
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  useEffect(() => {
    function onKey(e){ if(e.key === 'Escape') onClose?.() }
    if(open){ document.addEventListener('keydown', onKey); setTimeout(()=> closeRef.current?.focus(), 0) }
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulación de envío
    setSent(true)
    setTimeout(() => {
      onClose?.()
      setSent(false)
      setEmail('')
    }, 1200)
  }

  if(!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="recovery-title">
      <button aria-hidden className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <AnimatePresence>
        <motion.div
          ref={dialogRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md rounded-2xl bg-gradient-to-br from-bg800/95 via-bg900 to-bg800/90 border border-white/10 shadow-soft text-textPrimary"
          role="document"
        >
          <div className="px-6 py-4 border-b border-white/10">
            <h2 id="recovery-title" className="text-xl font-bold">Recuperar contraseña</h2>
          </div>
          <div className="px-6 py-5">
            {!sent ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="recovery-email" className="block text-sm font-medium mb-1 text-textMuted dark:text-[#F1F5F9]">Correo institucional *</label>
                  <input
                    id="recovery-email"
                    type="email"
                    required
                    aria-required="true"
                    className="input"
                    placeholder="usuario@uleam.edu.ec"
                    value={email}
                    onChange={(e)=> setEmail(e.target.value)}
                  />
                  <p className="text-xs text-textMuted dark:text-[#CBD5E1] mt-1" aria-live="polite">Usa tu correo @uleam.edu.ec</p>
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" ref={closeRef} onClick={onClose} className="btn btn-outline">Cancelar</button>
                  <button type="submit" className="btn btn-primary">Enviar</button>
                </div>
              </form>
            ) : (
              <div role="status" aria-live="polite" className="text-accentBlue">
                ✅ Correo de recuperación enviado
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
