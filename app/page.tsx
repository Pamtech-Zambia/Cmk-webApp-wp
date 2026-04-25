'use client'

import { useEffect, useState } from 'react'
import Hero from '@/components/Hero'
import Countdown from '@/components/Countdown'
import About from '@/components/About'
import PhotoGallery from '@/components/PhotoGallery'
import Timeline from '@/components/Timeline'
import BakingStore from '@/components/BakingStore'
import BirthdayWishesSection from '@/components/BirthdayWishesSection'
import { shouldShowBirthdayContent, shouldShowNormalStore, getBirthdayPeriod } from '@/lib/birthday'
import Sidebar from '@/components/Sidebar'

export default function Home() {
  const [showBirthday, setShowBirthday] = useState(false)
  const [showStore, setShowStore] = useState(false)
  const [period, setPeriod] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const birthdayPeriod = getBirthdayPeriod()
    setPeriod(birthdayPeriod)
    setShowBirthday(shouldShowBirthdayContent())
    setShowStore(shouldShowNormalStore())
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen">
      <Sidebar />

      <main className="md:ml-64">
        {showBirthday ? (
          <>
            <Hero />
            <Countdown />
            <BirthdayWishesSection />
            <About />
            <PhotoGallery />
            <Timeline />
            {period?.isBirthdayToday && (
              <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white py-8 px-4 text-center">
                <p className="text-2xl font-bold">🎉 SPECIAL CELEBRATION TODAY! 🎉</p>
              </div>
            )}
            
            {period?.isBirthdayTomorrow && (
              <div className="bg-gradient-to-r from-orange-400 to-pink-500 text-white py-8 px-4 text-center">
                <p className="text-2xl font-bold">🎊 SPECIAL CELEBRATION COMING TOMORROW! 🎊</p>
              </div>
            )}

            <footer className="bg-gradient-to-r from-pink-600 to-orange-500 text-white py-8 px-4">
              <div className="max-w-6xl mx-auto text-center">
                <p className="text-lg font-semibold mb-2">Happy Birthday Chimwemwe! 🎉💖</p>
                <p className="opacity-90">CMK Baking celebrates you with love, joy, and the sweetest treats.</p>
                <p className="text-sm opacity-75 mt-4">April 25th - Your Special Day of Happiness</p>
              </div>
            </footer>
          </>
        ) : showStore ? (
          <>
            <div className="bg-gradient-to-r from-pink-100 to-orange-100 py-8 px-4">
              <div className="max-w-6xl mx-auto text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">CMK Baking Store</h1>
                <p className="text-lg text-gray-700">Order delicious baked goods anytime</p>
              </div>
            </div>
            <BakingStore showOnlyStore={true} />

            <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8 px-4">
              <div className="max-w-6xl mx-auto text-center">
                <p className="text-lg font-semibold mb-2">CMK Baking</p>
                <p className="opacity-90">Artisanal bakes made with passion</p>
                <p className="text-sm opacity-75 mt-4">WhatsApp: +260 974 619 781</p>
              </div>
            </footer>
          </>
        ) : (
          <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 to-orange-50 px-4">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-gray-800 mb-4">Coming Soon! 🎂</h1>
              <p className="text-xl text-gray-600 mb-8">Special Celebration Ahead</p>
              <Countdown />
              <p className="text-gray-600 mt-8">Birthday: April 25th</p>
              <a
                href="/admin/login"
                className="mt-8 inline-block px-6 py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 transition-colors"
              >
                Admin Login
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
