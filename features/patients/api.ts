import { z } from "zod"

import { apiRequest } from "@/lib/api/client"
import {
  patientAssignmentSchema,
  patientPageSchema,
  patientSchema,
  type PatientFormData,
  type PatientListParams,
} from "./schemas"

export const fetchPatients = (
  { q, ...params }: PatientListParams,
  signal?: AbortSignal
) =>
  apiRequest("/patients", {
    // A leading "#" is how codes are displayed (#1001); search by the number.
    query: { ...params, q: q?.trim().replace(/^#/, "") },
    schema: patientPageSchema,
    signal,
  })

export const fetchPatient = (id: string, signal?: AbortSignal) =>
  apiRequest(`/patients/${id}`, { schema: patientSchema, signal })

export const fetchPatientDoctors = (id: string, signal?: AbortSignal) =>
  apiRequest(`/patients/${id}/doctors`, {
    schema: z.array(patientAssignmentSchema),
    signal,
  })

export const createPatient = (data: PatientFormData) =>
  apiRequest("/patients", {
    method: "POST",
    // The API treats a missing email as "none"; don't send "".
    body: { ...data, email: data.email || undefined },
    schema: patientSchema,
  })

/** An empty email removes it */
export const updatePatient = (id: string, data: PatientFormData) =>
  apiRequest(`/patients/${id}`, {
    method: "PUT",
    body: data,
    schema: patientSchema,
  })

export const deletePatient = (id: string) =>
  apiRequest(`/patients/${id}`, {
    method: "DELETE",
    schema: patientSchema,
  })
