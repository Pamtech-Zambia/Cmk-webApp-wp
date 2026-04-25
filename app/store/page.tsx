'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
}

interface CartItem {
  product: Product
  quantity: number
}

const WHATSAPP_NUMBER = '260974619781'

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [cartError, setCartError] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products')
      if (!response.ok) throw new Error('Failed to fetch products')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
    setShowCart(true)
  }

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      )
    }
  }

  const sendWhatsAppOrder = () => {
    if (cart.length === 0) {
      setCartError('Cart is empty')
      return
    }

    const orderSummary = cart
      .map((item) => `${item.product.name} (x${item.quantity}) - MK${item.product.price * item.quantity}`)
      .join('\n')

    const totalPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    const message = encodeURIComponent(
      `Hello Chimwemwe!\n\nI would like to order:\n${orderSummary}\n\nTotal: MK${totalPrice}\n\nPlease confirm availability and delivery details. Thank you!`
    )

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank')
  }

  const sendProductWhatsApp = (product: Product) => {
    const message = encodeURIComponent(
      `Hello Chimwemwe!\n\nI'm interested in ordering:\n${product.name}\nPrice: MK${product.price}\n\nPlease let me know about availability and delivery. Thank you!`
    )
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank')
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50">
      <Sidebar />
      <main className="md:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center justify-between sm:justify-start gap-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent">
                  Baking Store
                </h1>
              <Link
                href="/admin/login"
                className="ml-auto sm:ml-0 px-4 py-2 text-sm font-semibold text-pink-600 hover:text-pink-700 transition-colors"
              >
                Admin
              </Link>
            </div>

            <button
              onClick={() => setShowCart(!showCart)}
              className="relative px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow flex items-center gap-2 sm:ml-auto"
            >
              <span>Cart</span>
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center -mt-2 -mr-2">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No products available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden flex flex-col"
                  >
                    {/* Product Image */}
                    <div className="relative w-full h-48 sm:h-56 bg-gray-200">
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-3">{product.description}</p>

                      {/* Price and Actions */}
                      <div className="space-y-3">
                        <p className="text-2xl font-bold text-pink-600">MK{product.price.toLocaleString()}</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => addToCart(product)}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
                          >
                            Add to Cart
                          </button>
                          <button
                            onClick={() => sendProductWhatsApp(product)}
                            className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
                          >
                            WhatsApp
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Sidebar */}
          {showCart && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Cart</h2>

                {cart.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">Your cart is empty</p>
                ) : (
                  <>
                    <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                      {cart.map((item) => (
                        <div key={item.product.id} className="bg-gray-50 p-3 rounded-lg">
                          <p className="font-semibold text-gray-800 text-sm mb-2">{item.product.name}</p>
                          <div className="flex items-center gap-2 mb-2">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center text-xs font-bold hover:bg-gray-300"
                            >
                              −
                            </button>
                            <span className="text-sm font-semibold flex-1 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center text-xs font-bold hover:bg-gray-300"
                            >
                              +
                            </button>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-red-500 hover:text-red-700 font-bold ml-2"
                            >
                              ✕
                            </button>
                          </div>
                          <p className="text-sm text-gray-600">
                            MK{(item.product.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4">
                      <p className="text-lg font-bold text-gray-800 mb-2">
                        Total: MK{totalPrice.toLocaleString()}
                      </p>
                      {cartError && <p className="text-red-600 text-sm mb-2">{cartError}</p>}
                      <button
                        onClick={sendWhatsAppOrder}
                        className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-400 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
                      >
                        <span>💬</span>
                        Order via WhatsApp
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      </main>
    </div>
  )
}
