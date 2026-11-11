import { z } from "zod"

/** One point of a chart series */
export type Datum = { label: string; value: number; href?: string }

const datumSchema = z.object({ label: z.string(), value: z.number() })

const overviewSchema = z.object({
  totalDoctors: z.number(),
  totalPatients: z.number(),
  totalHospitals: z.number(),
  totalSpecializations: z.number(),
  totalAssignments: z.number(),
  newPatientsThisMonth: z.number(),
  newPatientsLastMonth: z.number(),
  /** % change vs last month; null when last month had none */
  newPatientsChangePct: z.number().nullable(),
  newDoctorsThisMonth: z.number(),
  timezone: z.string(),
})

const registrationSchema = z.object({
  /** yyyy-mm */
  month: z.string(),
  /** e.g. "Nov 2026" */
  label: z.string(),
  value: z.number(),
})

const patientsPerDoctorSchema = z.object({
  doctorId: z.string(),
  label: z.string(),
  specialization: z.string().nullable(),
  value: z.number(),
})

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

/**
 * Short x-axis label for a yyyy-mm key: "Nov", plus the year on the first
 * column and on every January so a range spanning years stays readable.
 */
const monthAxisLabel = (key: string, index: number) => {
  const [year, month] = key.split("-").map(Number)
  const name = MONTH_NAMES[month - 1] ?? key
  return index === 0 || month === 1 ? `${name} '${String(year).slice(2)}` : name
}

/** GET /analytics/dashboard, shaped for the chart components */
export const dashboardSchema = z
  .object({
    overview: overviewSchema,
    registrations: z.array(registrationSchema),
    gender: z.array(datumSchema),
    ageGroups: z.array(datumSchema),
    patientsPerDoctor: z.array(patientsPerDoctorSchema),
  })
  .transform(({ registrations, patientsPerDoctor, ...rest }) => ({
    ...rest,
    registrations: registrations.map((r, i): Datum => ({
      label: monthAxisLabel(r.month, i),
      value: r.value,
    })),
    patientsPerDoctor: patientsPerDoctor.map((d): Datum => ({
      label: d.label,
      value: d.value,
      href: `/dashboard/doctors/${d.doctorId}`,
    })),
  }))

export type Dashboard = z.output<typeof dashboardSchema>

export const REGISTRATION_PERIODS = [3, 6, 12] as const
export type RegistrationPeriod = (typeof REGISTRATION_PERIODS)[number]

export type DashboardParams = {
  months: RegistrationPeriod
  /** How many doctors the workload chart ranks */
  limit: number
}
