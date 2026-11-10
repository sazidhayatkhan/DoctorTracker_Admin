"use client"

import { useId, useMemo, useState, type KeyboardEvent } from "react"
import { Building2, Check, Plus } from "lucide-react"

import { Input } from "@/components/ui/input"

type HospitalComboboxProps = {
  id?: string
  value: string
  onChange: (value: string) => void
  /** Hospitals already in the system — used for suggestions */
  hospitals: string[]
  /** Called when the user confirms a hospital that isn't in the list yet */
  onAddHospital: (name: string) => void
  invalid?: boolean
}

const normalize = (s: string) => s.trim().replace(/\s+/g, " ").toLowerCase()

const HospitalCombobox = ({
  id,
  value,
  onChange,
  hospitals,
  onAddHospital,
  invalid,
}: HospitalComboboxProps) => {
  const listId = useId()
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const query = normalize(value)
  const suggestions = useMemo(
    () =>
      (query
        ? hospitals.filter((h) => normalize(h).includes(query))
        : hospitals
      ).slice(0, 8),
    [hospitals, query]
  )
  const exactMatch = hospitals.find((h) => normalize(h) === query)
  const canAdd = query.length > 0 && !exactMatch

  // Options = suggestions + (optional) "add new" row at the end
  const optionCount = suggestions.length + (canAdd ? 1 : 0)

  const select = (hospital: string) => {
    onChange(hospital)
    setIsOpen(false)
  }

  const addNew = () => {
    const name = value.trim().replace(/\s+/g, " ")
    onAddHospital(name)
    select(name)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setIsOpen(true)
      if (optionCount) setActiveIndex((i) => (i + 1) % optionCount)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      if (optionCount)
        setActiveIndex((i) => (i - 1 + optionCount) % optionCount)
    } else if (event.key === "Enter" && isOpen && optionCount) {
      event.preventDefault()
      if (activeIndex < suggestions.length) select(suggestions[activeIndex])
      else addNew()
    } else if (event.key === "Escape") {
      setIsOpen(false)
    }
  }

  const optionClass = (index: number) =>
    `flex w-full items-center gap-2.5 px-2.5 py-2 text-left text-sm ${
      index === activeIndex ? "bg-muted" : ""
    }`

  return (
    <div className="relative">
      <Building2 className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        id={id}
        role="combobox"
        aria-expanded={isOpen && optionCount > 0}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-invalid={invalid || undefined}
        autoComplete="off"
        placeholder="Start typing a hospital name..."
        className="pl-9"
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          setActiveIndex(0)
          setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        onKeyDown={handleKeyDown}
      />

      {isOpen && optionCount > 0 && (
        <div
          id={listId}
          role="listbox"
          className="absolute inset-x-0 top-full z-20 mt-1 max-h-72 overflow-y-auto border bg-popover p-1 shadow-lg"
        >
          {suggestions.length > 0 && (
            <p className="px-2.5 pt-1 pb-1.5 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
              Existing hospitals
            </p>
          )}

          {suggestions.map((hospital, index) => {
            const isSelected = normalize(hospital) === query
            return (
              <button
                key={hospital}
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                // keep focus in the input so onBlur doesn't close first
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => select(hospital)}
                className={optionClass(index)}
              >
                <Building2 className="size-4 shrink-0 text-muted-foreground" />
                <span className="flex-1 truncate">{hospital}</span>
                {isSelected && <Check className="size-4 text-primary" />}
              </button>
            )
          })}

          {canAdd && (
            <>
              {suggestions.length > 0 && (
                <div className="my-1 h-px bg-border" />
              )}
              {suggestions.length === 0 && (
                <p className="px-2.5 pt-1 pb-1.5 text-xs text-muted-foreground">
                  No hospital matches &ldquo;{value.trim()}&rdquo;.
                </p>
              )}
              <button
                type="button"
                role="option"
                aria-selected={activeIndex === suggestions.length}
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setActiveIndex(suggestions.length)}
                onClick={addNew}
                className={`${optionClass(suggestions.length)} font-medium text-primary`}
              >
                <Plus className="size-4 shrink-0" />
                <span className="truncate">
                  Add &ldquo;{value.trim()}&rdquo; as new hospital
                </span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default HospitalCombobox
