"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import DoctorLoader from "../components/DoctorLoader"
import EditDoctorForm from "./components/EditDoctorForm"

type EditDoctorPageUIProps = {
  id: string
}

const EditDoctorPageUI = ({ id }: EditDoctorPageUIProps) => (
  <DoctorLoader id={id}>
    {(doctor) => (
      <div className="max-w-4xl space-y-6">
        <div className="space-y-3">
          <Link
            href={`/dashboard/doctors/${doctor.id}`}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to profile
          </Link>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Edit Doctor
            </h1>
            <p className="text-sm text-muted-foreground">
              Update {doctor.name}&apos;s profile information.
            </p>
          </div>
        </div>

        {/* Keyed by ID so the form re-initializes for a different doctor */}
        <EditDoctorForm key={doctor.id} doctor={doctor} />
      </div>
    )}
  </DoctorLoader>
)

export default EditDoctorPageUI
