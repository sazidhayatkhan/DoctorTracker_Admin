import type { MetadataRoute } from "next"

/**
 * Served at /robots.txt. Only the public start pages may be crawled; the
 * admin dashboard (patient data) and login stay out. Those pages also send
 * `noindex` in their metadata, which covers links found elsewhere.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/dashboard/", "/login"],
    },
  }
}
