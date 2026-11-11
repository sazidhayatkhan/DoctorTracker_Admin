import Link from "next/link"
import { Plus } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import DoctorFilter from "./components/DoctorFilter"
import DoctorStats from "./components/DoctorStats"
import DoctorTable from "./components/DoctorTable"

const DoctorsPageUI = () => {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Doctors</h1>
          <p className="text-sm text-muted-foreground">
            Manage all registered doctors, their hospitals and specializations.
          </p>
        </div>

        <Link
          href="/dashboard/doctors/create"
          className={buttonVariants({
            size: "lg",
            className: "w-full sm:w-auto",
          })}
        >
          <Plus />
          Add Doctor
        </Link>
      </div>

      <DoctorStats />

      {/* Directory card */}
      <section className="border bg-card shadow-xs">
        <div className="flex flex-col gap-4 border-b p-4">
          <div>
            <h2 className="text-sm font-semibold">Doctor Directory</h2>
            <p className="text-xs text-muted-foreground">
              Search and filter by specialization or registration date.
            </p>
          </div>
          <DoctorFilter />
        </div>

        <DoctorTable />
      </section>
    </div>
  )
}

export default DoctorsPageUI
