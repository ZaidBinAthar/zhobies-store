import { useScrollReveal } from '../hooks/useScrollReveal'
import {
  Sparkles, Brain, Database, Smartphone,
  Puzzle, MessageSquare, TrendingUp
} from 'lucide-react'

const reasons = [
  { icon: Sparkles, title: 'Modern User Interfaces', description: 'Clean, polished designs that feel professional and modern.' },
  { icon: Brain, title: 'Business-Focused Thinking', description: 'I understand how businesses operate and build software accordingly.' },
  { icon: Database, title: 'Database-Driven Systems', description: 'Robust data management with proper database architecture.' },
  { icon: Smartphone, title: 'Responsive Design', description: 'Every project works perfectly on desktop, tablet and mobile.' },
  { icon: Puzzle, title: 'Custom Solutions', description: 'Tailored software built around your specific requirements.' },
  { icon: MessageSquare, title: 'Clear Communication', description: 'I keep you informed throughout every stage of development.' },
  { icon: TrendingUp, title: 'Scalable Architecture', description: 'Systems built to grow with your business needs.' },
]

export default function WhyWorkWithMe() {
  const [ref, isVisible] = useScrollReveal(0.1)

  return (
    <section className="py-28 relative">
      <div ref={ref} className={`max-w-7xl mx-auto px-6 reveal ${isVisible ? 'visible' : ''}`}>
        <div className="text-center mb-16">
          <p className="text-primary font-mono text-sm mb-4 tracking-wider uppercase">Why Me</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Why Work <span className="gradient-text">With Me</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {reasons.map((reason, i) => (
            <div
              key={reason.title}
              className="glass glass-hover rounded-xl p-6 group cursor-default transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                <reason.icon size={20} className="text-primary" />
              </div>
              <h3 className="text-white font-semibold mb-2 text-sm">{reason.title}</h3>
              <p className="text-neutral-500 text-xs leading-relaxed">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
