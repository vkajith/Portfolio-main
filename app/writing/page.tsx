import { ArrowUpRight, BookOpen } from 'lucide-react'
import { getLatestPosts } from '@/app/lib/writing'
import SubpageShell from '@/app/components/SubpageShell'
import Reveal from '@/app/components/Reveal'
import WritingGrid from '@/app/components/WritingGrid'

export const metadata = {
  title: 'Writing — Vysyakh Ajith',
  description: 'Longer thoughts on agent platforms, systems, and building — mostly on Substack.',
}

export default async function WritingPage() {
  const posts = await getLatestPosts(6)

  return (
    <SubpageShell
      letter="W"
      title="Writing"
      description="Longer thoughts on agent platforms, systems, and building. Mostly on Substack."
      aside={
        <a
          href="https://vysyakhajith.substack.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent-soft-35)] px-4 py-2 font-mono text-[10px] text-[var(--accent)] transition-colors hover:bg-[var(--accent-soft-10)]"
        >
          Subscribe on Substack <ArrowUpRight className="w-3 h-3" aria-hidden />
        </a>
      }
    >
      {posts.length > 0 ? (
        <Reveal>
          <WritingGrid posts={posts} />
        </Reveal>
      ) : (
        <div className="rounded-xl border border-dashed border-[var(--border-color)] bg-[var(--accent-soft-05)] p-8 sm:p-10">
          <BookOpen className="w-5 h-5 text-[var(--accent)] mb-4" aria-hidden />
          <h2 className="text-[16px] font-semibold text-[var(--text-primary)] mb-2">The next essay is percolating.</h2>
          <p className="max-w-xl text-[14px] leading-relaxed text-[var(--text-secondary)]">
            Longer notes on agent platforms, systems, and the craft of building. The archive is on Substack.
          </p>
          <a
            href="https://vysyakhajith.substack.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 text-[12px] font-mono text-[var(--accent)] link-hover"
          >
            Read on Substack <ArrowUpRight className="w-3 h-3" aria-hidden />
          </a>
        </div>
      )}
    </SubpageShell>
  )
}
