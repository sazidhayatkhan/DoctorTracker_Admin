import { z } from "zod"

/** `pagination` block of every paginated list response */
export const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
  hasNextPage: z.boolean(),
  hasPrevPage: z.boolean(),
})

export type Pagination = z.output<typeof paginationSchema>

/** A populated reference such as a doctor's hospital: { _id, name } → { id, name } */
export const namedRefSchema = z
  .object({ _id: z.string(), name: z.string() })
  .transform(({ _id, name }) => ({ id: _id, name }))

export type NamedRef = z.output<typeof namedRefSchema>

/** Same, but tolerant of a missing / unpopulated reference */
export const optionalNamedRefSchema = z
  .union([namedRefSchema, z.null(), z.undefined(), z.string()])
  .transform((ref) => (ref && typeof ref === "object" ? ref : null))
