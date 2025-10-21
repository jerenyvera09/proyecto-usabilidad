import Navbar from './Navbar'
import Footer from './Footer'
import AccessibilityMenu from './AccessibilityMenu'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900 transition-colors">
      {/* Skip link para accesibilidad (WCAG 2.4.1) */}
      <a 
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-violet-700 text-white px-3 py-2 rounded z-50"
      >
        Saltar al contenido
      </a>
      <Navbar />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <AccessibilityMenu />
    </div>
  )
}
