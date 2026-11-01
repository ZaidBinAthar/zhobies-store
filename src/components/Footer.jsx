import { Heart, Mail, MessageCircle, MapPin } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { useCompany } from '../hooks/useCompany'

const WHATSAPP_NUMBER = '923247201988'

const footerLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Collections', href: '#collections' },
  { name: 'Products', href: '#products' },
  { name: 'About Us', href: '#about' },
  { name: 'Contact', href: '#contact' },
]

const socialLinks = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/zaidiprox/',
    icon: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/zaidiprox',
    icon: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
    icon: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
]

export default function Footer() {
  const { theme } = useTheme()
  const { company } = useCompany()
  const isDark = theme === 'dark'

  const companyName = company?.name || 'Zhobies Wear'
  const logoLetter = companyName.trim().charAt(0).toUpperCase() || 'Z'
  const logoUrl = company?.logoUrl
  const nameParts = companyName.split(' ')
  const firstNamePart = nameParts[0] || companyName
  const remainingNamePart = nameParts.slice(1).join(' ')

  const handleClick = (e, href) => {
    e.preventDefault()
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className={`border-t ${isDark ? 'border-[#b8860b]/10 bg-[#080604]' : 'border-[#b8860b]/15 bg-[#f5f0e8]'}`}>
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={companyName}
                  className="w-11 h-11 object-contain rounded border border-[#b8860b]/40 p-1 bg-[#0d0b09]/40"
                />
              ) : (
                <div className="w-10 h-10 border border-[#b8860b]/60 flex items-center justify-center text-[#d4a017] font-bold text-lg font-serif">
                  {logoLetter}
                </div>
              )}
              <div className="flex flex-col leading-tight">
                <span className={`font-serif font-bold text-xl tracking-wide ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  {firstNamePart}
                </span>
                {remainingNamePart ? (
                  <span className="text-[#b8860b] text-[9px] tracking-[0.25em] uppercase font-medium -mt-0.5">
                    {remainingNamePart}
                  </span>
                ) : company?.tagline ? (
                  <span className="text-[#b8860b] text-[9px] tracking-[0.2em] uppercase font-medium -mt-0.5">
                    {company.tagline}
                  </span>
                ) : null}
              </div>
            </div>
            <p className={`text-sm leading-relaxed mb-5 max-w-xs ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
              {company?.description || 'Premium clothing for every occasion — crafted with passion, delivered with care. Elevating modern fashion, one garment at a time.'}
            </p>
            {/* Social Icons */}
            <div className="flex gap-2.5">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`w-9 h-9 border border-[#b8860b]/20 flex items-center justify-center transition-all duration-300 ${isDark
                    ? 'text-neutral-500 hover:text-[#d4a017] hover:border-[#b8860b]'
                    : 'text-neutral-500 hover:text-[#8b6508] hover:border-[#8b6508]'
                    } hover:bg-[#b8860b]/10`}
                >
                  <social.icon />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={`font-serif font-semibold mb-4 tracking-wide ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Quick Links
            </h4>
            <div className="flex flex-col gap-2.5">
              {footerLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleClick(e, link.href)}
                  className={`text-sm transition-all w-fit flex items-center gap-2 group ${isDark ? 'text-neutral-500 hover:text-[#d4a017]' : 'text-neutral-500 hover:text-[#8b6508]'
                    }`}
                >
                  <span className="w-0 group-hover:w-3 h-px bg-[#b8860b] transition-all duration-300" />
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className={`font-serif font-semibold mb-4 tracking-wide ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Contact
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2.5 text-sm transition-colors ${isDark ? 'text-neutral-500 hover:text-green-400' : 'text-neutral-500 hover:text-green-600'}`}
              >
                <MessageCircle size={13} />
                +92 325 6232379
              </a>
              <a
                href="mailto:zohaibafzal4566@gmail.com"
                className={`flex items-center gap-2.5 text-sm transition-colors ${isDark ? 'text-neutral-500 hover:text-[#d4a017]' : 'text-neutral-500 hover:text-[#8b6508]'}`}
              >
                <Mail size={13} />
                zohaibafzal4566@gmail.com
              </a>
              <div className={`flex items-center gap-2.5 text-sm ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
                <MapPin size={13} className="text-[#b8860b]" />
                Faisalabad, Pakistan
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 ${isDark ? 'border-[#b8860b]/10' : 'border-[#b8860b]/15'}`}>
          <p className={`text-xs tracking-wide ${isDark ? 'text-neutral-600' : 'text-neutral-500'}`}>
            &copy; {new Date().getFullYear()} {companyName}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className={isDark ? 'text-neutral-500' : 'text-neutral-500'}>
              Developed by <strong className="text-[#d4a017] font-semibold">Zaid Bin Athar</strong>
            </span>
            <span className="text-neutral-600">·</span>
            <a
              href="https://wa.me/923256232379"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#b8860b] hover:text-[#d4a017] hover:underline transition-colors"
            >
              +92 325 6232379
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
