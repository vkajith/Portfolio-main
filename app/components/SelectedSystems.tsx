'use client'

import { useState } from 'react'
import { BarChart3, Gauge, GitBranch, Network, Rabbit, Shield, Workflow } from 'lucide-react'
import { infraProject, platform } from '@/app/lib/profile'
import { openPompu } from '@/app/lib/pompuEvents'
import ToolIcon from './ToolIcon'

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  builder: Workflow,
  gateway: Network,
  analytics: BarChart3,
  evals: Gauge,
  harness: GitBranch,
}

// The platform as a loop: build → route → capture → judge → improve → build.
// Visitor-driven: nothing moves until they pick a node.
export default function SelectedSystems() {
  const [active, setActive] = useState(0)
  const piece = platform[active]
  const pick = (i: number) => setActive(i)

  return (
    <section id="systems" className="px-5 sm:px-10 lg:px-16 py-20 lg:py-28">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-10">
          <h2 className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--text-muted)] mb-4">The platform</h2>
          <p className="text-[1.35rem] font-semibold leading-snug tracking-tight text-[var(--text-primary)]">
            Production agents need more than a prompt. This is the loop Vysyakh builds so they can be designed, routed, measured, and improved.
          </p>
        </div>

        {/* Loop */}
        <div className="platform-loop" role="tablist" aria-label="Platform components">
          {platform.map((p, i) => {
            const Icon = icons[p.id] ?? Workflow
            const isActive = i === active
            return (
              <button
                key={p.id}
                role="tab"
                aria-selected={isActive}
                aria-controls="platform-detail"
                onClick={() => pick(i)}
                className={`platform-node ${isActive ? 'is-active' : ''}`}
              >
                <span className="platform-node-step">0{i + 1}</span>
                <Icon className="w-4 h-4" aria-hidden />
                <span className="platform-node-name">{p.name}</span>
                <span className="platform-node-short">{p.short}</span>
              </button>
            )
          })}
          <span aria-hidden className="platform-return">↻ feeds the next version</span>
        </div>

        {/* Detail */}
        <div
          id="platform-detail"
          role="tabpanel"
          key={piece.id}
          className="mt-4 grid md:grid-cols-[1fr_auto] gap-6 items-end rounded-xl p-6 sm:p-8 bg-[var(--bg-card)] border border-[var(--border-color)] animate-fade-in-up"
        >
          <div>
            <p className="text-[11px] font-mono uppercase tracking-wider text-[var(--accent)] mb-2">
              0{active + 1} · {piece.short}
            </p>
            <h3 className="text-[1.25rem] font-semibold text-[var(--text-primary)] mb-3">{piece.name}</h3>
            <p className="max-w-2xl text-[14.5px] leading-relaxed text-[var(--text-secondary)]">{piece.detail}</p>
            <div className="flex flex-wrap gap-1.5 mt-5">
              {piece.stack.map((s) => (
                <span key={s} className="tag-interactive inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-[var(--accent)]/40 text-[var(--accent)]">
                  <ToolIcon name={s} className="w-3 h-3 shrink-0" />
                  {s}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={() => openPompu({ prompt: `how does the ${piece.name} work?` })}
            className="inline-flex items-center gap-2 self-end rounded-lg px-3 py-2 text-[12px] font-mono text-[var(--accent)] border border-[var(--accent-soft-35)] hover:bg-[var(--accent-soft-10)] transition-colors"
          >
            <Rabbit className="w-3.5 h-3.5" aria-hidden /> ask pompu about this
          </button>
        </div>

        {/* Infra */}
        <div className="mt-4 rounded-xl p-6 sm:p-8 border border-dashed border-[var(--border-color)] flex flex-col sm:flex-row gap-5 sm:items-start">
          <Shield className="w-5 h-5 text-[var(--accent)] shrink-0" aria-hidden />
          <div>
            <h3 className="text-[15px] font-semibold text-[var(--text-primary)] mb-2">{infraProject.title}</h3>
            <p className="max-w-3xl text-[13.5px] leading-relaxed text-[var(--text-secondary)]">{infraProject.summary}</p>
            <div className="flex flex-wrap gap-1.5 mt-4">
              {infraProject.tags.map((s) => (
                <span key={s} className="inline-flex items-center gap-1 text-[11px] font-mono text-[var(--text-muted)]">
                  <ToolIcon name={s} className="w-3 h-3 shrink-0" />
                  #{s.replace(/\s+/g, '')}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
