import Link from "next/link"
import { Building2, CalendarDays, Mail, Pencil, Phone } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { Doctor, specializationStyles } from "../../data"
import { formatDate, getInitials } from "../../utils"

type DoctorProfileCardProps = {
  doctor: Doctor
}

const DoctorProfileCard = ({ doctor }: DoctorProfileCardProps) => {
  const editHref = `/dashboard/doctors/${doctor.id}/edit`

  const details = [
    { icon: Mail, label: "Email", value: doctor.email },
    { icon: Phone, label: "Phone", value: doctor.phone },
    { icon: Building2, label: "Hospital", value: doctor.hospital },
    {
      icon: CalendarDays,
      label: "Joined",
      value: formatDate(doctor.createdAt),
    },
  ]

  return (
    <section className="border bg-card p-5 shadow-xs">
      <div className="flex flex-col gap-5 md:flex-row md:items-center">
        <div className="flex items-center gap-4 md:w-72 md:shrink-0">
          <div className="flex size-14 shrink-0 items-center justify-center bg-primary/10 text-lg font-semibold text-primary">
            {getInitials(doctor.name)}
          </div>
          <div className="min-w-0 flex-1 space-y-1.5">
            <h1 className="truncate text-xl font-semibold tracking-tight">
              {doctor.name}
            </h1>
            <span
              className={`inline-flex px-2.5 py-1 text-xs font-medium ${
                specializationStyles[doctor.specialization] ??
                "bg-primary/10 text-primary"
              }`}
            >
              {doctor.specialization}
            </span>
          </div>
          {/* Mobile edit button sits beside the name */}
          <Link
            href={editHref}
            aria-label="Edit doctor"
            className={buttonVariants({
              variant: "outline",
              size: "icon",
              className: "md:hidden",
            })}
          >
            <Pencil />
          </Link>
        </div>

        <dl className="grid flex-1 grid-cols-1 gap-4 border-t pt-5 sm:grid-cols-2 md:border-t-0 md:border-l md:pt-0 md:pl-5 lg:grid-cols-4">
          {details.map(({ icon: Icon, label, value }) => (
            <div key={label} className="min-w-0">
              <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Icon className="size-3.5" />
                {label}
              </dt>
              <dd className="mt-1 truncate text-sm font-medium" title={value}>
                {value}
              </dd>
            </div>
          ))}
        </dl>

        <Link
          href={editHref}
          className={buttonVariants({
            variant: "outline",
            className: "hidden shrink-0 md:inline-flex",
          })}
        >
          <Pencil />
          Edit Profile
        </Link>
      </div>
    </section>
  )
}

export default DoctorProfileCard
