import type { Metadata } from "next"
import EditDoctorPageUI from "@/features/doctors/edit-doctor/EditDoctorPageUI"

export const metadata: Metadata = {
  title: "Edit Doctor",
  description: "Update a doctor's profile.",
}

export default async function EditDoctorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <EditDoctorPageUI id={id} />
}
