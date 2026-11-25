import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Scissors,
  Award,
  Truck,
  Shield,
  Star,
  Sparkles,
  ChevronRight,
  ShoppingBag,
  MessageCircle
} from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { useCompany } from '../hooks/useCompany'
import { fetchProducts, getLocalProducts } from '../utils/productsStore'
import Hero from '../components/Hero'

const WHATSAPP_NUMBER = '923247201988'

const curatedCategories = [
  {
    id: 'formal',
    category: 'Formal',
    title: 'Formal Couture',
    subtitle: 'Bespoke Suits & Tuxedos',
    description: 'Precision Italian wool blends with floating canvas interiors, hand-finished pick lapels, and tailored executive cuts.',
    image: '/collection-formal.jpg',
    badge: 'Flagship Edition',
    path: '/collections?category=Formal',
  },
  {
    id: 'traditional',
    category: 'Traditional',
    title: 'Royal Heritage',
    subtitle: 'Kurta & Shalwar Kameez',
    description: 'Festive raw silk and Egyptian cotton garments featuring artisanal hand needlework, mandarin collars, and royal drapes.',
    image: '/collection-traditional.jpg',
    badge: 'Festive Classic',
    path: '/collections?category=Traditional',
  },
  {
    id: 'casual',
    category: 'Casual',
    title: 'Modern Luxury',
    subtitle: 'Contemporary Streetwear',
    description: 'Heavyweight fleece hoodies, structured luxury loungewear, and tapered joggers engineered for everyday distinction.',
    image: '/collection-casual.jpg',
    badge: 'New Season',
    path: '/collections?category=Casual',
  },
]

