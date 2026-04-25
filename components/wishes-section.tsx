"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Heart, Send } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { createClient } from "@/lib/supabase/client"
import type { Wish } from "@/lib/types"
import { SITE_CONFIG } from "@/lib/config"

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60) return "just now"
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d ago`
  return new Date(iso).toLocaleDateString()
}

export function WishesSection() {
  const [wishes, setWishes] = useState<Wish[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    let cancelled = false
    const supabase = createClient()

    async function load() {
      const { data, error } = await supabase
        .from("wishes")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50)
      if (!cancelled) {
        if (error) {
          console.log("[v0] error loading wishes:", error.message)
        }
        setWishes((data as Wish[]) || [])
        setLoading(false)
      }
    }
    load()

    const channel = supabase
      .channel("wishes-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "wishes" },
        (payload) => {
          setWishes((prev) => [payload.new as Wish, ...prev])
        },
      )
      .subscribe()

    return () => {
      cancelled = true
      supabase.removeChannel(channel)
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !message.trim()) {
      toast.error("Please add your name and a message.")
      return
    }
    setSubmitting(true)
    const supabase = createClient()
    const { error } = await supabase
      .from("wishes")
      .insert({ name: name.trim(), message: message.trim() })

    setSubmitting(false)
    if (error) {
      toast.error("Could not send your wish. Try again.")
      return
    }
    toast.success(`Thank you ${name.split(" ")[0]}! Your wish was delivered.`)
    setName("")
    setMessage("")
  }

  return (
    <section id="wishes" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          <Heart className="h-3.5 w-3.5" aria-hidden="true" />
          Birthday Wishes
        </span>
        <h2 className="mt-4 font-serif text-4xl font-bold text-foreground sm:text-5xl">
          Leave a wish for {SITE_CONFIG.name}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-pretty text-muted-foreground">
          Your kind words will appear here for everyone to see. Make her smile.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-5">
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8 lg:col-span-2 lg:sticky lg:top-24 lg:h-fit"
        >
          <h3 className="font-serif text-2xl font-semibold text-foreground">
            Send your message
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Takes less than a minute. No login needed.
          </p>

          <FieldGroup className="mt-6">
            <Field>
              <FieldLabel htmlFor="wish-name">Your name</FieldLabel>
              <Input
                id="wish-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Grace"
                maxLength={60}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="wish-message">Your wish</FieldLabel>
              <Textarea
                id="wish-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Happy birthday Chimwemwe! Wishing you...`}
                maxLength={500}
                rows={5}
                required
              />
              <p className="text-xs text-muted-foreground">{message.length}/500</p>
            </Field>
          </FieldGroup>

          <Button type="submit" size="lg" className="mt-2 w-full rounded-full" disabled={submitting}>
            {submitting ? (
              <Spinner className="mr-2" />
            ) : (
              <Send className="mr-2 h-4 w-4" aria-hidden="true" />
            )}
            {submitting ? "Sending..." : "Send Wish"}
          </Button>
        </form>

        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid gap-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-32 animate-pulse rounded-2xl bg-secondary/60" />
              ))}
            </div>
          ) : wishes.length === 0 ? (
            <div className="flex h-full min-h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/50 p-8 text-center">
              <Heart className="h-10 w-10 text-primary/60" aria-hidden="true" />
              <p className="mt-4 font-serif text-xl font-semibold">Be the first to wish her well</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Your message will show up right here.
              </p>
            </div>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2">
              {wishes.map((w, idx) => (
                <li
                  key={w.id}
                  className={`group relative rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md ${
                    idx % 3 === 0 ? "sm:rotate-[-0.5deg]" : idx % 3 === 1 ? "sm:rotate-[0.5deg]" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-serif text-sm font-bold text-primary">
                      {w.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-serif font-semibold text-foreground">{w.name}</p>
                      <p className="text-xs text-muted-foreground">{timeAgo(w.created_at)}</p>
                    </div>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                    {w.message}
                  </p>
                </li>
              ))}
            </ul>
          )}

          {wishes.length > 0 && (
            <div className="mt-8 flex justify-center">
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <Link href="/wishes">
                  View all wishes
                  <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
