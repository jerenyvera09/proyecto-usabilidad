import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'

export default function AdminUsers(){
  const { user } = useAuth()
  const [form, setForm] = useState({ nombre: '', email: '', password: '', role: 'user' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

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
          <h2 className="text-2xl font-semibold mb-4">Acceso denegado</h2>
          <p>Necesitas permisos de administrador para acceder a esta sección.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container-custom py-12">
      <div className="card p-8 max-w-lg mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Crear usuario / administrador</h2>
        {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{message}</div>}
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label" htmlFor="nombre">Nombre</label>
            <input id="nombre" value={form.nombre} onChange={e=> setForm({...form, nombre: e.target.value})} className="input w-full" />
          </div>
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" value={form.email} onChange={e=> setForm({...form, email: e.target.value})} className="input w-full" />
          </div>
          <div>
            <label className="label" htmlFor="password">Contraseña</label>
            <input id="password" type="password" value={form.password} onChange={e=> setForm({...form, password: e.target.value})} className="input w-full" />
          </div>
          <div>
            <label className="label" htmlFor="role">Rol</label>
            <select id="role" value={form.role} onChange={e=> setForm({...form, role: e.target.value})} className="input w-full">
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Creando...' : 'Crear usuario'}</button>
        </form>
      </div>
    </div>
  )
}
