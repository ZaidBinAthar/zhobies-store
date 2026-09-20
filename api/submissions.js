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
    'Access-Control-Allow-Methods': 'GET, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
}

export default async function handler(req, res) {
  const headers = corsHeaders()

  if (req.method === 'OPTIONS') {
    return res.status(200).setHeader('Access-Control-Allow-Origin', '*').end()
  }

  Object.entries(headers).forEach(([k, v]) => res.setHeader(k, v))

  if (req.method === 'GET') {
    try {
      await ensureDb()

      const { status, limit = '50', offset = '0' } = req.query

      let submissions
      if (status) {
        submissions = await sql`
          SELECT id, name, email, phone, project_type, message, status, created_at
          FROM contact_submissions
          WHERE status = ${status}
          ORDER BY created_at DESC
          LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
        `
      } else {
        submissions = await sql`
          SELECT id, name, email, phone, project_type, message, status, created_at
          FROM contact_submissions
          ORDER BY created_at DESC
          LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
        `
      }

      const countResult = await sql`SELECT COUNT(*) as total FROM contact_submissions`
      const total = parseInt(countResult[0].total)

      return res.status(200).json({
        success: true,
        data: submissions.map((s) => ({
          id: s.id,
          name: s.name,
          email: s.email,
          phone: s.phone,
          projectType: s.project_type,
          message: s.message,
          status: s.status,
          createdAt: s.created_at,
        })),
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
        },
      })
    } catch (error) {
      console.error('Error fetching submissions:', error)
      return res.status(500).json({ error: 'Failed to fetch submissions' })
    }
  }

  if (req.method === 'PATCH') {
    try {
      await ensureDb()

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

      return res.status(200).json({
        success: true,
        data: {
          id: result[0].id,
          name: result[0].name,
          status: result[0].status,
        },
      })
    } catch (error) {
      console.error('Error updating submission:', error)
      return res.status(500).json({ error: 'Failed to update submission' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
