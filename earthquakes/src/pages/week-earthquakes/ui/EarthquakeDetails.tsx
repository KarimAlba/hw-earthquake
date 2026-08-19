import type { Earthquake } from '@/entities/earthquake'
import { formatDateTimeRu, formatDepthKm, formatMagnitude } from '@/shared/lib/format'
import styles from './EarthquakeDetails.module.scss'

type EarthquakeDetailsProps = {
  earthquake: Earthquake | null
}

export function EarthquakeDetails({ earthquake }: EarthquakeDetailsProps) {
  if (!earthquake) {
    return (
      <aside className={styles.root} aria-live='polite'>
        <h2 className={styles.title}>Детали</h2>
        <p className={styles.empty}>Выберите событие в списке или на карте</p>
      </aside>
    )
  }

  return (
    <aside className={styles.root} aria-live='polite'>
      <h2 className={styles.title}>Детали</h2>
      <dl className={styles.grid}>
        <div>
          <dt>Место</dt>
          <dd>{earthquake.place}</dd>
        </div>
        <div>
          <dt>Магнитуда</dt>
          <dd>{formatMagnitude(earthquake.magnitude)}</dd>
        </div>
        <div>
          <dt>Время</dt>
          <dd>{formatDateTimeRu(earthquake.timeMs)}</dd>
        </div>
        <div>
          <dt>Глубина</dt>
          <dd>{formatDepthKm(earthquake.depthKm)}</dd>
        </div>
        <div>
          <dt>Координаты</dt>
          <dd>
            {earthquake.latitude.toFixed(3)}, {earthquake.longitude.toFixed(3)}
          </dd>
        </div>
      </dl>
      {earthquake.url ? (
        <a className={styles.link} href={earthquake.url} target='_blank' rel='noreferrer'>
          Карточка USGS
        </a>
      ) : null}
    </aside>
  )
}
