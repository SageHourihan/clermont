import type { Severity } from '../../shared/types.js'

// ── Constants ─────────────────────────────────────────────

const ALL_SEVERITIES: Severity[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']

const SEVERITY_LABEL: Record<Severity, string> = {
  CRITICAL: '!!',
  HIGH:     '!',
  MEDIUM:   '~',
  LOW:      '.',
}

// ── State ─────────────────────────────────────────────────

const active = new Set<Severity>(ALL_SEVERITIES)
let _filterMode = false
const _listeners: Array<() => void> = []

function notify(): void {
  for (const cb of _listeners) cb()
}

// ── Public API ────────────────────────────────────────────

export function onFilterChange(cb: () => void): void {
  _listeners.push(cb)
}

export function isAllEnabled(): boolean {
  return active.size === ALL_SEVERITIES.length
}

export function toggleSeverity(s: Severity): void {
  // Never deselect the last active severity
  if (active.has(s) && active.size === 1) return
  if (active.has(s)) {
    active.delete(s)
  } else {
    active.add(s)
  }
  notify()
}

export function resetFilter(): void {
  for (const s of ALL_SEVERITIES) active.add(s)
  notify()
}

export function applyFilter<T extends { severity: Severity }>(items: T[]): T[] {
  if (isAllEnabled()) return items
  return items.filter(e => active.has(e.severity))
}

// ── Filter mode ───────────────────────────────────────────

export function isFilterMode(): boolean {
  return _filterMode
}

export function enterFilterMode(): void {
  _filterMode = true
}

export function exitFilterMode(): void {
  _filterMode = false
}

// ── Click handler (event delegation on document) ──────────
// Call once during init. Works even after statusbar innerHTML is replaced.

export function initFilterClickHandlers(): void {
  document.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-severity]')
    if (!btn) return
    const s = btn.getAttribute('data-severity') as Severity
    if (ALL_SEVERITIES.includes(s)) toggleSeverity(s)
  })
}

// ── HTML rendering ────────────────────────────────────────
// Imported by statusbar.ts so the filter bar is included in
// every statusbar render and always reflects current state.

export function renderFilterBar(): string {
  const filterActive = _filterMode
  const activeCls = filterActive ? ' statusbar__filter--active' : ''

  const buttons = ALL_SEVERITIES.map(s => {
    const on = active.has(s)
    const stateCls = on
      ? `filter-btn--on filter-btn--${s.toLowerCase()}`
      : 'filter-btn--off'
    return `<span class="filter-btn ${stateCls}" data-severity="${s}">[${SEVERITY_LABEL[s]}]</span>`
  }).join('')

  return `<div id="filter-bar" class="statusbar__filter${activeCls}">` +
    `<span class="filter-label">FILTER:</span>${buttons}</div>`
}
