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
      "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export default async function companyHandler(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  try {
    await ensureDb();

    const url = new URL(req.url);
    const companyIdParam = url.searchParams.get("companyId") || url.searchParams.get("id");
    const companyId = companyIdParam ? parseInt(companyIdParam, 10) : 1;

    // GET /company?companyId=1
    if (req.method === "GET") {
      const rows = await sql`
        SELECT id, name, tagline, logo_url, phone, email, address, description, updated_at
        FROM company
        WHERE id = ${companyId}
        LIMIT 1
      `;

      if (rows && rows.length > 0) {
        return json(200, { success: true, data: rows[0] });
      }

      // Default fallback
      return json(200, {
        success: true,
        data: {
          id: companyId,
          name: "Zhobies Wear",
          tagline: "Premium Clothing & Tailoring",
          logo_url: "",
          phone: "+92 300 1234567",
          email: "zhobieswear@gmail.com",
          address: "Commercial Market, Lahore, Pakistan",
          description: "Premium clothing for every occasion — crafted with passion, delivered with care."
        }
      });
    }

    // POST / PUT /company
    if (req.method === "POST" || req.method === "PUT") {
      const body = await req.json();
      const targetId = body.companyId || body.id || companyId || 1;
      const name = body.name || "Zhobies Wear";
      const tagline = body.tagline || "";
      const logoUrl = body.logoUrl || body.logo_url || "";
      const phone = body.phone || "";
      const email = body.email || "";
      const address = body.address || "";
      const description = body.description || "";

      const updated = await sql`
        INSERT INTO company (id, name, tagline, logo_url, phone, email, address, description, updated_at)
        VALUES (${targetId}, ${name}, ${tagline}, ${logoUrl}, ${phone}, ${email}, ${address}, ${description}, NOW())
        ON CONFLICT (id) DO UPDATE
        SET name = EXCLUDED.name,
            tagline = EXCLUDED.tagline,
            logo_url = EXCLUDED.logo_url,
            phone = EXCLUDED.phone,
            email = EXCLUDED.email,
            address = EXCLUDED.address,
            description = EXCLUDED.description,
            updated_at = NOW()
        RETURNING id, name, tagline, logo_url, phone, email, address, description, updated_at
      `;

      return json(200, {
        success: true,
        message: "Company settings updated successfully",
        data: updated[0]
      });
    }

    return json(405, { error: "Method not allowed" });
  } catch (err) {
    console.error("Company API error:", err);
    return json(500, {
      error: "Internal server error",
      details: err instanceof Error ? err.message : String(err),
    });
  }
}

