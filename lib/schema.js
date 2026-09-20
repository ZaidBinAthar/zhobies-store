import sql from './db.js'

export async function initDatabase() {
  await sql`
    CREATE TABLE IF NOT EXISTS contact_submissions (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      project_type VARCHAR(100) NOT NULL,
      message TEXT NOT NULL,
      ip_address VARCHAR(45),
      user_agent TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'read', 'archived'))
    )
  `

  await sql`
    CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at
    ON contact_submissions (created_at DESC)
  `

  await sql`
    CREATE INDEX IF NOT EXISTS idx_contact_submissions_status
    ON contact_submissions (status)
  `
}
