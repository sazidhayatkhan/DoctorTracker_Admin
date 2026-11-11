import { z } from "zod"

import { apiRequest } from "@/lib/api/client"
import {
  doctorPageSchema,
  doctorPatientSchema,
  doctorSchema,
  doctorStatsSchema,
  lookupOptionSchema,
  type DoctorListParams,
  type DoctorPayload,
} from "./schemas"

/* ── Doctors ─────────────────────────────────────────────────────────── */

export const fetchDoctors = (params: DoctorListParams, signal?: AbortSignal) =>
  apiRequest("/doctors", {
    query: { ...params, q: params.q?.trim() },
    schema: doctorPageSchema,
    signal,
  })

export const fetchDoctor = (id: string, signal?: AbortSignal) =>
  apiRequest(`/doctors/${id}`, { schema: doctorSchema, signal })

export const createDoctor = (data: DoctorPayload) =>
  apiRequest("/doctors", { method: "POST", body: data, schema: doctorSchema })

export const updateDoctor = (id: string, data: DoctorPayload) =>
  apiRequest(`/doctors/${id}`, {
    method: "PUT",
    body: data,
    schema: doctorSchema,
  })

export const deleteDoctor = (id: string) =>
  // The deleted record isn't populated, so its shape isn't checked.
  apiRequest(`/doctors/${id}`, { method: "DELETE", schema: z.unknown() })

/** Stats tiles: totals and doctors added this month */
export const fetchDoctorStats = (signal?: AbortSignal) =>
  apiRequest("/analytics/overview", { schema: doctorStatsSchema, signal })

/* ── Doctor ↔ patient assignments ────────────────────────────────────── */

export const fetchDoctorPatients = (doctorId: string, signal?: AbortSignal) =>
  apiRequest(`/doctors/${doctorId}/patients`, {
    schema: z.array(doctorPatientSchema),
    signal,
  })

export const assignPatient = (
  doctorId: string,
  data: { patientId: string; condition: string }
) =>
  apiRequest(`/doctors/${doctorId}/patients`, {
    method: "POST",
    body: data,
    schema: doctorPatientSchema,
  })

export const unassignPatient = (doctorId: string, patientId: string) =>
  apiRequest(`/doctors/${doctorId}/patients/${patientId}`, {
    method: "DELETE",
    schema: z.unknown(),
  })

/* ── Hospitals & specializations ─────────────────────────────────────── */

export const fetchHospitalOptions = (signal?: AbortSignal) =>
  apiRequest("/hospitals/options", {
    schema: z.array(lookupOptionSchema),
    signal,
  })

export const createHospital = (name: string) =>
  apiRequest("/hospitals", {
    method: "POST",
    body: { name },
    schema: lookupOptionSchema,
  })

export const fetchSpecializationOptions = (signal?: AbortSignal) =>
  apiRequest("/specializations/options", {
    schema: z.array(lookupOptionSchema),
    signal,
  })

export const createSpecialization = (name: string) =>
  apiRequest("/specializations", {
    method: "POST",
    body: { name },
    schema: lookupOptionSchema,
  })
