import { getWeekdayLabelRu, isSameLocalDay } from '@/shared/lib/week'
import styles from './DaySelector.module.scss'

type DaySelectorProps = {
  days: Date[]
  selectedDay: Date
  today: Date
  onSelect: (day: Date) => void
}

export function DaySelector({ days, selectedDay, today, onSelect }: DaySelectorProps) {
  return (
    <div className={styles.root} role='tablist' aria-label='Дни недели'>
      {days.map((day) => {
        const isSelected = isSameLocalDay(day, selectedDay)
        const isToday = isSameLocalDay(day, today)

        return (
          <button
            key={day.toISOString()}
            type='button'
            role='tab'
            aria-selected={isSelected}
            className={[styles.day, isSelected ? styles.selected : '', isToday ? styles.today : '']
              .filter(Boolean)
              .join(' ')}
            onClick={() => onSelect(day)}
          >
            <span className={styles.label}>{getWeekdayLabelRu(day)}</span>
            <span className={styles.date}>{day.getDate()}</span>
            {isToday ? <span className={styles.badge}>сегодня</span> : null}
          </button>
        )
      })}
    </div>
  )
}
