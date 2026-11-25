import { useState, useRef, useEffect } from 'react'
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  X,
  Sparkles,
  Move
} from 'lucide-react'

export default function ImageZoomViewer({
  src,
  alt = 'Product Image',
  className = '',
  badge = null,
  zoomScale = 2.4
}) {
  // Inline hover zoom state
  const [isHovered, setIsHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const containerRef = useRef(null)

  // Fullscreen Lightbox state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [lightboxScale, setLightboxScale] = useState(1.5)
  const [panPos, setPanPos] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef({ x: 0, y: 0, initialPanX: 0, initialPanY: 0 })

  // Handle inline hover movement
  const handleMouseMove = (e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100))
    setMousePos({ x, y })
  }

  // Handle Lightbox keyboard shortcuts (Esc to close, +/- to zoom)
  useEffect(() => {
    if (!isLightboxOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false)
      } else if (e.key === '+' || e.key === '=') {
        setLightboxScale((prev) => Math.min(prev + 0.5, 4))
      } else if (e.key === '-' || e.key === '_') {
        setLightboxScale((prev) => Math.max(prev - 0.5, 1))
      } else if (e.key === '0') {
        setLightboxScale(1)
        setPanPos({ x: 0, y: 0 })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLightboxOpen])

  // Dragging in Lightbox
  const handleMouseDown = (e) => {
    if (lightboxScale <= 1) return
    setIsDragging(true)
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialPanX: panPos.x,
      initialPanY: panPos.y
    }
  }

  const handleDragMove = (e) => {
    if (!isDragging) return
    const deltaX = e.clientX - dragStartRef.current.x
    const deltaY = e.clientY - dragStartRef.current.y
    setPanPos({
      x: dragStartRef.current.initialPanX + deltaX,
      y: dragStartRef.current.initialPanY + deltaY
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const resetLightbox = () => {
    setLightboxScale(1)
    setPanPos({ x: 0, y: 0 })
  }

  return (
    <>
      {/* ── Inline Hover Magnifier Container ── */}
      <div
        ref={containerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        onClick={() => setIsLightboxOpen(true)}
        className={`relative overflow-hidden cursor-crosshair select-none bg-neutral-950 ${className}`}
        title="Click to open HD Fabric Inspector"
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover object-top transition-transform duration-200 ease-out will-change-transform"
          style={
            isHovered
              ? {
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                  transform: `scale(${zoomScale})`
                }
              : {
                  transformOrigin: 'center center',
                  transform: 'scale(1)'
                }
          }
        />

        {/* Badge Overlay */}
        {badge && (
          <span className="absolute top-3 left-3 px-3 py-1 bg-[#b8860b] text-white text-[10px] uppercase font-bold tracking-widest shadow-md z-10 pointer-events-none">
            {badge}
          </span>
        )}

        {/* Floating Zoom Indicator & Expand Button */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsLightboxOpen(true)
            }}
            className="p-1.5 bg-black/75 hover:bg-[#b8860b] text-white border border-[#b8860b]/40 backdrop-blur-sm transition-all shadow-lg"
            title="Open Fullscreen Fabric Inspector"
            aria-label="Expand image"
          >
            <Maximize2 size={13} />
          </button>
        </div>

        {/* Bottom Helper Bar */}
        <div
          className={`absolute bottom-0 inset-x-0 py-1.5 px-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-between transition-opacity duration-300 pointer-events-none ${
            isHovered ? 'opacity-30' : 'opacity-100'
          }`}
        >
          <div className="flex items-center gap-1.5 text-[10px] text-neutral-300 tracking-wider uppercase font-medium">
            <ZoomIn size={12} className="text-[#d4a017]" />
            <span>Hover to Inspect Weave</span>
          </div>
          <span className="text-[9px] text-[#d4a017] uppercase tracking-wider font-semibold">
            Click for HD View
          </span>
        </div>
      </div>

      {/* ── Fullscreen High-Definition Lightbox Modal ── */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col justify-between animate-fade-in select-none"
          onMouseMove={handleDragMove}
          onMouseUp={handleMouseUp}
        >
          {/* Lightbox Header */}
          <div className="p-4 sm:p-6 border-b border-[#b8860b]/20 flex items-center justify-between bg-black/60 backdrop-blur-md z-20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border border-[#b8860b]/50 text-[#d4a017] flex items-center justify-center font-serif text-sm">
                Z
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-[#b8860b] font-medium">
                  Atelier HD Fabric Inspector
                </div>
                <h4 className="text-white font-serif text-sm sm:text-base font-semibold truncate max-w-xs sm:max-w-md">
                  {alt}
                </h4>
              </div>
            </div>

            {/* Controls Bar */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1 bg-neutral-900/90 border border-[#b8860b]/30 px-2 py-1 text-xs text-neutral-300">
                <button
                  onClick={() => setLightboxScale((s) => Math.max(s - 0.5, 1))}
                  disabled={lightboxScale <= 1}
                  className="p-1 hover:text-[#d4a017] disabled:opacity-30 transition-colors"
                  title="Zoom Out (-)"
                >
                  <ZoomOut size={15} />
                </button>

                <span className="px-2 font-mono text-[11px] text-[#d4a017] font-semibold min-w-[42px] text-center">
                  {Math.round(lightboxScale * 100)}%
                </span>

                <button
                  onClick={() => setLightboxScale((s) => Math.min(s + 0.5, 4))}
                  disabled={lightboxScale >= 4}
                  className="p-1 hover:text-[#d4a017] disabled:opacity-30 transition-colors"
                  title="Zoom In (+)"
                >
                  <ZoomIn size={15} />
                </button>

                <div className="w-px h-4 bg-neutral-700 mx-1" />

                <button
                  onClick={resetLightbox}
                  className="p-1 hover:text-[#d4a017] transition-colors flex items-center gap-1 text-[11px]"
                  title="Reset Zoom (0)"
                >
                  <RotateCcw size={12} />
                  <span>Reset</span>
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="p-2 border border-[#b8860b]/40 text-neutral-300 hover:text-white hover:border-[#d4a017] hover:bg-[#b8860b]/10 transition-all cursor-pointer"
                aria-label="Close Inspector"
                title="Close (Esc)"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Lightbox Canvas Area */}
          <div
            className="flex-1 relative overflow-hidden flex items-center justify-center p-4 cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onDoubleClick={() => {
              if (lightboxScale > 1) {
                resetLightbox()
              } else {
                setLightboxScale(2.5)
              }
            }}
          >
            <div
              className="transition-transform duration-100 ease-out will-change-transform max-w-full max-h-full flex items-center justify-center"
              style={{
                transform: `translate(${panPos.x}px, ${panPos.y}px) scale(${lightboxScale})`
              }}
            >
              <img
                src={src}
                alt={alt}
                draggable={false}
                className="max-h-[78vh] max-w-[85vw] object-contain shadow-2xl border border-[#b8860b]/30"
              />
            </div>
          </div>

          {/* Lightbox Footer Guide */}
          <div className="p-3 sm:p-4 border-t border-[#b8860b]/20 bg-black/60 backdrop-blur-md flex flex-wrap items-center justify-between text-[11px] text-neutral-400 gap-2 z-20">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-[#d4a017]">
                <Sparkles size={12} />
                <span>Super 150s & High-Definition Textile Detail</span>
              </span>
              <span className="hidden md:inline text-neutral-500">·</span>
              <span className="hidden md:inline">
                Drag mouse to pan · Double-click to toggle zoom · Press <kbd className="px-1.5 py-0.5 border border-neutral-700 bg-neutral-900 text-white rounded text-[10px]">ESC</kbd> to exit
              </span>
            </div>

            {/* Mobile Zoom Controls */}
            <div className="flex sm:hidden items-center gap-2">
              <button
                onClick={() => setLightboxScale((s) => Math.max(s - 0.5, 1))}
                className="p-1.5 border border-neutral-700 text-white"
              >
                <ZoomOut size={14} />
              </button>
              <span className="font-mono text-xs text-[#d4a017]">
                {Math.round(lightboxScale * 100)}%
              </span>
              <button
                onClick={() => setLightboxScale((s) => Math.min(s + 0.5, 3.5))}
                className="p-1.5 border border-neutral-700 text-white"
              >
                <ZoomIn size={14} />
              </button>
              <button
                onClick={resetLightbox}
                className="p-1.5 border border-neutral-700 text-white"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
