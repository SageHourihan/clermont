import type { Event as ClerEvent } from '../../../shared/types.js'

export function renderMinimalOverlay(events: ClerEvent[]): void {
  removeMinimalOverlay()

  const panel = document.getElementById('ascii-map-panel')
  if (!panel) return

  const counts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 }
  for (const ev of events) counts[ev.severity]++

  const el = document.createElement('div')
  el.id = 'minimal-counter'
  el.innerHTML = `
    <div class="minimal-counter__label">SIGNAL COUNTS</div>
    <div class="severity--critical">[!!] CRITICAL: ${counts.CRITICAL}</div>
    <div class="severity--high">[!]  HIGH:     ${counts.HIGH}</div>
    <div class="severity--medium">[~]  MEDIUM:   ${counts.MEDIUM}</div>
    <div class="severity--low">[.]  LOW:      ${counts.LOW}</div>
  `

  // ascii-map-panel must be relative for absolute positioning of the counter
  panel.style.position = 'relative'
  panel.appendChild(el)
}

export function removeMinimalOverlay(): void {
  document.getElementById('minimal-counter')?.remove()
}
