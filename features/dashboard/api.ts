import { apiRequest } from "@/lib/api/client"
import { dashboardSchema, type DashboardParams } from "./schemas"

/** Everything the dashboard shows, in one request */
export const fetchDashboard = (params: DashboardParams, signal?: AbortSignal) =>
  apiRequest("/analytics/dashboard", {
    query: params,
    schema: dashboardSchema,
    signal,
  })
