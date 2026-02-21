import L from 'leaflet';
const SEVERITY_COLOR = {
    CRITICAL: 'var(--severity-critical)',
    HIGH: 'var(--severity-high)',
    MEDIUM: 'var(--severity-medium)',
    LOW: 'var(--severity-low)',
};
function createMarkerIcon(event) {
    const color = SEVERITY_COLOR[event.severity];
    return L.divIcon({
        className: 'event-marker-wrapper',
        html: `<div class="event-marker" style="--marker-color:${color}">
      <span class="event-marker__blip"></span>
      <span class="event-marker__label">[${event.feed}]</span>
    </div>`,
        iconSize: [36, 16],
        iconAnchor: [18, 8],
        popupAnchor: [0, -12],
    });
}
function createPopupContent(event) {
    const ts = new Date(event.timestamp).toISOString().replace('T', ' ').slice(0, 16) + 'Z';
    const urlLine = event.url
        ? `<a class="popup__url" href="${event.url}" target="_blank" rel="noopener">SOURCE &#x2192;</a>`
        : '';
    return `<div class="event-popup">
    <div class="popup__feed">[${event.feed}] ${event.severity}</div>
    <div class="popup__title">${event.title}</div>
    <div class="popup__meta">${ts} // ${event.source}</div>
    ${urlLine}
  </div>`;
}
export function createEventMarker(event) {
    const marker = L.marker([event.lat, event.lng], {
        icon: createMarkerIcon(event),
    });
    marker.bindPopup(createPopupContent(event), {
        className: 'event-popup-container',
        maxWidth: 300,
        minWidth: 200,
    });
    return marker;
}
export function buildMarkerLayer(events) {
    const group = L.layerGroup();
    for (const event of events) {
        createEventMarker(event).addTo(group);
    }
    return group;
}
