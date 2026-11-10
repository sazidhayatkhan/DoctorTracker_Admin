import Link from "next/link"
import { Building2, ChevronRight, Stethoscope } from "lucide-react"

import { specializationStyles } from "@/features/doctors/data"
import { formatDate, getInitials } from "@/features/doctors/utils"
import type { DoctorAssignment } from "../data"

type AssignedDoctorsProps = {
  assignments: DoctorAssignment[]
}

const AssignedDoctors = ({ assignments }: AssignedDoctorsProps) => (
  <section className="border bg-card shadow-xs">
    <div className="flex items-center justify-between border-b px-4 py-3">
      <h2 className="flex items-center gap-2 text-sm font-semibold">
        Assigned Doctors
        <span className="bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground tabular-nums">
          {assignments.length}
        </span>
      </h2>
    </div>

    {assignments.length > 0 ? (
      <ul className="divide-y">
        {assignments.map(({ doctor, condition, assignedAt }) => (
          <li key={doctor.id}>
            <Link
              href={`/dashboard/doctors/${doctor.id}`}
              className="group flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/50"
            >
              <div className="flex size-9 shrink-0 items-center justify-center bg-primary/10 text-xs font-semibold text-primary">
                {getInitials(doctor.name)}
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium group-hover:text-primary">
                    {doctor.name}
                  </p>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>

                <span
                  className={`inline-block px-1.5 py-0.5 text-[11px] font-medium ${
                    specializationStyles[doctor.specialization] ??
                    "bg-primary/10 text-primary"
                  }`}
                >
                  {doctor.specialization}
                </span>

                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Building2 className="size-3 shrink-0" />
                  <span className="truncate">{doctor.hospital}</span>
                </p>

                <p className="text-xs text-muted-foreground">
                  <span className="text-foreground">{condition}</span>
                  {" · since "}
                  {formatDate(assignedAt)}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    ) : (
      <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
        <div className="flex size-10 items-center justify-center bg-muted">
          <Stethoscope className="size-5 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium">No doctors assigned</p>
        <p className="text-xs text-muted-foreground">
          This patient hasn&apos;t been assigned to a doctor yet.
        </p>
      </div>
    )}
  </section>
)

export default AssignedDoctors
