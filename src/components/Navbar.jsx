import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Menu,
  X,
  Sun,
  Moon,
  ShoppingBag,
  User,
  LogOut,
  Search,
  Sparkles
} from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { useCompany } from '../hooks/useCompany'
import { getCurrentUser, logout as authLogout } from '../utils/authService'
import AuthModal from './AuthModal'
import SmartSearchModal from './SmartSearchModal'

const navLinks = [
  { name: 'Home', path: '/home' },
  { name: 'Collections', path: '/collections' },
  { name: 'Products', path: '/products' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
]

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { company } = useCompany()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState(() => getCurrentUser())
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState('login')
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const isDark = theme === 'dark'

  useEffect(() => {
    const handleAuthChange = (e) => {
      setUser(e.detail)
    }
    window.addEventListener('auth_user_changed', handleAuthChange)
    return () => window.removeEventListener('auth_user_changed', handleAuthChange)
  }, [])

  // Global Ctrl+K / Cmd+K shortcut for Smart Search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchModalOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const companyName = company?.name || 'BinAfzal Wears'
  const logoLetter = companyName.trim().charAt(0).toUpperCase() || 'B'
  const logoUrl = company?.logoUrl

  const nameParts = companyName.split(' ')
  const firstNamePart = nameParts[0] || companyName
  const remainingNamePart = nameParts.slice(1).join(' ')

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isLinkActive = (path) => {
    if (path === '/home') {
      return location.pathname === '/' || location.pathname === '/home'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? isDark
              ? 'bg-[#0d0b09]/95 backdrop-blur-xl border-b border-[#b8860b]/15 shadow-2xl shadow-black/40'
              : 'bg-[#faf8f5]/95 backdrop-blur-xl border-b border-[#b8860b]/15 shadow-lg shadow-black/5'
            : isDark
            ? 'bg-gradient-to-b from-[#0d0b09]/90 to-transparent'
            : 'bg-gradient-to-b from-[#faf8f5]/90 to-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-18 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/home"
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
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isLinkActive(link.path)
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-2 text-sm tracking-wide transition-all relative group font-medium ${
                    active
                      ? isDark
                        ? 'text-[#d4a017]'
                        : 'text-[#8b6508]'
                      : isDark
                      ? 'text-neutral-400 hover:text-[#d4a017]'
                      : 'text-neutral-600 hover:text-[#8b6508]'
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-[#b8860b] transition-all duration-300 ${
                      active ? 'w-4/5' : 'w-0 group-hover:w-4/5'
                    }`}
                  />
                </Link>
              )
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Smart Search Trigger Button */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className={`flex items-center gap-2.5 px-3 py-1.5 text-xs border border-[#b8860b]/30 hover:border-[#d4a017] transition-all cursor-pointer ${
                isDark
                  ? 'bg-[#120f0c] text-neutral-300 hover:text-white'
                  : 'bg-white text-neutral-700 hover:text-black shadow-sm'
              }`}
              title="Smart Search (Ctrl+K)"
            >
              <Search size={14} className="text-[#d4a017]" />
              <span className="hidden lg:inline text-[11px] tracking-wide">Search atelier...</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 border border-neutral-700/60 bg-black/20 text-[9px] text-neutral-400 font-mono">
                ⌘K
              </kbd>
            </button>

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
              className={`p-2.5 transition-all duration-200 border border-transparent hover:border-[#b8860b]/30 ${
                isDark
                  ? 'text-neutral-400 hover:text-[#d4a017]'
                  : 'text-neutral-500 hover:text-[#8b6508]'
              }`}
              aria-label="Toggle theme"
              id="theme-toggle-desktop"
            >
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            <Link
              to="/products"
              className="btn-primary !px-5 !py-2.5 flex items-center gap-2 text-xs tracking-wider"
              id="nav-cta"
            >
              <ShoppingBag size={14} />
              <span>Shop Now</span>
            </Link>
          </div>

          {/* Mobile Buttons */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={() => setSearchModalOpen(true)}
              className={`p-2 transition-all ${isDark ? 'text-neutral-400 hover:text-[#d4a017]' : 'text-neutral-600 hover:text-[#8b6508]'}`}
              aria-label="Smart search"
            >
              <Search size={18} />
            </button>
            <button
              onClick={toggleTheme}
              className={`p-2 transition-all ${isDark ? 'text-neutral-400 hover:text-[#d4a017]' : 'text-neutral-600 hover:text-[#8b6508]'}`}
              aria-label="Toggle theme"
              id="theme-toggle-mobile"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 transition-colors ${isDark ? 'text-neutral-400 hover:text-[#d4a017]' : 'text-neutral-600 hover:text-[#8b6508]'}`}
              aria-label="Toggle menu"
              id="mobile-menu-toggle"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className={`md:hidden backdrop-blur-xl border-t ${
            isDark ? 'bg-[#0d0b09]/98 border-[#b8860b]/15' : 'bg-[#faf8f5]/98 border-[#b8860b]/15'
          }`}>
            <div className="px-6 py-5 flex flex-col gap-1.5">
              {/* Quick Search in Mobile Drawer */}
              <button
                onClick={() => {
                  setIsOpen(false)
                  setSearchModalOpen(true)
                }}
                className={`w-full py-2.5 px-4 mb-2 border text-xs flex items-center justify-between ${
                  isDark
                    ? 'border-[#b8860b]/25 bg-[#14110d] text-neutral-300'
                    : 'border-[#b8860b]/30 bg-white text-neutral-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Search size={14} className="text-[#d4a017]" />
                  <span>Smart Search Garments...</span>
                </div>
                <span className="text-[10px] text-[#b8860b] uppercase font-semibold">Instant</span>
              </button>

              {navLinks.map((link) => {
                const active = isLinkActive(link.path)
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-3 text-sm font-medium tracking-wide transition-all border-l-2 ${
                      active
                        ? isDark
                          ? 'border-[#b8860b] bg-[#b8860b]/10 text-[#d4a017] pl-6'
                          : 'border-[#b8860b] bg-[#b8860b]/10 text-[#8b6508] pl-6'
                        : isDark
                        ? 'border-transparent text-neutral-400 hover:text-[#d4a017] hover:bg-[#b8860b]/5 hover:pl-6'
                        : 'border-transparent text-neutral-600 hover:text-[#8b6508] hover:bg-[#b8860b]/5 hover:pl-6'
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              })}

              {user ? (
                <div className="flex items-center justify-between px-4 py-3 bg-[#b8860b]/10 border border-[#b8860b]/30 text-xs my-2">
                  <span className={`font-medium flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
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

              <Link
                to="/products"
                onClick={() => setIsOpen(false)}
                className="btn-primary mt-1 flex items-center justify-center gap-2 py-3"
                id="mobile-nav-cta"
              >
                <ShoppingBag size={15} />
                <span>Shop All Products</span>
              </Link>
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

      {/* Global Smart Search Modal */}
      <SmartSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </>
  )
}
