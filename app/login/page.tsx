import type { Metadata } from "next"
import { Suspense } from "react"

import LoginPageUI from "@/features/auth/LoginPageUI"

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Sign in to the Doctor Tracker admin dashboard.",
  robots: { index: false, follow: false },
}

// LoginPageUI reads ?next= with useSearchParams, which needs a Suspense boundary.
export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageUI />
    </Suspense>
  )
}
