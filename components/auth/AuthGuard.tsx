"use client"

import { useEffect, type ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { useAuthHydrated, useAuthStore } from "@/stores/auth.store"

/**
 * Renders children only for a logged-in admin. An admin who signed out is
 * sent to the start page; anyone else (expired session, direct visit) is
 * sent to /login, which returns them here after signing in.
 */
const AuthGuard = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  const pathname = usePathname()
  const hydrated = useAuthHydrated()
  const token = useAuthStore((s) => s.token)
  const signedOut = useAuthStore((s) => s.signedOut)

  useEffect(() => {
    if (!hydrated || token) return
    router.replace(
      signedOut ? "/" : `/login?next=${encodeURIComponent(pathname)}`
    )
  }, [hydrated, token, signedOut, pathname, router])

  if (!hydrated || !token) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Loader2
          className="size-6 animate-spin text-muted-foreground"
          aria-label="Loading"
        />
      </div>
    )
  }

  return children
}

export default AuthGuard
