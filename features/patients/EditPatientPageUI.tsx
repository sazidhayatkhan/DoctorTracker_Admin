"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import EditPatientForm from "./components/EditPatientForm"
import PatientLoader from "./components/PatientLoader"
import { formatPatientCode } from "./utils"

type EditPatientPageUIProps = {
  id: string
}

const EditPatientPageUI = ({ id }: EditPatientPageUIProps) => (
  <PatientLoader id={id}>
    {(patient) => (
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
              Update {patient.name}&apos;s details (
              {formatPatientCode(patient.patientCode)}).
            </p>
          </div>
        </div>

        {/* Keyed by ID so the form re-initializes for a different patient */}
        <EditPatientForm key={patient.id} patient={patient} />
      </div>
    )}
  </PatientLoader>
)

export default EditPatientPageUI
