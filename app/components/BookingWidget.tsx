'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowUpRight, CalendarCheck, Loader2, X } from 'lucide-react'
import { bookingDurations } from '@/app/lib/profile'

type Day = { date: string; slots: string[] }
type Step = 'pick' | 'details' | 'sending'

const FALLBACK_URL = '/api/book'

function visitorTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  } catch {
    return 'UTC'
  }
}

export default function BookingWidget({
  onBooked,
  onCancel,
}: {
  onBooked: (summary: string) => void
  onCancel: () => void
}) {
  const timeZone = useMemo(visitorTimeZone, [])
  const [minutes, setMinutes] = useState<number>(30)
  const [days, setDays] = useState<Day[] | null>(null)
  const [dayIdx, setDayIdx] = useState(0)
  const [slot, setSlot] = useState<string | null>(null)
  const [step, setStep] = useState<Step>('pick')
  const [error, setError] = useState('')
  const [bookingUrl, setBookingUrl] = useState(FALLBACK_URL)

  const fmtTime = useMemo(() => new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit', timeZone }), [timeZone])
  const fmtDayShort = useMemo(() => new Intl.DateTimeFormat(undefined, { weekday: 'short', timeZone: 'UTC' }), [])
  const fmtDayNum = useMemo(() => new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', timeZone: 'UTC' }), [])
  const fmtFull = useMemo(
    () => new Intl.DateTimeFormat(undefined, { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', timeZone }),
    [timeZone]
  )

  useEffect(() => {
    let cancelled = false
    setDays(null)
    setError('')
    setSlot(null)
    setDayIdx(0)
    fetch(`/api/cal/slots?minutes=${minutes}&tz=${encodeURIComponent(timeZone)}`)
      .then(async (res) => {
        const body = await res.json()
        if (cancelled) return
        if (body.bookingUrl) setBookingUrl(body.bookingUrl)
        if (!res.ok) throw new Error(body.error || 'Could not load the calendar.')
        setDays(body.days ?? [])
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setDays([])
          setError(err.message)
        }
      })
    return () => {
      cancelled = true
    }
  }, [minutes, timeZone])

  const confirm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!slot) return
    const data = new FormData(event.currentTarget)
    setStep('sending')
    setError('')
    try {
      const res = await fetch('/api/cal/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          start: slot,
          minutes,
          timeZone,
          name: String(data.get('name') || ''),
          email: String(data.get('email') || ''),
          notes: String(data.get('notes') || ''),
        }),
      })
      const body = await res.json()
      if (!res.ok) {
        if (body.bookingUrl) setBookingUrl(body.bookingUrl)
        throw new Error(body.error || 'Could not confirm that slot.')
      }
      onBooked(
        `booked! ${minutes} min with Vysyakh on ${fmtFull.format(new Date(body.start || slot))} (${timeZone}). the calendar invite is on its way to your inbox 🥕`
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not confirm that slot.')
      setStep('details')
    }
  }

  const activeDay = days?.[dayIdx]
  const chip =
    'text-[11px] font-mono px-2 py-1 rounded-md border transition-colors disabled:opacity-50'
  const chipIdle = 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
  const chipActive = 'border-[var(--accent)] bg-[var(--accent)] text-[var(--bg-primary)]'

  return (
    <div
      className="booking-widget ml-3 mt-1 rounded-lg p-3 border border-[var(--accent-soft-35)] bg-[var(--bg-primary)] font-sans animate-fade-in-up"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-2 mb-2.5">
        <CalendarCheck className="w-3.5 h-3.5 text-[var(--accent)]" aria-hidden />
        <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-primary)]">book a call</span>
        <span className="text-[10px] font-mono text-[var(--text-muted)] truncate">· {timeZone}</span>
        <button onClick={onCancel} className="ml-auto text-[var(--text-muted)] hover:text-[var(--accent)]" aria-label="Cancel booking">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {step === 'pick' && (
        <>
          <div className="flex gap-1.5 mb-2.5" role="radiogroup" aria-label="Call length">
            {bookingDurations.map((d) => (
              <button
                key={d.minutes}
                role="radio"
                aria-checked={minutes === d.minutes}
                onClick={() => setMinutes(d.minutes)}
                className={`${chip} ${minutes === d.minutes ? chipActive : chipIdle}`}
              >
                {d.minutes} min · {d.label}
              </button>
            ))}
          </div>

          {days === null && (
            <div className="flex items-center gap-2 py-3 text-[11px] font-mono text-[var(--text-muted)]">
              <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden /> checking Vysyakh&apos;s calendar…
            </div>
          )}

          {days && days.length === 0 && (
            <p className="py-2 text-[11.5px] text-[var(--text-secondary)]">
              {error || 'no open slots in the next two weeks.'}{' '}
              <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] link-hover">
                open Cal.com <ArrowUpRight className="inline w-3 h-3" />
              </a>
            </p>
          )}

          {days && days.length > 0 && (
            <>
              <div data-lenis-prevent className="flex gap-1.5 overflow-x-auto pompu-scroll pb-1 mb-2" role="tablist" aria-label="Day">
                {days.map((d, i) => {
                  const date = new Date(`${d.date}T00:00:00Z`)
                  return (
                    <button
                      key={d.date}
                      role="tab"
                      aria-selected={i === dayIdx}
                      onClick={() => {
                        setDayIdx(i)
                        setSlot(null)
                      }}
                      className={`${chip} shrink-0 flex flex-col items-center leading-tight min-w-[52px] ${i === dayIdx ? chipActive : chipIdle}`}
                    >
                      <span>{fmtDayShort.format(date)}</span>
                      <span className="text-[10px] opacity-80">{fmtDayNum.format(date)}</span>
                    </button>
                  )
                })}
              </div>
              <div data-lenis-prevent className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 max-h-[118px] overflow-y-auto overscroll-contain pompu-scroll pr-1">
                {activeDay?.slots.map((iso) => (
                  <button
                    key={iso}
                    onClick={() => {
                      setSlot(iso)
                      setStep('details')
                    }}
                    className={`${chip} ${slot === iso ? chipActive : chipIdle}`}
                  >
                    {fmtTime.format(new Date(iso))}
                  </button>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {(step === 'details' || step === 'sending') && slot && (
        <form onSubmit={confirm} className="space-y-2">
          <button
            type="button"
            onClick={() => setStep('pick')}
            className="flex items-center gap-1 text-[11px] font-mono text-[var(--accent)]"
          >
            <ArrowLeft className="w-3 h-3" /> {minutes} min · {fmtFull.format(new Date(slot))}
          </button>
          <div className="grid grid-cols-2 gap-2">
            <input name="name" required minLength={2} placeholder="your name" autoComplete="name" disabled={step === 'sending'} className="booking-input" />
            <input name="email" type="email" required placeholder="email for the invite" autoComplete="email" disabled={step === 'sending'} className="booking-input" />
          </div>
          <input name="notes" placeholder="what should we talk about? (optional)" maxLength={500} disabled={step === 'sending'} className="booking-input w-full" />
          {error && (
            <p className="text-[11px] text-red-500">
              {error}{' '}
              <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] link-hover">
                book on Cal.com instead
              </a>
            </p>
          )}
          <button
            type="submit"
            disabled={step === 'sending'}
            className="w-full flex items-center justify-center gap-2 rounded-md py-1.5 text-[12px] font-mono text-[var(--bg-primary)] bg-[var(--accent)] hover:opacity-90 disabled:opacity-60"
          >
            {step === 'sending' ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> confirming…</> : 'confirm booking'}
          </button>
        </form>
      )}
    </div>
  )
}
