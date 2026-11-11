"use client"

import Link from "next/link"
import {
  ArrowLeft,
  Cake,
  CalendarDays,
  Hash,
  Mail,
  MapPin,
  Pencil,
  Phone,
  UserRound,
  type LucideIcon,
} from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { formatDate, getInitials } from "@/features/doctors/utils"
import AssignedDoctors from "./components/AssignedDoctors"
import MobileCollapse from "./components/MobileCollapse"
import PatientCard from "./components/PatientCard"
import PatientLoader from "../components/PatientLoader"
import type { Patient } from "../schemas"
import { formatAge, formatPatientCode } from "../utils"

type PatientDetailsUIProps = {
  id: string
}

const PatientDetailsUI = ({ id }: PatientDetailsUIProps) => (
  <PatientLoader id={id}>
    {(patient) => <PatientDetails patient={patient} />}
  </PatientLoader>
)

const PatientDetails = ({ patient }: { patient: Patient }) => {
  const editHref = `/dashboard/patients/${patient.id}/edit`

  return (
    <div className="max-w-7xl space-y-6">
      <Link
        href="/dashboard/patients"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to patients
      </Link>

      <div className="grid items-start gap-6 md:grid-cols-2">
        <aside className="md:sticky md:top-6 md:order-last">
          <PatientCard patient={patient} />
        </aside>

        <div className="min-w-0 space-y-6">
          <section className="border bg-card shadow-xs">
            {/* Header */}
            <div className="flex items-center gap-4 border-b p-5">
              <div className="flex size-14 shrink-0 items-center justify-center bg-primary/10 text-lg font-semibold text-primary">
                {getInitials(patient.name)}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="truncate text-xl font-semibold tracking-tight">
                  {patient.name}
                </h1>
                <p className="font-mono text-xs text-muted-foreground">
                  {formatPatientCode(patient.patientCode)}
                </p>
              </div>
              <Link
                href={editHref}
                aria-label="Edit patient"
                className={buttonVariants({
                  variant: "outline",
                  className: "shrink-0",
                })}
              >
                <Pencil />
                <span className="hidden sm:inline">Edit Patient</span>
              </Link>
            </div>

            {/* Details — collapsed behind a toggle on mobile only */}
            <MobileCollapse
              showLabel="Show patient details"
              hideLabel="Hide patient details"
            >
              <dl className="grid xl:grid-cols-2">
                <DetailItem
                  icon={Hash}
                  label="Patient ID"
                  value={formatPatientCode(patient.patientCode)}
                  mono
                />
                <DetailItem
                  icon={CalendarDays}
                  label="Created"
                  value={formatDate(patient.createdAt)}
                />
                <DetailItem
                  icon={Cake}
                  label="Date of birth"
                  value={`${formatDate(patient.birthDate)} (${formatAge(patient.birthDate)})`}
                />
                <DetailItem
                  icon={UserRound}
                  label="Gender"
                  value={patient.gender}
                />
                <DetailItem icon={Phone} label="Phone" value={patient.phone} />
                <DetailItem
                  icon={Mail}
                  label="Email"
                  value={patient.email || "—"}
                />
                <DetailItem
                  icon={MapPin}
                  label="Address"
                  value={patient.address}
                  className="xl:col-span-2"
                />
              </dl>
            </MobileCollapse>
          </section>

          <AssignedDoctors patientId={patient.id} />
        </div>
      </div>
    </div>
  )
}

const DetailItem = ({
  icon: Icon,
  label,
  value,
  mono,
  className,
}: {
  icon: LucideIcon
  label: string
  value: string
  mono?: boolean
  className?: string
}) => (
  <div
    className={`flex gap-3 border-b px-5 py-4 last:border-b-0 xl:odd:border-r ${className ?? ""}`}
  >
    <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
    <div className="min-w-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd
        className={`mt-0.5 text-sm font-medium wrap-break-word ${mono ? "font-mono" : ""}`}
      >
        {value}
      </dd>
    </div>
  </div>
)

export default PatientDetailsUI
