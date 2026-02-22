import './styles/base.css'
import './styles/map.css'
import './styles/panels.css'
import './styles/keyboard.css'

import { getMockEvents } from './data/mock.js'
import { initAsciiMap, updateAsciiMap } from './map/ascii.js'
import { openMap, setupMapControls, refreshMapMarkers } from './map/index.js'
import { initHeader, updateLastUpdate } from './panels/header.js'
import { renderFeed } from './panels/feed.js'
import { initStatusBar, updateStatusBar, INITIAL_FEED_STATES } from './panels/statusbar.js'
import { initKeyboard, updateKeyboardEvents } from './keyboard.js'
import type { Event } from '../../shared/types.js'

const POLL_INTERVAL_MS = 60_000

const IDS = {
  asciiMap:    'ascii-map',
  mapOverlay:  'map-overlay',
  leafletMap:  'leaflet-map',
  geoFeed:     'geo-feed',
  envFeed:     'env-feed',
  mktFeed:     'mkt-feed',
  infFeed:     'inf-feed',
  header:      'header',
  statusbar:   'statusbar',
} as const

let currentEvents: Event[] = []

// ── Data layer ────────────────────────────────────────────
// MOCK MODE — swap for fetch calls below when the backend is ready
async function fetchEvents(): Promise<Event[]> {
  return getMockEvents()

  // LIVE MODE (uncomment when backend is ready):
  // try {
  //   const res = await fetch('/api/events')
  //   if (!res.ok) throw new Error(`HTTP ${res.status}`)
  //   return res.json()
  // } catch (err) {
  //   console.warn('[CLERMONT] API fetch failed, using mock data', err)
  //   return getMockEvents()
  // }
}

// ── Refresh cycle ─────────────────────────────────────────

async function refresh(): Promise<void> {
  const events = await fetchEvents()
  currentEvents = events
  const now = new Date()

  updateLastUpdate(now)

  const asciiMap = document.getElementById(IDS.asciiMap)
  if (asciiMap) updateAsciiMap(asciiMap, events)

  const geoEvents = events.filter(e => e.feed === 'GEO')
  const envEvents = events.filter(e => e.feed === 'ENV')
  const mktEvents = events.filter(e => e.feed === 'MKT')
  const infEvents = events.filter(e => e.feed === 'INF')

  renderFeed(IDS.geoFeed, geoEvents)
  renderFeed(IDS.envFeed, envEvents)
  renderFeed(IDS.mktFeed, mktEvents)
  renderFeed(IDS.infFeed, infEvents)

  updateKeyboardEvents(geoEvents, envEvents, mktEvents, infEvents)

  const feedStates = INITIAL_FEED_STATES.map(s => {
    const count = events.filter(e => e.feed === s.feed).length
    return count > 0 ? { ...s, status: 'ONLINE' as const, lastUpdate: now, eventCount: count } : s
  })
  updateStatusBar(IDS.statusbar, feedStates)

  refreshMapMarkers(events)
}

// ── Init ──────────────────────────────────────────────────

function init(): void {
  initHeader(IDS.header)

  initStatusBar(IDS.statusbar, INITIAL_FEED_STATES)

  const asciiMap = document.getElementById(IDS.asciiMap)
  if (asciiMap) {
    initAsciiMap(asciiMap, [], () => {
      openMap(IDS.leafletMap, IDS.mapOverlay, currentEvents)
    })
  }

  setupMapControls(IDS.mapOverlay)

  initKeyboard(IDS.mapOverlay, IDS.leafletMap, () => currentEvents)

  // First load
  refresh()

  // Polling loop
  setInterval(refresh, POLL_INTERVAL_MS)
}

// `type="module"` scripts execute after the DOM is parsed
init()
