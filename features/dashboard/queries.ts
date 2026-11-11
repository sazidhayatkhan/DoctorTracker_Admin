import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { analyticsKeys } from "@/lib/query-keys"
import { fetchDashboard } from "./api"
import type { DashboardParams } from "./schemas"

/**
 * Dashboard figures. Keeps the current charts on screen while another
 * period loads. Any doctor/patient/assignment change invalidates
 * analyticsKeys.all, so this refreshes on its own.
 */
export const useDashboard = (params: DashboardParams) =>
  useQuery({
    queryKey: analyticsKeys.dashboard(params),
    queryFn: ({ signal }) => fetchDashboard(params, signal),
    placeholderData: keepPreviousData,
  })
