import { useScrollReveal } from '../hooks/useScrollReveal'
import {
  Globe, Settings, Calculator, GraduationCap,
  Package, AppWindow
} from 'lucide-react'

const services = [
  {
    icon: Globe,
    title: 'Business Websites',
    description: 'Modern responsive websites for businesses, shops and organizations that make a strong first impression.',
  },
  {
    icon: Settings,
    title: 'Business Management Software',
    description: 'Custom software for managing daily business operations, workflows, and team coordination.',
  },
  {
    icon: Calculator,
    title: 'Accounting Systems',
    description: 'Accounting, income, expenses, accounts, reports and transaction management systems.',
  },
  {
    icon: GraduationCap,
    title: 'School Management Software',
    description: 'Student, fees, accounts, expenses, reports and administrative management systems.',
  },
  {
    icon: Package,
    title: 'Inventory & Sales Systems',
    description: 'Products, stock, purchases, sales, customers and reporting management systems.',
  },
  {
    icon: AppWindow,
    title: 'Custom Web Applications',
    description: 'Custom database-driven applications designed around a client\'s specific requirements.',
  },
]

export default function Services() {
  const [ref, isVisible] = useScrollReveal(0.1)

  return (
    <section id="services" className="py-20 md:py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/[0.02] to-transparent" />
      <div ref={ref} className={`max-w-7xl mx-auto px-6 relative reveal ${isVisible ? 'visible' : ''}`}>
        <div className="text-center mb-12">
          <p className="text-primary font-mono text-sm mb-3 tracking-wider uppercase">Services</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
            What I Can <span className="gradient-text">Build For You</span>
          </h2>
          <p className="text-neutral-500 max-w-lg mx-auto">
            From simple business websites to complex management systems — I deliver solutions that work.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, i) => (
            <div
              key={service.title}
              className="glass rounded-2xl p-6 group hover:bg-white/[0.06] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 border border-white/[0.04] hover:border-primary/20"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                <service.icon size={24} className="text-primary" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{service.title}</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
