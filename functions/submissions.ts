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
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export default async function submissions(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (req.method !== "GET") {
    return json(405, { error: "Method not allowed" });
  }

  try {
    await ensureDb();

    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    const limit = parseInt(url.searchParams.get("limit") || "50", 10);
    const offset = parseInt(url.searchParams.get("offset") || "0", 10);

    let rows;
    if (status) {
      rows = await sql`
        SELECT id, name, email, phone, project_type, message, status, created_at
        FROM contact_submissions
        WHERE status = ${status}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else {
      rows = await sql`
        SELECT id, name, email, phone, project_type, message, status, created_at
        FROM contact_submissions
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    }

    const countResult = await sql`SELECT COUNT(*) as total FROM contact_submissions`;
    const total = parseInt(countResult[0].total as string, 10);

    return json(200, {
      success: true,
      data: rows.map((r) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        phone: r.phone,
        projectType: r.project_type,
        message: r.message,
        status: r.status,
        createdAt: r.created_at,
      })),
      pagination: { total, limit, offset },
    });
  } catch (err) {
    console.error("Error fetching submissions:", err);
    return json(500, { error: "Failed to fetch submissions" });
  }
}
