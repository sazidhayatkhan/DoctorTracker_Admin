"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import DoctorLoader from "../components/DoctorLoader"
import DoctorPatients from "./components/DoctorPatients"
import DoctorProfileCard from "./components/DoctorProfileCard"

type DoctorDetailsUIProps = {
  id: string
}

const DoctorDetailsUI = ({ id }: DoctorDetailsUIProps) => (
  <DoctorLoader id={id}>
    {(doctor) => (
      <div className="space-y-6">
        <Link
          href="/dashboard/doctors"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to doctors
        </Link>

        <DoctorProfileCard doctor={doctor} />

        <DoctorPatients doctor={doctor} />
      </div>
    )}
  </DoctorLoader>
)

export default DoctorDetailsUI
