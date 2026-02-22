```
 ██████╗██╗     ███████╗██████╗ ███╗   ███╗ ██████╗ ███╗   ██╗████████╗
██╔════╝██║     ██╔════╝██╔══██╗████╗ ████║██╔═══██╗████╗  ██║╚══██╔══╝
██║     ██║     █████╗  ██████╔╝██╔████╔██║██║   ██║██╔██╗ ██║   ██║
██║     ██║     ██╔══╝  ██╔══██╗██║╚██╔╝██║██║   ██║██║╚██╗██║   ██║
╚██████╗███████╗███████╗██║  ██║██║ ╚═╝ ██║╚██████╔╝██║ ╚████║   ██║
 ╚═════╝╚══════╝╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝
```

> **WORLD SITUATION MONITOR** — Open Source Global Intelligence Dashboard

---

## SIGNAL ACQUIRED. MONITORING ACTIVE.

**Clermont** is an open source world situation monitor — a live, aggregated view of the forces shaping our planet. Designed for the general public, built with the aesthetic of a cold war command center, and powered entirely by open data.

Track geopolitical events. Watch markets breathe. Follow the storm. Read the signal, not the noise.

---

## WHAT WE WATCH

```
[GEO]  GEOPOLITICAL & CONFLICTS ........... territorial disputes, armed conflicts,
                                            sanctions, military movements

[ENV]  NATURAL DISASTERS .................. earthquakes, hurricanes, wildfires,
                                            floods, volcanic activity

[MKT]  FINANCIAL MARKETS .................. global indices, currency stress,
                                            commodity shocks, economic crises

[INF]  NEWS & MEDIA ....................... aggregated headlines, source diversity,
                                            press freedom indicators
```

---

## INTERFACES

Clermont ships in two forms. Same data. Same aesthetic. Two environments.

### `[WEB]` Browser Interface
A full web application with live-updating panels, global map overlays, and event feeds. Built for anyone with a browser. Warm amber on dark. Feels like a command center. Runs like a dashboard.

> **This is the primary interface and current development focus.**

### `[TUI]` Terminal Interface
A native terminal UI for those who live in the command line. Same data, same vibe — rendered in your terminal. Keyboard-driven. Fast. No mouse required.

---

## CONTROLS

The web interface is fully keyboard-navigable.

### Navigation
```
j / ArrowDown   Move focus down through events
k / ArrowUp     Move focus up through events
h / ArrowLeft   Move focus to the previous feed panel
l / ArrowRight  Move focus to the next feed panel

1 / 2 / 3 / 4  Jump directly to GEO / ENV / MKT / INF panel
g               Jump to first event in current panel
G               Jump to last event in current panel

Enter / o       Fly to selected event on the interactive map
Escape          Exit navigation mode
```

### Filter
```
f               Enter filter mode
  c             Toggle CRITICAL events
  h             Toggle HIGH events
  m             Toggle MEDIUM events
  l             Toggle LOW events
  a             Reset — show all severities
  f / Escape    Exit filter mode
```

Filter state is reflected in the status bar: `FILTER:[!!][!][~][.]`
Each glyph glows its severity color when active, dims when off.
Clicking the glyphs directly also works.

### Map
```
Click map panel   Open interactive Leaflet map overlay
Escape            Close map
```

---

## DESIGN PHILOSOPHY

```
AESTHETIC ......... Warm retro. 80s amber terminal. Intelligence command center.
                   Not a joke — a commitment.

SIGNAL > NOISE .... Clermont surfaces events worth knowing. No engagement bait.
                   No outrage loops. Raw data, clear context.

OPEN SOURCE ....... Fully transparent. Open data sources. Community contributions
                   welcome. No paywalls. No surveillance.

PUBLIC FIRST ...... Built for anyone, not just analysts. If a curious person
                   can't understand a panel, it needs better design.
```

---

## STATUS

```
[x] Web interface shell ......... DONE — amber terminal UI, four feed panels
[x] ASCII world map ............. DONE — Braille character map with event blips
[x] Interactive map overlay ..... DONE — Leaflet with severity-colored markers
[x] Keyboard navigation ......... DONE — vim-style hjkl, panel jumps, event fly-to
[x] Severity filter ............. DONE — per-severity toggle, keyboard + click
[ ] Live data pipeline .......... IN PROGRESS
[ ] Geopolitical feed [GEO] ..... PLANNED
[ ] Natural disaster feed [ENV] . PLANNED
[ ] Market feed [MKT] ........... PLANNED
[ ] News aggregator [INF] ....... PLANNED
[ ] TUI interface ............... PLANNED
```

---

## CONTRIBUTING

Clermont is open source and welcomes contributors — data engineers, frontend developers, designers, and domain experts alike. Contribution guidelines coming as the project takes shape.

---

## LICENSE

MIT — use it, fork it, build on it.

---

```
CLERMONT WORLD SITUATION MONITOR
SIGNAL IS EVERYTHING.
```
