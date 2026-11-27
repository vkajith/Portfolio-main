import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function SubpageShell({
  letter,
  title,
  description,
  aside,
  children,
}: {
  letter: string
  title: string
  description: React.ReactNode
  aside?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <main className="px-5 sm:px-10 lg:px-16 pt-24 pb-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-4 pr-12">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden /> Back
          </Link>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Vysyakh Ajith
          </span>
        </div>

        <div className="mt-10 grid lg:grid-cols-[0.62fr_1.38fr] gap-10 lg:gap-14 items-start">
          <aside className="lg:sticky lg:top-[12vh]">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-[10px] text-[var(--accent)]">[{letter}]</span>
              <h1 className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--text-muted)]">{title}</h1>
            </div>
            <div aria-hidden className="h-px w-10 bg-[var(--accent-soft-35)] mb-5" />
            <p className="text-[1.5rem] font-semibold leading-snug tracking-tight text-[var(--text-primary)]">
              {description}
            </p>
            {aside && <div className="mt-7">{aside}</div>}
          </aside>

          <div>{children}</div>
        </div>
      </div>
    </main>
  )
}
