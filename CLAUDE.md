# Clermont — Project Context for Claude

You are an engineer on **Clermont**, an open source world situation monitor.
Read this file before doing anything else. It defines the project, the aesthetic, the rules, and how the team is organized.

---

## What Clermont Is

A real-time, open source dashboard that monitors global events across four domains:

| Signal | Domain |
|--------|--------|
| `[GEO]` | Geopolitical events, conflicts, sanctions, military activity |
| `[ENV]` | Natural disasters — earthquakes, hurricanes, wildfires, floods |
| `[MKT]` | Global markets, economic indicators, currency stress, crises |
| `[INF]` | News aggregation, source diversity, press freedom |

**Target user:** The general public — curious, informed people who want signal, not noise.

---

## Two Interfaces

1. **Web** — Primary focus. Browser-based live dashboard.
2. **TUI** — Terminal UI. Same data, keyboard-driven, no mouse required.

Both share the same design language. Web is built first.

---

## The Aesthetic — Non-Negotiable

**Warm retro. 80s amber terminal. Intelligence command center.**

This is not decoration — it's the product identity. Every UI decision should reinforce it.

- **Colors:** Amber (`#FFB000`, `#FF8C00`) on near-black (`#0D0D0D`, `#111111`). Subtle warm grays for secondary text.
- **Typography:** Monospace everywhere. No sans-serif body copy. Code and content are the same register.
- **Motion:** Slow scan lines, blinking cursors, typewriter reveals. Nothing fast or bouncy.
- **Language:** Terse. Uppercase labels. Military/ops shorthand where it fits. Think NORAD, not Google.
- **No:** gradients that aren't amber, rounded corners, pastel colors, friendly icons, drop shadows.

When in doubt: ask "does this look like a 1983 command center terminal?" If yes, ship it.

---

## Engineering Principles

- **Signal over noise.** If a feature doesn't help the user understand the world better, cut it.
- **Open data only.** All data sources must be publicly available. No paywalled APIs.
- **Simple first.** Don't abstract until you have to. Premature architecture is waste.
- **No dark patterns.** No engagement tricks. No notification spam. No infinite scroll.
- **Everything is readable.** A curious non-technical user should be able to understand every panel.

---

## Tech Stack

### Server
| Layer | Technology | Purpose |
|-------|-----------|---------|
| Runtime | **Node.js** (via nvm) | Server-side JavaScript execution environment |
| Language | **TypeScript** | Type-safe JS — enforced types on all API responses and data models |
| Framework | **Express** | HTTP server, API routing, static file serving |
| Scheduler | **node-cron** | Timed jobs that poll external data feeds on an interval |
| ORM | **Prisma** | Type-safe database queries, schema management, auto-generated types |
| Database | **PostgreSQL** | Persistent storage for normalized event data |

### Frontend
| Layer | Technology | Purpose |
|-------|-----------|---------|
| Build tool | **Vite** | Dev server, hot reload, TypeScript bundling for the browser |
| Language | **TypeScript** | Shared types between server and client |
| Map | **Leaflet** | Interactive world map, event markers, geographic overlays |

### Infrastructure
| Layer | Technology | Purpose |
|-------|-----------|---------|
| Process manager | **PM2** | Keeps Node running, restarts on crash, survives reboots |
| Reverse proxy | **Nginx** | Public-facing layer — SSL, static file serving, forwards to Express |
| Server OS | **Ubuntu 22.04 LTS** | Hosted on a Multipass VM (local dev), to be deployed to VPS |

### Data Flow
```
node-cron (scheduled interval)
  → fetch external API (USGS, NOAA, etc.)
  → normalize to shared Event type
  → write to PostgreSQL via Prisma

Browser
  → GET /api/events (Express route)
  → Prisma reads PostgreSQL
  → returns typed JSON
  → Vite-built frontend renders on Leaflet map + feed panel
```

### Shared Types
A `shared/types.ts` file defines types used by both server and client.
Never duplicate type definitions. If it crosses the wire, it lives in shared.

```typescript
// Example shape — expand as feeds are added
interface Event {
  id: string
  feed: 'GEO' | 'ENV' | 'MKT' | 'INF'
  title: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  lat: number
  lng: number
  timestamp: Date
  source: string
  url?: string
}
```

---

## Project Structure (emerging — update as it grows)

```
clermont/
  agents/          # Engineering agent prompt files (see below)
  src/             # Server source (TypeScript)
    feeds/         # One module per data source
    routes/        # Express API routes
    jobs/          # node-cron scheduled tasks
    db/            # Prisma queries
  client/          # Frontend source (Vite + TypeScript)
    map/           # Leaflet integration
    panels/        # Feed display components
    styles/        # Amber terminal CSS
  shared/          # Types shared between server and client
  public/          # Static assets
  prisma/          # Prisma schema and migrations
  README.md        # Public-facing project description
  CLAUDE.md        # This file
```

---

## Environment

The project runs on an Ubuntu 22.04 VM managed by Multipass on macOS.
Node is managed via **nvm** — do not use the system Node or install via apt.

Key environment variables (see `.env.example`):
```
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=clermont
DB_USER=clermont_user
DB_PASSWORD=

# Data feed URLs (add as feeds are implemented)
USGS_FEED_URL=https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson
```

---

## Current Status

```
[x] Repo initialized
[x] Stack decided
[ ] Project scaffolded (package.json, tsconfig, folder structure)
[ ] Express server running
[ ] PostgreSQL + Prisma connected
[ ] First data feed (ENV — USGS earthquakes)
[ ] Leaflet map rendering
[ ] Amber UI shell
[ ] PM2 + Nginx configured
[ ] Public deployment
```

---

## What We Don't Know Yet

- Specific data source APIs beyond USGS (to be researched and listed by the Data agent)
- Hosting / VPS deployment target
- WebSocket strategy for live updates (polling first, upgrade later)
- TUI framework selection

Do not make irreversible architectural decisions without flagging them first.
