import { Link } from 'react-router-dom'
import { ArrowRight, Star, ChevronDown } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

export default function Hero() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/hero-fashion.jpg"
          alt="Zhobie’s Store Collection"
          className="w-full h-full object-cover object-center"
        />
        <div className={`absolute inset-0 ${
          isDark
            ? 'bg-gradient-to-r from-[#0d0b09]/95 via-[#0d0b09]/80 to-[#0d0b09]/60'
            : 'bg-gradient-to-r from-[#faf8f5]/95 via-[#faf8f5]/80 to-[#faf8f5]/50'
        }`} />
        {/* Gold shimmer overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#b8860b]/5" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-32 right-20 w-px h-40 bg-gradient-to-b from-transparent via-[#b8860b]/40 to-transparent hidden lg:block" />
      <div className="absolute bottom-40 left-16 w-24 h-px bg-gradient-to-r from-transparent via-[#b8860b]/40 to-transparent hidden lg:block" />

      {/* Floating badges */}
      <div className="absolute top-36 right-24 hidden lg:block animate-float">
        <div className="glass rounded-none px-4 py-2.5 border-l-2 border-[#b8860b]">
          <div className="flex items-center gap-2">
            <Star size={12} className="text-[#d4a017] fill-[#d4a017]" />
            <span className={`text-xs font-medium tracking-wider uppercase ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
              Haute Couture Tailoring
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-48 right-16 hidden lg:block animate-float" style={{ animationDelay: '2s' }}>
        <div className="glass rounded-none px-4 py-2.5 border-l-2 border-[#c2956c]">
          <div className={`text-xs tracking-wider ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            <span className="text-[#d4a017] font-semibold">500+</span> Bespoke Clients
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 items-center gap-12">
        <div>
          {/* Label */}
          <div className="flex items-center gap-3 mb-6 animate-fade-in-up">
            <div className="h-px w-10 bg-[#b8860b]" />
            <span className={`text-xs tracking-[0.3em] uppercase font-medium ${isDark ? 'text-[#b8860b]' : 'text-[#8b6508]'}`}>
              Season 2026 Sartorial Curation
            </span>
          </div>

          {/* Headline */}
          <h1 className={`font-serif text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 animate-fade-in-up delay-100 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Dress With
            <br />
            <span className="shimmer-gold">Elegance &</span>
            <br />
            <span className="gradient-text">Distinction</span>
          </h1>

          {/* Subtext */}
          <p className={`text-lg leading-relaxed mb-4 max-w-lg animate-fade-in-up delay-200 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            Discover our exclusive collections of bespoke formal suits, signature Pakistani royal ethnic wear, and luxury street couture — handcrafted for discerning connoisseurs.
          </p>

          {/* Stars */}
          <div className="flex items-center gap-2 mb-8 animate-fade-in-up delay-300">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="text-[#d4a017] fill-[#d4a017]" />
              ))}
            </div>
            <span className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              5.0 Rating · 500+ satisfied clients nationwide & abroad
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 animate-fade-in-up delay-400">
            <Link
              to="/products"
              className="btn-primary !px-8 !py-4 text-xs tracking-widest uppercase flex items-center justify-center gap-2"
              id="hero-shop-btn"
            >
              <span>Explore Products</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/about"
              className="btn-secondary !px-8 !py-4 text-xs tracking-widest uppercase flex items-center justify-center gap-2"
              id="hero-about-btn"
            >
              <span>Our Heritage</span>
            </Link>
          </div>
        </div>

        {/* Right side — stats */}
        <div className="hidden lg:flex flex-col gap-4 items-end animate-fade-in delay-500">
          {[
            { value: '500+', label: 'Master Tailored Pieces' },
            { value: '30+ Yrs', label: 'Artisanal Heritage' },
            { value: '100%', label: 'Floating Horsehair Canvas' },
            { value: '24/7', label: 'Bespoke Concierge' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="glass rounded-none p-5 border-r-2 border-[#b8860b] text-right min-w-[190px] hover:bg-[#b8860b]/5 transition-all duration-300"
            >
              <div className="text-2xl font-serif font-bold text-[#d4a017]">{stat.value}</div>
              <div className={`text-xs tracking-wider mt-0.5 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <Link
        to="/collections"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center gap-1 group"
        id="hero-scroll-btn"
      >
        <span className={`text-[10px] tracking-[0.25em] uppercase transition-colors ${isDark ? 'text-neutral-500 group-hover:text-[#d4a017]' : 'text-neutral-400 group-hover:text-[#8b6508]'}`}>
          Explore Collections
        </span>
        <ChevronDown size={18} className="text-[#b8860b]" />
      </Link>
    </section>
  )
}
