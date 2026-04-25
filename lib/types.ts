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
