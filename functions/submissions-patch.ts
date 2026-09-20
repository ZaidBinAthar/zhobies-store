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
      "Access-Control-Allow-Methods": "PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export default async function submissionsPatch(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (req.method !== "PATCH") {
    return json(405, { error: "Method not allowed" });
  }

  try {
    await ensureDb();

    let body;
    try {
      body = await req.json();
    } catch {
      return json(400, { error: "Invalid JSON body" });
    }

    const { id, status } = body;

    if (!id || !status) {
      return json(400, { error: "Missing required fields: id, status" });
    }

    if (!["new", "read", "archived"].includes(status)) {
      return json(400, { error: "Status must be new, read, or archived" });
    }

    const result = await sql`
      UPDATE contact_submissions
      SET status = ${status}
      WHERE id = ${id}
      RETURNING id, name, status
    `;

    if (result.length === 0) {
      return json(404, { error: "Submission not found" });
    }

    return json(200, {
      success: true,
      data: {
        id: result[0].id,
        name: result[0].name,
        status: result[0].status,
      },
    });
  } catch (err) {
    console.error("Error updating submission:", err);
    return json(500, { error: "Failed to update submission" });
  }
}
