"use client"

import type { ReactNode } from "react"

import ResourceLoader from "@/components/ResourceLoader"
import { usePatient } from "../queries"
import type { Patient } from "../schemas"

type PatientLoaderProps = {
  id: string
  children: (patient: Patient) => ReactNode
}

/** Fetches a patient and renders loading / not-found / error states around `children` */
const PatientLoader = ({ id, children }: PatientLoaderProps) => (
  <ResourceLoader
    query={usePatient(id)}
    resourceName="patient"
    backHref="/dashboard/patients"
    backLabel="Back to patients"
  >
    {children}
  </ResourceLoader>
)

export default PatientLoader
