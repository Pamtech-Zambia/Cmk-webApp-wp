"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Cake,
  Plus,
  Trash2,
  Upload,
  ImageIcon,
  ArrowLeft,
  Package,
  MessageCircleHeart,
} from "lucide-react"
import { toast } from "sonner"
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
import { SITE_CONFIG } from "@/lib/config"
import type { Product } from "@/lib/types"

function formatPrice(price: number) {
  return `MK ${price.toLocaleString()}`
}

export function CmkDashboard({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const priceNum = Number.parseFloat(price)
    if (!name.trim() || Number.isNaN(priceNum) || priceNum < 0) {
      toast.error("Add a name and a valid price.")
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch("/api/cmk/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          price: priceNum,
          image_url: imageUrl || null,
          category: category.trim() || null,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Could not save")
      setProducts((prev) => [json.product as Product, ...prev])
      toast.success(`${name} added to the menu`)
      setName("")
      setDescription("")
      setPrice("")
      setCategory("")
      setImageUrl("")
      if (fileInputRef.current) fileInputRef.current.value = ""
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
      toast.success("Product deleted")
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Delete failed"
      toast.error(msg)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <main className="min-h-screen">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Cake className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-serif text-lg font-bold leading-none">
                {SITE_CONFIG.businessName} Admin
              </p>
              <p className="text-xs text-muted-foreground">Private dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="rounded-full">
              <Link href="/cmk/wishes">
                <MessageCircleHeart className="mr-1.5 h-4 w-4" aria-hidden="true" />
                Wishes
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="rounded-full">
              <Link href="/">
                <ArrowLeft className="mr-1.5 h-4 w-4" aria-hidden="true" />
                Back to site
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-5">
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8 lg:col-span-2 lg:sticky lg:top-6 lg:h-fit"
        >
          <div className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="font-serif text-2xl font-semibold">Add product</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            New items appear instantly on the public store.
          </p>

          <FieldGroup className="mt-6">
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
              <FieldLabel htmlFor="p-price">Price (MK)</FieldLabel>
              <Input
                id="p-price"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="15000"
                required
              />
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
              <FieldLabel htmlFor="p-description">Description</FieldLabel>
              <Textarea
                id="p-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Moist 3-layer vanilla cake with..."
                rows={3}
                maxLength={400}
              />
            </Field>

            <Field>
              <FieldLabel>Image</FieldLabel>
              <div className="rounded-2xl border border-dashed border-border bg-secondary/30 p-4">
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
                    className="flex w-full flex-col items-center justify-center gap-2 rounded-xl py-6 text-sm text-muted-foreground transition-colors hover:bg-secondary/60"
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
                        <span className="font-medium">Click to upload an image</span>
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

          <Button
            type="submit"
            size="lg"
            className="mt-2 w-full rounded-full"
            disabled={submitting || uploading}
          >
            {submitting ? <Spinner className="mr-2" /> : <Plus className="mr-2 h-4 w-4" aria-hidden="true" />}
            {submitting ? "Saving..." : "Add product"}
          </Button>
        </form>

        <section className="lg:col-span-3">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" aria-hidden="true" />
              <h2 className="font-serif text-2xl font-semibold">
                Products{" "}
                <span className="text-base font-normal text-muted-foreground">
                  ({products.length})
                </span>
              </h2>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/50 p-10 text-center">
              <ImageIcon className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
              <p className="mt-4 font-serif text-lg font-semibold">No products yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Add your first product on the left to fill up the store.
              </p>
            </div>
          ) : (
            <ul className="grid gap-4">
              {products.map((p) => (
                <li
                  key={p.id}
                  className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center"
                >
                  <div className="relative h-20 w-full overflow-hidden rounded-xl bg-secondary sm:h-20 sm:w-28 sm:shrink-0">
                    {p.image_url ? (
                      <Image
                        src={p.image_url || "/placeholder.svg"}
                        alt={p.name}
                        fill
                        sizes="120px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        <ImageIcon className="h-6 w-6" aria-hidden="true" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-serif text-base font-semibold text-foreground">
                        {p.name}
                      </h3>
                      {p.category && (
                        <span className="shrink-0 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                          {p.category}
                        </span>
                      )}
                    </div>
                    {p.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {p.description}
                      </p>
                    )}
                    <p className="mt-1 font-serif text-base font-bold text-primary">
                      {formatPrice(p.price)}
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive sm:shrink-0"
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
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}
