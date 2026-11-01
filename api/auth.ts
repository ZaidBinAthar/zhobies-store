import type { VercelRequest, VercelResponse } from "@vercel/node";
import authHandler from "../../functions/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Translate VercelRequest into a standard web Request
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost";
  const url = `${protocol}://${host}${req.url}`;

  let body: string | undefined = undefined;
  if (req.method !== "GET" && req.method !== "HEAD") {
    body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
  }

  const webHeaders = new Headers();
  for (const [key, val] of Object.entries(req.headers)) {
    if (val !== undefined) {
      if (Array.isArray(val)) {
        val.forEach((v) => webHeaders.append(key, v));
      } else {
        webHeaders.set(key, val);
      }
    }
  }

  const webReq = new Request(url, {
    method: req.method,
    headers: webHeaders,
    body: body ? body : undefined,
  });

  const webResponse = await authHandler(webReq);

  webResponse.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  const resText = await webResponse.text();
  res.status(webResponse.status).send(resText);
}

