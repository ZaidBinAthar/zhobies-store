import { neon } from '@neondatabase/serverless'

const NEON_CONNECTION_STRING =
  import.meta.env.VITE_NEON_DATABASE_URL ||
  import.meta.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_2hZz7JxsHWrS@ep-hidden-frog-azmbsupu-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

const sql = neon(NEON_CONNECTION_STRING)

export const DEFAULT_COMPANY_ID = 1

export const DEFAULT_COMPANY = {
  id: DEFAULT_COMPANY_ID,
  name: 'Zhobies Wear',
  tagline: 'Premium Clothing & Tailoring',
  logoUrl: '',
  phone: '+92 300 1234567',
  email: 'zhobieswear@gmail.com',
  address: 'Commercial Market, Lahore, Pakistan',
  description: 'Premium clothing for every occasion — crafted with passion, delivered with care. Elevating modern fashion, one garment at a time.'
}

const STORAGE_KEY = 'company_settings_cache'

export function getLocalCompany() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && parsed.name) {
        return { ...DEFAULT_COMPANY, ...parsed }
      }
    }
  } catch (e) {
    console.error('Error reading cached company settings', e)
  }
  return DEFAULT_COMPANY
}

export function saveLocalCompany(company) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(company))
    window.dispatchEvent(new CustomEvent('company_updated', { detail: company }))
  } catch (e) {
    console.error('Error caching company settings', e)
  }
}

let tableChecked = false
export async function ensureCompanyTable() {
  if (tableChecked) return
  try {
    await sql.query(`
      CREATE TABLE IF NOT EXISTS company (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        tagline VARCHAR(255),
        logo_url TEXT,
        phone VARCHAR(100),
        email VARCHAR(255),
        address TEXT,
        description TEXT,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `)
    tableChecked = true
  } catch (err) {
    console.warn('Could not verify Company table structure in Neon:', err)
  }
}

// Fetch company by companyId (default = 1)
export async function fetchCompany(companyId = DEFAULT_COMPANY_ID) {
  try {
    await ensureCompanyTable()
    const rows = await sql.query(
      `SELECT id, name, tagline, logo_url, phone, email, address, description, updated_at 
       FROM company 
       WHERE id = $1 
       LIMIT 1`,
      [companyId]
    )

    if (Array.isArray(rows) && rows.length > 0) {
      const row = rows[0]
      const companyData = {
        id: row.id,
        name: row.name || DEFAULT_COMPANY.name,
        tagline: row.tagline || '',
        logoUrl: row.logo_url || '',
        phone: row.phone || '',
        email: row.email || '',
        address: row.address || '',
        description: row.description || '',
        updatedAt: row.updated_at
      }
      saveLocalCompany(companyData)
      return companyData
    } else {
      // If no row exists yet for this companyId, insert default row
      try {
        const inserted = await sql.query(
          `INSERT INTO company (id, name, tagline, logo_url, phone, email, address, description)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name
           RETURNING id, name, tagline, logo_url, phone, email, address, description, updated_at`,
          [
            companyId,
            DEFAULT_COMPANY.name,
            DEFAULT_COMPANY.tagline,
            DEFAULT_COMPANY.logoUrl,
            DEFAULT_COMPANY.phone,
            DEFAULT_COMPANY.email,
            DEFAULT_COMPANY.address,
            DEFAULT_COMPANY.description
          ]
        )
        if (inserted && inserted.length > 0) {
          const row = inserted[0]
          const companyData = {
            id: row.id,
            name: row.name,
            tagline: row.tagline,
            logoUrl: row.logo_url,
            phone: row.phone,
            email: row.email,
            address: row.address,
            description: row.description,
            updatedAt: row.updated_at
          }
          saveLocalCompany(companyData)
          return companyData
        }
      } catch (insertErr) {
        console.warn('Initial company row creation in DB skipped:', insertErr)
      }
    }
  } catch (err) {
    console.warn('Neon company query failed, falling back to local cache:', err)
  }

  return getLocalCompany()
}

// Update or Upsert Company by companyId
export async function updateCompany(companyId, updateData) {
  const current = getLocalCompany()
  const payload = {
    ...current,
    ...updateData,
    id: companyId || current.id || DEFAULT_COMPANY_ID
  }

  // Optimistically save locally immediately
  saveLocalCompany(payload)

  try {
    await ensureCompanyTable()
    const rows = await sql.query(
      `INSERT INTO company (id, name, tagline, logo_url, phone, email, address, description, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
       ON CONFLICT (id) DO UPDATE 
       SET name = EXCLUDED.name,
           tagline = EXCLUDED.tagline,
           logo_url = EXCLUDED.logo_url,
           phone = EXCLUDED.phone,
           email = EXCLUDED.email,
           address = EXCLUDED.address,
           description = EXCLUDED.description,
           updated_at = NOW()
       RETURNING id, name, tagline, logo_url, phone, email, address, description, updated_at`,
      [
        payload.id,
        payload.name || DEFAULT_COMPANY.name,
        payload.tagline || '',
        payload.logoUrl || '',
        payload.phone || '',
        payload.email || '',
        payload.address || '',
        payload.description || ''
      ]
    )

    if (rows && rows.length > 0) {
      const saved = rows[0]
      const result = {
        id: saved.id,
        name: saved.name,
        tagline: saved.tagline,
        logoUrl: saved.logo_url,
        phone: saved.phone,
        email: saved.email,
        address: saved.address,
        description: saved.description,
        updatedAt: saved.updated_at
      }
      saveLocalCompany(result)
      return { success: true, data: result }
    }
  } catch (err) {
    console.warn('Direct Neon update for company failed, cached locally:', err)
  }

  return { success: true, data: payload, offline: true }
}

