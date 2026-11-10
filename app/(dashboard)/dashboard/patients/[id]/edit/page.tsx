import { notFound } from "next/navigation"

import EditPatientPageUI from "@/features/patients/EditPatientPageUI"
import { patientRecords } from "@/features/patients/data"

export default async function EditPatientPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const patient = patientRecords.find((p) => p.id === id)

  if (!patient) notFound()

  return <EditPatientPageUI patient={patient} />
}
