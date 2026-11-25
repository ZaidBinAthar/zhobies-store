import { useState, useEffect, useMemo, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Search,
  SlidersHorizontal,
  Star,
  Eye,
  ArrowRight,
  Check,
  X,
  Sparkles,
  MessageCircle,
  Package,
  Scissors,
  ShieldCheck,
  RefreshCw,
  Filter,
  Maximize2,
  ZoomIn,
  History,
  TrendingUp,
  MessageSquare
} from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { useCompany } from '../hooks/useCompany'
import { fetchProducts, getLocalProducts } from '../utils/productsStore'
import { getReviewsSummary } from '../utils/reviewsStore'
import PageHeader from '../components/PageHeader'
import ImageZoomViewer from '../components/ImageZoomViewer'
import ProductReviews from '../components/ProductReviews'

const WHATSAPP_NUMBER = '923247201988'

const quickChips = [
  { label: 'All Garments', category: 'All' },
  { label: 'Formal Suits', category: 'Formal' },
  { label: 'Royal Kurtas', category: 'Traditional' },
  { label: 'Casual Fleece', category: 'Casual' },
  { label: 'Under PKR 6,000', query: 'under 6000' },
  { label: 'Bestsellers', badge: 'Bestseller' },
]

export default function Products() {
  const { theme } = useTheme()
  const { company } = useCompany()
  const [searchParams, setSearchParams] = useSearchParams()
  const isDark = theme === 'dark'

  const [products, setProducts] = useState(() => getLocalProducts())
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get('search') || '')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [sortBy, setSortBy] = useState('featured') // 'featured', 'price-asc', 'price-desc', 'rating'
  const [inStockOnly, setInStockOnly] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [activeModalTab, setActiveModalTab] = useState('details') // 'details' | 'reviews'
  const [selectedSize, setSelectedSize] = useState('L')
  const [selectedColor, setSelectedColor] = useState(null)

  const activeCategory = searchParams.get('category') || 'All'
  const searchContainerRef = useRef(null)

  // Listen to searchParams updates from external routes (e.g. /products?search=...)
  useEffect(() => {
    const urlSearch = searchParams.get('search')
    if (urlSearch !== null) {
      setSearchTerm(urlSearch)
    }
  }, [searchParams])

  useEffect(() => {
    setLoading(true)
    fetchProducts()
      .then((data) => {
        if (data && data.length > 0) setProducts(data)
      })
      .finally(() => setLoading(false))

    const onUpdate = () => setProducts(getLocalProducts())
    window.addEventListener('products_updated', onUpdate)
    window.addEventListener('reviews_updated', onUpdate)
    return () => {
      window.removeEventListener('products_updated', onUpdate)
      window.removeEventListener('reviews_updated', onUpdate)
    }
  }, [])

  // Close search suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const categories = ['All', 'Formal', 'Casual', 'Traditional']

  const parsePrice = (priceStr) => {
    if (!priceStr) return 0
    const num = String(priceStr).replace(/[^0-9]/g, '')
    return Number(num) || 0
  }

  // Filtered & Sorted products with Smart Search matching
  const displayProducts = useMemo(() => {
    let result = [...products]

    // Category filter
    if (activeCategory !== 'All') {
      result = result.filter(
        (p) => p.category?.toLowerCase() === activeCategory.toLowerCase()
      )
    }

    // Smart Search matching
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim()

      // Detect "under XXXX" price threshold
      const priceMatch = q.match(/under\s*([0-9,]+)/i)
      const maxPrice = priceMatch ? Number(priceMatch[1].replace(/,/g, '')) : null

      if (maxPrice !== null) {
        result = result.filter((p) => parsePrice(p.price) <= maxPrice)
      } else {
        result = result.filter(
          (p) =>
            p.name?.toLowerCase().includes(q) ||
            p.category?.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q) ||
            p.badge?.toLowerCase().includes(q) ||
            p.price?.toLowerCase().includes(q)
        )
      }
    }

    // In Stock filter
    if (inStockOnly) {
      result = result.filter((p) => p.inStock !== false)
    }

    // Sort
    if (sortBy === 'price-asc') {
      result.sort((a, b) => parsePrice(a.price) - parsePrice(b.price))
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => parsePrice(b.price) - parsePrice(a.price))
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 5) - (a.rating || 5))
    }

    return result
  }, [products, activeCategory, searchTerm, inStockOnly, sortBy])

  // Live Autocomplete Suggestions for Search Input
  const autocompleteSuggestions = useMemo(() => {
    if (!searchTerm.trim()) return []
    const q = searchTerm.toLowerCase().trim()
    return products
      .filter((p) => p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q))
      .slice(0, 4)
  }, [searchTerm, products])

  const openQuickView = (product, initialTab = 'details') => {
    setSelectedProduct(product)
    setActiveModalTab(initialTab)
    setSelectedSize('L')
    setSelectedColor(
      Array.isArray(product.colors) && product.colors.length > 0 ? product.colors[0] : null
    )
  }

  const hasActiveFilters =
    activeCategory !== 'All' || searchTerm.trim() !== '' || inStockOnly || sortBy !== 'featured'

  const clearAllFilters = () => {
    searchParams.delete('category')
    searchParams.delete('search')
    setSearchParams(searchParams)
    setSearchTerm('')
    setInStockOnly(false)
    setSortBy('featured')
  }

  const handleChipClick = (chip) => {
    if (chip.category) {
      if (chip.category === 'All') {
        searchParams.delete('category')
        setSearchParams(searchParams)
      } else {
        setSearchParams({ category: chip.category })
      }
      setSearchTerm('')
    } else if (chip.query) {
      setSearchTerm(chip.query)
    } else if (chip.badge) {
      setSearchTerm(chip.badge)
    }
  }

  return (
    <div className="min-h-screen">
      {/* ── Page Header ── */}
      <PageHeader
        badge="Atelier Catalog"
        title="Bespoke &"
        highlight="Ready-to-Wear"
        description="Discover master-tailored formal suits, festive embroidered kurtas, and luxury loungewear with HD fabric zoom and verified client reviews."
        breadcrumbs={[{ name: 'Products Catalog' }]}
      />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* ── Smart Search & Filter Control Bar ── */}
        <div
          className={`p-6 border mb-8 transition-colors ${
            isDark ? 'border-[#b8860b]/20 bg-[#120f0c]' : 'border-[#b8860b]/20 bg-white shadow-sm'
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Smart Search Input with Live Autocomplete Dropdown */}
            <div ref={searchContainerRef} className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-3.5 text-[#b8860b]" />
              <input
                type="text"
                value={searchTerm}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Smart Search by garment, fabric, or 'under 6000'..."
                className={`w-full pl-10 pr-10 py-2.5 text-xs transition-all border focus:outline-none ${
                  isDark
                    ? 'bg-[#171410] border-[#b8860b]/20 focus:border-[#d4a017] text-white placeholder-neutral-500'
                    : 'bg-[#faf8f5] border-[#b8860b]/30 focus:border-[#b8860b] text-neutral-900 placeholder-neutral-400'
                }`}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-3 text-neutral-400 hover:text-white"
                >
                  <X size={14} />
                </button>
              )}

              {/* Autocomplete Predictions Dropdown */}
              {isSearchFocused && autocompleteSuggestions.length > 0 && (
                <div
                  className={`absolute left-0 right-0 top-full mt-1 border shadow-2xl z-40 overflow-hidden ${
                    isDark ? 'bg-[#0f0d0a] border-[#b8860b]/30 text-white' : 'bg-white border-neutral-300'
                  }`}
                >
                  <div className="p-2 border-b border-[#b8860b]/15 text-[10px] uppercase tracking-wider text-[#b8860b] font-semibold flex items-center justify-between">
                    <span>Instant Matches</span>
                    <span className="text-neutral-500">Press to view</span>
                  </div>
                  {autocompleteSuggestions.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSearchTerm(item.name)
                        setIsSearchFocused(false)
                        openQuickView(item)
                      }}
                      className={`p-2.5 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                        isDark ? 'hover:bg-[#b8860b]/15' : 'hover:bg-amber-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={item.image || '/collection-formal.jpg'}
                          alt={item.name}
                          className="w-8 h-8 object-cover border border-[#b8860b]/20 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="text-xs font-serif font-bold block truncate">{item.name}</span>
                          <span className="text-[10px] text-neutral-500">{item.category}</span>
                        </div>
                      </div>
                      <span className="text-xs text-[#d4a017] font-semibold shrink-0">{item.price}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
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
                    className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#b8860b] text-white shadow-md shadow-[#b8860b]/20 border border-[#b8860b]'
                        : isDark
                        ? 'bg-[#171410] border border-[#b8860b]/15 text-neutral-400 hover:text-[#d4a017]'
                        : 'bg-[#faf8f5] border border-[#b8860b]/20 text-neutral-600 hover:text-[#b8860b]'
                    }`}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>

            {/* Sort & Availability Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-neutral-500 text-[10px]">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`px-3 py-2 text-xs border focus:outline-none cursor-pointer ${
                    isDark
                      ? 'bg-[#171410] border-[#b8860b]/20 text-white'
                      : 'bg-[#faf8f5] border-[#b8860b]/30 text-neutral-900'
                  }`}
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Customer Rating</option>
                </select>
              </div>

              {/* In-Stock Toggle */}
              <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="accent-[#b8860b] w-3.5 h-3.5 cursor-pointer"
                />
                <span className={isDark ? 'text-neutral-400' : 'text-neutral-600'}>In Stock Only</span>
              </label>
            </div>
          </div>

          {/* Quick Smart Chips Row */}
          <div className="mt-4 pt-3.5 border-t border-[#b8860b]/15 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] uppercase font-semibold text-[#b8860b] tracking-wider shrink-0">
              Quick Filter:
            </span>
            {quickChips.map((chip) => (
              <button
                key={chip.label}
                onClick={() => handleChipClick(chip)}
                className={`px-3 py-1 text-[11px] border transition-colors shrink-0 cursor-pointer ${
                  (chip.category && activeCategory.toLowerCase() === chip.category.toLowerCase() && !searchTerm) ||
                  (chip.query && searchTerm.toLowerCase() === chip.query.toLowerCase())
                    ? 'border-[#b8860b] bg-[#b8860b]/20 text-[#d4a017] font-semibold'
                    : isDark
                    ? 'border-[#b8860b]/15 bg-[#171410] text-neutral-400 hover:border-[#b8860b]'
                    : 'border-neutral-300 bg-neutral-50 text-neutral-700 hover:border-[#b8860b]'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Active Filters Pill Row */}
          {hasActiveFilters && (
            <div className="mt-3 pt-3 border-t border-[#b8860b]/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-neutral-500 text-[11px]">Applied filters:</span>
                {activeCategory !== 'All' && (
                  <span className="px-2.5 py-0.5 bg-[#b8860b]/20 text-[#d4a017] border border-[#b8860b]/40 text-[11px]">
                    Category: {activeCategory}
                  </span>
                )}
                {searchTerm && (
                  <span className="px-2.5 py-0.5 bg-[#b8860b]/20 text-[#d4a017] border border-[#b8860b]/40 text-[11px]">
                    "{searchTerm}"
                  </span>
                )}
                {inStockOnly && (
                  <span className="px-2.5 py-0.5 bg-green-500/20 text-green-400 border border-green-500/40 text-[11px]">
                    In Stock Only
                  </span>
                )}
              </div>
              <button
                onClick={clearAllFilters}
                className="text-neutral-400 hover:text-[#d4a017] underline cursor-pointer text-xs"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>

        {/* ── Status Bar ── */}
        <div className="flex items-center justify-between mb-8 text-xs text-neutral-500">
          <div>
            Displaying <strong className={isDark ? 'text-white' : 'text-neutral-900'}>{displayProducts.length}</strong> master garments in catalog
          </div>
          <Link
            to="/contact"
            className="text-[#d4a017] hover:underline flex items-center gap-1 font-medium"
          >
            <span>Need Custom Stitching / Specific Measurements?</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        {/* ── Products Grid ── */}
        {displayProducts.length === 0 ? (
          <div
            className={`p-16 border text-center ${
              isDark ? 'border-[#b8860b]/20 bg-[#120f0c]' : 'border-[#b8860b]/20 bg-white'
            }`}
          >
            <Package size={48} className="mx-auto text-neutral-500 mb-4" />
            <h3 className={`font-serif text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              No garments found
            </h3>
            <p className={`text-xs max-w-sm mx-auto mb-6 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              We couldn't find any products matching "{searchTerm}". Try clearing your query or explore our standard categories.
            </p>
            <button
              onClick={clearAllFilters}
              className="px-6 py-2.5 bg-[#b8860b] hover:bg-[#d4a017] text-white text-xs uppercase tracking-wider font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProducts.map((p) => {
              const revSummary = getReviewsSummary(p.id)
              return (
                <div
                  key={p.id}
                  className={`group border transition-all duration-300 flex flex-col justify-between ${
                    isDark
                      ? 'border-[#b8860b]/20 bg-[#120f0c] hover:border-[#b8860b]/60 shadow-xl'
                      : 'border-[#b8860b]/20 bg-white hover:border-[#b8860b]/60 shadow-md'
                  }`}
                >
                  <div>
                    {/* Image Container with Zoom & Badges */}
                    <div className="relative h-72 overflow-hidden bg-neutral-950">
                      <img
                        src={p.image || '/collection-formal.jpg'}
                        alt={p.name}
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = '/collection-formal.jpg'
                        }}
                      />

                      <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                        {p.badge && (
                          <span className="px-3 py-0.5 text-[9px] uppercase tracking-wider font-bold bg-[#b8860b] text-white shadow-md">
                            {p.badge}
                          </span>
                        )}
                        <span
                          className={`px-2.5 py-0.5 text-[9px] uppercase tracking-wider font-semibold border ${
                            p.inStock !== false
                              ? 'bg-green-950/80 text-green-300 border-green-700/60'
                              : 'bg-red-950/80 text-red-300 border-red-700/60'
                          }`}
                        >
                          {p.inStock !== false ? 'In Stock' : 'Made to Order'}
                        </span>
                      </div>

                      <div className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/80 backdrop-blur-sm text-[10px] text-[#d4a017] border border-[#b8860b]/30 z-10">
                        {p.category}
                      </div>

                      {/* Quick Hover Overlay: Quick View + Fabric Zoom Hint */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 text-white text-xs uppercase tracking-wider font-semibold backdrop-blur-[2px]">
                        <button
                          onClick={() => openQuickView(p, 'details')}
                          className="px-4 py-2 bg-[#b8860b] hover:bg-[#d4a017] text-white flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer shadow-lg"
                        >
                          <Eye size={15} /> Quick View Details
                        </button>
                        <button
                          onClick={() => openQuickView(p, 'details')}
                          className="text-[11px] text-[#d4a017] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <ZoomIn size={13} /> Interactive Fabric Zoom
                        </button>
                      </div>
                    </div>

                    {/* Body Info */}
                    <div className="p-6">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-[#b8860b] text-[10px] uppercase font-mono font-medium">
                          ID: #{p.id}
                        </span>
                        {/* Rating with click-to-reviews trigger */}
                        <button
                          onClick={() => openQuickView(p, 'reviews')}
                          className="flex items-center gap-1 text-[#d4a017] hover:underline cursor-pointer"
                          title="View customer reviews"
                        >
                          <Star size={12} className="fill-[#d4a017]" />
                          <span className="text-xs font-semibold">{revSummary.average || p.rating || 5}.0</span>
                          <span className="text-neutral-500 text-[10px]">({revSummary.total || p.reviews || 30})</span>
                        </button>
                      </div>

                      <h3
                        onClick={() => openQuickView(p, 'details')}
                        className={`font-serif font-bold text-lg line-clamp-1 group-hover:text-[#d4a017] transition-colors cursor-pointer ${
                          isDark ? 'text-white' : 'text-neutral-900'
                        }`}
                      >
                        {p.name}
                      </h3>

                      <div className="text-[#d4a017] font-semibold text-lg mt-1.5 font-mono">
                        {p.price}
                      </div>

                      {/* Color Swatches */}
                      {Array.isArray(p.colors) && p.colors.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-3">
                          <span className="text-[10px] text-neutral-500 uppercase mr-1">Shades:</span>
                          {p.colors.map((c, i) => (
                            <div
                              key={i}
                              className="w-3.5 h-3.5 rounded-full border border-white/30"
                              style={{ backgroundColor: c }}
                              title={c}
                            />
                          ))}
                        </div>
                      )}

                      <p
                        className={`text-xs mt-3 line-clamp-2 leading-relaxed ${
                          isDark ? 'text-neutral-400' : 'text-neutral-600'
                        }`}
                      >
                        {p.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div
                    className={`p-6 pt-0 border-t ${
                      isDark ? 'border-[#b8860b]/10' : 'border-[#b8860b]/15'
                    } mt-3 flex items-center gap-3`}
                  >
                    <button
                      onClick={() => openQuickView(p, 'details')}
                      className="flex-1 py-2.5 text-xs border border-[#b8860b]/30 text-[#d4a017] hover:bg-[#b8860b]/10 transition-colors uppercase font-semibold tracking-wider cursor-pointer"
                    >
                      Quick View
                    </button>
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi!%20I%20want%20to%20order%20the%20${encodeURIComponent(
                        p.name
                      )}%20(${encodeURIComponent(p.price)}).`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 text-xs bg-[#b8860b] hover:bg-[#d4a017] text-white transition-colors uppercase font-semibold tracking-wider text-center shadow-sm"
                    >
                      WhatsApp Order
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Interactive Product Quick View & Zoom Modal ── */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
          <div
            className={`relative w-full max-w-3xl border border-[#b8860b]/30 shadow-2xl max-h-[92vh] overflow-y-auto ${
              isDark ? 'bg-[#0f0d0a] text-white' : 'bg-white text-neutral-900'
            }`}
          >
            {/* Modal Header Bar with Tab Toggles */}
            <div className="sticky top-0 z-30 flex items-center justify-between border-b border-[#b8860b]/20 px-6 py-4 bg-inherit backdrop-blur-md">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActiveModalTab('details')}
                  className={`text-xs uppercase tracking-wider font-semibold pb-1 border-b-2 transition-all cursor-pointer ${
                    activeModalTab === 'details'
                      ? 'border-[#b8860b] text-[#d4a017]'
                      : 'border-transparent text-neutral-400 hover:text-white'
                  }`}
                >
                  Garment & Zoom Details
                </button>
                <button
                  onClick={() => setActiveModalTab('reviews')}
                  className={`text-xs uppercase tracking-wider font-semibold pb-1 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeModalTab === 'reviews'
                      ? 'border-[#b8860b] text-[#d4a017]'
                      : 'border-transparent text-neutral-400 hover:text-white'
                  }`}
                >
                  <MessageSquare size={13} />
                  <span>Customer Reviews</span>
                  <span className="px-1.5 py-0.2 bg-[#b8860b]/20 text-[#d4a017] rounded text-[10px]">
                    {getReviewsSummary(selectedProduct.id).total}
                  </span>
                </button>
              </div>

              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800/40 rounded cursor-pointer"
                aria-label="Close Modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              {activeModalTab === 'details' ? (
                /* Tab 1: Product Specs with ImageZoomViewer */
                <div className="grid sm:grid-cols-2 gap-8 items-start">
                  {/* Left Column: Interactive ImageZoomViewer */}
                  <div>
                    <ImageZoomViewer
                      src={selectedProduct.image || '/collection-formal.jpg'}
                      alt={selectedProduct.name}
                      badge={selectedProduct.badge}
                      className="h-80 sm:h-96 border border-[#b8860b]/30 shadow-md"
                    />
                    <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-500">
                      <span>Garment Code: <strong>#{selectedProduct.id}</strong></span>
                      <span className="text-[#d4a017] flex items-center gap-1">
                        <Sparkles size={11} /> 100% Canvas Inspected
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Garment Meta & WhatsApp Checkout */}
                  <div className="space-y-4">
                    <div>
                      <span className="text-[#b8860b] text-[10px] uppercase tracking-widest font-bold">
                        {selectedProduct.category} Collection
                      </span>
                      <h3 className="font-serif text-2xl sm:text-3xl font-bold mt-1">
                        {selectedProduct.name}
                      </h3>
                      <div className="text-2xl font-serif font-bold text-[#d4a017] mt-2 font-mono">
                        {selectedProduct.price}
                      </div>
                    </div>

                    {/* Rating Banner with Clickable Reviews Switch */}
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1 text-[#d4a017]">
                        <Star size={14} className="fill-[#d4a017]" />
                        <span className="font-bold">{getReviewsSummary(selectedProduct.id).average || 5}.0</span>
                      </div>
                      <button
                        onClick={() => setActiveModalTab('reviews')}
                        className="text-neutral-400 hover:text-[#d4a017] hover:underline cursor-pointer"
                      >
                        Read all {getReviewsSummary(selectedProduct.id).total} bespoke reviews &rarr;
                      </button>
                    </div>

                    {/* Description */}
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
                      {selectedProduct.description}
                    </p>

                    {/* Size Selector */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-neutral-400 uppercase text-[10px] tracking-wider font-semibold">
                          Select Size:
                        </span>
                        <Link to="/about" className="text-[#d4a017] text-[10px] hover:underline">
                          View Size Guide
                        </Link>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {['S', 'M', 'L', 'XL', 'XXL', 'Custom'].map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`w-11 h-9 text-xs font-semibold transition-all cursor-pointer border ${
                              selectedSize === size
                                ? 'bg-[#b8860b] text-white border-[#b8860b]'
                                : isDark
                                ? 'bg-[#171410] border-[#b8860b]/20 text-neutral-400 hover:text-white'
                                : 'bg-neutral-100 border-neutral-300 text-neutral-800 hover:border-[#b8860b]'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Color Selector */}
                    {Array.isArray(selectedProduct.colors) && selectedProduct.colors.length > 0 && (
                      <div>
                        <span className="block text-neutral-400 uppercase text-[10px] tracking-wider font-semibold mb-1.5">
                          Available Fabric Colorways:
                        </span>
                        <div className="flex items-center gap-2">
                          {selectedProduct.colors.map((color, i) => (
                            <button
                              key={i}
                              onClick={() => setSelectedColor(color)}
                              className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${
                                selectedColor === color
                                  ? 'border-[#d4a017] scale-110 shadow-md'
                                  : 'border-white/40 opacity-70 hover:opacity-100'
                              }`}
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="pt-3 space-y-2.5">
                      <a
                        href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi!%20I%20would%20like%20to%20order%20${encodeURIComponent(
                          selectedProduct.name
                        )}%20(Size:%20${selectedSize}${
                          selectedColor ? `,%20Color:%20${selectedColor}` : ''
                        },%20${selectedProduct.price}).`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3.5 bg-gradient-to-r from-[#b8860b] to-[#d4a017] text-[#0d0b09] text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#b8860b]/20 hover:brightness-110"
                      >
                        <MessageCircle size={16} />
                        <span>Confirm Order on WhatsApp (Size {selectedSize})</span>
                      </a>

                      <Link
                        to="/contact"
                        className={`w-full py-2.5 text-xs border text-center uppercase tracking-wider font-semibold transition-all block ${
                          isDark
                            ? 'border-[#b8860b]/30 text-[#d4a017] hover:bg-[#b8860b]/10'
                            : 'border-[#b8860b]/40 text-[#b8860b] hover:bg-[#b8860b]/10 bg-white'
                        }`}
                      >
                        Book Custom Measurement Appointment
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                /* Tab 2: Customer Reviews & Write Review Form */
                <ProductReviews
                  productId={selectedProduct.id}
                  productName={selectedProduct.name}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
