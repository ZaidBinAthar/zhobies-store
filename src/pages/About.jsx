import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Scissors, Gem, ShieldCheck, HeartHandshake,
  Award, Star, Sparkles, Check, ArrowRight, Clock,
  MapPin, Quote
} from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { useCompany } from '../hooks/useCompany'
import PageHeader from '../components/PageHeader'
import Technologies from '../components/Technologies'

const sizeGuideData = [
  { size: 'S', chest: '36"', waist: '30"', shoulder: '17.5"', length: '28"', sleeve: '24"' },
  { size: 'M', chest: '38"', waist: '32"', shoulder: '18.0"', length: '29"', sleeve: '24.5"' },
  { size: 'L', chest: '40"', waist: '34"', shoulder: '18.5"', length: '30"', sleeve: '25"' },
  { size: 'XL', chest: '42"', waist: '36"', shoulder: '19.0"', length: '31"', sleeve: '25.5"' },
  { size: 'XXL', chest: '44"', waist: '38"', shoulder: '19.5"', length: '32"', sleeve: '26"' },
]

const testimonials = [
  {
    name: 'Ahmed Raza',
    city: 'Faisalabad',
    role: 'Corporate Attorney',
    text: 'The three-piece navy formal suit was tailored to perfection. The horsehair canvas gives it a structured drape that matches bespoke savile row suits at a fraction of the price.',
    rating: 5,
  },
  {
    name: 'Bilal Khan',
    city: 'Lahore',
    role: 'Creative Director',
    text: 'Commissioned a traditional embroidered kurta for my wedding festivities. The resham needlework and collar detailing earned continuous compliments. Pure craftsmanship.',
    rating: 5,
  },
  {
    name: 'Usman Malik',
    city: 'Islamabad',
    role: 'Tech Founder',
    text: 'From the fleece hoodie set to my bespoke blazers, Zhobie’s Store delivers exceptional consistency. Delivery was on time and packaging felt truly regal.',
    rating: 5,
  },
]

