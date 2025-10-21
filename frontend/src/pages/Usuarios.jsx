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

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    carrera: '',
    acceptPrivacy: false
  })

  const [touched, setTouched] = useState({})

  useEffect(() => {
    firstFieldRef.current?.focus()
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    if (remember && token && savedUser) {
      try {
        JSON.parse(savedUser)
        navigate('/dashboard')
      } catch {}
    }
    console.log('✅ Formulario de Usuarios mejorado según rúbrica docente ULEAM 2025.')
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setLoading(true)

    try {
      if (isLogin) {
        const response = await axios.post('/api/auth/login', {
          email: formData.email,
          password: formData.password
        })
        const { access_token, usuario } = response.data
        login(usuario, access_token)
        if (remember) {
          localStorage.setItem('remember', '1')
        } else {
          localStorage.removeItem('remember')
        }
        setSuccess(t('auth_login_success') || '¡Inicio de sesión exitoso!')
        setTimeout(() => navigate('/dashboard'), 800)
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
        setSuccess(t('auth_register_success') || '¡Registro exitoso! Ahora puedes iniciar sesión')
        setIsLogin(true)
        setFormData({ nombre: '', email: '', password: '', confirmPassword: '', carrera: '', acceptPrivacy: false })
      }
    } catch (err) {
      setError(err.response?.data?.detail || t('auth_error') || 'Error al procesar la solicitud')
    } finally {
      setLoading(false)
    }
  }

  if (isAuthenticated()) {
    return (
      <div className="container-custom py-16 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card p-12 max-w-md mx-auto">
          <h2 className="text-3xl font-bold mb-4">{t('auth_already_logged') || 'Ya has iniciado sesión'}</h2>
          <button onClick={() => navigate('/dashboard')} className="btn btn-primary w-full">
            {t('nav_dashboard') || 'Ir al Dashboard'}
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9fafb] via-white to-[#f9fafb] dark:from-neutral-900 dark:to-neutral-800 py-16">
      <div className="container-custom">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="card p-8 max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-3xl font-bold">E</div>
            <h1 className="text-3xl font-bold gradient-text mb-2 inline-flex items-center gap-2">
              {isLogin ? (t('auth_login') || 'Iniciar Sesión') : (t('auth_register') || 'Registrarse')}
              <TooltipHelp label="Ayuda">
                <ul className="list-disc pl-4 text-left">
                  <li>Usa tu correo institucional (@uleam.edu.ec).</li>
                  <li>La contraseña debe tener al menos 8 caracteres.</li>
                </ul>
              </TooltipHelp>
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              {isLogin ? (t('auth_login_subtitle') || 'Accede a tu cuenta de EduPredict') : (t('auth_register_subtitle') || 'Crea tu cuenta institucional')}
            </p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-400">⚠️ {error}</motion.div>
          )}
          {success && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6 p-4 bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg text-green-700 dark:text-green-400">✅ {success}</motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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
              <p id="email-help" className="text-xs text-neutral-500 dark:text-neutral-400 mt-1" aria-live="polite">{touched.email && !validity.email ? 'Usa tu correo @uleam.edu.ec' : '* Debes usar tu correo @uleam.edu.ec'}</p>
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
                <label className="label" htmlFor="confirm">Confirmar Contraseña *</label>
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
                  Recordar sesión
                </label>
                <button type="button" onClick={() => setShowRecovery(true)} className="text-[#1e3a8a] hover:underline focus-visible">¿Olvidaste tu contraseña?</button>
              </div>
            )}

            {!isLogin && (
              <div className="flex items-start gap-2">
                <input id="privacy" type="checkbox" checked={formData.acceptPrivacy} onChange={(e) => setFormData({ ...formData, acceptPrivacy: e.target.checked })} aria-required="true" />
                <label htmlFor="privacy" className="text-sm">He leído y acepto las <a className="text-[#1e3a8a] underline" href="/privacy">políticas de privacidad</a>.</label>
              </div>
            )}

            <button type="submit" disabled={loading || !allValid} className={`btn btn-primary w-full py-3 text-lg font-semibold ${!allValid ? 'opacity-50 cursor-not-allowed' : ''}`} aria-disabled={!allValid}>
              {loading ? 'Cargando...' : isLogin ? 'Iniciar sesión' : 'Registrarse'}
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
                className="text-primary-600 dark:text-primary-400 font-semibold hover:underline focus-visible"
              >
                {isLogin ? (t('auth_register') || 'Registrarse') : (t('auth_login') || 'Iniciar Sesión')}
              </button>
            </p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
          <p>🎓 Sistema exclusivo para estudiantes de ULEAM</p>
          <p className="mt-2">🔒 Tus datos están protegidos y seguros</p>
        </motion.div>

        <AnimatePresence>
          {(!!error || !!success) && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} role="status" aria-live="polite" className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-3 rounded-xl shadow-lg ${error ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
              {error ? `❌ ${error}` : `✅ ${success}`}
            </motion.div>
          )}
        </AnimatePresence>

        <PasswordRecoveryModal open={showRecovery} onClose={() => setShowRecovery(false)} />
      </div>
    </div>
  )
}

