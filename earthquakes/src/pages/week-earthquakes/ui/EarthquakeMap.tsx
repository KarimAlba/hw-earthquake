import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Earthquake } from '@/entities/earthquake'
import { formatMagnitude } from '@/shared/lib/format'
import styles from './EarthquakeMap.module.scss'

type EarthquakeMapProps = {
  items: Earthquake[]
  selectedId: string | null
  status: 'loading' | 'error' | 'success'
  onSelect: (id: string) => void
}

const DEFAULT_CENTER: L.LatLngExpression = [20, 0]
const DEFAULT_ZOOM = 2
const MAP_HEIGHT_PX = 384

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function markerRadius(magnitude: number | null): number {
  const mag = magnitude ?? 0
  return Math.max(5, Math.min(16, mag * 2.2 + 4))
}

function markerStyle(isSelected: boolean): L.CircleMarkerOptions {
  return {
    color: isSelected ? '#ffb347' : '#3d8b7a',
    fillColor: isSelected ? '#e85d04' : '#5cb8a3',
    weight: isSelected ? 3 : 2,
    opacity: 1,
    fillOpacity: isSelected ? 0.95 : 0.75,
  }
}

function resetLeafletContainer(container: HTMLDivElement) {
  const leafletContainer = container as HTMLDivElement & { _leaflet_id?: number }
  if (leafletContainer._leaflet_id != null) {
    delete leafletContainer._leaflet_id
  }
  container.replaceChildren()
}

export function EarthquakeMap({ items, selectedId, status, onSelect }: EarthquakeMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const layerRef = useRef<L.LayerGroup | null>(null)
  const markersRef = useRef<Map<string, L.CircleMarker>>(new Map())
  const selectedIdRef = useRef(selectedId)
  const onSelectRef = useRef(onSelect)

  useEffect(() => {
    onSelectRef.current = onSelect
  }, [onSelect])

  useEffect(() => {
    selectedIdRef.current = selectedId
  }, [selectedId])

  useEffect(() => {
    const container = containerRef.current
    if (!container || mapRef.current) {
      return
    }

    resetLeafletContainer(container)
    container.style.height = `${MAP_HEIGHT_PX}px`

    const map = L.map(container, {
      scrollWheelZoom: true,
    }).setView(DEFAULT_CENTER, DEFAULT_ZOOM)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    const layer = L.layerGroup().addTo(map)
    mapRef.current = map
    layerRef.current = layer

    const invalidate = () => {
      map.invalidateSize()
    }

    map.whenReady(invalidate)

    const resizeObserver = new ResizeObserver(invalidate)
    resizeObserver.observe(container)

    requestAnimationFrame(invalidate)
    const resizeTimer = window.setTimeout(invalidate, 100)
    const resizeTimerLate = window.setTimeout(invalidate, 800)

    return () => {
      window.clearTimeout(resizeTimer)
      window.clearTimeout(resizeTimerLate)
      resizeObserver.disconnect()
      map.remove()
      mapRef.current = null
      layerRef.current = null
      markersRef.current.clear()
      resetLeafletContainer(container)
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    const layer = layerRef.current
    if (!map || !layer) {
      return
    }

    layer.clearLayers()
    markersRef.current.clear()

    if (status !== 'success' || items.length === 0) {
      map.setView(DEFAULT_CENTER, DEFAULT_ZOOM)
      return
    }

    const bounds = L.latLngBounds([])

    for (const item of items) {
      const isSelected = item.id === selectedIdRef.current
      const marker = L.circleMarker([item.latitude, item.longitude], {
        radius: markerRadius(item.magnitude),
        ...markerStyle(isSelected),
      })

      const magLabel = formatMagnitude(item.magnitude)
      marker.bindPopup(`<strong>${escapeHtml(item.place)}</strong><br />M ${escapeHtml(magLabel)}`)
      marker.on('click', () => {
        onSelectRef.current(item.id)
      })

      marker.addTo(layer)
      markersRef.current.set(item.id, marker)
      bounds.extend([item.latitude, item.longitude])
    }

    if (bounds.isValid()) {
      map.fitBounds(bounds.pad(0.25), { maxZoom: 8, animate: false })
    }

    const selectedMarker = selectedIdRef.current
      ? markersRef.current.get(selectedIdRef.current)
      : undefined
    if (selectedMarker) {
      selectedMarker.openPopup()
    }
  }, [items, status])

  useEffect(() => {
    const map = mapRef.current
    if (!map || status !== 'success') {
      return
    }

    requestAnimationFrame(() => {
      map.invalidateSize()
    })
  }, [status, items.length])

  useEffect(() => {
    for (const [id, marker] of markersRef.current) {
      marker.setStyle(markerStyle(id === selectedId))
    }

    if (!selectedId || status !== 'success') {
      return
    }

    const map = mapRef.current
    const marker = markersRef.current.get(selectedId)
    if (!map || !marker) {
      return
    }

    map.panTo(marker.getLatLng(), { animate: true })
    marker.openPopup()
  }, [selectedId, status])

  let overlay: string | null = null
  if (status === 'loading') {
    overlay = 'Карта загрузится вместе со списком…'
  } else if (status === 'error') {
    overlay = 'Нет данных для карты'
  }

  const emptyHint = status === 'success' && items.length === 0 ? 'Нет точек для отображения' : null

  return (
    <section className={styles.root} aria-label='Карта землетрясений'>
      <div className={styles.mapFrame}>
        <div ref={containerRef} className={styles.mapHost} />
      </div>
      {emptyHint ? (
        <p className={styles.emptyHint} aria-live='polite'>
          {emptyHint}
        </p>
      ) : null}
      {overlay ? (
        <p className={styles.overlay} aria-live='polite'>
          {overlay}
        </p>
      ) : null}
    </section>
  )
}
