/** Backend base URL, e.g. http://localhost:5000/api (set in .env.local) */
export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api"
).replace(/\/+$/, "")
