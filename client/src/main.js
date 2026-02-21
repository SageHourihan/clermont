import './styles/base.css';
import './styles/map.css';
import './styles/panels.css';
import { getMockEvents } from './data/mock.js';
import { initAsciiMap, updateAsciiMap } from './map/ascii.js';
import { openMap, setupMapControls, refreshMapMarkers } from './map/index.js';
import { initHeader, updateLastUpdate } from './panels/header.js';
import { renderFeed } from './panels/feed.js';
import { initStatusBar, updateStatusBar, INITIAL_FEED_STATES } from './panels/statusbar.js';
const POLL_INTERVAL_MS = 60_000;
const IDS = {
    asciiMap: 'ascii-map',
    mapOverlay: 'map-overlay',
    leafletMap: 'leaflet-map',
    geoFeed: 'geo-feed',
    header: 'header',
    statusbar: 'statusbar',
};
let currentEvents = [];
// ── Data layer ────────────────────────────────────────────
// MOCK MODE — swap for the fetch block below when the backend is ready
async function fetchEvents() {
    return getMockEvents('GEO');
    // LIVE MODE (uncomment when backend is ready):
    // try {
    //   const res = await fetch('/api/events?feed=GEO')
    //   if (!res.ok) throw new Error(`HTTP ${res.status}`)
    //   return res.json()
    // } catch (err) {
    //   console.warn('[CLERMONT] API fetch failed, using mock data', err)
    //   return getMockEvents('GEO')
    // }
}
// ── Refresh cycle ─────────────────────────────────────────
async function refresh() {
    const events = await fetchEvents();
    currentEvents = events;
    const now = new Date();
    updateLastUpdate(now);
    const asciiMap = document.getElementById(IDS.asciiMap);
    if (asciiMap)
        updateAsciiMap(asciiMap, events);
    renderFeed(IDS.geoFeed, events);
    const feedStates = INITIAL_FEED_STATES.map(s => s.feed === 'GEO'
        ? { ...s, lastUpdate: now, eventCount: events.length }
        : s);
    updateStatusBar(IDS.statusbar, feedStates);
    refreshMapMarkers(events);
}
// ── Init ──────────────────────────────────────────────────
function init() {
    initHeader(IDS.header);
    initStatusBar(IDS.statusbar, INITIAL_FEED_STATES);
    const asciiMap = document.getElementById(IDS.asciiMap);
    if (asciiMap) {
        initAsciiMap(asciiMap, [], () => {
            openMap(IDS.leafletMap, IDS.mapOverlay, currentEvents);
        });
    }
    setupMapControls(IDS.mapOverlay);
    // First load
    refresh();
    // Polling loop
    setInterval(refresh, POLL_INTERVAL_MS);
}
// `type="module"` scripts execute after the DOM is parsed
init();
