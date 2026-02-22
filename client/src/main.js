import './styles/base.css';
import './styles/map.css';
import './styles/panels.css';
import './styles/keyboard.css';
import { getMockEvents } from './data/mock.js';
import { initAsciiMap, updateAsciiMap } from './map/ascii.js';
import { openMap, setupMapControls, refreshMapMarkers } from './map/index.js';
import { initHeader, updateLastUpdate } from './panels/header.js';
import { renderFeed } from './panels/feed.js';
import { initStatusBar, updateStatusBar, INITIAL_FEED_STATES } from './panels/statusbar.js';
import { initKeyboard, updateKeyboardEvents } from './keyboard.js';
import { applyFilter, onFilterChange, initFilterClickHandlers } from './filter.js';
const POLL_INTERVAL_MS = 60_000;
const IDS = {
    asciiMap: 'ascii-map',
    mapOverlay: 'map-overlay',
    leafletMap: 'leaflet-map',
    geoFeed: 'geo-feed',
    envFeed: 'env-feed',
    mktFeed: 'mkt-feed',
    infFeed: 'inf-feed',
    header: 'header',
    statusbar: 'statusbar',
};
let currentEvents = [];
let currentFeedStates = INITIAL_FEED_STATES;
// ── Data layer ────────────────────────────────────────────
// MOCK MODE — swap for fetch calls below when the backend is ready
async function fetchEvents() {
    return getMockEvents();
    // LIVE MODE (uncomment when backend is ready):
    // try {
    //   const res = await fetch('/api/events')
    //   if (!res.ok) throw new Error(`HTTP ${res.status}`)
    //   return res.json()
    // } catch (err) {
    //   console.warn('[CLERMONT] API fetch failed, using mock data', err)
    //   return getMockEvents()
    // }
}
// ── Render with current filter ────────────────────────────
// Called on both polling refresh and filter state change.
function applyCurrentFilter() {
    const filtered = applyFilter(currentEvents);
    const asciiMap = document.getElementById(IDS.asciiMap);
    if (asciiMap)
        updateAsciiMap(asciiMap, filtered);
    renderFeed(IDS.geoFeed, filtered.filter(e => e.feed === 'GEO'));
    renderFeed(IDS.envFeed, filtered.filter(e => e.feed === 'ENV'));
    renderFeed(IDS.mktFeed, filtered.filter(e => e.feed === 'MKT'));
    renderFeed(IDS.infFeed, filtered.filter(e => e.feed === 'INF'));
    updateStatusBar(IDS.statusbar, currentFeedStates);
    refreshMapMarkers(filtered);
}
// ── Refresh cycle ─────────────────────────────────────────
async function refresh() {
    const events = await fetchEvents();
    currentEvents = events;
    const now = new Date();
    updateLastUpdate(now);
    // Update keyboard nav snapshot from unfiltered events so j/k always
    // navigates the full dataset regardless of what filter is active.
    const geoEvents = events.filter(e => e.feed === 'GEO');
    const envEvents = events.filter(e => e.feed === 'ENV');
    const mktEvents = events.filter(e => e.feed === 'MKT');
    const infEvents = events.filter(e => e.feed === 'INF');
    updateKeyboardEvents(geoEvents, envEvents, mktEvents, infEvents);
    currentFeedStates = INITIAL_FEED_STATES.map(s => {
        const count = events.filter(e => e.feed === s.feed).length;
        return count > 0 ? { ...s, status: 'ONLINE', lastUpdate: now, eventCount: count } : s;
    });
    applyCurrentFilter();
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
    initKeyboard(IDS.mapOverlay, IDS.leafletMap, () => applyFilter(currentEvents));
    // Re-render feeds + map + statusbar whenever the filter changes
    onFilterChange(applyCurrentFilter);
    // Enable clicking filter buttons in the statusbar
    initFilterClickHandlers();
    // First load
    refresh();
    // Polling loop
    setInterval(refresh, POLL_INTERVAL_MS);
}
// `type="module"` scripts execute after the DOM is parsed
init();
