import type { Metadata } from "next"
import Link from "next/link"
import { Moon, ArrowLeft } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { SITE_CONFIG } from "@/lib/config"

export const metadata: Metadata = {
  title: `Sabbath observance · ${SITE_CONFIG.businessName}`,
  description:
    "Why CMK Baking pauses orders from Friday sunset to Saturday sunset, and when we resume.",
}

export default function SabbathPage() {
  const fri = SITE_CONFIG.sabbath.fridaySunsetHour
  const sat = SITE_CONFIG.sabbath.saturdaySunsetHour
  function fmt(h: number) {
    const h12 = ((h + 11) % 12) + 1
    return `${h12}:00 ${h >= 12 ? "PM" : "AM"}`
  }

  return (
    <main>
      <SiteHeader />

      <section className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          <Moon className="h-3.5 w-3.5" aria-hidden="true" />
          Sabbath
        </span>

        <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-foreground text-balance sm:text-5xl">
          We rest from Friday sunset to Saturday sunset
        </h1>

        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
          {SITE_CONFIG.businessName} observes the Sabbath each week. During
          this time we pause baking, deliveries, and order processing so we can
          rest, worship, and spend time with family.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <p className="text-sm font-medium uppercase tracking-wider text-primary">
              Sabbath begins
            </p>
            <p className="mt-2 font-serif text-2xl font-bold text-foreground">
              Friday at {fmt(fri)}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              We stop accepting new orders at sunset.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <p className="text-sm font-medium uppercase tracking-wider text-primary">
              Sabbath ends
            </p>
            <p className="mt-2 font-serif text-2xl font-bold text-foreground">
              Saturday at {fmt(sat)}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Orders, replies and deliveries resume after sunset.
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-border bg-secondary/40 p-6 sm:p-8">
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            What this means for your order
          </h2>
          <ul className="mt-4 space-y-3 text-pretty text-foreground/90">
            <li className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
              />
              <span>
                Messages or orders sent during Sabbath will be answered after
                sunset on Saturday.
              </span>
            </li>
            <li className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
              />
              <span>
                If your order is for Saturday, please place it before Friday
                sunset so we can prepare in advance.
              </span>
            </li>
            <li className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
              />
              <span>
                We deeply appreciate your patience and understanding.
              </span>
            </li>
          </ul>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/">
              <ArrowLeft className="mr-1.5 h-4 w-4" aria-hidden="true" />
              Back to home
            </Link>
          </Button>
          <Button asChild className="rounded-full">
            <Link href="/#store">View the store</Link>
          </Button>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
