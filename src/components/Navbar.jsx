import { useState, useEffect } from 'react'
import { Menu, X, Sun, Moon, ShoppingBag, Search } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Collections', href: '#collections' },
  { name: 'Products', href: '#products' },
  { name: 'About', href: '#about' },
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? isDark
            ? 'bg-[#0d0b09]/95 backdrop-blur-xl border-b border-[#b8860b]/15 shadow-2xl shadow-black/40'
            : 'bg-[#faf8f5]/95 backdrop-blur-xl border-b border-[#b8860b]/15 shadow-lg shadow-black/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-18 py-4 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => handleClick(e, '#home')}
          className="flex items-center gap-3 group"
          id="nav-logo"
        >
          <div className="w-9 h-9 border border-[#b8860b]/60 flex items-center justify-center text-[#d4a017] font-bold text-base transition-all group-hover:border-[#d4a017] group-hover:bg-[#b8860b]/10 font-serif">
            Z
          </div>
          <div className="flex flex-col leading-tight">
            <span className={`font-serif font-bold text-lg tracking-wide ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Zohaibies
            </span>
            <span className="text-[#b8860b] text-[9px] tracking-[0.25em] uppercase font-medium -mt-0.5">
              Wear
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleClick(e, link.href)}
              className={`px-4 py-2 text-sm tracking-wide transition-all relative group ${
                isDark
                  ? 'text-neutral-400 hover:text-[#d4a017]'
                  : 'text-neutral-500 hover:text-[#8b6508]'
              }`}
            >
              {link.name}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-[#b8860b] transition-all duration-300 group-hover:w-4/5" />
            </a>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className={`p-2.5 transition-all duration-200 ${
              isDark
                ? 'text-neutral-400 hover:text-[#d4a017]'
                : 'text-neutral-500 hover:text-[#8b6508]'
            }`}
            aria-label="Toggle theme"
            id="theme-toggle-desktop"
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <a
            href="#contact"
            onClick={(e) => handleClick(e, '#contact')}
            className="btn-primary !px-6 !py-2.5"
            id="nav-cta"
          >
            <ShoppingBag size={15} />
            Shop Now
          </a>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className={`p-2 transition-all ${isDark ? 'text-neutral-400 hover:text-[#d4a017]' : 'text-neutral-500 hover:text-[#8b6508]'}`}
            aria-label="Toggle theme"
            id="theme-toggle-mobile"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`p-2 transition-colors ${isDark ? 'text-neutral-400 hover:text-[#d4a017]' : 'text-neutral-500 hover:text-[#8b6508]'}`}
            aria-label="Toggle menu"
            id="mobile-menu-toggle"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className={`md:hidden backdrop-blur-xl border-t ${
          isDark ? 'bg-[#0d0b09]/98 border-[#b8860b]/15' : 'bg-[#faf8f5]/98 border-[#b8860b]/15'
        }`}>
          <div className="px-6 py-5 flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleClick(e, link.href)}
                className={`px-4 py-3 text-sm font-medium tracking-wide transition-all border-l-2 border-transparent hover:border-[#b8860b] hover:pl-6 ${
                  isDark
                    ? 'text-neutral-400 hover:text-[#d4a017] hover:bg-[#b8860b]/5'
                    : 'text-neutral-600 hover:text-[#8b6508] hover:bg-[#b8860b]/5'
                }`}
              >
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              onClick={(e) => handleClick(e, '#contact')}
              className="btn-primary mt-3"
              id="mobile-nav-cta"
            >
              <ShoppingBag size={15} />
              Shop Now
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
