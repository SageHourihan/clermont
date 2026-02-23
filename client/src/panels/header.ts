const BLINK_MS = 750

let blinkOn = true
let blinkHandle = 0

function formatTimestamp(date: Date): string {
  return date.toISOString().replace('T', ' ').slice(0, 16) + 'Z'
}

export function initHeader(containerId: string): void {
  const el = document.getElementById(containerId)
  if (!el) return

  const ts = formatTimestamp(new Date())
  el.innerHTML = `
    <div class="header__title">
      CLERMONT WORLD SITUATION MONITOR<span class="cursor" id="header-cursor">_</span>
    </div>
    <div class="header__meta">
      <span class="header__status">SYS: NOMINAL</span>
      <span class="header__divider"> // </span>
      <span class="header__timestamp">LAST UPDATE: <span id="last-update-ts">${ts}</span></span>
      <span id="header-mode-indicator" class="header__mode"> // MODE: DEFAULT</span>
    </div>`

  blinkHandle = window.setInterval(() => {
    blinkOn = !blinkOn
    const cursor = document.getElementById('header-cursor')
    if (cursor) cursor.classList.toggle('cursor--off', !blinkOn)
  }, BLINK_MS)
}

export function updateLastUpdate(date: Date): void {
  const el = document.getElementById('last-update-ts')
  if (el) el.textContent = formatTimestamp(date)
}

export function updateModeIndicator(mode: string): void {
  const el = document.getElementById('header-mode-indicator')
  if (el) el.textContent = ` // MODE: ${mode}`
}

export function destroyHeader(): void {
  window.clearInterval(blinkHandle)
}
