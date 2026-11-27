import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { gardenNotes } from '@/app/lib/garden'
import ReadingProgress from '@/app/components/ReadingProgress'

type Params = { slug: string }

export function generateStaticParams() {
  return gardenNotes.map((note) => ({ slug: note.slug }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const note = gardenNotes.find((item) => item.slug === slug)
  if (!note) return {}
  return {
    title: `${note.title} — Garden — Vysyakh Ajith`,
    description: note.summary,
    openGraph: { title: note.title, description: note.summary },
  }
}

export default async function GardenNotePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const note = gardenNotes.find((item) => item.slug === slug)
  if (!note) notFound()

  return (
    <>
      <ReadingProgress />
      <main className="px-5 sm:px-10 lg:px-16 pt-24 pb-24">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/garden"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden /> Garden
          </Link>

          <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
            <span className="text-[var(--accent)]">[G]</span>
            <span>{note.number}</span>
            <span aria-hidden>·</span>
            <span>{note.date}</span>
            <span aria-hidden>·</span>
            <span>{note.readingTime}</span>
          </div>

          <h1 className="mt-4 text-[2.1rem] sm:text-[2.8rem] font-bold leading-[1.08] tracking-tight text-[var(--text-primary)]">
            {note.title}
          </h1>
          <p className="mt-4 text-[16px] leading-relaxed text-[var(--text-secondary)]">{note.summary}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[9px] uppercase tracking-[0.14em] px-2 py-1 rounded-full border border-[var(--accent-soft-35)] text-[var(--accent)]"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="mt-10 space-y-6 text-[15.5px] leading-[1.8] text-[var(--text-secondary)]">
            {note.body.map((block, index) => {
              if (block.startsWith('## ')) {
                return (
                  <h2
                    key={index}
                    className="pt-4 text-[1.25rem] font-semibold leading-snug tracking-tight text-[var(--text-primary)]"
                  >
                    {block.slice(3)}
                  </h2>
                )
              }
              if (block.startsWith('> ')) {
                return (
                  <blockquote
                    key={index}
                    className="border-l-2 border-[var(--accent-soft-35)] pl-4 italic text-[var(--text-primary)]"
                  >
                    {block.slice(2)}
                  </blockquote>
                )
              }
              return <p key={index}>{block}</p>
            })}
          </div>

          <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border-color)] pt-6 font-mono text-[10px] uppercase tracking-[0.14em]">
            <Link href="/garden" className="inline-flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
              <ArrowLeft className="w-3 h-3" aria-hidden /> All notes
            </Link>
            <Link href="/writing" className="inline-flex items-center gap-1.5 text-[var(--accent)]">
              Longer essays <ArrowUpRight className="w-3 h-3" aria-hidden />
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
