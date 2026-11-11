/** How a patient's 4-digit code is shown everywhere, e.g. "#1001" */
export const formatPatientCode = (code: number) => `#${code}`

/** Today's date as yyyy-mm-dd (local time) — for <input type="date"> bounds */
export const todayISO = () => {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** Whole years between a yyyy-mm-dd birth date and today */
export const getAge = (birthDate: string, today: Date = new Date()) => {
  const [y, m, d] = birthDate.split("-").map(Number)
  let age = today.getFullYear() - y
  const beforeBirthday =
    today.getMonth() + 1 < m ||
    (today.getMonth() + 1 === m && today.getDate() < d)
  if (beforeBirthday) age--
  return age
}

/** "34 yrs", or "8 mos" for babies under a year */
export const formatAge = (birthDate: string) => {
  const age = getAge(birthDate)
  if (age >= 1) return `${age} yrs`
  const [y, m] = birthDate.split("-").map(Number)
  const now = new Date()
  const months = Math.max(
    0,
    (now.getFullYear() - y) * 12 + now.getMonth() + 1 - m
  )
  return `${months} mos`
}
