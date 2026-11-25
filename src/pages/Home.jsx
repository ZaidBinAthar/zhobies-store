import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Star, Shield, Award, Sparkles,
  Scissors, Truck, HeartHandshake, CheckCircle2, ChevronRight, Eye
} from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { useCompany } from '../hooks/useCompany'
import { fetchProducts, getLocalProducts } from '../utils/productsStore'
import Hero from '../components/Hero'
import Workflow from '../components/Workflow'
import WhyWorkWithMe from '../components/WhyWorkWithMe'
import Technologies from '../components/Technologies'

const WHATSAPP_NUMBER = '923247201988'

const featuredCollections = [
  {
    id: 'formal',
    title: 'Formal Couture',
    subtitle: 'Two & Three-Piece Bespoke Suits',
    description: 'Impeccable wool-cashmere blend tailoring, precision canvas interior, and hand-stitched lapels crafted for business and formal galas.',
    image: '/collection-formal.jpg',
    badge: 'Flagship Edition',
    styles: '15+ Bespoke Cuts',
    link: '/collections?category=Formal',
  },
  {
    id: 'traditional',
    title: 'Royal Heritage',
    subtitle: 'Festive & Wedding Kurta Sets',
    description: 'Intricately embroidered Pakistani shalwar kameez and festive kurtas featuring hand needlework on silk-cotton and raw silk fabrics.',
    image: '/collection-traditional.jpg',
    badge: 'Festive Exclusive',
    styles: '18+ Handcrafted Styles',
    link: '/collections?category=Traditional',
  },
  {
    id: 'casual',
    title: 'Urban Comfort',
    subtitle: 'Premium Fleece & Streetwear',
    description: 'Modern luxury loungewear, heavyweight fleece hoodies, and tapered joggers engineered for sophisticated everyday ease.',
    image: '/collection-casual.jpg',
    badge: 'New Season',
    styles: '20+ Modern Fits',
    link: '/collections?category=Casual',
  },
]

