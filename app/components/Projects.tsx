import { ArrowUpRight } from 'lucide-react'
import { projects } from '@/app/lib/profile'
import ToolIcon from './ToolIcon'

// Data-driven from profile.ts. Renders nothing until there are entries.
export default function Projects() {
  if (projects.length === 0) return null

  return (
    <section id="projects" className="px-5 sm:px-10 lg:px-16 py-20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--text-muted)] mb-8">Building</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {projects.map((p) => {
            const Card = p.link ? 'a' : 'div'
            return (
              <Card
                key={p.title}
                {...(p.link ? { href: p.link, target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="card-hover group block rounded-xl p-6 bg-[var(--bg-card)] border border-[var(--border-color)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-[16px] font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">{p.title}</h3>
                  {p.status && (
                    <span className="shrink-0 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border border-[var(--accent-soft-35)] text-[var(--accent)]">
                      {p.status}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--text-secondary)]">{p.summary}</p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {p.tags.map((t) => (
                      <span key={t} className="inline-flex items-center gap-1 text-[11px] font-mono text-[var(--text-muted)]">
                        <ToolIcon name={t} className="w-3 h-3 shrink-0" />
                        #{t.replace(/\s+/g, '')}
                      </span>
                    ))}
                  </div>
                  {p.link && <ArrowUpRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" aria-hidden />}
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
