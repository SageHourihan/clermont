// ── Constants ─────────────────────────────────────────────
const ALL_SEVERITIES = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
const SEVERITY_LABEL = {
    CRITICAL: '!!',
    HIGH: '!',
    MEDIUM: '~',
    LOW: '.',
};
// ── State ─────────────────────────────────────────────────
const active = new Set(ALL_SEVERITIES);
let _filterMode = false;
const _listeners = [];
function notify() {
    for (const cb of _listeners)
        cb();
}
// ── Public API ────────────────────────────────────────────
export function onFilterChange(cb) {
    _listeners.push(cb);
}
export function isAllEnabled() {
    return active.size === ALL_SEVERITIES.length;
}
export function toggleSeverity(s) {
    // Never deselect the last active severity
    if (active.has(s) && active.size === 1)
        return;
    if (active.has(s)) {
        active.delete(s);
    }
    else {
        active.add(s);
    }
    notify();
}
export function resetFilter() {
    for (const s of ALL_SEVERITIES)
        active.add(s);
    notify();
}
export function applyFilter(items) {
    if (isAllEnabled())
        return items;
    return items.filter(e => active.has(e.severity));
}
// ── Filter mode ───────────────────────────────────────────
export function isFilterMode() {
    return _filterMode;
}
export function enterFilterMode() {
    _filterMode = true;
}
export function exitFilterMode() {
    _filterMode = false;
}
// ── Click handler (event delegation on document) ──────────
// Call once during init. Works even after statusbar innerHTML is replaced.
export function initFilterClickHandlers() {
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-severity]');
        if (!btn)
            return;
        const s = btn.getAttribute('data-severity');
        if (ALL_SEVERITIES.includes(s))
            toggleSeverity(s);
    });
}
// ── HTML rendering ────────────────────────────────────────
// Imported by statusbar.ts so the filter bar is included in
// every statusbar render and always reflects current state.
export function renderFilterBar() {
    const filterActive = _filterMode;
    const activeCls = filterActive ? ' statusbar__filter--active' : '';
    const buttons = ALL_SEVERITIES.map(s => {
        const on = active.has(s);
        const stateCls = on
            ? `filter-btn--on filter-btn--${s.toLowerCase()}`
            : 'filter-btn--off';
        return `<span class="filter-btn ${stateCls}" data-severity="${s}">[${SEVERITY_LABEL[s]}]</span>`;
    }).join('');
    return `<div id="filter-bar" class="statusbar__filter${activeCls}">` +
        `<span class="filter-label">FILTER:</span>${buttons}</div>`;
}
