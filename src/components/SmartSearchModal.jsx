import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  X,
  History,
  TrendingUp,
  ArrowRight,
  Star,
  Sparkles,
  Command,
  Package,
  Check
} from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { getLocalProducts } from '../utils/productsStore'

const RECENT_SEARCHES_KEY = 'zhobies_recent_searches_v1'

const quickSuggestions = [
  'Formal Suit',
  'Royal Kurta',
  'Hoodie Set',
  'Wool Blend',
  'Bestsellers',
  'Under PKR 6,000'
]

export default function SmartSearchModal({ isOpen, onClose, onSelectProduct }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const navigate = useNavigate()

  const [query, setQuery] = useState('')
  const [products, setProducts] = useState(() => getLocalProducts())
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY)
      return saved ? JSON.parse(saved) : ['Executive Navy Suit', 'Kurta', 'Fleece']
    } catch {
      return ['Executive Navy Suit', 'Kurta', 'Fleece']
    }
  })

  const inputRef = useRef(null)

  // Reload products when modal opens
  useEffect(() => {
    if (isOpen) {
      setProducts(getLocalProducts())
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Save query to recent searches
  const saveRecentSearch = (term) => {
    const trimmed = term.trim()
    if (!trimmed) return
    const updated = [trimmed, ...recentSearches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, 6)
    setRecentSearches(updated)
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
    } catch (e) {
      console.warn(e)
    }
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem(RECENT_SEARCHES_KEY)
  }

  // Parse price string to number
  const parsePrice = (priceStr) => {
    if (!priceStr) return 0
    return Number(String(priceStr).replace(/[^0-9]/g, '')) || 0
  }

  // Smart Matching Algorithm
  const searchResults = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return []

    // Detect price filter intent like "under 5000" or "under 6000"
    const priceMatch = q.match(/under\s*([0-9,]+)/i)
    const maxPrice = priceMatch ? Number(priceMatch[1].replace(/,/g, '')) : null

    return products.filter((p) => {
      // If user typed "under XXXX", filter by price
      if (maxPrice !== null) {
        return parsePrice(p.price) <= maxPrice
      }

      // Keyword & fuzzy matching
      const nameMatch = p.name?.toLowerCase().includes(q)
      const catMatch = p.category?.toLowerCase().includes(q)
      const descMatch = p.description?.toLowerCase().includes(q)
      const badgeMatch = p.badge?.toLowerCase().includes(q)
      const priceTextMatch = p.price?.toLowerCase().includes(q)

      return nameMatch || catMatch || descMatch || badgeMatch || priceTextMatch
    })
  }, [query, products])

  // Keyboard navigation (Arrow Up, Arrow Down, Enter, Esc)
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, searchResults.length))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + searchResults.length) % Math.max(1, searchResults.length))
      } else if (e.key === 'Enter') {
        if (searchResults.length > 0 && searchResults[selectedIndex]) {
          handleSelect(searchResults[selectedIndex])
        } else if (query.trim()) {
          saveRecentSearch(query)
          navigate(`/products?search=${encodeURIComponent(query)}`)
          onClose()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, searchResults, selectedIndex, query])

  const handleSelect = (product) => {
    saveRecentSearch(product.name)
    if (onSelectProduct) {
      onSelectProduct(product)
      onClose()
    } else {
      navigate(`/products?search=${encodeURIComponent(product.name)}`)
      onClose()
    }
  }

  const handleQuickChipClick = (term) => {
    setQuery(term)
    saveRecentSearch(term)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[150] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className={`relative w-full max-w-2xl border shadow-2xl overflow-hidden animate-scale-up ${
          isDark
            ? 'bg-[#0f0d0a] border-[#b8860b]/30 text-white'
            : 'bg-white border-[#b8860b]/30 text-neutral-900'
        }`}
      >
        {/* ── Search Input Header ── */}
        <div className="relative border-b border-[#b8860b]/20 p-4 sm:p-5 flex items-center gap-3">
          <Search size={20} className="text-[#d4a017] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            placeholder="Search bespoke suits, kurtas, fabrics, or 'under 5000'..."
            className={`w-full bg-transparent text-sm sm:text-base focus:outline-none placeholder-neutral-500 ${
              isDark ? 'text-white' : 'text-neutral-900'
            }`}
          />
          {query && (
            <button
              onClick={() => {
                setQuery('')
                setSelectedIndex(0)
              }}
              className="text-neutral-400 hover:text-white p-1"
            >
              <X size={16} />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white border border-neutral-700/60 rounded text-xs px-2"
          >
            ESC
          </button>
        </div>

        {/* ── Quick Suggestions Bar ── */}
        <div className={`px-4 sm:px-5 py-2.5 border-b flex items-center gap-2 overflow-x-auto no-scrollbar text-xs ${
          isDark ? 'bg-[#14110d] border-[#b8860b]/10' : 'bg-neutral-50 border-neutral-200'
        }`}>
          <span className="text-[10px] uppercase tracking-wider text-[#b8860b] font-medium shrink-0 flex items-center gap-1">
            <TrendingUp size={11} /> Trending:
          </span>
          {quickSuggestions.map((s) => (
            <button
              key={s}
              onClick={() => handleQuickChipClick(s)}
              className={`px-2.5 py-0.5 text-[11px] rounded-full border transition-colors shrink-0 cursor-pointer ${
                query.toLowerCase() === s.toLowerCase()
                  ? 'bg-[#b8860b] text-white border-[#b8860b]'
                  : isDark
                  ? 'bg-[#1c1813] border-[#b8860b]/20 text-neutral-300 hover:border-[#d4a017]'
                  : 'bg-white border-neutral-300 text-neutral-700 hover:border-[#b8860b]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* ── Results Container ── */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-5">
          {query.trim() === '' ? (
            /* Empty Query: Show Recent Searches & Tips */
            <div className="space-y-6">
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between text-xs text-neutral-400 mb-2.5">
                    <span className="uppercase tracking-wider text-[10px] font-semibold flex items-center gap-1 text-[#b8860b]">
                      <History size={12} /> Recent Searches
                    </span>
                    <button
                      onClick={clearRecentSearches}
                      className="text-[10px] hover:text-[#d4a017] underline cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleQuickChipClick(term)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs border transition-colors cursor-pointer ${
                          isDark
                            ? 'bg-[#14110d] border-[#b8860b]/15 text-neutral-300 hover:border-[#d4a017]'
                            : 'bg-neutral-100 border-neutral-300 text-neutral-700 hover:border-[#b8860b]'
                        }`}
                      >
                        <History size={11} className="text-[#b8860b]" />
                        <span>{term}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Collections Preview */}
              <div>
                <span className="block text-[10px] uppercase tracking-wider font-semibold text-[#b8860b] mb-2.5">
                  Popular Atelier Garments
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {products.slice(0, 4).map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleSelect(p)}
                      className={`p-2.5 border flex items-center gap-3 cursor-pointer transition-all ${
                        isDark
                          ? 'border-[#b8860b]/15 bg-[#120f0c] hover:border-[#b8860b]/40 hover:bg-[#b8860b]/5'
                          : 'border-neutral-200 bg-neutral-50 hover:border-[#b8860b]/40 hover:bg-neutral-100'
                      }`}
                    >
                      <img
                        src={p.image || '/collection-formal.jpg'}
                        alt={p.name}
                        className="w-11 h-11 object-cover border border-[#b8860b]/20 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="font-serif text-xs font-semibold truncate">{p.name}</h5>
                        <div className="text-[11px] text-[#d4a017] font-mono mt-0.5">{p.price}</div>
                      </div>
                      <ArrowRight size={13} className="text-neutral-500 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            /* No Results Found */
            <div className="py-12 text-center">
              <Package size={36} className="mx-auto text-neutral-500 mb-3" />
              <h4 className="font-serif text-lg font-bold">No garments matched "{query}"</h4>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto mt-1 mb-4">
                Try searching by broader category (e.g. "Formal", "Casual") or check price filters.
              </p>
              <button
                onClick={() => setQuery('')}
                className="px-4 py-2 bg-[#b8860b] text-white text-xs uppercase tracking-wider font-semibold"
              >
                Clear Search
              </button>
            </div>
          ) : (
            /* Search Results List */
            <div className="space-y-2">
              <div className="text-[11px] text-neutral-400 mb-2 flex items-center justify-between">
                <span>Found {searchResults.length} matching items</span>
                <span className="text-[10px] text-neutral-500 hidden sm:inline">Use ↑ ↓ to navigate, Enter to select</span>
              </div>

              {searchResults.map((product, idx) => {
                const isSelected = idx === selectedIndex
                return (
                  <div
                    key={product.id}
                    onClick={() => handleSelect(product)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`p-3 border flex items-center justify-between gap-4 cursor-pointer transition-all ${
                      isSelected
                        ? isDark
                          ? 'border-[#d4a017] bg-[#b8860b]/15 shadow-md'
                          : 'border-[#b8860b] bg-amber-50/70 shadow-sm'
                        : isDark
                        ? 'border-[#b8860b]/15 bg-[#120f0c] hover:border-[#b8860b]/40'
                        : 'border-neutral-200 bg-white hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-14 h-14 bg-neutral-950 border border-[#b8860b]/30 overflow-hidden shrink-0">
                        <img
                          src={product.image || '/collection-formal.jpg'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] uppercase font-semibold text-[#b8860b] tracking-wider">
                            {product.category}
                          </span>
                          {product.badge && (
                            <span className="px-1.5 py-0.2 bg-[#b8860b]/20 text-[#d4a017] text-[9px] uppercase font-bold border border-[#b8860b]/30">
                              {product.badge}
                            </span>
                          )}
                          <div className="flex items-center gap-0.5 text-[#d4a017] text-[10px]">
                            <Star size={10} className="fill-[#d4a017]" />
                            <span>{product.rating || 5}.0</span>
                          </div>
                        </div>

                        <h4 className="font-serif font-bold text-sm truncate">{product.name}</h4>
                        <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                          {product.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-serif font-bold text-sm text-[#d4a017]">
                        {product.price}
                      </div>
                      <span className="text-[10px] text-emerald-400 block mt-0.5">
                        {product.inStock !== false ? 'In Stock' : 'Made to Order'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className={`p-3 px-5 border-t flex items-center justify-between text-[11px] text-neutral-500 ${
          isDark ? 'border-[#b8860b]/15 bg-[#0a0806]' : 'border-neutral-200 bg-neutral-100'
        }`}>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 font-mono text-[10px]">
              <kbd className="px-1 border border-neutral-700 bg-neutral-800 text-neutral-300">Enter</kbd> to view
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 font-mono text-[10px]">
              <kbd className="px-1 border border-neutral-700 bg-neutral-800 text-neutral-300">Esc</kbd> to exit
            </span>
          </div>
          <button
            onClick={() => {
              saveRecentSearch(query)
              navigate(`/products${query ? `?search=${encodeURIComponent(query)}` : ''}`)
              onClose()
            }}
            className="text-[#d4a017] hover:underline font-semibold flex items-center gap-1"
          >
            <span>See all catalog results</span>
            <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}
