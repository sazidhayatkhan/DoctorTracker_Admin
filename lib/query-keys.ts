/**
 * Every TanStack Query key in one place, from broad to specific, so a
 * mutation in one feature can invalidate another's cache without the
 * features importing each other. e.g. invalidate(patientKeys.lists())
 * refreshes every patient page/filter combination.
 */

export const patientKeys = {
  all: ["patients"] as const,
  lists: () => [...patientKeys.all, "list"] as const,
  list: (params: object) => [...patientKeys.lists(), params] as const,
  details: () => [...patientKeys.all, "detail"] as const,
  detail: (id: string) => [...patientKeys.details(), id] as const,
  doctors: (id: string) => [...patientKeys.detail(id), "doctors"] as const,
}

export const doctorKeys = {
  all: ["doctors"] as const,
  lists: () => [...doctorKeys.all, "list"] as const,
  list: (params: object) => [...doctorKeys.lists(), params] as const,
  details: () => [...doctorKeys.all, "detail"] as const,
  detail: (id: string) => [...doctorKeys.details(), id] as const,
  patients: (id: string) => [...doctorKeys.detail(id), "patients"] as const,
}

/** Hospital / specialization management lists; [root] also covers the options below */
export const directoryKeys = {
  all: (root: "hospitals" | "specializations") => [root] as const,
  list: (root: "hospitals" | "specializations", params: object) =>
    [root, "list", params] as const,
}

export const lookupKeys = {
  hospitals: ["hospitals", "options"] as const,
  specializations: ["specializations", "options"] as const,
}

export const analyticsKeys = {
  all: ["analytics"] as const,
  overview: () => [...analyticsKeys.all, "overview"] as const,
  dashboard: (params: object) =>
    [...analyticsKeys.all, "dashboard", params] as const,
}
