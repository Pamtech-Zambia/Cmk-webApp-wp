export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  category: string | null
  created_at: string
  updated_at: string
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
