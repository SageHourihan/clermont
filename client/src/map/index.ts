import L from 'leaflet'
import type { Event } from '../../../shared/types.js'
import { buildMarkerLayer } from './markers.js'

// CartoDB Dark Matter — no API key required
const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com">CARTO</a>'

interface MapState {
  map: L.Map | null
  markerLayer: L.LayerGroup | null
  isVisible: boolean
  containerId: string
  overlayId: string
  lastEvents: Event[]
}

const state: MapState = {
  map: null,
  markerLayer: null,
  isVisible: false,
  containerId: '',
  overlayId: '',
  lastEvents: [],
}

function initLeafletMap(containerId: string): L.Map {
  const map = L.map(containerId, {
    center: [20, 10],
    zoom: 2,
    minZoom: 2,
    maxZoom: 8,
    zoomControl: true,
    attributionControl: true,
  })

  L.tileLayer(TILE_URL, {
    attribution: TILE_ATTRIBUTION,
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(map)

  return map
}

export function openMap(containerId: string, overlayId: string, events: Event[]): void {
  const overlay = document.getElementById(overlayId)
  if (!overlay) return

  // Cache IDs so flyToEvent can reopen without params
  state.containerId = containerId
  state.overlayId = overlayId
  state.lastEvents = events

  // Lazy init: create the map on first open only
  if (!state.map) {
    state.map = initLeafletMap(containerId)
  }

  // Swap marker layer
  if (state.markerLayer) {
    state.markerLayer.remove()
  }
  state.markerLayer = buildMarkerLayer(events)
  state.markerLayer.addTo(state.map)

  overlay.classList.remove('map-overlay--hidden')
  overlay.classList.add('map-overlay--visible')
  state.isVisible = true

  // Critical: invalidate Leaflet's size after overlay becomes visible.
  // Without this, tiles render into a 0x0 viewport.
  requestAnimationFrame(() => {
    state.map?.invalidateSize()
  })

  document.getElementById('map-close')?.focus()
}

export function closeMap(overlayId: string): void {
  const overlay = document.getElementById(overlayId)
  if (!overlay) return
  overlay.classList.add('map-overlay--hidden')
  overlay.classList.remove('map-overlay--visible')
  state.isVisible = false
}

// Called by the polling loop when new data arrives
export function refreshMapMarkers(events: Event[]): void {
  if (!state.map || !state.isVisible) return
  if (state.markerLayer) {
    state.markerLayer.remove()
  }
  state.markerLayer = buildMarkerLayer(events)
  state.markerLayer.addTo(state.map)
}

// Open map and fly to a specific event, opening its popup
export function flyToEvent(event: Event): void {
  if (!state.isVisible) {
    openMap(state.containerId, state.overlayId, state.lastEvents)
  }
  // Short delay for map to finish rendering/invalidating before flying
  setTimeout(() => {
    state.map?.flyTo([event.lat, event.lng], 5, { animate: true, duration: 0.8 })
    state.markerLayer?.eachLayer((layer) => {
      const marker = layer as L.Marker
      if ((marker as unknown as Record<string, unknown>)._eventId === event.id) {
        marker.openPopup()
      }
    })
  }, 200)
}

// Pre-register the map container/overlay IDs so flyToEvent works
// before the map has ever been opened. Call during app init.
export function configureMap(containerId: string, overlayId: string): void {
  state.containerId = containerId
  state.overlayId = overlayId
}

// Wire up close controls. Call once during app init.
export function setupMapControls(overlayId: string): void {
  const closeBtn = document.getElementById('map-close')
  closeBtn?.addEventListener('click', () => closeMap(overlayId))

  // Click on overlay background (not the map container itself) closes it
  const overlay = document.getElementById(overlayId)
  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) closeMap(overlayId)
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.isVisible) {
      closeMap(overlayId)
    }
  })
}
