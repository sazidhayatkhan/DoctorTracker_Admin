import PatientDetailsPageUI from "@/features/patients/PatientDetailsPageUI"

export default async function PatientDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return <PatientDetailsPageUI id={id} />
}
