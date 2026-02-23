const BUTTONS = [
    { mode: 'DEFAULT', label: '[1] DEFAULT' },
    { mode: 'TIMELINE', label: '[T] TIMELINE' },
    { mode: 'METRICS', label: '[X] METRICS' },
    { mode: 'MINIMAL', label: '[Q] MINIMAL' },
    { mode: 'WATCHLIST', label: '[W] WATCHLIST' },
];
export function initModeBar(containerId, onSelect) {
    const el = document.getElementById(containerId);
    if (!el)
        return;
    el.innerHTML = BUTTONS.map(b => `<button class="mode-btn" data-mode="${b.mode}">${b.label}</button>`).join('');
    // Event delegation
    el.addEventListener('click', (e) => {
        const btn = e.target.closest('.mode-btn');
        if (!btn)
            return;
        const mode = btn.getAttribute('data-mode');
        if (mode)
            onSelect(mode);
    });
}
export function renderModeBar(containerId, activeMode) {
    const el = document.getElementById(containerId);
    if (!el)
        return;
    el.querySelectorAll('.mode-btn').forEach(btn => {
        const mode = btn.getAttribute('data-mode');
        btn.classList.toggle('mode-btn--active', mode === activeMode);
    });
}
