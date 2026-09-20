import sql, { initDatabase } from "./db";

function cors(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export default async function setupDb(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return cors(204, null);
  }

  if (req.method !== "POST") {
    return cors(405, { error: "Method not allowed" });
  }

  try {
    await initDatabase();

    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;

    return cors(200, {
      success: true,
      message: "Database initialized successfully",
      tables: tables.map((t) => t.table_name),
    });
  } catch (err) {
    console.error("Database setup error:", err);
    return cors(500, {
      error: "Failed to initialize database",
      details: err instanceof Error ? err.message : String(err),
    });
  }
}
