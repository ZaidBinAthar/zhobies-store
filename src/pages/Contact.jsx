import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { useTheme } from '../hooks/useTheme'
import { useCompany } from '../hooks/useCompany'
import { API_CONFIG } from '../config/api'
import {
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Phone,
  Send,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Scissors
} from 'lucide-react'

const WHATSAPP_PRIMARY = '923247201988'
const WHATSAPP_SECONDARY = '923256232379'
const EMAIL_PRIMARY = 'zaid.athar.2009@gmail.com'

const garmentOptions = [
  'Bespoke 2-Piece / 3-Piece Suit',
  'Luxury Sherwani & Wedding Attire',
  'Signature Royal Shalwar Kameez',
  'Hand-Embroidered Kurta',
  'Prince Coat / Tuxedo',
  'Casual Luxury Streetwear & Hoodies',
  'Corporate / Bulk Uniform Tailoring',
  'Custom Alteration & Tailoring Consultation'
]

const faqs = [
  {
    q: 'How long does a bespoke tailoring order take?',
    a: 'Standard bespoke orders are crafted within 7 to 10 business days. For urgent events, we offer an expedited VIP rush service (3 to 5 business days) upon request.'
  },
  {
    q: 'Can I provide my own fabric or do you supply luxury textiles?',
    a: 'Both! You can choose from our curated library of imported Super 150s wools, Italian cashmeres, Egyptian Giza cottons, and pure raw silks, or bring your own cut fabric for master tailor stitching.'
  },
  {
    q: 'How do you handle remote fittings and nationwide/international shipping?',
    a: 'We provide a guided virtual measurement protocol over WhatsApp video call. Once tailored, we ship securely with real-time tracking across Pakistan (24-48 hrs) and worldwide (5-7 business days via DHL).'
  },
  {
    q: 'What if my garment needs fit adjustments?',
    a: 'Every bespoke piece comes with our Perfect Fit Guarantee. If any fine-tuning is required within 14 days of delivery, our atelier provides complimentary adjustments.'
  }
]

