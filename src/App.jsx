import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom'
import { ThemeProvider, useTheme } from './hooks/useTheme'
import { CompanyProvider } from './hooks/useCompany'
import ScrollToTop from './components/ScrollToTop'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import FloatingContact from './components/FloatingContact'

// Multi-Page Views
import Home from './pages/Home'
import Collections from './pages/Collections'
import Products from './pages/Products'
import About from './pages/About'
import Contact from './pages/Contact'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'

/**
 * HashRedirect supports backward compatibility for links previously using #hash
 * e.g., /#admin -> /admin, /#collections -> /collections
 */
function HashRedirect() {
  const navigate = useNavigate()

  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash.replace('#', '').trim().toLowerCase()
      if (!hash) return

      const routeMap = {
        admin: '/admin',
        collections: '/collections',
        products: '/products',
        about: '/about',
        contact: '/contact',
        home: '/home',
      }

      if (routeMap[hash]) {
        navigate(routeMap[hash], { replace: true })
      }
    }

    checkHash()
    window.addEventListener('hashchange', checkHash)
    return () => window.removeEventListener('hashchange', checkHash)
  }, [navigate])

  return null
}

/**
 * Standard Storefront Layout shared by /home, /collections, /products, /about, /contact
 */
function StoreLayout() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div
      className={`min-h-screen flex flex-col antialiased selection:bg-[#b8860b]/30 selection:text-[#d4a017] transition-colors duration-300 ${
        isDark ? 'bg-[#0d0b09] text-[#e8ddd0]' : 'bg-[#faf8f5] text-neutral-900'
      }`}
    >
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingContact />
    </div>
  )
}

/**
 * Dedicated Admin Portal Layout
 */
function AdminLayout() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div
      className={`min-h-screen antialiased transition-colors duration-300 ${
        isDark ? 'bg-[#0d0b09] text-neutral-200' : 'bg-[#faf8f5] text-neutral-800'
      }`}
    >
      <Admin />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <CompanyProvider>
        <BrowserRouter>
          <ScrollToTop />
          <HashRedirect />
          <Routes>
            {/* Storefront Layout Routes */}
            <Route element={<StoreLayout />}>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<Home />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/products" element={<Products />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Standalone Admin Portal Route */}
            <Route path="/admin" element={<AdminLayout />} />
          </Routes>
        </BrowserRouter>
      </CompanyProvider>
    </ThemeProvider>
  )
}
