import { Link } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import { Home, ShoppingBag, ArrowLeft, Compass } from 'lucide-react'

export default function NotFound() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className={`min-h-[75vh] flex items-center justify-center px-6 py-24 ${isDark ? 'bg-[#0d0b09] text-white' : 'bg-[#faf8f5] text-neutral-900'}`}>
      <div className="max-w-xl mx-auto text-center">
        {/* Subtle decorative crest */}
        <div className="w-16 h-16 mx-auto mb-6 border border-[#b8860b]/40 flex items-center justify-center text-[#d4a017] bg-[#b8860b]/10">
          <Compass size={28} />
        </div>

        <div className="inline-block px-3 py-1 mb-4 text-[11px] font-medium uppercase tracking-[0.25em] text-[#b8860b] border border-[#b8860b]/30 bg-[#b8860b]/5">
          Error 404
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
          Page Not Found
        </h1>

        <div className="gold-divider mx-auto mb-6" />

        <p className={`text-sm sm:text-base leading-relaxed mb-8 max-w-md mx-auto ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
          The wardrobe collection or page you are seeking does not exist or may have been relocated.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/home"
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#b8860b] to-[#d4a017] text-[#0d0b09] font-semibold text-xs tracking-widest uppercase hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#b8860b]/20"
          >
            <Home size={14} />
            <span>Return Home</span>
          </Link>
          <Link
            to="/products"
            className={`w-full sm:w-auto px-6 py-3 border border-[#b8860b]/40 hover:border-[#d4a017] text-xs font-semibold tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${
              isDark ? 'text-neutral-300 hover:text-white' : 'text-neutral-700 hover:text-black'
            }`}
          >
            <ShoppingBag size={14} className="text-[#d4a017]" />
            <span>Browse Products</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
