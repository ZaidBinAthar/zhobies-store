import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { initDatabase } from './lib/schema.js'
import sql from './lib/db.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.post('/api/contact', async (req, res) => {
  try {
    await initDatabase()

    const { name, email, phone, projectType, message } = req.body

    if (!name || !email || !projectType || !message) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' })
    }

    const ipAddress = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || null
    const userAgent = req.headers['user-agent'] || null

    const result = await sql`
      INSERT INTO contact_submissions (name, email, phone, project_type, message, ip_address, user_agent)
      VALUES (${name}, ${email}, ${phone || null}, ${projectType}, ${message}, ${ipAddress}, ${userAgent})
      RETURNING id, name, email, project_type, created_at
    `

    const submission = result[0]

    return res.status(201).json({
      success: true,
      message: 'Your project request has been submitted successfully!',
      data: {
        id: submission.id,
        name: submission.name,
        email: submission.email,
        projectType: submission.project_type,
        createdAt: submission.created_at,
      },
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return res.status(500).json({ error: 'Failed to submit your request' })
  }
})

app.get('/api/submissions', async (req, res) => {
  try {
    await initDatabase()

    const { status, limit = '50', offset = '0' } = req.query

    let submissions
    if (status) {
      submissions = await sql`
        SELECT * FROM contact_submissions
        WHERE status = ${status}
        ORDER BY created_at DESC
        LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
      `
    } else {
      submissions = await sql`
        SELECT * FROM contact_submissions
        ORDER BY created_at DESC
        LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
      `
    }

    const countResult = await sql`SELECT COUNT(*) as total FROM contact_submissions`

    return res.status(200).json({
      success: true,
      data: submissions,
      pagination: { total: parseInt(countResult[0].total), limit: parseInt(limit), offset: parseInt(offset) },
    })
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ error: 'Failed to fetch submissions' })
  }
})

app.patch('/api/submissions', async (req, res) => {
  try {
    await initDatabase()

    const { id, status } = req.body

    if (!id || !status) {
      return res.status(400).json({ error: 'Missing required fields: id, status' })
    }

    if (!['new', 'read', 'archived'].includes(status)) {
      return res.status(400).json({ error: 'Status must be new, read, or archived' })
    }

    const result = await sql`
      UPDATE contact_submissions
      SET status = ${status}
      WHERE id = ${id}
      RETURNING id, name, status
    `

    if (result.length === 0) {
      return res.status(404).json({ error: 'Submission not found' })
    }

    return res.status(200).json({ success: true, data: result[0] })
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ error: 'Failed to update submission' })
  }
})

app.post('/api/setup-db', async (req, res) => {
  try {
    await initDatabase()
    const tables = await sql`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' ORDER BY table_name
    `
    return res.status(200).json({
      success: true,
      message: 'Database initialized successfully',
      tables: tables.map((t) => t.table_name),
    })
  } catch (error) {
    console.error('Setup error:', error)
    return res.status(500).json({ error: 'Failed to initialize database' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log('API endpoints:')
  console.log(`  POST http://localhost:${PORT}/api/contact`)
  console.log(`  GET  http://localhost:${PORT}/api/submissions`)
  console.log(`  PATCH http://localhost:${PORT}/api/submissions`)
  console.log(`  POST http://localhost:${PORT}/api/setup-db`)
})
