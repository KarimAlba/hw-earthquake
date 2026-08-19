import { useEffect, useState } from 'react'
import { isSameLocalDay, startOfLocalDay } from '@/shared/lib/week'

/** Local calendar "today"; refreshes at midnight and every minute as a fallback. */
export function useLocalToday(): Date {
  const [today, setToday] = useState(() => startOfLocalDay(new Date()))

  useEffect(() => {
    const syncToday = () => {
      const next = startOfLocalDay(new Date())
      setToday((prev) => (isSameLocalDay(prev, next) ? prev : next))
    }

    const intervalId = window.setInterval(syncToday, 60_000)

    const now = new Date()
    const nextMidnight = startOfLocalDay(now)
    nextMidnight.setDate(nextMidnight.getDate() + 1)
    const timeoutId = window.setTimeout(
      syncToday,
      Math.max(0, nextMidnight.getTime() - now.getTime()) + 50,
    )

    return () => {
      window.clearInterval(intervalId)
      window.clearTimeout(timeoutId)
    }
  }, [])

  return today
}
