import type { NextConfig } from "next"

/**
 * Optional same-origin proxy to the backend. With BACKEND_URL set (e.g.
 * http://187.77.128.128:5001/api) and NEXT_PUBLIC_API_URL=/api, the browser
 * calls https://<this site>/api/*, and the server forwards it to the backend.
 * That lets an HTTPS site use an HTTP-only API (browsers block such calls
 * directly as mixed content) and needs no CORS. Read at build time.
 */
const BACKEND_URL = process.env.BACKEND_URL?.trim().replace(/\/+$/, "")

const nextConfig: NextConfig = {
  async rewrites() {
    if (!BACKEND_URL) return []
    return [{ source: "/api/:path*", destination: `${BACKEND_URL}/:path*` }]
  },
}

export default nextConfig
