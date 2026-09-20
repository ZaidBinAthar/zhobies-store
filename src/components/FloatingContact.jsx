import { MessageCircle } from 'lucide-react'

const WHATSAPP_NUMBER = '923256232379'

export default function FloatingContact() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:scale-110 transition-all duration-300"
    >
      <MessageCircle size={24} />
    </a>
  )
}
