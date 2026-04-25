"use client"

import { useEffect, useState } from "react"
import { SITE_CONFIG } from "@/lib/config"

function getNextBirthday(): Date {
  const now = new Date()
  const year =
    now.getMonth() + 1 > SITE_CONFIG.birthdayMonth ||
    (now.getMonth() + 1 === SITE_CONFIG.birthdayMonth && now.getDate() > SITE_CONFIG.birthdayDay)
      ? now.getFullYear() + 1
      : now.getFullYear()
  return new Date(year, SITE_CONFIG.birthdayMonth - 1, SITE_CONFIG.birthdayDay, 0, 0, 0)
}

function isBirthdayToday(): boolean {
  const now = new Date()
  return (
    now.getMonth() + 1 === SITE_CONFIG.birthdayMonth && now.getDate() === SITE_CONFIG.birthdayDay
  )
}

type TimeParts = { days: number; hours: number; minutes: number; seconds: number }

function calc(target: Date): TimeParts {
  const diff = target.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)
  return { days, hours, minutes, seconds }
}

export function Countdown() {
  const [mounted, setMounted] = useState(false)
  const [today, setToday] = useState(false)
  const [time, setTime] = useState<TimeParts>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    setMounted(true)
    const target = getNextBirthday()

    function update() {
      setToday(isBirthdayToday())
      setTime(calc(target))
    }

    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  if (!mounted) return null

  if (today) {
    return (
      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="rounded-3xl border border-primary/30 bg-gradient-to-r from-primary to-primary/80 p-8 text-center text-primary-foreground shadow-xl sm:p-12">
          <p className="mb-2 font-serif text-lg font-medium">Today is the day</p>
          <h2 className="font-serif text-4xl font-bold sm:text-6xl">
            Happy Birthday, {SITE_CONFIG.name}!
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-primary-foreground/90">
            Wishing you a day filled with cake, laughter, and love.
          </p>
        </div>
      </section>
    )
  }

  const units: { label: string; value: number }[] = [
    { label: "Days", value: time.days },
    { label: "Hours", value: time.hours },
    { label: "Minutes", value: time.minutes },
    { label: "Seconds", value: time.seconds },
  ]

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-10">
        <div className="mb-6 text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Counting down to April 25th
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-foreground sm:text-4xl">
            The big day is almost here
          </h2>
        </div>

        <div className="grid grid-cols-4 gap-3 sm:gap-6">
          {units.map((u) => (
            <div
              key={u.label}
              className="flex flex-col items-center justify-center rounded-2xl bg-secondary py-6 sm:py-8"
            >
              <span className="font-serif text-3xl font-bold tabular-nums text-foreground sm:text-5xl">
                {String(u.value).padStart(2, "0")}
              </span>
              <span className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground sm:text-sm">
                {u.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
