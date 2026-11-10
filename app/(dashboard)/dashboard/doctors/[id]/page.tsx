import { notFound } from "next/navigation"

import DoctorDetailsUI from "@/features/doctors/details-doctor/DoctorDetailsUI"
import { doctors, patients } from "@/features/doctors/data"

export default async function DoctorDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const doctor = doctors.find((d) => d.id === Number(id))

  if (!doctor) notFound()

  return (
    <DoctorDetailsUI
      doctor={doctor}
      patients={patients.filter((p) => p.doctorId === doctor.id)}
    />
  )
}
