"use client"

import { useMemo, useState } from "react"
import {
  CheckCircle2,
  Star,
  Trash2,
  XCircle,
  Clock,
  Sparkles,
  MessageSquare,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import type { Review, ReviewStatus } from "@/lib/types"

const STATUS_LABEL: Record<ReviewStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
}

const STATUS_CLASSES: Record<ReviewStatus, string> = {
  pending: "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  approved: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  rejected: "border-destructive/40 bg-destructive/10 text-destructive",
}

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60) return "just now"
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d ago`
  return new Date(iso).toLocaleDateString()
}

function StarDisplay({ rating }: { rating: number }) {
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

export function CmkReviewsDashboard({
  initialReviews,
}: {
  initialReviews: Review[]
}) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [filter, setFilter] = useState<"all" | ReviewStatus>("all")
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const counts = useMemo(() => {
    const c = { all: reviews.length, pending: 0, approved: 0, rejected: 0 }
    for (const r of reviews) c[r.status]++
    return c
  }, [reviews])

  const visible = useMemo(
    () =>
      filter === "all" ? reviews : reviews.filter((r) => r.status === filter),
    [reviews, filter]
  )

  async function updateReview(id: string, updates: { status?: ReviewStatus; featured?: boolean }) {
    setUpdatingId(id)
    try {
      const res = await fetch(`/api/cmk/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Could not update")

      setReviews((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, ...updates, updated_at: new Date().toISOString() }
            : r
        )
      )

      if (updates.status) {
        toast.success(`Marked as ${STATUS_LABEL[updates.status]}`)
      } else if (updates.featured !== undefined) {
        toast.success(updates.featured ? "Featured on homepage" : "Removed from featured")
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not update"
      toast.error(msg)
    } finally {
      setUpdatingId(null)
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this review permanently?")) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/cmk/reviews/${id}`, { method: "DELETE" })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Could not delete")
      setReviews((prev) => prev.filter((r) => r.id !== id))
      toast.success("Review deleted")
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not delete"
      toast.error(msg)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <main className="min-h-dvh">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-primary" aria-hidden="true" />
          <h1 className="font-serif text-2xl font-bold sm:text-3xl">
            Customer Reviews
          </h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Moderate customer reviews. Approved reviews appear on the website.
          Featured reviews show on the homepage.
        </p>

        <div className="-mx-1 mt-5 flex flex-wrap gap-1.5">
          {(["all", "pending", "approved", "rejected"] as const).map((f) => {
            const active = filter === f
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={active}
                className={[
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-secondary",
                ].join(" ")}
              >
                {f === "all" ? "All" : STATUS_LABEL[f]}{" "}
                <span className={active ? "opacity-80" : "text-muted-foreground"}>
                  ({counts[f]})
                </span>
              </button>
            )
          })}
        </div>

        <div className="mt-6">
          {visible.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/50 p-10 text-center">
              <MessageSquare
                className="h-10 w-10 text-muted-foreground"
                aria-hidden="true"
              />
              <p className="mt-4 font-serif text-lg font-semibold">
                No reviews here
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Customer reviews will appear here when submitted.
              </p>
            </div>
          ) : (
            <ul className="grid gap-3 sm:gap-4">
              {visible.map((review) => (
                <li
                  key={review.id}
                  className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-serif text-base font-semibold text-foreground">
                          {review.customer_name}
                        </p>
                        <span
                          className={[
                            "rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide",
                            STATUS_CLASSES[review.status],
                          ].join(" ")}
                        >
                          {STATUS_LABEL[review.status]}
                        </span>
                        {review.featured && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent-foreground">
                            <Sparkles className="h-3 w-3" />
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {timeAgo(review.created_at)}
                        </span>
                        {review.customer_email && (
                          <span>{review.customer_email}</span>
                        )}
                      </div>
                    </div>
                    <StarDisplay rating={review.rating} />
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
                    <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                      Product: {review.product_name}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap justify-end gap-2 border-t border-border/60 pt-3">
                    {review.status !== "approved" && (
                      <Button
                        type="button"
                        size="sm"
                        className="h-9 rounded-full"
                        onClick={() => updateReview(review.id, { status: "approved" })}
                        disabled={updatingId === review.id}
                      >
                        {updatingId === review.id ? (
                          <Spinner className="mr-1.5" />
                        ) : (
                          <CheckCircle2 className="mr-1.5 h-4 w-4" aria-hidden="true" />
                        )}
                        Approve
                      </Button>
                    )}
                    {review.status === "approved" && (
                      <Button
                        type="button"
                        variant={review.featured ? "outline" : "secondary"}
                        size="sm"
                        className="h-9 rounded-full"
                        onClick={() =>
                          updateReview(review.id, { featured: !review.featured })
                        }
                        disabled={updatingId === review.id}
                      >
                        {updatingId === review.id ? (
                          <Spinner className="mr-1.5" />
                        ) : (
                          <Sparkles className="mr-1.5 h-4 w-4" aria-hidden="true" />
                        )}
                        {review.featured ? "Unfeature" : "Feature"}
                      </Button>
                    )}
                    {review.status !== "rejected" && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-9 rounded-full"
                        onClick={() => updateReview(review.id, { status: "rejected" })}
                        disabled={updatingId === review.id}
                      >
                        <XCircle className="mr-1.5 h-4 w-4" aria-hidden="true" />
                        Reject
                      </Button>
                    )}
                    {review.status !== "pending" && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-9 rounded-full"
                        onClick={() => updateReview(review.id, { status: "pending" })}
                        disabled={updatingId === review.id}
                      >
                        <Clock className="mr-1.5 h-4 w-4" aria-hidden="true" />
                        Set Pending
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-9 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => remove(review.id)}
                      disabled={deletingId === review.id}
                    >
                      {deletingId === review.id ? (
                        <Spinner className="mr-1.5" />
                      ) : (
                        <Trash2 className="mr-1.5 h-4 w-4" aria-hidden="true" />
                      )}
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  )
}
