'use client'

import { useMemo } from 'react'
import { Download } from 'lucide-react'
import { profile, roles, skills } from '@/app/lib/profile'

// A calm one-page résumé rendered from profile.ts. The only thing that
// changes on scroll: the chapter in view is expanded and marked; every other
// entry collapses to a single line. Everything is always visible — no
// skeletons, no auto-scrolling.
export default function ResumePaper({ activeIdx }: { activeIdx: number }) {
  const work = useMemo(() => roles.map((r, idx) => ({ ...r, idx })).filter((r) => r.kind === 'work').reverse(), [])
  const education = useMemo(() => roles.map((r, idx) => ({ ...r, idx })).filter((r) => r.kind === 'education'), [])

  return (
    <div className="resume-paper" aria-label="Résumé">
      <div className="resume-body pompu-scroll" data-lenis-prevent>
        <header className="flex items-start justify-between gap-4 pb-3 border-b border-[var(--paper-rule)]">
          <div>
            <h3 className="text-[18px] font-bold tracking-tight text-[var(--paper-ink)]">{profile.name}</h3>
            <p className="mt-0.5 text-[11px] text-[var(--paper-muted)]">
              {profile.role} · {profile.location}
            </p>
          </div>
          <a
            href={profile.links.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-1.5 text-[10.5px] font-mono text-[var(--paper-muted)] hover:text-[var(--accent)] transition-colors"
          >
            <Download className="w-3 h-3" aria-hidden /> PDF
          </a>
        </header>

        <p className="resume-text mt-3">{profile.summary}</p>

        <section className="resume-section">
          <h4>Experience</h4>
          {work.map((r) => {
            const active = r.idx === activeIdx
            return (
              <article key={r.id} className={`resume-entry ${active ? 'is-active' : ''}`}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-[12px] font-semibold text-[var(--paper-ink)]">
                    {r.org}
                    <span className="font-normal text-[var(--paper-muted)]"> — {r.title}</span>
                  </p>
                  <p className="text-[10px] text-[var(--paper-muted)] shrink-0 tabular-nums">
                    {r.start} – {r.end}
                  </p>
                </div>
                <div className="resume-expand" aria-hidden={!active}>
                  <div>
                    <ul className="pt-1.5 space-y-1">
                      {r.highlights.map((h) => (
                        <li key={h.title} className="resume-bullet">
                          <strong>{h.title}.</strong> {h.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {!active && (
                  <p className="resume-collapsed">{r.highlights.map((h) => h.title).join(' · ')}</p>
                )}
              </article>
            )
          })}
        </section>

        <section className="resume-section">
          <h4>Education</h4>
          {education.map((r) => (
            <article key={r.id} className={`resume-entry ${r.idx === activeIdx ? 'is-active' : ''}`}>
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-[12px] font-semibold text-[var(--paper-ink)]">
                  BITS Pilani<span className="font-normal text-[var(--paper-muted)]"> — {r.title}</span>
                </p>
                <p className="text-[10px] text-[var(--paper-muted)] shrink-0 tabular-nums">
                  {r.start} – {r.end}
                </p>
              </div>
              <p className="resume-collapsed">{r.highlights[0]?.text}</p>
            </article>
          ))}
        </section>

        <section className="resume-section">
          <h4>Skills</h4>
          <dl className="space-y-1">
            {Object.entries(skills).map(([group, list]) => (
              <div key={group} className="flex gap-2 text-[10.5px] leading-relaxed">
                <dt className="w-[60px] shrink-0 font-semibold text-[var(--paper-ink)]">{group}</dt>
                <dd className="text-[var(--paper-muted)]">{list.join(', ')}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </div>
  )
}
