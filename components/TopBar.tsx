'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { getBirthdayPeriod, shouldShowBirthdayContent } from '@/lib/birthday'

export default function TopBar() {
  const pathname = usePathname()
  const period = getBirthdayPeriod()
  const showBirthday = shouldShowBirthdayContent()

  // Don't show TopBar on admin login page
  if (pathname === '/admin/login') {
    return null
  }

  return (
    <div className="sticky top-0 z-30 w-full">
      {/* Birthday Banner */}
      {showBirthday && (
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white py-3 px-4 text-center animate-pulse">
          <p className="text-sm md:text-base font-bold">
            🎉 Celebrating Chimwemwe's Special Day - April 25th! 💖
          </p>
        </div>
      )}

      {/* Top Navigation Bar */}
      <nav className="bg-white/95 backdrop-blur-md border-b-2 border-pink-200 shadow-sm">
        <div className="max-w-full mx-auto px-4 py-3 flex items-center justify-between">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
          >
            <span className="text-2xl md:text-3xl group-hover:scale-110 transition-transform">🍰</span>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-pink-600">CMK Baking</p>
              <p className="text-xs text-gray-500">Chimwemwe's Joy</p>
            </div>
          </Link>

          {/* Center - Countdown or Message */}
          <div className="text-center flex-1 mx-4">
            {showBirthday ? (
              <p className="text-xs md:text-sm font-semibold text-pink-600">
                ✨ Days of Celebration & Happiness ✨
              </p>
            ) : (
              <p className="text-xs md:text-sm font-semibold text-pink-600">
                {period.daysUntilBirthday > 0
                  ? `${period.daysUntilBirthday} days until Chimwemwe's birthday!`
                  : 'Birthday celebrations ahead!'}
              </p>
            )}
          </div>

          {/* Social/Contact */}
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/260974619781"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
              title="WhatsApp"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378c-3.055 2.364-3.905 6.75-1.896 10.157 2.009 3.406 6.614 4.575 10.047 2.579.8-.49 1.502-1.136 2.08-1.878v.005c4.498-5.651 2.633-14.269-4.04-17.206-1.521-.795-3.14-1.147-4.706-1.03z" />
              </svg>
            </a>

            {/* Quick Links */}
            <div className="hidden md:flex items-center gap-1">
              {[
                { href: '/wishes', label: 'Wishes', icon: '💌' },
                { href: '/store', label: 'Store', icon: '🛒' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-2 py-1 rounded text-xs font-medium text-gray-700 hover:bg-pink-100 hover:text-pink-700 transition-colors"
                  title={link.label}
                >
                  {link.icon}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}
