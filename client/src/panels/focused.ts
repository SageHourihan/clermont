import type { Event as ClerEvent, Severity } from '../../../shared/types.js'
import { isPinned, togglePin } from '../watchlist.js'
import { setMode, getPreviousMode } from '../modes.js'
import { openMap, flyToEvent } from '../map/index.js'

// ── State ─────────────────────────────────────────────────

let _focusedEvent: ClerEvent | null = null
let _getAllEvents: () => ClerEvent[] = () => []
let _overlayId = ''
let _leafletId = ''

// ── Helpers ───────────────────────────────────────────────

const SEVERITY_LABEL: Record<Severity, string> = {
  CRITICAL: '[!!] CRITICAL',
  HIGH:     '[!]  HIGH',
  MEDIUM:   '[~]  MEDIUM',
  LOW:      '[.]  LOW',
}

function formatTimestamp(date: Date): string {
  return new Date(date).toISOString().replace('T', ' ').slice(0, 16) + 'Z'
}

function formatCoords(lat: number, lng: number): string {
  const latStr = `${Math.abs(lat).toFixed(2)}\u00b0${lat >= 0 ? 'N' : 'S'}`
  const lngStr = `${Math.abs(lng).toFixed(2)}\u00b0${lng >= 0 ? 'E' : 'W'}`
  return `${latStr}  ${lngStr}`
}

function renderRelatedRow(event: ClerEvent): string {
  const ts = formatTimestamp(event.timestamp)
  const sevClass = `severity--${event.severity.toLowerCase()}`
  const titleEl = event.url
    ? `<a class="event__title ${sevClass}" href="${event.url}" target="_blank" rel="noopener">${event.title}</a>`
    : `<span class="event__title ${sevClass}">${event.title}</span>`
  return `<div class="event-row" data-id="${event.id}">
    <div class="event__header">
      <span class="event__feed">[${event.feed}]</span>
      <span class="event__timestamp">${ts}</span>
    </div>
    ${titleEl}
    <div class="event__meta">
      <span class="event__severity ${sevClass}">${SEVERITY_LABEL[event.severity]}</span>
      <span class="event__source"> // ${event.source}</span>
    </div>
    <div class="event__divider">----------------------------------------</div>
  </div>`
}

// ── Public API ────────────────────────────────────────────

export function setFocusedEvent(event: ClerEvent | null): void {
  _focusedEvent = event
}

export function getFocusedEvent(): ClerEvent | null {
  return _focusedEvent
}

export function initFocused(overlayId: string, leafletId: string, getAllEvents: () => ClerEvent[]): void {
  _overlayId = overlayId
  _leafletId = leafletId
  _getAllEvents = getAllEvents
}

export function renderFocused(containerId: string): void {
  const el = document.getElementById(containerId)
  if (!el) return

  const event = _focusedEvent
  if (!event) {
    el.innerHTML = '<div style="color:var(--text-secondary);padding:24px">> NO EVENT SELECTED</div>'
    return
  }

  const sevClass = `severity--${event.severity.toLowerCase()}`
  const ts = formatTimestamp(event.timestamp)
  const coords = formatCoords(event.lat, event.lng)
  const pinned = isPinned(event.id)

  const urlLine = event.url
    ? `<a class="detail__url" href="${event.url}" target="_blank" rel="noopener">${event.url}</a>`
    : `<span style="color:var(--text-muted)">N/A</span>`

  const related = _getAllEvents()
    .filter(ev => ev.feed === event.feed && ev.id !== event.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5)

  el.innerHTML = `
    <div class="focused__title ${sevClass}">${event.title}</div>
    <div class="focused__divider">════════════════════════════════════════</div>
    <div class="focused__meta-grid">
      <span class="focused__meta-label">FEED</span>
      <span class="focused__meta-value">[${event.feed}]</span>
      <span class="focused__meta-label">SEVERITY</span>
      <span class="focused__meta-value ${sevClass}">${SEVERITY_LABEL[event.severity]}</span>
      <span class="focused__meta-label">TIME</span>
      <span class="focused__meta-value">${ts}</span>
      <span class="focused__meta-label">SOURCE</span>
      <span class="focused__meta-value">${event.source}</span>
      <span class="focused__meta-label">COORDS</span>
      <span class="focused__meta-value">${coords}</span>
      <span class="focused__meta-label">URL</span>
      <span class="focused__meta-value">${urlLine}</span>
    </div>
    <div class="focused__divider">----------------------------------------</div>
    <div class="focused__actions">
      <button class="focused__action-btn" id="focused-map-btn">[M] MAP</button>
      <button class="focused__action-btn ${pinned ? 'focused__action-btn--active' : ''}" id="focused-watch-btn">
        ${pinned ? '[W] UNWATCH' : '[W] WATCH'}
      </button>
      <button class="focused__action-btn" id="focused-back-btn">[ESC] BACK</button>
    </div>
    <div style="margin-top:20px">
      <div class="focused__section-title">// RELATED — [${event.feed}] FEED</div>
      <div class="focused__related">
        ${related.length > 0
          ? related.map(renderRelatedRow).join('')
          : '<div style="color:var(--text-muted);font-size:12px">> NO OTHER EVENTS IN THIS FEED</div>'
        }
      </div>
    </div>
  `

  // Wire action buttons
  document.getElementById('focused-map-btn')?.addEventListener('click', () => {
    openMap(_leafletId, _overlayId, _getAllEvents())
    flyToEvent(event)
  })

  document.getElementById('focused-watch-btn')?.addEventListener('click', () => {
    const nowPinned = togglePin(event.id)
    const btn = document.getElementById('focused-watch-btn')
    if (btn) {
      btn.textContent = nowPinned ? '[W] UNWATCH' : '[W] WATCH'
      btn.classList.toggle('focused__action-btn--active', nowPinned)
    }
  })

  document.getElementById('focused-back-btn')?.addEventListener('click', () => {
    setMode(getPreviousMode())
  })
}
