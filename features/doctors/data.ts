export type Doctor = {
  id: number
  name: string
  email: string
  phone: string
  hospital: string
  specialization: string
  createdAt: string
}

export const specializations = [
  "Cardiology",
  "Neurology",
  "Dermatology",
  "Orthopedics",
  "Pediatrics",
  "Gynecology",
  "General Medicine",
]

// Tinted badge colours per specialization (light + dark)
export const specializationStyles: Record<string, string> = {
  Cardiology: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
  Neurology: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  Dermatology: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  Orthopedics: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  Pediatrics: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  Gynecology: "bg-pink-500/10 text-pink-700 dark:text-pink-300",
  "General Medicine": "bg-slate-500/10 text-slate-700 dark:text-slate-300",
}

// TODO: replace with API data
export const doctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. John Smith",
    email: "john.smith@example.com",
    phone: "+8801712345678",
    hospital: "Square Hospital",
    specialization: "Cardiology",
    createdAt: "2026-10-15",
  },
  {
    id: 2,
    name: "Dr. Sarah Ahmed",
    email: "sarah.ahmed@example.com",
    phone: "+8801812345678",
    hospital: "United Hospital",
    specialization: "Neurology",
    createdAt: "2026-10-20",
  },
  {
    id: 3,
    name: "Dr. Michael Brown",
    email: "michael.brown@example.com",
    phone: "+8801912345678",
    hospital: "Evercare Hospital",
    specialization: "Dermatology",
    createdAt: "2026-11-05",
  },
  {
    id: 4,
    name: "Dr. Nusrat Jahan",
    email: "nusrat.jahan@example.com",
    phone: "+8801612345678",
    hospital: "Labaid Hospital",
    specialization: "Gynecology",
    createdAt: "2026-11-02",
  },
  {
    id: 5,
    name: "Dr. Rafiq Hasan",
    email: "rafiq.hasan@example.com",
    phone: "+8801512345678",
    hospital: "Square Hospital",
    specialization: "Orthopedics",
    createdAt: "2026-09-28",
  },
  {
    id: 6,
    name: "Dr. Emily Chen",
    email: "emily.chen@example.com",
    phone: "+8801312345678",
    hospital: "United Hospital",
    specialization: "Pediatrics",
    createdAt: "2026-11-08",
  },
  {
    id: 7,
    name: "Dr. Tanvir Rahman",
    email: "tanvir.rahman@example.com",
    phone: "+8801412345678",
    hospital: "Popular Medical College",
    specialization: "General Medicine",
    createdAt: "2026-08-12",
  },
]

export type Patient = {
  id: number
  doctorId: number
  name: string
  age: number
  gender: "Male" | "Female" | "Other"
  phone: string
  condition: string
  admittedAt: string
}

export const genders: Patient["gender"][] = ["Male", "Female", "Other"]

// TODO: replace with API data
export const patients: Patient[] = [
  {
    id: 1,
    doctorId: 1,
    name: "Karim Uddin",
    age: 58,
    gender: "Male",
    phone: "+8801711000001",
    condition: "Hypertension",
    admittedAt: "2026-10-18",
  },
  {
    id: 2,
    doctorId: 1,
    name: "Fatema Begum",
    age: 64,
    gender: "Female",
    phone: "+8801711000002",
    condition: "Arrhythmia",
    admittedAt: "2026-10-25",
  },
  {
    id: 3,
    doctorId: 1,
    name: "Arif Hossain",
    age: 47,
    gender: "Male",
    phone: "+8801711000003",
    condition: "Chest pain",
    admittedAt: "2026-11-03",
  },
  {
    id: 4,
    doctorId: 2,
    name: "Ayesha Siddiqua",
    age: 35,
    gender: "Female",
    phone: "+8801711000004",
    condition: "Migraine",
    admittedAt: "2026-10-22",
  },
  {
    id: 5,
    doctorId: 2,
    name: "Shafiq Ahmed",
    age: 70,
    gender: "Male",
    phone: "+8801711000005",
    condition: "Parkinson's",
    admittedAt: "2026-11-01",
  },
  {
    id: 6,
    doctorId: 3,
    name: "Mitu Akter",
    age: 24,
    gender: "Female",
    phone: "+8801711000006",
    condition: "Eczema",
    admittedAt: "2026-11-06",
  },
  {
    id: 7,
    doctorId: 4,
    name: "Rina Das",
    age: 29,
    gender: "Female",
    phone: "+8801711000007",
    condition: "Prenatal check-up",
    admittedAt: "2026-11-04",
  },
  {
    id: 8,
    doctorId: 5,
    name: "Jahid Islam",
    age: 41,
    gender: "Male",
    phone: "+8801711000008",
    condition: "Knee injury",
    admittedAt: "2026-10-02",
  },
  {
    id: 9,
    doctorId: 6,
    name: "Ayaan Khan",
    age: 7,
    gender: "Male",
    phone: "+8801711000009",
    condition: "Fever",
    admittedAt: "2026-11-09",
  },
  {
    id: 10,
    doctorId: 7,
    name: "Karim Uddin",
    age: 58,
    gender: "Male",
    phone: "+8801711000001",
    condition: "Diabetes follow-up",
    admittedAt: "2026-09-12",
  },
]

/** Unique hospitals already registered via doctors, alphabetical */
export const getHospitals = () =>
  [...new Set(doctors.map((d) => d.hospital))].sort((a, b) =>
    a.localeCompare(b)
  )
