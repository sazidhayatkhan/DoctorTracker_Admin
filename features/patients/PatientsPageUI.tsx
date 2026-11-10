import Link from "next/link"
import { Plus } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import PatientTable from "./components/PatientTable"
import { patientRecords } from "./data"

const PatientsPageUI = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Patients</h1>
          <p className="text-sm text-muted-foreground">
            All registered patients and their contact details.
          </p>
        </div>

        <Link
          href="/dashboard/patients/create"
          className={buttonVariants({
            size: "lg",
            className: "w-full sm:w-auto",
          })}
        >
          <Plus />
          Add Patient
        </Link>
      </div>

      <PatientTable patients={patientRecords} />
    </div>
  )
}

export default PatientsPageUI
