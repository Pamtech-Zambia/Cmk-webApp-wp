"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Sparkles, Clock, ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Promo } from "@/lib/types"

function timeUntil(iso: string) {
  const diff = new Date(iso).getTime() - Date.now()
  if (diff <= 0) return "Expired"
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days >= 1) return `Ends in ${days} day${days === 1 ? "" : "s"}`
  const hours = Math.floor(diff / (1000 * 60 * 60))
  if (hours >= 1) return `Ends in ${hours} hour${hours === 1 ? "" : "s"}`
  const mins = Math.max(1, Math.floor(diff / (1000 * 60)))
  return `Ends in ${mins} min${mins === 1 ? "" : "s"}`
}

export function PromosSection() {
  const [promos, setPromos] = useState<Promo[]>([])
  const [loading, setLoading] = useState(true)
  const [, setNow] = useState(Date.now())

  useEffect(() => {
    let cancelled = false
    const supabase = createClient()

    async function load() {
      const nowIso = new Date().toISOString()
      const { data, error } = await supabase
        .from("promos")
        .select("*")
        .gt("expires_at", nowIso)
        .order("expires_at", { ascending: true })
      if (!cancelled) {
        if (error) console.log("[v0] error loading promos:", error.message)
        setPromos((data as Promo[]) || [])
        setLoading(false)
      }
    }
    load()

    // Re-tick every minute so countdown labels update and expiring promos
    // disappear without requiring a page refresh.
    const id = setInterval(() => {
      setNow(Date.now())
      load()
    }, 60_000)

    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  if (loading) return null
  if (promos.length === 0) return null

  return (
    <section
      id="promos"
      className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16"
    >
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Limited-time promos
          </span>
          <h2 className="mt-4 font-serif text-3xl font-bold text-foreground sm:text-4xl">
            What&apos;s on offer right now
          </h2>
          <p className="mt-2 max-w-xl text-pretty text-muted-foreground">
            Catch these before they&apos;re gone — promos disappear automatically
            when they expire.
          </p>
        </div>
      </div>

      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {promos.map((promo) => (
          <li
            key={promo.id}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            {promo.image_url ? (
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-secondary">
                <Image
                  src={promo.image_url || "/placeholder.svg"}
                  alt={promo.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="aspect-[16/10] w-full bg-gradient-to-br from-primary/15 via-accent/20 to-primary/10" />
            )}

            <div className="flex flex-1 flex-col gap-3 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  <Clock className="h-3 w-3" aria-hidden="true" />
                  {timeUntil(promo.expires_at)}
                </span>
              </div>

              <h3 className="font-serif text-xl font-semibold leading-tight text-foreground">
                {promo.title}
              </h3>

              {promo.description && (
                <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {promo.description}
                </p>
              )}

              {promo.cta_url && promo.cta_label && (
                <div className="mt-auto pt-2">
                  <Link
                    href={promo.cta_url}
                    target={promo.cta_url.startsWith("http") ? "_blank" : undefined}
                    rel={promo.cta_url.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-background px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    {promo.cta_label}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
