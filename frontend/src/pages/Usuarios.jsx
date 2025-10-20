import { useState } from 'react'
import { motion } from 'framer-motion'
import { useI18n } from '../contexts/I18nContext'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Usuarios() {
  const { t } = useI18n()
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (isLogin) {
        // Login
        const response = await axios.post('/api/auth/login', {
          email: formData.email,
          password: formData.password
        })
        
        const { access_token, usuario } = response.data
        login(usuario, access_token)
        setSuccess(t('auth_login_success') || '¡Inicio de sesión exitoso!')
        
        setTimeout(() => {
          navigate('/dashboard')
        }, 1000)
      } else {
        // Registro
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

        await axios.post('/api/auth/register', {
          nombre: formData.nombre,
          email: formData.email,
          password: formData.password
        })

        setSuccess(t('auth_register_success') || '¡Registro exitoso! Ahora puedes iniciar sesión')
        setIsLogin(true)
        setFormData({ nombre: '', email: '', password: '', confirmPassword: '' })
      }
    } catch (err) {
      setError(
        err.response?.data?.detail || 
        t('auth_error') || 
        'Error al procesar la solicitud'
      )
    } finally {
      setLoading(false)
    }
  }

  if (isAuthenticated()) {
    return (
      <div className="container-custom py-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card p-12 max-w-md mx-auto"
        >
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-3xl font-bold mb-4">{t('auth_already_logged') || 'Ya has iniciado sesión'}</h2>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="btn btn-primary w-full"
          >
            {t('nav_dashboard') || 'Ir al Dashboard'}
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-neutral-900 dark:to-neutral-800 py-16">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto"
        >
          <div className="card p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-3xl font-bold">
                E
              </div>
              <h1 className="text-3xl font-bold gradient-text mb-2">
                {isLogin ? (t('auth_login') || 'Iniciar Sesión') : (t('auth_register') || 'Registrarse')}
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                {isLogin 
                  ? (t('auth_login_subtitle') || 'Accede a tu cuenta de EduPredict') 
                  : (t('auth_register_subtitle') || 'Crea tu cuenta institucional')
                }
              </p>
            </div>

            {/* Alertas */}
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-400"
              >
                ⚠️ {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-6 p-4 bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg text-green-700 dark:text-green-400"
              >
                ✅ {success}
              </motion.div>
            )}

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="label">{t('auth_name') || 'Nombre Completo'}</label>
                  <input
                    type="text"
                    required
                    className="input"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Juan Pérez"
                  />
                </div>
              )}

              <div>
                <label className="label">{t('auth_email') || 'Correo Institucional'}</label>
                <input
                  type="email"
                  required
                  className="input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="usuario@uleam.edu.ec"
                />
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  * Debes usar tu correo @uleam.edu.ec
                </p>
              </div>

              <div>
                <label className="label">{t('auth_password') || 'Contraseña'}</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  className="input"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                />
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  * Mínimo 6 caracteres
                </p>
              </div>

              {!isLogin && (
                <div>
                  <label className="label">{t('auth_confirm_password') || 'Confirmar Contraseña'}</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    className="input"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                  />
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="btn btn-primary w-full py-3 text-lg font-semibold"
              >
                {loading 
                  ? (t('msg_loading') || 'Cargando...') 
                  : isLogin 
                    ? (t('auth_login') || 'Iniciar Sesión') 
                    : (t('auth_register') || 'Registrarse')
                }
              </button>
            </form>

            {/* Toggle Login/Register */}
            <div className="mt-6 text-center">
              <p className="text-neutral-600 dark:text-neutral-400">
                {isLogin 
                  ? (t('auth_no_account') || '¿No tienes cuenta?') 
                  : (t('auth_have_account') || '¿Ya tienes cuenta?')
                }
                {' '}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin)
                    setError('')
                    setSuccess('')
                    setFormData({ nombre: '', email: '', password: '', confirmPassword: '' })
                  }}
                  className="text-primary-600 dark:text-primary-400 font-semibold hover:underline focus-visible"
                >
                  {isLogin 
                    ? (t('auth_register') || 'Registrarse') 
                    : (t('auth_login') || 'Iniciar Sesión')
                  }
                </button>
              </p>
            </div>
          </div>

          {/* Información institucional */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400"
          >
            <p>🎓 Sistema exclusivo para estudiantes de ULEAM</p>
            <p className="mt-2">🔒 Tus datos están protegidos y seguros</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
