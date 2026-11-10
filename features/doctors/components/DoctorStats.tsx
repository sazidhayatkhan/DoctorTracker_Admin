import { Building2, Stethoscope, UserPlus, UsersRound } from "lucide-react"

import type { Doctor } from "../data"

type DoctorStatsProps = {
  doctors: Doctor[]
}

const DoctorStats = ({ doctors }: DoctorStatsProps) => {
  const now = new Date()
  const addedThisMonth = doctors.filter((doctor) => {
    const created = new Date(doctor.createdAt)
    return (
      created.getMonth() === now.getMonth() &&
      created.getFullYear() === now.getFullYear()
    )
  }).length

  const stats = [
    {
      label: "Total Doctors",
      value: doctors.length,
      icon: UsersRound,
      accent: "bg-primary/10 text-primary",
    },
    {
      label: "Specializations",
      value: new Set(doctors.map((d) => d.specialization)).size,
      icon: Stethoscope,
      accent: "bg-violet-500/10 text-violet-600 dark:text-violet-300",
    },
    {
      label: "Hospitals",
      value: new Set(doctors.map((d) => d.hospital)).size,
      icon: Building2,
      accent: "bg-sky-500/10 text-sky-600 dark:text-sky-300",
    },
    {
      label: "Added This Month",
      value: addedThisMonth,
      icon: UserPlus,
      accent: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map(({ label, value, icon: Icon, accent }) => (
        <div
          key={label}
          className="flex items-center gap-4 border bg-card p-4 shadow-xs"
        >
          <div className={`flex size-10 shrink-0 items-center justify-center ${accent}`}>
            <Icon className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs text-muted-foreground">{label}</p>
            <p className="text-2xl font-semibold tabular-nums">{value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DoctorStats
