import { z } from "zod"

import { API_URL } from "@/lib/env"
import { ApiError } from "@/lib/api/errors"
import { useAuthStore } from "@/stores/auth.store"

export { ApiError }

/** Every backend response is wrapped as { success, message, data } */
const envelopeSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.unknown().optional(),
  errors: z.record(z.string(), z.string()).optional(),
})

type QueryValue = string | number | boolean | null | undefined

type RequestOptions<T> = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  /** Query string params; empty / null / undefined values are dropped */
  query?: Record<string, QueryValue>
  body?: unknown
  /** Validates and types the response `data` */
  schema: z.ZodType<T>
  signal?: AbortSignal
  /** Send the bearer token (default true) */
  auth?: boolean
}

const buildUrl = (path: string, query?: Record<string, QueryValue>) => {
  const url = new URL(`${API_URL}${path}`)
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value))
    }
  }
  return url.toString()
}

export async function apiRequest<T>(
  path: string,
  {
    method = "GET",
    query,
    body,
    schema,
    signal,
    auth = true,
  }: RequestOptions<T>
): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" }
  if (body !== undefined) headers["Content-Type"] = "application/json"

  const token = auth ? useAuthStore.getState().token : null
  if (token) headers.Authorization = `Bearer ${token}`

  let response: Response
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    })
  } catch (error) {
    if ((error as Error).name === "AbortError") throw error
    throw new ApiError("Can't reach the server. Check your connection.", 0)
  }

  const json = await response.json().catch(() => null)
  const envelope = envelopeSchema.safeParse(json)

  if (!response.ok || !envelope.success || !envelope.data.success) {
    // Expired or invalid session: drop it; the auth guard sends us to /login.
    if (response.status === 401 && auth) useAuthStore.getState().logout()

    throw new ApiError(
      (envelope.success && envelope.data.message) ||
        `Request failed (${response.status})`,
      response.status,
      (envelope.success && envelope.data.errors) || {}
    )
  }

  const parsed = schema.safeParse(envelope.data.data)
  if (!parsed.success) {
    console.error(`Unexpected response shape from ${path}`, parsed.error)
    throw new ApiError(
      "The server sent an unexpected response.",
      response.status
    )
  }

  return parsed.data
}
