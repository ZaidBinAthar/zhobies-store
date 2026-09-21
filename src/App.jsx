import { useState, useEffect } from 'react'
import { ThemeProvider, useTheme } from './hooks/useTheme'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Technologies from './components/Technologies'
import Services from './components/Services'
import Projects from './components/Projects'
import Workflow from './components/Workflow'
import WhyWorkWithMe from './components/WhyWorkWithMe'
import Contact from './components/Contact'
import Footer from './components/Footer'
import FloatingContact from './components/FloatingContact'
import Admin from './pages/Admin'

function Portfolio() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Technologies />
      <Services />
      <Projects />
      <Workflow />
      <WhyWorkWithMe />
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
      <div className={`min-h-screen antialiased ${theme === 'dark' ? 'bg-[#0a0a0a] text-neutral-200' : 'bg-[#fafafa] text-neutral-800'}`}>
        <Admin />
      </div>
    )
  }

  return (
    <div className={`min-h-screen antialiased ${theme === 'dark' ? 'bg-[#0a0a0a] text-neutral-200' : 'bg-[#fafafa] text-neutral-800'}`}>
      <Portfolio />
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