export default function About() {
  const { theme } = useTheme()
  const { company } = useCompany()
  const [unit, setUnit] = useState('inches') // 'inches' or 'cm'
  const isDark = theme === 'dark'

  const companyName = company?.name || 'Zhobie\'s Store'

  return (
    <div className="min-h-screen">
      {/* ── Page Header ── */}
      <PageHeader
        badge="Our Heritage"
        title="Artisanal Tailoring &"
        highlight="Timeless Passion"
        description="Founded on the belief that true luxury lies in the precision of the cut, the purity of the fabric, and the individuality of the wearer."
        breadcrumbs={[{ name: 'About Brand' }]}
      />

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* ── 1. The Atelier Story ── */}
        <div className="grid lg:grid-cols-12 gap-12 items-center mb-24">
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-px w-10 bg-[#b8860b]" />
              <span className="text-[#b8860b] text-xs tracking-[0.3em] uppercase font-semibold">
                Since Inception
              </span>
            </div>

            <h2 className={`font-serif text-3xl sm:text-5xl font-bold leading-tight ${
              isDark ? 'text-white' : 'text-neutral-900'
            }`}>
              Crafting Garments That Tell <span className="gradient-text">Your Story</span>
            </h2>

            <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
              {companyName} originated from a clear desire: to bridge the gap between impersonal mass-manufactured garments and the refined mastery of bespoke heritage tailoring.
            </p>

            <p className={`text-sm leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Every blazer, sherwani, kurta, and hoodie set begins with hand-selected textiles sourced from leading mills in Pakistan, Italy, and Egypt. Under the eye of our master pattern cutters, individual measurements are translated into garments with distinctive presence, lasting comfort, and structural integrity.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#b8860b]/20">
              <div>
                <div className="font-serif text-3xl font-bold text-[#d4a017]">3+</div>
                <div className="text-[11px] text-neutral-500 uppercase tracking-wider mt-1">Years of Craft</div>
              </div>
              <div>
                <div className="font-serif text-3xl font-bold text-[#d4a017]">500+</div>
                <div className="text-[11px] text-neutral-500 uppercase tracking-wider mt-1">Bespoke Clients</div>
              </div>
              <div>
                <div className="font-serif text-3xl font-bold text-[#d4a017]">100%</div>
                <div className="text-[11px] text-neutral-500 uppercase tracking-wider mt-1">Pure Fabrics</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className={`p-4 border relative ${
              isDark ? 'border-[#b8860b]/30 bg-[#120f0c]' : 'border-[#b8860b]/30 bg-white shadow-xl'
            }`}>
              <div className="relative h-[480px] overflow-hidden">
                <img
                  src="/hero-fashion.jpg"
                  alt="Zhobie's Store Master Tailoring"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <Quote size={28} className="text-[#d4a017] mb-2 opacity-80" />
                  <p className="font-serif text-lg italic leading-relaxed">
                    "True elegance is not about standing out, but being remembered for quiet perfection."
                  </p>
                  <p className="text-xs uppercase tracking-widest text-[#d4a017] font-semibold mt-2">
                    Master Cutter & Atelier Team
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. Craftsmanship Pillars ── */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#b8860b] text-xs tracking-[0.3em] uppercase font-semibold">
              The Atelier Standard
            </span>
            <h2 className={`font-serif text-3xl sm:text-4xl font-bold mt-2 mb-4 ${
              isDark ? 'text-white' : 'text-neutral-900'
            }`}>
              Our Four Pillars of <span className="gradient-text">Excellence</span>
            </h2>
            <div className="gold-divider mt-4 mx-auto" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Scissors,
                title: 'Master Pattern Drafting',
                description: 'We draft individual garment patterns calculated precisely for your shoulder slope, back posture, and armhole circumference.',
              },
              {
                icon: Gem,
                title: 'Uncompromised Textiles',
                description: 'From 380 GSM combed fleece to Super 120s fine wools and Egyptian mercerized cotton, we never cut corners on raw fabrics.',
              },
              {
                icon: Award,
                title: 'Floating Canvas Stitching',
                description: 'Our formal suits feature genuine floating canvas construction that moulds naturally to your body shape over time.',
              },
              {
                icon: HeartHandshake,
                title: 'Complimentary Adjustments',
                description: 'We take full responsibility for your fit. If any detail needs tweaking, our tailoring team adjusts it with ease.',
              },
            ].map((pillar, i) => (
              <div
                key={i}
                className={`p-6 border transition-all duration-300 ${
                  isDark
                    ? 'border-[#b8860b]/20 bg-[#120f0c] hover:border-[#b8860b]/50'
                    : 'border-[#b8860b]/20 bg-white hover:border-[#b8860b]/50 shadow-sm'
                }`}
              >
                <div className="w-12 h-12 border border-[#b8860b]/40 flex items-center justify-center text-[#d4a017] mb-5">
                  <pillar.icon size={22} />
                </div>
                <h3 className={`font-serif text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  {pillar.title}
                </h3>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 3. Interactive Size Guide Table ── */}
        <div className={`p-8 sm:p-12 border mb-24 ${
          isDark ? 'border-[#b8860b]/20 bg-[#120f0c]' : 'border-[#b8860b]/20 bg-white shadow-sm'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <span className="text-[#b8860b] text-xs uppercase tracking-[0.3em] font-semibold">
                Precision Sizing
              </span>
              <h3 className={`font-serif text-2xl sm:text-3xl font-bold mt-1 ${
                isDark ? 'text-white' : 'text-neutral-900'
              }`}>
                Standard Sizing & Measurement Chart
              </h3>
              <p className={`text-xs mt-1 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Compare your measurements below or choose Custom Sizing at checkout for made-to-measure tailoring.
              </p>
            </div>

            <div className="flex items-center gap-2 border border-[#b8860b]/30 p-1">
              <button
                onClick={() => setUnit('inches')}
                className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  unit === 'inches'
                    ? 'bg-[#b8860b] text-white'
                    : isDark ? 'text-neutral-400' : 'text-neutral-600'
                }`}
              >
                Inches (in)
              </button>
              <button
                onClick={() => setUnit('cm')}
                className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  unit === 'cm'
                    ? 'bg-[#b8860b] text-white'
                    : isDark ? 'text-neutral-400' : 'text-neutral-600'
                }`}
              >
                Centimeters (cm)
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className={`border-b ${isDark ? 'border-[#b8860b]/30 text-white' : 'border-[#b8860b]/30 text-neutral-900'}`}>
                  <th className="py-3 px-4 uppercase tracking-widest font-serif font-bold">Size</th>
                  <th className="py-3 px-4 uppercase tracking-widest font-semibold">Chest</th>
                  <th className="py-3 px-4 uppercase tracking-widest font-semibold">Waist</th>
                  <th className="py-3 px-4 uppercase tracking-widest font-semibold">Shoulder</th>
                  <th className="py-3 px-4 uppercase tracking-widest font-semibold">Length</th>
                  <th className="py-3 px-4 uppercase tracking-widest font-semibold">Sleeve</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-[#b8860b]/10' : 'divide-[#b8860b]/15'}`}>
                {sizeGuideData.map((row) => {
                  const toCm = (val) => {
                    const num = Number(val.replace('"', ''))
                    return `${Math.round(num * 2.54)} cm`
                  }

                  return (
                    <tr key={row.size} className={`hover:bg-[#b8860b]/5 transition-colors ${
                      isDark ? 'text-neutral-300' : 'text-neutral-700'
                    }`}>
                      <td className="py-3.5 px-4 font-bold text-[#d4a017]">{row.size}</td>
                      <td className="py-3.5 px-4">{unit === 'cm' ? toCm(row.chest) : row.chest}</td>
                      <td className="py-3.5 px-4">{unit === 'cm' ? toCm(row.waist) : row.waist}</td>
                      <td className="py-3.5 px-4">{unit === 'cm' ? toCm(row.shoulder) : row.shoulder}</td>
                      <td className="py-3.5 px-4">{unit === 'cm' ? toCm(row.length) : row.length}</td>
                      <td className="py-3.5 px-4">{unit === 'cm' ? toCm(row.sleeve) : row.sleeve}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-6 pt-4 border-t border-[#b8860b]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-neutral-500">
            <span>Need advice measuring at home? Our team can guide you over WhatsApp.</span>
            <Link to="/contact" className="text-[#d4a017] hover:underline font-semibold flex items-center gap-1">
              <span>Book Measurement Session</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* ── 4. Fabric Range Showcase ── */}
        <Technologies />

        {/* ── 5. Client Testimonials ── */}
        <div className="py-16">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#b8860b] text-xs tracking-[0.3em] uppercase font-semibold">
              Verified Word of Mouth
            </span>
            <h2 className={`font-serif text-3xl sm:text-4xl font-bold mt-2 mb-4 ${
              isDark ? 'text-white' : 'text-neutral-900'
            }`}>
              Loved by <span className="gradient-text">Gentlemen</span> Nationwide
            </h2>
            <div className="gold-divider mt-4 mx-auto" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className={`p-8 border flex flex-col justify-between ${
                  isDark ? 'border-[#b8860b]/20 bg-[#120f0c]' : 'border-[#b8860b]/20 bg-white shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1 text-[#d4a017] mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={14} className="fill-[#d4a017]" />
                    ))}
                  </div>
                  <p className={`text-xs leading-relaxed italic mb-6 ${
                    isDark ? 'text-neutral-300' : 'text-neutral-700'
                  }`}>
                    "{t.text}"
                  </p>
                </div>

                <div className="pt-4 border-t border-[#b8860b]/15 flex items-center justify-between text-xs">
                  <div>
                    <div className={`font-serif font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                      {t.name}
                    </div>
                    <div className="text-[11px] text-neutral-500">{t.role} · {t.city}</div>
                  </div>
                  <Check size={14} className="text-[#d4a017]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 6. Atelier CTA ── */}
        <div className={`p-10 sm:p-14 border text-center ${
          isDark ? 'border-[#b8860b]/30 bg-[#0d0b09]' : 'border-[#b8860b]/30 bg-[#f7f3ec]'
        }`}>
          <h3 className={`font-serif text-3xl sm:text-4xl font-bold mb-4 ${
            isDark ? 'text-white' : 'text-neutral-900'
          }`}>
            Experience the Distinction of <span className="gradient-text">{companyName}</span>
          </h3>
          <p className={`max-w-xl mx-auto text-sm leading-relaxed mb-8 ${
            isDark ? 'text-neutral-400' : 'text-neutral-600'
          }`}>
            Browse our curated collections online or book a personal consultation with our master tailoring staff.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/collections"
              className="px-8 py-3.5 bg-[#b8860b] hover:bg-[#d4a017] text-white text-xs uppercase tracking-widest font-semibold transition-all shadow-lg shadow-[#b8860b]/20"
            >
              Explore Collections
            </Link>
            <Link
              to="/contact"
              className={`px-8 py-3.5 border text-xs uppercase tracking-widest font-semibold transition-all ${
                isDark
                  ? 'border-[#b8860b]/40 text-[#d4a017] hover:bg-[#b8860b]/10'
                  : 'border-[#b8860b]/40 text-[#b8860b] hover:bg-[#b8860b]/10 bg-white'
              }`}
            >
              Contact Atelier
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
