import { useState, useEffect } from 'react'
import { ThemeProvider, useTheme } from './hooks/useTheme'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Collections from './components/About'        // Collections section
import Products from './components/Services'        // Featured Products
import About from './components/Projects'           // About Brand + Testimonials
import HowToOrder from './components/Workflow'      // How to Order
import WhyChooseUs from './components/WhyWorkWithMe' // Why Choose Zohaibies
import Fabrics from './components/Technologies'     // Fabric Range
import Contact from './components/Contact'
import Footer from './components/Footer'
import FloatingContact from './components/FloatingContact'
import Admin from './pages/Admin'

function Store() {
  return (
    <>
      <Navbar />
      <Hero />
      <Collections />
      <Products />
      <About />
      <HowToOrder />
      <WhyChooseUs />
      <Fabrics />
      <Contact />
      <Footer />
      <FloatingContact />
    </>
  )
}

function AppContent() {
  const { theme } = useTheme()
  const [page, setPage] = useState(window.location.hash.slice(1) || 'home')

  useEffect(() => {
    const onHashChange = () => {
      setPage(window.location.hash.slice(1) || 'home')
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  if (page === 'admin') {
    return (
      <div className={`min-h-screen antialiased ${theme === 'dark' ? 'bg-[#0d0b09] text-neutral-200' : 'bg-[#faf8f5] text-neutral-800'}`}>
        <Admin />
      </div>
    )
  }

  return (
    <div className={`min-h-screen antialiased ${theme === 'dark' ? 'bg-[#0d0b09] text-[#e8ddd0]' : 'bg-[#faf8f5] text-neutral-900'}`}>
      <Store />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}
