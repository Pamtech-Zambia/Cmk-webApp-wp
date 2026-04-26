"use client"

import { useMemo, useState } from "react"
import {
  CheckCircle2,
  Inbox,
  MailCheck,
  MessageCircle,
  Trash2,
  XCircle,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { SITE_CONFIG, buildWhatsappUrl } from "@/lib/config"
import type { Inquiry } from "@/lib/types"

const STATUS_LABEL: Record<Inquiry["status"], string> = {
  new: "New",
  replied: "Replied",
  closed: "Closed",
}

const STATUS_CLASSES: Record<Inquiry["status"], string> = {
  new: "border-primary/40 bg-primary/10 text-primary",
  replied: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  closed: "border-border bg-secondary text-muted-foreground",
}

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60) return "just now"
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d ago`
  return new Date(iso).toLocaleDateString()
}

function digitsOnly(s: string) {
  return s.replace(/[^\d]/g, "")
}

export function CmkInquiriesDashboard({
  initialInquiries,
}: {
  initialInquiries: Inquiry[]
}) {
  const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries)
  const [filter, setFilter] = useState<"all" | Inquiry["status"]>("all")
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const counts = useMemo(() => {
    const c = { all: inquiries.length, new: 0, replied: 0, closed: 0 }
    for (const i of inquiries) c[i.status]++
    return c
  }, [inquiries])

  const visible = useMemo(
    () => (filter === "all" ? inquiries : inquiries.filter((i) => i.status === filter)),
    [inquiries, filter],
  )

  async function setStatus(id: string, status: Inquiry["status"]) {
    setUpdatingId(id)
    try {
      const res = await fetch(`/api/cmk/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Could not update")
      setInquiries((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status, updated_at: new Date().toISOString() } : i)),
      )
      toast.success(`Marked as ${STATUS_LABEL[status]}`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not update"
      toast.error(msg)
    } finally {
      setUpdatingId(null)
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this inquiry?")) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/cmk/inquiries/${id}`, { method: "DELETE" })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Could not delete")
      setInquiries((prev) => prev.filter((i) => i.id !== id))
      toast.success("Inquiry deleted")
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not delete"
      toast.error(msg)
    } finally {
      setDeletingId(null)
    }
  }

  function buildReplyHref(i: Inquiry) {
    const text = `Hi ${i.customer_name}, thanks for your message about${
      i.product_name ? ` ${i.product_name}${i.size_label ? ` (${i.size_label})` : ""}` : " our store"
    }. `
    const looksLikePhone = /^[+\d\s()-]+$/.test(i.contact)
    if (looksLikePhone) {
      const phone = digitsOnly(i.contact)
      if (phone.length >= 8) {
        return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
      }
    }
    if (i.contact.includes("@")) {
      const subject = `Re: your inquiry to ${SITE_CONFIG.businessName}`
      return `mailto:${i.contact}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`
    }
    // Fallback: open our own WhatsApp with the text prefilled
    return buildWhatsappUrl(text)
  }

  return (
    <main className="min-h-dvh">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="flex items-center gap-2">
          <Inbox className="h-5 w-5 text-primary" aria-hidden="true" />
          <h1 className="font-serif text-2xl font-bold sm:text-3xl">Inquiries</h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Customer questions submitted from the store. Reply directly via WhatsApp or email.
        </p>

        <div className="mt-5 -mx-1 flex flex-wrap gap-1.5">
          {(["all", "new", "replied", "closed"] as const).map((f) => {
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
              <Inbox className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
              <p className="mt-4 font-serif text-lg font-semibold">No inquiries here</p>
              <p className="mt-1 text-sm text-muted-foreground">
                When a customer submits the inquiry form, it will appear here.
              </p>
            </div>
          ) : (
            <ul className="grid gap-3 sm:gap-4">
              {visible.map((i) => (
                <li
                  key={i.id}
                  className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-serif text-base font-semibold text-foreground">
                          {i.customer_name}
                        </p>
                        <span
                          className={[
                            "rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide",
                            STATUS_CLASSES[i.status],
                          ].join(" ")}
                        >
                          {STATUS_LABEL[i.status]}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {timeAgo(i.created_at)} · {i.contact}
                      </p>
                      {(i.product_name || i.size_label) && (
                        <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                          About: {i.product_name || "(general)"}
                          {i.size_label ? ` · ${i.size_label}` : ""}
                        </p>
                      )}
                    </div>
                  </div>

                  <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                    {i.message}
                  </p>

                  <div className="mt-4 flex flex-wrap justify-end gap-2 border-t border-border/60 pt-3">
                    <Button
                      asChild
                      size="sm"
                      className="h-9 rounded-full"
                    >
                      <a
                        href={buildReplyHref(i)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="mr-1.5 h-4 w-4" aria-hidden="true" />
                        Reply
                      </a>
                    </Button>
                    {i.status !== "replied" && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-9 rounded-full"
                        onClick={() => setStatus(i.id, "replied")}
                        disabled={updatingId === i.id}
                      >
                        {updatingId === i.id ? (
                          <Spinner className="mr-1.5" />
                        ) : (
                          <MailCheck className="mr-1.5 h-4 w-4" aria-hidden="true" />
                        )}
                        Mark replied
                      </Button>
                    )}
                    {i.status !== "closed" && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-9 rounded-full"
                        onClick={() => setStatus(i.id, "closed")}
                        disabled={updatingId === i.id}
                      >
                        <CheckCircle2 className="mr-1.5 h-4 w-4" aria-hidden="true" />
                        Close
                      </Button>
                    )}
                    {i.status !== "new" && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-9 rounded-full"
                        onClick={() => setStatus(i.id, "new")}
                        disabled={updatingId === i.id}
                      >
                        <XCircle className="mr-1.5 h-4 w-4" aria-hidden="true" />
                        Reopen
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-9 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => remove(i.id)}
                      disabled={deletingId === i.id}
                    >
                      {deletingId === i.id ? (
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
