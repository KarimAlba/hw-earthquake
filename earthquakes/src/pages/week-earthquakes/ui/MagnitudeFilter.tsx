import {
  MAGNITUDE_FILTER_OPTIONS,
  type MagnitudeFilterValue,
} from '../model/magnitudeFilter'
import styles from './MagnitudeFilter.module.scss'

type MagnitudeFilterProps = {
  value: MagnitudeFilterValue
  onChange: (value: MagnitudeFilterValue) => void
}

export function MagnitudeFilter({ value, onChange }: MagnitudeFilterProps) {
  return (
    <fieldset className={styles.root}>
      <legend className={styles.legend}>Магнитуда</legend>
      <div
        className={styles.options}
        role="radiogroup"
        aria-label="Фильтр по магнитуде"
      >
        {MAGNITUDE_FILTER_OPTIONS.map((option) => {
          const id = `mag-${option.value}`
          return (
            <label key={option.value} className={styles.option} htmlFor={id}>
              <input
                id={id}
                type="radio"
                name="magnitude-filter"
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange(option.value)}
              />
              <span>{option.label}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
