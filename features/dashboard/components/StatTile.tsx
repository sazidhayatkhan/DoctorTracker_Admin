import type { LucideIcon } from "lucide-react"
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react"

type StatTileProps = {
  label: string
  value: number
  icon: LucideIcon
  /** Signed change vs the named period; up is treated as good */
  delta?: { value: number; period: string }
  hint?: string
}

const StatTile = ({ label, value, icon: Icon, delta, hint }: StatTileProps) => {
  const DeltaIcon =
    !delta || delta.value === 0
      ? Minus
      : delta.value > 0
        ? ArrowUpRight
        : ArrowDownRight
  const deltaTone =
    !delta || delta.value === 0
      ? "text-muted-foreground"
      : delta.value > 0
        ? "text-emerald-700 dark:text-emerald-400"
        : "text-rose-700 dark:text-rose-400"

  return (
    <div className="flex flex-col gap-3 border bg-card p-4 shadow-xs">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">{label}</p>
        <Icon className="size-4 text-muted-foreground" aria-hidden />
      </div>
      <p className="text-2xl font-semibold sm:text-3xl">
        {value.toLocaleString("en-US")}
      </p>
      {delta ? (
        <p className={`flex items-center gap-1 text-xs ${deltaTone}`}>
          <DeltaIcon className="size-3.5" aria-hidden />
          <span className="font-medium tabular-nums">
            {delta.value > 0 ? "+" : ""}
            {delta.value}
          </span>
          <span className="text-muted-foreground">vs {delta.period}</span>
        </p>
      ) : (
        hint && <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  )
}

export default StatTile
