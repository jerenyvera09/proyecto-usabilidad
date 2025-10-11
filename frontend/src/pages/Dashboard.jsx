import React, { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { Link } from 'react-router-dom'

export default function Dashboard(){
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(()=>{ (async()=>{
    try{
      const token = localStorage.getItem('token')
      if(!token){ setError('No autenticado. Por favor ingresa desde la pantalla de predicción.'); setLoading(false); return }
      const res = await api.get('/api/students')
      setRows(res.data)
      setLoading(false)
    }catch(e){ console.error(e); setError('Error al cargar datos.'); setLoading(false) }
  })() }, [])

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      {loading && <div className="text-sm text-gray-500">Cargando datos...</div>}
      {error && (
        <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800">
          {error} {error.includes('autenticado') && <Link to="/prediction" className="underline ml-2">Ir a Ingresar</Link>}
        </div>
      )}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-100"><tr><th className="p-2 border">Nombre</th><th className="p-2 border">GPA</th><th className="p-2 border">Asistencia</th><th className="p-2 border">Horas</th><th className="p-2 border">Riesgo</th></tr></thead>
            <tbody>
              {rows.map(r=>(
                <tr key={r.id} className="odd:bg-white even:bg-gray-50">
                  <td className="p-2 border">{r.name}</td>
                  <td className="p-2 border">{r.gpa}</td>
                  <td className="p-2 border">{r.attendance}</td>
                  <td className="p-2 border">{r.study_hours}</td>
                  <td className="p-2 border">{r.label ? 'Alto' : 'Bajo'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
