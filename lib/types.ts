export interface ProductSize {
  label: string
  price: number
}

export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  category: string | null
  sizes: ProductSize[]
  created_at: string
  updated_at: string
}

export interface Inquiry {
  id: string
  product_id: string | null
  product_name: string | null
  size_label: string | null
  customer_name: string
  contact: string
  message: string
  status: "new" | "replied" | "closed"
  created_at: string
  updated_at: string
}

export type WishesOverride = "on" | "off" | null

export interface Settings {
  wishes_override: WishesOverride
}

export interface Wish {
  id: string
  name: string
  message: string
  created_at: string
}

export interface Promo {
  id: string
  title: string
  description: string | null
  image_url: string | null
  cta_label: string | null
  cta_url: string | null
  expires_at: string
  created_at: string
  updated_at: string
}

export type ReviewStatus = "pending" | "approved" | "rejected"

export interface Review {
  id: string
  customer_name: string
  customer_email: string | null
  rating: number
  title: string | null
  message: string
  product_id: string | null
  product_name: string | null
  status: ReviewStatus
  featured: boolean
  created_at: string
  updated_at: string
}
