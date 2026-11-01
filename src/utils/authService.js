import { neon } from '@neondatabase/serverless'
import { API_CONFIG } from '../config/api'

const NEON_CONNECTION_STRING =
  import.meta.env.VITE_NEON_DATABASE_URL ||
  import.meta.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_2hZz7JxsHWrS@ep-hidden-frog-azmbsupu-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

const sql = neon(NEON_CONNECTION_STRING)

const AUTH_USER_KEY = 'zvs_authenticated_user'

// Local SHA-256 fallback if direct Neon queries are made
async function sha256Hex(text) {
  const msgUint8 = new TextEncoder().encode(text)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Robust JSON fetch wrapper that guards against empty bodies and unexpected HTML responses
 */
async function safeFetchJson(url, options) {
  let res
  try {
    res = await fetch(url, options)
  } catch (netErr) {
    throw new Error(`Unable to reach the auth server: ${netErr.message || 'Network error'}`)
  }

  const rawText = await res.text()
  let data = null

  if (rawText && rawText.trim().length > 0) {
    try {
      data = JSON.parse(rawText)
    } catch {
      throw new Error(
        `Server responded with non-JSON format (status ${res.status}): ${rawText.slice(0, 100)}`
      )
    }
  } else {
    data = {}
  }

  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`)
  }

  return data
}

let tableChecked = false
export async function ensureUsersTable() {
  if (tableChecked) return
  try {
    await sql.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        full_name VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        is_verified BOOLEAN DEFAULT FALSE
      )
    `)
    await sql.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE
    `)
    await sql.query(`
      CREATE TABLE IF NOT EXISTS email_otps (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        otp_code VARCHAR(255) NOT NULL,
        attempts INT DEFAULT 0,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `)
    await sql.query(`
      ALTER TABLE email_otps ADD COLUMN IF NOT EXISTS attempts INT DEFAULT 0
    `)
    tableChecked = true
  } catch (err) {
    console.warn('Could not verify Neon users & otps table:', err)
  }
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.error('Error reading current auth user:', e)
  }
  return null
}

export function saveCurrentUser(user) {
  try {
    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(AUTH_USER_KEY)
    }
    window.dispatchEvent(new CustomEvent('auth_user_changed', { detail: user }))
  } catch (e) {
    console.error('Error saving auth user:', e)
  }
}

/**
 * Send OTP to customer's email via backend endpoint
 */
export async function sendOtp({ email }) {
  if (!email) {
    throw new Error('Email is required.')
  }

  return await safeFetchJson(API_CONFIG.auth, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'send-otp', email }),
  })
}

/**
 * Verify OTP directly
 */
export async function verifyOtp({ email, otp }) {
  if (!email || !otp) {
    throw new Error('Email and 6-digit verification code are required.')
  }

  return await safeFetchJson(API_CONFIG.auth, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'verify-otp', email, otp }),
  })
}

/**
 * Complete signup with OTP verification
 */
export async function signup({ username, email, password, fullName, otp, role = 'user' }) {
  if (!username || !email || !password) {
    throw new Error('Username, email, and password are required.')
  }

  const cleanUsername = username.trim().toLowerCase()
  const cleanEmail = email.trim().toLowerCase()

  if (cleanUsername.length < 3) {
    throw new Error('Username must be at least 3 characters.')
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    throw new Error('Invalid email address format.')
  }
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters.')
  }
  if (!otp) {
    throw new Error('Please enter the 6-digit verification code sent to your email.')
  }

  const data = await safeFetchJson(API_CONFIG.auth, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'signup',
      username: cleanUsername,
      email: cleanEmail,
      password,
      fullName,
      role,
      otp,
    }),
  })

  if (data.user) {
    saveCurrentUser(data.user)
  }

  return data
}

/**
 * LOGIN FUNCTION: Authenticates user against backend API or Neon PostgreSQL
 */
export async function login({ usernameOrEmail, password }) {
  if (!usernameOrEmail || !password) {
    throw new Error('Please provide username/email and password.')
  }

  const identifier = usernameOrEmail.trim().toLowerCase()

  try {
    const data = await safeFetchJson(API_CONFIG.auth, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'login',
        username: identifier,
        password,
      }),
    })

    if (data.user) {
      saveCurrentUser(data.user)
      return data
    }
  } catch (apiErr) {
    // If backend endpoint is unreachable or 404, fallback to direct Neon query
    console.warn('API login error, checking direct Neon connection:', apiErr)
    await ensureUsersTable()
    const passwordHash = await sha256Hex(password)

    const rows = await sql.query(
      `SELECT id, username, email, password_hash, role, full_name, is_verified, created_at
       FROM users
       WHERE LOWER(username) = $1 OR LOWER(email) = $1
       LIMIT 1`,
      [identifier]
    )

    if (!rows || rows.length === 0) {
      throw new Error('Invalid credentials: user not found.')
    }

    const found = rows[0]
    if (found.password_hash !== passwordHash) {
      throw new Error('Invalid credentials: incorrect password.')
    }

    const user = {
      id: found.id,
      username: found.username,
      email: found.email,
      role: found.role,
      fullName: found.full_name,
      isVerified: found.is_verified ?? true,
      createdAt: found.created_at,
    }

    saveCurrentUser(user)
    return { success: true, user }
  }
}

export function logout() {
  saveCurrentUser(null)
}
