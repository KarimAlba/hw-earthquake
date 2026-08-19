import { getJson } from '@/shared/api/http'
import { USGS_QUERY_URL } from '@/shared/config/usgs'
import { endOfLocalDay, startOfLocalDay } from '@/shared/lib/week'
import { mapUsgsFeature } from '../lib/mapUsgsFeature'
import type { Earthquake } from '../model/types'

type UsgsGeoJson = {
  features: Array<{
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
  }>
}

type FetchWeekParams = {
  monday: Date
  sunday: Date
  signal?: AbortSignal
}

export async function fetchEarthquakesForWeek({
  monday,
  sunday,
  signal,
}: FetchWeekParams): Promise<Earthquake[]> {
  const start = startOfLocalDay(monday)
  const end = endOfLocalDay(sunday)

  const url = new URL(USGS_QUERY_URL)
  url.searchParams.set('format', 'geojson')
  url.searchParams.set('starttime', start.toISOString())
  url.searchParams.set('endtime', end.toISOString())
  url.searchParams.set('orderby', 'time')

  const data = await getJson<UsgsGeoJson>(url.toString(), signal)

  return data.features.map(mapUsgsFeature).filter((item): item is Earthquake => item !== null)
}
