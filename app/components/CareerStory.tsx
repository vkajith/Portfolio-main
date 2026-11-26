'use client'

import { useEffect, useRef, useState } from 'react'
import { roles } from '@/app/lib/profile'
import ResumePaper from './ResumePaper'

// Scroll-driven story: the left column walks the career forward in time; the
// sticky résumé on the right expands whichever chapter is in view.
export default function CareerStory() {
  const [activeIdx, setActiveIdx] = useState(0)
  const stepRefs = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveIdx(Number((entry.target as HTMLElement).dataset.idx))
        }
      },
      // A thin band across the middle of the viewport decides the active step.
      { rootMargin: '-45% 0px -50% 0px' }
    )
    stepRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const progress = roles.length > 1 ? activeIdx / (roles.length - 1) : 1

  return (
    <section id="experience" className="px-5 sm:px-10 lg:px-16 py-20 lg:py-24">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-xl mb-10">
          <h2 className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--text-muted)] mb-4">The story so far</h2>
          <p className="text-[1.35rem] font-semibold leading-snug tracking-tight text-[var(--text-primary)]">
            From civil engineering to the platform layer of production AI agents.
          </p>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-10 lg:gap-16">
          <ol className="relative">
            <span aria-hidden className="timeline-rail" />
            <span aria-hidden className="timeline-rail timeline-rail--fill" style={{ transform: `scaleY(${progress})` }} />
            {roles.map((role, idx) => (
              <li
                key={role.id}
                data-idx={idx}
                ref={(el) => {
                  stepRefs.current[idx] = el
                }}
                className={`timeline-step ${idx === activeIdx ? 'is-active' : ''} relative lg:min-h-[62vh] flex lg:items-center`}
              >
                <div className="relative pl-10 py-6">
                  <span aria-hidden className="timeline-dot" />
                  <p className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                    {role.start} — {role.end}
                  </p>
                  <h3 className="mt-2 text-[1.5rem] font-bold tracking-tight text-[var(--text-primary)] leading-tight">{role.org}</h3>
                  <p className="mt-1 text-[13px] font-mono text-[var(--accent)]">
                    {role.title}
                    {role.team ? ` · ${role.team}` : ''}
                  </p>
                  <p className="mt-4 text-[15px] leading-relaxed text-[var(--text-secondary)] max-w-sm">{role.chapter}</p>

                  {/* Mobile has no sticky résumé, so the detail lives here. */}
                  <ul className="mt-4 space-y-2.5 lg:hidden">
                    {role.highlights.map((h) => (
                      <li key={h.title} className="text-[13.5px] leading-relaxed text-[var(--text-secondary)]">
                        <span className="font-semibold text-[var(--text-primary)]">{h.title}. </span>
                        {h.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>

          <div className="hidden lg:block">
            <div className="sticky top-[8vh]">
              <ResumePaper activeIdx={activeIdx} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
