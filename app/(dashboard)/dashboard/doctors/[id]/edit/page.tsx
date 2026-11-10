import { notFound } from "next/navigation"

import EditDoctorPageUI from "@/features/doctors/EditDoctorPageUI"
import { doctors } from "@/features/doctors/data"

export default async function EditDoctorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const doctor = doctors.find((d) => d.id === Number(id))

  if (!doctor) notFound()

  return <EditDoctorPageUI doctor={doctor} />
}
