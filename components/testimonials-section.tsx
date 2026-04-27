"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Star, Quote, ArrowRight, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import type { Review } from "@/lib/types"

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60) return "just now"
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d ago`
  if (diff < 86400 * 30) return `${Math.floor(diff / 86400 / 7)}w ago`
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    year: "numeric",
  })
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? "fill-accent text-accent"
              : "fill-transparent text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  )
}

function TestimonialCard({
  review,
  featured = false,
}: {
  review: Review
  featured?: boolean
}) {
  return (
    <article
      className={`group relative flex flex-col rounded-2xl border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${
        featured
          ? "border-primary/30 bg-gradient-to-br from-primary/5 via-background to-accent/5"
          : "border-border"
      }`}
    >
      <Quote
        className={`absolute right-4 top-4 h-8 w-8 ${
          featured ? "text-primary/20" : "text-muted-foreground/10"
        }`}
        aria-hidden="true"
      />

      <div className="flex items-start gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-serif text-base font-bold ${
            featured
              ? "bg-primary text-primary-foreground"
              : "bg-primary/10 text-primary"
          }`}
        >
          {review.customer_name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-serif text-base font-semibold text-foreground">
            {review.customer_name}
          </p>
          <p className="text-xs text-muted-foreground">
            {timeAgo(review.created_at)}
          </p>
        </div>
      </div>

      <div className="mt-3">
        <StarRating rating={review.rating} />
      </div>

      {review.title && (
        <h3 className="mt-3 font-serif text-lg font-semibold leading-tight text-foreground">
          {review.title}
        </h3>
      )}

      <p className="mt-2 line-clamp-4 flex-1 text-sm leading-relaxed text-foreground/85">
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

export function TestimonialsSection() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const supabase = createClient()

    async function load() {
      // First try to get featured reviews, then fill with other approved reviews
      const { data, error } = await supabase
        .from("reviews")
        .select(
          "id, customer_name, rating, title, message, product_name, featured, created_at"
        )
        .eq("status", "approved")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(6)

      if (!cancelled) {
        if (error) {
          console.log("[v0] error loading testimonials:", error.message)
        }
        setReviews((data as Review[]) || [])
        setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  // Don't render if loading or no reviews
  if (loading) return null
  if (reviews.length === 0) return null

  // Calculate average rating
  const avgRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

  return (
    <section
      id="testimonials"
      className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24"
    >
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Star className="h-3.5 w-3.5" aria-hidden="true" />
            Customer Reviews
          </span>
          <h2 className="mt-4 font-serif text-4xl font-bold text-foreground sm:text-5xl">
            What our customers say
          </h2>
          <p className="mt-3 max-w-xl text-pretty text-muted-foreground">
            Don&apos;t just take our word for it — hear from customers who&apos;ve
            experienced our baked goods.
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 sm:items-end">
          <div className="flex items-center gap-2">
            <StarRating rating={Math.round(avgRating)} />
            <span className="font-serif text-lg font-semibold text-foreground">
              {avgRating.toFixed(1)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Based on {reviews.length} review{reviews.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <TestimonialCard
            key={review.id}
            review={review}
            featured={review.featured}
          />
        ))}
      </div>

      <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/reviews">
            <MessageSquare className="mr-2 h-4 w-4" aria-hidden="true" />
            Read all reviews
            <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
        <Button asChild className="rounded-full">
          <Link href="/reviews">
            <Star className="mr-2 h-4 w-4" aria-hidden="true" />
            Leave a review
          </Link>
        </Button>
      </div>
    </section>
  )
}
