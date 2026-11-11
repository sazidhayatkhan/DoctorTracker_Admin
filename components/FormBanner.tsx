import type { ReactNode } from "react"
import { AlertCircle, CheckCircle2 } from "lucide-react"

/** Full-width success / error strip shown at the top of a patient form */
const FormBanner = ({
  tone,
  children,
}: {
  tone: "success" | "error"
  children: ReactNode
}) =>
  tone === "success" ? (
    <div className="flex items-center gap-2 border-b border-emerald-500/30 bg-emerald-500/10 px-5 py-3 text-sm text-emerald-700 dark:text-emerald-300">
      <CheckCircle2 className="size-4 shrink-0" />
      {children}
    </div>
  ) : (
    <div
      role="alert"
      className="flex items-center gap-2 border-b border-destructive/30 bg-destructive/10 px-5 py-3 text-sm text-destructive"
    >
      <AlertCircle className="size-4 shrink-0" />
      {children}
    </div>
  )

export default FormBanner
