export function formatDateTimeRu(timestampMs: number): string {
  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(timestampMs))
}

export function formatDepthKm(depthKm: number): string {
  return `${depthKm.toFixed(1)} км`
}

export function formatMagnitude(mag: number | null): string {
  if (mag === null || Number.isNaN(mag)) {
    return '—'
  }
  return mag.toFixed(1)
}
