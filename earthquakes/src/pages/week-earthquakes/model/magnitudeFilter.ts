export const MAGNITUDE_FILTER_OPTIONS = [
  { value: 0, label: 'Все' },
  { value: 2.5, label: '≥ 2.5' },
  { value: 4.5, label: '≥ 4.5' },
  { value: 6, label: '≥ 6.0' },
] as const

export type MagnitudeFilterValue =
  (typeof MAGNITUDE_FILTER_OPTIONS)[number]['value']

export function passesMagnitudeFilter(
  magnitude: number | null,
  minMagnitude: MagnitudeFilterValue,
): boolean {
  if (minMagnitude === 0) {
    return true
  }

  return (magnitude ?? -Infinity) >= minMagnitude
}
