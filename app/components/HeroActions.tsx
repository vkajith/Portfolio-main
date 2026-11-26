'use client'

import { CalendarPlus, ArrowDown } from 'lucide-react'
import { openPompu } from '@/app/lib/pompuEvents'

export default function HeroActions() {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => openPompu({ book: true })}
        className="inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-[12.5px] font-mono text-[var(--bg-primary)] bg-[var(--accent)] hover:opacity-90 transition-opacity neon-box"
      >
        <CalendarPlus className="w-3.5 h-3.5" aria-hidden /> Book a call
      </button>
      <a
        href="#experience"
        className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12.5px] font-mono text-[var(--text-secondary)] border border-[var(--border-color)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
      >
        The story <ArrowDown className="w-3.5 h-3.5" aria-hidden />
      </a>
    </div>
  )
}
