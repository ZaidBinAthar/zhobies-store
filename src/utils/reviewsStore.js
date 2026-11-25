import { getLocalProducts, saveLocalProducts } from './productsStore'

const REVIEWS_STORAGE_KEY = 'zhobies_product_reviews_v1'

const DEFAULT_REVIEWS = {
  // Product 4: Executive Navy Suit
  4: [
    {
      id: 'rev-4-1',
      author: 'Shahid Mehmood',
      city: 'Islamabad',
      rating: 5,
      date: 'November 18, 2026',
      title: 'Savile Row quality at Pakistani bespoke price',
      comment: 'The half-canvas chest piece molds naturally to my shoulders. Wore this to an international symposium and received numerous compliments on the lapel roll and wool drape.',
      verified: true,
      fit: 'True to Size',
      helpfulCount: 14,
    },
    {
      id: 'rev-4-2',
      author: 'Daniyal Qureshi',
      city: 'Lahore',
      rating: 5,
      date: 'November 05, 2026',
      title: 'Precision cut and breathable interior lining',
      comment: 'The Bemberg lining makes it comfortable even during prolonged wear. Pants waistband construction with side adjusters is top-tier.',
      verified: true,
      fit: 'True to Size',
      helpfulCount: 9,
    },
    {
      id: 'rev-4-3',
      author: 'Kamran Ali',
      city: 'Karachi',
      rating: 5,
      date: 'October 24, 2026',
      title: 'Flawless formal tailoring',
      comment: 'Delivered in a luxury dust bag with natural horn buttons. Sizing matched the measurement chart to the fraction of an inch.',
      verified: true,
      fit: 'True to Size',
      helpfulCount: 6,
    },
  ],

  // Product 5: Classic Cream Hoodie Set
  5: [
    {
      id: 'rev-5-1',
      author: 'Bilal Hassan',
      city: 'Faisalabad',
      rating: 5,
      date: 'November 14, 2026',
      title: 'Heavyweight fleece with clean luxury silhouette',
      comment: 'Super soft brushed fleece interior and structured double-layered hood. Does not shrink or fade after multiple delicate washes.',
      verified: true,
      fit: 'True to Size',
      helpfulCount: 11,
    },
    {
      id: 'rev-5-2',
      author: 'Zain Ul Abideen',
      city: 'Rawalpindi',
      rating: 5,
      date: 'November 01, 2026',
      title: 'Great streetwear staple',
      comment: 'Minimalist cream tone with subtle bespoke embroidery. The jogger cuffs fit cleanly around Chelsea boots and sneakers.',
      verified: true,
      fit: 'True to Size',
      helpfulCount: 7,
    },
  ],

  // Product 6: Royal Embroidered Kurta
  6: [
    {
      id: 'rev-6-1',
      author: 'Hamza Farooq',
      city: 'Multan',
      rating: 5,
      date: 'November 20, 2026',
      title: 'Intricate needlework and rich royal color',
      comment: 'Wore this for a close cousin’s Mehndi. The hand embroidery on the neckline and cuffs is refined and never scratchy. Cotton-silk fabric has an elegant sheen.',
      verified: true,
      fit: 'True to Size',
      helpfulCount: 18,
    },
    {
      id: 'rev-6-2',
      author: 'Omer Aslam',
      city: 'Lahore',
      rating: 5,
      date: 'November 09, 2026',
      title: 'Pure heritage feel with modern comfort',
      comment: 'Mandarin collar stands crisp and buttons are durable. Best ethnic wear purchase this season.',
      verified: true,
      fit: 'True to Size',
      helpfulCount: 8,
    },
  ],
}

function getAllStoredReviews() {
  try {
    const raw = localStorage.getItem(REVIEWS_STORAGE_KEY)
    if (raw) {
      return JSON.parse(raw)
    }
  } catch (err) {
    console.error('Error reading reviews from localStorage:', err)
  }
  return DEFAULT_REVIEWS
}

function saveStoredReviews(reviewsData) {
  try {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviewsData))
    window.dispatchEvent(new CustomEvent('reviews_updated'))
  } catch (err) {
    console.error('Error saving reviews to localStorage:', err)
  }
}

/**
 * Returns all reviews for a specific product ID
 */
