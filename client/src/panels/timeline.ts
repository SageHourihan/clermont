import type { Event as ClerEvent } from '../../../shared/types.js'

const SEVERITY_LABEL: Record<string, string> = {
  CRITICAL: '[!!] CRITICAL',
  HIGH:     '[!]  HIGH',
  MEDIUM:   '[~]  MEDIUM',
  LOW:      '[.]  LOW',
}

function formatTimestamp(date: Date): string {
  return new Date(date).toISOString().replace('T', ' ').slice(0, 16) + 'Z'
}

function hourKey(date: Date): string {
  return new Date(date).toISOString().slice(0, 13) + ':00Z'
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
    </div>
    ${titleEl}
    <div class="event__meta">
      <span class="event__severity ${sevClass}">${SEVERITY_LABEL[event.severity]}</span>
      <span class="event__source"> // ${event.source}</span>
    </div>
    <div class="event__divider">----------------------------------------</div>
  </div>`
}

export function renderTimeline(containerId: string, events: ClerEvent[]): void {
  const el = document.getElementById(containerId)
  if (!el) return

  const sorted = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  // Group by hour
  const groups = new Map<string, ClerEvent[]>()
  for (const ev of sorted) {
    const key = hourKey(ev.timestamp)
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(ev)
  }

  if (groups.size === 0) {
    el.innerHTML = '<div class="watchlist__empty">> NO EVENTS // CHECK FILTER SETTINGS</div>'
    return
  }

  let html = '<div class="timeline">'
  for (const [hour, evs] of groups) {
    html += `<div class="timeline__group-header">── ${hour} ──────────────────────────────</div>`
    html += evs.map(renderEventRow).join('')
  }
  html += '</div>'
  el.innerHTML = html
}
