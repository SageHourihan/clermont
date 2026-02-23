import './styles/base.css';
import './styles/map.css';
import './styles/panels.css';
import './styles/keyboard.css';
import './styles/modes.css';
import { getMockEvents } from './data/mock.js';
import { initAsciiMap, updateAsciiMap, destroyAsciiMap } from './map/ascii.js';
import { openMap, setupMapControls, refreshMapMarkers } from './map/index.js';
import { initHeader, updateLastUpdate, updateModeIndicator } from './panels/header.js';
import { renderFeed } from './panels/feed.js';
import { initStatusBar, updateStatusBar, INITIAL_FEED_STATES, showModeHint, hideNavModeHint } from './panels/statusbar.js';
import { initKeyboard, updateKeyboardEvents, resetNavState } from './keyboard.js';
import { applyFilter, onFilterChange, initFilterClickHandlers } from './filter.js';
import { initDetail } from './panels/detail.js';
import { initModeBar, renderModeBar } from './panels/modebar.js';
import { renderTimeline } from './panels/timeline.js';
import { renderMetrics } from './panels/metrics.js';
import { renderMinimalOverlay, removeMinimalOverlay } from './panels/minimal.js';
import { renderWatchlist } from './panels/watchlist-panel.js';
import { initFocused, renderFocused } from './panels/focused.js';
import { getMode, setMode, onModeChange } from './modes.js';
import { reconcileWatchlist, onWatchlistChange } from './watchlist.js';
const POLL_INTERVAL_MS = 60_000;
const IDS = {
    asciiMap: 'ascii-map',
    asciiPanel: 'ascii-map-panel',
    mapOverlay: 'map-overlay',
    leafletMap: 'leaflet-map',
    geoFeed: 'geo-feed',
    envFeed: 'env-feed',
    mktFeed: 'mkt-feed',
    infFeed: 'inf-feed',
    header: 'header',
    statusbar: 'statusbar',
    modeBar: 'mode-bar',
    mainGrid: 'main-grid',
    modeContent: 'mode-content',
};
let currentEvents = [];
let currentFeedStates = INITIAL_FEED_STATES;
// ── DOM fragment cache for DEFAULT mode ───────────────────
// We save the ascii map panel + feed grid into a fragment when leaving DEFAULT
// so they can be restored cheaply without re-parsing HTML.
let _defaultFragment = null;
function ensureDefaultContent() {
    const mainGrid = document.getElementById(IDS.mainGrid);
    if (!mainGrid)
        return;
    const modeContent = document.getElementById(IDS.modeContent);
    if (!modeContent)
        return; // already in DEFAULT layout
    mainGrid.removeChild(modeContent);
    if (_defaultFragment) {
        mainGrid.appendChild(_defaultFragment);
        _defaultFragment = null;
    }
    // Re-init ascii map (ResizeObserver was disconnected)
    const asciiMap = document.getElementById(IDS.asciiMap);
    if (asciiMap) {
        initAsciiMap(asciiMap, applyFilter(currentEvents), () => {
            openMap(IDS.leafletMap, IDS.mapOverlay, currentEvents);
        });
    }
}
function ensureModeContent() {
    const mainGrid = document.getElementById(IDS.mainGrid);
    let modeContent = document.getElementById(IDS.modeContent);
    if (modeContent)
        return modeContent;
    // Disconnect ResizeObserver before detaching nodes
    destroyAsciiMap();
    // Save DEFAULT nodes into a fragment
    _defaultFragment = document.createDocumentFragment();
    while (mainGrid.firstChild) {
        _defaultFragment.appendChild(mainGrid.firstChild);
    }
    modeContent = document.createElement('div');
    modeContent.id = IDS.modeContent;
    mainGrid.appendChild(modeContent);
    return modeContent;
}
// ── Data layer ────────────────────────────────────────────
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
// ── Render for the active mode ────────────────────────────
function renderForMode() {
    const mode = getMode();
    const filtered = applyFilter(currentEvents);
    // Update data-mode attribute on main grid for CSS mode switching
    const mainGrid = document.getElementById(IDS.mainGrid);
    if (mainGrid)
        mainGrid.setAttribute('data-mode', mode);
    if (mode === 'DEFAULT' || mode === 'MINIMAL') {
        // These modes use the original DOM layout (ascii map + feed grid)
        ensureDefaultContent();
        // Re-set data-mode since ensureDefaultContent restores nodes
        if (mainGrid)
            mainGrid.setAttribute('data-mode', mode);
        const asciiMap = document.getElementById(IDS.asciiMap);
        if (asciiMap)
            updateAsciiMap(asciiMap, filtered);
        if (mode === 'DEFAULT') {
            removeMinimalOverlay();
            renderFeed(IDS.geoFeed, filtered.filter(e => e.feed === 'GEO'));
            renderFeed(IDS.envFeed, filtered.filter(e => e.feed === 'ENV'));
            renderFeed(IDS.mktFeed, filtered.filter(e => e.feed === 'MKT'));
            renderFeed(IDS.infFeed, filtered.filter(e => e.feed === 'INF'));
        }
        else {
            renderMinimalOverlay(filtered);
        }
        updateStatusBar(IDS.statusbar, currentFeedStates);
        refreshMapMarkers(filtered);
        return;
    }
    // All other modes use a single #mode-content div
    ensureModeContent();
    switch (mode) {
        case 'TIMELINE':
            renderTimeline(IDS.modeContent, filtered);
            break;
        case 'METRICS':
            renderMetrics(IDS.modeContent, filtered);
            break;
        case 'WATCHLIST':
            renderWatchlist(IDS.modeContent, currentEvents);
            break;
        case 'FOCUSED':
            renderFocused(IDS.modeContent);
            break;
    }
    updateStatusBar(IDS.statusbar, currentFeedStates);
    refreshMapMarkers(filtered);
}
// ── Refresh cycle ─────────────────────────────────────────
async function refresh() {
    const events = await fetchEvents();
    currentEvents = events;
    reconcileWatchlist(events);
    const now = new Date();
    updateLastUpdate(now);
    const geoEvents = events.filter(e => e.feed === 'GEO');
    const envEvents = events.filter(e => e.feed === 'ENV');
    const mktEvents = events.filter(e => e.feed === 'MKT');
    const infEvents = events.filter(e => e.feed === 'INF');
    updateKeyboardEvents(geoEvents, envEvents, mktEvents, infEvents);
    currentFeedStates = INITIAL_FEED_STATES.map(s => {
        const count = events.filter(e => e.feed === s.feed).length;
        return count > 0 ? { ...s, status: 'ONLINE', lastUpdate: now, eventCount: count } : s;
    });
    renderForMode();
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
    initDetail(IDS.mapOverlay, IDS.leafletMap, () => currentEvents);
    initFocused(IDS.mapOverlay, IDS.leafletMap, () => currentEvents);
    initModeBar(IDS.modeBar, setMode);
    // Re-render whenever the filter changes
    onFilterChange(renderForMode);
    // Enable clicking filter buttons in the statusbar
    initFilterClickHandlers();
    // Re-render on mode change
    onModeChange((mode, _prev) => {
        // Clean up MINIMAL overlay when leaving MINIMAL to a non-MINIMAL mode
        if (_prev === 'MINIMAL' && mode !== 'MINIMAL')
            removeMinimalOverlay();
        resetNavState();
        renderForMode();
        renderModeBar(IDS.modeBar, mode);
        updateModeIndicator(mode);
        if (mode !== 'DEFAULT') {
            showModeHint(mode);
        }
        else {
            hideNavModeHint();
        }
    });
    // Re-render watchlist/focused when pins change
    onWatchlistChange(() => {
        const mode = getMode();
        if (mode === 'WATCHLIST' || mode === 'FOCUSED') {
            renderForMode();
        }
    });
    // First load
    refresh();
    // Polling loop
    setInterval(refresh, POLL_INTERVAL_MS);
}
// `type="module"` scripts execute after the DOM is parsed
init();
