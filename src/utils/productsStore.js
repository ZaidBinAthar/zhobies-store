import { API_CONFIG } from '../config/api'

// Initial fallback products seeded in Neon database as well
export const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: 'Executive Navy Suit',
    category: 'Formal',
    price: 'PKR 8,500',
    badge: 'Bestseller',
    colors: ['#1a237e', '#37474f', '#212121'],
    image: '/collection-formal.jpg',
    rating: 5,
    reviews: 42,
    description: 'Expertly tailored three-piece formal suit crafted from fine wool blend. Includes customized sizing options and breathable interior lining.',
    inStock: true,
  },
  {
    id: 2,
    name: 'Classic Cream Hoodie Set',
    category: 'Casual',
    price: 'PKR 3,200',
    badge: 'New',
    colors: ['#f5f0e8', '#37474f', '#795548'],
    image: '/collection-casual.jpg',
    rating: 5,
    reviews: 28,
    description: 'Ultra-soft fleece hoodie and jogger combo designed for everyday comfort and modern streetwear fashion.',
    inStock: true,
  },
  {
    id: 3,
    name: 'Royal Embroidered Kurta',
    category: 'Traditional',
    price: 'PKR 5,800',
    badge: 'Premium',
    colors: ['#1a237e', '#4a148c', '#006064'],
    image: '/collection-traditional.jpg',
    rating: 5,
    reviews: 65,
    description: 'Intricately embroidered festive kurta made with pure cotton-silk fabric for formal events and celebrations.',
    inStock: true,
  },
]

const STORAGE_KEY = 'zohaibies_store_products_cache'

export function getLocalProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (e) {
    console.error('Error reading cached products', e)
  }
  return DEFAULT_PRODUCTS
}

export function saveLocalProducts(products) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
    // Dispatch custom event so other components update synchronously
    window.dispatchEvent(new Event('products_updated'))
  } catch (e) {
    console.error('Error caching products', e)
  }
}

// Fetch products from Neon API with automatic fallback
export async function fetchProducts() {
  try {
    const res = await fetch(API_CONFIG.products)
    if (res.ok) {
      const data = await res.json()
      if (data.data && Array.isArray(data.data) && data.data.length > 0) {
        saveLocalProducts(data.data)
        return data.data
      }
    }
  } catch (err) {
    console.warn('Neon products endpoint not reachable, using local storage cache:', err)
  }
  return getLocalProducts()
}

// Add a product (Neon API + local fallback)
export async function addProduct(productData) {
  const localList = getLocalProducts()
  const newProduct = {
    ...productData,
    id: Date.now(),
    createdAt: new Date().toISOString(),
  }

  try {
    const res = await fetch(API_CONFIG.products, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    })
    if (res.ok) {
      const result = await res.json()
      if (result.data) {
        newProduct.id = result.data.id
      }
    }
  } catch (err) {
    console.warn('Backend sync failed, saved locally:', err)
  }

  const updated = [newProduct, ...localList]
  saveLocalProducts(updated)
  return newProduct
}

// Update a product (Neon API + local fallback)
export async function updateProduct(id, updatedFields) {
  const localList = getLocalProducts()
  const updated = localList.map((p) =>
    p.id === id ? { ...p, ...updatedFields } : p
  )
  saveLocalProducts(updated)

  try {
    await fetch(API_CONFIG.products, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updatedFields }),
    })
  } catch (err) {
    console.warn('Backend sync failed, updated locally:', err)
  }

  return updated
}

// Delete a product (Neon API + local fallback)
export async function deleteProduct(id) {
  const localList = getLocalProducts()
  const updated = localList.filter((p) => p.id !== id)
  saveLocalProducts(updated)

  try {
    await fetch(`${API_CONFIG.products}?id=${id}`, {
      method: 'DELETE',
    })
  } catch (err) {
    console.warn('Backend sync failed, deleted locally:', err)
  }

  return updated
}
