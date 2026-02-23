import type { Mode } from '../modes.js'

const BUTTONS: Array<{ mode: Mode; label: string }> = [
  { mode: 'DEFAULT',   label: '[1] DEFAULT'  },
  { mode: 'TIMELINE',  label: '[T] TIMELINE' },
  { mode: 'METRICS',   label: '[X] METRICS'  },
  { mode: 'MINIMAL',   label: '[Q] MINIMAL'  },
  { mode: 'WATCHLIST', label: '[W] WATCHLIST'},
]

export function initModeBar(containerId: string, onSelect: (mode: Mode) => void): void {
  const el = document.getElementById(containerId)
  if (!el) return

  el.innerHTML = BUTTONS.map(b =>
    `<button class="mode-btn" data-mode="${b.mode}">${b.label}</button>`
  ).join('')

  // Event delegation
  el.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('.mode-btn')
    if (!btn) return
    const mode = btn.getAttribute('data-mode') as Mode | null
    if (mode) onSelect(mode)
  })
}

export function renderModeBar(containerId: string, activeMode: Mode): void {
  const el = document.getElementById(containerId)
  if (!el) return
  el.querySelectorAll<HTMLElement>('.mode-btn').forEach(btn => {
    const mode = btn.getAttribute('data-mode') as Mode | null
    btn.classList.toggle('mode-btn--active', mode === activeMode)
  })
}
