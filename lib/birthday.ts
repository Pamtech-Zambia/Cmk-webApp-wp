import { SITE_CONFIG } from "@/lib/config"

// Returns true if today's date (local time) is on or before April 26 of the
// current year, but on or after a "lead-up" date roughly 30 days before the
// birthday. After April 26 ends, the birthday wishes section is hidden until
// the lead-up to next year's birthday begins.
export function isWishesWindowOpen(now: Date = new Date()): boolean {
  const year = now.getFullYear()
  const birthday = new Date(year, SITE_CONFIG.birthdayMonth - 1, SITE_CONFIG.birthdayDay, 0, 0, 0, 0)

  // Window closes at end of the day AFTER the birthday (April 26 at 23:59:59).
  const closesAt = new Date(birthday)
  closesAt.setDate(closesAt.getDate() + 1)
  closesAt.setHours(23, 59, 59, 999)

  // Window opens 30 days before the birthday so the section gradually returns.
  const opensAt = new Date(birthday)
  opensAt.setDate(opensAt.getDate() - 30)
  opensAt.setHours(0, 0, 0, 0)

  return now >= opensAt && now <= closesAt
}

// Returns the ISO date marking the start of the current celebration window,
// used to filter wishes so only the current year's messages appear.
export function getCurrentWishesWindowStartIso(now: Date = new Date()): string {
  const year = now.getFullYear()
  const birthday = new Date(year, SITE_CONFIG.birthdayMonth - 1, SITE_CONFIG.birthdayDay, 0, 0, 0, 0)
  const opensAt = new Date(birthday)
  opensAt.setDate(opensAt.getDate() - 30)
  opensAt.setHours(0, 0, 0, 0)
  // If we're after April 26 of this year but before the next opens-at, this
  // function is still safe; the section won't render anyway.
  return opensAt.toISOString()
}
