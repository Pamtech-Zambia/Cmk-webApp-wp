import Link from "next/link"
import { ArrowLeft, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PublicWishesList } from "@/components/public-wishes-list"
import { createClient } from "@/lib/supabase/server"
import { SITE_CONFIG } from "@/lib/config"
import type { Wish } from "@/lib/types"

export const metadata = {
  title: `All Birthday Wishes for ${SITE_CONFIG.name}`,
  description: `Read every heartfelt birthday message sent to ${SITE_CONFIG.name}.`,
}

export const dynamic = "force-dynamic"

export default async function WishesPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("wishes")
    .select("*")
    .order("created_at", { ascending: false })

  const wishes = (data as Wish[]) || []

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Button asChild variant="ghost" size="sm" className="rounded-full">
            <Link href="/">
              <ArrowLeft className="mr-1.5 h-4 w-4" aria-hidden="true" />
              Back home
            </Link>
          </Button>
          <Button asChild size="sm" className="rounded-full">
            <Link href="/#wishes">
              <Heart className="mr-1.5 h-4 w-4" aria-hidden="true" />
              Send a wish
            </Link>
          </Button>
        </div>

        <div className="mt-8 text-center sm:mt-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Heart className="h-3.5 w-3.5" aria-hidden="true" />
            {wishes.length} {wishes.length === 1 ? "wish" : "wishes"} so far
          </span>
          <h1 className="mt-4 font-serif text-4xl font-bold text-foreground sm:text-5xl">
            Birthday wishes for {SITE_CONFIG.name}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-pretty text-muted-foreground">
            Every kind word from family and friends, all in one place.
          </p>
        </div>

        <div className="mt-10">
          <PublicWishesList initialWishes={wishes} />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
