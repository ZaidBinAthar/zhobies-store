import { useScrollReveal } from '../hooks/useScrollReveal'

const fabricTypes = [
  { name: 'Cotton Lawn', color: '#e8ddd0' },
  { name: 'Linen', color: '#d4c5a9' },
  { name: 'Silk Blend', color: '#c2956c' },
  { name: 'Wool Blend', color: '#8b7355' },
  { name: 'Polyester Mix', color: '#6b8cba' },
  { name: 'Velvet', color: '#5d4777' },
  { name: 'Khaddar', color: '#7a9e6e' },
  { name: 'Karandi', color: '#c47a5a' },
  { name: 'Wash & Wear', color: '#5a7a9e' },
  { name: 'Chiffon', color: '#e8b4c0' },
  { name: 'Organza', color: '#d4b896' },
  { name: 'Cambric', color: '#a8c5a0' },
]

export default function Technologies() {
  const [ref, isVisible] = useScrollReveal(0.05)

  return (
    <section id="fabrics" className="py-20 md:py-24 relative">
      <div ref={ref} className={`max-w-7xl mx-auto px-6 reveal ${isVisible ? 'visible' : ''}`}>
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#b8860b]" />
            <span className="text-[#b8860b] text-xs tracking-[0.3em] uppercase font-medium">Our Materials</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#b8860b]" />
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-3">
            Premium <span className="gradient-text">Fabric Range</span>
          </h2>
          <p className="text-neutral-500 max-w-lg mx-auto text-sm">
            We work with a wide range of top-quality fabrics to ensure comfort, durability, and elegance.
          </p>
          <div className="gold-divider mt-4" />
        </div>

        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {fabricTypes.map((fabric, i) => (
            <div
              key={fabric.name}
              className="glass glass-hover border border-[#b8860b]/10 hover:border-[#b8860b]/30 px-5 py-3 flex items-center gap-3 group cursor-default transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div
                className="w-3 h-3 rounded-full transition-transform group-hover:scale-125 border border-white/10"
                style={{ backgroundColor: fabric.color }}
              />
              <span className="text-sm text-neutral-400 group-hover:text-[#d4a017] transition-colors tracking-wide">
                {fabric.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
