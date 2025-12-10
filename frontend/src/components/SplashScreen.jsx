import { motion } from 'framer-motion'
import { useI18n } from '../contexts/I18nContext'

export default function SplashScreen() {
  const { t } = useI18n()

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-uleamRed via-bg900 to-uleamRedDark"
    >
      <div className="text-center space-y-6">
        {/* Logo animado */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            duration: 0.8, 
            type: 'spring', 
            stiffness: 200,
            delay: 0.1
          }}
          className="w-24 h-24 mx-auto rounded-full bg-white flex items-center justify-center shadow-2xl"
        >
          <span className="text-5xl font-bold gradient-text">E</span>
        </motion.div>

        {/* Título */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-4xl font-bold text-white"
        >
          EduPredict
        </motion.h1>

        {/* Subtítulo */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-white/80 text-lg"
        >
          {t('splash_loading')}
        </motion.p>

        {/* Spinner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center"
        >
          <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        </motion.div>
      </div>
    </motion.div>
  )
}