export default function Home() {
  const { theme } = useTheme()
  const { company } = useCompany()
  const isDark = theme === 'dark'
  const [products, setProducts] = useState(() => getLocalProducts())
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    fetchProducts().then((data) => {
      if (data && data.length > 0) setProducts(data)
    })
    const onUpdate = () => setProducts(getLocalProducts())
    window.addEventListener('products_updated', onUpdate)
    return () => window.removeEventListener('products_updated', onUpdate)
  }, [])

  const companyName = company?.name || 'Zhobie\'s Store'

  return (
    <div className="overflow-hidden">
      {/* ── 1. Hero Section ── */}
      <Hero />

      {/* ── 2. Trust Marquee / Highlights Bar ── */}
      <div className={`py-6 border-y ${
        isDark ? 'border-[#b8860b]/20 bg-[#0a0806]' : 'border-[#b8860b]/20 bg-[#f7f3ec]'
      }`}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 border border-[#b8860b]/30 flex items-center justify-center text-[#d4a017] shrink-0">
              <Scissors size={18} />
            </div>
            <div className="text-left">
              <div className={`text-xs font-serif font-bold tracking-wide ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Master Tailoring
              </div>
              <div className="text-[11px] text-neutral-500">Hand-finished bespoke fit</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 border border-[#b8860b]/30 flex items-center justify-center text-[#d4a017] shrink-0">
              <Award size={18} />
            </div>
            <div className="text-left">
              <div className={`text-xs font-serif font-bold tracking-wide ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Pure Fabrics
              </div>
              <div className="text-[11px] text-neutral-500">Wool, silk & Egyptian cotton</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 border border-[#b8860b]/30 flex items-center justify-center text-[#d4a017] shrink-0">
              <Truck size={18} />
            </div>
            <div className="text-left">
              <div className={`text-xs font-serif font-bold tracking-wide ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Nationwide Delivery
              </div>
              <div className="text-[11px] text-neutral-500">Fast insured delivery</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 border border-[#b8860b]/30 flex items-center justify-center text-[#d4a017] shrink-0">
              <Shield size={18} />
            </div>
            <div className="text-left">
              <div className={`text-xs font-serif font-bold tracking-wide ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Fitting Guarantee
              </div>
              <div className="text-[11px] text-neutral-500">Free fitting adjustments</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Curated Collections Preview ── */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px w-10 bg-[#b8860b]" />
                <span className="text-[#b8860b] text-xs tracking-[0.3em] uppercase font-semibold">
                  Curated Collections
                </span>
              </div>
              <h2 className={`font-serif text-3xl sm:text-5xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Signature <span className="gradient-text">Lookbooks</span>
              </h2>
            </div>
            <Link
              to="/collections"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#d4a017] hover:text-[#b8860b] transition-colors group"
            >
              <span>Explore All Collections</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredCollections.map((col) => (
              <div
                key={col.id}
                className={`group relative overflow-hidden border transition-all duration-500 flex flex-col justify-between ${
                  isDark
                    ? 'border-[#b8860b]/20 bg-[#120f0c] hover:border-[#b8860b]/50 shadow-2xl shadow-black/60'
                    : 'border-[#b8860b]/20 bg-white hover:border-[#b8860b]/60 shadow-xl shadow-neutral-200/50'
                }`}
              >
                <div>
                  <div className="relative h-[380px] overflow-hidden">
                    <img
                      src={col.image}
                      alt={col.title}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-[#b8860b] text-white text-[10px] uppercase font-bold tracking-widest shadow-md">
                        {col.badge}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="text-[#d4a017] text-xs font-mono font-medium">{col.styles}</span>
                      <h3 className="font-serif text-2xl font-bold tracking-wide mt-0.5">{col.title}</h3>
                      <p className="text-neutral-300 text-xs mt-1">{col.subtitle}</p>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                      {col.description}
                    </p>
                  </div>
                </div>

                <div className={`p-6 pt-0 border-t ${isDark ? 'border-[#b8860b]/10' : 'border-[#b8860b]/15'} mt-4 flex items-center justify-between`}>
                  <Link
                    to={col.link}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#d4a017] hover:text-[#b8860b] transition-colors"
                  >
                    <span>View Pieces</span>
                    <ChevronRight size={14} />
                  </Link>

                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi!%20I%20am%20interested%20in%20custom%20stitching%20for%20the%20${encodeURIComponent(col.title)}%20collection.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-neutral-500 hover:text-green-500 transition-colors flex items-center gap-1"
                  >
                    <span>Inquire Style</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Featured Bestsellers Spotlight ── */}
      <section className={`py-24 border-y ${
        isDark ? 'border-[#b8860b]/15 bg-[#0f0d0a]' : 'border-[#b8860b]/15 bg-[#f5f0e8]/50'
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-10 bg-[#b8860b]" />
              <span className="text-[#b8860b] text-xs tracking-[0.3em] uppercase font-semibold">
                Client Favorites
              </span>
              <div className="h-px w-10 bg-[#b8860b]" />
            </div>
            <h2 className={`font-serif text-3xl sm:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Featured <span className="gradient-text">Bestsellers</span>
            </h2>
            <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Hand-cut and precision-tailored garments ready to be styled for your defining moments.
            </p>
            <div className="gold-divider mt-6 mx-auto" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.slice(0, 3).map((product) => (
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
                      onError={(e) => { e.currentTarget.src = '/collection-formal.jpg' }}
                    />
                    {product.badge && (
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 text-[9px] uppercase tracking-wider font-bold bg-[#b8860b] text-white">
                        {product.badge}
                      </span>
                    )}
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs uppercase tracking-wider font-semibold cursor-pointer"
                    >
                      <Eye size={16} /> Quick View
                    </button>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[#b8860b] uppercase tracking-wider font-medium text-[10px]">
                        {product.category}
                      </span>
                      <div className="flex items-center gap-1 text-[#d4a017]">
                        <Star size={12} className="fill-[#d4a017]" />
                        <span className="text-xs font-semibold">{product.rating || 5}.0</span>
                        <span className="text-neutral-500 text-[10px]">({product.reviews || 24})</span>
                      </div>
                    </div>

                    <h3 className={`font-serif font-bold text-lg line-clamp-1 group-hover:text-[#d4a017] transition-colors ${
                      isDark ? 'text-white' : 'text-neutral-900'
                    }`}>
                      {product.name}
                    </h3>

                    <div className="text-[#d4a017] font-semibold text-base mt-2">
                      {product.price}
                    </div>

                    <p className={`text-xs mt-2 line-clamp-2 leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                      {product.description}
                    </p>
                  </div>
                </div>

                <div className={`p-5 pt-0 border-t ${isDark ? 'border-[#b8860b]/10' : 'border-[#b8860b]/15'} mt-3 flex items-center gap-2`}>
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="flex-1 py-2 text-xs border border-[#b8860b]/30 text-[#d4a017] hover:bg-[#b8860b]/10 transition-colors uppercase font-semibold tracking-wider cursor-pointer"
                  >
                    Details
                  </button>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi!%20I%20would%20like%20to%20order%20the%20${encodeURIComponent(product.name)}%20(${encodeURIComponent(product.price)}).`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 text-xs bg-[#b8860b] hover:bg-[#d4a017] text-white transition-colors uppercase font-semibold tracking-wider text-center"
                  >
                    WhatsApp Order
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link
              to="/products"
              className="inline-flex items-center gap-3 px-8 py-3.5 bg-[#b8860b] hover:bg-[#d4a017] text-white text-xs uppercase tracking-widest font-semibold transition-all shadow-lg shadow-[#b8860b]/20"
            >
              <span>Explore Complete Product Catalog</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. Process & Craftsmanship ── */}
      <Workflow />

      {/* ── 6. Value Proposition ── */}
      <WhyWorkWithMe />

      {/* ── 7. Fabric Materials Range ── */}
      <Technologies />

      {/* ── 8. VIP Bespoke Consultation CTA Banner ── */}
      <section className={`py-20 relative border-t ${
        isDark ? 'border-[#b8860b]/20 bg-[#080604]' : 'border-[#b8860b]/20 bg-[#f3ece0]'
      }`}>
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <div className="w-14 h-14 mx-auto border border-[#b8860b]/50 flex items-center justify-center text-[#d4a017] mb-6 font-serif font-bold text-2xl">
            Z
          </div>
          <h2 className={`font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4 ${
            isDark ? 'text-white' : 'text-neutral-900'
          }`}>
            Ready to Commission Your <span className="gradient-text">Bespoke Attire?</span>
          </h2>
          <p className={`max-w-xl mx-auto text-sm sm:text-base leading-relaxed mb-8 ${
            isDark ? 'text-neutral-400' : 'text-neutral-600'
          }`}>
            Experience personalized measurements, exquisite fabric selection, and bespoke tailoring designed to reflect your individuality.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="px-8 py-3.5 bg-[#b8860b] hover:bg-[#d4a017] text-white text-xs uppercase tracking-widest font-semibold transition-all shadow-lg shadow-[#b8860b]/20 inline-flex items-center gap-2"
            >
              <span>Book Tailoring Consultation</span>
              <ArrowRight size={16} />
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20${encodeURIComponent(companyName)}!%20I%20want%20to%20discuss%20a%20custom%20suit%20order.`}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-8 py-3.5 border transition-all text-xs uppercase tracking-widest font-semibold inline-flex items-center gap-2 ${
                isDark
                  ? 'border-[#b8860b]/40 text-[#d4a017] hover:bg-[#b8860b]/10'
                  : 'border-[#b8860b]/50 text-[#b8860b] hover:bg-[#b8860b]/10 bg-white'
              }`}
            >
              <span>Direct WhatsApp Chat</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── Quick View Modal ── */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className={`relative w-full max-w-xl border border-[#b8860b]/30 p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto ${
            isDark ? 'bg-[#0e0c0a] text-white' : 'bg-white text-neutral-900'
          }`}>
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1"
            >
              ✕
            </button>
            <div className="grid sm:grid-cols-2 gap-6 items-center">
              <div className="relative h-64 overflow-hidden rounded border border-[#b8860b]/30">
                <img
                  src={selectedProduct.image || '/collection-formal.jpg'}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-[#b8860b] text-[10px] uppercase tracking-widest font-bold">
                  {selectedProduct.category}
                </span>
                <h3 className="font-serif text-2xl font-bold mt-1">{selectedProduct.name}</h3>
                <div className="text-xl font-semibold text-[#d4a017] mt-2">{selectedProduct.price}</div>
                <p className={`text-xs mt-3 leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  {selectedProduct.description}
                </p>
                <div className="mt-4 flex flex-col gap-2">
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi!%20I%20am%20interested%20in%20ordering%20${encodeURIComponent(selectedProduct.name)}%20(${encodeURIComponent(selectedProduct.price)}).`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-[#b8860b] hover:bg-[#d4a017] text-white text-xs uppercase tracking-wider font-semibold text-center transition-all"
                  >
                    Confirm Order via WhatsApp
                  </a>
                  <Link
                    to="/contact"
                    className="w-full py-2 text-xs border border-[#b8860b]/30 text-[#d4a017] hover:bg-[#b8860b]/10 text-center uppercase tracking-wider font-semibold transition-all"
                  >
                    Request Custom Measurements
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
