import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function TooltipHelp({ label = 'Ayuda', children }) {
  const [open, setOpen] = useState(false)
  const btnRef = useRef(null)
  const tipRef = useRef(null)

  useEffect(() => {
    function onKey(e){
      if(e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    function onDocClick(e){
      if(open && tipRef.current && !tipRef.current.contains(e.target) && !btnRef.current.contains(e.target)){
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  return (
    <div className="relative inline-block">
      <button
        type="button"
        ref={btnRef}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls="tooltip-help"
        className="ml-2 w-6 h-6 rounded-full bg-[#1e3a8a] text-white text-xs font-bold inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8b5cf6]"
        title={label}
      >
        ?
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={tipRef}
            id="tooltip-help"
            role="tooltip"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute z-50 mt-2 w-64 p-3 rounded-lg shadow-soft bg-gradient-to-br from-bg800/95 via-bg900 to-bg800/90 border border-white/10 text-sm text-textPrimary backdrop-blur"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
