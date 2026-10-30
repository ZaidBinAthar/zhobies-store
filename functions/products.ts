import sql, { initDatabase } from "./db";

let dbReady = false;

async function ensureDb() {
  if (!dbReady) {
    await initDatabase();
    dbReady = true;
  }
}

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export default async function products(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  try {
    await ensureDb();

    // GET /products
    if (req.method === "GET") {
      const url = new URL(req.url);
      const category = url.searchParams.get("category");

      let rows;
      if (category && category !== "All") {
        rows = await sql`
          SELECT id, name, category, price, badge, colors, image, rating, reviews, description, in_stock, created_at
          FROM products
          WHERE category = ${category}
          ORDER BY id ASC
        `;
      } else {
        rows = await sql`
          SELECT id, name, category, price, badge, colors, image, rating, reviews, description, in_stock, created_at
          FROM products
          ORDER BY id ASC
        `;
      }

      return json(200, {
        success: true,
        data: rows.map((r) => ({
          id: r.id,
          name: r.name,
          category: r.category,
          price: r.price,
          badge: r.badge || "",
          colors: Array.isArray(r.colors) ? r.colors : [],
          image: r.image || "/collection-formal.jpg",
          rating: Number(r.rating) || 5,
          reviews: Number(r.reviews) || 0,
          description: r.description || "",
          inStock: r.in_stock !== false,
          createdAt: r.created_at,
        })),
      });
    }

    // POST /products (Add new product)
    if (req.method === "POST") {
      const body = await req.json();
      const { name, category, price, badge, colors, image, description, rating, reviews, inStock } = body;

      if (!name || !category || !price) {
        return json(400, { error: "Missing required fields: name, category, price" });
      }

      const colorsArr = Array.isArray(colors) ? colors : [];
      const img = image || "/collection-formal.jpg";
      const rat = rating ? Number(rating) : 5.0;
      const rev = reviews ? Number(reviews) : 0;
      const stock = inStock !== false;

      const result = await sql`
        INSERT INTO products (name, category, price, badge, colors, image, rating, reviews, description, in_stock)
        VALUES (${name}, ${category}, ${price}, ${badge || null}, ${colorsArr}, ${img}, ${rat}, ${rev}, ${description || ''}, ${stock})
        RETURNING id, name, category, price, badge, colors, image, rating, reviews, description, in_stock, created_at
      `;

      return json(201, {
        success: true,
        data: result[0],
      });
    }

    // PUT /products (Update product)
    if (req.method === "PUT") {
      const body = await req.json();
      const { id, name, category, price, badge, colors, image, description, rating, reviews, inStock } = body;

      if (!id) {
        return json(400, { error: "Missing product id" });
      }

      const colorsArr = Array.isArray(colors) ? colors : [];
      const img = image || "/collection-formal.jpg";
      const rat = rating ? Number(rating) : 5.0;
      const rev = reviews ? Number(reviews) : 0;
      const stock = inStock !== false;

      const result = await sql`
        UPDATE products
        SET
          name = ${name},
          category = ${category},
          price = ${price},
          badge = ${badge || null},
          colors = ${colorsArr},
          image = ${img},
          rating = ${rat},
          reviews = ${rev},
          description = ${description || ''},
          in_stock = ${stock}
        WHERE id = ${id}
        RETURNING id, name, category, price, badge, colors, image, rating, reviews, description, in_stock, created_at
      `;

      if (result.length === 0) {
        return json(404, { error: "Product not found" });
      }

      return json(200, {
        success: true,
        data: result[0],
      });
    }

    // DELETE /products
    if (req.method === "DELETE") {
      const url = new URL(req.url);
      const idStr = url.searchParams.get("id");
      let id = idStr ? parseInt(idStr, 10) : null;

      if (!id) {
        try {
          const body = await req.json();
          id = body?.id;
        } catch {
          // ignore
        }
      }

      if (!id) {
        return json(400, { error: "Missing product id to delete" });
      }

      await sql`
        DELETE FROM products
        WHERE id = ${id}
      `;

      return json(200, {
        success: true,
        message: "Product deleted successfully",
      });
    }

    return json(405, { error: "Method not allowed" });
  } catch (err) {
    console.error("Error in products function:", err);
    return json(500, { error: "Internal server error", details: err instanceof Error ? err.message : String(err) });
  }
}
