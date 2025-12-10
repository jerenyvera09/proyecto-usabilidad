import Navbar from './Navbar'
import Footer from './Footer'
import AccessibilityMenu from './AccessibilityMenu'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-bg900 text-textPrimary transition-colors">
      <a 
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-uleamRed text-white px-3 py-2 rounded z-50 shadow-glow"
      >
        Saltar al contenido
      </a>
      <Navbar />
      <main id="main-content" className="flex-1 pt-24 pb-12">
        {children}
      </main>
      <Footer />
      <AccessibilityMenu />
    </div>
  )
}
