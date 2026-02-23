import { openMap, flyToEvent } from '../map/index.js';
import { togglePin, isPinned } from '../watchlist.js';
import { setFocusedEvent } from './focused.js';
import { setMode } from '../modes.js';
// ── State ─────────────────────────────────────────────────
let _currentEvent = null;
let _overlayId = '';
let _leafletContainerId = '';
let _getAllEvents = () => [];
// ── Helpers ───────────────────────────────────────────────
const SEVERITY_LABEL = {
    CRITICAL: '[!!] CRITICAL',
    HIGH: '[!]  HIGH',
    MEDIUM: '[~]  MEDIUM',
    LOW: '[.]  LOW',
};
function formatTimestamp(date) {
    return new Date(date).toISOString().replace('T', ' ').slice(0, 16) + 'Z';
}
function formatCoords(lat, lng) {
    const latStr = `${Math.abs(lat).toFixed(2)}\u00b0${lat >= 0 ? 'N' : 'S'}`;
    const lngStr = `${Math.abs(lng).toFixed(2)}\u00b0${lng >= 0 ? 'E' : 'W'}`;
    return `${latStr}  ${lngStr}`;
}
// ── Render ────────────────────────────────────────────────
function renderBody(event) {
    const ts = formatTimestamp(event.timestamp);
    const sevClass = `severity--${event.severity.toLowerCase()}`;
    const coords = formatCoords(event.lat, event.lng);
    const urlLine = event.url
        ? `<a class="detail__url" href="${event.url}" target="_blank" rel="noopener">${event.url}</a>`
        : `<span class="detail__url detail__url--none">N/A</span>`;
    return `
    <div class="detail__header-bar">
      <span class="detail__feed">[${event.feed}]</span>
      <span class="detail__ts">${ts}</span>
    </div>
    <div class="detail__divider">\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550</div>
    <div class="detail__title ${sevClass}">${event.title}</div>
    <div class="detail__divider">----------------------------------------</div>
    <table class="detail__fields">
      <tr>
        <td class="detail__field-label">SEVERITY</td>
        <td class="detail__field-value ${sevClass}">${SEVERITY_LABEL[event.severity]}</td>
      </tr>
      <tr>
        <td class="detail__field-label">SOURCE</td>
        <td class="detail__field-value">${event.source}</td>
      </tr>
      <tr>
        <td class="detail__field-label">COORDS</td>
        <td class="detail__field-value">${coords}</td>
      </tr>
      <tr>
        <td class="detail__field-label">URL</td>
        <td class="detail__field-value">${urlLine}</td>
      </tr>
    </table>
    <div class="detail__divider">----------------------------------------</div>
    <div class="detail__actions">
      <button class="detail__action-btn" id="detail-map-btn">[M] OPEN MAP</button>
      <button class="detail__action-btn" id="detail-watch-btn">[W] WATCH</button>
      <button class="detail__action-btn" id="detail-focus-btn">[F] FOCUS</button>
      <button class="detail__action-btn" id="detail-close-btn">[ESC] CLOSE</button>
    </div>
  `;
}
// ── Public API ────────────────────────────────────────────
export function isDetailOpen() {
    return _currentEvent !== null;
}
export function getCurrentDetailEvent() {
    return _currentEvent;
}
export function openDetail(event) {
    _currentEvent = event;
    const el = document.getElementById('event-detail');
    if (!el)
        return;
    el.innerHTML = `
    <div class="detail__label">// SIGNAL DETAIL</div>
    <div class="detail__body">${renderBody(event)}</div>
  `;
    el.classList.remove('event-detail--hidden');
    // Sync watch button state
    const watchBtn = document.getElementById('detail-watch-btn');
    if (watchBtn) {
        const pinned = isPinned(event.id);
        watchBtn.textContent = pinned ? '[W] UNWATCH' : '[W] WATCH';
        watchBtn.classList.toggle('detail__action-btn--active', pinned);
        watchBtn.addEventListener('click', () => {
            const nowPinned = togglePin(event.id);
            watchBtn.textContent = nowPinned ? '[W] UNWATCH' : '[W] WATCH';
            watchBtn.classList.toggle('detail__action-btn--active', nowPinned);
        });
    }
    document.getElementById('detail-focus-btn')
        ?.addEventListener('click', () => {
        setFocusedEvent(event);
        closeDetail();
        setMode('FOCUSED');
    });
    document.getElementById('detail-map-btn')
        ?.addEventListener('click', flyCurrentToMap);
    document.getElementById('detail-close-btn')
        ?.addEventListener('click', closeDetail);
}
export function closeDetail() {
    _currentEvent = null;
    document.getElementById('event-detail')
        ?.classList.add('event-detail--hidden');
}
export function flyCurrentToMap() {
    if (!_currentEvent)
        return;
    const event = _currentEvent;
    closeDetail();
    openMap(_leafletContainerId, _overlayId, _getAllEvents());
    flyToEvent(event);
}
// ── Init ──────────────────────────────────────────────────
export function initDetail(overlayId, leafletContainerId, getAllEvents) {
    _overlayId = overlayId;
    _leafletContainerId = leafletContainerId;
    _getAllEvents = getAllEvents;
    // Click delegation on event rows — skip if user clicked the title link
    document.addEventListener('click', (e) => {
        const target = e.target;
        if (target.tagName === 'A')
            return;
        const row = target.closest('.event-row');
        if (!row)
            return;
        const id = row.getAttribute('data-id');
        if (!id)
            return;
        const event = _getAllEvents().find(ev => ev.id === id);
        if (event)
            openDetail(event);
    });
}
