import sql from '../lib/db.js'
import { initDatabase } from '../lib/schema.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await initDatabase()

    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `

    return res.status(200).json({
      success: true,
      message: 'Database initialized successfully',
      tables: tables.map((t) => t.table_name),
    })
  } catch (error) {
    console.error('Database setup error:', error)
    return res.status(500).json({
      error: 'Failed to initialize database',
      details: error.message,
    })
  }
}
