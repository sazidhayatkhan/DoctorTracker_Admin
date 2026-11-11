import type { Metadata } from "next"
import PatientDetailsUI from "@/features/patients/details-patient/PatientDetailsUI"

export const metadata: Metadata = {
  title: "Patient Details",
  description: "A patient's details and assigned doctors.",
}

export default async function PatientDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <PatientDetailsUI id={id} />
}
