import { ArrowRight, ExternalLink } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

export default function Hero() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const scrollTo = (id) => {
    const el = document.querySelector(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/6 rounded-full blur-[100px] animate-float" style={{ animationDelay: '3s' }} />

        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)'} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />

        <div className="absolute top-20 right-20 w-px h-32 bg-gradient-to-b from-transparent via-primary/30 to-transparent hidden lg:block" />
        <div className="absolute bottom-32 left-16 w-24 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent hidden lg:block" />

        <div className="absolute top-32 left-16 p-3 glass rounded-xl hidden lg:block animate-float" style={{ animationDelay: '1s' }}>
          <div className={`flex items-center gap-2 text-xs font-mono ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
            <span className="w-2 h-2 rounded-full bg-green-500" />
            {'<developer />'}
          </div>
        </div>

        <div className="absolute bottom-40 right-20 p-3 glass rounded-xl hidden lg:block animate-float" style={{ animationDelay: '2s' }}>
          <div className={`text-xs font-mono ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
            {'{ building: "software" }'}
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in-up">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Available for New Projects</span>
        </div>

        <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-in-up delay-100 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
          Hi, I'm{' '}
          <span className="gradient-text">Zaid Bin Ather</span>
        </h1>

        <p className={`text-xl sm:text-2xl font-light mb-4 animate-fade-in-up delay-200 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
          Software Engineering Student & Web Developer
        </p>

        <p className={`text-base sm:text-lg max-w-2xl mx-auto mb-10 animate-fade-in-up delay-300 ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
          I build modern websites and powerful business software designed around real-world needs.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-400">
          <button
            onClick={() => scrollTo('#contact')}
            className="btn-primary text-base !px-8 !py-4"
          >
            Start a Project
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => scrollTo('#projects')}
            className="btn-secondary text-base !px-8 !py-4"
          >
            Explore My Work
            <ExternalLink size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className={`w-6 h-10 rounded-full border-2 flex justify-center pt-2 ${isDark ? 'border-white/20' : 'border-black/20'}`}>
          <div className={`w-1.5 h-3 rounded-full ${isDark ? 'bg-white/40' : 'bg-black/40'}`} />
        </div>
      </div>
    </section>
  )
}
