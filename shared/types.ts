export type Feed = 'GEO' | 'ENV' | 'MKT' | 'INF'
export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export interface Event {
  id: string
  feed: Feed
  title: string
  severity: Severity
  lat: number
  lng: number
  timestamp: Date
  source: string
  url?: string
}

export type FeedStatus = 'ONLINE' | 'OFFLINE' | 'PLANNED' | 'DEGRADED'

export interface FeedState {
  feed: Feed
  status: FeedStatus
  lastUpdate?: Date
  eventCount?: number
}
