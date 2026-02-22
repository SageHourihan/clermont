import L from 'leaflet';
import { buildMarkerLayer } from './markers.js';
// CartoDB Dark Matter — no API key required
const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com">CARTO</a>';
const state = {
    map: null,
    markerLayer: null,
    isVisible: false,
};
function initLeafletMap(containerId) {
    const map = L.map(containerId, {
        center: [20, 10],
        zoom: 2,
        minZoom: 2,
        maxZoom: 8,
        zoomControl: true,
        attributionControl: true,
    });
    L.tileLayer(TILE_URL, {
        attribution: TILE_ATTRIBUTION,
        subdomains: 'abcd',
        maxZoom: 19,
    }).addTo(map);
    return map;
}
export function openMap(containerId, overlayId, events) {
    const overlay = document.getElementById(overlayId);
    if (!overlay)
        return;
    // Lazy init: create the map on first open only
    if (!state.map) {
        state.map = initLeafletMap(containerId);
    }
    // Swap marker layer
    if (state.markerLayer) {
        state.markerLayer.remove();
    }
    state.markerLayer = buildMarkerLayer(events);
    state.markerLayer.addTo(state.map);
    overlay.classList.remove('map-overlay--hidden');
    overlay.classList.add('map-overlay--visible');
    state.isVisible = true;
    // Critical: invalidate Leaflet's size after overlay becomes visible.
    // Without this, tiles render into a 0x0 viewport.
    requestAnimationFrame(() => {
        state.map?.invalidateSize();
    });
    document.getElementById('map-close')?.focus();
}
export function closeMap(overlayId) {
    const overlay = document.getElementById(overlayId);
    if (!overlay)
        return;
    overlay.classList.add('map-overlay--hidden');
    overlay.classList.remove('map-overlay--visible');
    state.isVisible = false;
}
export function flyToEvent(event) {
    if (!state.map)
        return;
    requestAnimationFrame(() => {
        state.map?.flyTo([event.lat, event.lng], 5, { animate: true, duration: 1.2 });
    });
}
// Called by the polling loop when new data arrives
export function refreshMapMarkers(events) {
    if (!state.map || !state.isVisible)
        return;
    if (state.markerLayer) {
        state.markerLayer.remove();
    }
    state.markerLayer = buildMarkerLayer(events);
    state.markerLayer.addTo(state.map);
}
// Wire up close controls. Call once during app init.
export function setupMapControls(overlayId) {
    const closeBtn = document.getElementById('map-close');
    closeBtn?.addEventListener('click', () => closeMap(overlayId));
    // Click on overlay background (not the map container itself) closes it
    const overlay = document.getElementById(overlayId);
    overlay?.addEventListener('click', (e) => {
        if (e.target === overlay)
            closeMap(overlayId);
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && state.isVisible) {
            closeMap(overlayId);
        }
    });
}
