'use client'

import { FormEvent, useState } from 'react'
import { ArrowUpRight, CalendarDays, Send } from 'lucide-react'
import { openPompu } from '@/app/lib/pompuEvents'

type Status = 'idle' | 'sending' | 'sent' | 'error'

export default function Contact() {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const payload = {
      name: String(data.get('name') || ''),
      email: String(data.get('email') || ''),
      topic: String(data.get('topic') || ''),
      message: String(data.get('message') || ''),
    }

    setStatus('sending')
    setErrorMessage('')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(body.error || 'Could not send the message.')
      }
      setStatus('sent')
      form.reset()
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Could not send the message.')
    }
  }

  const statusLabel = {
    idle: 'Direct, no newsletter.',
    sending: 'Sending…',
    sent: 'Sent — Vysyakh will get back to you soon.',
    error: errorMessage || 'Could not send the message.',
  }[status]

  return (
    <section id="contact" className="px-5 sm:px-10 lg:px-16 py-20"><div className="max-w-6xl mx-auto">
      <h2 className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--text-muted)] mb-8">Start a conversation</h2>
      <div className="grid lg:grid-cols-[0.8fr_1.2fr] rounded-xl overflow-hidden border border-[var(--border-color)] bg-[var(--bg-card)]">
        <div className="p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-[var(--border-color)]">
          <p className="text-[11px] font-mono uppercase tracking-wider text-[var(--accent)] mb-3">Open channel</p>
          <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-3">Bring a good problem.</h3>
          <p className="text-[14px] leading-relaxed text-[var(--text-secondary)]">For AI agent platforms, LLM infrastructure, product engineering, or a thoughtful hello. Pompu will not take it personally if you skip the small talk.</p>
          <button type="button" onClick={() => openPompu({ book: true })} className="mt-7 inline-flex items-center gap-2 text-[13px] font-mono text-[var(--accent)] link-hover"><CalendarDays className="w-4 h-4" aria-hidden /> Book a call with Pompu <ArrowUpRight className="w-3 h-3" aria-hidden /></button>
          <p className="mt-3 text-[11px] leading-relaxed text-[var(--text-muted)]">Pick a real 15 or 30 minute slot on Vysyakh&apos;s calendar — no back-and-forth.</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
              Name
              <input required name="name" disabled={status === 'sending'} className="mt-2 w-full bg-transparent border-b border-[var(--border-color)] py-2 text-[14px] text-[var(--text-primary)] outline-none focus:border-[var(--accent)] disabled:opacity-60" />
            </label>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
              Email
              <input required type="email" name="email" disabled={status === 'sending'} className="mt-2 w-full bg-transparent border-b border-[var(--border-color)] py-2 text-[14px] text-[var(--text-primary)] outline-none focus:border-[var(--accent)] disabled:opacity-60" />
            </label>
          </div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
            What are we making?
            <input name="topic" disabled={status === 'sending'} className="mt-2 w-full bg-transparent border-b border-[var(--border-color)] py-2 text-[14px] text-[var(--text-primary)] outline-none focus:border-[var(--accent)] disabled:opacity-60" />
          </label>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
            Message
            <textarea required name="message" rows={3} disabled={status === 'sending'} className="mt-2 w-full resize-none bg-transparent border-b border-[var(--border-color)] py-2 text-[14px] text-[var(--text-primary)] outline-none focus:border-[var(--accent)] disabled:opacity-60" />
          </label>
          <div className="flex items-center justify-between gap-4 pt-1">
            <span className={`text-[11px] ${status === 'error' ? 'text-red-500' : status === 'sent' ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`}>{statusLabel}</span>
            <button type="submit" disabled={status === 'sending'} className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-[12px] font-mono text-[var(--bg-primary)] bg-[var(--accent)] hover:opacity-90 transition-opacity disabled:opacity-60">
              {status === 'sending' ? 'Sending…' : 'Send a signal'} <Send className="w-3.5 h-3.5" aria-hidden />
            </button>
          </div>
        </form>
      </div>
      </div>
    </section>
  )
}
