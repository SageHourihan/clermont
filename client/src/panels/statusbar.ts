import type { FeedState } from '../../../shared/types.js'

export const INITIAL_FEED_STATES: FeedState[] = [
  { feed: 'GEO', status: 'ONLINE',  lastUpdate: new Date(), eventCount: 0 },
  { feed: 'ENV', status: 'OFFLINE', eventCount: 0 },
  { feed: 'MKT', status: 'PLANNED', eventCount: 0 },
  { feed: 'INF', status: 'PLANNED', eventCount: 0 },
]

function renderIndicator(state: FeedState): string {
  const cls = `status--${state.status.toLowerCase()}`
  const count = state.status === 'ONLINE' && state.eventCount !== undefined
    ? ` (${state.eventCount})`
    : ''
  return `<span class="feed-indicator ${cls}">[${state.feed}]: ${state.status}${count}</span>`
}

export function initStatusBar(containerId: string, feedStates: FeedState[]): void {
  const el = document.getElementById(containerId)
  if (!el) return

  el.innerHTML = `
    <div class="statusbar__feeds">
      ${feedStates.map((s, i) =>
        i === 0
          ? renderIndicator(s)
          : `<span class="statusbar__sep"> | </span>${renderIndicator(s)}`
      ).join('')}
    </div>
    <div id="statusbar-nav-hint" class="statusbar__nav-hint statusbar__nav-hint--hidden">[HJKL] NAV</div>
    <div class="statusbar__version">CLERMONT v0.1.0-alpha</div>`
}

export function updateStatusBar(containerId: string, feedStates: FeedState[]): void {
  const existing = document.getElementById('statusbar-nav-hint')
  const hintVisible = existing ? !existing.classList.contains('statusbar__nav-hint--hidden') : false
  initStatusBar(containerId, feedStates)
  if (hintVisible) {
    document.getElementById('statusbar-nav-hint')?.classList.remove('statusbar__nav-hint--hidden')
  }
}

export function showNavModeHint(): void {
  document.getElementById('statusbar-nav-hint')?.classList.remove('statusbar__nav-hint--hidden')
}

export function hideNavModeHint(): void {
  document.getElementById('statusbar-nav-hint')?.classList.add('statusbar__nav-hint--hidden')
}
