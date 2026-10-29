import { useScrollReveal } from '../hooks/useScrollReveal'

const sizeGuide = [
  { size: 'S', chest: '36"', waist: '30"', length: '28"' },
  { size: 'M', chest: '38"', waist: '32"', length: '29"' },
  { size: 'L', chest: '40"', waist: '34"', length: '30"' },
  { size: 'XL', chest: '42"', waist: '36"', length: '31"' },
  { size: 'XXL', chest: '44"', waist: '38"', length: '32"' },
]

const testimonials = [
  {
    name: 'Ahmed Raza',
    city: 'Faisalabad',
    text: 'The formal suit I ordered was absolutely perfect. Premium stitching and beautiful fabric. Will definitely order again!',
    rating: 5,
  },
  {
    name: 'Bilal Khan',
    city: 'Lahore',
    text: 'Got the traditional kurta for Eid. The embroidery work is exceptional. Got so many compliments on the quality.',
    rating: 5,
  },
  {
    name: 'Usman Malik',
    city: 'Islamabad',
    text: 'Fast delivery and beautiful packaging. The casual hoodie set is exactly as shown. Very satisfied with Zohaibies Wear!',
    rating: 5,
  },
]

export default function Projects() {
  const [ref, isVisible] = useScrollReveal(0.05)

  return (
    <section id="about" className="py-20 md:py-28 relative">
      <div ref={ref} className={`max-w-7xl mx-auto px-6 reveal ${isVisible ? 'visible' : ''}`}>

        {/* About Brand */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-[#b8860b]" />
              <span className="text-[#b8860b] text-xs tracking-[0.3em] uppercase font-medium">Our Story</span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-5 leading-tight">
              Crafting Style With{' '}
              <span className="gradient-text">Passion</span>
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed mb-5">
              Zohaibies Wear was born from a passion for premium quality clothing
              at accessible prices. We believe every man deserves to look his best —
              whether at the office, a family gathering, or a festive celebration.
            </p>
            <p className="text-neutral-500 leading-relaxed mb-8">
              Every piece in our collection is handpicked for quality, stitched with
              care by our master tailors, and delivered with love. From Faisalabad to
              across Pakistan, we take pride in making you look exceptional.
            </p>
            <div className="grid grid-cols-3 gap-6">
              {[
                { value: '3+', label: 'Years of Craft' },
                { value: '500+', label: 'Satisfied Clients' },
                { value: '50+', label: 'Unique Designs' },
              ].map((stat) => (
                <div key={stat.label} className="text-center border-t border-[#b8860b]/20 pt-4">
                  <div className="font-serif text-2xl font-bold text-[#d4a017]">{stat.value}</div>
                  <div className="text-neutral-500 text-xs tracking-wide mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Size Guide */}
          <div className="glass border border-[#b8860b]/15 p-6">
            <h3 className="font-serif text-xl font-semibold text-white mb-1">Size Guide</h3>
            <p className="text-neutral-500 text-sm mb-5">Find your perfect fit with our size chart</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#b8860b]/20">
                    {['Size', 'Chest', 'Waist', 'Length'].map((h) => (
                      <th key={h} className="pb-3 text-left text-[#b8860b] text-xs tracking-wider uppercase font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sizeGuide.map((row, i) => (
                    <tr
                      key={row.size}
                      className={`border-b border-[#b8860b]/10 hover:bg-[#b8860b]/5 transition-colors ${i % 2 === 0 ? '' : 'bg-[#b8860b]/[0.02]'}`}
                    >
                      <td className="py-3 font-semibold text-[#d4a017] font-serif">{row.size}</td>
                      <td className="py-3 text-neutral-400">{row.chest}</td>
                      <td className="py-3 text-neutral-400">{row.waist}</td>
                      <td className="py-3 text-neutral-400">{row.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-neutral-600 text-xs mt-4">
              * Custom sizing available on request. Contact us via WhatsApp for measurements.
            </p>
          </div>
        </div>

        {/* Testimonials */}
        <div>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#b8860b]" />
              <span className="text-[#b8860b] text-xs tracking-[0.3em] uppercase font-medium">Customer Reviews</span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#b8860b]" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              What Our <span className="gradient-text">Customers Say</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className="glass border border-[#b8860b]/10 p-6 hover:border-[#b8860b]/25 transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <span key={i} className="text-[#d4a017] text-sm">★</span>
                  ))}
                </div>
                <p className="text-neutral-400 text-sm leading-relaxed italic mb-4">
                  "{t.text}"
                </p>
                <div className="border-t border-[#b8860b]/10 pt-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#b8860b] to-[#8b6508] flex items-center justify-center text-white text-xs font-bold font-serif">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-white text-sm font-semibold">{t.name}</div>
                    <div className="text-neutral-500 text-xs">{t.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
