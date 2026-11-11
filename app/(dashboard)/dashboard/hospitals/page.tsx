import type { Metadata } from "next"
import DirectoryPageUI from "@/features/directory/DirectoryPageUI"

export const metadata: Metadata = {
  title: "Hospitals",
  description: "Manage the hospitals doctors can be assigned to.",
}

export default function HospitalsPage() {
  return <DirectoryPageUI kind="hospital" />
}
