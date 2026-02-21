export const INITIAL_FEED_STATES = [
    { feed: 'GEO', status: 'ONLINE', lastUpdate: new Date(), eventCount: 0 },
    { feed: 'ENV', status: 'OFFLINE', eventCount: 0 },
    { feed: 'MKT', status: 'PLANNED', eventCount: 0 },
    { feed: 'INF', status: 'PLANNED', eventCount: 0 },
];
function renderIndicator(state) {
    const cls = `status--${state.status.toLowerCase()}`;
    const count = state.status === 'ONLINE' && state.eventCount !== undefined
        ? ` (${state.eventCount})`
        : '';
    return `<span class="feed-indicator ${cls}">[${state.feed}]: ${state.status}${count}</span>`;
}
export function initStatusBar(containerId, feedStates) {
    const el = document.getElementById(containerId);
    if (!el)
        return;
    el.innerHTML = `
    <div class="statusbar__feeds">
      ${feedStates.map((s, i) => i === 0
        ? renderIndicator(s)
        : `<span class="statusbar__sep"> | </span>${renderIndicator(s)}`).join('')}
    </div>
    <div class="statusbar__version">CLERMONT v0.1.0-alpha</div>`;
}
export function updateStatusBar(containerId, feedStates) {
    initStatusBar(containerId, feedStates);
}
