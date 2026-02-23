// ── Storage key ───────────────────────────────────────────
const STORAGE_KEY = 'clermont:watchlist';
// ── Listeners ─────────────────────────────────────────────
const _listeners = [];
// ── Persistence helpers ───────────────────────────────────
function load() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw)
            return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    }
    catch {
        return [];
    }
}
function save(ids) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    }
    catch {
        // localStorage unavailable — fail silently
    }
}
function notify() {
    const ids = load();
    _listeners.forEach(fn => fn(ids));
}
// ── Public API ────────────────────────────────────────────
export function isPinned(id) {
    return load().includes(id);
}
export function getPinnedIds() {
    return load();
}
export function togglePin(id) {
    const ids = load();
    const idx = ids.indexOf(id);
    if (idx >= 0) {
        ids.splice(idx, 1);
    }
    else {
        ids.push(id);
    }
    save(ids);
    notify();
    return idx < 0; // true = now pinned
}
/**
 * Remove any pinned IDs that no longer exist in the event set.
 * Called after each data refresh to prevent stale pins.
 */
export function reconcileWatchlist(events) {
    const knownIds = new Set(events.map(e => e.id));
    const ids = load().filter(id => knownIds.has(id));
    save(ids);
}
export function onWatchlistChange(fn) {
    _listeners.push(fn);
}
