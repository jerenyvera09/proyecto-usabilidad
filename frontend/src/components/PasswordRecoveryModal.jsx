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
      <button aria-hidden className="absolute inset-0 bg-black/40" onClick={onClose} />
      <AnimatePresence>
        <motion.div
          ref={dialogRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-2xl"
          role="document"
        >
          <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
            <h2 id="recovery-title" className="text-xl font-bold">Recuperar contraseña</h2>
          </div>
          <div className="px-6 py-5">
            {!sent ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="recovery-email" className="block text-sm font-medium mb-1">Correo institucional *</label>
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
                  <p className="text-xs text-neutral-600 mt-1" aria-live="polite">Usa tu correo @uleam.edu.ec</p>
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" ref={closeRef} onClick={onClose} className="btn btn-outline">Cancelar</button>
                  <button type="submit" className="btn btn-primary">Enviar</button>
                </div>
              </form>
            ) : (
              <div role="status" aria-live="polite" className="text-green-700 dark:text-green-400">
                ✅ Correo de recuperación enviado
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
