import Navbar from './Navbar'
import Footer from './Footer'
import AccessibilityButton from './AccessibilityButton'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900 transition-colors">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <AccessibilityButton />
    </div>
  )
}
