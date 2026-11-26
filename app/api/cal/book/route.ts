import { NextRequest, NextResponse } from 'next/server'
import { CAL_API, calConfig, calHeaders, clientIp, isValidTimeZone, rateLimited, slugFor } from '@/app/lib/cal'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// POST /api/cal/book { start, minutes, name, email, timeZone, notes? }
export async function POST(request: NextRequest) {
  const config = calConfig()
  if (!config) return NextResponse.json({ error: 'Booking is not configured.' }, { status: 503 })
  if (rateLimited(`book:${clientIp(request.headers)}`, 4, 10 * 60_000)) {
    return NextResponse.json({ error: 'Too many booking attempts. Try again later.', bookingUrl: config.bookingUrl }, { status: 429 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const { start, minutes, name, email, timeZone, notes } = body
  const slug = slugFor(Number(minutes))
  const startDate = typeof start === 'string' ? new Date(start) : null

  if (!slug) return NextResponse.json({ error: 'Unsupported duration.' }, { status: 400 })
  if (!startDate || Number.isNaN(startDate.getTime()) || startDate.getTime() < Date.now()) {
    return NextResponse.json({ error: 'That slot is no longer available.' }, { status: 400 })
  }
  if (typeof name !== 'string' || name.trim().length < 2 || name.length > 100) {
    return NextResponse.json({ error: 'Please share your name.' }, { status: 400 })
  }
  if (typeof email !== 'string' || !EMAIL_RE.test(email) || email.length > 200) {
    return NextResponse.json({ error: 'That email address does not look valid.' }, { status: 400 })
  }

  const payload = {
    start: startDate.toISOString(),
    eventTypeSlug: slug,
    username: config.username,
    attendee: {
      name: name.trim(),
      email: email.trim(),
      timeZone: isValidTimeZone(timeZone) ? timeZone : 'UTC',
    },
    bookingFieldsResponses:
      typeof notes === 'string' && notes.trim() ? { notes: notes.trim().slice(0, 1000) } : undefined,
    metadata: { source: 'pompu' },
  }

  try {
    const response = await fetch(`${CAL_API}/bookings`, {
      method: 'POST',
      headers: calHeaders('2024-08-13'),
      body: JSON.stringify(payload),
    })
    const result = (await response.json().catch(() => ({}))) as {
      data?: { start?: string; end?: string; meetingUrl?: string; location?: string }
      error?: { message?: string }
    }
    if (!response.ok || !result.data) {
      return NextResponse.json(
        { error: result.error?.message || 'Cal.com could not confirm that slot.', bookingUrl: config.bookingUrl },
        { status: 502 }
      )
    }
    return NextResponse.json({
      ok: true,
      start: result.data.start ?? payload.start,
      end: result.data.end,
      meetingUrl: result.data.meetingUrl ?? result.data.location ?? null,
    })
  } catch {
    return NextResponse.json({ error: 'Could not reach Cal.com.', bookingUrl: config.bookingUrl }, { status: 502 })
  }
}
