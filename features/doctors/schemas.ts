import { z } from "zod"

import {
  namedRefSchema,
  optionalNamedRefSchema,
  paginationSchema,
} from "@/lib/api/schemas"
import { patientSchema } from "@/features/patients/schemas"

/* ── API responses ───────────────────────────────────────────────────── */

/** A doctor as returned by the API, normalized for the UI */
export const doctorSchema = z
  .object({
    _id: z.string(),
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    hospital: optionalNamedRefSchema,
    specialization: optionalNamedRefSchema,
    isActive: z.boolean().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
    /** Only on list responses */
    patientCount: z.number().optional(),
  })
  .transform(({ _id, ...rest }) => ({ ...rest, id: _id }))

export type Doctor = z.output<typeof doctorSchema>

export const doctorPageSchema = z.object({
  items: z.array(doctorSchema),
  pagination: paginationSchema,
})

export type DoctorPage = z.output<typeof doctorPageSchema>

/** A patient assigned to a doctor, with the reason for the visit */
export const doctorPatientSchema = z
  .object({
    _id: z.string(),
    condition: z.string(),
    createdAt: z.string(),
    patient: patientSchema,
  })
  .transform(({ _id, condition, createdAt, patient }) => ({
    id: _id,
    condition,
    assignedAt: createdAt,
    patient,
  }))

export type DoctorPatient = z.output<typeof doctorPatientSchema>

/** A hospital / specialization choice */
export const lookupOptionSchema = namedRefSchema
export type LookupOption = z.output<typeof lookupOptionSchema>

/** The figures behind the doctor stats tiles (from /analytics/overview) */
export const doctorStatsSchema = z.object({
  totalDoctors: z.number(),
  totalSpecializations: z.number(),
  totalHospitals: z.number(),
  newDoctorsThisMonth: z.number(),
})

export type DoctorStats = z.output<typeof doctorStatsSchema>

/* ── Form ────────────────────────────────────────────────────────────── */

/**
 * Create / edit form — mirrors the backend's validation. Hospital and
 * specialization are entered by name; the form resolves them to IDs.
 */
export const doctorFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Email is required.")
    .pipe(z.email("Enter a valid email address.")),
  phone: z
    .string()
    .trim()
    .min(1, "Phone is required.")
    .refine((v) => v.length >= 8, "Enter a valid phone number."),
  hospital: z.string().trim().min(1, "Hospital is required."),
  specialization: z.string().trim().min(1, "Specialization is required."),
})

export type DoctorFormValues = z.input<typeof doctorFormSchema>

/** What the API takes to create / update a doctor */
export type DoctorPayload = {
  name: string
  email: string
  phone: string
  hospitalId: string
  specializationId: string
}

/* ── List params ─────────────────────────────────────────────────────── */

export type DoctorListParams = {
  q?: string
  specializationId?: string
  from?: string
  to?: string
  page: number
  limit: number
}
