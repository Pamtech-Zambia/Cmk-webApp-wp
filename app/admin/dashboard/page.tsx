'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  is_available: boolean
  display_order: number
  created_at: string
}

interface Order {
  id: string
  customer_name: string
  customer_phone: string
  quantity: number
  total_price: number
  status: string
  product?: { name: string; price: number }
  created_at: string
}

interface BirthdayMessage {
  id: string
  sender_name: string
  sender_email?: string
  message: string
  is_read: boolean
  created_at: string
}

type Tab = 'overview' | 'products' | 'orders' | 'messages'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [messages, setMessages] = useState<BirthdayMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    image_url: '',
  })

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = getCookie('auth_token')
      if (!token) {
        router.push('/admin/login')
        return
      }
      
      const userData = localStorage.getItem('user')
      if (userData) {
        setUser(JSON.parse(userData))
      }
      
      loadData()
    } catch (error) {
      router.push('/admin/login')
    }
  }

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(';').shift()
    return null
  }

  const loadData = async () => {
    try {
      setIsLoading(true)
      const token = getCookie('auth_token')
      
      const [productsRes, ordersRes, messagesRes] = await Promise.all([
        fetch('/api/admin/products', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }),
        fetch('/api/admin/orders', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }),
        fetch('/api/admin/messages', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }),
      ])

      if (productsRes.ok) {
        const data = await productsRes.json()
        setProducts(data)
      }
      if (ordersRes.ok) {
        const data = await ordersRes.json()
        setOrders(data)
      }
      if (messagesRes.ok) {
        const data = await messagesRes.json()
        setMessages(data)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const method = editingProduct ? 'PUT' : 'POST'
      const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      })

      if (response.ok) {
        if (editingProduct) {
          setProducts(products.map((p) => (p.id === editingProduct.id ? { ...editingProduct, ...newProduct } : p)))
          setEditingProduct(null)
        } else {
          loadData()
        }
        setNewProduct({ name: '', description: '', price: 0, image_url: '' })
        setShowAddProduct(false)
      }
    } catch (error) {
      console.error('Error saving product:', error)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
      if (response.ok) {
        setProducts(products.filter((p) => p.id !== id))
      }
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  const handleToggleAvailability = async (id: string, isAvailable: boolean) => {
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_available: !isAvailable }),
      })

      if (response.ok) {
        setProducts(products.map((p) => (p.id === id ? { ...p, is_available: !isAvailable } : p)))
      }
    } catch (error) {
      console.error('Error updating product:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
    router.push('/admin/login')
  }

  const stats = {
    totalProducts: products.length,
    availableProducts: products.filter((p) => p.is_available).length,
    totalOrders: orders.length,
    pendingOrders: orders.filter((o) => o.status === 'pending').length,
    totalMessages: messages.length,
    unreadMessages: messages.filter((m) => !m.is_read).length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              {user?.profile?.full_name && <p className="text-sm text-gray-600 mt-1">Welcome, {user.profile.full_name}</p>}
            </div>
            <div className="flex gap-2">
              <Link href="/store" className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors">
                View Store
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto" role="tablist">
            {[
              { id: 'overview' as Tab, label: 'Overview', icon: '📊' },
              { id: 'products' as Tab, label: 'Products', icon: '📦' },
              { id: 'orders' as Tab, label: 'Orders', icon: '🛒' },
              { id: 'messages' as Tab, label: 'Messages', icon: '💌' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-4 border-b-2 font-semibold transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-pink-600 text-pink-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : activeTab === 'overview' ? (
          // Overview Tab
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[
              { label: 'Products', value: stats.totalProducts, subtext: `${stats.availableProducts} available` },
              { label: 'Orders', value: stats.totalOrders, subtext: `${stats.pendingOrders} pending` },
              { label: 'Messages', value: stats.totalMessages, subtext: `${stats.unreadMessages} unread` },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-sm p-6">
                <p className="text-gray-600 text-sm font-semibold mb-2">{stat.label}</p>
                <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600 mt-2">{stat.subtext}</p>
              </div>
            ))}
          </div>
        ) : activeTab === 'products' ? (
          // Products Tab
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Products</h2>
              <button
                onClick={() => {
                  setEditingProduct(null)
                  setNewProduct({ name: '', description: '', price: 0, image_url: '' })
                  setShowAddProduct(!showAddProduct)
                }}
                className="px-4 py-2 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition-colors"
              >
                {showAddProduct ? 'Cancel' : '+ Add Product'}
              </button>
            </div>

            {showAddProduct && (
              <form onSubmit={handleAddProduct} className="bg-white rounded-lg shadow-sm p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price (MK)</label>
                    <input
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                      required
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
                    <input
                      type="url"
                      value={newProduct.image_url}
                      onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition-colors"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {product.image_url && (
                    <div className="relative w-full h-40 bg-gray-200">
                      <Image src={product.image_url} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                    <p className="text-lg font-bold text-pink-600 mb-4">MK{product.price.toLocaleString()}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleAvailability(product.id, product.is_available)}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                          product.is_available
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {product.is_available ? '✓ Available' : 'Hidden'}
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-200 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'orders' ? (
          // Orders Tab
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
            {orders.length === 0 ? (
              <p className="text-gray-600">No orders yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-lg shadow-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Customer</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Phone</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Quantity</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Total</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{order.customer_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{order.customer_phone}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{order.quantity}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">MK{order.total_price.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{new Date(order.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          // Messages Tab
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Birthday Messages</h2>
            {messages.length === 0 ? (
              <p className="text-gray-600">No messages yet</p>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-pink-500">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-900">{msg.sender_name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${msg.is_read ? 'bg-gray-100 text-gray-700' : 'bg-blue-100 text-blue-700'}`}>
                        {msg.is_read ? 'Read' : 'Unread'}
                      </span>
                    </div>
                    {msg.sender_email && <p className="text-sm text-gray-600 mb-3">{msg.sender_email}</p>}
                    <p className="text-gray-700 mb-2">{msg.message}</p>
                    <p className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
