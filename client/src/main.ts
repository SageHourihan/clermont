import './styles/base.css'
import './styles/map.css'
import './styles/panels.css'

import { getMockEvents } from './data/mock.js'
import { initAsciiMap, updateAsciiMap } from './map/ascii.js'
import { openMap, setupMapControls, refreshMapMarkers, flyToEvent, configureMap } from './map/index.js'
import { initHeader, updateLastUpdate } from './panels/header.js'
import { renderFeed, focusEventRow, getFeedEventIds } from './panels/feed.js'
import { initStatusBar, updateStatusBar, INITIAL_FEED_STATES } from './panels/statusbar.js'
import type { Event, Feed, Severity } from '../../shared/types.js'

const POLL_INTERVAL_MS = 60_000

const IDS = {
  asciiMap:    'ascii-map',
  mapOverlay:  'map-overlay',
  leafletMap:  'leaflet-map',
  header:      'header',
  statusbar:   'statusbar',
  filterStrip: 'filter-strip',
  kbCheatsheet: 'kb-cheatsheet',
  cmdOverlay:  'cmd-overlay',
  cmdInput:    'cmd-input',
} as const

// Feed panel lookup
const FEEDS: Feed[] = ['GEO', 'ENV', 'MKT', 'INF']

const FEED_IDS: Record<Feed, { list: string; panel: string }> = {
  GEO: { list: 'geo-feed', panel: 'geo-panel' },
  ENV: { list: 'env-feed', panel: 'env-panel' },
  MKT: { list: 'mkt-feed', panel: 'mkt-panel' },
  INF: { list: 'inf-feed', panel: 'inf-panel' },
}

// ── Filter state ───────────────────────────────────────────

