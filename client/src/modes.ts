// ── Mode definitions ──────────────────────────────────────

export type Mode = 'DEFAULT' | 'TIMELINE' | 'METRICS' | 'MINIMAL' | 'WATCHLIST' | 'FOCUSED'

// ── State ─────────────────────────────────────────────────

let _current: Mode = 'DEFAULT'
let _previous: Mode = 'DEFAULT'
const _listeners: Array<(mode: Mode, prev: Mode) => void> = []

// ── Public API ────────────────────────────────────────────

export function getMode(): Mode {
  return _current
}

export function getPreviousMode(): Mode {
  return _previous
}

export function setMode(mode: Mode): void {
  if (mode === _current) return
  _previous = _current
  _current = mode
  _listeners.forEach(fn => fn(_current, _previous))
}

export function onModeChange(fn: (mode: Mode, prev: Mode) => void): void {
  _listeners.push(fn)
}
