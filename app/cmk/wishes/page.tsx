import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, MessageCircleHeart } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { BrandLogo } from "@/components/brand-logo"
import { Button } from "@/components/ui/button"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import type { Wish } from "@/lib/types"

export const metadata: Metadata = {
  title: "CMK · Wishes",
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

export default async function CmkWishesPage() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("wishes")
    .select("*")
    .order("created_at", { ascending: false })

  const wishes = (data as Wish[]) || []

  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-border/60 bg-card/50 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/cmk" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold">
            <BrandLogo size="sm" />
            View site
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Inbox</p>
            <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
              Birthday wishes
            </h1>
            <p className="mt-2 text-pretty text-muted-foreground">
              Every message sent from the public site. Newest first.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground">
            <MessageCircleHeart className="h-4 w-4 text-primary" aria-hidden />
            {wishes.length} {wishes.length === 1 ? "wish" : "wishes"}
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
            Could not load wishes. Please try again in a moment.
          </div>
        ) : wishes.length === 0 ? (
          <Empty className="rounded-3xl border border-dashed border-border bg-card/60">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <MessageCircleHeart className="h-6 w-6" aria-hidden />
              </EmptyMedia>
              <EmptyTitle>No wishes yet</EmptyTitle>
              <EmptyDescription>
                When someone sends a message from the home page, it will show up here right away.
              </EmptyDescription>
            </EmptyHeader>
            <Button asChild variant="outline" className="mt-2">
              <Link href="/#wishes">Open wishes section</Link>
            </Button>
          </Empty>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {wishes.map((wish) => (
              <li
                key={wish.id}
                className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-serif text-lg font-semibold text-foreground">{wish.name}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(wish.created_at)}</p>
                  </div>
                  <MessageCircleHeart className="h-5 w-5 shrink-0 text-primary" aria-hidden />
                </div>
                <p className="text-pretty leading-relaxed text-foreground/90">{wish.message}</p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
