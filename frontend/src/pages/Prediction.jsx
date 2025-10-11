import React, { useState } from 'react'
import { api, setToken } from '../lib/api'

export default function Prediction(){
  const [form, setForm] = useState({ name:'', gpa:3.0, attendance:90, study_hours:5 })
  const [result, setResult] = useState(null)
  const [email, setEmail] = useState(localStorage.getItem('email') || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function login(){
    setError('')
    setLoading(true)
    try{
      const { data } = await api.post('/api/auth/login', { email, password: 'demo' })
      setToken(data.access_token)
      localStorage.setItem('email', email)
      setLoading(false)
      setError('')
    }catch(e){
      setLoading(false)
      setError('Error en autenticación. Asegúrate de usar un correo ULEAM.')
    }
  }

  async function submit(e){
    e.preventDefault()
    setError('')
    setLoading(true)
    try{
      const { data } = await api.post('/api/predict', form)
      setResult(data)
      setLoading(false)
    }catch(err){
      setLoading(false)
      setError('Debes iniciar sesión con correo ULEAM o tu sesión expiró.')
    }
  }

  return (
    <section className="grid md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-2xl font-bold mb-3">Crear predicción (demo)</h2>
        <form onSubmit={submit} className="space-y-3">
          {['name','gpa','attendance','study_hours'].map(key=>(
            <div key={key}>
              <label className="block text-sm mb-1 capitalize">{key.replace('_',' ')}</label>
              <input value={form[key]} onChange={e=> setForm({...form, [key]: e.target.value})} className="w-full border rounded px-3 py-2" />
            </div>
          ))}
          <button disabled={loading} className="px-4 py-2 rounded bg-brand text-white disabled:opacity-60">{loading ? 'Procesando...' : 'Predecir'}</button>
        </form>
        {result && (
          <div className="mt-4 p-4 rounded border">
            <div className="font-semibold">Resultado</div>
            <div>Probabilidad de riesgo: <b>{result.risk_prob}</b></div>
            <div>Etiqueta: <b>{result.risk_label ? 'Alto' : 'Bajo'}</b></div>
            <div>{result.message}</div>
          </div>
        )}
        {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Autenticación (demo ULEAM)</h3>
        <div className="space-y-2">
          <input value={email} onChange={e=> setEmail(e.target.value)} placeholder="tu@uleam.edu.ec" className="w-full border rounded px-3 py-2" />
          <button onClick={login} disabled={loading} className="px-4 py-2 rounded border bg-white">{loading ? 'Ingresando...' : 'Ingresar'}</button>
        </div>
        <p className="text-sm text-gray-500 mt-2">Se acepta cualquier contraseña; debe usar un email ULEAM.</p>
      </div>
    </section>
  )
}
