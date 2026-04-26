import type { Product, ProductSize } from "@/lib/types"

/**
 * Sanitize an arbitrary `sizes` payload from the API/DB into a
 * well-formed array of { label, price }. Drops invalid entries.
 */
export function sanitizeSizes(input: unknown): ProductSize[] {
  if (!Array.isArray(input)) return []
  const out: ProductSize[] = []
  for (const raw of input) {
    if (!raw || typeof raw !== "object") continue
    const r = raw as Record<string, unknown>
    const label = typeof r.label === "string" ? r.label.trim() : ""
    const priceNum =
      typeof r.price === "number"
        ? r.price
        : typeof r.price === "string"
          ? Number.parseFloat(r.price)
          : Number.NaN
    if (!label) continue
    if (!Number.isFinite(priceNum) || priceNum < 0) continue
    out.push({ label, price: Number(priceNum) })
  }
  return out
}

/** The minimum size price, used as the displayed "from" price. */
export function getMinSizePrice(p: Pick<Product, "price" | "sizes">): number {
  if (!p.sizes || p.sizes.length === 0) return p.price
  return p.sizes.reduce(
    (min, s) => (s.price < min ? s.price : min),
    p.sizes[0].price,
  )
}

/** Whether to show a "from" prefix (i.e. multiple distinct prices). */
export function hasMultipleSizes(p: Pick<Product, "sizes">): boolean {
  return Array.isArray(p.sizes) && p.sizes.length >= 2
}

export function formatPrice(price: number): string {
  return `K${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(price)}`
}
