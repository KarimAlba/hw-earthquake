const DAY_MS = 24 * 60 * 60 * 1000

/** Monday 00:00:00.000 of the week that contains `date` (local timezone). */
export function getWeekMonday(date: Date = new Date()): Date {
  const result = new Date(date)
  const weekday = result.getDay()
  const shift = weekday === 0 ? -6 : 1 - weekday
  result.setDate(result.getDate() + shift)
  result.setHours(0, 0, 0, 0)
  return result
}

/** Seven dates Mon–Sun starting from Monday. */
export function getWeekDays(monday: Date): Date[] {
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(monday)
    day.setDate(monday.getDate() + index)
    return day
  })
}

export function isSameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function startOfLocalDay(date: Date): Date {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  return result
}

export function endOfLocalDay(date: Date): Date {
  const result = startOfLocalDay(date)
  result.setTime(result.getTime() + DAY_MS - 1)
  return result
}

const WEEKDAY_LABELS_RU = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'] as const

export function getWeekdayLabelRu(date: Date): string {
  const mondayBased = (date.getDay() + 6) % 7
  return WEEKDAY_LABELS_RU[mondayBased] ?? ''
}
