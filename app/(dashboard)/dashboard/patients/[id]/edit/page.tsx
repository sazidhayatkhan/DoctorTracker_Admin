import type { Metadata } from "next"
import EditPatientPageUI from "@/features/patients/edit-patient/EditPatientPageUI"

export const metadata: Metadata = {
  title: "Edit Patient",
  description: "Update a patient's details.",
}

export default async function EditPatientPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <EditPatientPageUI id={id} />
}
