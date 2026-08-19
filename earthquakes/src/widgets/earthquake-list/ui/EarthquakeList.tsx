import type { Earthquake } from '@/entities/earthquake'
import { formatDateTimeRu, formatMagnitude } from '@/shared/lib/format'
import styles from './EarthquakeList.module.scss'

type EarthquakeListProps = {
  items: Earthquake[]
  selectedId: string | null
  status: 'loading' | 'error' | 'success'
  errorMessage: string | null
  onSelect: (id: string) => void
  onRetry: () => void
}

export function EarthquakeList({
  items,
  selectedId,
  status,
  errorMessage,
  onSelect,
  onRetry,
}: EarthquakeListProps) {
  if (status === 'loading') {
    return <p className={styles.state}>Загрузка данных USGS…</p>
  }

  if (status === 'error') {
    return (
      <div className={styles.state} role="alert">
        <p>{errorMessage ?? 'Не удалось загрузить данные.'}</p>
        <button type="button" className={styles.retry} onClick={onRetry}>
          Повторить
        </button>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <p className={styles.state}>За этот день землетрясений нет</p>
    )
  }

  return (
    <ul className={styles.list}>
      {items.map((item) => {
        const isSelected = item.id === selectedId
        return (
          <li key={item.id}>
            <button
              type="button"
              className={[styles.item, isSelected ? styles.selected : '']
                .filter(Boolean)
                .join(' ')}
              onClick={() => onSelect(item.id)}
            >
              <span className={styles.mag}>{formatMagnitude(item.magnitude)}</span>
              <span className={styles.body}>
                <span className={styles.place}>{item.place}</span>
                <span className={styles.time}>{formatDateTimeRu(item.timeMs)}</span>
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
