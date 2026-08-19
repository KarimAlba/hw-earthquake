import { useEffect, useMemo, useState } from 'react'
import { fetchEarthquakesForWeek, type Earthquake } from '@/entities/earthquake'
import { getWeekDays, getWeekMonday, isSameLocalDay } from '@/shared/lib/week'
import { useLocalToday } from '../lib/useLocalToday'
import { passesMagnitudeFilter, type MagnitudeFilterValue } from '../model/magnitudeFilter'
import { DaySelector } from './DaySelector'
import { EarthquakeDetails } from './EarthquakeDetails'
import { EarthquakeList } from './EarthquakeList'
import { EarthquakeMap } from './EarthquakeMap'
import { MagnitudeFilter } from './MagnitudeFilter'
import styles from './WeekEarthquakesPage.module.scss'

type LoadStatus = 'loading' | 'error' | 'success'

export function WeekEarthquakesPage() {
  const today = useLocalToday()
  const monday = useMemo(() => getWeekMonday(today), [today])
  const weekDays = useMemo(() => getWeekDays(monday), [monday])
  const sunday = weekDays[6] ?? monday

  const [pinnedDay, setPinnedDay] = useState<Date | null>(null)
  const [minMagnitude, setMinMagnitude] = useState<MagnitudeFilterValue>(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [items, setItems] = useState<Earthquake[]>([])
  const [status, setStatus] = useState<LoadStatus>('loading')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  const selectedDay = useMemo(() => {
    if (pinnedDay && weekDays.some((day) => isSameLocalDay(day, pinnedDay))) {
      return weekDays.find((day) => isSameLocalDay(day, pinnedDay)) ?? today
    }
    return today
  }, [pinnedDay, weekDays, today])

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      setStatus('loading')
      setErrorMessage(null)
      setSelectedId(null)

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
        setErrorMessage(error instanceof Error ? error.message : 'Не удалось загрузить данные.')
      }
    }

    void load()

    return () => controller.abort()
  }, [monday, sunday, reloadToken])

  const dayItems = useMemo(() => {
    return items.filter((item) => isSameLocalDay(new Date(item.timeMs), selectedDay))
  }, [items, selectedDay])

  const visibleItems = useMemo(() => {
    return dayItems.filter((item) => passesMagnitudeFilter(item.magnitude, minMagnitude))
  }, [dayItems, minMagnitude])

  const selectedEarthquake = visibleItems.find((item) => item.id === selectedId) ?? null

  const emptyReason = dayItems.length === 0 ? 'no-events' : 'filtered'

  return (
    <div className={styles.page}>
      <header className={`${styles.header} anim-rise`}>
        <div className={styles.hero}>
          <p className={styles.eyebrow}>USGS · текущая неделя</p>
          <h1 className={styles.title}>
            Землетрясения
            <span className={styles.titleAccent}>пн–вс</span>
          </h1>
          <p className={styles.subtitle}>
            Список и карта событий за выбранный день. Клик по записи или маркеру открывает детали.
          </p>
        </div>
        <div className={`${styles.filterWrap} anim-rise anim-delay-1`}>
          <MagnitudeFilter
            value={minMagnitude}
            onChange={(value) => {
              setMinMagnitude(value)
              setSelectedId(null)
            }}
          />
        </div>
      </header>

      <div className='anim-rise anim-delay-2'>
        <DaySelector
          days={weekDays}
          selectedDay={selectedDay}
          today={today}
          onSelect={(day) => {
            setPinnedDay(day)
            setSelectedId(null)
          }}
        />
      </div>

      <div className={styles.layout}>
        <section
          className={`${styles.listPanel} anim-rise anim-delay-3`}
          aria-label='Список землетрясений'
        >
          <EarthquakeList
            items={visibleItems}
            selectedId={selectedEarthquake?.id ?? null}
            status={status}
            errorMessage={errorMessage}
            emptyReason={emptyReason}
            onSelect={setSelectedId}
            onRetry={() => setReloadToken((value) => value + 1)}
          />
        </section>
        <div className={styles.mapPanel}>
          <EarthquakeMap
            items={visibleItems}
            selectedId={selectedEarthquake?.id ?? null}
            status={status}
            onSelect={setSelectedId}
          />
          <EarthquakeDetails earthquake={selectedEarthquake} />
        </div>
      </div>
    </div>
  )
}
