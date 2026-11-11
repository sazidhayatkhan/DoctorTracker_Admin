import { z } from "zod"

import { apiRequest } from "@/lib/api/client"

export const loginFormSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
})

export type LoginForm = z.infer<typeof loginFormSchema>

const loginResponseSchema = z.object({
  accessToken: z.string().min(1),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    role: z.string(),
  }),
})

export const login = (credentials: LoginForm) =>
  apiRequest("/auth/login", {
    method: "POST",
    body: credentials,
    schema: loginResponseSchema,
    auth: false,
  })
