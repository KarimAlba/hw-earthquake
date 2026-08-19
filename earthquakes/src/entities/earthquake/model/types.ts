export type Earthquake = {
  id: string
  place: string
  magnitude: number | null
  timeMs: number
  depthKm: number
  latitude: number
  longitude: number
  url: string | null
}
