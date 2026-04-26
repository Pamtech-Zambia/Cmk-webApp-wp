"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, MessageCircle, Moon, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"
import type { Product, ProductSize } from "@/lib/types"
import { SITE_CONFIG, buildWhatsappUrl } from "@/lib/config"
import { getSabbathInfo, SABBATH_CLOSED_MESSAGE } from "@/lib/sabbath"
import { formatPrice, getMinSizePrice } from "@/lib/product"
import { InquiryDialog } from "@/components/inquiry-dialog"

function buildOrderMessage(p: Product, size?: ProductSize) {
  const sizeLine = size ? ` (${size.label})` : ""
  const price = size ? size.price : p.price
  return `Hi ${SITE_CONFIG.businessName}, I'd like to order:

* ${p.name}${sizeLine} — ${formatPrice(price)}
${p.description ? `(${p.description})\n` : ""}
Could you please confirm availability and delivery details?

Thank you!`
}

function ProductCard({
  product,
  onSabbathClick,
}: {
  product: Product
  onSabbathClick: () => void
}) {
  const sizes = product.sizes ?? []
  const [selectedIdx, setSelectedIdx] = useState(0)
  const selectedSize: ProductSize | undefined =
    sizes.length > 0 ? sizes[selectedIdx] : undefined
  const displayedPrice = selectedSize ? selectedSize.price : product.price

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-secondary">
        {product.image_url ? (
          <Image
            src={product.image_url || "/placeholder.svg"}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <ShoppingBag className="h-10 w-10" aria-hidden="true" />
          </div>
        )}
        {product.category && (
          <span className="absolute left-3 top-3 rounded-full bg-background/95 px-3 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur">
            {product.category}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex-1">
          <h3 className="font-serif text-xl font-semibold leading-tight text-foreground">
            {product.name}
          </h3>
          {product.description && (
            <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          )}
        </div>

        {sizes.length > 0 && (
          <div className="-mx-1 flex flex-wrap gap-1.5">
            {sizes.map((s, i) => {
              const active = i === selectedIdx
              return (
                <button
                  key={`${s.label}-${i}`}
                  type="button"
                  onClick={() => setSelectedIdx(i)}
                  aria-pressed={active}
                  className={[
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    active
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-secondary",
                  ].join(" ")}
                >
                  {s.label}
                </button>
              )
            })}
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <span className="font-serif text-xl font-bold text-primary">
            {formatPrice(displayedPrice)}
          </span>
          <div className="flex items-center gap-2">
            <InquiryDialog
              productId={product.id}
              productName={product.name}
              sizeLabel={selectedSize?.label ?? null}
            />
            <Button asChild size="sm" className="rounded-full">
              <a
                href={buildWhatsappUrl(buildOrderMessage(product, selectedSize))}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (getSabbathInfo().isSabbath) {
                    e.preventDefault()
                    onSabbathClick()
                  }
                }}
              >
                <MessageCircle className="mr-1.5 h-4 w-4" aria-hidden="true" />
                Order
              </a>
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}

const PRICE_BUCKETS = [
  { id: "all", label: "All prices" },
  { id: "under_100", label: "Under K100", max: 100 },
  { id: "100_500", label: "K100 – K500", min: 100, max: 500 },
  { id: "500_1000", label: "K500 – K1,000", min: 500, max: 1000 },
  { id: "1000_plus", label: "K1,000 +", min: 1000 },
] as const

type PriceBucketId = (typeof PRICE_BUCKETS)[number]["id"]

export function StoreSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [sabbathOpen, setSabbathOpen] = useState(false)
  const [isSabbath, setIsSabbath] = useState(false)
  const [endsLabel, setEndsLabel] = useState<string | undefined>(undefined)
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [activeBucket, setActiveBucket] = useState<PriceBucketId>("all")

  useEffect(() => {
    function update() {
      const info = getSabbathInfo()
      setIsSabbath(info.isSabbath)
      setEndsLabel(info.endsLabel)
    }
    update()
    const id = setInterval(update, 60_000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    let cancelled = false
    const supabase = createClient()
    async function load() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
      if (!cancelled) {
        if (error) console.log("[v0] error loading products:", error.message)
        setProducts((data as Product[]) || [])
        setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const categories = useMemo(() => {
    const set = new Set<string>()
    for (const p of products) if (p.category) set.add(p.category)
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [products])

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (activeCategory !== "all" && p.category !== activeCategory) return false
      const minPrice = getMinSizePrice(p)
      const maxPrice =
        Array.isArray(p.sizes) && p.sizes.length > 0
          ? p.sizes.reduce((m, s) => (s.price > m ? s.price : m), p.sizes[0].price)
          : p.price
      const bucket = PRICE_BUCKETS.find((b) => b.id === activeBucket)
      if (!bucket || bucket.id === "all") return true
      const bMin = "min" in bucket ? bucket.min : 0
      const bMax = "max" in bucket ? bucket.max : Number.POSITIVE_INFINITY
      // Product matches if any of its prices intersect the bucket range
      return maxPrice >= bMin && minPrice <= bMax
    })
  }, [products, activeCategory, activeBucket])

  const showFilters = products.length > 0

  return (
    <section
      id="store"
      className="border-y border-border bg-secondary/30 py-16 sm:py-24"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
              {SITE_CONFIG.businessName}
            </span>
            <h2 className="mt-4 font-serif text-4xl font-bold text-foreground sm:text-5xl">
              Order something sweet
            </h2>
            <p className="mt-3 max-w-xl text-pretty text-muted-foreground">
              Tap any item to start your order on WhatsApp. We bake fresh, daily.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <InquiryDialog
              trigger={
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full border-primary/30 bg-background"
                >
                  Send an inquiry
                </Button>
              }
            />
            <Button
              asChild
              variant="outline"
              className="rounded-full border-primary/30 bg-background"
            >
              <a
                href={buildWhatsappUrl(
                  `Hi ${SITE_CONFIG.businessName}! I'd like to ask about your products.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (getSabbathInfo().isSabbath) {
                    e.preventDefault()
                    setSabbathOpen(true)
                  }
                }}
              >
                <MessageCircle className="mr-2 h-4 w-4" aria-hidden="true" />
                Chat on WhatsApp
              </a>
            </Button>
          </div>
        </div>

        {isSabbath && (
          <div className="mt-8 flex flex-col items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Moon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="font-serif text-base font-semibold text-foreground">
                  {SABBATH_CLOSED_MESSAGE}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {endsLabel
                    ? `Orders resume after sunset. ${endsLabel}.`
                    : "Orders resume after sunset on Saturday."}
                </p>
              </div>
            </div>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="shrink-0 rounded-full border-primary/30 bg-background"
            >
              <Link href="/sabbath">Learn more</Link>
            </Button>
          </div>
        )}

        {showFilters && (
          <div className="mt-8 rounded-2xl border border-border bg-card/60 p-3 sm:p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              Filter
            </div>
            <div className="mt-3 flex flex-col gap-3">
              {(categories.length > 0) && (
                <div className="-mx-1 flex flex-wrap gap-1.5">
                  <FilterPill
                    label="All"
                    active={activeCategory === "all"}
                    onClick={() => setActiveCategory("all")}
                  />
                  {categories.map((c) => (
                    <FilterPill
                      key={c}
                      label={c}
                      active={activeCategory === c}
                      onClick={() => setActiveCategory(c)}
                    />
                  ))}
                </div>
              )}
              <div className="-mx-1 flex flex-wrap gap-1.5">
                {PRICE_BUCKETS.map((b) => (
                  <FilterPill
                    key={b.id}
                    label={b.label}
                    active={activeBucket === b.id}
                    onClick={() => setActiveBucket(b.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-10">
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-80 animate-pulse rounded-2xl bg-card/60"
                  aria-hidden="true"
                />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card p-12 text-center">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
              <p className="mt-4 font-serif text-xl font-semibold">
                Our menu is being prepared
              </p>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Fresh products are coming very soon. In the meantime, message us on WhatsApp
                for custom orders.
              </p>
              <Button
                asChild
                className="mt-6 rounded-full"
                onClick={(e) => {
                  if (getSabbathInfo().isSabbath) {
                    e.preventDefault()
                    setSabbathOpen(true)
                  }
                }}
              >
                <a
                  href={buildWhatsappUrl(
                    `Hi ${SITE_CONFIG.businessName}! I'd like to ask about a custom order.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 h-4 w-4" aria-hidden="true" />
                  Message us
                </a>
              </Button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card p-10 text-center">
              <p className="font-serif text-lg font-semibold">No matches</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try a different category or price range.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 rounded-full"
                onClick={() => {
                  setActiveCategory("all")
                  setActiveBucket("all")
                }}
              >
                Reset filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onSabbathClick={() => setSabbathOpen(true)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={sabbathOpen} onOpenChange={setSabbathOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Moon className="h-6 w-6" aria-hidden="true" />
            </div>
            <DialogTitle className="font-serif text-2xl">
              {SABBATH_CLOSED_MESSAGE}
            </DialogTitle>
            <DialogDescription className="text-pretty">
              {endsLabel
                ? `Please come back after sunset. ${endsLabel}.`
                : "Please come back after sunset on Saturday — we'll be glad to take your order then."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setSabbathOpen(false)}
              className="rounded-full"
            >
              Close
            </Button>
            <Button asChild className="rounded-full">
              <Link href="/sabbath">Learn more</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-secondary",
      ].join(" ")}
    >
      {label}
    </button>
  )
}

