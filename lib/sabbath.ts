"use client"

import { useEffect, useState } from "react"

// We treat the Sabbath as Friday sunset to Saturday sunset in
// Africa/Lusaka (the same timezone as the bakery's WhatsApp number).
// Lusaka sits near the tropics, so sunset stays close to 18:00 local
// time year-round, which is a sensible approximation.
const TIMEZONE = "Africa/Lusaka"
const SUNSET_HOUR = 18

function getZonedParts(now: Date) {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    weekday: "short",
    hour: "numeric",
    hour12: false,
  })
  const parts = fmt.formatToParts(now)
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? ""
  const rawHour = parts.find((p) => p.type === "hour")?.value ?? "0"
  // Some runtimes return "24" for midnight; normalize to 0.
  const hour = Number(rawHour) % 24
  return { weekday, hour }
}

export function isSabbathActive(now: Date = new Date()): boolean {
  const { weekday, hour } = getZonedParts(now)
  if (weekday === "Fri" && hour >= SUNSET_HOUR) return true
  if (weekday === "Sat" && hour < SUNSET_HOUR) return true
  return false
}

export function useSabbath(): boolean {
  const [active, setActive] = useState(false)

  useEffect(() => {
    function update() {
      setActive(isSabbathActive())
    }
    update()
    // Re-check every minute so the banner appears/disappears at sunset.
    const id = setInterval(update, 60_000)
    return () => clearInterval(id)
  }, [])

  return active
}

export const SABBATH_MESSAGE =
  "We are closed today because it's Sabbath."
export const SABBATH_DETAIL =
  "We honor the Sabbath rest from Friday sunset to Saturday sunset. Orders sent during this time will be confirmed once Sabbath ends."
