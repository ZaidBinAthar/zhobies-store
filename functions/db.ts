import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export default sql;

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
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_contact_created_at
    ON contact_submissions (created_at DESC)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_contact_status
    ON contact_submissions (status)
  `;

  await sql`
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
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_products_category
    ON products (category)
  `;

  await sql`
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
  `;
}
