import { useScrollReveal } from '../hooks/useScrollReveal'
import {
  Scissors, Gem, HeartHandshake, Truck,
  Star, RefreshCw, Palette, Award
} from 'lucide-react'

const reasons = [
  { icon: Scissors, title: 'Expert Tailoring', description: 'Every garment is stitched by skilled craftsmen with years of experience.' },
  { icon: Gem, title: 'Premium Fabrics', description: 'We source only the finest materials — luxurious to touch and durable to wear.' },
  { icon: Palette, title: 'Unique Designs', description: 'Exclusive designs that stand out from generic off-the-shelf clothing.' },
  { icon: HeartHandshake, title: 'Customer First', description: 'We go above and beyond to ensure every customer is fully satisfied.' },
  { icon: Truck, title: 'Nationwide Delivery', description: 'Fast, reliable delivery across all major cities in Pakistan.' },
  { icon: RefreshCw, title: 'Easy Exchange', description: 'Hassle-free exchange policy — we want you to love what you wear.' },
  { icon: Award, title: 'Quality Certified', description: 'Every piece passes strict quality checks before it reaches you.' },
]

export default function WhyWorkWithMe() {
  const [ref, isVisible] = useScrollReveal(0.05)

  return (
    <section className="py-20 md:py-28 relative">
      <div ref={ref} className={`max-w-7xl mx-auto px-6 reveal ${isVisible ? 'visible' : ''}`}>
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#b8860b]" />
            <span className="text-[#b8860b] text-xs tracking-[0.3em] uppercase font-medium">Why Choose Us</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#b8860b]" />
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-3">
            The <span className="gradient-text">Zohaibies</span> Difference
          </h2>
          <div className="gold-divider mt-4" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {reasons.map((reason, i) => (
            <div
              key={reason.title}
              className="glass glass-hover border border-[#b8860b]/10 p-5 group cursor-default transition-all duration-300 hover:-translate-y-1 hover:border-[#b8860b]/25"
              style={{ animationDelay: `${i * 60}ms` }}
              id={`why-${i + 1}`}
            >
              <div className="w-10 h-10 border border-[#b8860b]/30 flex items-center justify-center mb-4 group-hover:border-[#b8860b] group-hover:bg-[#b8860b]/10 transition-all duration-300">
                <reason.icon size={18} className="text-[#b8860b] group-hover:text-[#d4a017] transition-colors" />
              </div>
              <h3 className="font-serif text-white font-semibold mb-2 text-sm group-hover:text-[#d4a017] transition-colors">
                {reason.title}
              </h3>
              <p className="text-neutral-500 text-xs leading-relaxed">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
