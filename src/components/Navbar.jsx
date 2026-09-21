import { useState, useEffect } from 'react'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const isDark = theme === 'dark'

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
          ? isDark
            ? 'bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20'
            : 'bg-[#fafafa]/90 backdrop-blur-xl border-b border-black/5 shadow-lg shadow-black/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a
          href="#home"
          onClick={(e) => handleClick(e, '#home')}
          className="flex items-center gap-2 group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm transition-transform group-hover:scale-110">
            Z
          </div>
          <span className={`font-semibold text-lg tracking-tight ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Zaidipro
          </span>
        </a>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleClick(e, link.href)}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                isDark
                  ? 'text-neutral-400 hover:text-white hover:bg-white/5'
                  : 'text-neutral-500 hover:text-neutral-900 hover:bg-black/5'
              }`}
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-lg transition-all duration-200 ${
              isDark
                ? 'text-neutral-400 hover:text-white hover:bg-white/10'
                : 'text-neutral-500 hover:text-neutral-900 hover:bg-black/5'
            }`}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <a
            href="#contact"
            onClick={(e) => handleClick(e, '#contact')}
            className="btn-primary text-sm !px-5 !py-2.5"
          >
            Let's Talk
          </a>
        </div>

        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-all ${
              isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'
            }`}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`p-2 transition-colors ${isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'}`}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className={`md:hidden backdrop-blur-xl border-t ${
          isDark ? 'bg-[#0a0a0a]/95 border-white/5' : 'bg-[#fafafa]/95 border-black/5'
        }`}>
          <div className="px-6 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleClick(e, link.href)}
                className={`px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                  isDark
                    ? 'text-neutral-400 hover:text-white hover:bg-white/5'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-black/5'
                }`}
              >
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              onClick={(e) => handleClick(e, '#contact')}
              className="btn-primary text-sm mt-2"
            >
              Let's Talk
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
