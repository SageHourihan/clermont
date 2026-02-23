import type { Event as ClerEvent } from '../../shared/types.js'

// ── Storage key ───────────────────────────────────────────

const STORAGE_KEY = 'clermont:watchlist'

// ── Listeners ─────────────────────────────────────────────

const _listeners: Array<(ids: string[]) => void> = []

// ── Persistence helpers ───────────────────────────────────

function load(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function save(ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch {
    // localStorage unavailable — fail silently
  }
}

function notify(): void {
  const ids = load()
  _listeners.forEach(fn => fn(ids))
}

// ── Public API ────────────────────────────────────────────

export function isPinned(id: string): boolean {
  return load().includes(id)
}

export function getPinnedIds(): string[] {
  return load()
}

export function togglePin(id: string): boolean {
  const ids = load()
  const idx = ids.indexOf(id)
  if (idx >= 0) {
    ids.splice(idx, 1)
  } else {
    ids.push(id)
  }
  save(ids)
  notify()
  return idx < 0  // true = now pinned
}

/**
 * Remove any pinned IDs that no longer exist in the event set.
 * Called after each data refresh to prevent stale pins.
 */
export function reconcileWatchlist(events: ClerEvent[]): void {
  const knownIds = new Set(events.map(e => e.id))
  const ids = load().filter(id => knownIds.has(id))
  save(ids)
}

export function onWatchlistChange(fn: (ids: string[]) => void): void {
  _listeners.push(fn)
}
