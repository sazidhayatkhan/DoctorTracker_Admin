import { Suspense } from "react"

import LoginPageUI from "@/features/auth/LoginPageUI"

// LoginPageUI reads ?next= with useSearchParams, which needs a Suspense boundary.
export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageUI />
    </Suspense>
  )
}
