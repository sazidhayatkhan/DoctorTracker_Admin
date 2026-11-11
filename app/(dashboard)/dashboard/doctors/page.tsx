import type { Metadata } from "next"
import DoctorsPageUI from "@/features/doctors/DoctorsPageUI"

export const metadata: Metadata = {
  title: "Doctors",
  description: "Search and manage registered doctors.",
}

export default function DoctorsPage() {
  return <DoctorsPageUI />
}
