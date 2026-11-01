import sql, { initDatabase } from "./db";
import crypto from "crypto";

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

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export default async function authHandler(req: Request): Promise<Response> {
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
    return json(405, { error: "Method not allowed. Use POST." });
  }

  try {
    await ensureDb();

    let body: any;
    try {
      body = await req.json();
    } catch {
      return json(400, { error: "Invalid JSON body" });
    }

    const { action, username, email, password, fullName, role } = body;

    // ─────────────────────────────────────────────────────────────
    // SIGNUP
    // ─────────────────────────────────────────────────────────────
    if (action === "signup") {
      if (!username || !email || !password) {
        return json(400, { error: "Username, email, and password are required." });
      }

      const cleanUsername = String(username).trim().toLowerCase();
      const cleanEmail = String(email).trim().toLowerCase();

      if (cleanUsername.length < 3) {
        return json(400, { error: "Username must be at least 3 characters long." });
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        return json(400, { error: "Invalid email format." });
      }

      if (String(password).length < 6) {
        return json(400, { error: "Password must be at least 6 characters long." });
      }

      // Check if user or email already exists in Neon DB
      const existing = await sql`
        SELECT id, username, email FROM users
        WHERE LOWER(username) = ${cleanUsername} OR LOWER(email) = ${cleanEmail}
        LIMIT 1
      `;

      if (existing && existing.length > 0) {
        if (existing[0].username.toLowerCase() === cleanUsername) {
          return json(409, { error: "Username is already taken." });
        }
        return json(409, { error: "Email is already registered." });
      }

      const passwordHash = hashPassword(password);
      const userRole = role === "admin" || role === "owner" ? role : "user";
      const userFullName = fullName ? String(fullName).trim() : cleanUsername;

      const newUser = await sql`
        INSERT INTO users (username, email, password_hash, role, full_name, created_at, updated_at)
        VALUES (${cleanUsername}, ${cleanEmail}, ${passwordHash}, ${userRole}, ${userFullName}, NOW(), NOW())
        RETURNING id, username, email, role, full_name, created_at
      `;

      return json(201, {
        success: true,
        message: "Account created successfully in Neon database.",
        user: newUser[0]
      });
    }

    // ─────────────────────────────────────────────────────────────
    // LOGIN
    // ─────────────────────────────────────────────────────────────
    if (action === "login") {
      const identifier = String(username || email || "").trim().toLowerCase();
      if (!identifier || !password) {
        return json(400, { error: "Username/email and password are required." });
      }

      const passwordHash = hashPassword(password);

      const rows = await sql`
        SELECT id, username, email, password_hash, role, full_name, created_at
        FROM users
        WHERE LOWER(username) = ${identifier} OR LOWER(email) = ${identifier}
        LIMIT 1
      `;

      if (!rows || rows.length === 0) {
        return json(401, { error: "Invalid credentials: user not found." });
      }

      const foundUser = rows[0];

      if (foundUser.password_hash !== passwordHash) {
        return json(401, { error: "Invalid credentials: password incorrect." });
      }

      return json(200, {
        success: true,
        message: "Login successful.",
        user: {
          id: foundUser.id,
          username: foundUser.username,
          email: foundUser.email,
          role: foundUser.role,
          fullName: foundUser.full_name,
          createdAt: foundUser.created_at
        }
      });
    }

    return json(400, { error: "Invalid action. Supported actions: 'login' or 'signup'." });
  } catch (err) {
    console.error("Auth handler error:", err);
    return json(500, {
      error: "Authentication server error",
      details: err instanceof Error ? err.message : String(err)
    });
  }
}

