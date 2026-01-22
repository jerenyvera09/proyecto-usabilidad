import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useI18n } from '../contexts/I18nContext'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import TooltipHelp from '../components/TooltipHelp'
import PasswordRecoveryModal from '../components/PasswordRecoveryModal'

export default function Usuarios() {
  const { t } = useI18n()
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [remember, setRemember] = useState(() => localStorage.getItem('remember') === '1')
  const firstFieldRef = useRef(null)
  const [showRecovery, setShowRecovery] = useState(false)

  // Sistema de bloqueo temporal por seguridad
  const [failedAttempts, setFailedAttempts] = useState(() => {
    const stored = localStorage.getItem('failedAttempts')
    return stored ? parseInt(stored, 10) : 0
  })
  const [lockUntil, setLockUntil] = useState(() => {
    const stored = localStorage.getItem('lockUntil')
    return stored ? parseInt(stored, 10) : 0
  })
  const [isLocked, setIsLocked] = useState(false)
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0)

  // Notificaciones seguras (alertas accesibles)
  const [securityNotifications, setSecurityNotifications] = useState([])

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    carrera: '',
    acceptPrivacy: false
  })

  const [touched, setTouched] = useState({})

  // Verificar bloqueo temporal al montar el componente
  useEffect(() => {
    const checkLock = () => {
      const now = Date.now()
      if (lockUntil > now) {
        setIsLocked(true)
        const remaining = Math.ceil((lockUntil - now) / 1000)
        setLockTimeRemaining(remaining)
        addSecurityNotification('⚠️ Cuenta temporalmente bloqueada por seguridad', 'warning')
      } else {
        setIsLocked(false)
        setLockTimeRemaining(0)
        if (failedAttempts >= 3) {
          // Resetear intentos fallidos si el bloqueo ya expiró
          setFailedAttempts(0)
          localStorage.removeItem('failedAttempts')
          localStorage.removeItem('lockUntil')
        }
      }
    }
    checkLock()
    const interval = setInterval(checkLock, 1000)
    return () => clearInterval(interval)
  }, [lockUntil, failedAttempts])

  // Función para agregar notificaciones seguras
  const addSecurityNotification = (message, type = 'info') => {
    const id = Date.now()
    const notification = { id, message, type }
    setSecurityNotifications(prev => [...prev, notification])
    // Auto-remover después de 5 segundos
    setTimeout(() => {
      setSecurityNotifications(prev => prev.filter(n => n.id !== id))
    }, 5000)
  }

  // Redirigir automáticamente si el usuario ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      console.log('[Usuarios] Usuario autenticado, redirigiendo a /dashboard')
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    firstFieldRef.current?.focus()
    console.log('✅ Formulario de Usuarios mejorado según rúbrica docente ULEAM 2025.')
  }, [])

  const validators = {
    nombre: (v) => v.trim().length >= 3,
    email: (v) => /.+@uleam\.edu\.ec$/.test(v.trim()),
    password: (v) => v.length >= 8,
    confirmPassword: (v) => v === formData.password && v.length >= 8,
    carrera: (v) => (isLogin ? true : v.trim().length >= 2),
    acceptPrivacy: (v) => (isLogin ? true : !!v)
  }

  const validity = {
    nombre: validators.nombre(formData.nombre),
    email: validators.email(formData.email),
    password: validators.password(formData.password),
    confirmPassword: validators.confirmPassword(formData.confirmPassword),
    carrera: validators.carrera(formData.carrera),
    acceptPrivacy: validators.acceptPrivacy(formData.acceptPrivacy)
  }

  const allValid = isLogin
    ? validity.email && validity.password
    : validity.nombre && validity.email && validity.password && validity.confirmPassword && validity.carrera && validity.acceptPrivacy

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Verificar si está bloqueado
    if (isLocked) {
      const minutes = Math.ceil(lockTimeRemaining / 60)
      setError(`⛔ Cuenta bloqueada temporalmente. Intenta de nuevo en ${minutes} minuto(s).`)
      addSecurityNotification(`🔒 Intentos de acceso bloqueados por seguridad (${minutes} min restantes)`, 'error')
      return
    }

    setLoading(true)

    try {
      if (isLogin) {
        const response = await axios.post('/api/auth/login', {
          email: formData.email,
          password: formData.password
        })

        // --- 🛠️ INICIO DEL CAMBIO DE SEGURIDAD ---
        console.log("📡 RESPUESTA DEL BACKEND:", response.data); // Míralo en consola (F12)

        const access_token = response.data.access_token;
        
        // AQUÍ ESTÁ LA MAGIA: Si no viene como 'usuario', lo busca como 'user'
        const datosUsuario = response.data.usuario || response.data.user;

        // VALIDACIÓN: Si por alguna razón llega vacío, detenemos todo antes de romper la app
        if (!datosUsuario) {
            console.error("❌ ERROR CRÍTICO: El objeto de usuario llegó vacío o undefined");
            setError("Error interno: El servidor no devolvió los datos del perfil.");
            setLoading(false);
            return; 
        }
        // --- 🏁 FIN DEL CAMBIO ---

        // Resetear intentos fallidos al Iniciar sesión exitosamente
        setFailedAttempts(0)
        localStorage.removeItem('failedAttempts')
        localStorage.removeItem('lockUntil')
        
        if (remember) {
          localStorage.setItem('remember', '1')
        } else {
          localStorage.removeItem('remember')
        }
        
        setSuccess(t('auth_login_success') || '¡Inicio de Sesión exitoso!')
        addSecurityNotification('✅ Inicio de Sesión exitoso', 'success')
        
        // Usamos la variable segura 'datosUsuario'
        login(datosUsuario, access_token)
        
        // La redirección ahora la maneja el useEffect que vigila isAuthenticated
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError(t('auth_password_mismatch') || 'Las contraseñas no coinciden')
          setLoading(false)
          return
        }
        if (!formData.email.endsWith('@uleam.edu.ec')) {
          setError(t('auth_email_validation') || 'Debes usar un correo institucional @uleam.edu.ec')
          setLoading(false)
          return
        }
        if (!formData.acceptPrivacy) {
          setError('Debes aceptar las políticas de privacidad')
          setLoading(false)
          return
        }
        await axios.post('/api/auth/register', {
          nombre: formData.nombre,
          email: formData.email,
          password: formData.password,
          carrera: formData.carrera
        })
        setSuccess(t('auth_register_success') || '¡Registro exitoso! Ahora puedes Iniciar sesión')
        addSecurityNotification('✅ Registro completado correctamente', 'success')
        setIsLogin(true)
        setFormData({ nombre: '', email: '', password: '', confirmPassword: '', carrera: '', acceptPrivacy: false })
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || t('auth_error') || 'Error al procesar la solicitud'
      setError(errorMessage)
      
      // Manejar intentos fallidos de inicio de Sesión
      if (isLogin && err.response?.status === 401) {
        const newAttempts = failedAttempts + 1
        setFailedAttempts(newAttempts)
        localStorage.setItem('failedAttempts', newAttempts.toString())
        
        if (newAttempts >= 3) {
          // Bloquear por 5 minutos después de 3 intentos fallidos
          const lockTime = Date.now() + (5 * 60 * 1000) // 5 minutos
          setLockUntil(lockTime)
          setIsLocked(true)
          localStorage.setItem('lockUntil', lockTime.toString())
          setError('🔒 Demasiados intentos fallidos. Cuenta bloqueada por 5 minutos por seguridad.')
          addSecurityNotification('⛔ Cuenta bloqueada por 5 minutos debido a múltiples intentos fallidos', 'error')
        } else {
          const remaining = 3 - newAttempts
          setError(`❌ Credenciales incorrectas. ${remaining} intento(s) restante(s) antes del bloqueo.`)
          addSecurityNotification(`⚠️ Intento fallido ${newAttempts}/3. Quedan ${remaining} intentos.`, 'warning')
        }
      } else {
        addSecurityNotification(`❌ Error: ${errorMessage}`, 'error')
      }
    } finally {
      setLoading(false)
    }
  }
  if (isAuthenticated) {
    return (
      <>
        <div className="container-custom py-16 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card p-12 max-w-md mx-auto">
          <h2 className="text-3xl font-bold mb-4">{t('auth_already_logged') || 'Ya has iniciado Sesión'}</h2>
          <button onClick={() => navigate('/dashboard')} className="btn btn-primary w-full">
            {t('nav_dashboard') || 'Ir al Dashboard'}
          </button>
        </motion.div>
      </div>
      </>
    )
  }

  return (
    <>
      {/* Fondo página */}
      <div className="min-h-screen bg-gradient-to-br from-[#0b1b2a] via-[#0f2436] to-[#0b1b2a] dark:from-neutral-900 dark:to-neutral-800">
      {/* Notificaciones de seguridad accesibles */}
      <div 
        className="fixed top-20 right-6 z-[60] space-y-3 max-w-sm"
        role="region"
        aria-label="Notificaciones de seguridad"
        aria-live="polite"
      >
        <AnimatePresence>
          {securityNotifications.map(notification => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
              transition={{ type: 'spring', damping: 20 }}
              className={`p-4 rounded-lg shadow-2xl border-2 backdrop-blur-sm ${
                notification.type === 'success' 
                  ? 'bg-green-50 dark:bg-green-900/30 border-green-500 text-green-800 dark:text-green-200'
                  : notification.type === 'warning'
                  ? 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-500 text-yellow-800 dark:text-yellow-200'
                  : notification.type === 'error'
                  ? 'bg-red-50 dark:bg-red-900/30 border-red-500 text-red-800 dark:text-red-200'
                  : 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-800 dark:text-blue-200'
              }`}
              role="alert"
              aria-atomic="true"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg" aria-hidden="true">
                  {notification.type === 'success' ? '✅' : notification.type === 'warning' ? '⚠️' : notification.type === 'error' ? '❌' : 'ℹ️'}
                </span>
                <p className="font-semibold text-sm">{notification.message}</p>
                <button
                  onClick={() => setSecurityNotifications(prev => prev.filter(n => n.id !== notification.id))}
                  className="ml-auto p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors"
                  aria-label="Cerrar notificación"
                >
                  •
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal autenticación */}
      <div className="fixed inset-0 z-[50] flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          aria-hidden="true"
        />
        {/* Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', damping: 18 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-modal-title"
          className="w-[95vw] max-w-[480px] max-h-[85vh] overflow-auto rounded-2xl shadow-2xl border border-white/10 bg-gradient-to-b from-[#0f2740] to-[#0d2136] text-white relative"
        >
          {/* Header con tabs */}
          <div className="flex items-center justify-between px-6 pt-6">
            <h1 id="auth-modal-title" className="sr-only">Autenticación</h1>
            <div className="inline-flex p-1 rounded-xl bg-white/5 border border-white/10 shadow-inner">
              <button
                type="button"
                onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${isLogin ? 'bg-accentBlue text-white shadow-glow' : 'text-white/80 hover:text-white'}`}
                aria-pressed={isLogin}
              >
                Iniciar Sesión
              </button>
              <button
                type="button"
                onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${!isLogin ? 'bg-accentBlue text-white shadow-glow' : 'text-white/80 hover:text-white'}`}
                aria-pressed={!isLogin}
              >
                Registrarse
              </button>
            </div>
            <button
              type="button"
              onClick={() => navigate('/')}
              aria-label="Cerrar"
              className="ml-3 h-9 w-9 grid place-items-center rounded-lg bg-white/5 border border-white/10 hover:bg-white/10"
            >
              ✕
            </button>
          </div>

          <div className="px-6">
            {/* Título y ayuda */}
            <div className="text-center mb-6 mt-3">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-2xl font-bold">E</div>
              <h2 className="text-2xl font-bold inline-flex items-center gap-2">
                {isLogin ? (t('auth_login') || 'Iniciar sesión') : (t('auth_register') || 'Registrarse')}
                <TooltipHelp label="Ayuda">
                  <ul className="list-disc pl-4 text-left">
                    <li>Usa tu correo institucional (@uleam.edu.ec).</li>
                    <li>La contraseña debe tener al menos 8 caracteres.</li>
                  </ul>
                </TooltipHelp>
              </h2>
              <p className="text-white/70">
                {isLogin ? (t('auth_login_subtitle') || 'Accede a tu cuenta de EduPredict') : (t('auth_register_subtitle') || 'Crea tu cuenta institucional')}
              </p>
            </div>
          

          {error && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-400">⚠️ {error}</motion.div>
          )}
          {success && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6 p-4 bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg text-green-700 dark:text-green-400">✅ {success}</motion.div>
          )}

          {/* Indicador de bloqueo temporal */}
          {isLocked && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="mb-6 p-5 bg-orange-100 dark:bg-orange-900/30 border-2 border-orange-500 rounded-xl"
              role="alert"
              aria-live="assertive"
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl" aria-hidden="true">🔒</span>
                <div className="flex-1">
                  <h3 className="font-bold text-orange-800 dark:text-orange-200 mb-1">
                    Cuenta Bloqueada Temporalmente
                  </h3>
                  <p className="text-sm text-orange-700 dark:text-orange-300 mb-2">
                    Por razones de seguridad, tu cuenta ha sido bloqueada temporalmente debido a múltiples intentos de inicio de Sesión fallidos.
                  </p>
                  <div className="flex items-center gap-2 bg-orange-200 dark:bg-orange-800/50 rounded-lg px-3 py-2">
                    <span className="text-lg" aria-hidden="true">⏱️</span>
                    <span className="font-bold text-orange-900 dark:text-orange-100">
                      Tiempo restante: {Math.floor(lockTimeRemaining / 60)}:{String(lockTimeRemaining % 60).padStart(2, '0')} min
                    </span>
                  </div>
                  <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
                    💡 Tip: Si olvidaste tu contraseña, usa la opción "¿Olvidaste tu contraseña?" para recuperarla.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Advertencia de intentos fallidos */}
          {!isLocked && failedAttempts > 0 && isLogin && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="mb-6 p-4 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-500 rounded-lg"
              role="alert"
              aria-live="polite"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl" aria-hidden="true">⚠️</span>
                <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                  {failedAttempts}/3 intentos fallidos. Quedan {3 - failedAttempts} intento(s) antes del bloqueo temporal.
                </p>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 pb-6" noValidate>
            {!isLogin && (
              <div>
                <label className="label" htmlFor="nombre">Nombre Completo *</label>
                <div className="relative">
                  <input id="nombre" type="text" required aria-required="true" ref={firstFieldRef} className={`input pr-10 ${touched.nombre && (validity.nombre ? 'ring-2 ring-green-500' : 'ring-2 ring-red-500')}`} value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} onBlur={() => setTouched({ ...touched, nombre: true })} placeholder="Juan Pérez" aria-invalid={touched.nombre && !validity.nombre} aria-describedby="nombre-help" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2" aria-hidden>{touched.nombre && (validity.nombre ? '✓' : '✗')}</span>
                </div>
                <p id="nombre-help" className="text-xs mt-1" aria-live="polite">{touched.nombre && !validity.nombre ? 'Mínimo 3 caracteres' : ''}</p>
              </div>
            )}

            <div>
              <label className="label" htmlFor="email">Correo Institucional *</label>
              <div className="relative">
                <input id="email" type="email" required aria-required="true" ref={isLogin ? firstFieldRef : null} className={`input pr-10 ${touched.email && (validity.email ? 'ring-2 ring-green-500' : 'ring-2 ring-red-500')}`} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} onBlur={() => setTouched({ ...touched, email: true })} placeholder="usuario@uleam.edu.ec" aria-invalid={touched.email && !validity.email} aria-describedby="email-help" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2" aria-hidden>{touched.email && (validity.email ? '✓' : '✗')}</span>
              </div>
                <p id="email-help" className="text-xs text-white/70 mt-1" aria-live="polite">{touched.email && !validity.email ? 'Usa tu correo @uleam.edu.ec' : '* Debes usar tu correo @uleam.edu.ec'}</p>
            </div>

            <div>
              <label className="label" htmlFor="password">Contraseña *</label>
              <div className="relative">
                <input id="password" type="password" required aria-required="true" minLength={8} className={`input pr-10 ${touched.password && (validity.password ? 'ring-2 ring-green-500' : 'ring-2 ring-red-500')}`} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} onBlur={() => setTouched({ ...touched, password: true })} placeholder="••••••••" aria-invalid={touched.password && !validity.password} aria-describedby="password-help" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2" aria-hidden>{touched.password && (validity.password ? '✓' : '✗')}</span>
              </div>
              <p id="password-help" className="text-xs text-neutral-500 dark:text-neutral-400 mt-1" aria-live="polite">{touched.password && !validity.password ? 'La contraseña debe tener al menos 8 caracteres' : '* Mínimo 8 caracteres'}</p>
            </div>

            {!isLogin && (
              <div>
                <label className="label" htmlFor="confirm">Confirmar contraseña *</label>
                <div className="relative">
                  <input id="confirm" type="password" required aria-required="true" minLength={8} className={`input pr-10 ${touched.confirmPassword && (validity.confirmPassword ? 'ring-2 ring-green-500' : 'ring-2 ring-red-500')}`} value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} onBlur={() => setTouched({ ...touched, confirmPassword: true })} placeholder="••••••••" aria-invalid={touched.confirmPassword && !validity.confirmPassword} aria-describedby="confirm-help" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2" aria-hidden>{touched.confirmPassword && (validity.confirmPassword ? '✓' : '✗')}</span>
                </div>
                <p id="confirm-help" className="text-xs mt-1" aria-live="polite">{touched.confirmPassword && !validity.confirmPassword ? 'Las contraseñas deben coincidir' : ''}</p>
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="label" htmlFor="carrera">Carrera *</label>
                <div className="relative">
                  <input id="carrera" type="text" required aria-required="true" className={`input pr-10 ${touched.carrera && (validity.carrera ? 'ring-2 ring-green-500' : 'ring-2 ring-red-500')}`} value={formData.carrera} onChange={(e) => setFormData({ ...formData, carrera: e.target.value })} onBlur={() => setTouched({ ...touched, carrera: true })} placeholder="Ingeniería en Sistemas" aria-invalid={touched.carrera && !validity.carrera} aria-describedby="carrera-help" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2" aria-hidden>{touched.carrera && (validity.carrera ? '✓' : '✗')}</span>
                </div>
                <p id="carrera-help" className="text-xs mt-1" aria-live="polite">{touched.carrera && !validity.carrera ? 'Ingresa al menos 2 caracteres' : ''}</p>
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                  Recordar Sesión
                </label>
                <button type="button" onClick={() => setShowRecovery(true)} className="text-accentBlue hover:underline focus-visible">¿Olvidaste tu contraseña?</button>
              </div>
            )}

            {!isLogin && (
              <div className="flex items-start gap-2">
                <input id="privacy" type="checkbox" checked={formData.acceptPrivacy} onChange={(e) => setFormData({ ...formData, acceptPrivacy: e.target.checked })} aria-required="true" />
                <label htmlFor="privacy" className="text-sm">He leído y acepto las <a className="text-[#1e3a8a] underline" href="/privacy">políticas de privacidad</a>.</label>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading || !allValid || isLocked} 
              className={`w-full py-3 text-lg font-semibold rounded-xl bg-gradient-to-r from-uleamRed to-accentBlue shadow-glow hover:opacity-95 transition ${
                !allValid || isLocked ? 'opacity-50 cursor-not-allowed' : ''
              }`} 
              aria-disabled={!allValid || isLocked}
            >
              {loading ? '⏳ Cargando...' : isLocked ? '🔒 Bloqueado' : isLogin ? '🔓 Iniciar sesión' : '✅ Registrarse'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-neutral-600 dark:text-neutral-400">
              {isLogin ? (t('auth_no_account') || '¿No tienes cuenta?') : (t('auth_have_account') || '¿Ya tienes cuenta?')}{' '}
              <button
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError('')
                  setSuccess('')
                  setFormData({ nombre: '', email: '', password: '', confirmPassword: '', carrera: '', acceptPrivacy: false })
                  setTouched({})
                }}
                className="text-accentBlue font-semibold hover:underline focus-visible"
              >
                {isLogin ? (t('auth_register') || 'Registrarse') : (t('auth_login') || 'Iniciar sesión')}
              </button>
            </p>
          </div>
          {/* Cierre del contenedor de padding */}
          </div>
        </motion.div>
      </div>
      {/* Cierre del contenedor fijo del modal */}

      {/* Toast de estado y modal de recuperación fuera del contenedor fijo */}
      <AnimatePresence>
        {(!!error || !!success) && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} role="status" aria-live="polite" className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-3 rounded-xl shadow-lg ${error ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
            {error ? `❌ ${error}` : `✅ ${success}`}
          </motion.div>
        )}
      </AnimatePresence>

      <PasswordRecoveryModal open={showRecovery} onClose={() => setShowRecovery(false)} />

      {/* Cierre del fondo principal */}
    </div>
    </>
  )
}
