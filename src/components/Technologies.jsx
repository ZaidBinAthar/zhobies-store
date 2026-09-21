import { useScrollReveal } from '../hooks/useScrollReveal'

const technologies = [
  { name: 'HTML', color: '#e34f26' },
  { name: 'CSS', color: '#1572b6' },
  { name: 'JavaScript', color: '#f7df1e' },
  { name: 'React', color: '#61dafb' },
  { name: 'Vite', color: '#646cff' },
  { name: 'Node.js', color: '#339933' },
  { name: 'Express.js', color: '#ffffff' },
  { name: 'REST APIs', color: '#ff6b6b' },
  { name: 'SQL', color: '#e38d00' },
  { name: 'PostgreSQL', color: '#336791' },
  { name: 'Git', color: '#f05032' },
  { name: 'GitHub', color: '#ffffff' },
  { name: 'Vercel', color: '#ffffff' },
  { name: 'Netlify', color: '#00c7b7' },
]

export default function Technologies() {
  const [ref, isVisible] = useScrollReveal(0.1)

  return (
    <section id="tech" className="py-20 md:py-24 relative">
      <div ref={ref} className={`max-w-7xl mx-auto px-6 reveal ${isVisible ? 'visible' : ''}`}>
        <div className="text-center mb-12">
          <p className="text-primary font-mono text-sm mb-3 tracking-wider uppercase">Technologies</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
            Tools I <span className="gradient-text">Work With</span>
          </h2>
          <p className="text-neutral-500 max-w-lg mx-auto">
            Modern technologies for building fast, scalable, and maintainable software.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {technologies.map((tech, i) => (
            <div
              key={tech.name}
              className="glass glass-hover rounded-xl px-5 py-3 flex items-center gap-3 group cursor-default transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div
                className="w-3 h-3 rounded-full transition-transform group-hover:scale-125"
                style={{ backgroundColor: tech.color }}
              />
              <span className="text-sm text-neutral-300 group-hover:text-white transition-colors font-medium">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