const filterState = {
  feeds:      new Set<Feed>(['GEO', 'ENV', 'MKT', 'INF']),
  severities: new Set<Severity>(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']),
}

// ── Keyboard nav state ─────────────────────────────────────

const kbState = {
  active:       false,   // whether keyboard nav has been triggered
  panelIndex:   0,       // 0=GEO 1=ENV 2=MKT 3=INF
  eventIndex:   -1,      // -1 = no selection
}

// ── Data ───────────────────────────────────────────────────

let currentEvents: Event[] = []
let previousCriticalIds = new Set<string>()

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

// ── Filtering ──────────────────────────────────────────────

function getFilteredEvents(feed: Feed): Event[] {
  if (!filterState.feeds.has(feed)) return []
  return currentEvents.filter(e =>
    e.feed === feed && filterState.severities.has(e.severity)
  )
}

// ── Rendering ─────────────────────────────────────────────

function rerender(): void {
  for (const feed of FEEDS) {
    const { list, panel } = FEED_IDS[feed]
    const isMuted = !filterState.feeds.has(feed)
    document.getElementById(panel)?.classList.toggle('panel--muted', isMuted)

    if (isMuted) {
      const container = document.getElementById(list)
      if (container) container.innerHTML = '<div class="feed-muted-msg">[FEED MUTED]</div>'
    } else {
      renderFeed(list, getFilteredEvents(feed), (event) => flyToEvent(event))
    }
  }
  syncFilterStripUI()
}

function syncFilterStripUI(): void {
  // Severity badges
  document.querySelectorAll<HTMLElement>('[data-severity]').forEach(el => {
    const sev = el.getAttribute('data-severity') as Severity
    el.classList.toggle('filter-badge--active', filterState.severities.has(sev))
  })
  // Panel labels
  document.querySelectorAll<HTMLElement>('[data-feed]').forEach(el => {
    const feed = el.getAttribute('data-feed') as Feed
    const muted = !filterState.feeds.has(feed)
    el.style.color = muted ? 'var(--text-muted)' : ''
    el.title = muted ? 'CLICK TO RESTORE FEED' : 'CLICK TO MUTE FEED'
  })
}

// ── CRITICAL alert flash ───────────────────────────────────

function checkCriticalAlerts(events: Event[]): void {
  const criticalNow = events.filter(e => e.severity === 'CRITICAL')
  const newCritical = criticalNow.filter(e => !previousCriticalIds.has(e.id))

  if (newCritical.length === 0) {
    previousCriticalIds = new Set(criticalNow.map(e => e.id))
    return
  }

  // Group new critical events by feed and flash each affected panel
  const affectedFeeds = new Set(newCritical.map(e => e.feed))
  for (const feed of affectedFeeds) {
    const { panel, list } = FEED_IDS[feed]
    const panelEl = document.getElementById(panel)
    const listEl  = document.getElementById(list)
    if (!panelEl || !listEl) continue

    // Inject a temporary banner above the events
    const banner = document.createElement('div')
    banner.className = 'alert-banner'
    banner.textContent = `>> NEW CRITICAL SIGNAL <<`
    listEl.prepend(banner)
    setTimeout(() => banner.remove(), 3000)

    // Flash the panel border
    panelEl.classList.remove('panel--alert')
    void panelEl.offsetWidth // force reflow to re-trigger animation
    panelEl.classList.add('panel--alert')
    setTimeout(() => panelEl.classList.remove('panel--alert'), 1500)
  }

  previousCriticalIds = new Set(criticalNow.map(e => e.id))
}

// ── Refresh cycle ──────────────────────────────────────────

async function refresh(): Promise<void> {
  const events = await fetchEvents()
  currentEvents = events
  const now = new Date()

  updateLastUpdate(now)

  const asciiMap = document.getElementById(IDS.asciiMap)
  if (asciiMap) updateAsciiMap(asciiMap, events)

  rerender()

  const feedStates = INITIAL_FEED_STATES.map(s => {
    const count = events.filter(e => e.feed === s.feed).length
    return count > 0 ? { ...s, status: 'ONLINE' as const, lastUpdate: now, eventCount: count } : s
  })
  updateStatusBar(IDS.statusbar, feedStates)

  refreshMapMarkers(events)
  checkCriticalAlerts(events)
}

// ── Filter strip init ──────────────────────────────────────

function initFilters(): void {
  // Severity badge toggles
  document.querySelectorAll<HTMLElement>('[data-severity]').forEach(el => {
    el.addEventListener('click', () => {
      const sev = el.getAttribute('data-severity') as Severity
      if (filterState.severities.has(sev) && filterState.severities.size === 1) return // keep at least one
      if (filterState.severities.has(sev)) {
        filterState.severities.delete(sev)
      } else {
        filterState.severities.add(sev)
      }
      rerender()
    })
  })

  // Panel label feed toggles
  document.querySelectorAll<HTMLElement>('[data-feed]').forEach(el => {
    el.addEventListener('click', () => {
      const feed = el.getAttribute('data-feed') as Feed
      if (filterState.feeds.has(feed) && filterState.feeds.size === 1) return // keep at least one
      if (filterState.feeds.has(feed)) {
        filterState.feeds.delete(feed)
      } else {
        filterState.feeds.add(feed)
      }
      rerender()
    })
  })
}

// ── Keyboard navigation ────────────────────────────────────

function activeFeedListId(): string {
  return FEED_IDS[FEEDS[kbState.panelIndex]].list
}

function clearKbFocus(): void {
  for (const feed of FEEDS) focusEventRow(FEED_IDS[feed].list, null)
  kbState.eventIndex = -1
}

function applyKbFocus(): void {
  const listId = activeFeedListId()
  const ids = getFeedEventIds(listId)
  if (ids.length === 0) return
  kbState.eventIndex = Math.max(0, Math.min(kbState.eventIndex, ids.length - 1))
  // Clear other panels
  for (const feed of FEEDS) {
    if (FEED_IDS[feed].list !== listId) focusEventRow(FEED_IDS[feed].list, null)
  }
  focusEventRow(listId, ids[kbState.eventIndex])
}

function showKbIndicator(show: boolean): void {
  const ind = document.querySelector('.kb-active-indicator')
  ind?.classList.toggle('statusbar__kb--hidden', !show)
}

function initKeyboardNav(): void {
  document.addEventListener('keydown', (e) => {
    // Don't capture if user is typing in the command line or an input
    if ((e.target as Element).tagName === 'INPUT') return

    // Map is open — only ESC is handled (already in setupMapControls)
    const mapOverlay = document.getElementById(IDS.mapOverlay)
    if (mapOverlay && !mapOverlay.classList.contains('map-overlay--hidden')) return

    // Cheatsheet toggle
    if (e.key === '?') {
      e.preventDefault()
      toggleCheatsheet()
      return
    }

    // Cheatsheet close
    const cheatsheet = document.getElementById(IDS.kbCheatsheet)
    if (cheatsheet && !cheatsheet.classList.contains('kb-cheatsheet--hidden')) {
      if (e.key === 'Escape') { e.preventDefault(); toggleCheatsheet(false) }
      return
    }

    // Command line activation
    if (e.key === '/') {
      e.preventDefault()
      openCommandLine()
      return
    }

    // Esc — clear keyboard selection
    if (e.key === 'Escape') {
      if (kbState.active) {
        clearKbFocus()
        kbState.active = false
        showKbIndicator(false)
      }
      return
    }

    // j / k — navigate events
    if (e.key === 'j' || e.key === 'k') {
      e.preventDefault()
      if (!kbState.active) {
        kbState.active = true
        kbState.eventIndex = 0
        showKbIndicator(true)
      } else {
        const ids = getFeedEventIds(activeFeedListId())
        if (e.key === 'j') kbState.eventIndex = Math.min(kbState.eventIndex + 1, ids.length - 1)
        if (e.key === 'k') kbState.eventIndex = Math.max(kbState.eventIndex - 1, 0)
      }
      applyKbFocus()
      return
    }

    // Tab — cycle panels
    if (e.key === 'Tab') {
      e.preventDefault()
      if (!kbState.active) {
        kbState.active = true
        showKbIndicator(true)
      }
      if (e.shiftKey) {
        kbState.panelIndex = (kbState.panelIndex - 1 + FEEDS.length) % FEEDS.length
      } else {
        kbState.panelIndex = (kbState.panelIndex + 1) % FEEDS.length
      }
      kbState.eventIndex = 0
      applyKbFocus()
      return
    }

    // Enter — open focused event on map
    if (e.key === 'Enter' && kbState.active) {
      e.preventDefault()
      const ids = getFeedEventIds(activeFeedListId())
      const id = ids[kbState.eventIndex]
      if (!id) return
      const event = currentEvents.find(ev => ev.id === id)
      if (event) flyToEvent(event)
      return
    }
  })
}

// ── Cheatsheet ─────────────────────────────────────────────

function toggleCheatsheet(forceOpen?: boolean): void {
  const el = document.getElementById(IDS.kbCheatsheet)
  if (!el) return
  const isHidden = el.classList.contains('kb-cheatsheet--hidden')
  const shouldOpen = forceOpen ?? isHidden
  el.classList.toggle('kb-cheatsheet--hidden', !shouldOpen)
}

// ── Command line ───────────────────────────────────────────

function openCommandLine(): void {
  const overlay = document.getElementById(IDS.cmdOverlay)
  const input   = document.getElementById(IDS.cmdInput) as HTMLInputElement | null
  if (!overlay || !input) return
  overlay.classList.remove('cmd-overlay--hidden')
  input.value = ''
  input.focus()
}

function closeCommandLine(): void {
  const overlay = document.getElementById(IDS.cmdOverlay)
  overlay?.classList.add('cmd-overlay--hidden')
}

function execCommand(raw: string): void {
  const parts = raw.trim().toUpperCase().split(/\s+/)
  const cmd = parts[0]

  if (cmd === 'CLEAR') {
    filterState.feeds = new Set(FEEDS)
    filterState.severities = new Set(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as Severity[])
    rerender()
    return
  }

  if (cmd === 'FILTER' || cmd === 'SHOW') {
    // e.g. FILTER GEO   or   FILTER CRITICAL   or   FILTER GEO CRITICAL
    const feedArgs = parts.slice(1).filter(p => (FEEDS as string[]).includes(p)) as Feed[]
    const sevArgs  = parts.slice(1).filter(p =>
      (['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as string[]).includes(p)
    ) as Severity[]

    if (feedArgs.length > 0) filterState.feeds = new Set(feedArgs)
    if (sevArgs.length > 0)  filterState.severities = new Set(sevArgs)
    rerender()
    return
  }

  if (cmd === 'HELP' || cmd === '?') {
    closeCommandLine()
    toggleCheatsheet(true)
    return
  }
}

function initCommandLine(): void {
  const input = document.getElementById(IDS.cmdInput) as HTMLInputElement | null
  if (!input) return

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = input.value.trim()
      closeCommandLine()
      if (val) execCommand(val)
    }
    if (e.key === 'Escape') {
      closeCommandLine()
    }
  })
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

  configureMap(IDS.leafletMap, IDS.mapOverlay)
  setupMapControls(IDS.mapOverlay)
  initFilters()
  initKeyboardNav()
  initCommandLine()

  // First load
  refresh()

  // Polling loop
  setInterval(refresh, POLL_INTERVAL_MS)
}

// `type="module"` scripts execute after the DOM is parsed
init()
