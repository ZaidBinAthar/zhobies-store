import { useState, useEffect } from 'react'
import {
  Star,
  CheckCircle2,
  ThumbsUp,
  MessageSquarePlus,
  X,
  Sparkles,
  Filter,
  UserCheck
} from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import {
  getProductReviews,
  addProductReview,
  toggleHelpfulVote,
  getReviewsSummary
} from '../utils/reviewsStore'

export default function ProductReviews({ productId, productName }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const [reviews, setReviews] = useState(() => getProductReviews(productId))
  const [summary, setSummary] = useState(() => getReviewsSummary(productId))
  const [filterStar, setFilterStar] = useState('all') // 'all', 5, 4, 3, 2, 1
  const [isWriting, setIsWriting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // New review form fields
  const [formRating, setFormRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [authorName, setAuthorName] = useState('')
  const [authorCity, setAuthorCity] = useState('')
  const [fit, setFit] = useState('True to Size')
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')

  useEffect(() => {
    const refresh = () => {
      setReviews(getProductReviews(productId))
      setSummary(getReviewsSummary(productId))
    }
    refresh()
    window.addEventListener('reviews_updated', refresh)
    return () => window.removeEventListener('reviews_updated', refresh)
  }, [productId])

  const handleHelpful = (reviewId) => {
    toggleHelpfulVote(productId, reviewId)
    setReviews(getProductReviews(productId))
  }

  const handleSubmitReview = (e) => {
    e.preventDefault()
    if (!comment.trim() || !authorName.trim()) return

    addProductReview(productId, {
      author: authorName,
      city: authorCity,
      rating: formRating,
      fit,
      title: title || 'Exemplary Bespoke Garment',
      comment
    })

    setSubmitSuccess(true)
    setIsWriting(false)
    setAuthorName('')
    setAuthorCity('')
    setTitle('')
    setComment('')
    setFormRating(5)

    setTimeout(() => setSubmitSuccess(false), 5000)
  }

  // Filtered reviews
  const displayReviews = reviews.filter((r) => {
    if (filterStar === 'all') return true
    return Math.round(r.rating) === Number(filterStar)
  })

  const ratingLabels = {
    1: 'Needs Improvement',
    2: 'Fair',
    3: 'Good Quality',
    4: 'Very Impressive',
    5: 'Exceptional Sartorial Masterpiece'
  }

  return (
    <div className="pt-6 border-t border-[#b8860b]/20">
      {/* ── Summary & Breakdown Grid ── */}
      <div
        className={`p-5 sm:p-6 border mb-8 ${
          isDark
            ? 'bg-[#120f0c] border-[#b8860b]/20'
            : 'bg-[#faf8f5] border-[#b8860b]/20 shadow-sm'
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Big Score Box */}
          <div className="md:col-span-4 text-center md:border-r border-[#b8860b]/20 md:pr-6">
            <div className="text-4xl sm:text-5xl font-serif font-bold text-[#d4a017]">
              {summary.average}
            </div>
            <div className="flex items-center justify-center gap-1 my-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  className={
                    star <= Math.round(summary.average)
                      ? 'fill-[#d4a017] text-[#d4a017]'
                      : 'text-neutral-600'
                  }
                />
              ))}
            </div>
            <div className="text-xs text-neutral-500">
              Based on <strong className={isDark ? 'text-white' : 'text-neutral-900'}>{summary.total}</strong> bespoke reviews
            </div>
            <div className="mt-3 inline-block px-3 py-1 bg-[#b8860b]/10 text-[#d4a017] text-[10px] uppercase font-semibold tracking-wider border border-[#b8860b]/25">
              100% Verified Sartorial Clients
            </div>
          </div>

          {/* Star Progress Bars */}
          <div className="md:col-span-5 space-y-1.5">
            {[5, 4, 3, 2, 1].map((s) => {
              const pct = summary.breakdown[s] || 0
              const count = summary.counts[s] || 0
              return (
                <button
                  key={s}
                  onClick={() => setFilterStar(filterStar === s ? 'all' : s)}
                  className={`w-full flex items-center gap-3 text-xs group transition-colors text-left py-0.5 cursor-pointer ${
                    filterStar === s ? 'font-bold text-[#d4a017]' : 'text-neutral-400'
                  }`}
                >
                  <span className="w-12 text-[11px] shrink-0 group-hover:text-[#d4a017]">
                    {s} Stars
                  </span>
                  <div className="flex-1 h-2 bg-neutral-800/40 rounded-none overflow-hidden relative border border-[#b8860b]/15">
                    <div
                      className="h-full bg-gradient-to-r from-[#b8860b] to-[#d4a017] transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-10 text-[10px] text-neutral-500 text-right shrink-0">
                    {pct}% ({count})
                  </span>
                </button>
              )
            })}
          </div>

          {/* Fit Indicator & Call to Action */}
          <div className="md:col-span-3 text-center md:text-right flex flex-col justify-between h-full pt-4 md:pt-0 border-t md:border-t-0 border-[#b8860b]/20">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[#b8860b] font-medium">
                Sizing Consensus
              </div>
              <div className={`text-xs font-semibold mt-0.5 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                {summary.fitBreakdown['True to Size']}% True to Size
              </div>
              <div className="text-[10px] text-neutral-500 mt-1">
                Standard Pakistani & British Savile cuts
              </div>
            </div>

            <button
              onClick={() => setIsWriting(!isWriting)}
              className="mt-4 px-4 py-2.5 bg-[#b8860b] hover:bg-[#d4a017] text-white text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#b8860b]/20 cursor-pointer"
            >
              <MessageSquarePlus size={14} />
              <span>{isWriting ? 'Close Form' : 'Write a Review'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Success Toast ── */}
      {submitSuccess && (
        <div className="mb-6 p-4 border border-emerald-500/30 bg-emerald-500/10 flex items-center gap-3">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <div className="text-xs text-emerald-300">
            Thank you for your review! Your feedback has been published and incorporated into the bespoke rating.
          </div>
        </div>
      )}

      {/* ── Write Review Collapsible Form ── */}
      {isWriting && (
        <form
          onSubmit={handleSubmitReview}
          className={`p-6 border mb-8 animate-fade-in ${
            isDark ? 'bg-[#15120e] border-[#b8860b]/30' : 'bg-white border-[#b8860b]/30 shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#b8860b]/20">
            <h4 className={`font-serif font-bold text-base ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Share Your Sartorial Experience
            </h4>
            <button
              type="button"
              onClick={() => setIsWriting(false)}
              className="text-neutral-400 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>

          {/* Interactive Star Rating */}
          <div className="mb-4">
            <label className={`block text-[11px] uppercase tracking-wider mb-1.5 font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
              Overall Rating: <span className="text-[#d4a017] font-semibold">{ratingLabels[hoverRating || formRating]}</span>
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setFormRating(star)}
                  className="p-1 cursor-pointer transition-transform hover:scale-125"
                >
                  <Star
                    size={22}
                    className={
                      star <= (hoverRating || formRating)
                        ? 'fill-[#d4a017] text-[#d4a017]'
                        : 'text-neutral-600'
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className={`block text-[11px] uppercase tracking-wider mb-1 font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                Your Name *
              </label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. Tariq Mehmood"
                className={`w-full px-3 py-2 text-xs border focus:outline-none ${
                  isDark
                    ? 'bg-[#100d0a] border-[#b8860b]/20 text-white focus:border-[#d4a017]'
                    : 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:border-[#b8860b]'
                }`}
              />
            </div>

            <div>
              <label className={`block text-[11px] uppercase tracking-wider mb-1 font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                City / Region
              </label>
              <input
                type="text"
                value={authorCity}
                onChange={(e) => setAuthorCity(e.target.value)}
                placeholder="e.g. Lahore / Islamabad"
                className={`w-full px-3 py-2 text-xs border focus:outline-none ${
                  isDark
                    ? 'bg-[#100d0a] border-[#b8860b]/20 text-white focus:border-[#d4a017]'
                    : 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:border-[#b8860b]'
                }`}
              />
            </div>

            <div>
              <label className={`block text-[11px] uppercase tracking-wider mb-1 font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                Garment Fit
              </label>
              <select
                value={fit}
                onChange={(e) => setFit(e.target.value)}
                className={`w-full px-3 py-2 text-xs border focus:outline-none ${
                  isDark
                    ? 'bg-[#100d0a] border-[#b8860b]/20 text-white'
                    : 'bg-neutral-50 border-neutral-300 text-neutral-900'
                }`}
              >
                <option value="True to Size">True to Size</option>
                <option value="Runs Small">Runs Slightly Small</option>
                <option value="Runs Large">Runs Slightly Large</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className={`block text-[11px] uppercase tracking-wider mb-1 font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
              Review Headline
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Exceptional fabric quality and impeccable tailoring"
              className={`w-full px-3 py-2 text-xs border focus:outline-none ${
                isDark
                  ? 'bg-[#100d0a] border-[#b8860b]/20 text-white focus:border-[#d4a017]'
                  : 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:border-[#b8860b]'
              }`}
            />
          </div>

          <div className="mb-4">
            <label className={`block text-[11px] uppercase tracking-wider mb-1 font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
              Detailed Review *
            </label>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell other gentlemen about the fabric hand-feel, shoulder structure, buttonholes, or event experience..."
              className={`w-full px-3 py-2 text-xs border focus:outline-none resize-y ${
                isDark
                  ? 'bg-[#100d0a] border-[#b8860b]/20 text-white focus:border-[#d4a017]'
                  : 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:border-[#b8860b]'
              }`}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-[#b8860b] to-[#d4a017] text-[#0d0b09] font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all cursor-pointer"
            >
              Submit Bespoke Review
            </button>
            <button
              type="button"
              onClick={() => setIsWriting(false)}
              className="px-4 py-2.5 text-xs text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* ── Filter Bar ── */}
      <div className="flex items-center justify-between mb-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-neutral-500">Filter by:</span>
          {['all', 5, 4, 3].map((f) => (
            <button
              key={f}
              onClick={() => setFilterStar(f)}
              className={`px-2.5 py-1 text-[11px] uppercase tracking-wider border transition-colors cursor-pointer ${
                filterStar === f
                  ? 'border-[#b8860b] bg-[#b8860b]/15 text-[#d4a017] font-semibold'
                  : 'border-neutral-700 text-neutral-400 hover:text-white'
              }`}
            >
              {f === 'all' ? 'All Reviews' : `${f} Stars`}
            </button>
          ))}
        </div>
        <span className="text-[11px] text-neutral-500">
          Showing {displayReviews.length} of {reviews.length} reviews
        </span>
      </div>

      {/* ── Review Cards List ── */}
      <div className="space-y-4">
        {displayReviews.length === 0 ? (
          <div className="p-8 text-center text-xs text-neutral-500 border border-dashed border-[#b8860b]/20">
            No reviews match this star filter.
          </div>
        ) : (
          displayReviews.map((rev) => (
            <div
              key={rev.id}
              className={`p-5 border transition-all ${
                isDark ? 'bg-[#100d0a] border-[#b8860b]/15' : 'bg-white border-[#b8860b]/15 shadow-sm'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#b8860b]/15 border border-[#b8860b]/40 flex items-center justify-center text-[#d4a017] font-bold text-xs uppercase">
                    {rev.author.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                        {rev.author}
                      </span>
                      {rev.verified && (
                        <span className="flex items-center gap-0.5 text-[9px] text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-1.5 py-0.2 border border-emerald-500/20">
                          <CheckCircle2 size={10} /> Verified
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-neutral-500">
                      {rev.city} · {rev.date}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={12}
                        className={
                          s <= rev.rating
                            ? 'fill-[#d4a017] text-[#d4a017]'
                            : 'text-neutral-600'
                        }
                      />
                    ))}
                  </div>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-[#b8860b]/10 text-[#d4a017] border border-[#b8860b]/20">
                    Fit: {rev.fit}
                  </span>
                </div>
              </div>

              <h5 className={`font-serif font-bold text-sm mb-1 mt-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                {rev.title}
              </h5>

              <p className={`text-xs leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
                {rev.comment}
              </p>

              <div className="mt-3 pt-2 border-t border-[#b8860b]/10 flex items-center justify-between text-[11px] text-neutral-500">
                <span className="text-[10px] text-neutral-400">
                  Purchased for {productName}
                </span>

                <button
                  onClick={() => handleHelpful(rev.id)}
                  className="flex items-center gap-1.5 text-neutral-400 hover:text-[#d4a017] transition-colors cursor-pointer"
                >
                  <ThumbsUp size={12} />
                  <span>Helpful ({rev.helpfulCount || 0})</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