export default function Contact() {
  const { theme } = useTheme()
  const { company } = useCompany()
  const isDark = theme === 'dark'

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    garmentType: garmentOptions[0],
    fabricPreference: '',
    measurements: '',
    message: ''
  })
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [openFaq, setOpenFaq] = useState(0)

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')

    const fullMessage = [
      formData.message,
      formData.fabricPreference ? `Fabric: ${formData.fabricPreference}` : '',
      formData.measurements ? `Measurements: ${formData.measurements}` : ''
    ]
      .filter(Boolean)
      .join('\n\n')

    try {
      const res = await fetch(API_CONFIG.contact, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          projectType: formData.garmentType,
          message: fullMessage
        })
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit inquiry. Please try again.')
      }

      setStatus('success')
      setFormData({
        name: '',
        email: '',
        phone: '',
        garmentType: garmentOptions[0],
        fabricPreference: '',
        measurements: '',
        message: ''
      })
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message || 'Something went wrong. Please connect with us directly on WhatsApp.')
    }
  }

  const handleWhatsAppDirect = () => {
    const text = `*New Atelier Consultation Inquiry*\n` +
      `*Name:* ${formData.name || 'Valued Client'}\n` +
      `*Phone:* ${formData.phone || 'N/A'}\n` +
      `*Email:* ${formData.email || 'N/A'}\n` +
      `*Garment:* ${formData.garmentType}\n` +
      (formData.fabricPreference ? `*Fabric Preference:* ${formData.fabricPreference}\n` : '') +
      (formData.measurements ? `*Measurements:* ${formData.measurements}\n` : '') +
      (formData.message ? `*Notes:* ${formData.message}` : '')

    window.open(`https://wa.me/${WHATSAPP_PRIMARY}?text=${encodeURIComponent(text)}`, '_blank')
  }

  const inputStyle = `w-full px-4 py-3 text-sm transition-all focus:outline-none border ${
    isDark
      ? 'bg-[#15120e] border-[#b8860b]/20 focus:border-[#d4a017] text-white placeholder-neutral-500'
      : 'bg-white border-[#b8860b]/25 focus:border-[#b8860b] text-neutral-900 placeholder-neutral-400 shadow-sm'
  }`

  return (
    <div className="pt-24 pb-20">
      <PageHeader
        badge="Connect With Our Atelier"
        title="Bespoke Consultation & Inquiries"
        subtitle="Schedule a private measurement consultation, commission a bespoke garment, or inquire about wholesale orders. Our master tailors are at your service."
        breadcrumb="Contact"
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Contact Channels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {/* Card 1: WhatsApp */}
          <div
            className={`p-6 border transition-all duration-300 relative group ${
              isDark
                ? 'bg-[#120f0c] border-[#b8860b]/20 hover:border-[#d4a017]/60'
                : 'bg-white border-[#b8860b]/20 hover:border-[#b8860b] shadow-sm'
            }`}
          >
            <div className="w-12 h-12 rounded-none bg-[#25D366]/10 border border-[#25D366]/30 flex items-center justify-center text-[#25D366] mb-4">
              <MessageCircle size={22} />
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#b8860b] font-medium mb-1">
              Instant Concierge
            </div>
            <h3 className={`font-serif text-lg font-bold mb-1.5 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              WhatsApp Direct
            </h3>
            <p className={`text-xs mb-4 leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Chat live with our sartorial advisors for quick pricing, fabric swatches & status.
            </p>
            <div className="space-y-1">
              <a
                href={`https://wa.me/${WHATSAPP_PRIMARY}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs font-semibold text-[#25D366] hover:underline"
              >
                +92 324 7201988 (Primary)
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_SECONDARY}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs font-semibold text-[#25D366] hover:underline"
              >
                +92 325 6232379 (Support)
              </a>
            </div>
          </div>

          {/* Card 2: Email */}
          <div
            className={`p-6 border transition-all duration-300 relative group ${
              isDark
                ? 'bg-[#120f0c] border-[#b8860b]/20 hover:border-[#d4a017]/60'
                : 'bg-white border-[#b8860b]/20 hover:border-[#b8860b] shadow-sm'
            }`}
          >
            <div className="w-12 h-12 rounded-none bg-[#b8860b]/10 border border-[#b8860b]/30 flex items-center justify-center text-[#d4a017] mb-4">
              <Mail size={22} />
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#b8860b] font-medium mb-1">
              Official Inquiries
            </div>
            <h3 className={`font-serif text-lg font-bold mb-1.5 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Email Atelier
            </h3>
            <p className={`text-xs mb-4 leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              For bespoke corporate contracts, formal proposals, and detailed fitting briefs.
            </p>
            <div className="space-y-1">
              <a
                href={`mailto:${EMAIL_PRIMARY}`}
                className={`block text-xs font-semibold hover:text-[#d4a017] transition-colors truncate ${
                  isDark ? 'text-neutral-200' : 'text-neutral-800'
                }`}
              >
                {EMAIL_PRIMARY}
              </a>
              <span className="block text-[11px] text-neutral-500">
                Guaranteed reply within 12 hours
              </span>
            </div>
          </div>

          {/* Card 3: Location */}
          <div
            className={`p-6 border transition-all duration-300 relative group ${
              isDark
                ? 'bg-[#120f0c] border-[#b8860b]/20 hover:border-[#d4a017]/60'
                : 'bg-white border-[#b8860b]/20 hover:border-[#b8860b] shadow-sm'
            }`}
          >
            <div className="w-12 h-12 rounded-none bg-[#b8860b]/10 border border-[#b8860b]/30 flex items-center justify-center text-[#d4a017] mb-4">
              <MapPin size={22} />
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#b8860b] font-medium mb-1">
              Bespoke Studios
            </div>
            <h3 className={`font-serif text-lg font-bold mb-1.5 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Flagship Atelier
            </h3>
            <p className={`text-xs mb-4 leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Textile Capital of Pakistan. Private fitting suites & master pattern cutters.
            </p>
            <p className={`text-xs font-semibold ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>
              Faisalabad & Lahore, Pakistan
            </p>
            <span className="block text-[11px] text-neutral-500 mt-1">
              Worldwide Doorstep Delivery
            </span>
          </div>

          {/* Card 4: Hours */}
          <div
            className={`p-6 border transition-all duration-300 relative group ${
              isDark
                ? 'bg-[#120f0c] border-[#b8860b]/20 hover:border-[#d4a017]/60'
                : 'bg-white border-[#b8860b]/20 hover:border-[#b8860b] shadow-sm'
            }`}
          >
            <div className="w-12 h-12 rounded-none bg-[#b8860b]/10 border border-[#b8860b]/30 flex items-center justify-center text-[#d4a017] mb-4">
              <Clock size={22} />
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#b8860b] font-medium mb-1">
              Visiting & Service
            </div>
            <h3 className={`font-serif text-lg font-bold mb-1.5 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Atelier Hours
            </h3>
            <div className={`space-y-1.5 text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              <div className="flex justify-between">
                <span>Mon – Sat:</span>
                <span className={`font-semibold ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>
                  10:00 AM – 10:00 PM
                </span>
              </div>
              <div className="flex justify-between">
                <span>Sunday:</span>
                <span className="text-[#b8860b] font-semibold">VIP by Appointment</span>
              </div>
              <div className="pt-2 text-[11px] text-neutral-500">
                Online WhatsApp consultations 24/7
              </div>
            </div>
          </div>
        </div>

        {/* Main Section: Consultation Form + Bespoke Experience */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-20">
          {/* Form: 7 cols */}
          <div
            className={`lg:col-span-7 p-6 sm:p-10 border relative ${
              isDark
                ? 'bg-[#100d0a] border-[#b8860b]/20'
                : 'bg-white border-[#b8860b]/20 shadow-md'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Scissors size={18} className="text-[#d4a017]" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#b8860b] font-medium">
                Tailoring Commission Form
              </span>
            </div>
            <h2 className={`font-serif text-2xl sm:text-3xl font-bold mb-3 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Book a Consultation or Place an Order
            </h2>
            <p className={`text-xs sm:text-sm mb-8 leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Please furnish us with your preferred style and contact details. Our chief cutter will review your specifications and contact you directly.
            </p>

            {status === 'success' && (
              <div className="mb-6 p-4 border border-emerald-500/30 bg-emerald-500/10 flex items-start gap-3">
                <CheckCircle size={20} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-emerald-300 font-semibold text-sm">
                    Inquiry Submitted Successfully
                  </h4>
                  <p className="text-emerald-400/90 text-xs mt-1">
                    Thank you. Your consultation brief has been recorded. Our sartorial advisor will connect with you via WhatsApp/Email shortly.
                  </p>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="mb-6 p-4 border border-rose-500/30 bg-rose-500/10 flex items-start gap-3">
                <AlertCircle size={20} className="text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-rose-300 font-semibold text-sm">Submission Error</h4>
                  <p className="text-rose-400/90 text-xs mt-1">{errorMsg}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-[11px] uppercase tracking-wider mb-1.5 font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                    Your Full Name <span className="text-[#b8860b]">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Tariq Mehmood"
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className={`block text-[11px] uppercase tracking-wider mb-1.5 font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                    Email Address <span className="text-[#b8860b]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tariq@example.com"
                    className={inputStyle}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-[11px] uppercase tracking-wider mb-1.5 font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                    WhatsApp / Phone Number <span className="text-[#b8860b]">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+92 300 1234567"
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className={`block text-[11px] uppercase tracking-wider mb-1.5 font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                    Garment of Interest <span className="text-[#b8860b]">*</span>
                  </label>
                  <select
                    name="garmentType"
                    value={formData.garmentType}
                    onChange={handleChange}
                    className={inputStyle}
                  >
                    {garmentOptions.map((opt) => (
                      <option key={opt} value={opt} className={isDark ? 'bg-[#15120e] text-white' : 'bg-white text-neutral-900'}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-[11px] uppercase tracking-wider mb-1.5 font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                    Fabric Preference (Optional)
                  </label>
                  <input
                    type="text"
                    name="fabricPreference"
                    value={formData.fabricPreference}
                    onChange={handleChange}
                    placeholder="e.g. Italian Wool, Egyptian Cotton, Silk"
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className={`block text-[11px] uppercase tracking-wider mb-1.5 font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                    Measurements / Sizes (Optional)
                  </label>
                  <input
                    type="text"
                    name="measurements"
                    value={formData.measurements}
                    onChange={handleChange}
                    placeholder="e.g. Chest 40, Waist 34, Height 5'11"
                    className={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-[11px] uppercase tracking-wider mb-1.5 font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                  Special Instructions / Event Date
                </label>
                <textarea
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about the occasion, deadline, styling accents, or specific references..."
                  className={`${inputStyle} resize-y`}
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#b8860b] to-[#d4a017] text-[#0d0b09] font-semibold text-xs tracking-widest uppercase hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#b8860b]/20 disabled:opacity-50"
                >
                  <Send size={14} />
                  <span>{status === 'submitting' ? 'Submitting...' : 'Send Inquiry'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppDirect}
                  className={`w-full sm:w-auto px-6 py-3.5 border border-[#25D366]/40 hover:border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10 font-semibold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2`}
                >
                  <MessageCircle size={15} />
                  <span>Send via WhatsApp</span>
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar: 5 cols */}
          <div className="lg:col-span-5 space-y-6">
            {/* Master Tailor Guarantee */}
            <div
              className={`p-6 sm:p-8 border relative ${
                isDark
                  ? 'bg-gradient-to-br from-[#18130e] to-[#0f0c09] border-[#b8860b]/25'
                  : 'bg-gradient-to-br from-[#fcf9f4] to-[#f4eee4] border-[#b8860b]/25 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-2 text-[#d4a017] mb-3">
                <Sparkles size={18} />
                <span className="text-[10px] uppercase tracking-[0.25em] font-semibold">
                  Atelier Heritage
                </span>
              </div>
              <h3 className={`font-serif text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                The Zhobie's Bespoke Promise
              </h3>
              <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                From master pattern drafting to hand-canvassed construction and final hand-pressed finish, our garments embody three decades of Pakistani sartorial expertise.
              </p>
              <ul className={`space-y-2.5 text-xs ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                <li className="flex items-start gap-2">
                  <span className="text-[#b8860b] mt-0.5">&#10003;</span>
                  <span><strong>Complimentary Fit Insurance:</strong> Free adjustments within 14 days of delivery.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#b8860b] mt-0.5">&#10003;</span>
                  <span><strong>Digital Measurement Vault:</strong> We archive your exact dimensions for effortless future orders.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#b8860b] mt-0.5">&#10003;</span>
                  <span><strong>Worldwide Express Delivery:</strong> Insured international air cargo with live tracking.</span>
                </li>
              </ul>
            </div>

            {/* Quick Consultation Callout */}
            <div
              className={`p-6 border ${
                isDark
                  ? 'bg-[#120f0c] border-[#b8860b]/20'
                  : 'bg-white border-[#b8860b]/20 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#b8860b]/15 text-[#d4a017] flex items-center justify-center">
                  <Phone size={18} />
                </div>
                <div>
                  <h4 className={`font-serif font-bold text-sm ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                    Need Immediate Assistance?
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    Call directly or connect over WhatsApp
                  </p>
                </div>
              </div>
              <p className={`text-xs mb-4 leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Planning an upcoming wedding, gala, or need an urgent rush order? Reach our lead tailor directly.
              </p>
              <a
                href={`https://wa.me/${WHATSAPP_PRIMARY}?text=${encodeURIComponent('Hello Zhobie’s Store, I would like to schedule a bespoke consultation.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#b8860b]/15 hover:bg-[#b8860b]/25 border border-[#b8860b]/40 text-[#d4a017] font-semibold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle size={15} />
                <span>Start WhatsApp Consultation</span>
              </a>
            </div>
          </div>
        </div>

        {/* Interactive FAQ Section */}
        <div className="max-w-4xl mx-auto mt-16 pt-12 border-t border-[#b8860b]/20">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#b8860b] font-medium mb-2">
              <HelpCircle size={14} />
              <span>Frequently Asked Questions</span>
            </div>
            <h2 className={`font-serif text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Everything You Need to Know
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx
              return (
                <div
                  key={faq.q}
                  className={`border transition-colors ${
                    isDark
                      ? isOpen
                        ? 'bg-[#14100c] border-[#b8860b]/40'
                        : 'bg-[#0f0c09] border-[#b8860b]/15 hover:border-[#b8860b]/30'
                      : isOpen
                      ? 'bg-white border-[#b8860b]/40 shadow-sm'
                      : 'bg-white/70 border-[#b8860b]/20 hover:border-[#b8860b]/40'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4"
                  >
                    <span className={`font-serif text-sm sm:text-base font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                      {faq.q}
                    </span>
                    <span className="text-[#b8860b] shrink-0">
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-1">
                      <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
