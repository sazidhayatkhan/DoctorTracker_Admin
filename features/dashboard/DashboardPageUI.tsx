"use client"

import { useState } from "react"
import {
  AlertCircle,
  Link2,
  Loader2,
  Stethoscope,
  UserPlus,
  UsersRound,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getErrorMessage } from "@/lib/api/errors"
import StatTile from "./components/StatTile"
import {
  BarList,
  ChartCard,
  ColumnChart,
  SegmentedBar,
} from "./components/charts"
import { useDashboard } from "./queries"
import { REGISTRATION_PERIODS, type RegistrationPeriod } from "./schemas"

// Categorical slots 1/5/7 (blue, magenta, violet), stepped per mode.
// Validated: adjacent CVD ΔE ≥ 13 light / 15.9 dark. Light magenta is < 3:1
// on white, so the legend always prints counts + shares (relief rule).
const genderColors: Record<string, string> = {
  Male: "bg-[#2a78d6] dark:bg-[#3987e5]",
  Female: "bg-[#e87ba4] dark:bg-[#d55181]",
  Other: "bg-[#6250d6] dark:bg-[#9085e9]",
}

/** Doctors ranked in the workload chart */
const TOP_DOCTORS = 10

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`

const DashboardPageUI = () => {
  const [months, setMonths] = useState<RegistrationPeriod>(6)
  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
    isPlaceholderData,
  } = useDashboard({ months, limit: TOP_DOCTORS })

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            An overview of doctors, patients and registrations.
          </p>
        </div>
        {isFetching && !isPending && (
          <Loader2
            className="mt-2 size-4 animate-spin text-muted-foreground"
            aria-label="Refreshing"
          />
        )}
      </div>

      {isPending ? (
        <DashboardSkeleton />
      ) : isError && !data ? (
        <div
          role="alert"
          className="flex flex-col items-center gap-3 border bg-card px-4 py-16 text-center shadow-xs"
        >
          <div className="flex size-12 items-center justify-center bg-destructive/10">
            <AlertCircle className="size-6 text-destructive" />
          </div>
          <div className="space-y-1">
            <p className="font-medium">Couldn&apos;t load the dashboard</p>
            <p className="text-xs text-muted-foreground">
              {getErrorMessage(error)}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      ) : (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatTile
              label="Total doctors"
              value={data.overview.totalDoctors}
              icon={Stethoscope}
              hint={`Across ${plural(data.overview.totalHospitals, "hospital")}`}
            />
            <StatTile
              label="Total patients"
              value={data.overview.totalPatients}
              icon={UsersRound}
              hint="Registered patients"
            />
            <StatTile
              label="New patients this month"
              value={data.overview.newPatientsThisMonth}
              icon={UserPlus}
              delta={{
                value:
                  data.overview.newPatientsThisMonth -
                  data.overview.newPatientsLastMonth,
                period: "last month",
              }}
            />
            <StatTile
              label="Doctor assignments"
              value={data.overview.totalAssignments}
              icon={Link2}
              hint="Patient–doctor links"
            />
          </div>

          {/* Registrations trend + gender split */}
          <div className="grid gap-4 lg:grid-cols-3">
            <ChartCard
              title="New patient registrations"
              description={`Patients registered per month, last ${months} months`}
              table={data.registrations}
              className="lg:col-span-2"
              action={
                <PeriodSwitcher
                  value={months}
                  onChange={setMonths}
                  disabled={isPlaceholderData}
                />
              }
            >
              <div
                className={`transition-opacity ${isPlaceholderData ? "opacity-50" : ""}`}
              >
                <ColumnChart
                  data={data.registrations}
                  unit="patients"
                  labelIndex={data.registrations.length - 1}
                />
              </div>
            </ChartCard>

            <ChartCard
              title="Patients by gender"
              description="Share of all registered patients"
              table={data.gender}
            >
              <SegmentedBar
                data={data.gender}
                colors={genderColors}
                unit="patients"
              />
            </ChartCard>
          </div>

          {/* Workload + age distribution */}
          <div className="grid gap-4 lg:grid-cols-3">
            <ChartCard
              title="Patients per doctor"
              description={`Top ${TOP_DOCTORS} doctors by assigned patients — select a doctor to open their profile`}
              table={data.patientsPerDoctor}
              className="lg:col-span-2"
            >
              {data.patientsPerDoctor.length > 0 ? (
                <BarList data={data.patientsPerDoctor} unit="patients" />
              ) : (
                <p className="py-10 text-center text-xs text-muted-foreground">
                  No doctors yet.
                </p>
              )}
            </ChartCard>

            <ChartCard
              title="Patients by age group"
              description="Age today, from date of birth"
              table={data.ageGroups}
            >
              <ColumnChart data={data.ageGroups} unit="patients" height={160} />
            </ChartCard>
          </div>
        </>
      )}
    </div>
  )
}

const PeriodSwitcher = ({
  value,
  onChange,
  disabled,
}: {
  value: RegistrationPeriod
  onChange: (months: RegistrationPeriod) => void
  disabled?: boolean
}) => (
  <div role="group" aria-label="Period" className="flex border">
    {REGISTRATION_PERIODS.map((m) => (
      <button
        key={m}
        type="button"
        aria-pressed={value === m}
        disabled={disabled}
        onClick={() => onChange(m)}
        className={`px-2.5 py-1 text-xs font-medium tabular-nums transition-colors disabled:cursor-wait ${
          value === m
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}
      >
        {m}M
      </button>
    ))}
  </div>
)

const DashboardSkeleton = () => (
  <div className="space-y-6" aria-busy="true" aria-label="Loading dashboard">
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="space-y-3 border bg-card p-4 shadow-xs">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-28" />
        </div>
      ))}
    </div>
    {[0, 1].map((row) => (
      <div key={row} className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 border bg-card p-5 shadow-xs lg:col-span-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-44 w-full" />
        </div>
        <div className="space-y-4 border bg-card p-5 shadow-xs">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-44 w-full" />
        </div>
      </div>
    ))}
  </div>
)

export default DashboardPageUI
