"use client"

import { useEffect } from "react"
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query"

import {
  analyticsKeys,
  doctorKeys,
  lookupKeys,
  patientKeys,
} from "@/lib/query-keys"
import {
  assignPatient,
  createDoctor,
  createHospital,
  createSpecialization,
  deleteDoctor,
  fetchDoctor,
  fetchDoctorPatients,
  fetchDoctors,
  fetchDoctorStats,
  fetchHospitalOptions,
  fetchSpecializationOptions,
  unassignPatient,
  updateDoctor,
} from "./api"
import type {
  DoctorListParams,
  DoctorPage,
  DoctorPatient,
  DoctorPayload,
  LookupOption,
} from "./schemas"

/** Lookups change rarely: keep them fresh for 5 minutes */
const LOOKUP_STALE_TIME = 5 * 60 * 1000

const listQueryOptions = (params: DoctorListParams) => ({
  queryKey: doctorKeys.list(params),
  queryFn: ({ signal }: { signal: AbortSignal }) =>
    fetchDoctors(params, signal),
})

const detailQueryOptions = (id: string) => ({
  queryKey: doctorKeys.detail(id),
  queryFn: ({ signal }: { signal: AbortSignal }) => fetchDoctor(id, signal),
})

/** A doctor already sitting in any cached list page, if there is one */
const findInLists = (queryClient: QueryClient, id: string) => {
  for (const [, page] of queryClient.getQueriesData<DoctorPage>({
    queryKey: doctorKeys.lists(),
  })) {
    const match = page?.items.find((d) => d.id === id)
    if (match) return match
  }
  return undefined
}

/** Anything showing doctor details elsewhere: patients' "assigned doctors", stats */
const invalidateDoctorDependents = (queryClient: QueryClient) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: doctorKeys.lists() }),
    queryClient.invalidateQueries({ queryKey: patientKeys.details() }),
    queryClient.invalidateQueries({ queryKey: analyticsKeys.all }),
  ])

/* ── Queries ─────────────────────────────────────────────────────────── */

/** One page of the doctor list. Keeps the previous page on screen while the next loads. */
export const useDoctors = (params: DoctorListParams) => {
  const queryClient = useQueryClient()
  const query = useQuery({
    ...listQueryOptions(params),
    placeholderData: keepPreviousData,
  })

  // Prefetch the next page so "Next" feels instant.
  const hasNextPage = query.data?.pagination.hasNextPage
  useEffect(() => {
    if (hasNextPage && !query.isPlaceholderData) {
      queryClient.prefetchQuery(
        listQueryOptions({ ...params, page: params.page + 1 })
      )
    }
  }, [hasNextPage, query.isPlaceholderData, params, queryClient])

  return query
}

/**
 * A single doctor. If the list already loaded them, that copy renders
 * immediately and is refreshed in the background.
 */
export const useDoctor = (id: string) => {
  const queryClient = useQueryClient()

  return useQuery({
    ...detailQueryOptions(id),
    initialData: () => findInLists(queryClient, id),
    initialDataUpdatedAt: 0,
  })
}

/** Warm the cache on hover, so opening a doctor renders without a spinner */
export const usePrefetchDoctor = () => {
  const queryClient = useQueryClient()
  return (id: string) => queryClient.prefetchQuery(detailQueryOptions(id))
}

export const useDoctorStats = () =>
  useQuery({
    queryKey: analyticsKeys.overview(),
    queryFn: ({ signal }) => fetchDoctorStats(signal),
  })

export const useDoctorPatients = (doctorId: string) =>
  useQuery({
    queryKey: doctorKeys.patients(doctorId),
    queryFn: ({ signal }) => fetchDoctorPatients(doctorId, signal),
  })

export const useHospitalOptions = () =>
  useQuery({
    queryKey: lookupKeys.hospitals,
    queryFn: ({ signal }) => fetchHospitalOptions(signal),
    staleTime: LOOKUP_STALE_TIME,
  })

export const useSpecializationOptions = () =>
  useQuery({
    queryKey: lookupKeys.specializations,
    queryFn: ({ signal }) => fetchSpecializationOptions(signal),
    staleTime: LOOKUP_STALE_TIME,
  })

/* ── Mutations ───────────────────────────────────────────────────────── */

