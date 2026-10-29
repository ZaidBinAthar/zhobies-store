import { useScrollReveal } from '../hooks/useScrollReveal'

const steps = [
  {
    number: '01',
    title: 'Browse & Choose',
    description: 'Explore our collections — formal, casual, and traditional. Pick the style that speaks to you.',
  },
  {
    number: '02',
    title: 'Contact Us',
    description: 'Reach out via WhatsApp or the contact form with your size, color preference, and delivery address.',
  },
  {
    number: '03',
    title: 'Custom Fitting',
    description: 'Share your measurements for a perfect custom fit, or choose from our standard size guide.',
  },
  {
    number: '04',
    title: 'Delivered to You',
    description: 'Your order is prepared with care, packaged beautifully, and delivered across Pakistan within days.',
  },
]

export default function Workflow() {
  const [ref, isVisible] = useScrollReveal(0.05)

  return (
    <section className="py-20 md:py-28 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#b8860b]/[0.02] to-transparent" />
      <div ref={ref} className={`max-w-7xl mx-auto px-6 relative reveal ${isVisible ? 'visible' : ''}`}>
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#b8860b]" />
            <span className="text-[#b8860b] text-xs tracking-[0.3em] uppercase font-medium">How It Works</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#b8860b]" />
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-3">
            Simple <span className="gradient-text">Ordering Process</span>
          </h2>
          <p className="text-neutral-500 max-w-lg mx-auto text-sm">
            From selection to doorstep — we make shopping for premium clothes effortless.
          </p>
          <div className="gold-divider mt-4" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step, i) => (
            <div key={step.number} className="relative group">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(50%+44px)] w-[calc(100%-40px)] h-px bg-gradient-to-r from-[#b8860b]/40 to-[#b8860b]/10" />
              )}
              <div
                className="glass border border-[#b8860b]/10 p-6 text-center group-hover:border-[#b8860b]/30 transition-all duration-300 hover:-translate-y-1 hover:bg-[#b8860b]/[0.04] relative"
                id={`step-${step.number}`}
              >
                {/* Step number */}
                <div className="font-serif text-5xl font-bold gradient-text mb-4 opacity-50 group-hover:opacity-100 transition-opacity">
                  {step.number}
                </div>
                <h3 className="font-serif text-lg font-semibold text-white mb-3 group-hover:text-[#d4a017] transition-colors">
                  {step.title}
                </h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
