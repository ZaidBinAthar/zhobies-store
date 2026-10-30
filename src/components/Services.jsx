import { useState, useEffect } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import {
  Shirt, Gem, Scissors, Star,
  Package, Truck, RotateCcw, Shield
} from 'lucide-react'
import { fetchProducts, getLocalProducts } from '../utils/productsStore'

const benefits = [
  { icon: Scissors, label: 'Master Tailoring' },
  { icon: Gem, label: 'Premium Fabrics' },
  { icon: Package, label: 'Gift Packaging' },
  { icon: Shield, label: 'Quality Guarantee' },
  { icon: Truck, label: 'Fast Delivery' },
  { icon: RotateCcw, label: 'Easy Exchange' },
  { icon: Star, label: 'Top Rated Brand' },
  { icon: Shirt, label: 'Custom Stitching' },
]

export default function Services() {
  const [ref, isVisible] = useScrollReveal(0.05)
  const [products, setProducts] = useState(() => getLocalProducts())
  const [selectedCategory, setSelectedCategory] = useState('All')

  useEffect(() => {
    fetchProducts().then((data) => {
      if (data && data.length > 0) setProducts(data)
    })

    const handleUpdate = () => {
      setProducts(getLocalProducts())
    }
    window.addEventListener('products_updated', handleUpdate)
    return () => window.removeEventListener('products_updated', handleUpdate)
  }, [])

  const categories = ['All', 'Formal', 'Casual', 'Traditional']
  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase())

  return (
    <section id="products" className="py-20 md:py-28 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#b8860b]/[0.015] to-transparent" />

      <div ref={ref} className={`max-w-7xl mx-auto px-6 relative reveal ${isVisible ? 'visible' : ''}`}>

        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#b8860b]" />
            <span className="text-[#b8860b] text-xs tracking-[0.3em] uppercase font-medium">Featured Products</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#b8860b]" />
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">
            Handpicked <span className="gradient-text">Bestsellers</span>
          </h2>
          <p className="text-neutral-500 max-w-md mx-auto text-sm leading-relaxed">
            Our most loved pieces — crafted with attention to detail and worn with pride.
          </p>
          <div className="gold-divider mt-4" />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 text-xs uppercase tracking-[0.2em] font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-[#b8860b] text-white shadow-lg shadow-[#b8860b]/20 font-semibold'
                  : 'bg-[#171410] text-neutral-400 border border-[#b8860b]/20 hover:border-[#b8860b]/50 hover:text-[#d4a017]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {filteredProducts.map((product, i) => (
            <div
              key={product.id}
              className="group cursor-pointer product-card border border-[#b8860b]/10 hover:border-[#b8860b]/30"
              style={{ animationDelay: `${i * 100}ms` }}
              id={`product-${product.id}`}
            >
              {/* Image */}
              <div className="relative h-72 overflow-hidden bg-[#171410]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-img w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b09]/60 via-transparent to-transparent" />

                {/* Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 text-[9px] tracking-[0.2em] uppercase font-semibold bg-[#b8860b] text-white">
                    {product.badge}
                  </span>
                </div>

                {/* Quick order overlay */}
                <div className="absolute inset-0 bg-[#0d0b09]/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                  <a
                    href="#contact"
                    onClick={(e) => {
                      e.preventDefault()
                      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="btn-primary !py-2.5 !px-6 text-xs"
                  >
                    Order Now
                  </a>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5">
                <p className="text-[#b8860b] text-[9px] tracking-[0.3em] uppercase mb-1">{product.category}</p>
                <h3 className="font-serif text-lg font-semibold text-white mb-2 group-hover:text-[#d4a017] transition-colors">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mb-3">
                  <div className="flex">
                    {[...Array(product.rating)].map((_, i) => (
                      <Star key={i} size={11} className="text-[#d4a017] fill-[#d4a017]" />
                    ))}
                  </div>
                  <span className="text-neutral-500 text-xs">({product.reviews})</span>
                </div>

                {/* Colors */}
                <div className="flex items-center gap-2 mb-4">
                  {product.colors.map((color, ci) => (
                    <div
                      key={ci}
                      className="w-4 h-4 rounded-full border border-white/10 cursor-pointer hover:scale-125 transition-transform"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-serif text-[#d4a017] font-bold text-lg">{product.price}</span>
                  <a
                    href="#contact"
                    onClick={(e) => {
                      e.preventDefault()
                      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="btn-secondary !py-1.5 !px-4 !text-[11px]"
                  >
                    Enquire
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Strip */}
        <div className="border-t border-b border-[#b8860b]/15 py-8">
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {benefits.map((b, i) => (
              <div key={b.label} className="flex items-center gap-2.5 group cursor-default">
                <div className="w-8 h-8 border border-[#b8860b]/30 flex items-center justify-center group-hover:border-[#b8860b] group-hover:bg-[#b8860b]/10 transition-all">
                  <b.icon size={14} className="text-[#b8860b]" />
                </div>
                <span className="text-xs text-neutral-400 tracking-wide group-hover:text-[#d4a017] transition-colors">
                  {b.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
