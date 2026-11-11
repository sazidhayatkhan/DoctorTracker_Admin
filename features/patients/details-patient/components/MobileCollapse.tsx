"use client"

import { useId, useState, type ReactNode } from "react"
import { ChevronDown } from "lucide-react"

type MobileCollapseProps = {
  /** Button text when closed / open */
  showLabel?: string
  hideLabel?: string
  children: ReactNode
}

/**
 * Collapsible on mobile only: below `md` the content is hidden behind a
 * toggle button; from `md` up the button disappears and content always shows.
 */
const MobileCollapse = ({
  showLabel = "Show details",
  hideLabel = "Hide details",
  children,
}: MobileCollapseProps) => {
  const [open, setOpen] = useState(false)
  const contentId = useId()

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={contentId}
        className="flex w-full items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground md:hidden"
      >
        {open ? hideLabel : showLabel}
        <ChevronDown
          className={`size-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        id={contentId}
        className={`${open ? "block border-t" : "hidden"} md:block md:border-t-0`}
      >
        {children}
      </div>
    </>
  )
}

export default MobileCollapse
