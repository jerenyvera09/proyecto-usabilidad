import React from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  const features = [
    {title: 'Predicción Inteligente', desc: 'Modelos que anticipan riesgos y apoyan decisiones.'},
    {title: 'Visualización de Datos', desc: 'Dashboards claros para supervisión y análisis.'},
    {title: 'Privacidad', desc: 'Datos anonimizados y uso responsable.'},
    {title: 'Beneficios', desc: 'Intervenciones tempranas para mejorar el rendimiento.'},
  ]

  return (
    <section className="space-y-12">
      <div className="grid md:grid-cols-2 gap-8 items-center rounded-xl p-6 md:p-10 hero-bg">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight headline-animate">Sistema Web de Predicción del Rendimiento Académico</h1>
          <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-xl subtitle-fade">IA que analiza notas, hábitos de estudio y asistencia para anticipar riesgos de deserción estudiantil y facilitar intervenciones tempranas.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/dashboard" className="btn-primary shadow">Ir al dashboard</Link>
            <Link to="/prediction" className="px-5 py-3 rounded-full border border-gray-200 dark:border-gray-700">Conocer más</Link>
          </div>
        </div>
        <div className="order-first md:order-last flex justify-center md:justify-end">
          <div className="hero-card hidden md:block w-80">
            <div className="text-sm font-semibold mb-2">Visión rápida</div>
            <div className="text-xs text-[var(--muted)] mb-4">Interfaz simple con recomendaciones accionables y paneles claros para seguimiento.</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-white/90 rounded-lg shadow-sm">Estudiantes</div>
              <div className="p-3 bg-white/90 rounded-lg shadow-sm">Predicciones</div>
              <div className="p-3 bg-white/90 rounded-lg shadow-sm">Alertas</div>
              <div className="p-3 bg-white/90 rounded-lg shadow-sm">Reportes</div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 headline-animate">Qué ofrecemos</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {features.map((f,i)=> (
            <div key={i} className={`p-6 bg-white dark:bg-gray-800 rounded-xl shadow card-animate ${i===0? 'stagger-1' : i===1? 'stagger-2' : i===2? 'stagger-3' : 'stagger-4'}`}>
              <div className="font-semibold mb-2">{f.title}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
