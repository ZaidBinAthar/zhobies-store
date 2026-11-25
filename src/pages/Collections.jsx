import { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ArrowRight, Sparkles, Check, Scissors,
  Star, MessageCircle, ChevronRight, Filter
} from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { useCompany } from '../hooks/useCompany'
import PageHeader from '../components/PageHeader'

const WHATSAPP_NUMBER = '923247201988'

const collectionsData = [
  {
    id: 'formal',
    category: 'Formal',
    title: 'The Diplomat Formal Suite',
    subtitle: 'Tailored 2 & 3-Piece Formal Suits & Blazers',
    description: 'Expertly structured for business executives, formal galas, and corporate leaders. Crafted with fine Italian and Australian wool blends, structured shoulder pads, and natural horn buttons.',
    image: '/collection-formal.jpg',
    badge: 'Flagship Edition',
    stylesCount: '15+ Styles',
    startingPrice: 'PKR 8,500',
    highlights: [
      'Half & Full floating horsehair canvas interior',
      'Hand-stitched pick lapels and functional sleeve cuffs',
      'Breathable Bemberg cupro silk interior lining',
      'Custom sizing with chest, shoulder, and waist tailoring',
    ],
    fabricSummary: 'Super 120s Merino Wool & Cashmere Blends',
  },
  {
    id: 'traditional',
    category: 'Traditional',
    title: 'The Sultan Heritage Collection',
    subtitle: 'Hand-Embroidered Shalwar Kameez & Festal Kurtas',
    description: 'A tribute to centuries of artisanal South Asian craftsmanship. Features delicate resham needlework, ban collar embellishments, and pure Egyptian cotton-silk blends that drape with regal grace.',
    image: '/collection-traditional.jpg',
    badge: 'Artisanal Heritage',
    stylesCount: '18+ Styles',
    startingPrice: 'PKR 5,800',
    highlights: [
      'Hand-needle threadwork along ban collar and placket',
      'Reinforced seams for long-lasting wear and crease retention',
      'Comfort-fit cuffs with concealed mother-of-pearl buttons',
      'Pre-shrunk, mercerized Egyptian cotton & Karandi silks',
    ],
    fabricSummary: 'Pure Cotton, Silk Blends, Karandi & Raw Silk',
  },
  {
    id: 'casual',
    category: 'Casual',
    title: 'The Vanguard Streetwear & Loungewear',
    subtitle: 'Heavyweight Fleece Hoodies, Sweatshirts & Sets',
    description: 'Tailored casual luxury for modern off-duty styling. Engineered from 380 GSM brushed interior cotton fleece with a refined relaxed silhouette and minimal branding.',
    image: '/collection-casual.jpg',
    badge: 'New Season',
    stylesCount: '22+ Styles',
    startingPrice: 'PKR 3,200',
    highlights: [
      '380 GSM heavyweight French terry and brushed cotton',
      'Double-lined hood with custom engraved metallic eyelets',
      'Anti-pilling treatment and durable double-ribbed hems',
      'Ergonomic tailoring for contemporary streetwear fit',
    ],
    fabricSummary: '100% Combed Cotton Fleece & Terry Fabric',
  },
  {
    id: 'bespoke',
    category: 'Bespoke',
    title: 'The Royal Sovereign Bespoke Studio',
    subtitle: 'Custom Groom Sherwanis, Prince Coats & Tuxedos',
    description: 'One-of-a-kind wedding and milestone occasion tailoring. From hand-embossed zardozi work to custom woven jacquards, every garment is handcrafted exclusively for you.',
    image: '/hero-fashion.jpg',
    badge: 'Bespoke Atelier',
    stylesCount: 'Custom Commission',
    startingPrice: 'Custom Quote',
    highlights: [
      'Private 1-on-1 measurement & fabric selection session',
      'Bespoke pattern drafting unique to your exact posture',
      'Zardozi, tilla, and dabka embroidery options',
      'Includes matching pocket square, inner waistcoat, & footwear consultation',
    ],
    fabricSummary: 'Italian Jacquards, Jamawar, Raw Silk & Velvet',
  },
]

