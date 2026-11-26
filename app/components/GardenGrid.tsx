'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { GardenNote, GardenTag } from '@/app/lib/garden'

type Filter = 'all' | GardenTag

const FILTERS: Filter[] = ['all', 'creativity', 'philosophy', 'systems', 'ai', 'design', 'life']

function label(filter: Filter): string {
  if (filter === 'all') return 'All'
  if (filter === 'ai') return 'AI'
  return filter.charAt(0).toUpperCase() + filter.slice(1)
}

export default function GardenGrid({ notes }: { notes: GardenNote[] }) {
  const [filter, setFilter] = useState<Filter>('all')
  const visible = filter === 'all' ? notes : notes.filter((note) => note.tags.includes(filter))

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-6" role="group" aria-label="Filter notes by topic">
        {FILTERS.map((item) => {
          const active = item === filter
          return (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              aria-pressed={active}
              className={`font-mono text-[10px] uppercase tracking-[0.12em] px-2.5 py-1 rounded-full border transition-colors ${
                active
                  ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-soft-10)]'
                  : 'border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--accent-soft-35)] hover:text-[var(--accent)]'
              }`}
            >
              {label(item)}
            </button>
          )
        })}
      </div>

      {visible.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {visible.map((note) => (
            <Link
              key={note.slug}
              href={`/garden/${note.slug}`}
              className="card-hover group flex flex-col rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5"
            >
              <div className="flex items-center justify-between gap-3 font-mono text-[10px] text-[var(--text-muted)]">
                <span>{note.date}</span>
                <span className="text-[var(--accent)]">{note.number}</span>
              </div>
              <h2 className="mt-3 text-[16px] font-semibold leading-snug text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                {note.title}
              </h2>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--text-secondary)]">{note.summary}</p>
              <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                <div className="flex flex-wrap gap-x-2 gap-y-1">
                  {note.tags.map((tag) => (
                    <span key={tag} className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
                      #{tag}
                    </span>
                  ))}
                </div>
                <ArrowUpRight className="shrink-0 w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" aria-hidden />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-[var(--border-color)] p-8 text-center">
          <p className="font-mono text-[11px] text-[var(--text-muted)]">No notes in this lane yet.</p>
        </div>
      )}
    </div>
  )
}
