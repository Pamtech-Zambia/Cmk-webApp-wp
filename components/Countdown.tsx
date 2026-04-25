'use client'

import { useEffect, useState } from 'react'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const birthdayDate = new Date(2025, 3, 25) // April 25, 2025 (month is 0-indexed)
      const now = new Date()
      const difference = birthdayDate.getTime() - now.getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        // Birthday is here or has passed
        const currentYear = now.getFullYear()
        const nextBirthday = new Date(currentYear + 1, 3, 25)
        const nextDifference = nextBirthday.getTime() - now.getTime()
        setTimeLeft({
          days: Math.floor(nextDifference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((nextDifference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((nextDifference / 1000 / 60) % 60),
          seconds: Math.floor((nextDifference / 1000) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!timeLeft) return null

  const CountdownBox = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-pink-400 to-orange-300 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
        <span className="text-3xl md:text-4xl font-bold text-white">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <p className="mt-2 text-sm md:text-base font-semibold text-gray-700 uppercase tracking-wider">
        {label}
      </p>
    </div>
  )

  return (
    <section className="py-16 px-4 bg-gradient-to-r from-yellow-50 to-pink-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent">
          Birthday Countdown
        </h2>
        <p className="text-center text-gray-600 mb-12 text-lg">
          April 25th is almost here!
        </p>

        <div className="flex justify-center gap-4 md:gap-6 flex-wrap">
          <CountdownBox value={timeLeft.days} label="Days" />
          <CountdownBox value={timeLeft.hours} label="Hours" />
          <CountdownBox value={timeLeft.minutes} label="Minutes" />
          <CountdownBox value={timeLeft.seconds} label="Seconds" />
        </div>
      </div>
    </section>
  )
}
