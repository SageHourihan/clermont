import type { Event, Severity } from '../../../shared/types.js'

const SEVERITY_LABEL: Record<Severity, string> = {
  CRITICAL: '[!!] CRITICAL',
  HIGH:     '[!]  HIGH',
  MEDIUM:   '[~]  MEDIUM',
  LOW:      '[.]  LOW',
}

// Track which event IDs have already been rendered so only new ones animate
const displayedIds = new Set<string>()

// AbortControllers keyed by containerId — cleaned up on each render
const clickControllers = new Map<string, AbortController>()

function formatTimestamp(date: Date): string {
  return new Date(date).toISOString().replace('T', ' ').slice(0, 16) + 'Z'
}

function renderEventRow(event: Event): string {
  const ts = formatTimestamp(event.timestamp)
  const sevClass = `severity--${event.severity.toLowerCase()}`
  const titleEl = event.url
    ? `<a class="event__title ${sevClass}" href="${event.url}" target="_blank" rel="noopener">${event.title}</a>`
    : `<span class="event__title ${sevClass}">${event.title}</span>`

  return `<div class="event-row" data-id="${event.id}" tabindex="-1">
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

// Fade + slide-in reveal on a row element
function revealRow(el: HTMLElement, delayMs: number): void {
  el.style.opacity = '0'
  el.style.transform = 'translateX(-6px)'
  el.style.transition = 'none'
  setTimeout(() => {
    el.style.transition = 'opacity 0.25s ease, transform 0.25s ease'
    el.style.opacity = '1'
    el.style.transform = 'translateX(0)'
  }, delayMs)
}

export function renderFeed(
  containerId: string,
  events: Event[],
  onEventClick?: (event: Event) => void,
): void {
  const container = document.getElementById(containerId)
  if (!container) return

  // Tear down previous click listener before re-rendering
  clickControllers.get(containerId)?.abort()

  const sorted = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  const newIds = sorted.filter(e => !displayedIds.has(e.id)).map(e => e.id)

  if (sorted.length === 0) {
    container.innerHTML = '<div class="feed-muted-msg">[NO SIGNALS MATCH CURRENT FILTER]</div>'
    return
  }

  container.innerHTML = sorted.map(renderEventRow).join('')

  sorted.forEach(e => displayedIds.add(e.id))

  // Animate new rows with a staggered reveal
  newIds.forEach((id, index) => {
    const row = container.querySelector<HTMLElement>(`[data-id="${id}"]`)
    if (row) revealRow(row, index * 80)
  })

  // Attach click delegation for opening events on the map
  if (onEventClick) {
    const controller = new AbortController()
    clickControllers.set(containerId, controller)

    container.addEventListener('click', (e) => {
      const row = (e.target as Element).closest<HTMLElement>('.event-row')
      if (!row) return
      // Don't intercept clicks on the source link
      if ((e.target as Element).tagName === 'A') return

      const id = row.getAttribute('data-id')
      const event = sorted.find(ev => ev.id === id)
      if (!event) return

      onEventClick(event)

      // Brief visual flash on the clicked row
      row.classList.add('event-row--focused')
      setTimeout(() => row.classList.remove('event-row--focused'), 600)
    }, { signal: controller.signal })
  }
}

export function clearFeed(containerId: string): void {
  const container = document.getElementById(containerId)
  if (container) container.innerHTML = ''
  clickControllers.get(containerId)?.abort()
  displayedIds.clear()
}

// Focus a specific event row by ID (used by keyboard nav)
export function focusEventRow(containerId: string, eventId: string | null): void {
  const container = document.getElementById(containerId)
  if (!container) return

  // Clear all focused rows in this container
  container.querySelectorAll<HTMLElement>('.event-row--focused').forEach(el => {
    el.classList.remove('event-row--focused')
  })

  if (!eventId) return

  const row = container.querySelector<HTMLElement>(`[data-id="${eventId}"]`)
  if (row) {
    row.classList.add('event-row--focused')
    row.scrollIntoView({ block: 'nearest' })
  }
}

// Return ordered event IDs in a feed container (top to bottom)
export function getFeedEventIds(containerId: string): string[] {
  const container = document.getElementById(containerId)
  if (!container) return []
  return Array.from(container.querySelectorAll<HTMLElement>('.event-row'))
    .map(el => el.getAttribute('data-id') ?? '')
    .filter(Boolean)
}
