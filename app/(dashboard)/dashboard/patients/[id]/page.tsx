import { notFound } from "next/navigation"

import PatientDetailsPageUI from "@/features/patients/PatientDetailsPageUI"
import { patientRecords } from "@/features/patients/data"

export default async function PatientDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const patient = patientRecords.find((p) => p.id === id)

  if (!patient) notFound()

  return <PatientDetailsPageUI patient={patient} />
}
