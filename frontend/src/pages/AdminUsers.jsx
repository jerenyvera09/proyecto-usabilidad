import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'
import { motion } from 'framer-motion'

export default function AdminUsers(){
  const { user } = useAuth()
  const { t } = useI18n()
  const [form, setForm] = useState({ nombre: '', email: '', password: '', role: 'user' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(false)

  // Cargar usuarios al montar el componente
  useEffect(() => {
    if (user && user.is_admin) {
      fetchUsers()
    }
  }, [user])

  const fetchUsers = async () => {
    setLoadingUsers(true)
    try {
      // Asumimos que el backend tiene un endpoint /api/admin/users
      const res = await axios.get('/api/admin/users')
      setUsers(res.data || [])
    } catch (err) {
      console.error('Error al cargar usuarios:', err)
      // Si el endpoint no existe, usar datos mock para demostración
      setUsers([
        { id: 1, nombre: 'Usuario Demo 1', email: 'user1@uleam.edu.ec', role: 'user', created_at: '2025-10-20' },
        { id: 2, nombre: 'Usuario Demo 2', email: 'user2@uleam.edu.ec', role: 'user', created_at: '2025-10-22' },
        { id: 3, nombre: 'Admin Demo', email: 'admin@uleam.edu.ec', role: 'admin', created_at: '2025-10-15' }
      ])
    } finally {
      setLoadingUsers(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    try {
      // Endpoint backend asumido: /api/admin/create-user
      const res = await axios.post('/api/admin/create-user', form)
      setMessage(res.data?.message || 'Usuario creado correctamente')
      setForm({ nombre: '', email: '', password: '', role: 'user' })
      // Recargar lista de usuarios
      fetchUsers()
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al crear usuario')
    } finally {
      setLoading(false)
    }
  }

  if (!user || !user.is_admin) {
    return (
      <div className="container-custom py-12">
        <div className="card p-8 max-w-lg mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-4">{t('access_denied') || 'Acceso denegado'}</h2>
          <p>{t('access_admin_required') || 'Necesitas permisos de administrador para acceder a esta sección.'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container-custom py-12 space-y-8">
      {/* Formulario de creación */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-8 max-w-lg mx-auto"
      >
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <span>👤</span> Crear usuario / administrador
        </h2>
        {message && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg border border-green-300 dark:border-green-700"
          >
            ✅ {message}
          </motion.div>
        )}
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg border border-red-300 dark:border-red-700"
          >
            ❌ {error}
          </motion.div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label" htmlFor="nombre">{t('label_name') || 'Nombre'}</label>
            <input id="nombre" value={form.nombre} onChange={e=> setForm({...form, nombre: e.target.value})} className="input w-full" />
          </div>
          <div>
            <label className="label" htmlFor="email">{t('label_email') || 'Email'}</label>
            <input id="email" value={form.email} onChange={e=> setForm({...form, email: e.target.value})} className="input w-full" />
          </div>
          <div>
            <label className="label" htmlFor="password">{t('label_password') || 'Contraseña'}</label>
            <input id="password" type="password" value={form.password} onChange={e=> setForm({...form, password: e.target.value})} className="input w-full" />
          </div>
          <div>
            <label className="label" htmlFor="role">{t('label_role') || 'Rol'}</label>
            <select id="role" value={form.role} onChange={e=> setForm({...form, role: e.target.value})} className="input w-full">
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? '⏳ Creando...' : '✅ Crear usuario'}
          </button>
        </form>
      </motion.div>

      {/* Tabla de usuarios de la base de datos */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <span>📊</span> Usuarios en la Base de Datos
          </h2>
          <button
            onClick={fetchUsers}
            disabled={loadingUsers}
            className="btn-secondary text-sm px-4 py-2"
            aria-label="Recargar lista de usuarios"
          >
            {loadingUsers ? '⏳ Cargando...' : '🔄 Actualizar'}
          </button>
        </div>

        {loadingUsers ? (
          <div className="text-center py-8">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full"></div>
            <p className="mt-4 text-neutral-600 dark:text-neutral-400">Cargando usuarios...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8 text-neutral-600 dark:text-neutral-400">
            <p className="text-4xl mb-2">📭</p>
            <p>No hay usuarios registrados aún</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-neutral-300 dark:border-neutral-600">
                  <th className="py-3 px-4 font-semibold">ID</th>
                  <th className="py-3 px-4 font-semibold">Nombre</th>
                  <th className="py-3 px-4 font-semibold">Email</th>
                  <th className="py-3 px-4 font-semibold">Rol</th>
                  <th className="py-3 px-4 font-semibold">Fecha Registro</th>
                  <th className="py-3 px-4 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((usuario, index) => (
                  <motion.tr
                    key={usuario.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                  >
                    <td className="py-3 px-4">{usuario.id}</td>
                    <td className="py-3 px-4 font-medium">{usuario.nombre}</td>
                    <td className="py-3 px-4 text-sm text-neutral-600 dark:text-neutral-400">{usuario.email}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        usuario.role === 'admin' 
                          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' 
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      }`}>
                        {usuario.role === 'admin' ? '👑 Admin' : '👤 Usuario'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-neutral-600 dark:text-neutral-400">
                      {usuario.created_at || 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button 
                          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                          aria-label={`Editar usuario ${usuario.nombre}`}
                        >
                          ✏️ Editar
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                          aria-label={`Eliminar usuario ${usuario.nombre}`}
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
          <p>📌 <strong>Total de usuarios:</strong> {users.length}</p>
          <p className="mt-1">💡 <strong>Tip:</strong> Los usuarios pueden iniciar sesión con su email institucional @uleam.edu.ec</p>
        </div>
      </motion.div>
    </div>
  )
}
