import type { Metadata } from "next"
import RoleSelectPageUI from "@/features/welcome/RoleSelectPageUI"

export const metadata: Metadata = {
  title: { absolute: "Doctor Tracker" },
  description: "Choose how you want to continue: as an admin or as a doctor.",
}

export default function Page() {
  return <RoleSelectPageUI />
}
