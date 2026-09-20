import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleClick = (e, href) => {
    e.preventDefault()
    setIsOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <a
          href="#home"
          onClick={(e) => handleClick(e, '#home')}
          className="flex items-center gap-2 group"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm transition-transform group-hover:scale-110">
            Z
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">
            Zaidipro
          </span>
        </a>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleClick(e, link.href)}
              className="px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          <a
            href="#contact"
            onClick={(e) => handleClick(e, '#contact')}
            className="px-5 py-2.5 bg-gradient-to-r from-primary to-accent text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5"
          >
            Let's Talk
          </a>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-neutral-400 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/5">
          <div className="px-6 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleClick(e, link.href)}
                className="px-4 py-3 text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-all text-sm font-medium"
              >
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              onClick={(e) => handleClick(e, '#contact')}
              className="mt-2 px-4 py-3 bg-gradient-to-r from-primary to-accent text-white text-sm font-medium rounded-lg text-center"
            >
              Let's Talk
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
