const MAP_WIDTH = 78;
const MAP_HEIGHT = 24;
// Hand-crafted 78x24 ASCII world map using equirectangular projection.
// '#' = land, '.' = ocean.
// Each cell = ~4.6° longitude x ~7.5° latitude.
// Continents are approximate — accuracy is secondary to readability.
const BASE_MAP = [
    '..............................................................................', // row 0  ~90°N
    '.........####..................###..............................................', // row 1  ~82°N
    '....#####.####..............#####.##.##............##......................###.', // row 2  ~75°N
    '...######.######...........##########.####.....#####......................####.', // row 3  ~67°N
    '...#######.######.........############.####...######...................#######.', // row 4  ~60°N
    '...######..#####...........###########.#####.########.................########', // row 5  ~52°N
    '....####...####.............##########.######.#######...............########.', // row 6  ~45°N
    '.....##....###...............########..#####..#######..............#######...', // row 7  ~37°N
    '......#.....##................########.#####.########...............######....', // row 8  ~30°N
    '.................#########...######.#.####.########.####......#####.##......', // row 9  ~22°N
    '................##########...####..#.#####.#######.######....######.##......', // row 10 ~15°N
    '.................#########....###...####..#######..######...#######.........', // row 11  ~7°N
    '...................######......###...####.######....#####...#######..........', // row 12   0° equator
    '...................#####.......###...###..####.......####..######...........', // row 13  ~7°S
    '...................####........###....##..###.........###..#####............', // row 14 ~15°S
    '....................###.........##.....#...##..........###..####.............', // row 15 ~22°S
    '....................###.........###....#...##..........###...###.............', // row 16 ~30°S
    '....................##..........##.....#...#...........###....##.............', // row 17 ~37°S
    '....................#...........#.................#.....##....##.............', // row 18 ~45°S
    '....................##..........#..............###.....##.....#..............', // row 19 ~52°S
    '.....................#..........#..............##.......#.....#..............', // row 20 ~60°S
    '....................................................................................', // row 21 ~67°S (ocean/Antarctic)
    '.........................###.............................###....................', // row 22 ~75°S Antarctica
    '.....................###########....................###########.................', // row 23 ~82°S Antarctica
];
// Severity → blip character
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
// Equirectangular projection: lat/lng → (col, row) in the ASCII grid
function project(lat, lng) {
    const col = Math.floor(((lng + 180) / 360) * MAP_WIDTH);
    const row = Math.floor(((90 - lat) / 180) * MAP_HEIGHT);
    return {
        col: Math.max(0, Math.min(MAP_WIDTH - 1, col)),
        row: Math.max(0, Math.min(MAP_HEIGHT - 1, row)),
    };
}
// Build a map of grid key → { char, severity } for all events.
// When multiple events land on the same cell, highest severity wins.
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
// Renders the ASCII map as an HTML string.
// Ocean dots are plain text. Land '#' gets a .land span.
// Blips get .blip.blip--<severity> spans for color.
export function renderAsciiMap(events) {
    const blipMap = buildBlipMap(events);
    const lines = BASE_MAP.map((line, rowIndex) => {
        const chars = line.split('');
        const rendered = chars.map((ch, colIndex) => {
            const key = `${rowIndex},${colIndex}`;
            const blip = blipMap.get(key);
            if (blip) {
                return `<span class="blip blip--${blip.severity.toLowerCase()}">${blip.char}</span>`;
            }
            if (ch === '#')
                return `<span class="land">${ch}</span>`;
            return ch;
        });
        return rendered.join('');
    });
    return lines.join('\n');
}
// Mounts the ASCII map into the container element and wires the expand handler.
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
// Re-renders blips when event data updates. Call on each polling cycle.
export function updateAsciiMap(container, events) {
    container.innerHTML = renderAsciiMap(events);
}
