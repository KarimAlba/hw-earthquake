import { useEffect, useMemo, useState } from 'react'
import {
  fetchEarthquakesForWeek,
  type Earthquake,
} from '@/entities/earthquake'
import {
  MagnitudeFilter,
  type MagnitudeFilterValue,
} from '@/features/filter-by-magnitude'
import { DaySelector } from '@/widgets/day-selector'
import { EarthquakeDetails } from '@/widgets/earthquake-details'
import { EarthquakeList } from '@/widgets/earthquake-list'
import {
  getWeekDays,
  getWeekMonday,
  isSameLocalDay,
  startOfLocalDay,
} from '@/shared/lib/week'
import styles from './WeekEarthquakesPage.module.scss'

type LoadStatus = 'loading' | 'error' | 'success'

export function WeekEarthquakesPage() {
  const today = useMemo(() => startOfLocalDay(new Date()), [])
  const monday = useMemo(() => getWeekMonday(today), [today])
  const weekDays = useMemo(() => getWeekDays(monday), [monday])
  const sunday = weekDays[6] ?? monday

  const [selectedDay, setSelectedDay] = useState<Date>(today)
  const [minMagnitude, setMinMagnitude] = useState<MagnitudeFilterValue>(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [items, setItems] = useState<Earthquake[]>([])
  const [status, setStatus] = useState<LoadStatus>('loading')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      setStatus('loading')
      setErrorMessage(null)

      try {
        const data = await fetchEarthquakesForWeek({
          monday,
          sunday,
          signal: controller.signal,
        })
        setItems(data)
        setStatus('success')
      } catch (error) {
        if (controller.signal.aborted) {
          return
        }
        setItems([])
        setStatus('error')
        setErrorMessage(
          error instanceof Error
            ? `Не удалось загрузить данные: ${error.message}`
            : 'Не удалось загрузить данные.',
        )
      }
    }

    void load()

    return () => controller.abort()
  }, [monday, sunday, reloadToken])

  const visibleItems = useMemo(() => {
    return items
      .filter((item) => isSameLocalDay(new Date(item.timeMs), selectedDay))
      .filter((item) => (item.magnitude ?? -Infinity) >= minMagnitude)
  }, [items, selectedDay, minMagnitude])

  const selectedEarthquake =
    visibleItems.find((item) => item.id === selectedId) ?? null

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>USGS · текущая неделя</p>
          <h1 className={styles.title}>Землетрясения пн–вс</h1>
          <p className={styles.subtitle}>
            Список событий за выбранный день. Карта появится позже.
          </p>
        </div>
        <MagnitudeFilter value={minMagnitude} onChange={setMinMagnitude} />
      </header>

      <DaySelector
        days={weekDays}
        selectedDay={selectedDay}
        today={today}
        onSelect={(day) => {
          setSelectedDay(day)
          setSelectedId(null)
        }}
      />

      <div className={styles.layout}>
        <section className={styles.listPanel} aria-label="Список землетрясений">
          <EarthquakeList
            items={visibleItems}
            selectedId={selectedEarthquake?.id ?? null}
            status={status}
            errorMessage={errorMessage}
            onSelect={setSelectedId}
            onRetry={() => setReloadToken((value) => value + 1)}
          />
        </section>
        <EarthquakeDetails earthquake={selectedEarthquake} />
      </div>
    </div>
  )
}
