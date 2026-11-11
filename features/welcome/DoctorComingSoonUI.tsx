import Link from "next/link"
import { ArrowLeft, Construction, HeartPulse } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"

const DoctorComingSoonUI = () => (
  <div className="flex min-h-svh items-center justify-center bg-muted/30 p-4 sm:p-8">
    <div className="w-full max-w-md space-y-6 border bg-card p-8 text-center shadow-xs">
      <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
        <HeartPulse className="size-4" />
        DoctorTracker
      </div>

      <div className="mx-auto flex size-14 items-center justify-center bg-amber-500/10 text-amber-600 dark:text-amber-300">
        <Construction className="size-7" />
      </div>

      <div className="space-y-2">
        <h1 className="text-xl font-semibold tracking-tight">
          Doctor access is on its way
        </h1>
        <p className="text-sm text-muted-foreground">
          We&apos;re working on the doctor experience and it will be live soon.
          In the meantime, please contact your administrator.
        </p>
      </div>

      <Link
        href="/"
        className={buttonVariants({ variant: "outline", size: "lg" })}
      >
        <ArrowLeft />
        Back to role selection
      </Link>
    </div>
  </div>
)

export default DoctorComingSoonUI
