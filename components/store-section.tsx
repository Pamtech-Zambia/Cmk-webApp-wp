"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ShoppingBag, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import type { Product } from "@/lib/types"
import { SITE_CONFIG, buildWhatsappUrl } from "@/lib/config"

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "MWK",
    maximumFractionDigits: 0,
  })
    .format(price)
    .replace("MWK", "MK")
}

function buildOrderMessage(p: Product) {
  return `Hi ${SITE_CONFIG.businessName}, I'd like to order:

* ${p.name} — ${formatPrice(p.price)}
${p.description ? `(${p.description})\n` : ""}
Could you please confirm availability and delivery details?

Thank you!`
}

function ProductCard({ product }: { product: Product }) {
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
            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="font-serif text-xl font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          <Button asChild size="sm" className="rounded-full">
            <a
              href={buildWhatsappUrl(buildOrderMessage(product))}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="mr-1.5 h-4 w-4" aria-hidden="true" />
              Order
            </a>
          </Button>
        </div>
      </div>
    </article>
  )
}

export function StoreSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

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
            >
              <MessageCircle className="mr-2 h-4 w-4" aria-hidden="true" />
              Chat on WhatsApp
            </a>
          </Button>
        </div>

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
              <Button asChild className="mt-6 rounded-full">
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
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
