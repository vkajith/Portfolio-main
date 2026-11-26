// Server-only helpers for Cal.com API v2. Uses the public endpoints for the
// event types on CAL_COM_BOOKING_URL, so no API key is required. If
// CAL_COM_API_KEY is set it is sent too (raises rate limits, enables private events).
import { bookingDurations } from './profile'

const CAL_API = 'https://api.cal.com/v2'

export function calConfig() {
  const url = process.env.CAL_COM_BOOKING_URL
  if (!url) return null
  try {
    const [username] = new URL(url).pathname.split('/').filter(Boolean)
    return username ? { username, bookingUrl: url } : null
  } catch {
    return null
  }
}

export function slugFor(minutes: number) {
  return bookingDurations.find((d) => d.minutes === minutes)?.slug ?? null
}

export function calHeaders(version: string): HeadersInit {
  const headers: Record<string, string> = { 'cal-api-version': version, 'Content-Type': 'application/json' }
  if (process.env.CAL_COM_API_KEY) headers.Authorization = `Bearer ${process.env.CAL_COM_API_KEY}`
  return headers
}

export { CAL_API }

export function isValidTimeZone(tz: unknown): tz is string {
  if (typeof tz !== 'string' || tz.length > 64) return false
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: tz })
    return true
  } catch {
    return false
  }
}

// Same lightweight sliding-window limiter the other routes use.
const log = new Map<string, number[]>()
export function rateLimited(key: string, max: number, windowMs = 60_000) {
  const now = Date.now()
  const hits = (log.get(key) ?? []).filter((t) => now - t < windowMs)
  hits.push(now)
  log.set(key, hits)
  if (log.size > 500) for (const [k, v] of log) if (!v.some((t) => now - t < windowMs)) log.delete(k)
  return hits.length > max
}

export function clientIp(headers: Headers) {
  return headers.get('x-forwarded-for')?.split(',')[0]?.trim() || headers.get('x-real-ip') || 'unknown'
}
