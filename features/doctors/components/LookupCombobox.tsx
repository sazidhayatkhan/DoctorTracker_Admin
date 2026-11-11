"use client"

import { useId, useMemo, useState, type KeyboardEvent } from "react"
import { Check, Loader2, Plus, type LucideIcon } from "lucide-react"

import { Input } from "@/components/ui/input"
import type { LookupOption } from "../schemas"

type LookupComboboxProps = {
  id?: string
  /** The typed / chosen name */
  value: string
  onChange: (value: string) => void
  /** Existing choices, e.g. every hospital */
  options: LookupOption[]
  /** Saves a name that isn't in the list yet (e.g. POST /hospitals) */
  onCreate: (name: string) => void
  isCreating?: boolean
  isLoading?: boolean
  /** Singular, lowercase: "hospital", "specialization" */
  entityLabel: string
  icon: LucideIcon
  placeholder?: string
  invalid?: boolean
}

export const normalizeName = (s: string) =>
  s.trim().replace(/\s+/g, " ").toLowerCase()

/** Type to filter existing options, or add the typed name as a new one */
const LookupCombobox = ({
  id,
  value,
  onChange,
  options,
  onCreate,
  isCreating = false,
  isLoading = false,
  entityLabel,
  icon: Icon,
  placeholder,
  invalid,
}: LookupComboboxProps) => {
  const listId = useId()
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const query = normalizeName(value)
  const suggestions = useMemo(
    () =>
      (query
        ? options.filter((o) => normalizeName(o.name).includes(query))
        : options
      ).slice(0, 8),
    [options, query]
  )
  const exactMatch = options.find((o) => normalizeName(o.name) === query)
  const canAdd = query.length > 0 && !exactMatch && !isLoading

  // Options = suggestions + (optional) "add new" row at the end
  const optionCount = suggestions.length + (canAdd ? 1 : 0)

  const select = (name: string) => {
    onChange(name)
    setIsOpen(false)
  }

  const addNew = () => {
    if (isCreating) return
    const name = value.trim().replace(/\s+/g, " ")
    onChange(name)
    onCreate(name)
    setIsOpen(false)
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
      if (activeIndex < suggestions.length)
        select(suggestions[activeIndex].name)
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
      <Icon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        id={id}
        role="combobox"
        aria-expanded={isOpen && optionCount > 0}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-invalid={invalid || undefined}
        autoComplete="off"
        placeholder={placeholder ?? `Start typing a ${entityLabel} name...`}
        className="pr-9 pl-9"
        value={value}
        disabled={isCreating}
        onChange={(e) => {
          onChange(e.target.value)
          setActiveIndex(0)
          setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        onKeyDown={handleKeyDown}
      />
      {(isCreating || isLoading) && (
        <Loader2
          className="absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin text-muted-foreground"
          aria-label={isCreating ? `Adding ${entityLabel}` : "Loading"}
        />
      )}

      {isOpen && optionCount > 0 && (
        <div
          id={listId}
          role="listbox"
          className="absolute inset-x-0 top-full z-20 mt-1 max-h-72 overflow-y-auto border bg-popover p-1 shadow-lg"
        >
          {suggestions.length > 0 && (
            <p className="px-2.5 pt-1 pb-1.5 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
              Existing{" "}
              {entityLabel === "specialization"
                ? "specializations"
                : `${entityLabel}s`}
            </p>
          )}

          {suggestions.map((option, index) => {
            const isSelected = normalizeName(option.name) === query
            return (
              <button
                key={option.id}
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                // keep focus in the input so onBlur doesn't close first
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => select(option.name)}
                className={optionClass(index)}
              >
                <Icon className="size-4 shrink-0 text-muted-foreground" />
                <span className="flex-1 truncate">{option.name}</span>
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
                  No {entityLabel} matches &ldquo;{value.trim()}&rdquo;.
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
                  Add &ldquo;{value.trim()}&rdquo; as new {entityLabel}
                </span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default LookupCombobox
