import PatientDetailsUI from "@/features/patients/details-patient/PatientDetailsUI"

export default async function PatientDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return <PatientDetailsUI id={id} />
}
