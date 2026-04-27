"use client"

import { useEffect, useState } from "react"
import { Star, Send, MessageSquare, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field"
import { createClient } from "@/lib/supabase/client"
import type { Review, Product } from "@/lib/types"

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60) return "just now"
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d ago`
  return new Date(iso).toLocaleDateString()
}

function StarRating({
  value,
  onChange,
  readOnly = false,
}: {
  value: number
  onChange?: (rating: number) => void
  readOnly?: boolean
}) {
  const [hovered, setHovered] = useState(0)

  return (
    <div className="flex gap-1" role="group" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = readOnly ? star <= value : star <= (hovered || value)
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => !readOnly && setHovered(star)}
            onMouseLeave={() => !readOnly && setHovered(0)}
            className={`transition-colors ${
              readOnly ? "cursor-default" : "cursor-pointer hover:scale-110"
            }`}
            aria-label={`${star} star${star !== 1 ? "s" : ""}`}
          >
            <Star
              className={`h-6 w-6 ${
                filled
                  ? "fill-accent text-accent"
                  : "fill-transparent text-muted-foreground/40"
              }`}
            />
          </button>
        )
      })}
    </div>
  )
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-serif text-sm font-bold text-primary">
            {review.customer_name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate font-serif font-semibold text-foreground">
              {review.customer_name}
            </p>
            <p className="text-xs text-muted-foreground">
              {timeAgo(review.created_at)}
            </p>
          </div>
        </div>
        <StarRating value={review.rating} readOnly />
      </div>

      {review.title && (
        <h3 className="mt-3 font-serif text-lg font-semibold text-foreground">
          {review.title}
        </h3>
      )}

      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
        {review.message}
      </p>

      {review.product_name && (
        <p className="mt-3 text-xs text-muted-foreground">
          Reviewed: {review.product_name}
        </p>
      )}
    </article>
  )
}

export function ReviewsPageContent() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Form state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [productId, setProductId] = useState("")

  useEffect(() => {
    let cancelled = false
    const supabase = createClient()

    async function load() {
      const [reviewsRes, productsRes] = await Promise.all([
        supabase
          .from("reviews")
          .select(
            "id, customer_name, rating, title, message, product_name, featured, created_at"
          )
          .eq("status", "approved")
          .order("featured", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(50),
        supabase.from("products").select("id, name").order("name"),
      ])

      if (!cancelled) {
        if (reviewsRes.error) {
          console.log("[v0] error loading reviews:", reviewsRes.error.message)
        }
        if (productsRes.error) {
          console.log("[v0] error loading products:", productsRes.error.message)
        }
        setReviews((reviewsRes.data as Review[]) || [])
        setProducts((productsRes.data as Product[]) || [])
        setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("Please enter your name.")
      return
    }
    if (!message.trim()) {
      toast.error("Please write your review.")
      return
    }

    setSubmitting(true)

    try {
      const selectedProduct = products.find((p) => p.id === productId)

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name.trim(),
          customer_email: email.trim() || null,
          rating,
          title: title.trim() || null,
          message: message.trim(),
          product_id: productId || null,
          product_name: selectedProduct?.name || null,
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error || "Could not submit review")
      }

      setSubmitted(true)
      toast.success("Thank you for your review!")
      setName("")
      setEmail("")
      setRating(5)
      setTitle("")
      setMessage("")
      setProductId("")
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not submit review"
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          <Star className="h-3.5 w-3.5" aria-hidden="true" />
          Customer Reviews
        </span>
        <h1 className="mt-4 font-serif text-4xl font-bold text-foreground sm:text-5xl">
          What our customers say
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-pretty text-muted-foreground">
          Read reviews from happy customers or share your own experience with us.
        </p>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-5">
        {/* Review submission form */}
        <div className="lg:col-span-2 lg:sticky lg:top-24 lg:h-fit">
          {submitted ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CheckCircle className="h-7 w-7" />
              </div>
              <h3 className="mt-4 font-serif text-xl font-semibold text-foreground">
                Thank you!
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Your review has been submitted and is pending approval. It will
                appear on our site once reviewed.
              </p>
              <Button
                variant="outline"
                className="mt-6 rounded-full"
                onClick={() => setSubmitted(false)}
              >
                Write another review
              </Button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8"
            >
              <h2 className="font-serif text-2xl font-semibold text-foreground">
                Share your experience
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Your feedback helps us improve and helps others discover us.
              </p>

              <FieldGroup className="mt-6">
                <Field>
                  <FieldLabel htmlFor="review-name">Your name</FieldLabel>
                  <Input
                    id="review-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Grace Banda"
                    maxLength={100}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="review-email">
                    Email (optional)
                  </FieldLabel>
                  <Input
                    id="review-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="grace@example.com"
                    maxLength={200}
                  />
                  <FieldDescription>
                    We&apos;ll only use this to follow up if needed
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel>Your rating</FieldLabel>
                  <StarRating value={rating} onChange={setRating} />
                </Field>

                {products.length > 0 && (
                  <Field>
                    <FieldLabel htmlFor="review-product">
                      Product reviewed (optional)
                    </FieldLabel>
                    <select
                      id="review-product"
                      value={productId}
                      onChange={(e) => setProductId(e.target.value)}
                      className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                      <option value="">General review</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                )}

                <Field>
                  <FieldLabel htmlFor="review-title">
                    Review title (optional)
                  </FieldLabel>
                  <Input
                    id="review-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Best cake ever!"
                    maxLength={150}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="review-message">Your review</FieldLabel>
                  <Textarea
                    id="review-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your experience..."
                    maxLength={1000}
                    rows={5}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    {message.length}/1000
                  </p>
                </Field>
              </FieldGroup>

              <Button
                type="submit"
                size="lg"
                className="mt-4 w-full rounded-full"
                disabled={submitting}
              >
                {submitting ? (
                  <Spinner className="mr-2" />
                ) : (
                  <Send className="mr-2 h-4 w-4" aria-hidden="true" />
                )}
                {submitting ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          )}
        </div>

        {/* Reviews list */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid gap-4">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-36 animate-pulse rounded-2xl bg-secondary/60"
                />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="flex h-full min-h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/50 p-8 text-center">
              <MessageSquare
                className="h-10 w-10 text-primary/60"
                aria-hidden="true"
              />
              <p className="mt-4 font-serif text-xl font-semibold">
                Be the first to leave a review
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Share your experience and help others discover us.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
