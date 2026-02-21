const SEVERITY_LABEL = {
    CRITICAL: '[!!] CRITICAL',
    HIGH: '[!]  HIGH',
    MEDIUM: '[~]  MEDIUM',
    LOW: '[.]  LOW',
};
// Track which event IDs have already been rendered so only new ones animate
const displayedIds = new Set();
function formatTimestamp(date) {
    return new Date(date).toISOString().replace('T', ' ').slice(0, 16) + 'Z';
}
function renderEventRow(event) {
    const ts = formatTimestamp(event.timestamp);
    const sevClass = `severity--${event.severity.toLowerCase()}`;
    const titleEl = event.url
        ? `<a class="event__title ${sevClass}" href="${event.url}" target="_blank" rel="noopener">${event.title}</a>`
        : `<span class="event__title ${sevClass}">${event.title}</span>`;
    return `<div class="event-row" data-id="${event.id}">
    <div class="event__header">
      <span class="event__feed">[${event.feed}]</span>
      <span class="event__timestamp">${ts}</span>
    </div>
    ${titleEl}
    <div class="event__meta">
      <span class="event__severity ${sevClass}">${SEVERITY_LABEL[event.severity]}</span>
      <span class="event__source"> // ${event.source}</span>
    </div>
    <div class="event__divider">----------------------------------------</div>
  </div>`;
}
// Fade + slide-in reveal on a row element
function revealRow(el, delayMs) {
    el.style.opacity = '0';
    el.style.transform = 'translateX(-6px)';
    el.style.transition = 'none';
    setTimeout(() => {
        el.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateX(0)';
    }, delayMs);
}
export function renderFeed(containerId, events) {
    const container = document.getElementById(containerId);
    if (!container)
        return;
    const sorted = [...events].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const newIds = sorted.filter(e => !displayedIds.has(e.id)).map(e => e.id);
    container.innerHTML = sorted.map(renderEventRow).join('');
    sorted.forEach(e => displayedIds.add(e.id));
    // Animate new rows with a staggered reveal
    newIds.forEach((id, index) => {
        const row = container.querySelector(`[data-id="${id}"]`);
        if (row)
            revealRow(row, index * 80);
    });
}
export function clearFeed(containerId) {
    const container = document.getElementById(containerId);
    if (container)
        container.innerHTML = '';
    displayedIds.clear();
}
