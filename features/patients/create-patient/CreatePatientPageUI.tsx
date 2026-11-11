import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import CreatePatientForm from "./components/CreatePatientForm"

const CreatePatientPageUI = () => {
  return (
    <div className="max-w-4xl space-y-6">
      <div className="space-y-3">
        <Link
          href="/dashboard/patients"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to patients
        </Link>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Add Patient</h1>
          <p className="text-sm text-muted-foreground">
            Register a new patient. You can assign them to a doctor afterwards.
          </p>
        </div>
      </div>

      <CreatePatientForm />
    </div>
  )
}

export default CreatePatientPageUI
