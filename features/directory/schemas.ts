import { z } from "zod"

import { paginationSchema } from "@/lib/api/schemas"

/** A hospital or specialization, with its optional text field as `detail` */
export const directoryItemSchema = z
  .object({
    _id: z.string(),
    name: z.string(),
    address: z.string().optional(),
    description: z.string().optional(),
    /** Active doctors; only on list responses */
    doctorCount: z.number().optional(),
    createdAt: z.string(),
  })
  .transform(({ _id, address, description, doctorCount, ...rest }) => ({
    ...rest,
    id: _id,
    detail: address ?? description ?? "",
    doctorCount: doctorCount ?? 0,
  }))

export type DirectoryItem = z.output<typeof directoryItemSchema>

export const directoryPageSchema = z.object({
  items: z.array(directoryItemSchema),
  pagination: paginationSchema,
})

export type DirectoryPage = z.output<typeof directoryPageSchema>

export type DirectoryListParams = {
  q?: string
  page: number
  limit: number
}

/** What the create / edit form submits */
export type DirectoryInput = {
  name: string
  /** "" = none (on edit: clears it) */
  detail: string
}
