import { useScrollReveal } from '../hooks/useScrollReveal'

const steps = [
  {
    number: '01',
    title: 'Tell Me Your Idea',
    description: 'Explain your business or software requirements. I listen carefully to understand what you need.',
  },
  {
    number: '02',
    title: 'Plan',
    description: 'I understand the workflow and design the system structure. Every feature is mapped out clearly.',
  },
  {
    number: '03',
    title: 'Build',
    description: 'I develop the website or software and connect the required database and functionality.',
  },
  {
    number: '04',
    title: 'Launch',
    description: 'The completed system is deployed and ready to use. I ensure everything works perfectly.',
  },
]

export default function Workflow() {
  const [ref, isVisible] = useScrollReveal(0.1)

  return (
    <section className="py-28 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
      <div ref={ref} className={`max-w-7xl mx-auto px-6 relative reveal ${isVisible ? 'visible' : ''}`}>
        <div className="text-center mb-16">
          <p className="text-primary font-mono text-sm mb-4 tracking-wider uppercase">Process</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            How We <span className="gradient-text">Work Together</span>
          </h2>
          <p className="text-neutral-500 max-w-lg mx-auto">
            A simple, transparent process from idea to deployment.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={step.number} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[calc(50%+40px)] w-[calc(100%-40px)] h-px bg-gradient-to-r from-primary/30 to-primary/10" />
              )}
              <div className="glass rounded-2xl p-7 text-center group hover:bg-white/[0.06] transition-all duration-300 hover:-translate-y-1 border border-white/[0.04] hover:border-primary/20 relative">
                <div className="text-4xl font-bold gradient-text mb-4 font-mono opacity-60 group-hover:opacity-100 transition-opacity">
                  {step.number}
                </div>
                <h3 className="text-white font-semibold text-lg mb-3">{step.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
