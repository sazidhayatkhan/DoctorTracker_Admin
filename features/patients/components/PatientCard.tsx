import { HeartPulse } from "lucide-react"

import { formatDate, getInitials } from "@/features/doctors/utils"
import type { Patient } from "../schemas"
import { formatPatientCode } from "../utils"

type PatientCardProps = {
  patient: Patient
  className?: string
}

/**
 * ID-style patient card (credit-card ratio).
 *
 * BACKGROUND: `public/images/card_ui.png`, set on the `card-bg` layer below.
 * Text sits on top in its own layer (white, for the dark teal background).
 */
const PatientCard = ({ patient, className }: PatientCardProps) => (
  <div
    className={`@container relative aspect-[1.7/1] w-full overflow-hidden rounded-3xl text-white shadow-md md:w-[80%] ${className ?? ""}`}
  >
    {/* ── Background layer ──────────────────────────────────────────── */}
    {/* teal fallback colour shows while the image loads */}
    <div
      data-slot="card-bg"
      aria-hidden
      className="absolute inset-0 bg-[#0b7a70] bg-[url('/images/card_ui.png')] bg-cover bg-center"
    />

    {/* ── Content layer ─────────────────────────────────────────────── */}
    <div className="relative flex h-full flex-col justify-between p-5 @md:p-7">
      {/* Top: brand + card type */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-1.5 text-sm font-semibold @md:text-base">
          <HeartPulse className="size-4 @md:size-5" />
          DoctorTracker
        </div>
        <span className="text-[10px] font-medium tracking-[0.2em] uppercase opacity-80 @md:text-xs">
          Patient Card
        </span>
      </div>

      {/* Middle: identity */}
      <div className="flex items-center gap-3 @md:gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center bg-white/15 text-base font-semibold @md:size-16 @md:text-xl">
          {getInitials(patient.name)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-lg leading-tight font-semibold @md:text-2xl">
            {patient.name}
          </p>
          <p className="font-mono text-sm tracking-widest opacity-90 @md:text-base">
            {formatPatientCode(patient.patientCode)}
          </p>
        </div>
      </div>

      {/* Bottom: key facts */}
      <dl className="grid grid-cols-3 gap-3 text-xs @md:text-sm">
        <CardFact label="DOB" value={formatDate(patient.birthDate)} />
        <CardFact label="Gender" value={patient.gender} />
        <CardFact label="Issued" value={formatDate(patient.createdAt)} />
      </dl>
    </div>
  </div>
)

const CardFact = ({ label, value }: { label: string; value: string }) => (
  <div className="min-w-0">
    <dt className="text-[9px] font-medium tracking-wider uppercase opacity-70 @md:text-[11px]">
      {label}
    </dt>
    <dd className="truncate font-medium tabular-nums">{value}</dd>
  </div>
)

export default PatientCard
