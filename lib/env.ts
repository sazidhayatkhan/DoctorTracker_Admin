/**
 * Backend base URL (set in .env.local / Vercel): either absolute, e.g.
 * http://localhost:5000/api, or "/api" to go through the same-origin proxy
 * configured by BACKEND_URL in next.config.ts.
 */
export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api"
).replace(/\/+$/, "")
