"use client"

import type { ReactNode } from "react"

import ResourceLoader from "@/components/ResourceLoader"
import { useDoctor } from "../queries"
import type { Doctor } from "../schemas"

type DoctorLoaderProps = {
  id: string
  children: (doctor: Doctor) => ReactNode
}

/** Fetches a doctor and renders loading / not-found / error states around `children` */
const DoctorLoader = ({ id, children }: DoctorLoaderProps) => (
  <ResourceLoader
    query={useDoctor(id)}
    resourceName="doctor"
    backHref="/dashboard/doctors"
    backLabel="Back to doctors"
  >
    {children}
  </ResourceLoader>
)

export default DoctorLoader
