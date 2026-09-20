import { useScrollReveal } from '../hooks/useScrollReveal'
import { ExternalLink, Lock } from 'lucide-react'

const projects = [
  {
    title: 'Zunex School Accounting',
    description: 'A modern school accounting and management system designed to manage students, fees, income, expenses, accounts and reports.',
    tech: ['React', 'Vite', 'Express.js', 'PostgreSQL'],
    status: 'Private / Demo Project',
  },
  {
    title: 'BinAthar Motors',
    description: 'A modern motorcycle business platform designed for buying, selling and managing bike inventory.',
    tech: ['React', 'Node.js', 'Express.js', 'PostgreSQL'],
    status: 'Private / Demo Project',
  },
  {
    title: 'Business Management Systems',
    description: 'Custom business software concepts for organizations that need centralized management, accounting, inventory and reporting.',
    tech: ['React', 'Node.js', 'SQL'],
    status: 'Private / Demo Project',
  },
]

export default function Projects() {
  const [ref, isVisible] = useScrollReveal(0.1)

  return (
    <section id="projects" className="py-28 relative">
      <div ref={ref} className={`max-w-7xl mx-auto px-6 reveal ${isVisible ? 'visible' : ''}`}>
        <div className="text-center mb-16">
          <p className="text-primary font-mono text-sm mb-4 tracking-wider uppercase">Projects</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Featured <span className="gradient-text">Work</span>
          </h2>
          <p className="text-neutral-500 max-w-lg mx-auto">
            A selection of projects that demonstrate my ability to build complete, functional software systems.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <div
              key={project.title}
              className="glass rounded-2xl overflow-hidden group hover:bg-white/[0.06] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 border border-white/[0.04] hover:border-primary/20"
            >
              <div className="h-48 bg-gradient-to-br from-primary/10 to-accent/10 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl font-bold text-white/5 group-hover:text-white/10 transition-colors">
                    {project.title.charAt(0)}
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm text-xs text-neutral-400">
                    <Lock size={12} />
                    {project.status}
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent" />
              </div>

              <div className="p-6">
                <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-primary-light transition-colors">
                  {project.title}
                </h3>
                <p className="text-neutral-500 text-sm leading-relaxed mb-5">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-5">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-md bg-primary/10 text-primary-light text-xs font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-sm text-neutral-500 group-hover:text-primary transition-colors">
                  <ExternalLink size={14} />
                  <span>Private / Demo Project</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
