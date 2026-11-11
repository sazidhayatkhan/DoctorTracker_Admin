import EditDoctorPageUI from "@/features/doctors/edit-doctor/EditDoctorPageUI"

export default async function EditDoctorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return <EditDoctorPageUI id={id} />
}
