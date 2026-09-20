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

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-200 antialiased">
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
    </div>
  )
}
