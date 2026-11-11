import type { Metadata } from "next"
import DoctorDetailsUI from "@/features/doctors/details-doctor/DoctorDetailsUI"

export const metadata: Metadata = {
  title: "Doctor Details",
  description: "A doctor's profile and assigned patients.",
}

export default async function DoctorDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <DoctorDetailsUI id={id} />
}
