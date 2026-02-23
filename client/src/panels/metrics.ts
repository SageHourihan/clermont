import type { Event as ClerEvent, Severity, Feed } from '../../../shared/types.js'

const SEVERITY_ORDER: Severity[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']
const FEED_ORDER: Feed[] = ['GEO', 'ENV', 'MKT', 'INF']

const SEVERITY_LABEL: Record<Severity, string> = {
  CRITICAL: '[!!] CRITICAL',
  HIGH:     '[!]  HIGH',
  MEDIUM:   '[~]  MEDIUM',
  LOW:      '[.]  LOW',
}

function formatTimestamp(date: Date): string {
  return new Date(date).toISOString().replace('T', ' ').slice(0, 16) + 'Z'
}

function renderBar(
  label: string,
  count: number,
  total: number,
  fillClass: string
): string {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return `
    <div class="metrics__row">
      <span class="metrics__label">${label}</span>
      <div class="metrics__bar-track">
        <div class="metrics__bar-fill ${fillClass}" style="width:${pct}%"></div>
      </div>
      <span class="metrics__count">${count}</span>
    </div>`
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

export function renderMetrics(containerId: string, events: ClerEvent[]): void {
  const el = document.getElementById(containerId)
  if (!el) return

  const total = events.length

  // Severity counts
  const bySeverity: Record<Severity, number> = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 }
  for (const ev of events) bySeverity[ev.severity]++

  // Feed counts
  const byFeed: Record<Feed, number> = { GEO: 0, ENV: 0, MKT: 0, INF: 0 }
  for (const ev of events) byFeed[ev.feed]++

  // Priority signals: up to 5 most critical events
  const priorityOrder: Record<Severity, number> = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 }
  const priority = [...events]
    .sort((a, b) => priorityOrder[b.severity] - priorityOrder[a.severity] ||
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5)

  const severityBars = SEVERITY_ORDER.map(sev =>
    renderBar(sev, bySeverity[sev], total, `metrics__bar-fill--${sev.toLowerCase()}`)
  ).join('')

  const feedBars = FEED_ORDER.map(feed =>
    renderBar(feed, byFeed[feed], total, `metrics__bar-fill--${feed.toLowerCase()}`)
  ).join('')

  el.innerHTML = `
    <div class="metrics__grid">
      <div>
        <div class="metrics__section-title">// SEVERITY DISTRIBUTION</div>
        ${severityBars}
      </div>
      <div>
        <div class="metrics__section-title">// BY FEED</div>
        ${feedBars}
        <div style="margin-top:12px; font-size:11px; color:var(--text-secondary)">
          TOTAL SIGNALS: ${total}
        </div>
      </div>
    </div>
    <div class="metrics__section-title">// PRIORITY SIGNALS</div>
    <div class="metrics__priority-list">
      ${priority.map(renderEventRow).join('')}
    </div>
  `
}
