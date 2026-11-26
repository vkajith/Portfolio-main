/* eslint-disable @next/next/no-img-element -- Substack and Google Photos already serve sized images. */
import Link from 'next/link'
import { ArrowUpRight, BookOpen, Camera } from 'lucide-react'
import { gardenNotes } from '@/app/lib/garden'
import { getLatestPosts } from '@/app/lib/writing'
import { getPhotography, proxiedPhotoSrc } from '@/app/lib/photography'
import Reveal from './Reveal'
import ExploreShortcuts from './ExploreShortcuts'

const keyChip =
  'font-mono text-[9px] leading-none px-1.5 py-1 rounded border border-[var(--border-color)] text-[var(--text-muted)]'

export default async function Explore() {
  const [latestPost] = await getLatestPosts(1)
  const photos = (await getPhotography()).slice(0, 4)

  return (
    <section id="explore" className="px-5 sm:px-10 lg:px-16 py-20 lg:py-28">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="max-w-2xl mb-10">
            <h2 className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--text-muted)] mb-4">Explore</h2>
            <p className="text-[1.35rem] font-semibold leading-snug tracking-tight text-[var(--text-primary)]">
              More to wander through — notes, essays, and frames from outside the terminal.
            </p>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/garden"
              title="Open the garden (G)"
              className="card-hover group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)]"
            >
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[var(--accent)]">[G]</span>
                  <kbd className={keyChip}>G</kbd>
                </div>
                <h3 className="mt-4 text-[1.1rem] font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                  Garden
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--text-secondary)]">
                  Notes on creativity, tech philosophy, systems, and AI.
                </p>
                <div className="mt-5 space-y-2">
                  {gardenNotes.slice(0, 3).map((note) => (
                    <div key={note.slug} className="flex items-baseline gap-2">
                      <span className="font-mono text-[9px] text-[var(--accent)]">{note.number}</span>
                      <span className="truncate text-[11.5px] text-[var(--text-secondary)]">{note.title}</span>
                    </div>
                  ))}
                </div>
                <span className="mt-auto pt-6 inline-flex items-center gap-1 font-mono text-[10px] text-[var(--accent)]">
                  Enter the garden <ArrowUpRight className="w-3 h-3" aria-hidden />
                </span>
              </div>
            </Link>

            <Link
              href="/writing"
              title="Read the writing (W)"
              className="card-hover group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)]"
            >
              <div className="aspect-[16/10] overflow-hidden bg-[var(--accent-soft-05)] p-3">
                {latestPost?.image ? (
                  <img
                    src={latestPost.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <BookOpen className="w-5 h-5 text-[var(--accent)]" aria-hidden />
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[var(--accent)]">[W]</span>
                  <kbd className={keyChip}>W</kbd>
                </div>
                <h3 className="mt-4 text-[1.1rem] font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                  Writing
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--text-secondary)]">
                  Longer thoughts on agent platforms, systems, and building.
                </p>
                {latestPost && (
                  <p className="mt-auto pt-5 text-[11px] font-mono text-[var(--text-muted)] line-clamp-2">
                    Latest · {latestPost.title}
                  </p>
                )}
              </div>
            </Link>

            <Link
              href="/photography"
              title="Open the photography (P)"
              className="card-hover group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)]"
            >
              <div className="grid aspect-[16/10] grid-cols-2 grid-rows-2 gap-1 p-1">
                {photos.length > 0 ? (
                  photos.map((photo) => (
                    <div key={photo.id} className="min-h-0 overflow-hidden rounded-[4px] bg-[var(--accent-soft-05)]">
                      <img
                        src={proxiedPhotoSrc(photo, 480)}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 row-span-2 flex items-center justify-center">
                    <Camera className="w-5 h-5 text-[var(--accent)]" aria-hidden />
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[var(--accent)]">[P]</span>
                  <kbd className={keyChip}>P</kbd>
                </div>
                <h3 className="mt-4 text-[1.1rem] font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                  Photography
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--text-secondary)]">
                  Frames from outside the terminal — the offline practice.
                </p>
                <span className="mt-auto pt-6 inline-flex items-center gap-1 font-mono text-[10px] text-[var(--accent)]">
                  Open the gallery <ArrowUpRight className="w-3 h-3" aria-hidden />
                </span>
              </div>
            </Link>
          </div>
        </Reveal>
      </div>
      <ExploreShortcuts />
    </section>
  )
}
