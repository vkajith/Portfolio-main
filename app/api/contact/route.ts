import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL

const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_REQUESTS = 5
const requestLog = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const timestamps = (requestLog.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
  timestamps.push(now)
  requestLog.set(ip, timestamps)
  if (requestLog.size > 500) {
    for (const [key, values] of requestLog) {
      if (!values.some((t) => now - t < RATE_LIMIT_WINDOW_MS)) requestLog.delete(key)
    }
  }
  return timestamps.length > RATE_LIMIT_MAX_REQUESTS
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown'
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many requests. Try again in a minute.' }, { status: 429 })
    }

    const { name, email, topic, message } = await request.json()

    if (!name || typeof name !== 'string' || !email || typeof email !== 'string' || !message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'That email address does not look valid.' }, { status: 400 })
    }
    if (!RESEND_API_KEY || !CONTACT_TO_EMAIL) {
      return NextResponse.json({ error: 'Contact delivery is not configured yet.' }, { status: 503 })
    }

    const resend = new Resend(RESEND_API_KEY)
    const safeName = escapeHtml(name).slice(0, 200)
    const safeTopic = topic && typeof topic === 'string' ? escapeHtml(topic).slice(0, 200) : ''
    const safeMessage = escapeHtml(message).slice(0, 5000)

    const { error } = await resend.emails.send({
      from: 'Portfolio contact <onboarding@resend.dev>',
      to: CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `Portfolio enquiry${safeTopic ? `: ${safeTopic}` : ''} — from ${safeName}`,
      html: `<p><strong>From:</strong> ${safeName} (${escapeHtml(email)})</p>${safeTopic ? `<p><strong>Topic:</strong> ${safeTopic}</p>` : ''}<p><strong>Message:</strong></p><p>${safeMessage.replace(/\n/g, '<br />')}</p>`,
    })

    if (error) {
      return NextResponse.json({ error: 'Could not send the message. Please try again.' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
