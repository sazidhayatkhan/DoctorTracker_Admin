export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })

// Tinted badge colours for well-known specializations (light + dark)
const specializationStyles: Record<string, string> = {
  cardiology: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
  neurology: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  dermatology: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  orthopedics: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  pediatrics: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  gynecology: "bg-pink-500/10 text-pink-700 dark:text-pink-300",
  "general medicine": "bg-slate-500/10 text-slate-700 dark:text-slate-300",
}

/** Badge classes for a specialization name; any other name gets the brand tint */
export const specializationClass = (name: string | null | undefined) =>
  (name && specializationStyles[name.trim().toLowerCase()]) ||
  "bg-primary/10 text-primary"

export const getInitials = (name: string) =>
  name
    .replace(/^Dr\.?\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
