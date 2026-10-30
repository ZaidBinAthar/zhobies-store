import { neon } from '@neondatabase/serverless'

const NEON_CONNECTION_STRING =
  import.meta.env.VITE_NEON_DATABASE_URL ||
  import.meta.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_2hZz7JxsHWrS@ep-hidden-frog-azmbsupu-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

// Initialize serverless neon client directly for client-side universal syncing
const sql = neon(NEON_CONNECTION_STRING)

export const DEFAULT_PRODUCTS = [
  {
    id: 4,
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
    id: 5,
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
    id: 6,
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
    window.dispatchEvent(new Event('products_updated'))
  } catch (e) {
    console.error('Error caching products', e)
  }
}

// Ensure the products table exists in Neon
let tableChecked = false
async function ensureNeonTable() {
  if (tableChecked) return
  try {
    await sql.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        price VARCHAR(100) NOT NULL,
        badge VARCHAR(50),
        colors TEXT[],
        image TEXT,
        rating NUMERIC(2,1) DEFAULT 5.0,
        reviews INT DEFAULT 0,
        description TEXT,
        in_stock BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `)
    tableChecked = true
  } catch (err) {
    console.warn('Could not verify Neon table structure:', err)
  }
}

// 1. UNIVERSAL FETCH: Fetches directly from Neon PostgreSQL
export async function fetchProducts() {
  try {
    await ensureNeonTable()
    const rows = await sql.query(
      `SELECT id, name, category, price, badge, colors, image, rating, reviews, description, in_stock, created_at FROM products ORDER BY id ASC`
    )

    if (Array.isArray(rows) && rows.length > 0) {
      const formatted = rows.map((r) => ({
        id: r.id,
        name: r.name,
        category: r.category,
        price: r.price,
        badge: r.badge || '',
        colors: Array.isArray(r.colors) ? r.colors : [],
        image: r.image || '/collection-formal.jpg',
        rating: Number(r.rating) || 5,
        reviews: Number(r.reviews) || 0,
        description: r.description || '',
        inStock: r.in_stock !== false,
        createdAt: r.created_at,
      }))
      saveLocalProducts(formatted)
      return formatted
    }
  } catch (err) {
    console.warn('Neon direct query failed, falling back to local cache:', err)
  }
  return getLocalProducts()
}

// 2. UNIVERSAL ADD: Inserts directly into Neon PostgreSQL
export async function addProduct(productData) {
  await ensureNeonTable()
  const name = productData.name
  const category = productData.category
  const price = productData.price
  const badge = productData.badge || ''
  const colors = Array.isArray(productData.colors) ? productData.colors : []
  const image = productData.image || '/collection-formal.jpg'
  const rating = Number(productData.rating) || 5.0
  const reviews = Number(productData.reviews) || 0
  const description = productData.description || ''
  const inStock = productData.inStock !== false

  try {
    const rows = await sql.query(
      `INSERT INTO products (name, category, price, badge, colors, image, rating, reviews, description, in_stock)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id, name, category, price, badge, colors, image, rating, reviews, description, in_stock, created_at`,
      [name, category, price, badge, colors, image, rating, reviews, description, inStock]
    )

    if (rows && rows.length > 0) {
      const saved = rows[0]
      const newProduct = {
        id: saved.id,
        name: saved.name,
        category: saved.category,
        price: saved.price,
        badge: saved.badge || '',
        colors: Array.isArray(saved.colors) ? saved.colors : [],
        image: saved.image || '/collection-formal.jpg',
        rating: Number(saved.rating) || 5,
        reviews: Number(saved.reviews) || 0,
        description: saved.description || '',
        inStock: saved.in_stock !== false,
        createdAt: saved.created_at,
      }
      const localList = getLocalProducts().filter((p) => p.id !== newProduct.id)
      saveLocalProducts([newProduct, ...localList])
      return newProduct
    }
  } catch (err) {
    console.error('Failed to insert product into Neon:', err)
  }

  // Fallback local addition if network offline
  const fallback = {
    ...productData,
    id: Date.now(),
    createdAt: new Date().toISOString(),
  }
  saveLocalProducts([fallback, ...getLocalProducts()])
  return fallback
}

// 3. UNIVERSAL UPDATE: Updates directly in Neon PostgreSQL
export async function updateProduct(id, updatedFields) {
  await ensureNeonTable()
  try {
    const currentList = getLocalProducts()
    const current = currentList.find((p) => p.id === id) || {}
    const merged = { ...current, ...updatedFields }

    const colors = Array.isArray(merged.colors) ? merged.colors : []
    const image = merged.image || '/collection-formal.jpg'
    const rating = Number(merged.rating) || 5.0
    const reviews = Number(merged.reviews) || 0
    const inStock = merged.inStock !== false

    await sql.query(
      `UPDATE products
       SET name = $1, category = $2, price = $3, badge = $4, colors = $5, image = $6, rating = $7, reviews = $8, description = $9, in_stock = $10
       WHERE id = $11`,
      [
        merged.name,
        merged.category,
        merged.price,
        merged.badge || '',
        colors,
        image,
        rating,
        reviews,
        merged.description || '',
        inStock,
        id,
      ]
    )

    const updated = currentList.map((p) => (p.id === id ? merged : p))
    saveLocalProducts(updated)
    return updated
  } catch (err) {
    console.error('Failed to update product in Neon:', err)
    const localList = getLocalProducts()
    const updated = localList.map((p) =>
      p.id === id ? { ...p, ...updatedFields } : p
    )
    saveLocalProducts(updated)
    return updated
  }
}

// 4. UNIVERSAL DELETE: Deletes directly from Neon PostgreSQL
export async function deleteProduct(id) {
  await ensureNeonTable()
  try {
    await sql.query(`DELETE FROM products WHERE id = $1`, [id])
  } catch (err) {
    console.error('Failed to delete product from Neon:', err)
  }

  const localList = getLocalProducts()
  const updated = localList.filter((p) => p.id !== id)
  saveLocalProducts(updated)
  return updated
}
