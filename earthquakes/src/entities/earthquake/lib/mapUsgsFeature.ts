import type { Earthquake } from '../model/types'

type UsgsFeature = {
  id: string
  properties: {
    mag: number | null
    place: string | null
    time: number | null
    url: string | null
  }
  geometry: {
    coordinates: [number, number, number]
  } | null
}

export function mapUsgsFeature(feature: UsgsFeature): Earthquake | null {
  const { properties, geometry } = feature

  if (!geometry || properties.time == null) {
    return null
  }

  const [longitude, latitude, depthKm] = geometry.coordinates

  return {
    id: feature.id,
    place: properties.place?.trim() || 'Неизвестное место',
    magnitude: properties.mag,
    timeMs: properties.time,
    depthKm,
    latitude,
    longitude,
    url: properties.url,
  }
}