export default function Home() {
  const { theme } = useTheme()
  const { company } = useCompany()
  const isDark = theme === 'dark'
  const [featuredProducts, setFeaturedProducts] = useState(() => getLocalProducts().slice(0, 3))

  useEffect(() => {
    fetchProducts().then((data) => {
      if (data && data.length > 0) {
        setFeaturedProducts(data.slice(0, 3))
      }
    })
    const onUpdate = () => {
      setFeaturedProducts(getLocalProducts().slice(0, 3))
    }
    window.addEventListener('products_updated', onUpdate)
    return () => window.removeEventListener('products_updated', onUpdate)
  }, [])

  const companyName = company?.name || 'Zhobie’s Store'

  return (
    <div className="overflow-hidden">
      {/* ── 1. Hero Grand Entryway ── */}
      <Hero />

      {/* ── 2. Minimalist Trust Strip ── */}
      <section
        className={`py-6 border-y transition-colors duration-300 ${
          isDark
            ? 'border-[#b8860b]/15 bg-[#0a0806]'
            : 'border-[#b8860b]/20 bg-[#f7f3ec]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 border border-[#b8860b]/30 flex items-center justify-center text-[#d4a017] shrink-0 bg-[#b8860b]/5">
              <Scissors size={18} />
            </div>
            <div className="text-left">
              <div className={`text-xs font-serif font-bold tracking-wide ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Bespoke Craft
              </div>
              <div className="text-[11px] text-neutral-500">Hand-finished custom fit</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 border border-[#b8860b]/30 flex items-center justify-center text-[#d4a017] shrink-0 bg-[#b8860b]/5">
              <Award size={18} />
            </div>
            <div className="text-left">
              <div className={`text-xs font-serif font-bold tracking-wide ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Pure Textiles
              </div>
              <div className="text-[11px] text-neutral-500">Wool, silk & Giza cotton</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 border border-[#b8860b]/30 flex items-center justify-center text-[#d4a017] shrink-0 bg-[#b8860b]/5">
              <Truck size={18} />
            </div>
            <div className="text-left">
              <div className={`text-xs font-serif font-bold tracking-wide ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Doorstep Delivery
              </div>
              <div className="text-[11px] text-neutral-500">Nationwide & Worldwide</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 border border-[#b8860b]/30 flex items-center justify-center text-[#d4a017] shrink-0 bg-[#b8860b]/5">
              <Shield size={18} />
            </div>
            <div className="text-left">
              <div className={`text-xs font-serif font-bold tracking-wide ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Fit Insurance
              </div>
              <div className="text-[11px] text-neutral-500">Free 14-day adjustments</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Curated Collections Preview ── */}
      <section className="py-20 md:py-28 relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <div className="flex items-center gap-3 mb-2.5">
                <div className="h-px w-10 bg-[#b8860b]" />
                <span className="text-[#b8860b] text-xs tracking-[0.3em] uppercase font-semibold">
                  Curated Portfolios
                </span>
              </div>
              <h2 className={`font-serif text-3xl sm:text-4xl lg:text-5xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Signature <span className="gradient-text">Collections</span>
              </h2>
            </div>
            <Link
              to="/collections"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#d4a017] hover:text-[#b8860b] transition-colors group"
            >
              <span>Explore All Lookbooks</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {curatedCategories.map((col) => (
              <div
                key={col.id}
                className={`group relative overflow-hidden border transition-all duration-500 flex flex-col justify-between ${
                  isDark
                    ? 'border-[#b8860b]/20 bg-[#120f0c] hover:border-[#b8860b]/50 shadow-2xl shadow-black/60'
                    : 'border-[#b8860b]/20 bg-white hover:border-[#b8860b]/60 shadow-xl shadow-neutral-200/50'
                }`}
              >
                <div>
                  <div className="relative h-[340px] sm:h-[380px] overflow-hidden">
                    <img
                      src={col.image}
                      alt={col.title}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-[#b8860b] text-white text-[10px] uppercase font-bold tracking-widest shadow-md">
                        {col.badge}
                      </span>
                    </div>
                    <div className="absolute bottom-5 left-5 right-5 text-white">
                      <span className="text-[#d4a017] text-[11px] font-mono font-medium uppercase tracking-wider">{col.subtitle}</span>
                      <h3 className="font-serif text-2xl font-bold tracking-wide mt-0.5">{col.title}</h3>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                      {col.description}
                    </p>
                  </div>
                </div>

                <div className={`p-6 pt-0 border-t ${isDark ? 'border-[#b8860b]/10' : 'border-[#b8860b]/15'} mt-2 flex items-center justify-between`}>
                  <Link
                    to={col.path}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#d4a017] hover:text-[#b8860b] transition-colors"
                  >
                    <span>View Category</span>
                    <ChevronRight size={14} />
                  </Link>

                  <Link
                    to="/contact"
                    className="text-[11px] text-neutral-500 hover:text-[#d4a017] transition-colors"
                  >
                    Custom Fit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Curated Bestsellers Showcase ── */}
      <section
        className={`py-20 md:py-24 border-y transition-colors duration-300 ${
          isDark
            ? 'border-[#b8860b]/15 bg-[#0f0c09]'
            : 'border-[#b8860b]/15 bg-[#fbf8f2]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <div className="flex items-center gap-3 mb-2.5">
                <div className="h-px w-10 bg-[#b8860b]" />
                <span className="text-[#b8860b] text-xs tracking-[0.3em] uppercase font-semibold">
                  Client Favorites
                </span>
              </div>
              <h2 className={`font-serif text-3xl sm:text-4xl lg:text-5xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Featured <span className="gradient-text">Bestsellers</span>
              </h2>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#d4a017] hover:text-[#b8860b] transition-colors group"
            >
              <span>View Full Catalog</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className={`group border transition-all duration-300 flex flex-col justify-between ${
                  isDark
                    ? 'border-[#b8860b]/20 bg-[#14110d] hover:border-[#b8860b]/50 shadow-xl'
                    : 'border-[#b8860b]/20 bg-white hover:border-[#b8860b]/50 shadow-md'
                }`}
              >
                <div>
                  <div className="relative h-64 overflow-hidden bg-neutral-900">
                    <img
                      src={product.image || '/collection-formal.jpg'}
                      alt={product.name}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = '/collection-formal.jpg'
                      }}
                    />
                    {product.badge && (
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 text-[9px] uppercase tracking-wider font-bold bg-[#b8860b] text-white">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-[#b8860b] uppercase tracking-wider font-medium text-[10px]">
                        {product.category}
                      </span>
                      <div className="flex items-center gap-1 text-[#d4a017]">
                        <Star size={12} className="fill-[#d4a017]" />
                        <span className="text-xs font-semibold">{product.rating || 5}.0</span>
                      </div>
                    </div>

                    <h3 className={`font-serif font-bold text-lg line-clamp-1 group-hover:text-[#d4a017] transition-colors ${
                      isDark ? 'text-white' : 'text-neutral-900'
                    }`}>
                      {product.name}
                    </h3>

                    <div className="text-[#d4a017] font-semibold text-base mt-2 font-mono">
                      {product.price}
                    </div>

                    <p className={`text-xs mt-2 line-clamp-2 leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                      {product.description}
                    </p>
                  </div>
                </div>

                <div className={`p-6 pt-0 border-t ${isDark ? 'border-[#b8860b]/10' : 'border-[#b8860b]/15'} mt-3 flex items-center gap-3`}>
                  <Link
                    to="/products"
                    className="flex-1 py-2.5 text-xs border border-[#b8860b]/30 text-[#d4a017] hover:bg-[#b8860b]/10 transition-colors uppercase font-semibold tracking-wider text-center"
                  >
                    View Details
                  </Link>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi!%20I%20would%20like%20to%20order%20the%20${encodeURIComponent(product.name)}%20(${encodeURIComponent(product.price)}).`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 text-xs bg-[#b8860b] hover:bg-[#d4a017] text-white transition-colors uppercase font-semibold tracking-wider text-center"
                  >
                    Order Fast
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/products"
              className="inline-flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-[#b8860b] to-[#d4a017] text-[#0d0b09] text-xs uppercase tracking-widest font-semibold transition-all hover:brightness-110 shadow-lg shadow-[#b8860b]/20"
            >
              <ShoppingBag size={15} />
              <span>Browse All Ready-to-Wear Products</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. Clean Atelier Heritage Spotlight ── */}
      <section className="py-20 md:py-28 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Visual Column */}
            <div className="lg:col-span-5 relative">
              <div className="relative border border-[#b8860b]/30 p-2 bg-[#b8860b]/5">
                <img
                  src="/collection-formal.jpg"
                  alt="Zhobie Atelier Craftsmanship"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute -bottom-5 -right-5 bg-[#0d0b09] text-white p-5 border border-[#b8860b]/40 shadow-2xl hidden sm:block">
                  <div className="text-2xl font-serif font-bold text-[#d4a017]">30+</div>
                  <div className="text-[10px] uppercase tracking-wider text-neutral-400">Years of Master Tailoring</div>
                </div>
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px w-10 bg-[#b8860b]" />
                <span className="text-[#b8860b] text-xs tracking-[0.3em] uppercase font-semibold">
                  The Sartorial Difference
                </span>
              </div>
              <h2 className={`font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Crafted for Connoisseurs, <span className="gradient-text">Tailored for You</span>
              </h2>
              <p className={`text-sm sm:text-base leading-relaxed mb-6 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                At {companyName}, tailoring is not just an industry — it is an inherited fine art. We combine timeless British Savile Row structuring with Pakistan’s deep heritage of artisanal hand needlework.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className={`p-4 border ${isDark ? 'border-[#b8860b]/15 bg-[#120f0c]' : 'border-[#b8860b]/20 bg-white'}`}>
                  <h4 className={`font-serif font-bold text-sm mb-1 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                    Floating Horsehair Canvas
                  </h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Naturally shapes to your posture over time, delivering structured elegance without stiffness.
                  </p>
                </div>
                <div className={`p-4 border ${isDark ? 'border-[#b8860b]/15 bg-[#120f0c]' : 'border-[#b8860b]/20 bg-white'}`}>
                  <h4 className={`font-serif font-bold text-sm mb-1 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                    Digital Sizing Vault
                  </h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Your unique measurements are securely archived for instant reorders anytime.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Link
                  to="/about"
                  className="btn-secondary !px-7 !py-3.5 text-xs uppercase tracking-widest font-semibold flex items-center gap-2"
                >
                  <span>Read Brand Story & Size Guide</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Clean VIP Consultation CTA ── */}
      <section
        className={`py-16 md:py-20 relative border-t transition-colors duration-300 ${
          isDark
            ? 'border-[#b8860b]/15 bg-[#090705]'
            : 'border-[#b8860b]/20 bg-[#f4eee4]'
        }`}
      >
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="w-12 h-12 mx-auto border border-[#b8860b]/50 flex items-center justify-center text-[#d4a017] mb-5 font-serif font-bold text-xl bg-[#b8860b]/10">
            Z
          </div>
          <h2 className={`font-serif text-3xl sm:text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Commission Your <span className="gradient-text">Bespoke Attire</span>
          </h2>
          <p className={`max-w-lg mx-auto text-xs sm:text-sm leading-relaxed mb-8 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            Have an upcoming wedding, corporate gala, or desire a custom-tailored piece? Connect with our master cutter today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/contact"
              className="px-8 py-3.5 bg-gradient-to-r from-[#b8860b] to-[#d4a017] text-[#0d0b09] text-xs uppercase tracking-widest font-semibold transition-all hover:brightness-110 shadow-lg shadow-[#b8860b]/20 inline-flex items-center gap-2"
            >
              <span>Book Tailoring Consultation</span>
              <ArrowRight size={15} />
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20${encodeURIComponent(companyName)}!%20I%20would%20like%20to%20discuss%20a%20bespoke%20order.`}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-8 py-3.5 border transition-all text-xs uppercase tracking-widest font-semibold inline-flex items-center gap-2 ${
                isDark
                  ? 'border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/10'
                  : 'border-[#25D366]/50 text-[#25D366] hover:bg-[#25D366]/10 bg-white'
              }`}
            >
              <MessageCircle size={15} />
              <span>WhatsApp Direct</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
