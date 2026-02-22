import { openMap, flyToEvent } from './map/index.js';
import { showNavModeHint, showFilterModeHint, hideNavModeHint } from './panels/statusbar.js';
import { isFilterMode, enterFilterMode, exitFilterMode, toggleSeverity, resetFilter, } from './filter.js';
const PANEL_ORDER = ['GEO', 'ENV', 'MKT', 'INF'];
const FEED_CONTAINER_IDS = {
    GEO: 'geo-feed',
    ENV: 'env-feed',
    MKT: 'mkt-feed',
    INF: 'inf-feed',
};
const state = {
    active: false,
    panelIndex: 0,
    rowIndex: -1,
    events: { GEO: [], ENV: [], MKT: [], INF: [] },
    overlayId: '',
    leafletContainerId: '',
    getAllEvents: () => [],
};
function sortedDesc(events) {
    return [...events].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}
function clearAllFocusStyles() {
    document.querySelectorAll('.event-row--focused').forEach(el => {
        el.classList.remove('event-row--focused');
    });
    document.querySelectorAll('.panel__label--panel-focused').forEach(el => {
        el.classList.remove('panel__label--panel-focused');
    });
}
function applyFocusToRow(panelIndex, rowIndex) {
    clearAllFocusStyles();
    const feed = PANEL_ORDER[panelIndex];
    const container = document.getElementById(FEED_CONTAINER_IDS[feed]);
    if (!container)
        return;
    // Panel label highlight
    container.closest('.panel--feed')
        ?.querySelector('.panel__label')
        ?.classList.add('panel__label--panel-focused');
    // Row highlight
    const rows = container.querySelectorAll('.event-row');
    const row = rows[rowIndex];
    if (!row)
        return;
    row.classList.add('event-row--focused');
    row.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}
function enterNavMode() {
    state.active = true;
    showNavModeHint();
}
function moveFocusRow(delta) {
    const feed = PANEL_ORDER[state.panelIndex];
    const maxIndex = Math.max(0, state.events[feed].length - 1);
    state.rowIndex = Math.max(0, Math.min(maxIndex, state.rowIndex + delta));
    applyFocusToRow(state.panelIndex, state.rowIndex);
}
function moveFocusPanel(delta) {
    state.panelIndex = (state.panelIndex + delta + PANEL_ORDER.length) % PANEL_ORDER.length;
    state.rowIndex = 0;
    applyFocusToRow(state.panelIndex, state.rowIndex);
}
function jumpToPanel(index) {
    if (!state.active)
        enterNavMode();
    state.panelIndex = index;
    state.rowIndex = 0;
    applyFocusToRow(state.panelIndex, state.rowIndex);
}
function jumpToFirstRow() {
    state.rowIndex = 0;
    applyFocusToRow(state.panelIndex, state.rowIndex);
}
function jumpToLastRow() {
    const feed = PANEL_ORDER[state.panelIndex];
    state.rowIndex = Math.max(0, state.events[feed].length - 1);
    applyFocusToRow(state.panelIndex, state.rowIndex);
}
function activateSelectedEvent() {
    const feed = PANEL_ORDER[state.panelIndex];
    const event = state.events[feed][state.rowIndex];
    if (!event)
        return;
    openMap(state.leafletContainerId, state.overlayId, state.getAllEvents());
    flyToEvent(event);
}
function doExitFilterMode() {
    exitFilterMode();
    hideNavModeHint();
    // Remove active highlight from filter bar
    document.getElementById('filter-bar')?.classList.remove('statusbar__filter--active');
}
function doEnterFilterMode() {
    enterFilterMode();
    showFilterModeHint();
    document.getElementById('filter-bar')?.classList.add('statusbar__filter--active');
}
export function initKeyboard(overlayId, leafletContainerId, getAllEvents) {
    state.overlayId = overlayId;
    state.leafletContainerId = leafletContainerId;
    state.getAllEvents = getAllEvents;
    document.addEventListener('keydown', (e) => {
        const active = document.activeElement;
        if (active && active !== document.body &&
            ['INPUT', 'TEXTAREA', 'SELECT'].includes(active.tagName))
            return;
        const mapOpen = document.getElementById(state.overlayId)
            ?.classList.contains('map-overlay--visible') ?? false;
        // ── Filter mode: intercepts c/h/m/l/a/Escape/f ────────
        if (isFilterMode()) {
            switch (e.key) {
                case 'c':
                    e.preventDefault();
                    toggleSeverity('CRITICAL');
                    return;
                case 'h':
                    e.preventDefault();
                    toggleSeverity('HIGH');
                    return;
                case 'm':
                    e.preventDefault();
                    toggleSeverity('MEDIUM');
                    return;
                case 'l':
                    e.preventDefault();
                    toggleSeverity('LOW');
                    return;
                case 'a':
                    e.preventDefault();
                    resetFilter();
                    return;
                case 'f':
                case 'Escape':
                    e.preventDefault();
                    doExitFilterMode();
                    return;
            }
            // All other keys pass through while in filter mode
            return;
        }
        // ── Normal / nav mode ──────────────────────────────────
        switch (e.key) {
            case 'f':
                if (mapOpen || state.active)
                    return; // no filter mode while nav or map open
                e.preventDefault();
                doEnterFilterMode();
                break;
            case 'j':
            case 'ArrowDown':
                e.preventDefault();
                if (!state.active)
                    enterNavMode();
                moveFocusRow(+1);
                break;
            case 'k':
            case 'ArrowUp':
                e.preventDefault();
                if (!state.active)
                    enterNavMode();
                moveFocusRow(-1);
                break;
            case 'h':
            case 'ArrowLeft':
                if (mapOpen)
                    return;
                e.preventDefault();
                if (!state.active)
                    enterNavMode();
                moveFocusPanel(-1);
                break;
            case 'l':
            case 'ArrowRight':
                if (mapOpen)
                    return;
                e.preventDefault();
                if (!state.active)
                    enterNavMode();
                moveFocusPanel(+1);
                break;
            case '1':
                jumpToPanel(0);
                break;
            case '2':
                jumpToPanel(1);
                break;
            case '3':
                jumpToPanel(2);
                break;
            case '4':
                jumpToPanel(3);
                break;
            case 'g':
                if (!state.active)
                    return;
                e.preventDefault();
                jumpToFirstRow();
                break;
            case 'G':
                if (!state.active)
                    return;
                e.preventDefault();
                jumpToLastRow();
                break;
            case 'Enter':
            case 'o':
                if (!state.active || mapOpen)
                    return;
                e.preventDefault();
                activateSelectedEvent();
                break;
            case 'Escape':
                if (mapOpen)
                    return; // map/index.ts handles this
                if (state.active) {
                    clearAllFocusStyles();
                    state.active = false;
                    hideNavModeHint();
                }
                break;
        }
    });
}
// Called from main.ts refresh() after all four renderFeed() calls.
// Keeps the sorted event snapshot in sync and re-applies focus after re-renders.
export function updateKeyboardEvents(geo, env, mkt, inf) {
    state.events.GEO = sortedDesc(geo);
    state.events.ENV = sortedDesc(env);
    state.events.MKT = sortedDesc(mkt);
    state.events.INF = sortedDesc(inf);
    if (!state.active)
        return;
    // renderFeed() just wiped innerHTML — re-apply focus after it commits
    const feed = PANEL_ORDER[state.panelIndex];
    state.rowIndex = Math.min(state.rowIndex, Math.max(0, state.events[feed].length - 1));
    requestAnimationFrame(() => applyFocusToRow(state.panelIndex, state.rowIndex));
}
