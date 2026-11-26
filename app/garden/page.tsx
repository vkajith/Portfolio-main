import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { gardenNotes } from '@/app/lib/garden'
import GardenGrid from '@/app/components/GardenGrid'
import Reveal from '@/app/components/Reveal'
import SubpageShell from '@/app/components/SubpageShell'

export const metadata = {
  title: 'Garden — Vysyakh Ajith',
  description: 'Notes on creativity, tech philosophy, systems, AI, and the things I keep thinking about.',
}

export default function GardenPage() {
  return (
    <SubpageShell
      letter="G"
      title="Garden"
      description="Where my brain leaves breadcrumbs — notes on creativity, tech philosophy, systems, and the things I keep thinking about."
      aside={
        <div className="space-y-4 text-[12px] leading-relaxed text-[var(--text-secondary)]">
          <p>A digital garden, not a blog. Notes grow and change as I learn.</p>
          <Link
            href="/writing"
            className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--accent)]"
          >
            Longer essays <ArrowUpRight className="w-3 h-3" aria-hidden />
          </Link>
        </div>
      }
    >
      <Reveal>
        <GardenGrid notes={gardenNotes} />
      </Reveal>
    </SubpageShell>
  )
}
