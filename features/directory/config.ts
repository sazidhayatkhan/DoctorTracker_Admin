import type { LucideIcon } from "lucide-react"
import { BriefcaseMedical, Building2 } from "lucide-react"

/**
 * Hospitals and specializations are the same kind of record (a unique name
 * plus one optional text field), so one directory UI serves both pages.
 */
export type DirectoryKind = "hospital" | "specialization"

export type DirectoryConfig = {
  kind: DirectoryKind
  /** Query-key root, shared with the dropdown options ([root, "options"]) */
  root: "hospitals" | "specializations"
  apiPath: "/hospitals" | "/specializations"
  singular: string
  plural: string
  pageDescription: string
  icon: LucideIcon
  /** The optional text field and its backend limit */
  detail: {
    field: "address" | "description"
    label: string
    placeholder: string
    max: number
  }
  /** Doctor-list filter that shows this record's doctors */
  doctorFilter: "hospitalId" | "specializationId"
}

export const NAME_MIN = 2
export const NAME_MAX = 150

export const hospitalConfig: DirectoryConfig = {
  kind: "hospital",
  root: "hospitals",
  apiPath: "/hospitals",
  singular: "Hospital",
  plural: "Hospitals",
  pageDescription: "Manage the hospitals doctors can be assigned to.",
  icon: Building2,
  detail: {
    field: "address",
    label: "Address",
    placeholder: "e.g. 18/F Bir Uttam Qazi Nuruzzaman Sarak, Dhaka",
    max: 300,
  },
  doctorFilter: "hospitalId",
}

export const specializationConfig: DirectoryConfig = {
  kind: "specialization",
  root: "specializations",
  apiPath: "/specializations",
  singular: "Specialization",
  plural: "Specializations",
  pageDescription: "Manage the medical specializations doctors can have.",
  icon: BriefcaseMedical,
  detail: {
    field: "description",
    label: "Description",
    placeholder: "e.g. Diagnosis and treatment of heart conditions",
    max: 500,
  },
  doctorFilter: "specializationId",
}

export const directoryConfigs: Record<DirectoryKind, DirectoryConfig> = {
  hospital: hospitalConfig,
  specialization: specializationConfig,
}
