import { useScrollReveal } from '../hooks/useScrollReveal'
import { ArrowRight } from 'lucide-react'

const collections = [
  {
    id: 'formal',
    title: 'Formal Elegance',
    subtitle: 'Business & Special Occasions',
    description: 'Tailored suits, blazers and dress trousers for the modern professional. Premium wool blends and impeccable stitching.',
    image: '/collection-formal.jpg',
    badge: 'Bestseller',
    items: '15+ Styles',
  },
  {
    id: 'casual',
    title: 'Casual Comfort',
    subtitle: 'Everyday Essentials',
    description: 'Relaxed hoodies, joggers and streetwear that combine comfort with contemporary style for daily wear.',
    image: '/collection-casual.jpg',
    badge: 'New Arrivals',
    items: '20+ Styles',
  },
  {
    id: 'traditional',
    title: 'Traditional Heritage',
    subtitle: 'Weddings & Festivals',
    description: 'Handcrafted shalwar kameez and embroidered kurtas that celebrate Pakistani heritage with modern sensibility.',
    image: '/collection-traditional.jpg',
    badge: 'Exclusive',
    items: '12+ Styles',
  },
]

export default function Collections() {
  const [ref, isVisible] = useScrollReveal(0.05)

  return (
    <section id="collections" className="py-20 md:py-28 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#b8860b]/[0.02] to-transparent" />

      <div ref={ref} className={`max-w-7xl mx-auto px-6 relative reveal ${isVisible ? 'visible' : ''}`}>
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#b8860b]" />
            <span className="text-[#b8860b] text-xs tracking-[0.3em] uppercase font-medium">Our Collections</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#b8860b]" />
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">
            Curated for <span className="gradient-text">Every Occasion</span>
          </h2>
          <div className="gold-divider mt-4" />
        </div>

        {/* Collections Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {collections.map((col, i) => (
            <div
              key={col.id}
              className="group relative overflow-hidden cursor-pointer product-card"
              style={{ animationDelay: `${i * 150}ms` }}
              id={`collection-${col.id}`}
            >
              {/* Image */}
              <div className="relative h-[480px] overflow-hidden">
                <img
                  src={col.image}
                  alt={col.title}
                  className="product-img w-full h-full object-cover object-top"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b09] via-[#0d0b09]/30 to-transparent" />

                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 text-[10px] tracking-[0.2em] uppercase font-semibold bg-[#b8860b] text-white">
                    {col.badge}
                  </span>
                </div>

                {/* Items count */}
                <div className="absolute top-4 right-4">
                  <span className="glass px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase text-[#d4a017]">
                    {col.items}
                  </span>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-[#b8860b] text-[10px] tracking-[0.3em] uppercase mb-1.5">
                    {col.subtitle}
                  </p>
                  <h3 className="font-serif text-2xl font-bold text-white mb-2">
                    {col.title}
                  </h3>
                  <p className="text-neutral-400 text-sm leading-relaxed mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    {col.description}
                  </p>
                  <a
                    href="#contact"
                    onClick={(e) => {
                      e.preventDefault()
                      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="inline-flex items-center gap-2 text-[#d4a017] text-sm tracking-wider uppercase font-medium group/link"
                  >
                    Shop Collection
                    <ArrowRight size={14} className="transition-transform group-hover/link:translate-x-1" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
