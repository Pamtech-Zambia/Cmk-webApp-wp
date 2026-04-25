"use client"

import Link from "next/link"
import { Moon, ArrowRight } from "lucide-react"
import { useSabbath, SABBATH_MESSAGE } from "@/lib/sabbath"

type Props = {
  /**
   * `page` — large hero-style banner used at the top of the home page.
   * `section` — compact strip used inside the store section.
   */
  variant?: "page" | "section"
  className?: string
}

export function SabbathBanner({ variant = "page", className }: Props) {
  const isSabbath = useSabbath()
  if (!isSabbath) return null

  if (variant === "section") {
    return (
      <div
        role="status"
        className={
          "flex flex-col items-start gap-3 rounded-2xl border border-primary/30 bg-primary/10 p-4 text-foreground sm:flex-row sm:items-center sm:justify-between " +
          (className ?? "")
        }
      >
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Moon className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="font-serif text-base font-semibold leading-tight">
              {SABBATH_MESSAGE}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              We&apos;ll reopen after sunset on Saturday.
            </p>
          </div>
        </div>

        <Link
          href="/sabbath"
          className="inline-flex items-center gap-1.5 self-start rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:self-center"
        >
          Learn more
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    )
  }

  return (
    <div
      role="status"
      className={
        "border-b border-primary/20 bg-primary/10 text-foreground " +
        (className ?? "")
      }
    >
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-start gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Moon className="h-4 w-4" aria-hidden="true" />
          </span>
          <p className="text-sm leading-snug sm:text-base">
            <span className="font-semibold">{SABBATH_MESSAGE}</span>{" "}
            <span className="text-muted-foreground">
              Orders will resume after sunset on Saturday.
            </span>
          </p>
        </div>

        <Link
          href="/sabbath"
          className="inline-flex items-center gap-1.5 self-start rounded-full border border-primary/30 bg-background px-3.5 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground sm:self-center"
        >
          Learn more
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}
