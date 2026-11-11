import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query"

import {
  analyticsKeys,
  directoryKeys,
  doctorKeys,
  patientKeys,
} from "@/lib/query-keys"
import {
  createDirectoryItem,
  deleteDirectoryItem,
  fetchDirectoryPage,
  updateDirectoryItem,
} from "./api"
import type { DirectoryConfig } from "./config"
import type { DirectoryInput, DirectoryListParams } from "./schemas"

/** One page of the directory. Keeps the previous page on screen while the next loads. */
export const useDirectoryPage = (
  config: DirectoryConfig,
  params: DirectoryListParams
) =>
  useQuery({
    queryKey: directoryKeys.list(config.root, params),
    queryFn: ({ signal }) => fetchDirectoryPage(config, params, signal),
    placeholderData: keepPreviousData,
  })

/**
 * Refresh the lists and dropdown options (both under [root]), the totals on
 * the dashboard, and — after a rename — everywhere doctor rows show the name.
 */
const invalidateDirectory = (
  queryClient: QueryClient,
  config: DirectoryConfig,
  { renamed = false } = {}
) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: directoryKeys.all(config.root) }),
    queryClient.invalidateQueries({ queryKey: analyticsKeys.all }),
    ...(renamed
      ? [
          queryClient.invalidateQueries({ queryKey: doctorKeys.all }),
          queryClient.invalidateQueries({ queryKey: patientKeys.details() }),
        ]
      : []),
  ])

export const useCreateDirectoryItem = (config: DirectoryConfig) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: DirectoryInput) => createDirectoryItem(config, data),
    onSuccess: () => invalidateDirectory(queryClient, config),
  })
}

export const useUpdateDirectoryItem = (config: DirectoryConfig) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: DirectoryInput }) =>
      updateDirectoryItem(config, id, data),
    onSuccess: () =>
      invalidateDirectory(queryClient, config, { renamed: true }),
  })
}

export const useDeleteDirectoryItem = (config: DirectoryConfig) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteDirectoryItem(config, id),
    onSuccess: () => invalidateDirectory(queryClient, config),
  })
}
