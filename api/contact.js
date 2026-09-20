import sql from '../lib/db.js'
import { initDatabase } from '../lib/schema.js'

let dbInitialized = false

async function ensureDb() {
  if (!dbInitialized) {
    await initDatabase()
    dbInitialized = true
  }
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default async function handler(req, res) {
  const headers = corsHeaders()

  if (req.method === 'OPTIONS') {
    return res.status(200).setHeader('Access-Control-Allow-Origin', '*').end()
  }

  Object.entries(headers).forEach(([k, v]) => res.setHeader(k, v))

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await ensureDb()

    const { name, email, phone, projectType, message } = req.body

    if (!name || !email || !projectType || !message) {
      return res.status(400).json({ error: 'Missing required fields: name, email, projectType, message' })
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email address' })
    }

    if (name.length > 255) {
      return res.status(400).json({ error: 'Name must be 255 characters or less' })
    }

    if (projectType.length > 100) {
      return res.status(400).json({ error: 'Project type must be 100 characters or less' })
    }

    const ipAddress = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || null
    const userAgent = req.headers['user-agent'] || null

    const result = await sql`
      INSERT INTO contact_submissions (name, email, phone, project_type, message, ip_address, user_agent)
      VALUES (${name}, ${email}, ${phone || null}, ${projectType}, ${message}, ${ipAddress}, ${userAgent})
      RETURNING id, name, email, project_type, created_at
    `

    const submission = result[0]

    return res.status(201).json({
      success: true,
      message: 'Your project request has been submitted successfully. I will get back to you soon!',
      data: {
        id: submission.id,
        name: submission.name,
        email: submission.email,
        projectType: submission.project_type,
        createdAt: submission.created_at,
      },
    })
  } catch (error) {
    console.error('Contact form submission error:', error)
    return res.status(500).json({
      error: 'Failed to submit your request. Please try again or contact me directly via email.',
    })
  }
}