export function getProductReviews(productId) {
  const all = getAllStoredReviews()
  const key = String(productId)
  if (all[key] && Array.isArray(all[key])) {
    return all[key]
  }

  // Fallback generic reviews if product is newly created without preset reviews
  return [
    {
      id: `rev-gen-${productId}-1`,
      author: 'Verified Sartorial Client',
      city: 'Pakistan',
      rating: 5,
      date: 'Recent Order',
      title: 'Exceptional craft and bespoke attention to detail',
      comment: 'Fabric drape and tailoring precision exceeded expectations. The master cutting and finishing reflect authentic atelier quality.',
      verified: true,
      fit: 'True to Size',
      helpfulCount: 4,
    },
  ]
}

/**
 * Adds a new review, recalculates product rating & review count, and persists
 */
export function addProductReview(productId, review) {
  const all = getAllStoredReviews()
  const key = String(productId)
  const existing = all[key] || getProductReviews(productId)

  const newReview = {
    id: `rev-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    author: review.author.trim() || 'Anonymous Connoisseur',
    city: review.city?.trim() || 'Pakistan',
    rating: Number(review.rating) || 5,
    date: new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    title: review.title.trim() || 'Exemplary Bespoke Piece',
    comment: review.comment.trim(),
    verified: true,
    fit: review.fit || 'True to Size',
    helpfulCount: 0,
  }

  const updatedReviews = [newReview, ...existing]
  all[key] = updatedReviews
  saveStoredReviews(all)

  // Recalculate average rating & review count in productsStore
  try {
    const products = getLocalProducts()
    const targetProduct = products.find((p) => String(p.id) === key)
    if (targetProduct) {
      const totalScore = updatedReviews.reduce((sum, r) => sum + r.rating, 0)
      const avgRating = Number((totalScore / updatedReviews.length).toFixed(1))
      targetProduct.rating = avgRating
      targetProduct.reviews = updatedReviews.length
      saveLocalProducts(products)
    }
  } catch (err) {
    console.warn('Could not sync review rating with product store:', err)
  }

  return newReview
}

/**
 * Toggles helpful vote for a review
 */
export function toggleHelpfulVote(productId, reviewId) {
  const all = getAllStoredReviews()
  const key = String(productId)
  if (!all[key]) return

  const votedKey = `voted_rev_${reviewId}`
  const hasVoted = localStorage.getItem(votedKey)

  all[key] = all[key].map((r) => {
    if (r.id === reviewId) {
      const change = hasVoted ? -1 : 1
      return { ...r, helpfulCount: Math.max(0, (r.helpfulCount || 0) + change) }
    }
    return r
  })

  if (hasVoted) {
    localStorage.removeItem(votedKey)
  } else {
    localStorage.setItem(votedKey, 'true')
  }

  saveStoredReviews(all)
}

/**
 * Generates rating statistics and distribution percentages
 */
export function getReviewsSummary(productId) {
  const reviews = getProductReviews(productId)
  const total = reviews.length

  if (total === 0) {
    return {
      average: 5.0,
      total: 0,
      breakdown: { 5: 100, 4: 0, 3: 0, 2: 0, 1: 0 },
      counts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      fitBreakdown: { 'True to Size': 100, 'Runs Small': 0, 'Runs Large': 0 },
    }
  }

  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  const fitCounts = { 'True to Size': 0, 'Runs Small': 0, 'Runs Large': 0 }
  let sumScore = 0

  reviews.forEach((r) => {
    const star = Math.min(5, Math.max(1, Math.round(r.rating)))
    counts[star] = (counts[star] || 0) + 1
    sumScore += r.rating

    const fitKey = r.fit || 'True to Size'
    fitCounts[fitKey] = (fitCounts[fitKey] || 0) + 1
  })

  const average = Number((sumScore / total).toFixed(1))

  const breakdown = {
    5: Math.round((counts[5] / total) * 100),
    4: Math.round((counts[4] / total) * 100),
    3: Math.round((counts[3] / total) * 100),
    2: Math.round((counts[2] / total) * 100),
    1: Math.round((counts[1] / total) * 100),
  }

  const fitBreakdown = {
    'True to Size': Math.round(((fitCounts['True to Size'] || 0) / total) * 100),
    'Runs Small': Math.round(((fitCounts['Runs Small'] || 0) / total) * 100),
    'Runs Large': Math.round(((fitCounts['Runs Large'] || 0) / total) * 100),
  }

  return {
    average,
    total,
    counts,
    breakdown,
    fitBreakdown,
  }
}
