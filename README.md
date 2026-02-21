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

## PREVIEW

![Clermont dashboard](docs/screenshot.png)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ CLERMONT WORLD SITUATION MONITOR_          SYS: NOMINAL // LAST UPDATE: ...  │
├──────────────────────────────────────┬──────────────────────────────────────┤
│                                      │ FILTER: [CRITICAL] [HIGH] [MEDIUM] [LOW]│
│                                      ├──────────────────────────────────────┤
│         ASCII WORLD MAP              │ [GEO] GEOPOLITICAL FEED               │
│                                      │  ● Ceasefire talks stall...    [HIGH] │
│    · · · · ·█·· · · · · · ·█· ·     │  ● Sanctions expanded...       [MED]  │
│   ···█████·····████████·····█··      ├──────────────────────────────────────┤
│    ·····████████···· ·······         │ [ENV] NATURAL DISASTERS               │
│        ·····█████·······            │  ● 6.2M earthquake, Japan     [HIGH] │
│          Click to expand →           │  ● Cat-4 storm track update   [CRIT] │
│                                      ├──────────────────────────────────────┤
│                                      │ [MKT] FINANCIAL MARKETS               │
│                                      │  ● USD/JPY hits 6-month low   [MED]  │
│                                      ├──────────────────────────────────────┤
│                                      │ [INF] NEWS & MEDIA                    │
│                                      │  ● Press freedom index drops  [HIGH] │
├──────────────────────────────────────┴──────────────────────────────────────┤
│ [GEO]: ONLINE (12) | [ENV]: ONLINE (8) | [MKT]: PLANNED | [INF]: PLANNED    │
└─────────────────────────────────────────────────────────────────────────────┘
```

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
A full web application with live-updating panels, a global ASCII map, and event feeds. Built for anyone with a browser. Warm amber on dark. Feels like a command center. Runs like a dashboard.

- Click any event row to fly the map to that location and open its signal detail
- Toggle feeds by clicking any `[GEO]` / `[ENV]` / `[MKT]` / `[INF]` panel header
- Filter by severity using the `FILTER:` strip above the panels
- CRITICAL events flash the panel border on arrival

> **This is the primary interface and current development focus.**

```
// FOR TERMINAL JOCKEYS

j / k ......... navigate events       / ............ open command line
Tab ........... cycle feed panels     ? ............ show keybinding list
Enter ......... open event on map     Esc .......... clear / close
```

### `[TUI]` Terminal Interface
A native terminal UI for those who live in the command line. Same data, same vibe — rendered in your terminal. Keyboard-driven. Fast. No mouse required.

> Planned. Not yet built.

---

## QUICK START

Requires Node.js (via nvm) and npm.

```sh
cd client
npm install
npm run dev
# Open http://localhost:5173
```

The dashboard loads with mock data. Real data feeds require the backend (see CONTRIBUTING).

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
[x] Amber UI shell ............. COMPLETE
[x] ASCII world map ............ COMPLETE
[x] Feed panel layout .......... COMPLETE
[x] Leaflet map overlay ........ COMPLETE
[x] Mock data layer ............ COMPLETE
[x] Feed + severity filters .... COMPLETE
[x] Click-to-map event link .... COMPLETE
[x] CRITICAL alert flash ....... COMPLETE
[x] Keyboard navigation mode ... COMPLETE
[x] Command line interface ..... COMPLETE
[ ] Express backend ............ PLANNED
[ ] PostgreSQL + Prisma ........ PLANNED
[ ] Geopolitical feed .......... PLANNED
[ ] Natural disaster feed ...... PLANNED
[ ] Market feed ................ PLANNED
[ ] News aggregator ............ PLANNED
[ ] PM2 + Nginx ................ PLANNED
[ ] Public deployment .......... PLANNED
[ ] TUI interface .............. PLANNED
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
