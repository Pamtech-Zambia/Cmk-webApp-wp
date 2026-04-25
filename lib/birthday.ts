// Birthday is April 25th
const BIRTHDAY_MONTH = 4
const BIRTHDAY_DAY = 25

export interface BirthdayPeriod {
  isBirthdayWeek: boolean
  isBirthdayDay: boolean
  isBirthdayToday: boolean
  isBirthdayTomorrow: boolean
  isAfterBirthdayWeek: boolean
  daysUntilBirthday: number
}

export function getBirthdayPeriod(): BirthdayPeriod {
  const today = new Date()
  const currentYear = today.getFullYear()

  // Get this year's birthday
  let birthday = new Date(currentYear, BIRTHDAY_MONTH - 1, BIRTHDAY_DAY)

  // If birthday has passed, use next year's
  if (today > birthday) {
    birthday = new Date(currentYear + 1, BIRTHDAY_MONTH - 1, BIRTHDAY_DAY)
  }

  // Calculate days until birthday
  const timeDiff = birthday.getTime() - today.getTime()
  const daysUntilBirthday = Math.ceil(timeDiff / (1000 * 3600 * 24))

  // Calculate birthday week (start of week containing birthday)
  const dayOfWeek = birthday.getDay()
  const weekStart = new Date(birthday)
  weekStart.setDate(birthday.getDate() - dayOfWeek)

  const isBirthdayToday = isSameDay(today, birthday)
  const isBirthdayTomorrow = isSameDay(
    new Date(today.getTime() + 24 * 60 * 60 * 1000),
    birthday
  )
  const isBirthdayDay = isBirthdayToday
  const isBirthdayWeek = daysUntilBirthday >= 0 && daysUntilBirthday <= 7
  const isAfterBirthdayWeek = daysUntilBirthday < 0 && daysUntilBirthday > -7

  return {
    isBirthdayWeek,
    isBirthdayDay,
    isBirthdayToday,
    isBirthdayTomorrow,
    isAfterBirthdayWeek,
    daysUntilBirthday: Math.max(0, daysUntilBirthday),
  }
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

export function shouldShowBirthdayContent(): boolean {
  const period = getBirthdayPeriod()
  // Show birthday content from today until 7 days after birthday
  return period.isBirthdayDay || (period.daysUntilBirthday <= 7 && period.daysUntilBirthday >= 0)
}

export function shouldShowNormalStore(): boolean {
  const period = getBirthdayPeriod()
  // Show normal store after birthday week (more than 7 days after)
  return period.daysUntilBirthday > 7 || period.isAfterBirthdayWeek
}

export function isBirthdayWeekPromo(): boolean {
  const period = getBirthdayPeriod()
  // Promo period: birthday week minus the birthday day itself
  return period.isBirthdayWeek && !period.isBirthdayDay
}
