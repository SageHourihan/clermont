import type { Event as ClerEvent, Severity } from '../../../shared/types.js'
import { getPinnedIds } from '../watchlist.js'

const SEVERITY_LABEL: Record<Severity, string> = {
  CRITICAL: '[!!] CRITICAL',
  HIGH:     '[!]  HIGH',
  MEDIUM:   '[~]  MEDIUM',
  LOW:      '[.]  LOW',
}

const SEVERITY_ORDER: Record<Severity, number> = {
  CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1,
}

function formatTimestamp(date: Date): string {
  return new Date(date).toISOString().replace('T', ' ').slice(0, 16) + 'Z'
}

function renderEventRow(event: ClerEvent): string {
  const ts = formatTimestamp(event.timestamp)
  const sevClass = `severity--${event.severity.toLowerCase()}`
  const titleEl = event.url
    ? `<a class="event__title ${sevClass}" href="${event.url}" target="_blank" rel="noopener">${event.title}</a>`
    : `<span class="event__title ${sevClass}">${event.title}</span>`
  return `<div class="event-row" data-id="${event.id}">
    <div class="event__header">
      <span class="event__feed">[${event.feed}]</span>
      <span class="event__timestamp">${ts}</span>
      <span class="watchlist__pin-badge">[WATCHED]</span>
    </div>
    ${titleEl}
    <div class="event__meta">
      <span class="event__severity ${sevClass}">${SEVERITY_LABEL[event.severity]}</span>
      <span class="event__source"> // ${event.source}</span>
    </div>
    <div class="event__divider">----------------------------------------</div>
  </div>`
}

export function renderWatchlist(containerId: string, events: ClerEvent[]): void {
  const el = document.getElementById(containerId)
  if (!el) return

  const pinnedIds = new Set(getPinnedIds())
  const pinned = events
    .filter(ev => pinnedIds.has(ev.id))
    .sort((a, b) => SEVERITY_ORDER[b.severity] - SEVERITY_ORDER[a.severity])

  if (pinned.length === 0) {
    el.innerHTML = `<div class="watchlist">
      <div class="watchlist__empty">> NO EVENTS TRACKED\n// PRESS [W] ON ANY EVENT TO ADD</div>
    </div>`
    return
  }

  el.innerHTML = `<div class="watchlist">
    ${pinned.map(renderEventRow).join('')}
  </div>`
}
