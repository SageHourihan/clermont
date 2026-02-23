// ── Mode definitions ──────────────────────────────────────
// ── State ─────────────────────────────────────────────────
let _current = 'DEFAULT';
let _previous = 'DEFAULT';
const _listeners = [];
// ── Public API ────────────────────────────────────────────
export function getMode() {
    return _current;
}
export function getPreviousMode() {
    return _previous;
}
export function setMode(mode) {
    if (mode === _current)
        return;
    _previous = _current;
    _current = mode;
    _listeners.forEach(fn => fn(_current, _previous));
}
export function onModeChange(fn) {
    _listeners.push(fn);
}
