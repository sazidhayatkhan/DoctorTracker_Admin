import type { Metadata } from "next"
import CreateDoctorPageUI from "@/features/doctors/create-doctor/CreateDoctorPageUI"

export const metadata: Metadata = {
  title: "Add Doctor",
  description: "Register a new doctor.",
}

export default function CreateDoctorPage() {
  return <CreateDoctorPageUI />
}
