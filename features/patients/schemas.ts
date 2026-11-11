import { z } from "zod"

import { getAge, todayISO } from "./utils"

export const GENDERS = ["Male", "Female", "Other"] as const
export type Gender = (typeof GENDERS)[number]

/* ── API responses ───────────────────────────────────────────────────── */

/** A patient as returned by the API, normalized for the UI */
export const patientSchema = z
  .object({
    _id: z.string(),
    /** Human-readable 4-digit ID */
    patientCode: z.number(),
    name: z.string(),
    phone: z.string(),
    email: z.string().optional(),
    /** ISO datetime (UTC midnight of the birth date) */
    birthDate: z.string(),
    gender: z.enum(GENDERS),
    address: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .transform(({ _id, birthDate, email, ...rest }) => ({
    ...rest,
    id: _id,
    email: email ?? "",
    /** yyyy-mm-dd, the format the form and age helpers use */
    birthDate: birthDate.slice(0, 10),
  }))

export type Patient = z.output<typeof patientSchema>

export const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
  hasNextPage: z.boolean(),
  hasPrevPage: z.boolean(),
})

export const patientPageSchema = z.object({
  items: z.array(patientSchema),
  pagination: paginationSchema,
})

export type PatientPage = z.output<typeof patientPageSchema>

const namedRefSchema = z
  .object({ _id: z.string(), name: z.string() })
  .nullable()
  .optional()

/** A doctor this patient is assigned to, with the reason for the visit */
export const patientAssignmentSchema = z
  .object({
    _id: z.string(),
    condition: z.string(),
    createdAt: z.string(),
    doctor: z.object({
      _id: z.string(),
      name: z.string(),
      hospital: namedRefSchema,
      specialization: namedRefSchema,
    }),
  })
  .transform(({ _id, createdAt, doctor, condition }) => ({
    id: _id,
    condition,
    assignedAt: createdAt,
    doctor: {
      id: doctor._id,
      name: doctor.name,
      hospital: doctor.hospital?.name ?? "—",
      specialization: doctor.specialization?.name ?? "—",
    },
  }))

export type PatientAssignment = z.output<typeof patientAssignmentSchema>

/* ── Form ────────────────────────────────────────────────────────────── */

/** Create / edit form — mirrors the backend's validation */
export const patientFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  phone: z
    .string()
    .trim()
    .min(1, "Phone is required.")
    .refine((v) => v.replace(/\D/g, "").length >= 8, "Enter a valid phone number."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .refine((v) => !v || z.email().safeParse(v).success, "Enter a valid email address."),
  birthDate: z
    .string()
    .min(1, "Birth date is required.")
    .refine((v) => v <= todayISO(), "Birth date can't be in the future.")
    .refine((v) => getAge(v) <= 130, "Enter a valid birth date."),
  gender: z.enum(GENDERS, "Select a gender."),
  address: z.string().trim().min(1, "Address is required."),
})

export type PatientFormData = z.output<typeof patientFormSchema>

/* ── List params ─────────────────────────────────────────────────────── */

export type PatientListParams = {
  q?: string
  from?: string
  to?: string
  page: number
  limit: number
}
