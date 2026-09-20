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
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default async function contact(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (req.method !== "POST") {
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

    const { name, email, phone, projectType, message } = body;

    if (!name || !email || !projectType || !message) {
      return json(400, { error: "Missing required fields: name, email, projectType, message" });
    }

    if (!validateEmail(email)) {
      return json(400, { error: "Invalid email address" });
    }

    if (name.length > 255) {
      return json(400, { error: "Name must be 255 characters or less" });
    }

    if (projectType.length > 100) {
      return json(400, { error: "Project type must be 100 characters or less" });
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
    const ua = req.headers.get("user-agent") || null;

    const result = await sql`
      INSERT INTO contact_submissions (name, email, phone, project_type, message, ip_address, user_agent)
      VALUES (${name}, ${email}, ${phone || null}, ${projectType}, ${message}, ${ip}, ${ua})
      RETURNING id, name, email, project_type, created_at
    `;

    const row = result[0];

    return json(201, {
      success: true,
      message: "Your project request has been submitted successfully. I will get back to you soon!",
      data: {
        id: row.id,
        name: row.name,
        email: row.email,
        projectType: row.project_type,
        createdAt: row.created_at,
      },
    });
  } catch (err) {
    console.error("Contact submission error:", err);
    return json(500, {
      error: "Failed to submit your request. Please try again or contact me directly via email.",
    });
  }
}
