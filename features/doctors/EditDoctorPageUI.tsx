import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import EditDoctorForm from "./components/EditDoctorForm"
import { getHospitals, type Doctor } from "./data"

type EditDoctorPageUIProps = {
  doctor: Doctor
}

const EditDoctorPageUI = ({ doctor }: EditDoctorPageUIProps) => {
  const profileHref = `/dashboard/doctors/${doctor.id}`

  return (
    <div className="max-w-4xl space-y-6">
      <div className="space-y-3">
        <Link
          href={profileHref}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to profile
        </Link>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Edit Doctor</h1>
          <p className="text-sm text-muted-foreground">
            Update {doctor.name}&apos;s profile information.
          </p>
        </div>
      </div>

      <EditDoctorForm doctor={doctor} hospitals={getHospitals()} />
    </div>
  )
}

export default EditDoctorPageUI
