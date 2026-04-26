import { SITE_CONFIG } from "@/lib/config"

// Returns local-time fields (year, month, day, weekday, hour, minute) for a
// given Date in a target IANA time zone. Uses Intl.DateTimeFormat so it works
// reliably across server (UTC) and any client timezone.
function getZonedParts(date: Date, timeZone: string) {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
  const parts = fmt.formatToParts(date)
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ""
  // weekday short: Sun, Mon, Tue, Wed, Thu, Fri, Sat
  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  }
  let hour = Number(get("hour"))
  // Some locales emit "24" for midnight; normalize to 0.
  if (hour === 24) hour = 0
  return {
    year: Number(get("year")),
    month: Number(get("month")),
    day: Number(get("day")),
    weekday: weekdayMap[get("weekday")] ?? new Date(date).getUTCDay(),
    hour,
    minute: Number(get("minute")),
  }
}

export type SabbathInfo = {
  isSabbath: boolean
  // Human-readable label e.g. "Sabbath ends Saturday at 6:00 PM"
  endsLabel?: string
}

export function getSabbathInfo(now: Date = new Date()): SabbathInfo {
  const { timeZone, fridaySunsetHour, saturdaySunsetHour } = SITE_CONFIG.sabbath
  const { weekday, hour } = getZonedParts(now, timeZone)

  // weekday: 0 Sun ... 5 Fri ... 6 Sat
  const isFridayAfterSunset = weekday === 5 && hour >= fridaySunsetHour
  const isSaturdayBeforeSunset = weekday === 6 && hour < saturdaySunsetHour
  const isSabbath = isFridayAfterSunset || isSaturdayBeforeSunset

  if (!isSabbath) return { isSabbath: false }

  const endHour12 = ((saturdaySunsetHour + 11) % 12) + 1
  const ampm = saturdaySunsetHour >= 12 ? "PM" : "AM"
  return {
    isSabbath: true,
    endsLabel: `Sabbath ends Saturday at ${endHour12}:00 ${ampm}`,
  }
}

// Friendly closed-message used across the site.
export const SABBATH_CLOSED_MESSAGE =
  "We are closed today because it's Sabbath."
