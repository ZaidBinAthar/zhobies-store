import { Link } from 'react-router-dom'
import { ChevronRight, Sparkles } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

export default function PageHeader({
  badge = 'Zhobie\'s Store',
  title,
  highlight,
  description,
  breadcrumbs = [],
}) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className={`relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden border-b ${
      isDark
        ? 'border-[#b8860b]/15 bg-gradient-to-b from-[#120f0c] via-[#0d0b09] to-[#0d0b09]'
        : 'border-[#b8860b]/15 bg-gradient-to-b from-[#f5f0e8] via-[#faf8f5] to-[#faf8f5]'
    }`}>
      {/* Background Decorative Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[280px] bg-[#b8860b]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-72 h-72 bg-[#d4a017]/[0.03] rounded-full blur-[90px] pointer-events-none" />

      {/* Subtle geometric line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#b8860b]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="inline-flex items-center gap-2 mb-6 text-xs tracking-wider">
          <Link
            to="/home"
            className={`transition-colors flex items-center gap-1 ${
              isDark ? 'text-neutral-400 hover:text-[#d4a017]' : 'text-neutral-600 hover:text-[#b8860b]'
            }`}
          >
            Home
          </Link>
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1
            return (
              <span key={idx} className="inline-flex items-center gap-2">
                <ChevronRight size={12} className="text-[#b8860b]/60" />
                {isLast || !crumb.href ? (
                  <span className={`font-semibold ${isDark ? 'text-[#d4a017]' : 'text-[#b8860b]'}`}>
                    {crumb.name}
                  </span>
                ) : (
                  <Link
                    to={crumb.href}
                    className={`transition-colors ${
                      isDark ? 'text-neutral-400 hover:text-[#d4a017]' : 'text-neutral-600 hover:text-[#b8860b]'
                    }`}
                  >
                    {crumb.name}
                  </Link>
                )}
              </span>
            )
          })}
        </nav>

        {/* Section Badge */}
        <div className="flex items-center justify-center gap-4 mb-3">
          <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#b8860b]" />
          <span className="text-[#b8860b] text-[11px] sm:text-xs tracking-[0.3em] uppercase font-semibold flex items-center gap-1.5">
            <Sparkles size={12} className="text-[#d4a017]" />
            {badge}
          </span>
          <div className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#b8860b]" />
        </div>

        {/* Main Heading */}
        <h1 className={`font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 ${
          isDark ? 'text-white' : 'text-neutral-900'
        }`}>
          {title} {highlight && <span className="gradient-text">{highlight}</span>}
        </h1>

        {/* Subtitle / Description */}
        {description && (
          <p className={`max-w-2xl mx-auto text-sm sm:text-base leading-relaxed ${
            isDark ? 'text-neutral-400' : 'text-neutral-600'
          }`}>
            {description}
          </p>
        )}

        {/* Gold divider */}
        <div className="gold-divider mt-6 mx-auto" />
      </div>
    </div>
  )
}
