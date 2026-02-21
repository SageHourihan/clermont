import { feature } from 'topojson-client';
import worldTopo from './world-110m.json';
// ── Grid & canvas dimensions ─────────────────────────────────────────────────
//
// Each Braille character represents a 2×4 pixel block.
// MAP_COLS × MAP_ROWS characters → (MAP_COLS*2) × (MAP_ROWS*4) canvas pixels.
//
const MAP_COLS = 120;
const MAP_ROWS = 36;
const PX_W = MAP_COLS * 2; // 240
const PX_H = MAP_ROWS * 4; // 144
// ── Braille bit encoding ─────────────────────────────────────────────────────
//
// Unicode Braille block (U+2800–U+28FF) encodes a 2×4 dot grid:
//
//   col 0, row 0 → bit 0   col 1, row 0 → bit 3
//   col 0, row 1 → bit 1   col 1, row 1 → bit 4
//   col 0, row 2 → bit 2   col 1, row 2 → bit 5
//   col 0, row 3 → bit 6   col 1, row 3 → bit 7
//
const BRAILLE_BIT = [
    // col 0       col 1
    [1 << 0, 1 << 3], // row 0
    [1 << 1, 1 << 4], // row 1
    [1 << 2, 1 << 5], // row 2
    [1 << 6, 1 << 7], // row 3
];
// ── Severity → blip character ────────────────────────────────────────────────
const SEVERITY_BLIP = {
    CRITICAL: '!',
    HIGH: '*',
    MEDIUM: '+',
    LOW: '~',
};
const SEVERITY_RANK = {
    CRITICAL: 4,
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1,
};
// ── Cached land render ───────────────────────────────────────────────────────
// Land pixels are static — we render them once and cache the char grid.
let _landGrid = null;
function buildLandGrid() {
    if (_landGrid)
        return _landGrid;
    const topo = worldTopo;
    const landFeature = feature(topo, topo.objects.land);
    // Render to offscreen canvas
    const canvas = new OffscreenCanvas(PX_W, PX_H);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, PX_W, PX_H);
    // Draw land polygons using equirectangular projection
    ctx.fillStyle = 'white';
    function drawRing(ring) {
        if (ring.length < 2)
            return;
        ctx.beginPath();
        const [lng0, lat0] = ring[0];
        ctx.moveTo(((lng0 + 180) / 360) * PX_W, ((90 - lat0) / 180) * PX_H);
        for (let i = 1; i < ring.length; i++) {
            const [lng, lat] = ring[i];
            ctx.lineTo(((lng + 180) / 360) * PX_W, ((90 - lat) / 180) * PX_H);
        }
        ctx.closePath();
        ctx.fill('evenodd');
    }
    function drawGeometry(geom) {
        if (geom.type === 'Polygon') {
            for (const ring of geom.coordinates)
                drawRing(ring);
        }
        else if (geom.type === 'MultiPolygon') {
            for (const poly of geom.coordinates) {
                for (const ring of poly)
                    drawRing(ring);
            }
        }
        else if (geom.type === 'GeometryCollection') {
            for (const g of geom.geometries)
                drawGeometry(g);
        }
    }
    if ('type' in landFeature && landFeature.type === 'FeatureCollection') {
        for (const f of landFeature.features) {
            if (f.geometry)
                drawGeometry(f.geometry);
        }
    }
    else if ('geometry' in landFeature) {
        const geomFeature = landFeature;
        if (geomFeature.geometry)
            drawGeometry(geomFeature.geometry);
    }
    // Read pixel data
    const imageData = ctx.getImageData(0, 0, PX_W, PX_H);
    const pixels = imageData.data; // RGBA, row-major
    function isLand(px, py) {
        const idx = (py * PX_W + px) * 4;
        return pixels[idx] > 128; // red channel > 128 = white = land
    }
    // Convert pixel grid → Braille char grid
    const grid = [];
    for (let charRow = 0; charRow < MAP_ROWS; charRow++) {
        const row = [];
        for (let charCol = 0; charCol < MAP_COLS; charCol++) {
            const baseX = charCol * 2;
            const baseY = charRow * 4;
            let bits = 0;
            for (let dy = 0; dy < 4; dy++) {
                for (let dx = 0; dx < 2; dx++) {
                    if (isLand(baseX + dx, baseY + dy)) {
                        bits |= BRAILLE_BIT[dy][dx];
                    }
                }
            }
            row.push(String.fromCodePoint(0x2800 + bits));
        }
        grid.push(row);
    }
    _landGrid = grid;
    return grid;
}
// ── Equirectangular projection → char cell ───────────────────────────────────
function project(lat, lng) {
    const col = Math.floor(((lng + 180) / 360) * MAP_COLS);
    const row = Math.floor(((90 - lat) / 180) * MAP_ROWS);
    return {
        col: Math.max(0, Math.min(MAP_COLS - 1, col)),
        row: Math.max(0, Math.min(MAP_ROWS - 1, row)),
    };
}
// ── Blip map ─────────────────────────────────────────────────────────────────
function buildBlipMap(events) {
    const blips = new Map();
    for (const event of events) {
        const { col, row } = project(event.lat, event.lng);
        const key = `${row},${col}`;
        const rank = SEVERITY_RANK[event.severity];
        const existing = blips.get(key);
        if (!existing || rank > existing.rank) {
            blips.set(key, {
                char: SEVERITY_BLIP[event.severity],
                severity: event.severity,
                rank,
            });
        }
    }
    const result = new Map();
    blips.forEach((v, k) => result.set(k, { char: v.char, severity: v.severity }));
    return result;
}
// ── HTML render ──────────────────────────────────────────────────────────────
//
// Braille land chars are output as plain text — they inherit .ascii-map color.
// Empty Braille ⠀ (U+2800) = ocean = invisible against dark background.
// Only blip positions get <span> elements for per-severity coloring.
//
export function renderAsciiMap(events) {
    const grid = buildLandGrid();
    const blipMap = buildBlipMap(events);
    const lines = [];
    for (let rowIndex = 0; rowIndex < MAP_ROWS; rowIndex++) {
        let line = '';
        for (let colIndex = 0; colIndex < MAP_COLS; colIndex++) {
            const key = `${rowIndex},${colIndex}`;
            const blip = blipMap.get(key);
            if (blip) {
                line += `<span class="blip blip--${blip.severity.toLowerCase()}">${blip.char}</span>`;
            }
            else {
                line += grid[rowIndex][colIndex];
            }
        }
        lines.push(line);
    }
    return lines.join('\n');
}
// ── Public API ───────────────────────────────────────────────────────────────
export function initAsciiMap(container, events, onExpand) {
    container.innerHTML = renderAsciiMap(events);
    const panel = container.closest('[role="button"]');
    if (panel) {
        panel.addEventListener('click', onExpand);
        panel.addEventListener('keydown', (e) => {
            const key = e.key;
            if (key === 'Enter' || key === ' ') {
                e.preventDefault();
                onExpand();
            }
        });
    }
}
export function updateAsciiMap(container, events) {
    container.innerHTML = renderAsciiMap(events);
}
