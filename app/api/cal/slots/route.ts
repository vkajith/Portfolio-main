import { NextRequest, NextResponse } from 'next/server'
import { CAL_API, calConfig, calHeaders, clientIp, isValidTimeZone, rateLimited, slugFor } from '@/app/lib/cal'

// GET /api/cal/slots?minutes=30&tz=Asia/Kolkata
// → { days: [{ date: '2026-11-27', slots: ['2026-11-27T03:30:00.000Z', ...] }], bookingUrl }
export async function GET(request: NextRequest) {
  const config = calConfig()
  if (!config) return NextResponse.json({ error: 'Booking is not configured.' }, { status: 503 })
  if (rateLimited(`slots:${clientIp(request.headers)}`, 30)) {
    return NextResponse.json({ error: 'Too many requests.' }, { status: 429 })
  }

  const minutes = Number(request.nextUrl.searchParams.get('minutes') ?? 30)
  const slug = slugFor(minutes)
  const tzParam = request.nextUrl.searchParams.get('tz')
  const timeZone = isValidTimeZone(tzParam) ? tzParam : 'UTC'
  if (!slug) return NextResponse.json({ error: 'Unsupported duration.' }, { status: 400 })

  const start = new Date()
  const end = new Date(start.getTime() + 14 * 24 * 60 * 60 * 1000)
  const params = new URLSearchParams({
    username: config.username,
    eventTypeSlug: slug,
    start: start.toISOString(),
    end: end.toISOString(),
    timeZone,
  })

  try {
    const response = await fetch(`${CAL_API}/slots?${params}`, {
      headers: calHeaders('2024-09-04'),
      next: { revalidate: 60 },
    })
    if (!response.ok) throw new Error(String(response.status))
    const body = (await response.json()) as { data?: Record<string, { start: string }[]> }
    const days = Object.entries(body.data ?? {})
      .map(([date, slots]) => ({
        date,
        // Normalise to UTC ISO so the client formats in the visitor's zone.
        slots: slots.map((s) => new Date(s.start).toISOString()).filter((iso) => new Date(iso) > start),
      }))
      .filter((day) => day.slots.length > 0)
      .slice(0, 5)
    return NextResponse.json({ days, bookingUrl: config.bookingUrl })
  } catch {
    return NextResponse.json({ error: 'Could not load the calendar.', bookingUrl: config.bookingUrl }, { status: 502 })
  }
}
