import { useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useTheme } from '../hooks/useTheme'
import { Send, Mail, MessageCircle, CheckCircle, Loader2 } from 'lucide-react'
import { API_CONFIG } from '../config/api'

const WHATSAPP_NUMBER = '923256232379'

const projectTypes = [
  'Business Website',
  'Business Software',
  'Accounting Software',
  'School Management System',
  'Inventory System',
  'Custom Web Application',
  'Personal Info Web Applicationw',
  'Other',
]

const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
)

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
)

export default function Contact() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [ref, isVisible] = useScrollReveal(0.1)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    message: '',
  })
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')

    try {
      const res = await fetch(API_CONFIG.contact, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          projectType: formData.projectType,
          message: formData.message,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit')
      }

      setStatus('success')
      setFormData({ name: '', email: '', phone: '', projectType: '', message: '' })

      setTimeout(() => setStatus('idle'), 5000)
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message || 'Something went wrong. Please try again.')
    }
  }

  const contactLinks = [
    {
      icon: Mail,
      label: 'Email Me',
      href: 'mailto:zaidiprox@gmail.com',
      hoverColor: 'hover:text-red-400',
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      href: `https://wa.me/${WHATSAPP_NUMBER}`,
      hoverColor: 'hover:text-green-400',
    },
    {
      icon: GithubIcon,
      label: 'GitHub',
      href: 'https://github.com/ZaidBinAthar',
      hoverColor: isDark ? 'hover:text-white' : 'hover:text-neutral-900',
    },
    {
      icon: InstagramIcon,
      label: 'Instagram',
      href: 'https://www.instagram.com/zaidiprox/',
      hoverColor: 'hover:text-pink-400',
    },
  ]

  const inputClasses = `w-full px-4 py-3 rounded-xl text-sm transition-all focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 ${isDark
    ? 'bg-white/5 border border-white/10 text-white placeholder-neutral-600'
    : 'bg-black/5 border border-black/10 text-neutral-900 placeholder-neutral-400'
    }`

  return (
    <section id="contact" className="py-20 md:py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent" />
      <div ref={ref} className={`max-w-7xl mx-auto px-6 relative reveal ${isVisible ? 'visible' : ''}`}>
        <div className="text-center mb-12">
          <p className="text-primary font-mono text-sm mb-3 tracking-wider uppercase">Contact</p>
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Have a Project in <span className="gradient-text">Mind?</span>
          </h2>
          <p className={`max-w-2xl mx-auto ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
            Whether you need a business website, accounting system, school software, inventory system,
            or a completely custom web application, tell me what you need and let's discuss it.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 sm:p-7 border border-white/[0.04]">
              {status === 'success' && (
                <div className="mb-5 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3">
                  <CheckCircle size={20} className="text-green-400 shrink-0" />
                  <p className="text-green-300 text-sm">Your project request has been submitted successfully! I will get back to you soon.</p>
                </div>
              )}

              {status === 'error' && (
                <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                  <span className="text-red-400 text-sm">{errorMsg}</span>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={`block text-sm mb-1.5 font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className={`block text-sm mb-1.5 font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={`block text-sm mb-1.5 font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Phone / WhatsApp</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="+92 xxx xxxxxxx"
                  />
                </div>
                <div>
                  <label className={`block text-sm mb-1.5 font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Project Type</label>
                  <select
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    required
                    className={`${inputClasses} appearance-none cursor-pointer`}
                  >
                    <option value="" className={isDark ? 'bg-surface' : 'bg-white'}>Select project type</option>
                    {projectTypes.map((type) => (
                      <option key={type} value={type} className={isDark ? 'bg-surface' : 'bg-white'}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-5">
                <label className={`block text-sm mb-1.5 font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className={`${inputClasses} resize-none`}
                  placeholder="Tell me about your project..."
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="btn-primary w-full !py-3.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send Project Request
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="glass rounded-2xl p-6 border border-white/[0.04]">
              <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>Direct Contact</h3>
              <div className="flex flex-col gap-2.5">
                {contactLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isDark
                      ? 'bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.04] hover:border-primary/20 text-neutral-400'
                      : 'bg-black/[0.03] hover:bg-black/[0.06] border border-black/[0.04] hover:border-primary/20 text-neutral-600'
                      } ${link.hoverColor}`}
                  >
                    <span className="group-hover:scale-110 transition-transform">
                      {typeof link.icon === 'function' && link.icon.prototype?.isReactComponent ? (
                        <link.icon size={18} />
                      ) : (
                        <link.icon />
                      )}
                    </span>
                    <span className="text-sm font-medium">{link.label}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-6 border border-white/[0.04]">
              <h3 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-neutral-900'}`}>Email Address</h3>
              <a
                href="mailto:zaidiprox@gmail.com?subject=Project%20Inquiry"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm group ${isDark
                  ? 'bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.04] hover:border-primary/20 text-neutral-400'
                  : 'bg-black/[0.03] hover:bg-black/[0.06] border border-black/[0.04] hover:border-primary/20 text-neutral-600'
                  } hover:text-primary`}
              >
                <Mail size={14} className="group-hover:scale-110 transition-transform shrink-0" />
                <span>zaidiprox@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
