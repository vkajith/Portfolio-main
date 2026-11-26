'use client'

import { useEffect, useRef, useState } from 'react'
import { Rabbit } from 'lucide-react'
import Terminal from './Terminal'

// One Terminal instance for the whole page. In the hero it sits in flow;
// once the hero scrolls away the same element becomes a fixed dock, so the
// conversation (and any half-finished booking) is never lost.
//
// NOTE: no ancestor of this component may have a CSS transform/filter, or
// `position: fixed` on the dock will be relative to that ancestor instead of
// the viewport. Keep it out of .stagger-children and animated wrappers.
export default function PompuShell() {
  const slotRef = useRef<HTMLDivElement>(null)
  const [docked, setDocked] = useState(false)
  const [open, setOpen] = useState(false)
  const [nudge, setNudge] = useState(false)

  useEffect(() => {
    const slot = slotRef.current
    if (!slot) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        const nowDocked = !entry.isIntersecting
        setDocked(nowDocked)
        if (nowDocked) {
          // Always collapse to the pill: the content the visitor scrolled to
          // (timeline, résumé) matters more. The conversation is kept.
          setOpen(false)
          setNudge(true)
          setTimeout(() => setNudge(false), 1600)
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(slot)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onOpen = () => setOpen(true)
    window.addEventListener('pompu:open', onOpen)
    return () => window.removeEventListener('pompu:open', onOpen)
  }, [])

  const dockClass = docked ? `pompu-dock ${open ? 'is-open' : 'is-closed'}` : 'h-full'

  return (
    <div ref={slotRef} className="pompu-slot">
      <div className={dockClass}>
        <Terminal variant={docked ? 'dock' : 'hero'} onMinimize={docked ? () => setOpen(false) : undefined} />
      </div>
      {docked && !open && (
        <button
          onClick={() => setOpen(true)}
          className={`pompu-pill ${nudge ? 'pompu-pill--nudge' : ''}`}
          aria-label="Open Pompu"
        >
          <Rabbit className="w-4 h-4 ear-twitch" aria-hidden />
          <span className="font-mono text-[12px]">ask pompu</span>
          <kbd className="hidden sm:inline text-[10px] font-mono px-1 rounded border border-[var(--border-color)] text-[var(--text-muted)]">/</kbd>
        </button>
      )}
    </div>
  )
}
