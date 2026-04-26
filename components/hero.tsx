"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Sparkles,
  Heart,
  Gift,
  Cake,
  MessageCircle,
  MoonStar,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SITE_CONFIG } from "@/lib/config"
import { isWishesWindowOpen } from "@/lib/birthday"
import { getSabbathInfo } from "@/lib/sabbath"
import { createClient } from "@/lib/supabase/client"

type HeroMode = "birthday" | "sabbath" | "default"

type HeroContent = {
  badgeIcon: LucideIcon
  badgeText: string
  headlineTop: string
  headlineAccent: string
  description: string
  primary: { href: string; label: string; icon: LucideIcon }
  secondary: { href: string; label: string; icon: LucideIcon }
  footnote: string
  imageAlt: string
}

function buildContent(mode: HeroMode, sabbathEnds?: string): HeroContent {
  if (mode === "birthday") {
    return {
      badgeIcon: Sparkles,
      badgeText: "April 25th — A Special Day",
      headlineTop: "Happy Birthday,",
      headlineAccent: SITE_CONFIG.name,
      description: `A little corner of the internet to celebrate you. Leave a birthday wish, look back at sweet memories, and order a handcrafted cake from ${SITE_CONFIG.businessName}.`,
      primary: { href: "#wishes", label: "Send a Wish", icon: Heart },
      secondary: { href: "#store", label: "Order a Cake", icon: Gift },
      footnote: "Baked fresh, delivered with love",
      imageAlt:
        "A beautifully decorated birthday cake with pink frosting and golden candles",
    }
  }

  if (mode === "sabbath") {
    return {
      badgeIcon: MoonStar,
      badgeText: sabbathEnds ?? "Sabbath rest",
      headlineTop: "We are resting",
      headlineAccent: "this Sabbath",
      description: `${SITE_CONFIG.businessName} is closed from Friday sunset to Saturday sunset. Browse our cakes, save your favourites, and we will respond to your inquiries as soon as Sabbath ends.`,
      primary: { href: "/sabbath", label: "Learn more", icon: MoonStar },
      secondary: { href: "#store", label: "Browse our cakes", icon: Cake },
      footnote: "Orders resume Saturday after sunset",
      imageAlt:
        "A softly lit display of cakes ready to be enjoyed after the Sabbath",
    }
  }

  return {
    badgeIcon: Cake,
    badgeText: "Handcrafted, freshly baked",
    headlineTop: "Cakes that make",
    headlineAccent: "every day special",
    description: `Order a handcrafted cake from ${SITE_CONFIG.businessName} for birthdays, weddings, anniversaries and everything in between. Choose your size, send us the details, and we will bake it just for you.`,
    primary: { href: "#store", label: "Order a Cake", icon: Gift },
    secondary: { href: "#store", label: "Send an Inquiry", icon: MessageCircle },
    footnote: "Baked fresh, delivered with love",
    imageAlt:
      "A beautifully decorated handcrafted cake from CMK Baking ready to order",
  }
}

export function Hero() {
  // null = still resolving; we render the default mode meanwhile to avoid a
  // jarring flash, and swap to the correct mode once we know.
  const [mode, setMode] = useState<HeroMode | null>(null)
  const [sabbathEnds, setSabbathEnds] = useState<string | undefined>(undefined)

  useEffect(() => {
    let cancelled = false
    const supabase = createClient()

    async function resolve() {
      // Sabbath always takes precedence over birthday so the rest message
      // stays consistent with the rest of the site during Sabbath hours.
      const sabbath = getSabbathInfo()
      if (sabbath.isSabbath) {
        if (!cancelled) {
          setSabbathEnds(sabbath.endsLabel)
          setMode("sabbath")
        }
        return
      }

      const { data } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "wishes_override")
        .maybeSingle()
      if (cancelled) return

      const override = (data?.value ?? null) as "on" | "off" | null
      const birthdayOpen =
        override === "on" ||
        (override !== "off" && isWishesWindowOpen())

      setMode(birthdayOpen ? "birthday" : "default")
    }

    resolve()
    return () => {
      cancelled = true
    }
  }, [])

  const resolvedMode: HeroMode = mode ?? "default"
  const content = buildContent(resolvedMode, sabbathEnds)
  const BadgeIcon = content.badgeIcon
  const PrimaryIcon = content.primary.icon
  const SecondaryIcon = content.secondary.icon

  return (
    <section
      id="celebrate"
      className="relative overflow-hidden bg-gradient-to-b from-secondary/60 via-background to-background"
    >
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute left-[10%] top-20 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-[5%] top-40 h-56 w-56 rounded-full bg-accent/30 blur-3xl" />
        <div className="absolute bottom-0 left-[30%] h-48 w-48 rounded-full bg-primary/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="flex flex-col items-start gap-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <BadgeIcon className="h-3.5 w-3.5" aria-hidden="true" />
              {content.badgeText}
            </span>

            <h1 className="font-serif text-5xl font-bold leading-[1.05] tracking-tight text-foreground text-balance sm:text-6xl lg:text-7xl">
              {content.headlineTop}
              <br />
              <span className="text-primary">{content.headlineAccent}</span>
            </h1>

            <p className="max-w-lg text-lg leading-relaxed text-muted-foreground text-pretty">
              {content.description}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full text-base">
                <Link href={content.primary.href}>
                  <PrimaryIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                  {content.primary.label}
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-primary/30 bg-background text-base hover:bg-secondary"
              >
                <Link href={content.secondary.href}>
                  <SecondaryIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                  {content.secondary.label}
                </Link>
              </Button>
            </div>

            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-primary text-xs font-bold text-primary-foreground">
                  C
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-accent text-xs font-bold text-accent-foreground">
                  M
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-primary/70 text-xs font-bold text-primary-foreground">
                  K
                </div>
              </div>
              <span>{content.footnote}</span>
            </div>
          </div>

          <div className="relative">
            <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-[2rem] border border-border/50 bg-card shadow-2xl">
              <Image
                src="/hero-cake.jpg"
                alt={content.imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-cover"
              />
            </div>

            <div className="absolute -left-4 top-8 hidden rounded-2xl border border-border bg-card p-4 shadow-xl sm:block">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {resolvedMode === "sabbath" ? (
                    <MoonStar className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Heart className="h-5 w-5" aria-hidden="true" />
                  )}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    {resolvedMode === "sabbath" ? "Resting today" : "With love"}
                  </p>
                  <p className="font-serif font-semibold">
                    {resolvedMode === "sabbath" ? "See you Saturday" : "From everyone"}
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -right-4 bottom-8 hidden rounded-2xl border border-border bg-card p-4 shadow-xl sm:block">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-accent-foreground">
                  <Gift className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Fresh orders</p>
                  <p className="font-serif font-semibold">Via WhatsApp</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
