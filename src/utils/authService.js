import { neon } from '@neondatabase/serverless'

const NEON_CONNECTION_STRING =
  import.meta.env.VITE_NEON_DATABASE_URL ||
  import.meta.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_2hZz7JxsHWrS@ep-hidden-frog-azmbsupu-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

const sql = neon(NEON_CONNECTION_STRING)

const AUTH_USER_KEY = 'zvs_authenticated_user'

// SHA-256 for local browser hashing matching backend
async function sha256Hex(text) {
  const msgUint8 = new TextEncoder().encode(text)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
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
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `)
    tableChecked = true
  } catch (err) {
    console.warn('Could not verify Neon users table:', err)
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
 * SIGNUP FUNCTION: Stores user directly into Neon PostgreSQL
 */
export async function signup({ username, email, password, fullName, role = 'user' }) {
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

  await ensureUsersTable()
  const passwordHash = await sha256Hex(password)
  const userFullName = fullName ? fullName.trim() : cleanUsername

  try {
    const existing = await sql.query(
      `SELECT id, username, email FROM users WHERE LOWER(username) = $1 OR LOWER(email) = $2 LIMIT 1`,
      [cleanUsername, cleanEmail]
    )

    if (existing && existing.length > 0) {
      if (existing[0].username.toLowerCase() === cleanUsername) {
        throw new Error('Username is already taken.')
      }
      throw new Error('Email is already registered.')
    }

    const inserted = await sql.query(
      `INSERT INTO users (username, email, password_hash, role, full_name)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, username, email, role, full_name, created_at`,
      [cleanUsername, cleanEmail, passwordHash, role, userFullName]
    )

    if (inserted && inserted.length > 0) {
      const user = inserted[0]
      saveCurrentUser(user)
      return { success: true, user }
    }
  } catch (err) {
    console.error('Neon signup failed:', err)
    throw err
  }
}

/**
 * LOGIN FUNCTION: Authenticates user against Neon PostgreSQL
 */
export async function login({ usernameOrEmail, password }) {
  if (!usernameOrEmail || !password) {
    throw new Error('Please provide username/email and password.')
  }

  const identifier = usernameOrEmail.trim().toLowerCase()
  const passwordHash = await sha256Hex(password)

  await ensureUsersTable()

  try {
    const rows = await sql.query(
      `SELECT id, username, email, password_hash, role, full_name, created_at
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
      createdAt: found.created_at
    }

    saveCurrentUser(user)
    return { success: true, user }
  } catch (err) {
    console.error('Neon login failed:', err)
    throw err
  }
}

export function logout() {
  saveCurrentUser(null)
}

