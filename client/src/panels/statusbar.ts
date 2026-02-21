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
    <div class="statusbar__right">
      <span class="kb-active-indicator statusbar__kb--hidden">[KB]</span>
      <span class="statusbar__version">CLERMONT v0.1.0-alpha</span>
    </div>`
}

export function updateStatusBar(containerId: string, feedStates: FeedState[]): void {
  const el = document.getElementById(containerId)
  if (!el) return

  // Preserve KB indicator state across re-renders
  const kbActive = !el.querySelector('.kb-active-indicator')?.classList.contains('statusbar__kb--hidden')

  initStatusBar(containerId, feedStates)

  if (kbActive) {
    el.querySelector('.kb-active-indicator')?.classList.remove('statusbar__kb--hidden')
  }
}
