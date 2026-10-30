import { useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useTheme } from '../hooks/useTheme'
import { Send, Mail, MessageCircle, CheckCircle, Loader2, MapPin, Code2 } from 'lucide-react'

const InstagramIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
)

const FacebookIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)
import { API_CONFIG } from '../config/api'

const WHATSAPP_NUMBER = '923247201988'

const orderTypes = [
  'Formal Suit / Blazer',
  'Traditional Shalwar Kameez',
  'Casual Hoodie / Streetwear',
  'Embroidered Kurta',
  'Custom Stitching Order',
  'Bulk / Wholesale Order',
  'Other',
]

export default function Contact() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [ref, isVisible] = useScrollReveal(0.05)
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

  const inputClasses = `w-full px-4 py-3 text-sm transition-all focus:outline-none border ${isDark
    ? 'bg-[#171410] border-[#b8860b]/15 focus:border-[#b8860b]/50 text-white placeholder-neutral-600'
    : 'bg-[#faf8f5] border-[#b8860b]/20 focus:border-[#b8860b]/50 text-neutral-900 placeholder-neutral-400'
    } rounded-none`

  return (
    <section id="contact" className="py-20 md:py-28 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#b8860b]/[0.02] to-transparent" />

      <div ref={ref} className={`max-w-7xl mx-auto px-6 relative reveal ${isVisible ? 'visible' : ''}`}>
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#b8860b]" />
            <span className="text-[#b8860b] text-xs tracking-[0.3em] uppercase font-medium">Get In Touch</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#b8860b]" />
          </div>
          <h2 className={`font-serif text-4xl sm:text-5xl font-bold mb-3 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Place Your <span className="gradient-text">Order Today</span>
          </h2>
          <p className={`max-w-2xl mx-auto text-sm leading-relaxed ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
            Ready to elevate your wardrobe? Fill out the form or reach us directly via WhatsApp.
            We'll respond within hours with pricing and availability.
          </p>
          <div className="gold-divider mt-4" />
        </div>

        <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
          {/* Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="glass border border-[#b8860b]/15 p-6 sm:p-8" id="order-form">
              {status === 'success' && (
                <div className="mb-5 p-4 border border-green-500/20 bg-green-500/10 flex items-center gap-3">
                  <CheckCircle size={20} className="text-green-400 shrink-0" />
                  <p className="text-green-300 text-sm">
                    Your order enquiry has been submitted! We'll contact you within 24 hours.
                  </p>
                </div>
              )}

              {status === 'error' && (
                <div className="mb-5 p-4 border border-red-500/20 bg-red-500/10">
                  <span className="text-red-400 text-sm">{errorMsg}</span>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={`block text-xs mb-1.5 tracking-wider uppercase ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                    placeholder="Full name"
                    id="contact-name"
                  />
                </div>
                <div>
                  <label className={`block text-xs mb-1.5 tracking-wider uppercase ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                    placeholder="your@email.com"
                    id="contact-email"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={`block text-xs mb-1.5 tracking-wider uppercase ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>WhatsApp / Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="+92 3xx xxxxxxx"
                    id="contact-phone"
                  />
                </div>
                <div>
                  <label className={`block text-xs mb-1.5 tracking-wider uppercase ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Order Type</label>
                  <select
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    required
                    className={`${inputClasses} appearance-none cursor-pointer`}
                    id="contact-order-type"
                  >
                    <option value="" className={isDark ? 'bg-[#171410]' : 'bg-white'}>Select order type</option>
                    {orderTypes.map((type) => (
                      <option key={type} value={type} className={isDark ? 'bg-[#171410]' : 'bg-white'}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className={`block text-xs mb-1.5 tracking-wider uppercase ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Message / Special Requirements</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className={`${inputClasses} resize-none`}
                  placeholder="Tell us about your order — style preferences, measurements, delivery city..."
                  id="contact-message"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="btn-primary w-full !py-4 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                id="contact-submit"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Sending Order...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send Order Enquiry
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="glass border border-[#b8860b]/15 p-6">
              <h3 className={`font-serif font-semibold text-lg mb-5 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Contact Directly
              </h3>
              <div className="flex flex-col gap-3">
                {[
                  {
                    icon: MessageCircle,
                    label: 'WhatsApp',
                    value: '+92 324 7201988',
                    href: `https://wa.me/${WHATSAPP_NUMBER}`,
                    color: 'hover:text-green-400 hover:border-green-400/30',
                  },
                  {
                    icon: Mail,
                    label: 'Email',
                    value: 'zohaibafzal4566@gmail.com',
                    href: 'mailto:zohaibafzal4566@gmail.com?subject=Clothing%20Order%20Enquiry',
                    color: 'hover:text-[#d4a017] hover:border-[#b8860b]/30',
                  },
                  {
                    icon: InstagramIcon,
                    label: 'Instagram',
                    value: '@zohaibieswear',
                    href: 'https://www.instagram.com/zaidiprox/',
                    color: 'hover:text-pink-400 hover:border-pink-400/30',
                  },
                  {
                    icon: FacebookIcon,
                    label: 'Facebook',
                    value: 'Zohaibies Wear',
                    href: 'https://www.facebook.com/zaidiprox',
                    color: 'hover:text-blue-400 hover:border-blue-400/30',
                  },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 px-4 py-3 border border-[#b8860b]/10 transition-all duration-300 group ${isDark ? 'text-neutral-400' : 'text-neutral-600'
                      } ${link.color}`}
                  >
                    <span className="group-hover:scale-110 transition-transform">
                      <link.icon size={16} />
                    </span>
                    <div>
                      <div className="text-[10px] tracking-[0.2em] uppercase opacity-60 mb-0.5">{link.label}</div>
                      <div className="text-sm font-medium">{link.value}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="glass border border-[#b8860b]/15 p-6">
              <h3 className={`font-serif font-semibold mb-3 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Location
              </h3>
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-[#b8860b] mt-0.5 shrink-0" />
                <div>
                  <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    Faisalabad, Punjab, Pakistan
                  </p>
                  <p className="text-neutral-500 text-xs mt-1">
                    Delivery available nationwide
                  </p>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="glass border border-[#b8860b]/15 p-6">
              <h3 className={`font-serif font-semibold mb-3 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Business Hours
              </h3>
              <div className="space-y-2">
                {[
                  { day: 'Mon — Sat', time: '10:00 AM — 8:00 PM' },
                  { day: 'Sunday', time: '11:00 AM — 5:00 PM' },
                ].map((h) => (
                  <div key={h.day} className="flex justify-between text-xs">
                    <span className={isDark ? 'text-neutral-500' : 'text-neutral-500'}>{h.day}</span>
                    <span className="text-[#d4a017] font-medium">{h.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Developer Contact Card */}
            <div className="glass border border-[#b8860b]/20 p-5 bg-[#171410]/70">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Code2 size={15} className="text-[#d4a017]" />
                  <span className="text-[10px] tracking-[0.25em] uppercase text-[#b8860b] font-semibold">
                    Website Developer
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 border border-[#b8860b]/30 text-[#d4a017] rounded-sm bg-[#b8860b]/10">
                  Tech Support
                </span>
              </div>
              <p className={`font-serif text-base font-bold text-white mb-1`}>
                Developed by Zaid Bin Athar
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs mt-2.5">
                <a
                  href="https://wa.me/923256232379"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-green-400 hover:text-green-300 transition-colors"
                >
                  <MessageCircle size={13} />
                  +92 325 6232379
                </a>
                <span className="text-neutral-600">·</span>
                <a
                  href="tel:+923256232379"
                  className="text-neutral-400 hover:text-[#d4a017] transition-colors"
                >
                  Call: +92 325 6232379
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
