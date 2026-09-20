import { useState, useEffect } from 'react'
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

export default function App() {
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
      <div className="min-h-screen bg-[#0a0a0a] text-neutral-200 antialiased">
        <Admin />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-200 antialiased">
      <Portfolio />
    </div>
  )
}