export default function Collections() {
  const { theme } = useTheme()
  const { company } = useCompany()
  const [searchParams, setSearchParams] = useSearchParams()
  const isDark = theme === 'dark'

  const activeCategory = searchParams.get('category') || 'All'

  const categories = ['All', 'Formal', 'Traditional', 'Casual', 'Bespoke']

  const filteredCollections = useMemo(() => {
    if (activeCategory === 'All') return collectionsData
    return collectionsData.filter(
      (c) => c.category.toLowerCase() === activeCategory.toLowerCase()
    )
  }, [activeCategory])

  return (
    <div className="min-h-screen">
      {/* ── Page Header ── */}
      <PageHeader
        badge="Couture Portfolios"
        title="Curated Fashion"
        highlight="Collections"
        description="Explore our bespoke portfolios spanning formal executive tailoring, heritage festal attire, and contemporary casual luxury."
        breadcrumbs={[{ name: 'Collections' }]}
      />

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* ── Category Filter Tabs ── */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-16">
          {categories.map((cat) => {
            const isSelected = activeCategory.toLowerCase() === cat.toLowerCase()
            return (
              <button
                key={cat}
                onClick={() => {
                  if (cat === 'All') {
                    searchParams.delete('category')
                    setSearchParams(searchParams)
                  } else {
                    setSearchParams({ category: cat })
                  }
                }}
                className={`px-6 py-2.5 text-xs uppercase tracking-[0.2em] font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#b8860b] text-white shadow-lg shadow-[#b8860b]/20 border border-[#b8860b]'
                    : isDark
                    ? 'glass border border-[#b8860b]/20 text-neutral-400 hover:text-[#d4a017] hover:border-[#b8860b]/40'
                    : 'bg-white border border-[#b8860b]/25 text-neutral-700 hover:text-[#b8860b] hover:border-[#b8860b] shadow-xs'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {/* ── Collections Display Grid ── */}
        <div className="space-y-16">
          {filteredCollections.map((col, index) => {
            const isReversed = index % 2 === 1

            return (
              <div
                key={col.id}
                className={`border transition-all duration-500 overflow-hidden ${
                  isDark
                    ? 'border-[#b8860b]/20 bg-[#120f0c] shadow-2xl shadow-black/60'
                    : 'border-[#b8860b]/20 bg-white shadow-xl shadow-neutral-200/60'
                }`}
              >
                <div className={`grid lg:grid-cols-12 gap-0 ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
                  {/* Visual Left/Right Column */}
                  <div className={`lg:col-span-5 relative min-h-[380px] lg:min-h-[500px] overflow-hidden ${
                    isReversed ? 'lg:order-2' : 'lg:order-1'
                  }`}>
                    <img
                      src={col.image}
                      alt={col.title}
                      className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent lg:hidden" />
                    <div className="absolute top-5 left-5">
                      <span className="px-3.5 py-1 bg-[#b8860b] text-white text-[10px] uppercase font-bold tracking-widest shadow-md">
                        {col.badge}
                      </span>
                    </div>
                    <div className="absolute bottom-5 left-5 right-5 text-white lg:hidden">
                      <span className="text-[#d4a017] text-xs font-mono">{col.stylesCount}</span>
                      <h3 className="font-serif text-2xl font-bold">{col.title}</h3>
                    </div>
                  </div>

                  {/* Narrative Details Column */}
                  <div className={`lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between ${
                    isReversed ? 'lg:order-1' : 'lg:order-2'
                  }`}>
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                        <span className="text-[#b8860b] text-xs uppercase tracking-[0.25em] font-semibold">
                          {col.category} Portfolio
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-neutral-500 text-xs">Starting from:</span>
                          <span className="text-[#d4a017] font-semibold text-sm">{col.startingPrice}</span>
                        </div>
                      </div>

                      <h3 className={`font-serif text-2xl sm:text-4xl font-bold tracking-tight mb-2 ${
                        isDark ? 'text-white' : 'text-neutral-900'
                      }`}>
                        {col.title}
                      </h3>
                      <p className="text-[#d4a017] text-xs font-medium tracking-wide mb-5">
                        {col.subtitle} · <span className="font-mono">{col.stylesCount}</span>
                      </p>

                      <p className={`text-sm leading-relaxed mb-6 ${
                        isDark ? 'text-neutral-300' : 'text-neutral-600'
                      }`}>
                        {col.description}
                      </p>

                      {/* Fabric Material Highlight */}
                      <div className={`p-4 border mb-6 ${
                        isDark ? 'border-[#b8860b]/15 bg-[#171410]' : 'border-[#b8860b]/20 bg-[#faf8f5]'
                      }`}>
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#b8860b] uppercase tracking-wider mb-1">
                          <Scissors size={14} /> Material Specification:
                        </div>
                        <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                          {col.fabricSummary}
                        </p>
                      </div>

                      {/* Tailoring Checklist */}
                      <div className="grid sm:grid-cols-2 gap-3 mb-8">
                        {col.highlights.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2.5">
                            <Check size={14} className="text-[#d4a017] shrink-0 mt-0.5" />
                            <span className={`text-xs ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div className={`pt-6 border-t ${isDark ? 'border-[#b8860b]/15' : 'border-[#b8860b]/20'} flex flex-wrap items-center gap-4`}>
                      <Link
                        to={`/products?category=${col.category}`}
                        className="px-6 py-3 bg-[#b8860b] hover:bg-[#d4a017] text-white text-xs uppercase tracking-widest font-semibold transition-all shadow-md shadow-[#b8860b]/20 inline-flex items-center gap-2"
                      >
                        <span>Shop {col.category} Products</span>
                        <ArrowRight size={14} />
                      </Link>

                      <a
                        href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi!%20I%20am%20interested%20in%20custom%20stitching%20from%20the%20${encodeURIComponent(col.title)}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`px-6 py-3 border text-xs uppercase tracking-widest font-semibold transition-all inline-flex items-center gap-2 ${
                          isDark
                            ? 'border-[#b8860b]/30 text-[#d4a017] hover:bg-[#b8860b]/10'
                            : 'border-[#b8860b]/40 text-[#b8860b] hover:bg-[#b8860b]/10 bg-white'
                        }`}
                      >
                        <MessageCircle size={14} />
                        <span>Book Custom Tailoring</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Custom Commission Callout ── */}
        <div className={`mt-20 p-8 sm:p-12 border text-center ${
          isDark ? 'border-[#b8860b]/20 bg-[#120f0c]' : 'border-[#b8860b]/25 bg-[#faf8f5]'
        }`}>
          <div className="max-w-2xl mx-auto">
            <span className="text-[#b8860b] text-xs uppercase tracking-[0.3em] font-semibold">
              Bespoke Made-to-Measure
            </span>
            <h3 className={`font-serif text-3xl font-bold mt-2 mb-4 ${
              isDark ? 'text-white' : 'text-neutral-900'
            }`}>
              Have a Specific Design in Mind?
            </h3>
            <p className={`text-sm leading-relaxed mb-6 ${
              isDark ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
              Share your reference photos, measurements, or bespoke fabric desires with our master cutters. We craft unique suits, wedding sherwanis, and tailored shirts tailored exclusively to you.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/contact"
                className="px-8 py-3.5 bg-[#b8860b] hover:bg-[#d4a017] text-white text-xs uppercase tracking-widest font-semibold transition-all shadow-lg shadow-[#b8860b]/20 inline-flex items-center gap-2"
              >
                <span>Request Custom Consultation</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
