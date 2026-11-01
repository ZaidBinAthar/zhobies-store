import { useState, useEffect } from 'react'
import { Menu, X, Sun, Moon, ShoppingBag, Search, User, LogOut } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { useCompany } from '../hooks/useCompany'
import { getCurrentUser, logout as authLogout } from '../utils/authService'
import AuthModal from './AuthModal'

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Collections', href: '#collections' },
  { name: 'Products', href: '#products' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { company } = useCompany()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState(() => getCurrentUser())
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState('login')
  const isDark = theme === 'dark'

  useEffect(() => {
    const handleAuthChange = (e) => {
      setUser(e.detail)
    }
    window.addEventListener('auth_user_changed', handleAuthChange)
    return () => window.removeEventListener('auth_user_changed', handleAuthChange)
  }, [])

  const companyName = company?.name || 'Zhobies Wear'
  const logoLetter = companyName.trim().charAt(0).toUpperCase() || 'Z'
  const logoUrl = company?.logoUrl

  // Split name for styling (e.g. "Zhobies" and "Wear")
  const nameParts = companyName.split(' ')
  const firstNamePart = nameParts[0] || companyName
  const remainingNamePart = nameParts.slice(1).join(' ')

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
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={companyName}
              className="w-10 h-10 object-contain rounded border border-[#b8860b]/40 p-0.5 group-hover:border-[#d4a017] transition-all bg-[#0d0b09]/40"
            />
          ) : (
            <div className="w-9 h-9 border border-[#b8860b]/60 flex items-center justify-center text-[#d4a017] font-bold text-base transition-all group-hover:border-[#d4a017] group-hover:bg-[#b8860b]/10 font-serif">
              {logoLetter}
            </div>
          )}
          <div className="flex flex-col leading-tight">
            <span className={`font-serif font-bold text-lg tracking-wide ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              {firstNamePart}
            </span>
            {remainingNamePart ? (
              <span className="text-[#b8860b] text-[9px] tracking-[0.25em] uppercase font-medium -mt-0.5">
                {remainingNamePart}
              </span>
            ) : company?.tagline ? (
              <span className="text-[#b8860b] text-[9px] tracking-[0.2em] uppercase font-medium -mt-0.5">
                {company.tagline}
              </span>
            ) : null}
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
        <div className="hidden md:flex items-center gap-3">
          {/* User Sign In / Profile Button */}
          {user ? (
            <div className="flex items-center gap-2 px-3 py-1.5 border border-[#b8860b]/30 bg-[#b8860b]/10 text-xs">
              <User size={13} className="text-[#d4a017]" />
              <span className={`font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                {user.fullName || user.username}
              </span>
              <button
                onClick={() => authLogout()}
                className="text-neutral-500 hover:text-red-400 p-0.5 ml-1 transition-colors"
                title="Logout"
              >
                <LogOut size={12} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setAuthModalMode('login')
                setAuthModalOpen(true)
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium tracking-wider uppercase border border-[#b8860b]/30 hover:border-[#d4a017] transition-all ${
                isDark ? 'text-neutral-300 hover:text-white' : 'text-neutral-700 hover:text-black'
              }`}
            >
              <User size={14} className="text-[#d4a017]" />
              <span>Sign In</span>
            </button>
          )}

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
            {user ? (
              <div className="flex items-center justify-between px-4 py-3 bg-[#b8860b]/10 border border-[#b8860b]/30 text-xs my-2">
                <span className="font-medium text-white flex items-center gap-1.5">
                  <User size={13} className="text-[#d4a017]" />
                  {user.fullName || user.username}
                </span>
                <button
                  onClick={() => {
                    authLogout()
                    setIsOpen(false)
                  }}
                  className="text-red-400 hover:underline flex items-center gap-1"
                >
                  <LogOut size={12} />
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsOpen(false)
                  setAuthModalMode('login')
                  setAuthModalOpen(true)
                }}
                className="w-full py-2.5 my-2 border border-[#b8860b]/40 text-[#d4a017] text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2"
              >
                <User size={14} />
                Sign In / Sign Up
              </button>
            )}
            <a
              href="#contact"
              onClick={(e) => handleClick(e, '#contact')}
              className="btn-primary mt-1"
              id="mobile-nav-cta"
            >
              <ShoppingBag size={15} />
              Shop Now
            </a>
          </div>
        </div>
      )}

      {/* Login & Signup Modal */}
      <AuthModal
        isOpen={authModalOpen}
        defaultMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={(u) => setUser(u)}
      />
    </nav>
  )
}
