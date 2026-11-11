import Link from "next/link"
import type { ReactNode } from "react"

import type { Datum } from "../schemas"

/*
 * Lightweight chart primitives (HTML/CSS, no chart library).
 * Mark specs: bars ≤ 24px thick, 4px rounded data-end, square at the baseline,
 * hairline solid gridlines, text in text tokens (never the series colour).
 * Single-series bars use --chart-3 (teal-600), validated ≥ 3:1 on both surfaces.
 * Every bar is focusable and shows a tooltip on hover/focus.
 */

const BAR_COLOR = "bg-chart-3"

/** Clean tick step: 1, 2, 5, 10, 20, 50 … */
const niceStep = (max: number, targetTicks = 4) => {
  const raw = Math.max(max, 1) / targetTicks
  const mag = 10 ** Math.floor(Math.log10(raw))
  const norm = raw / mag
  const step = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10
  return Math.max(1, step * mag)
}

const formatNumber = (n: number) => n.toLocaleString("en-US")

// ---------------------------------------------------------------------------

export const ChartCard = ({
  title,
  description,
  children,
  table,
  action,
  className,
}: {
  title: string
  description?: string
  children: ReactNode
  /** Accessible table view of the same data */
  table: Datum[]
  /** Control shown at the right of the title, e.g. a period switcher */
  action?: ReactNode
  className?: string
}) => (
  <figure className={`border bg-card p-4 shadow-xs sm:p-5 ${className ?? ""}`}>
    <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
      <figcaption>
        <h2 className="text-sm font-semibold">{title}</h2>
        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        )}
      </figcaption>
      {action}
    </div>
    {children}
    <table className="sr-only">
      <caption>{title}</caption>
      <thead>
        <tr>
          <th scope="col">Category</th>
          <th scope="col">Value</th>
        </tr>
      </thead>
      <tbody>
        {table.map((d) => (
          <tr key={d.label}>
            <th scope="row">{d.label}</th>
            <td>{d.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </figure>
)

const Tooltip = ({
  label,
  value,
  unit,
}: {
  label: string
  value: number
  unit: string
}) => (
  <span
    role="tooltip"
    className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 border bg-popover px-2 py-1 text-xs whitespace-nowrap text-popover-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
  >
    <span className="text-muted-foreground">{label}</span>{" "}
    <span className="font-semibold tabular-nums">
      {formatNumber(value)} {unit}
    </span>
  </span>
)

// ---------------------------------------------------------------------------

/** Vertical columns with a y-axis; labels only the column you highlight. */
export const ColumnChart = ({
  data,
  unit,
  height = 180,
  labelIndex,
}: {
  data: Datum[]
  /** Noun for tooltips, e.g. "patients" */
  unit: string
  height?: number
  /** Index of the one column to direct-label (e.g. the latest month) */
  labelIndex?: number
}) => {
  const max = Math.max(...data.map((d) => d.value), 0)
  const step = niceStep(max)
  const top = Math.max(step, Math.ceil(max / step) * step)
  const ticks = Array.from({ length: top / step + 1 }, (_, i) => i * step)

  return (
    <div className="flex gap-2">
      {/* Y axis */}
      <div
        className="relative w-6 shrink-0 text-right text-[10px] text-muted-foreground tabular-nums"
        style={{ height }}
        aria-hidden
      >
        {ticks.map((t) => (
          <span
            key={t}
            className="absolute right-0 -translate-y-1/2"
            style={{ bottom: `${(t / top) * 100}%` }}
          >
            {formatNumber(t)}
          </span>
        ))}
      </div>

      <div className="min-w-0 flex-1">
        {/* Plot */}
        <div className="relative" style={{ height }}>
          {ticks.map((t) => (
            <div
              key={t}
              aria-hidden
              className={`absolute inset-x-0 h-px ${t === 0 ? "bg-border" : "bg-border/60"}`}
              style={{ bottom: `${(t / top) * 100}%` }}
            />
          ))}

          <div className="absolute inset-0 flex items-end">
            {data.map((d, i) => (
              <div
                key={d.label}
                tabIndex={0}
                aria-label={`${d.label}: ${d.value} ${unit}`}
                className="group relative flex h-full flex-1 items-end justify-center outline-none"
              >
                <Tooltip label={d.label} value={d.value} unit={unit} />
                {i === labelIndex && d.value > 0 && (
                  <span
                    className="absolute text-xs font-semibold tabular-nums"
                    style={{ bottom: `calc(${(d.value / top) * 100}% + 4px)` }}
                  >
                    {formatNumber(d.value)}
                  </span>
                )}
                <div
                  className={`w-full max-w-6 rounded-t-[4px] ${BAR_COLOR} transition-opacity group-hover:opacity-80 group-focus-visible:ring-2 group-focus-visible:ring-ring`}
                  style={{ height: `${(d.value / top) * 100}%` }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* X labels */}
        <div className="mt-2 flex" aria-hidden>
          {data.map((d) => (
            <span
              key={d.label}
              className="flex-1 truncate text-center text-[11px] text-muted-foreground"
            >
              {d.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------

/** Ranked horizontal bars with the value at each bar's tip. */
export const BarList = ({ data, unit }: { data: Datum[]; unit: string }) => {
  const max = Math.max(...data.map((d) => d.value), 1)

  return (
    <ul className="space-y-2.5">
      {data.map((d) => {
        const row = (
          <>
            <span
              className="w-32 shrink-0 truncate text-xs sm:w-40"
              title={d.label}
            >
              {d.label}
            </span>
            <span className="relative flex h-5 flex-1 items-center gap-2">
              <Tooltip label={d.label} value={d.value} unit={unit} />
              {d.value > 0 && (
                <span
                  className={`h-full rounded-r-[4px] ${BAR_COLOR} transition-opacity group-hover:opacity-80`}
                  style={{
                    width: `max(4px, calc(${(d.value / max) * 100}% - 2rem))`,
                  }}
                />
              )}
              <span className="text-xs font-medium tabular-nums">
                {formatNumber(d.value)}
              </span>
            </span>
          </>
        )
        const rowClass =
          "group relative flex items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-ring"

        return (
          <li key={d.label}>
            {d.href ? (
              <Link
                href={d.href}
                aria-label={`${d.label}: ${d.value} ${unit}`}
                className={`${rowClass} hover:text-primary`}
              >
                {row}
              </Link>
            ) : (
              <div
                tabIndex={0}
                aria-label={`${d.label}: ${d.value} ${unit}`}
                className={rowClass}
              >
                {row}
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}

// ---------------------------------------------------------------------------

/**
 * One whole split into parts (thin segmented bar, no text inside),
 * with a legend that carries names, counts and shares.
 * `colors` are per-category Tailwind classes (light + dark steps).
 */
export const SegmentedBar = ({
  data,
  colors,
  unit,
}: {
  data: Datum[]
  colors: Record<string, string>
  unit: string
}) => {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  const pct = (v: number) => (total ? Math.round((v / total) * 100) : 0)
  const parts = data.filter((d) => d.value > 0)

  return (
    <div className="space-y-5">
      <div>
        <p className="text-3xl font-semibold">{formatNumber(total)}</p>
        <p className="text-xs text-muted-foreground">total {unit}</p>
      </div>

      {/* 2px surface gap between parts */}
      <div
        className="flex h-2 gap-0.5"
        role="img"
        aria-label={data
          .map((d) => `${d.label} ${d.value} (${pct(d.value)}%)`)
          .join(", ")}
      >
        {parts.map((d) => (
          <div
            key={d.label}
            className={`group relative h-full rounded-full ${colors[d.label]}`}
            style={{ flexGrow: d.value }}
          >
            <Tooltip label={d.label} value={d.value} unit={unit} />
          </div>
        ))}
      </div>

      <ul className="space-y-2">
        {data.map((d) => (
          <li key={d.label} className="flex items-center gap-2 text-sm">
            <span
              aria-hidden
              className={`size-2.5 shrink-0 rounded-full ${colors[d.label]}`}
            />
            <span className="flex-1">{d.label}</span>
            <span className="font-medium tabular-nums">
              {formatNumber(d.value)}
            </span>
            <span className="w-10 text-right text-xs text-muted-foreground tabular-nums">
              {pct(d.value)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
