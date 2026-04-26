"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Plus,
  Trash2,
  Upload,
  ImageIcon,
  ArrowLeft,
  Package,
  MessageCircleHeart,
  Sparkles,
  Pencil,
  Inbox,
  X,
  Cake,
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
import type { Product, ProductSize, WishesOverride } from "@/lib/types"
import { formatPrice, getMinSizePrice, hasMultipleSizes } from "@/lib/product"

type SizeRow = { label: string; price: string }

const EMPTY_SIZE: SizeRow = { label: "", price: "" }

function sizesFromRows(rows: SizeRow[]): ProductSize[] {
  return rows
    .map((r) => ({
      label: r.label.trim(),
      price: Number.parseFloat(r.price),
    }))
    .filter(
      (s) => s.label && Number.isFinite(s.price) && s.price >= 0,
    )
}

function rowsFromSizes(sizes: ProductSize[] | undefined | null): SizeRow[] {
  if (!sizes || sizes.length === 0) return []
  return sizes.map((s) => ({ label: s.label, price: String(s.price) }))
}

export function CmkDashboard({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [sizeRows, setSizeRows] = useState<SizeRow[]>([])
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [mobileFormOpen, setMobileFormOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Wishes manual override
  const [wishesOverride, setWishesOverride] = useState<WishesOverride>(null)
  const [wishesSaving, setWishesSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch("/api/cmk/settings", { cache: "no-store" })
        const json = await res.json()
        if (cancelled) return
        const v = json?.settings?.wishes_override
        if (v === "on" || v === "off") setWishesOverride(v)
        else setWishesOverride(null)
      } catch {
        /* ignore */
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  async function handleUpload(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.")
      return
    }
    setUploading(true)
    try {
      const res = await fetch("/api/cmk/upload", {
        method: "POST",
        headers: { "x-filename": file.name },
        body: file,
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Upload failed")
      setImageUrl(json.url)
      toast.success("Image uploaded")
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed"
      toast.error(msg)
    } finally {
      setUploading(false)
    }
  }

  function resetForm() {
    setEditingId(null)
    setName("")
    setDescription("")
    setPrice("")
    setCategory("")
    setImageUrl("")
    setSizeRows([])
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  function startEdit(p: Product) {
    setEditingId(p.id)
    setName(p.name)
    setDescription(p.description ?? "")
    setPrice(String(p.price))
    setCategory(p.category ?? "")
    setImageUrl(p.image_url ?? "")
    setSizeRows(rowsFromSizes(p.sizes))
    setMobileFormOpen(true)
    // Smooth scroll on desktop
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const cleanSizes = sizesFromRows(sizeRows)
    const priceNum = Number.parseFloat(price)
    const hasSizes = cleanSizes.length > 0
    const validBasePrice = !Number.isNaN(priceNum) && priceNum >= 0

    if (!name.trim()) {
      toast.error("Add a product name.")
      return
    }
    if (!hasSizes && !validBasePrice) {
      toast.error("Add a price or at least one size.")
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        name: name.trim(),
        description: description.trim() || null,
        price: hasSizes
          ? Math.min(...cleanSizes.map((s) => s.price))
          : priceNum,
        image_url: imageUrl || null,
        category: category.trim() || null,
        sizes: cleanSizes,
      }

      const url = editingId
        ? `/api/cmk/products/${editingId}`
        : "/api/cmk/products"
      const method = editingId ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Could not save")

      const saved = json.product as Product
      setProducts((prev) =>
        editingId
          ? prev.map((p) => (p.id === editingId ? saved : p))
          : [saved, ...prev],
      )
      toast.success(editingId ? `${saved.name} updated` : `${saved.name} added to the menu`)
      resetForm()
      setMobileFormOpen(false)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not save"
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string, productName: string) {
    if (!confirm(`Delete "${productName}"? This cannot be undone.`)) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/cmk/products/${id}`, { method: "DELETE" })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Delete failed")
      setProducts((prev) => prev.filter((p) => p.id !== id))
      if (editingId === id) resetForm()
      toast.success("Product deleted")
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Delete failed"
      toast.error(msg)
    } finally {
      setDeletingId(null)
    }
  }

  async function saveWishesOverride(next: WishesOverride) {
    setWishesSaving(true)
    try {
      const res = await fetch("/api/cmk/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "wishes_override", value: next }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Could not save")
      setWishesOverride(next)
      toast.success("Birthday section updated")
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not save"
      toast.error(msg)
    } finally {
      setWishesSaving(false)
    }
  }

  function updateRow(idx: number, patch: Partial<SizeRow>) {
    setSizeRows((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)),
    )
  }
  function removeRow(idx: number) {
    setSizeRows((prev) => prev.filter((_, i) => i !== idx))
  }
  function addRow() {
    setSizeRows((prev) => [...prev, { ...EMPTY_SIZE }])
  }

  const formContent = (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="p-name">Name</FieldLabel>
          <Input
            id="p-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Vanilla Birthday Cake"
            maxLength={100}
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="p-description">Description</FieldLabel>
          <Textarea
            id="p-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Moist 3-layer vanilla cake with vanilla buttercream, finished with sprinkles..."
            rows={4}
            maxLength={400}
          />
          <FieldDescription>
            Tell customers about ingredients, flavours, finish or special notes.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="p-category">Category</FieldLabel>
          <Input
            id="p-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Cakes, Cookies, Cupcakes..."
            maxLength={40}
          />
          <FieldDescription>Optional. Helps customers browse.</FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="p-price">
            {sizeRows.length > 0 ? "Base price (K)" : "Price (K)"}
          </FieldLabel>
          <Input
            id="p-price"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="15000"
            required={sizeRows.length === 0}
          />
          <FieldDescription>
            {sizeRows.length > 0
              ? "Used as a fallback. Customer-facing price comes from the selected size."
              : "Required when no sizes are added."}
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel>Sizes &amp; prices</FieldLabel>
          <FieldDescription>
            Add 6&quot;, 8&quot;, 10&quot; or whatever you offer. Customers can pick one.
            Leave empty to use a single price.
          </FieldDescription>
          <div className="mt-1 flex flex-col gap-2">
            {sizeRows.map((r, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  aria-label={`Size ${i + 1} label`}
                  value={r.label}
                  onChange={(e) => updateRow(i, { label: e.target.value })}
                  placeholder='e.g. 6" round'
                  maxLength={40}
                  className="flex-1"
                />
                <Input
                  aria-label={`Size ${i + 1} price`}
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  value={r.price}
                  onChange={(e) => updateRow(i, { price: e.target.value })}
                  placeholder="K"
                  className="w-28"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => removeRow(i)}
                  aria-label={`Remove size ${i + 1}`}
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="self-start rounded-full"
              onClick={addRow}
            >
              <Plus className="mr-1.5 h-4 w-4" aria-hidden="true" />
              Add size
            </Button>
          </div>
        </Field>

        <Field>
          <FieldLabel>Image</FieldLabel>
          <div className="rounded-2xl border border-dashed border-border bg-secondary/30 p-3 sm:p-4">
            {imageUrl ? (
              <div className="space-y-3">
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-card">
                  <Image
                    src={imageUrl || "/placeholder.svg"}
                    alt="Product preview"
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
                  onClick={() => setImageUrl("")}
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

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {editingId && (
          <Button
            type="button"
            variant="ghost"
            size="lg"
            className="h-12 rounded-full sm:h-11"
            onClick={() => {
              resetForm()
              setMobileFormOpen(false)
            }}
          >
            Cancel edit
          </Button>
        )}
        <Button
          type="submit"
          size="lg"
          className="h-12 w-full rounded-full text-base sm:flex-1"
          disabled={submitting || uploading}
        >
          {submitting ? (
            <Spinner className="mr-2" />
          ) : editingId ? (
            <Pencil className="mr-2 h-5 w-5" aria-hidden="true" />
          ) : (
            <Plus className="mr-2 h-5 w-5" aria-hidden="true" />
          )}
          {submitting
            ? "Saving..."
            : editingId
              ? "Save changes"
              : "Add product"}
        </Button>
      </div>
    </form>
  )

  return (
    <main className="min-h-dvh pb-24 lg:pb-0">
      {/* Header: compact on mobile, full on desktop */}
      <header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <BrandLogo size="sm" />
            <div className="min-w-0">
              <p className="truncate font-serif text-base font-bold leading-tight sm:text-lg">
                {SITE_CONFIG.businessName} Admin
              </p>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Private dashboard
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-9 rounded-full px-3"
              aria-label="View customer inquiries"
            >
              <Link href="/cmk/inquiries">
                <Inbox className="h-4 w-4 sm:mr-1.5" aria-hidden="true" />
                <span className="hidden sm:inline">Inquiries</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-9 rounded-full px-3"
              aria-label="Manage promos"
            >
              <Link href="/cmk/promos">
                <Sparkles className="h-4 w-4 sm:mr-1.5" aria-hidden="true" />
                <span className="hidden sm:inline">Promos</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-9 rounded-full px-3"
              aria-label="View birthday wishes"
            >
              <Link href="/cmk/wishes">
                <MessageCircleHeart className="h-4 w-4 sm:mr-1.5" aria-hidden="true" />
                <span className="hidden sm:inline">Wishes</span>
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
          <BirthdayCard
            value={wishesOverride}
            saving={wishesSaving}
            onChange={saveWishesOverride}
          />
          <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-2">
              {editingId ? (
                <Pencil className="h-5 w-5 text-primary" aria-hidden="true" />
              ) : (
                <Plus className="h-5 w-5 text-primary" aria-hidden="true" />
              )}
              <h2 className="font-serif text-2xl font-semibold">
                {editingId ? "Edit product" : "Add product"}
              </h2>
            </div>
            <p className="mb-6 mt-1 text-sm text-muted-foreground">
              {editingId
                ? "Changes go live on the public store right away."
                : "New items appear instantly on the public store."}
            </p>
            {formContent}
          </div>
        </aside>

        {/* Products list */}
        <section className="lg:col-span-3">
          <div className="mb-4 lg:hidden">
            <BirthdayCard
              value={wishesOverride}
              saving={wishesSaving}
              onChange={saveWishesOverride}
            />
          </div>

          <div className="mb-4 flex items-center justify-between gap-3 sm:mb-5">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" aria-hidden="true" />
              <h2 className="font-serif text-xl font-semibold sm:text-2xl">
                Products{" "}
                <span className="text-sm font-normal text-muted-foreground sm:text-base">
                  ({products.length})
                </span>
              </h2>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/50 px-6 py-12 text-center sm:p-10">
              <ImageIcon className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
              <p className="mt-4 font-serif text-lg font-semibold">No products yet</p>
              <p className="mt-1 text-pretty text-sm text-muted-foreground">
                Tap <span className="font-semibold text-foreground">Add product</span> below
                to fill up the store.
              </p>
            </div>
          ) : (
            <ul className="grid gap-3 sm:gap-4">
              {products.map((p) => {
                const minP = getMinSizePrice(p)
                const multi = hasMultipleSizes(p)
                return (
                  <li
                    key={p.id}
                    className={[
                      "rounded-2xl border bg-card p-3 shadow-sm transition-colors sm:p-4",
                      editingId === p.id ? "border-primary" : "border-border",
                    ].join(" ")}
                  >
                    <div className="flex gap-3 sm:gap-4">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-secondary sm:h-24 sm:w-28">
                        {p.image_url ? (
                          <Image
                            src={p.image_url || "/placeholder.svg"}
                            alt={p.name}
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
                              {p.name}
                            </h3>
                            {p.category && (
                              <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                                {p.category}
                              </span>
                            )}
                          </div>
                          {p.description && (
                            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                              {p.description}
                            </p>
                          )}
                          {Array.isArray(p.sizes) && p.sizes.length > 0 && (
                            <div className="mt-1.5 flex flex-wrap gap-1">
                              {p.sizes.map((s, i) => (
                                <span
                                  key={`${s.label}-${i}`}
                                  className="rounded-full border border-border bg-background px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                                >
                                  {s.label} · {formatPrice(s.price)}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <p className="font-serif text-lg font-bold text-primary">
                          {multi ? `from ${formatPrice(minP)}` : formatPrice(minP)}
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
                        onClick={() => handleDelete(p.id, p.name)}
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

      {/* Mobile bottom action bar — Add product opens sheet */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 p-3 backdrop-blur supports-[backdrop-filter]:bg-card/80 lg:hidden">
        <div className="mx-auto max-w-6xl" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
          <Button
            type="button"
            size="lg"
            className="h-12 w-full rounded-full text-base shadow-lg"
            onClick={() => {
              if (!editingId) resetForm()
              setMobileFormOpen(true)
            }}
          >
            {editingId ? (
              <Pencil className="mr-2 h-5 w-5" aria-hidden="true" />
            ) : (
              <Plus className="mr-2 h-5 w-5" aria-hidden="true" />
            )}
            {editingId ? "Continue editing" : "Add product"}
          </Button>
        </div>
      </div>

      <Sheet open={mobileFormOpen} onOpenChange={setMobileFormOpen}>
        <SheetContent
          side="bottom"
          className="h-[92dvh] overflow-y-auto rounded-t-3xl border-border p-0 lg:hidden"
        >
          <SheetHeader className="sticky top-0 z-10 border-b border-border bg-card/95 px-5 py-4 text-left backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <SheetTitle className="font-serif text-xl">
                  {editingId ? "Edit product" : "Add product"}
                </SheetTitle>
                <SheetDescription className="text-sm">
                  {editingId
                    ? "Changes go live on the public store right away."
                    : "New items appear instantly on the public store."}
                </SheetDescription>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 shrink-0 rounded-full"
                onClick={() => setMobileFormOpen(false)}
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

function BirthdayCard({
  value,
  saving,
  onChange,
}: {
  value: WishesOverride
  saving: boolean
  onChange: (next: WishesOverride) => void | Promise<void>
}) {
  const options: { id: "auto" | "on" | "off"; label: string; sub: string }[] = [
    { id: "auto", label: "Auto", sub: "Show ~2 weeks before, hide a day after Apr 25" },
    { id: "on", label: "Show", sub: "Force show now" },
    { id: "off", label: "Hide", sub: "Force hide now" },
  ]
  const current: "auto" | "on" | "off" =
    value === "on" ? "on" : value === "off" ? "off" : "auto"

  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-2">
        <Cake className="h-5 w-5 text-primary" aria-hidden="true" />
        <h2 className="font-serif text-lg font-semibold sm:text-xl">
          Birthday wishes section
        </h2>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Manually switch the home page wishes section on or off, or let it follow the
        automatic April window.
      </p>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {options.map((o) => {
          const active = current === o.id
          return (
            <button
              key={o.id}
              type="button"
              disabled={saving}
              aria-pressed={active}
              onClick={() => onChange(o.id === "auto" ? null : o.id)}
              className={[
                "rounded-2xl border p-3 text-left transition-colors",
                active
                  ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                  : "border-border bg-background hover:border-primary/40",
                saving ? "opacity-60" : "",
              ].join(" ")}
            >
              <p className="font-serif text-sm font-semibold text-foreground">
                {o.label}
              </p>
              <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                {o.sub}
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
