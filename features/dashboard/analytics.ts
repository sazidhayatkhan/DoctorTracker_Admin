import { doctors, patients as assignments } from "@/features/doctors/data"
import { patientRecords, type PatientRecord } from "@/features/patients/data"
import { getAge } from "@/features/patients/utils"

// TODO: replace with an analytics endpoint (GET /analytics/overview).
// Everything here is derived from the mock doctors/patients so the
// dashboard agrees with the list pages.

export type Datum = { label: string; value: number; href?: string }

const monthKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`

const monthLabel = (d: Date) =>
  d.toLocaleDateString("en-GB", { month: "short" })

/** Patients registered per month, oldest → newest, ending this month */
export const getMonthlyRegistrations = (months = 6, now = new Date()) => {
  const buckets = Array.from({ length: months }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (months - 1 - i), 1)
    return { key: monthKey(d), label: monthLabel(d), value: 0 }
  })
  const byKey = new Map(buckets.map((b) => [b.key, b]))
  for (const p of patientRecords) {
    const bucket = byKey.get(p.createdAt.slice(0, 7))
    if (bucket) bucket.value++
  }
  return buckets.map(({ label, value }) => ({ label, value }))
}

export const getOverview = (now = new Date()) => {
  const thisMonth = monthKey(now)
  const lastMonth = monthKey(new Date(now.getFullYear(), now.getMonth() - 1, 1))
  const count = (key: string) =>
    patientRecords.filter((p) => p.createdAt.startsWith(key)).length

  return {
    totalDoctors: doctors.length,
    totalPatients: patientRecords.length,
    newThisMonth: count(thisMonth),
    newLastMonth: count(lastMonth),
    totalAssignments: assignments.length,
    hospitals: new Set(doctors.map((d) => d.hospital)).size,
  }
}

/** Assigned patients per doctor, most first */
export const getPatientsPerDoctor = (): Datum[] =>
  doctors
    .map((d) => ({
      label: d.name,
      value: assignments.filter((a) => a.doctorId === d.id).length,
      href: `/dashboard/doctors/${d.id}`,
    }))
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label))

export const genderOrder: PatientRecord["gender"][] = [
  "Male",
  "Female",
  "Other",
]

export const getGenderSplit = (): Datum[] =>
  genderOrder.map((g) => ({
    label: g,
    value: patientRecords.filter((p) => p.gender === g).length,
  }))

const ageGroups = [
  { label: "0–17", min: 0, max: 17 },
  { label: "18–34", min: 18, max: 34 },
  { label: "35–49", min: 35, max: 49 },
  { label: "50–64", min: 50, max: 64 },
  { label: "65+", min: 65, max: Infinity },
]

export const getAgeGroups = (): Datum[] =>
  ageGroups.map((g) => ({
    label: g.label,
    value: patientRecords.filter((p) => {
      const age = getAge(p.birthDate)
      return age >= g.min && age <= g.max
    }).length,
  }))
