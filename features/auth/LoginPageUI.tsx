"use client"

import { useEffect, useState, type FormEvent } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { HeartPulse, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getErrorMessage } from "@/lib/api/errors"
import { useAuthHydrated, useAuthStore } from "@/stores/auth.store"
import { login, loginFormSchema, type LoginForm } from "./api"

type Errors = Partial<Record<keyof LoginForm, string>>

/** Only same-site paths, so ?next= can't redirect off the app */
const safeNext = (next: string | null) =>
  next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard"

const LoginPageUI = () => {
  const router = useRouter()
  const next = safeNext(useSearchParams().get("next"))
  const hydrated = useAuthHydrated()
  const token = useAuthStore((s) => s.token)
  const setSession = useAuthStore((s) => s.setSession)

  const [values, setValues] = useState<LoginForm>({ email: "", password: "" })
  const [errors, setErrors] = useState<Errors>({})

  // Already signed in: skip the form.
  useEffect(() => {
    if (hydrated && token) router.replace(next)
  }, [hydrated, token, next, router])

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: ({ accessToken, user }) => {
      setSession(accessToken, user)
      router.replace(next)
    },
  })

  const set = (key: keyof LoginForm, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const result = loginFormSchema.safeParse(values)

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      })
      return
    }

    mutation.mutate(result.data)
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/30 p-4">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-sm space-y-5 border bg-card p-6 shadow-xs"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-primary">
            <HeartPulse className="size-4" />
            DoctorTracker
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Admin sign in</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to manage doctors and patients.
          </p>
        </div>

        {mutation.isError && (
          <p
            role="alert"
            className="border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {getErrorMessage(mutation.error)}
          </p>
        )}

        <div className="space-y-1.5">
          <label htmlFor="login-email" className="text-xs font-medium">
            Email
          </label>
          <Input
            id="login-email"
            type="email"
            autoComplete="username"
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            aria-invalid={!!errors.email || undefined}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="login-password" className="text-xs font-medium">
            Password
          </label>
          <Input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={values.password}
            onChange={(e) => set("password", e.target.value)}
            aria-invalid={!!errors.password || undefined}
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password}</p>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={mutation.isPending}
        >
          {mutation.isPending && <Loader2 className="animate-spin" />}
          Sign in
        </Button>
      </form>
    </div>
  )
}

export default LoginPageUI
