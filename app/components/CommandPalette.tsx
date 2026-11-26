'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Search,
  Briefcase,
  FileText,
  CalendarDays,
  BookOpen,
  Github,
  Linkedin,
  Mail,
  Coffee,
  Rabbit,
  Workflow,
} from 'lucide-react'
import { profile } from '@/app/lib/profile'
import { openPompu } from '@/app/lib/pompuEvents'

type Item = {
  id: string
  label: string
  hint: string
  icon: React.ComponentType<{ className?: string }>
  run: () => void
}

function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const focusPompu = () => openPompu()

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const items: Item[] = useMemo(
    () => [
      { id: 'pompu', label: 'Ask Pompu', hint: 'questions about the work', icon: Rabbit, run: focusPompu },
      { id: 'book', label: 'Book a call', hint: '15 or 30 min, in-chat', icon: CalendarDays, run: () => openPompu({ book: true }) },
      { id: 'experience', label: 'The story', hint: 'timeline + live résumé', icon: Briefcase, run: () => scrollToId('experience') },
      { id: 'systems', label: 'The platform', hint: 'builder · gateway · evals · analytics', icon: Workflow, run: () => scrollToId('systems') },
      { id: 'notes', label: 'Writing', hint: 'Substack', icon: BookOpen, run: () => scrollToId('notes') },
      { id: 'contact', label: 'Send a message', hint: 'contact form', icon: Mail, run: () => scrollToId('contact') },
      { id: 'resume', label: 'Open résumé PDF', hint: 'new tab', icon: FileText, run: () => window.open(profile.links.resume, '_blank') },
      { id: 'coffee', label: 'Buy me a coffee', hint: 'support the work', icon: Coffee, run: () => window.open(profile.links.coffee, '_blank') },
      { id: 'github', label: 'GitHub', hint: 'github.com/vkajith', icon: Github, run: () => window.open('https://github.com/vkajith', '_blank') },
      { id: 'linkedin', label: 'LinkedIn', hint: 'vysyakh-ajith', icon: Linkedin, run: () => window.open('https://linkedin.com/in/vysyakh-ajith', '_blank') },
    ],
    []
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter(
      (i) => i.label.toLowerCase().includes(q) || i.hint.toLowerCase().includes(q) || i.id.includes(q)
    )
  }, [items, query])

  // Open with ⌘K / Ctrl+K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
        return
      }
      if (e.key === 'Escape' && open) {
        e.preventDefault()
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Reset selection when query changes
  useEffect(() => {
    setActive(0)
  }, [query, open])

  // Autofocus when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 10)
    else setQuery('')
  }, [open])

  const runAt = (idx: number) => {
    const it = filtered[idx]
    if (!it) return
    setOpen(false)
    // tiny defer so the closing transition doesn't fight smooth-scroll
    setTimeout(it.run, 60)
  }

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[14vh] px-4 cmd-palette-fade"
      onClick={() => setOpen(false)}
    >
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(10,10,10,0.45)', backdropFilter: 'blur(6px)' }}
      />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[520px] rounded-xl overflow-hidden cmd-palette-pop"
        style={{
          background: 'var(--bg-primary)',
          border: '1px solid var(--border-color)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.08)',
        }}
      >
        <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <Search className="w-4 h-4 text-[var(--text-muted)]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault()
                setActive((a) => Math.min(filtered.length - 1, a + 1))
              } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                setActive((a) => Math.max(0, a - 1))
              } else if (e.key === 'Enter') {
                e.preventDefault()
                runAt(active)
              }
            }}
            placeholder="jump to… (try: book, platform, résumé)"
            className="flex-1 bg-transparent outline-none text-[14px] font-sans text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
          />
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-[var(--border-color)] text-[var(--text-muted)]">
            esc
          </kbd>
        </div>

        <ul data-lenis-prevent className="max-h-[52vh] overflow-y-auto overscroll-contain py-1.5">
          {filtered.length === 0 && (
            <li className="px-4 py-6 text-center text-[13px] text-[var(--text-muted)] font-mono">
              nothing here. try a different word.
            </li>
          )}
          {filtered.map((it, idx) => {
            const Icon = it.icon
            const isActive = idx === active
            return (
              <li key={it.id}>
                <button
                  onMouseEnter={() => setActive(idx)}
                  onClick={() => runAt(idx)}
                  className="w-full text-left flex items-center gap-3 px-4 py-2.5 transition-colors"
                  style={{
                    background: isActive ? 'var(--accent-soft-10)' : 'transparent',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  }}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="text-[13.5px] font-medium">{it.label}</span>
                  <span className="text-[11px] font-mono text-[var(--text-muted)] ml-auto">{it.hint}</span>
                </button>
              </li>
            )
          })}
        </ul>

        <div
          className="flex items-center justify-between px-4 py-2 text-[10px] font-mono text-[var(--text-muted)]"
          style={{ borderTop: '1px solid var(--border-color)' }}
        >
          <span>↑↓ navigate · ↵ select</span>
          <span>
            <kbd className="px-1 py-0.5 rounded border border-[var(--border-color)]">⌘K</kbd> anywhere
          </span>
        </div>
      </div>
    </div>
  )
}
