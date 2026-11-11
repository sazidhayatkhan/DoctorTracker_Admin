"use client"

import { useEffect, useState, type FormEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { ArrowLeft, HeartPulse, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getErrorMessage } from "@/lib/api/errors"
import { useAuthHydrated, useAuthStore } from "@/stores/auth.store"
import { login, loginFormSchema, type LoginForm } from "./api"

type Errors = Partial<Record<keyof LoginForm, string>>

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
    <div className="relative flex min-h-svh">
      <Image
        src="/images/doctor_tracker_logo.png"
        alt="DoctorTracker"
        width={1000}
        height={331}
        priority
        className="absolute top-4 right-4 h-9 w-auto sm:top-6 sm:right-8 sm:h-16"
      />

      <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-muted/30 p-4 sm:p-8">
        <Link
          href="/"
          className="inline-flex w-full max-w-sm items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Choose a different role
        </Link>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="w-full max-w-sm space-y-5 border bg-card p-6 shadow-xs"
        >
          <div className="space-y-1">
            {/* <div className="flex items-center gap-1.5 text-sm font-semibold text-primary">
              <HeartPulse className="size-4" />
              DoctorTracker
            </div> */}
            <h1 className="text-xl font-semibold tracking-tight">
              Admin sign in
            </h1>
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
    </div>
  )
}

export default LoginPageUI
