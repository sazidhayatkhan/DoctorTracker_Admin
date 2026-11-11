"use client"

import { useEffect } from "react"
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query"

import { analyticsKeys, doctorKeys, patientKeys } from "@/lib/query-keys"
import {
  createPatient,
  deletePatient,
  fetchPatient,
  fetchPatientDoctors,
  fetchPatients,
  updatePatient,
} from "./api"
import type {
  Patient,
  PatientFormData,
  PatientListParams,
  PatientPage,
} from "./schemas"

const listQueryOptions = (params: PatientListParams) => ({
  queryKey: patientKeys.list(params),
  queryFn: ({ signal }: { signal: AbortSignal }) =>
    fetchPatients(params, signal),
})

const detailQueryOptions = (id: string) => ({
  queryKey: patientKeys.detail(id),
  queryFn: ({ signal }: { signal: AbortSignal }) => fetchPatient(id, signal),
})

/** A patient already sitting in any cached list page, if there is one */
const findInLists = (queryClient: QueryClient, id: string) => {
  for (const [, page] of queryClient.getQueriesData<PatientPage>({
    queryKey: patientKeys.lists(),
  })) {
    const match = page?.items.find((p) => p.id === id)
    if (match) return match
  }
  return undefined
}

/* ── Queries ─────────────────────────────────────────────────────────── */

/** One page of the patient list. Keeps the previous page on screen while the next loads. */
export const usePatients = (params: PatientListParams) => {
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
 * A single patient. If the list already loaded them, that copy renders
 * immediately and is refreshed in the background.
 */
export const usePatient = (id: string) => {
  const queryClient = useQueryClient()

  return useQuery({
    ...detailQueryOptions(id),
    initialData: () => findInLists(queryClient, id),
    // Treat list data as old so a fresh copy is fetched behind it.
    initialDataUpdatedAt: 0,
  })
}

export const usePatientDoctors = (id: string) =>
  useQuery({
    queryKey: patientKeys.doctors(id),
    queryFn: ({ signal }) => fetchPatientDoctors(id, signal),
  })

/** Warm the cache on hover, so opening a patient renders without a spinner */
export const usePrefetchPatient = () => {
  const queryClient = useQueryClient()
  return (id: string) => queryClient.prefetchQuery(detailQueryOptions(id))
}

/* ── Mutations ───────────────────────────────────────────────────────── */

export const useCreatePatient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPatient,
    onSuccess: (patient) => {
      queryClient.setQueryData(patientKeys.detail(patient.id), patient)
      queryClient.invalidateQueries({ queryKey: analyticsKeys.all })
      return queryClient.invalidateQueries({ queryKey: patientKeys.lists() })
    },
  })
}

export const useUpdatePatient = (id: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: PatientFormData) => updatePatient(id, data),
    onSuccess: (patient) => {
      queryClient.setQueryData(patientKeys.detail(id), patient)
      // Doctors' patient lists show this patient's details.
      queryClient.invalidateQueries({ queryKey: doctorKeys.details() })
      return queryClient.invalidateQueries({ queryKey: patientKeys.lists() })
    },
  })
}

/** Removes the row from every cached page immediately; restores it if the delete fails */
export const useDeletePatient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deletePatient,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: patientKeys.lists() })

      const snapshot = queryClient.getQueriesData<PatientPage>({
        queryKey: patientKeys.lists(),
      })

      queryClient.setQueriesData<PatientPage>(
        { queryKey: patientKeys.lists() },
        (page) =>
          page && page.items.some((p) => p.id === id)
            ? {
                ...page,
                items: page.items.filter((p) => p.id !== id),
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
    onSuccess: (_patient, id) => {
      queryClient.removeQueries({ queryKey: patientKeys.detail(id) })
    },
    // Refetch so pages re-flow (the next patient moves up into this page).
    // Deleting a patient also removes their doctor assignments.
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: patientKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: doctorKeys.all }),
        queryClient.invalidateQueries({ queryKey: analyticsKeys.all }),
      ]),
  })
}

export { patientKeys }
export type { Patient }
