'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const navItems = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/store', label: 'CMK Store', icon: '🛒' },
    { href: '/wishes', label: 'Wishes & Love', icon: '💌' },
    { href: '/admin/login', label: 'Admin Panel', icon: '⚙️' },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-pink-500 text-white shadow-lg hover:bg-pink-600 transition-colors md:hidden"
          aria-label="Toggle menu"
        >
          <svg
            className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-pink-50 to-orange-50 border-r-2 border-pink-200 shadow-xl z-40 transition-transform duration-300 ease-in-out ${
          isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'
        } md:translate-x-0`}
      >
        {/* Logo */}
        <div className="p-6 border-b-2 border-pink-200">
          <Link href="/" className="flex items-center gap-2" onClick={() => isMobile && setIsOpen(false)}>
            <span className="text-2xl">🍰</span>
            <div>
              <span className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent">
                CMK
              </span>
              <p className="text-xs text-gray-600">Chimwemwe's Baking</p>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => isMobile && setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive(item.href)
                  ? 'bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-pink-100 hover:text-pink-700'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-semibold">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Contact Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t-2 border-pink-200 bg-white">
          <p className="text-xs font-semibold text-gray-700 mb-2">Contact</p>
          <p className="text-sm text-gray-600">
            <a href="tel:+260974619781" className="hover:text-pink-600 transition-colors">
              +260 974 619 781
            </a>
          </p>
          <p className="text-xs text-gray-500 mt-1">WhatsApp Available</p>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
