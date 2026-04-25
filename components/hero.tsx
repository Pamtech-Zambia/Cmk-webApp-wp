import Link from "next/link"
import Image from "next/image"
import { Sparkles, Heart, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SITE_CONFIG } from "@/lib/config"

export function Hero() {
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
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              April 25th — A Special Day
            </span>

            <h1 className="font-serif text-5xl font-bold leading-[1.05] tracking-tight text-foreground text-balance sm:text-6xl lg:text-7xl">
              Happy Birthday,
              <br />
              <span className="text-primary">{SITE_CONFIG.name}</span>
            </h1>

            <p className="max-w-lg text-lg leading-relaxed text-muted-foreground text-pretty">
              A little corner of the internet to celebrate you. Leave a birthday wish, look
              back at sweet memories, and order a handcrafted cake from {SITE_CONFIG.businessName}.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full text-base">
                <Link href="#wishes">
                  <Heart className="mr-2 h-4 w-4" aria-hidden="true" />
                  Send a Wish
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-primary/30 bg-background text-base hover:bg-secondary"
              >
                <Link href="#store">
                  <Gift className="mr-2 h-4 w-4" aria-hidden="true" />
                  Order a Cake
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
              <span>Baked fresh, delivered with love</span>
            </div>
          </div>

          <div className="relative">
            <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-[2rem] border border-border/50 bg-card shadow-2xl">
              <Image
                src="/hero-cake.jpg"
                alt="A beautifully decorated birthday cake with pink frosting and golden candles"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-cover"
              />
            </div>

            <div className="absolute -left-4 top-8 hidden rounded-2xl border border-border bg-card p-4 shadow-xl sm:block">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Heart className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">With love</p>
                  <p className="font-serif font-semibold">From everyone</p>
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
