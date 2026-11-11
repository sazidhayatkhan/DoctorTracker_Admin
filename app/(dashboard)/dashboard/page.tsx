import type { Metadata } from "next"
import DashboardPageUI from "@/features/dashboard/DashboardPageUI"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Overview of doctors, patients, registrations and workload.",
}

export default function DashboardPage() {
  return <DashboardPageUI />
}
