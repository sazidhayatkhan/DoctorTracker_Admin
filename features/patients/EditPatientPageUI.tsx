import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import EditPatientForm from "./components/EditPatientForm"
import type { PatientRecord } from "./data"

type EditPatientPageUIProps = {
  patient: PatientRecord
}

const EditPatientPageUI = ({ patient }: EditPatientPageUIProps) => {
  return (
    <div className="max-w-4xl space-y-6">
      <div className="space-y-3">
        <Link
          href={`/dashboard/patients/${patient.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to patient
        </Link>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Edit Patient
          </h1>
          <p className="text-sm text-muted-foreground">
            Update {patient.name}&apos;s details ({patient.id}).
          </p>
        </div>
      </div>

      <EditPatientForm patient={patient} />
    </div>
  )
}

export default EditPatientPageUI
