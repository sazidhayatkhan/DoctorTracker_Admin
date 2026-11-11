import type { Metadata } from "next"
import PatientsPageUI from "@/features/patients/PatientsPageUI"

export const metadata: Metadata = {
  title: "Patients",
  description: "Search and manage registered patients.",
}

export default function PatientsPage() {
  return <PatientsPageUI />
}
