import { getImageProps } from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
  type LucideIcon,
} from "lucide-react"

type RoleCardProps = {
  href: string
  icon: LucideIcon
  title: string
  description: string
  badge?: string
}

const RoleCard = ({
  href,
  icon: Icon,
  title,
  description,
  badge,
}: RoleCardProps) => (
  <Link
    href={href}
    className="group flex flex-col gap-4 border bg-card p-3 md:p-6 shadow-xs transition-colors hover:border-primary/50 hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
  >
    <div className="flex items-start justify-between gap-3">
      <div className="flex size-12 items-center justify-center bg-primary/10 text-primary">
        <Icon className="size-6" />
      </div>
      {badge && (
        <span className="bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          {badge}
        </span>
      )}
    </div>

    <div className="space-y-1">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>

    <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary">
      Continue
      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
    </span>
  </Link>
)

const DESKTOP_MEDIA = "(min-width: 768px)"


const BackgroundImage = () => {
  const common = { alt: "", sizes: "100vw", priority: true }

  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({
    ...common,
    src: "/images/initial_page_bg_3.png",
    width: 2220,
    height: 1248,
  })

  const {
    props: { srcSet: mobileSrcSet, ...mobileProps },
  } = getImageProps({
    ...common,
    src: "/images/mobile_inital_bg.png",
    width: 360,
    height: 720,
  })

  return (
    <picture>
      <source media={DESKTOP_MEDIA} srcSet={desktopSrcSet} />
      <img
        {...mobileProps}
        alt=""
        srcSet={mobileSrcSet}
        className="absolute inset-x-0 top-0 -z-10 h-auto w-full md:inset-0 md:h-full md:object-cover md:object-right-bottom dark:hue-rotate-180 dark:invert"
      />
    </picture>
  )
}


const RoleSelectPageUI = () => (
  <div className="relative isolate flex min-h-svh items-start overflow-hidden bg-white px-4 pt-[96vw] pb-8 sm:px-8 md:items-center md:py-8 dark:bg-background">
    <BackgroundImage />

    <div className="mx-auto w-full max-w-6xl">
      <div className="mt-6 mx-auto w-full max-w-xl space-y-8 lg:mx-0">
        <div className="space-y-2 text-center lg:text-left">
          {/* <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
            <HeartPulse className="size-4" />
            DoctorTracker
          </div> */}
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            How would you like to continue?
          </h1>
          <p className="text-sm text-muted-foreground">
            Choose your role to get started.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <RoleCard
            href="/login"
            icon={ShieldCheck}
            title="Use as Admin"
            description="Manage doctors, patients, hospitals and assignments."
          />
          <RoleCard
            href="/doctor"
            icon={Stethoscope}
            title="Use as Doctor"
            description="See your assigned patients and their conditions."
            badge="Coming soon"
          />
        </div>
      </div>
    </div>
  </div>
)

export default RoleSelectPageUI
