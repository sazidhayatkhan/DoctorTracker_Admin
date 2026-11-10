import {
  doctors,
  patients as doctorPatients,
  type Doctor,
} from "@/features/doctors/data"

export type PatientRecord = {
  id: string
  name: string
  phone: string
  email: string
  /** yyyy-mm-dd */
  birthDate: string
  gender: "Male" | "Female" | "Other"
  address: string
  createdAt: string
}

// TODO: replace with API data (GET /patients)
export const patientRecords: PatientRecord[] = [
  {
    id: "PT-1001",
    name: "Karim Uddin",
    phone: "+8801711000001",
    email: "karim.uddin@example.com",
    birthDate: "1968-03-14",
    gender: "Male",
    address: "House 12, Road 5, Dhanmondi, Dhaka",
    createdAt: "2026-10-18",
  },
  {
    id: "PT-1002",
    name: "Fatema Begum",
    phone: "+8801711000002",
    email: "fatema.begum@example.com",
    birthDate: "1962-07-02",
    gender: "Female",
    address: "34 Lake Circus, Kalabagan, Dhaka",
    createdAt: "2026-10-25",
  },
  {
    id: "PT-1003",
    name: "Arif Hossain",
    phone: "+8801711000003",
    email: "arif.hossain@example.com",
    birthDate: "1979-01-25",
    gender: "Male",
    address: "Flat 4B, Block C, Bashundhara R/A, Dhaka",
    createdAt: "2026-11-03",
  },
  {
    id: "PT-1004",
    name: "Ayesha Siddiqua",
    phone: "+8801711000004",
    email: "ayesha.s@example.com",
    birthDate: "1991-09-08",
    gender: "Female",
    address: "22 Gulshan Avenue, Gulshan 1, Dhaka",
    createdAt: "2026-10-22",
  },
  {
    id: "PT-1005",
    name: "Shafiq Ahmed",
    phone: "+8801711000005",
    email: "shafiq.ahmed@example.com",
    birthDate: "1956-05-19",
    gender: "Male",
    address: "78 Agrabad C/A, Chattogram",
    createdAt: "2026-11-01",
  },
  {
    id: "PT-1006",
    name: "Mitu Akter",
    phone: "+8801711000006",
    email: "mitu.akter@example.com",
    birthDate: "2002-02-11",
    gender: "Female",
    address: "House 9, Sector 7, Uttara, Dhaka",
    createdAt: "2026-11-06",
  },
  {
    id: "PT-1007",
    name: "Rina Das",
    phone: "+8801711000007",
    email: "rina.das@example.com",
    birthDate: "1997-06-30",
    gender: "Female",
    address: "15 Zindabazar, Sylhet",
    createdAt: "2026-11-04",
  },
  {
    id: "PT-1008",
    name: "Jahid Islam",
    phone: "+8801711000008",
    email: "jahid.islam@example.com",
    birthDate: "1985-10-05",
    gender: "Male",
    address: "56 Mirpur Road, Mirpur 10, Dhaka",
    createdAt: "2026-10-02",
  },
  {
    id: "PT-1009",
    name: "Ayaan Khan",
    phone: "+8801711000009",
    email: "ayaan.parent@example.com",
    birthDate: "2019-04-22",
    gender: "Male",
    address: "3 Banani Road 11, Banani, Dhaka",
    createdAt: "2026-11-09",
  },
  {
    id: "PT-1010",
    name: "Sumaiya Rahman",
    phone: "+8801711000010",
    email: "sumaiya.r@example.com",
    birthDate: "1995-08-17",
    gender: "Female",
    address: "41 Shaheb Bazar, Rajshahi",
    createdAt: "2026-09-14",
  },
  {
    id: "PT-1011",
    name: "Alex Morgan",
    phone: "+8801711000011",
    email: "alex.morgan@example.com",
    birthDate: "1988-01-09",
    gender: "Other",
    address: "House 2, Road 104, Gulshan 2, Dhaka",
    createdAt: "2026-09-30",
  },
  {
    id: "PT-1012",
    name: "Habibur Rahman",
    phone: "+8801711000012",
    email: "habibur.r@example.com",
    birthDate: "1960-03-28",
    gender: "Male",
    address: "88 KDA Avenue, Khulna",
    createdAt: "2026-08-21",
  },
]

export type DoctorAssignment = {
  doctor: Doctor
  condition: string
  assignedAt: string
}

const digitsOnly = (phone: string) => phone.replace(/\D/g, "")

/**
 * Doctors this patient is assigned to, newest first.
 * TODO: the mock data sets have no shared patient ID, so we match on phone.
 * Replace with GET /patients/:id/doctors once the API exists.
 */
export const getAssignedDoctors = (
  patient: PatientRecord
): DoctorAssignment[] =>
  doctorPatients
    .filter((a) => digitsOnly(a.phone) === digitsOnly(patient.phone))
    .flatMap((a) => {
      const doctor = doctors.find((d) => d.id === a.doctorId)
      return doctor
        ? [{ doctor, condition: a.condition, assignedAt: a.admittedAt }]
        : []
    })
    .sort((a, b) => b.assignedAt.localeCompare(a.assignedAt))
