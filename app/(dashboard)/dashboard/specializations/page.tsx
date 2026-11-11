import type { Metadata } from "next"
import DirectoryPageUI from "@/features/directory/DirectoryPageUI"

export const metadata: Metadata = {
  title: "Specializations",
  description: "Manage the medical specializations doctors can have.",
}

export default function SpecializationsPage() {
  return <DirectoryPageUI kind="specialization" />
}
