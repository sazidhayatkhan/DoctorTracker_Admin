import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { Doctor, Patient } from "../data"
import DoctorProfileCard from "./components/DoctorProfileCard"
import DoctorPatients from "./components/DoctorPatients"

type DoctorDetailsUIProps = {
  doctor: Doctor
  patients: Patient[]
}

const DoctorDetailsUI = ({ doctor, patients }: DoctorDetailsUIProps) => {
  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/doctors"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to doctors
      </Link>

      <DoctorProfileCard doctor={doctor} />

      <DoctorPatients doctor={doctor} initialPatients={patients} />
    </div>
  )
}

export default DoctorDetailsUI
