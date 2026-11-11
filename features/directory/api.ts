import { z } from "zod"

import { apiRequest } from "@/lib/api/client"
import type { DirectoryConfig } from "./config"
import {
  directoryItemSchema,
  directoryPageSchema,
  type DirectoryInput,
  type DirectoryListParams,
} from "./schemas"

export const fetchDirectoryPage = (
  config: DirectoryConfig,
  params: DirectoryListParams,
  signal?: AbortSignal
) =>
  apiRequest(config.apiPath, {
    query: params,
    schema: directoryPageSchema,
    signal,
  })

export const createDirectoryItem = (
  config: DirectoryConfig,
  { name, detail }: DirectoryInput
) =>
  apiRequest(config.apiPath, {
    method: "POST",
    // An empty detail is simply left out on create.
    body: { name, [config.detail.field]: detail || undefined },
    schema: directoryItemSchema,
  })

export const updateDirectoryItem = (
  config: DirectoryConfig,
  id: string,
  { name, detail }: DirectoryInput
) =>
  apiRequest(`${config.apiPath}/${id}`, {
    method: "PUT",
    // An empty detail is sent as "" so the backend clears it.
    body: { name, [config.detail.field]: detail },
    schema: directoryItemSchema,
  })

export const deleteDirectoryItem = (config: DirectoryConfig, id: string) =>
  apiRequest(`${config.apiPath}/${id}`, {
    method: "DELETE",
    schema: z.unknown(),
  })
