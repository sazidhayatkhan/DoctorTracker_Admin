import { Link2, Stethoscope, UserPlus, UsersRound } from "lucide-react"

import StatTile from "./components/StatTile"
import {
  BarList,
  ChartCard,
  ColumnChart,
  SegmentedBar,
} from "./components/charts"
import {
  getAgeGroups,
  getGenderSplit,
  getMonthlyRegistrations,
  getOverview,
  getPatientsPerDoctor,
} from "./analytics"

// Categorical slots 1/5/7 (blue, magenta, violet), stepped per mode.
// Validated: adjacent CVD ΔE ≥ 13 light / 15.9 dark. Light magenta is < 3:1
// on white, so the legend always prints counts + shares (relief rule).
const genderColors: Record<string, string> = {
  Male: "bg-[#2a78d6] dark:bg-[#3987e5]",
  Female: "bg-[#e87ba4] dark:bg-[#d55181]",
  Other: "bg-[#6250d6] dark:bg-[#9085e9]",
}

const DashboardPageUI = () => {
  const overview = getOverview()
  const monthly = getMonthlyRegistrations(6)
  const perDoctor = getPatientsPerDoctor()
  const genders = getGenderSplit()
  const ages = getAgeGroups()

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          An overview of doctors, patients and registrations.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile
          label="Total doctors"
          value={overview.totalDoctors}
          icon={Stethoscope}
          hint={`Across ${overview.hospitals} hospitals`}
        />
        <StatTile
          label="Total patients"
          value={overview.totalPatients}
          icon={UsersRound}
          hint="Registered patients"
        />
        <StatTile
          label="New patients this month"
          value={overview.newThisMonth}
          icon={UserPlus}
          delta={{
            value: overview.newThisMonth - overview.newLastMonth,
            period: "last month",
          }}
        />
        <StatTile
          label="Doctor assignments"
          value={overview.totalAssignments}
          icon={Link2}
          hint="Patient–doctor links"
        />
      </div>

      {/* Registrations trend + gender split */}
      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard
          title="New patient registrations"
          description="Patients registered per month, last 6 months"
          table={monthly}
          className="lg:col-span-2"
        >
          <ColumnChart
            data={monthly}
            unit="patients"
            labelIndex={monthly.length - 1}
          />
        </ChartCard>

        <ChartCard
          title="Patients by gender"
          description="Share of all registered patients"
          table={genders}
        >
          <SegmentedBar data={genders} colors={genderColors} unit="patients" />
        </ChartCard>
      </div>

      {/* Workload + age distribution */}
      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard
          title="Patients per doctor"
          description="Assigned patients, most first — select a doctor to open their profile"
          table={perDoctor}
          className="lg:col-span-2"
        >
          <BarList data={perDoctor} unit="patients" />
        </ChartCard>

        <ChartCard
          title="Patients by age group"
          description="Age today, from date of birth"
          table={ages}
        >
          <ColumnChart data={ages} unit="patients" height={160} />
        </ChartCard>
      </div>
    </div>
  )
}

export default DashboardPageUI
