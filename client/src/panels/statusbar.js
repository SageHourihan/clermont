import { renderFilterBar } from '../filter.js';
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
    ${renderFilterBar()}
    <div id="statusbar-nav-hint" class="statusbar__nav-hint statusbar__nav-hint--hidden">[HJKL] NAV</div>
    <div class="statusbar__version">CLERMONT v0.1.0-alpha</div>`;
}
export function updateStatusBar(containerId, feedStates) {
    // Preserve hint state across re-render
    const existing = document.getElementById('statusbar-nav-hint');
    const hintText = existing?.textContent ?? null;
    const hintVisible = existing ? !existing.classList.contains('statusbar__nav-hint--hidden') : false;
    initStatusBar(containerId, feedStates);
    if (hintVisible && hintText !== null) {
        const newHint = document.getElementById('statusbar-nav-hint');
        if (newHint) {
            newHint.textContent = hintText;
            newHint.classList.remove('statusbar__nav-hint--hidden');
        }
    }
}
// ── Hint helpers ──────────────────────────────────────────
export function showNavModeHint() {
    const el = document.getElementById('statusbar-nav-hint');
    if (!el)
        return;
    el.textContent = '[HJKL] NAV';
    el.classList.remove('statusbar__nav-hint--hidden');
}
export function showFilterModeHint() {
    const el = document.getElementById('statusbar-nav-hint');
    if (!el)
        return;
    el.textContent = 'F: [C]RIT [H]IGH [M]ED [L]OW [A]=ALL [ESC]=EXIT';
    el.classList.remove('statusbar__nav-hint--hidden');
}
export function hideNavModeHint() {
    document.getElementById('statusbar-nav-hint')?.classList.add('statusbar__nav-hint--hidden');
}
