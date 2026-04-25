'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Navigation() {
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`transition-all duration-300 ${
        isSticky
          ? 'fixed top-0 w-full bg-white shadow-lg z-50'
          : 'relative bg-white shadow-md'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent">
            Chimwemwe
          </span>
        </Link>
        <div className="flex gap-4">
          <Link
            href="/"
            className="px-4 py-2 text-gray-700 hover:text-pink-600 transition-colors font-semibold"
          >
            Home
          </Link>
          <Link
            href="#products"
            className="px-4 py-2 text-gray-700 hover:text-pink-600 transition-colors font-semibold"
          >
            Products
          </Link>
          <Link
            href="/admin/login"
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  )
}
