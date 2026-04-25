import Link from "next/link"
import type { Metadata } from "next"
import { ArrowLeft, Moon, Sun, MessageCircle } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { SITE_CONFIG, buildWhatsappUrl } from "@/lib/config"

export const metadata: Metadata = {
  title: `Sabbath Rest — ${SITE_CONFIG.businessName}`,
  description:
    "We observe the Sabbath from Friday sunset to Saturday sunset. Here's what that means for your orders.",
}

export default function SabbathPage() {
  return (
    <main>
      <SiteHeader />

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-20">
        <Button asChild variant="ghost" size="sm" className="rounded-full">
          <Link href="/">
            <ArrowLeft className="mr-1.5 h-4 w-4" aria-hidden="true" />
            Back to home
          </Link>
        </Button>

        <div className="mt-6 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Moon className="h-6 w-6" aria-hidden="true" />
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Sabbath Rest
          </span>
        </div>

        <h1 className="mt-6 font-serif text-4xl font-bold leading-tight text-foreground text-balance sm:text-5xl">
          We&apos;re closed for Sabbath
        </h1>

        <p className="mt-5 text-lg leading-relaxed text-muted-foreground text-pretty">
          At {SITE_CONFIG.businessName} we honor the Sabbath as a day of rest. From{" "}
          <span className="font-semibold text-foreground">Friday sunset</span> to{" "}
          <span className="font-semibold text-foreground">Saturday sunset</span>, our
          ovens cool down and our team takes a break to rest, reflect and spend time
          with family.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground">
                <Moon className="h-4 w-4" aria-hidden="true" />
              </span>
              <h2 className="font-serif text-lg font-semibold">Sabbath begins</h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Friday at sunset (around 18:00).
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/30 text-foreground">
                <Sun className="h-4 w-4" aria-hidden="true" />
              </span>
              <h2 className="font-serif text-lg font-semibold">Sabbath ends</h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Saturday at sunset (around 18:00). Orders resume immediately.
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-6">
          <h2 className="font-serif text-xl font-semibold text-foreground">
            What about my order?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            You&apos;re still very welcome to send us a WhatsApp message any time —
            we&apos;ll reply, confirm your order and arrange delivery as soon as
            Sabbath ends. Thank you for understanding and respecting this rest with
            us.
          </p>
          <Button asChild className="mt-5 rounded-full">
            <a
              href={buildWhatsappUrl(
                `Hi ${SITE_CONFIG.businessName}! I'd like to place an order after Sabbath.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="mr-2 h-4 w-4" aria-hidden="true" />
              Message us on WhatsApp
            </a>
          </Button>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
