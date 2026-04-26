"use client"

import { useMemo, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Plus,
  Trash2,
  Upload,
  ImageIcon,
  ArrowLeft,
  Sparkles,
  Pencil,
  Package,
  X,
  Clock,
  CalendarClock,
} from "lucide-react"
import { toast } from "sonner"
import { BrandLogo } from "@/components/brand-logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { SITE_CONFIG } from "@/lib/config"
import type { Promo } from "@/lib/types"

type PromoForm = {
  title: string
  description: string
  imageUrl: string
  ctaLabel: string
  ctaUrl: string
  // Local "datetime-local" string e.g. "2026-05-01T18:00"
  expiresAt: string
}

const EMPTY_FORM: PromoForm = {
  title: "",
  description: "",
  imageUrl: "",
  ctaLabel: "",
  ctaUrl: "",
  expiresAt: "",
}

function toDatetimeLocal(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function formatExpiry(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

function statusFor(iso: string): { label: string; tone: "live" | "soon" | "expired" } {
  const diff = new Date(iso).getTime() - Date.now()
  if (diff <= 0) return { label: "Expired", tone: "expired" }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days < 1) {
    const hours = Math.max(1, Math.floor(diff / (1000 * 60 * 60)))
    return { label: `Ends in ${hours}h`, tone: "soon" }
  }
  return { label: `${days} day${days === 1 ? "" : "s"} left`, tone: "live" }
}

// Quick-pick presets compute an expiry datetime relative to now
function presetEndOfWeek(): string {
  const d = new Date()
  // End of week => Sunday 23:59. getDay(): 0=Sun..6=Sat
  const daysUntilSunday = (7 - d.getDay()) % 7 || 7
  d.setDate(d.getDate() + daysUntilSunday)
  d.setHours(23, 59, 0, 0)
  return toDatetimeLocal(d.toISOString())
}

function presetEndOfMonth(): string {
  const d = new Date()
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 0, 0)
  return toDatetimeLocal(end.toISOString())
}

function presetIn7Days(): string {
  const d = new Date()
  d.setDate(d.getDate() + 7)
  d.setHours(23, 59, 0, 0)
  return toDatetimeLocal(d.toISOString())
}

