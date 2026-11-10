import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { getHospitals } from "../data"
import CreateDoctorForm from "./components/CreateDoctorForm"

const CreateDoctorPageUI = () => {
  const hospitals = getHospitals()

  return (
    <div className="max-w-4xl space-y-6">
      <div className="space-y-3">
        <Link
          href="/dashboard/doctors"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to doctors
        </Link>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Add Doctor</h1>
          <p className="text-sm text-muted-foreground">
            Register a new doctor and assign them to a hospital.
          </p>
        </div>
      </div>

      <CreateDoctorForm hospitals={hospitals} />
    </div>
  )
}

export default CreateDoctorPageUI
