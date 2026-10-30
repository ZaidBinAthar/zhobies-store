const { neon } = require('@neondatabase/serverless');

const connectionString = 'postgresql://neondb_owner:npg_2hZz7JxsHWrS@ep-hidden-frog-azmbsupu-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
const sql = neon(connectionString);

async function main() {
  console.log('Connecting to Neon PostgreSQL...');
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
  `);

  const countResult = await sql.query('SELECT COUNT(*) as c FROM products');
  const count = parseInt(countResult[0].c, 10);
  console.log('Current product count in Neon DB:', count);

  if (count === 0) {
    await sql.query(`
      INSERT INTO products (name, category, price, badge, colors, image, rating, reviews, description)
      VALUES 
      ('Executive Navy Suit', 'Formal', 'PKR 8,500', 'Bestseller', ARRAY['#1a237e', '#37474f', '#212121'], '/collection-formal.jpg', 5.0, 42, 'Expertly tailored three-piece formal suit crafted from fine wool blend. Includes customized sizing options and breathable interior lining.'),
      ('Classic Cream Hoodie Set', 'Casual', 'PKR 3,200', 'New', ARRAY['#f5f0e8', '#37474f', '#795548'], '/collection-casual.jpg', 5.0, 28, 'Ultra-soft fleece hoodie and jogger combo designed for everyday comfort and modern streetwear fashion.'),
      ('Royal Embroidered Kurta', 'Traditional', 'PKR 5,800', 'Premium', ARRAY['#1a237e', '#4a148c', '#006064'], '/collection-traditional.jpg', 5.0, 65, 'Intricately embroidered festive kurta made with pure cotton-silk fabric for formal events and celebrations.')
    `);
    console.log('Successfully seeded default products into Neon!');
  }

  const rows = await sql.query('SELECT id, name, category, price FROM products');
  console.log('Products currently in Neon database:');
  console.table(rows);
}

main().catch(console.error);
