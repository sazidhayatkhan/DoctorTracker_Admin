import type { Metadata } from "next"
import DoctorComingSoonUI from "@/features/welcome/DoctorComingSoonUI"

export const metadata: Metadata = {
  title: "Doctor Portal",
  description: "The doctor portal is coming soon.",
}

export default function DoctorPage() {
  return <DoctorComingSoonUI />
}
