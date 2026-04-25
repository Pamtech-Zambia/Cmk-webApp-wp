'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  icon: string
}

const bakingProducts: Product[] = [
  {
    id: '1',
    name: 'Chocolate Delight Cake',
    description: 'Rich, moist chocolate cake with layers of fudgy goodness',
    price: 8500,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=300&fit=crop',
    icon: '🍰',
  },
  {
    id: '2',
    name: 'Strawberry Cheesecake',
    description: 'Creamy cheesecake topped with fresh strawberries',
    price: 9500,
    image: 'https://images.unsplash.com/photo-1619365669667-97fc908f7f27?w=300&h=300&fit=crop',
    icon: '🍓',
  },
  {
    id: '3',
    name: 'Vanilla Macarons',
    description: 'Delicate French macarons in assorted flavors (12 pieces)',
    price: 5500,
    image: 'https://images.unsplash.com/photo-1586080876-944c86f7f11c?w=300&h=300&fit=crop',
    icon: '🎀',
  },
  {
    id: '4',
    name: 'Chocolate Chip Cookies',
    description: 'Classic homemade cookies with premium chocolate chips (1 dozen)',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=300&h=300&fit=crop',
    icon: '🍪',
  },
  {
    id: '5',
    name: 'Lemon Blueberry Tart',
    description: 'Tartly sweet lemon filling topped with fresh blueberries',
    price: 6500,
    image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=300&h=300&fit=crop',
    icon: '🫐',
  },
  {
    id: '6',
    name: 'Red Velvet Cupcakes',
    description: 'Elegant red velvet cupcakes with cream cheese frosting (6 pieces)',
    price: 5000,
    image: 'https://images.unsplash.com/photo-1599599810694-b5ac2dd65d4d?w=300&h=300&fit=crop',
    icon: '❤️',
  },
]

interface CartItem {
  product: Product
  quantity: number
}

const WHATSAPP_NUMBER = '260974619781' // Chimwemwe's WhatsApp

interface BakingStoreProps {
  showOnlyStore?: boolean
}

export default function BakingStore({ showOnlyStore = false }: BakingStoreProps) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)

  const sendWhatsAppOrder = () => {
    if (cart.length === 0) return

    const orderSummary = cart
      .map((item) => `${item.product.name} (x${item.quantity}) - MK${item.product.price * item.quantity}`)
      .join('\n')
    
    const totalPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    const message = encodeURIComponent(
      `Hello Chimwemwe! 🎉\n\nI would like to order:\n${orderSummary}\n\nTotal: MK${totalPrice}\n\nPlease confirm availability and delivery details. Thank you!`
    )
    
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank')
  }

  const sendProductWhatsApp = (product: Product) => {
    const message = encodeURIComponent(
      `Hello Chimwemwe! 🎉\n\nI'm interested in ordering:\n${product.name}\nPrice: MK${product.price}\n\nPlease let me know about availability and delivery. Thank you!`
    )
    
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank')
  }

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id)
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevCart, { product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-yellow-50 to-pink-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent">
              {showOnlyStore ? 'Baking Store' : "Chimwemwe's Baking"}
            </h2>
            <p className="text-gray-600 text-lg">
              {showOnlyStore ? 'Order delicious treats anytime' : 'Handcrafted treats made with love'}
            </p>
          </div>
          <button
            onClick={() => setShowCart(!showCart)}
            className="relative px-4 py-2 bg-white border-2 border-pink-300 rounded-full font-semibold text-pink-600 hover:bg-pink-50 transition-colors"
          >
            🛒 ({itemCount})
          </button>
        </div>

        {/* Cart Display */}
        {showCart && (
          <div className="mb-8 bg-white rounded-2xl p-6 shadow-lg border-2 border-pink-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Your Order</h3>
            {cart.length === 0 ? (
              <p className="text-gray-600">Your cart is empty. Add some treats!</p>
            ) : (
              <>
                <div className="space-y-3 mb-6">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex justify-between items-center bg-pink-50 p-4 rounded-lg"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">{item.product.name}</p>
                        <p className="text-gray-600">
                          MK{item.product.price} × {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-pink-600">
                          MK{item.product.price * item.quantity}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-500 hover:text-red-700 font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t-2 border-pink-200 pt-4">
                  <p className="text-lg font-bold text-gray-800">
                    Total: MK{total}
                  </p>
                  <button 
                    onClick={sendWhatsAppOrder}
                    className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-400 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
                  >
                    💬 Order via WhatsApp
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bakingProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="relative w-full h-48">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute top-4 right-4 text-3xl">
                  {product.icon}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {product.description}
                </p>

                <div className="flex justify-between items-center gap-2">
                  <span className="text-2xl font-bold text-pink-600">
                    MK{product.price}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => addToCart(product)}
                      className="px-3 py-2 bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all text-sm"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => sendProductWhatsApp(product)}
                      className="px-3 py-2 bg-green-500 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all text-sm"
                    >
                      💬 Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