export function CmkPromosDashboard({ initialPromos }: { initialPromos: Promo[] }) {
  const [promos, setPromos] = useState<Promo[]>(initialPromos)
  const [form, setForm] = useState<PromoForm>(EMPTY_FORM)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [mobileFormOpen, setMobileFormOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isEditing = editingId !== null
  const sortedPromos = useMemo(
    () =>
      [...promos].sort(
        (a, b) =>
          new Date(a.expires_at).getTime() - new Date(b.expires_at).getTime(),
      ),
    [promos],
  )

  function update<K extends keyof PromoForm>(key: K, value: PromoForm[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function resetForm() {
    setForm(EMPTY_FORM)
    setEditingId(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  function startEdit(promo: Promo) {
    setEditingId(promo.id)
    setForm({
      title: promo.title,
      description: promo.description ?? "",
      imageUrl: promo.image_url ?? "",
      ctaLabel: promo.cta_label ?? "",
      ctaUrl: promo.cta_url ?? "",
      expiresAt: toDatetimeLocal(promo.expires_at),
    })
    setMobileFormOpen(true)
  }

  async function handleUpload(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.")
      return
    }
    setUploading(true)
    try {
      const res = await fetch("/api/cmk/upload", {
        method: "POST",
        headers: { "x-filename": `promo-${file.name}` },
        body: file,
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Upload failed")
      update("imageUrl", json.url)
      toast.success("Image uploaded")
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed"
      toast.error(msg)
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) {
      toast.error("Add a title.")
      return
    }
    if (!form.expiresAt) {
      toast.error("Pick an expiry date and time.")
      return
    }
    const expiryDate = new Date(form.expiresAt)
    if (isNaN(expiryDate.getTime())) {
      toast.error("Expiry date is invalid.")
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        image_url: form.imageUrl || null,
        cta_label: form.ctaLabel.trim() || null,
        cta_url: form.ctaUrl.trim() || null,
        expires_at: expiryDate.toISOString(),
      }

      if (isEditing && editingId) {
        const res = await fetch(`/api/cmk/promos/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || "Could not save")
        setPromos((prev) =>
          prev.map((p) => (p.id === editingId ? (json.promo as Promo) : p)),
        )
        toast.success(`${form.title} updated`)
      } else {
        const res = await fetch("/api/cmk/promos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || "Could not save")
        setPromos((prev) => [json.promo as Promo, ...prev])
        toast.success(`${form.title} added`)
      }

      resetForm()
      setMobileFormOpen(false)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not save"
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete promo "${title}"? This cannot be undone.`)) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/cmk/promos/${id}`, { method: "DELETE" })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Delete failed")
      setPromos((prev) => prev.filter((p) => p.id !== id))
      if (editingId === id) resetForm()
      toast.success("Promo deleted")
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Delete failed"
      toast.error(msg)
    } finally {
      setDeletingId(null)
    }
  }

  const formContent = (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="promo-title">Title</FieldLabel>
          <Input
            id="promo-title"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="20% off Birthday Cakes"
            maxLength={120}
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="promo-description">Description</FieldLabel>
          <Textarea
            id="promo-description"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Order any 2-tier cake this week and get a free dozen cookies."
            rows={3}
            maxLength={500}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="promo-expiry">Expires on</FieldLabel>
          <Input
            id="promo-expiry"
            type="datetime-local"
            value={form.expiresAt}
            onChange={(e) => update("expiresAt", e.target.value)}
            required
          />
          <FieldDescription>
            The promo disappears from the site automatically after this time.
          </FieldDescription>
          <div className="mt-1 flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => update("expiresAt", presetEndOfWeek())}
            >
              End of week
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => update("expiresAt", presetEndOfMonth())}
            >
              End of month
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => update("expiresAt", presetIn7Days())}
            >
              In 7 days
            </Button>
          </div>
        </Field>

        <Field>
          <FieldLabel htmlFor="promo-cta-label">Button label</FieldLabel>
          <Input
            id="promo-cta-label"
            value={form.ctaLabel}
            onChange={(e) => update("ctaLabel", e.target.value)}
            placeholder="Order now"
            maxLength={40}
          />
          <FieldDescription>Optional. Leave empty to hide the button.</FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="promo-cta-url">Button link</FieldLabel>
          <Input
            id="promo-cta-url"
            value={form.ctaUrl}
            onChange={(e) => update("ctaUrl", e.target.value)}
            placeholder="https://wa.me/... or /#store"
            maxLength={400}
          />
        </Field>

        <Field>
          <FieldLabel>Image</FieldLabel>
          <div className="rounded-2xl border border-dashed border-border bg-secondary/30 p-3 sm:p-4">
            {form.imageUrl ? (
              <div className="space-y-3">
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-card">
                  <Image
                    src={form.imageUrl || "/placeholder.svg"}
                    alt="Promo preview"
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full rounded-full bg-background"
                  onClick={() => update("imageUrl", "")}
                >
                  Remove image
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex min-h-28 w-full flex-col items-center justify-center gap-2 rounded-xl py-5 text-sm text-muted-foreground transition-colors hover:bg-secondary/60 active:bg-secondary/80"
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Spinner />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-6 w-6" aria-hidden="true" />
                    <span className="font-medium">Tap to upload an image</span>
                    <span className="text-xs">JPG, PNG or WEBP (max 5MB)</span>
                  </>
                )}
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) handleUpload(f)
              }}
            />
          </div>
        </Field>
      </FieldGroup>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          type="submit"
          size="lg"
          className="h-12 flex-1 rounded-full text-base"
          disabled={submitting || uploading}
        >
          {submitting ? (
            <Spinner className="mr-2" />
          ) : isEditing ? (
            <Pencil className="mr-2 h-5 w-5" aria-hidden="true" />
          ) : (
            <Plus className="mr-2 h-5 w-5" aria-hidden="true" />
          )}
          {submitting
            ? "Saving..."
            : isEditing
              ? "Save changes"
              : "Add promo"}
        </Button>
        {isEditing && (
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-12 rounded-full"
            onClick={resetForm}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  )

  return (
    <main className="min-h-dvh pb-24 lg:pb-0">
      <header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <BrandLogo size="sm" />
            <div className="min-w-0">
              <p className="truncate font-serif text-base font-bold leading-tight sm:text-lg">
                {SITE_CONFIG.businessName} Promos
              </p>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Time-limited offers that auto-expire
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-9 rounded-full px-3"
              aria-label="Manage products"
            >
              <Link href="/cmk">
                <Package className="h-4 w-4 sm:mr-1.5" aria-hidden="true" />
                <span className="hidden sm:inline">Products</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-9 rounded-full px-3"
              aria-label="Back to public site"
            >
              <Link href="/">
                <ArrowLeft className="h-4 w-4 sm:mr-1.5" aria-hidden="true" />
                <span className="hidden sm:inline">Back to site</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-10 lg:grid-cols-5">
        {/* Desktop form column */}
        <aside className="hidden lg:sticky lg:top-24 lg:col-span-2 lg:block lg:h-fit">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-2">
              {isEditing ? (
                <Pencil className="h-5 w-5 text-primary" aria-hidden="true" />
              ) : (
                <Plus className="h-5 w-5 text-primary" aria-hidden="true" />
              )}
              <h2 className="font-serif text-2xl font-semibold">
                {isEditing ? "Edit promo" : "Add promo"}
              </h2>
            </div>
            <p className="mb-6 mt-1 text-sm text-muted-foreground">
              {isEditing
                ? "Update the details. Changes save instantly."
                : "Promos appear on the public homepage and expire automatically."}
            </p>
            {formContent}
          </div>
        </aside>

        {/* Promos list */}
        <section className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between gap-3 sm:mb-5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
              <h2 className="font-serif text-xl font-semibold sm:text-2xl">
                Promos{" "}
                <span className="text-sm font-normal text-muted-foreground sm:text-base">
                  ({sortedPromos.length})
                </span>
              </h2>
            </div>
          </div>

          {sortedPromos.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/50 px-6 py-12 text-center sm:p-10">
              <Sparkles className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
              <p className="mt-4 font-serif text-lg font-semibold">No promos yet</p>
              <p className="mt-1 text-pretty text-sm text-muted-foreground">
                Tap{" "}
                <span className="font-semibold text-foreground">Add promo</span>{" "}
                to publish your first time-limited offer.
              </p>
            </div>
          ) : (
            <ul className="grid gap-3 sm:gap-4">
              {sortedPromos.map((p) => {
                const status = statusFor(p.expires_at)
                return (
                  <li
                    key={p.id}
                    className="rounded-2xl border border-border bg-card p-3 shadow-sm sm:p-4"
                  >
                    <div className="flex gap-3 sm:gap-4">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-secondary sm:h-24 sm:w-28">
                        {p.image_url ? (
                          <Image
                            src={p.image_url || "/placeholder.svg"}
                            alt={p.title}
                            fill
                            sizes="(max-width: 640px) 80px, 112px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-muted-foreground">
                            <ImageIcon className="h-6 w-6" aria-hidden="true" />
                          </div>
                        )}
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col justify-between gap-1.5">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <h3 className="truncate font-serif text-base font-semibold text-foreground">
                              {p.title}
                            </h3>
                            <span
                              className={
                                "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide " +
                                (status.tone === "expired"
                                  ? "bg-destructive/10 text-destructive"
                                  : status.tone === "soon"
                                    ? "bg-accent/40 text-accent-foreground"
                                    : "bg-primary/10 text-primary")
                              }
                            >
                              <Clock
                                className="mr-1 inline h-3 w-3"
                                aria-hidden="true"
                              />
                              {status.label}
                            </span>
                          </div>
                          {p.description && (
                            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                              {p.description}
                            </p>
                          )}
                        </div>
                        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <CalendarClock
                            className="h-4 w-4"
                            aria-hidden="true"
                          />
                          Expires {formatExpiry(p.expires_at)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex justify-end gap-2 border-t border-border/60 pt-3 sm:mt-4">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-9 rounded-full"
                        onClick={() => startEdit(p)}
                      >
                        <Pencil className="mr-1.5 h-4 w-4" aria-hidden="true" />
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-9 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleDelete(p.id, p.title)}
                        disabled={deletingId === p.id}
                      >
                        {deletingId === p.id ? (
                          <Spinner className="mr-1.5" />
                        ) : (
                          <Trash2 className="mr-1.5 h-4 w-4" aria-hidden="true" />
                        )}
                        Delete
                      </Button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>

      {/* Mobile bottom action bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 p-3 backdrop-blur supports-[backdrop-filter]:bg-card/80 lg:hidden">
        <div
          className="mx-auto max-w-6xl"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <Button
            type="button"
            size="lg"
            className="h-12 w-full rounded-full text-base shadow-lg"
            onClick={() => {
              if (isEditing) resetForm()
              setMobileFormOpen(true)
            }}
          >
            <Plus className="mr-2 h-5 w-5" aria-hidden="true" />
            Add promo
          </Button>
        </div>
      </div>

      <Sheet
        open={mobileFormOpen}
        onOpenChange={(open) => {
          setMobileFormOpen(open)
          if (!open && isEditing) resetForm()
        }}
      >
        <SheetContent
          side="bottom"
          className="h-[92dvh] overflow-y-auto rounded-t-3xl border-border p-0 lg:hidden"
        >
          <SheetHeader className="sticky top-0 z-10 border-b border-border bg-card/95 px-5 py-4 text-left backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <SheetTitle className="font-serif text-xl">
                  {isEditing ? "Edit promo" : "Add promo"}
                </SheetTitle>
                <SheetDescription className="text-sm">
                  {isEditing
                    ? "Changes save instantly."
                    : "Promos auto-expire on the date you set."}
                </SheetDescription>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 shrink-0 rounded-full"
                onClick={() => {
                  setMobileFormOpen(false)
                  if (isEditing) resetForm()
                }}
                aria-label="Close"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </Button>
            </div>
          </SheetHeader>
          <div className="px-5 py-5 pb-10">{formContent}</div>
        </SheetContent>
      </Sheet>
    </main>
  )
}
