import DoctorDetailsUI from "@/features/doctors/details-doctor/DoctorDetailsUI"

export default async function DoctorDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return <DoctorDetailsUI id={id} />
}
