import EditPatientPageUI from "@/features/patients/edit-patient/EditPatientPageUI"

export default async function EditPatientPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return <EditPatientPageUI id={id} />
}
