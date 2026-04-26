"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Moon, ArrowRight } from "lucide-react"
import { getSabbathInfo } from "@/lib/sabbath"

export function SabbathBanner() {
  const [info, setInfo] = useState<{ isSabbath: boolean; endsLabel?: string }>({
    isSabbath: false,
  })

  useEffect(() => {
    function update() {
      setInfo(getSabbathInfo())
    }
    update()
    // Re-check every minute so the banner appears/disappears at sunset.
    const id = setInterval(update, 60_000)
    return () => clearInterval(id)
  }, [])

  if (!info.isSabbath) return null

  return (
    <section
      role="status"
      aria-live="polite"
      className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6"
    >
      <div className="flex flex-col items-start gap-4 rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/10 via-accent/15 to-primary/10 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <Moon className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="font-serif text-lg font-semibold text-foreground sm:text-xl">
              We are closed today because it&apos;s Sabbath
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {info.endsLabel
                ? `Orders will resume after sunset. ${info.endsLabel}.`
                : "Orders will resume after sunset on Saturday."}
            </p>
          </div>
        </div>

        <Link
          href="/sabbath"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-primary/30 bg-background px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          Learn more
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
