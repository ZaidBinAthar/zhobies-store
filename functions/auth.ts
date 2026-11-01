import sql, { initDatabase } from "./db";
import crypto from "crypto";
import { Resend } from "resend";

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

function hashString(val: string): string {
  return crypto.createHash("sha256").update(val).digest("hex");
}

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOtpEmail(email: string, otp: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured on the server.");
  }

  const resend = new Resend(apiKey);
  const fromEmail = process.env.RESEND_FROM_EMAIL || "Zhobie's Wear <onboarding@resend.dev>";

  return await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: `${otp} is your Zhobie's Store verification code`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #0d0b09; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #f5f5f5;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 560px; margin: 40px auto; background-color: #171410; border: 1px solid rgba(184, 134, 11, 0.3); border-radius: 4px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.8);">
          <tr>
            <td style="padding: 36px 36px 24px; text-align: center; border-bottom: 1px solid rgba(184, 134, 11, 0.15);">
              <h1 style="margin: 0; font-family: Georgia, serif; font-size: 26px; color: #d4a017; letter-spacing: 2px; text-transform: uppercase;">
                ZHOBIE'S STORE
              </h1>
              <p style="margin: 8px 0 0; font-size: 11px; letter-spacing: 3px; color: #a3a3a3; text-transform: uppercase;">
                Bespoke & Ready-to-Wear Elegance
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 36px;">
              <h2 style="margin: 0 0 16px; font-size: 20px; color: #ffffff; font-weight: 500;">
                Verify Your Email Address
              </h2>
              <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: #a3a3a3;">
                Thank you for registering with Zhobie's Store. Please use the following six-digit verification code to complete your registration.
              </p>
              
              <div style="background-color: #0d0b09; border: 1px dashed #b8860b; border-radius: 4px; padding: 22px; text-align: center; margin: 28px 0;">
                <span style="font-size: 34px; font-weight: bold; letter-spacing: 10px; color: #d4a017; font-family: monospace;">
                  ${otp}
                </span>
              </div>

              <p style="margin: 0 0 10px; font-size: 13px; color: #a3a3a3; line-height: 1.5;">
                ⏰ <strong>This code expires in 5 minutes.</strong> For your security, never share this code with anyone.
              </p>
              <p style="margin: 0; font-size: 12px; color: #737373; line-height: 1.5;">
                If you did not request this verification code, please ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 36px; background-color: #0d0b09; border-top: 1px solid rgba(184, 134, 11, 0.15); text-align: center; font-size: 11px; color: #737373;">
              © ${new Date().getFullYear()} Zhobie's Store. All rights reserved.
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  });
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

    const { action, username, email, password, fullName, role, otp } = body;

    // ─────────────────────────────────────────────────────────────
    // SEND OTP (For registration or verification)
    // ─────────────────────────────────────────────────────────────
    if (action === "send-otp") {
      if (!email) {
        return json(400, { error: "Email is required to send verification code." });
      }

      const cleanEmail = String(email).trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        return json(400, { error: "Invalid email address format." });
      }

      // 1. Cooldown check: Has an OTP been created within the last 60 seconds?
      const recentOtp = await sql`
        SELECT created_at FROM email_otps
        WHERE LOWER(email) = ${cleanEmail}
          AND created_at > NOW() - INTERVAL '60 seconds'
        ORDER BY created_at DESC
        LIMIT 1
      `;
      if (recentOtp && recentOtp.length > 0) {
        return json(429, {
          error: "Please wait 60 seconds before requesting another verification code.",
          cooldownRemaining: true,
        });
      }

      // 2. Rate limit check: Maximum 5 OTP requests per hour for this email
      const hourlyCount = await sql`
        SELECT COUNT(*) as cnt FROM email_otps
        WHERE LOWER(email) = ${cleanEmail}
          AND created_at > NOW() - INTERVAL '1 hour'
      `;
      if (hourlyCount && Number(hourlyCount[0].cnt) >= 5) {
        return json(429, {
          error: "Too many OTP requests. Please wait an hour before trying again.",
        });
      }

      // Generate 6-digit OTP code and store SHA-256 hash with 5-minute expiry
      const otpCode = generateOtp();
      const otpHashed = hashString(otpCode);

      // Invalidate any older active OTPs for this email
      await sql`
        DELETE FROM email_otps
        WHERE LOWER(email) = ${cleanEmail}
      `;

      // Store in Neon PostgreSQL with 5-minute expiry
      await sql`
        INSERT INTO email_otps (email, otp_code, attempts, created_at, expires_at)
        VALUES (${cleanEmail}, ${otpHashed}, 0, NOW(), NOW() + INTERVAL '5 minutes')
      `;

      // Send email via Resend
      try {
        const sendResult = await sendOtpEmail(cleanEmail, otpCode);
        if (sendResult.error) {
          console.error("Resend delivery failed:", sendResult.error);
          return json(502, {
            error: sendResult.error.message || "Failed to deliver verification email via Resend.",
          });
        }
      } catch (sendErr) {
        console.error("Error sending OTP email via Resend:", sendErr);
        return json(500, {
          error: "Unable to send verification email. Please check server configuration.",
          details: sendErr instanceof Error ? sendErr.message : String(sendErr),
        });
      }

      return json(200, {
        success: true,
        message: "Verification code sent to your email. Valid for 5 minutes.",
      });
    }

    // ─────────────────────────────────────────────────────────────
    // VERIFY OTP (Stand-alone or pre-check)
    // ─────────────────────────────────────────────────────────────
    if (action === "verify-otp") {
      if (!email || !otp) {
        return json(400, { error: "Email and 6-digit OTP are required." });
      }

      const cleanEmail = String(email).trim().toLowerCase();
      const cleanOtp = String(otp).trim();

      const records = await sql`
        SELECT id, otp_code, attempts, expires_at, created_at
        FROM email_otps
        WHERE LOWER(email) = ${cleanEmail}
        ORDER BY created_at DESC
        LIMIT 1
      `;

      if (!records || records.length === 0) {
        return json(400, { error: "No verification code found. Please request a new code." });
      }

      const otpRecord = records[0];

      // Rate limit attempts: Maximum 5 failed attempts per OTP
      if (otpRecord.attempts >= 5) {
        await sql`DELETE FROM email_otps WHERE id = ${otpRecord.id}`;
        return json(429, {
          error: "Too many failed attempts. This code is invalidated. Please request a new code.",
        });
      }

      // Check expiry (5 minutes)
      if (new Date(otpRecord.expires_at).getTime() < Date.now()) {
        await sql`DELETE FROM email_otps WHERE id = ${otpRecord.id}`;
        return json(400, { error: "Verification code has expired. Please request a new code." });
      }

      // Verify OTP hash
      const inputHash = hashString(cleanOtp);
      // Support comparing either against hash or plain if older migration
      const matches = otpRecord.otp_code === inputHash || otpRecord.otp_code === cleanOtp;

      if (!matches) {
        await sql`
          UPDATE email_otps
          SET attempts = attempts + 1
          WHERE id = ${otpRecord.id}
        `;
        const remaining = 5 - (otpRecord.attempts + 1);
        return json(400, {
          error: `Invalid verification code. ${remaining > 0 ? remaining + ' attempt(s) left.' : ''}`,
        });
      }

      // Success: clean up OTP record and mark user verified if exists
      await sql`DELETE FROM email_otps WHERE id = ${otpRecord.id}`;

      await sql`
        UPDATE users
        SET is_verified = TRUE, updated_at = NOW()
        WHERE LOWER(email) = ${cleanEmail}
      `;

      return json(200, {
        success: true,
        message: "Email verified successfully.",
      });
    }

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

      // Verify OTP if provided during signup
      if (!otp) {
        return json(400, {
          error: "Verification code (OTP) is required to complete registration.",
          requiresOtp: true,
        });
      }

      const cleanOtp = String(otp).trim();
      const records = await sql`
        SELECT id, otp_code, attempts, expires_at
        FROM email_otps
        WHERE LOWER(email) = ${cleanEmail}
        ORDER BY created_at DESC
        LIMIT 1
      `;

      if (!records || records.length === 0) {
        return json(400, { error: "No OTP found or code expired. Please request a new verification code." });
      }

      const otpRecord = records[0];

      if (otpRecord.attempts >= 5) {
        await sql`DELETE FROM email_otps WHERE id = ${otpRecord.id}`;
        return json(429, {
          error: "Too many incorrect attempts. Please request a new verification code.",
        });
      }

      if (new Date(otpRecord.expires_at).getTime() < Date.now()) {
        await sql`DELETE FROM email_otps WHERE id = ${otpRecord.id}`;
        return json(400, { error: "Verification code has expired. Please request a new code." });
      }

      const inputHash = hashString(cleanOtp);
      const matches = otpRecord.otp_code === inputHash || otpRecord.otp_code === cleanOtp;

      if (!matches) {
        await sql`
          UPDATE email_otps
          SET attempts = attempts + 1
          WHERE id = ${otpRecord.id}
        `;
        const remaining = 5 - (otpRecord.attempts + 1);
        return json(400, {
          error: `Invalid verification code. ${remaining > 0 ? remaining + ' attempt(s) left.' : ''}`,
        });
      }

      // OTP is valid! Remove it to prevent replay
      await sql`DELETE FROM email_otps WHERE id = ${otpRecord.id}`;

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

      const passwordHash = hashString(password);
      const userRole = role === "admin" || role === "owner" ? role : "user";
      const userFullName = fullName ? String(fullName).trim() : cleanUsername;

      const newUser = await sql`
        INSERT INTO users (username, email, password_hash, role, full_name, is_verified, created_at, updated_at)
        VALUES (${cleanUsername}, ${cleanEmail}, ${passwordHash}, ${userRole}, ${userFullName}, TRUE, NOW(), NOW())
        RETURNING id, username, email, role, full_name, is_verified, created_at
      `;

      return json(201, {
        success: true,
        message: "Account created and email verified successfully in Neon database.",
        user: newUser[0],
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

      const passwordHash = hashString(password);

      const rows = await sql`
        SELECT id, username, email, password_hash, role, full_name, is_verified, created_at
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
          isVerified: foundUser.is_verified ?? true,
          createdAt: foundUser.created_at,
        },
      });
    }

    return json(400, {
      error: "Invalid action. Supported actions: 'send-otp', 'verify-otp', 'signup', 'login'.",
    });
  } catch (err) {
    console.error("Auth handler error:", err);
    return json(500, {
      error: "Authentication server error",
      details: err instanceof Error ? err.message : String(err),
    });
  }
}
