"use client"

import { useEffect, useMemo, useState } from "react"
import { Heart, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Empty } from "@/components/ui/empty"
import { createClient } from "@/lib/supabase/client"
import type { Wish } from "@/lib/types"

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function PublicWishesList({ initialWishes }: { initialWishes: Wish[] }) {
  const [wishes, setWishes] = useState<Wish[]>(initialWishes)
  const [query, setQuery] = useState("")

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel("public-wishes-all")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "wishes" },
        (payload) => {
          setWishes((prev) => {
            if (prev.some((w) => w.id === (payload.new as Wish).id)) return prev
            return [payload.new as Wish, ...prev]
          })
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return wishes
    return wishes.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        w.message.toLowerCase().includes(q),
    )
  }, [wishes, query])

  return (
    <div>
      <div className="mx-auto max-w-md">
        <InputGroup>
          <InputGroupAddon>
            <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or message..."
            aria-label="Search wishes"
          />
        </InputGroup>
      </div>

      {wishes.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-dashed border-border bg-card/50 p-10 text-center">
          <Heart className="mx-auto h-10 w-10 text-primary/60" aria-hidden="true" />
          <p className="mt-4 font-serif text-2xl font-semibold">No wishes yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Be the first one to leave a message.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-dashed border-border bg-card/50 p-10 text-center">
          <Search className="mx-auto h-10 w-10 text-muted-foreground" aria-hidden="true" />
          <p className="mt-4 font-serif text-xl font-semibold">No matches</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try a different search term.
          </p>
        </div>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((w, idx) => (
            <li
              key={w.id}
              className={`group relative rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
                idx % 4 === 0
                  ? "sm:rotate-[-0.4deg]"
                  : idx % 4 === 2
                  ? "sm:rotate-[0.4deg]"
                  : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-serif text-base font-bold text-primary">
                  {w.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-serif font-semibold text-foreground">
                    {w.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(w.created_at)}
                  </p>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                {w.message}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
