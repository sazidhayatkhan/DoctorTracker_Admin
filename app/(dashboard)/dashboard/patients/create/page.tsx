import type { Metadata } from "next"
import CreatePatientPageUI from "@/features/patients/create-patient/CreatePatientPageUI"

export const metadata: Metadata = {
  title: "Add Patient",
  description: "Register a new patient.",
}

export default function CreatePatientPage() {
  return <CreatePatientPageUI />
}
