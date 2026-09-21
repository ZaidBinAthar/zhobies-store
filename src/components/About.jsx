import { useScrollReveal } from '../hooks/useScrollReveal'
import {
  Globe, BarChart3, Calculator, GraduationCap,
  Package, ShoppingCart, LayoutDashboard, Database,
  Building2, AppWindow
} from 'lucide-react'

const capabilities = [
  { icon: Globe, label: 'Business Websites' },
  { icon: BarChart3, label: 'Management Systems' },
  { icon: Calculator, label: 'Accounting Software' },
  { icon: GraduationCap, label: 'School Management' },
  { icon: Package, label: 'Inventory Systems' },
  { icon: ShoppingCart, label: 'Sales & Purchase' },
  { icon: LayoutDashboard, label: 'Custom Dashboards' },
  { icon: Database, label: 'Database Applications' },
  { icon: Building2, label: 'Business Portals' },
  { icon: AppWindow, label: 'Custom Web Apps' },
]

export default function About() {
  const [ref, isVisible] = useScrollReveal(0.1)

  return (
    <section id="about" className="py-20 md:py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
      <div ref={ref} className={`max-w-7xl mx-auto px-6 relative reveal ${isVisible ? 'visible' : ''}`}>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <p className="text-primary font-mono text-sm mb-3 tracking-wider uppercase">About Me</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
              Building Software That Solves{' '}
              <span className="gradient-text">Real Problems</span>
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed mb-5">
              I focus on building practical software and business solutions that help organizations
              manage their operations efficiently. Rather than creating generic templates, I build
              complete systems tailored to real-world workflows.
            </p>
            <p className="text-neutral-500 leading-relaxed">
              From school accounting systems to motorcycle business platforms, I enjoy tackling
              complex problems that require thoughtful architecture, clean code, and database-driven
              functionality. Every project is an opportunity to create something genuinely useful.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {capabilities.map((item, i) => (
              <div
                key={item.label}
                className="glass glass-hover rounded-xl p-4 flex flex-col items-center gap-3 text-center group cursor-default transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <item.icon size={20} className="text-primary" />
                </div>
                <span className="text-xs text-neutral-400 group-hover:text-neutral-200 transition-colors leading-tight">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