/** Adds the new option to the cached list straight away, sorted A–Z */
const useCreateLookup = (
  queryKey: readonly string[],
  create: (name: string) => Promise<LookupOption>
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: create,
    onSuccess: (option) => {
      queryClient.setQueryData<LookupOption[]>(queryKey, (prev = []) =>
        [...prev.filter((o) => o.id !== option.id), option].sort((a, b) =>
          a.name.localeCompare(b.name)
        )
      )
      queryClient.invalidateQueries({ queryKey: analyticsKeys.all })
    },
  })
}

export const useCreateHospital = () =>
  useCreateLookup(lookupKeys.hospitals, createHospital)

export const useCreateSpecialization = () =>
  useCreateLookup(lookupKeys.specializations, createSpecialization)

export const useCreateDoctor = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createDoctor,
    onSuccess: (doctor) => {
      queryClient.setQueryData(doctorKeys.detail(doctor.id), doctor)
      return invalidateDoctorDependents(queryClient)
    },
  })
}

export const useUpdateDoctor = (id: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: DoctorPayload) => updateDoctor(id, data),
    onSuccess: (doctor) => {
      queryClient.setQueryData(doctorKeys.detail(id), doctor)
      return invalidateDoctorDependents(queryClient)
    },
  })
}

/** Removes the row from every cached page immediately; restores it if the delete fails */
export const useDeleteDoctor = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteDoctor,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: doctorKeys.lists() })

      const snapshot = queryClient.getQueriesData<DoctorPage>({
        queryKey: doctorKeys.lists(),
      })

      queryClient.setQueriesData<DoctorPage>(
        { queryKey: doctorKeys.lists() },
        (page) =>
          page && page.items.some((d) => d.id === id)
            ? {
                ...page,
                items: page.items.filter((d) => d.id !== id),
                pagination: {
                  ...page.pagination,
                  total: Math.max(0, page.pagination.total - 1),
                },
              }
            : page
      )

      return { snapshot }
    },
    onError: (_error, _id, context) => {
      for (const [key, data] of context?.snapshot ?? []) {
        queryClient.setQueryData(key, data)
      }
    },
    onSuccess: (_result, id) => {
      queryClient.removeQueries({ queryKey: doctorKeys.detail(id) })
    },
    // Deleting a doctor also removes their patient assignments.
    onSettled: () => invalidateDoctorDependents(queryClient),
  })
}

/** After an assignment changes: the doctor's list, counts, the patient's doctors, stats */
const invalidateAssignment = (
  queryClient: QueryClient,
  doctorId: string,
  patientId: string
) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: doctorKeys.patients(doctorId) }),
    queryClient.invalidateQueries({ queryKey: doctorKeys.lists() }),
    queryClient.invalidateQueries({ queryKey: patientKeys.doctors(patientId) }),
    queryClient.invalidateQueries({ queryKey: analyticsKeys.all }),
  ])

export const useAssignPatient = (doctorId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { patientId: string; condition: string }) =>
      assignPatient(doctorId, data),
    onSuccess: (assignment) => {
      // Show it at the top right away; the refetch below confirms it.
      queryClient.setQueryData<DoctorPatient[]>(
        doctorKeys.patients(doctorId),
        (prev = []) => [
          assignment,
          ...prev.filter((a) => a.patient.id !== assignment.patient.id),
        ]
      )
      return invalidateAssignment(queryClient, doctorId, assignment.patient.id)
    },
  })
}

/** Removes the patient from the doctor's list immediately; restores it on failure */
export const useUnassignPatient = (doctorId: string) => {
  const queryClient = useQueryClient()
  const key = doctorKeys.patients(doctorId)

  return useMutation({
    mutationFn: (patientId: string) => unassignPatient(doctorId, patientId),
    onMutate: async (patientId) => {
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<DoctorPatient[]>(key)
      queryClient.setQueryData<DoctorPatient[]>(key, (prev) =>
        prev?.filter((a) => a.patient.id !== patientId)
      )
      return { previous }
    },
    onError: (_error, _patientId, context) => {
      queryClient.setQueryData(key, context?.previous)
    },
    onSettled: (_result, _error, patientId) =>
      invalidateAssignment(queryClient, doctorId, patientId),
  })
}
