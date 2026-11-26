import { ArrowUpRight, Camera } from 'lucide-react'
import { photography } from '@/app/lib/profile'
import { getPhotography } from '@/app/lib/photography'
import PhotoGallery from './PhotoGallery'
import Reveal from './Reveal'

export default async function Photography() {
  const photos = await getPhotography()
  const albumUrl = process.env.GOOGLE_PHOTOS_ALBUM_URL?.trim() ?? ''

  return (
    <section id="photography" className="px-5 sm:px-10 lg:px-16 py-20 lg:py-28">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-[0.72fr_1.28fr] gap-10 lg:gap-14 items-start">
          <div className="lg:sticky lg:top-[12vh]">
            <Reveal>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  {photography.label}
                </h2>
              </div>

              <div aria-hidden className="h-px w-10 bg-[var(--accent-soft-35)] mb-5" />

              <p className="text-[1.5rem] font-semibold leading-snug tracking-tight text-[var(--text-primary)]">
                {photography.headline}
              </p>
              <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-[var(--text-secondary)]">
                {photography.summary}
              </p>

              {albumUrl && (
                <a
                  href={albumUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 inline-flex items-center gap-2 rounded-full border border-[var(--accent-soft-35)] px-4 py-2 font-mono text-[11px] text-[var(--accent)] transition-colors hover:bg-[var(--accent-soft-10)]"
                >
                  <Camera className="w-3.5 h-3.5" aria-hidden /> Google Photos{' '}
                  <ArrowUpRight className="w-3 h-3" aria-hidden />
                </a>
              )}

              {photos.length > 0 && (
                <p className="mt-8 hidden lg:block font-mono text-[10px] uppercase tracking-[0.18em] leading-relaxed text-[var(--text-muted)]">
                  A curated set
                  <br />
                  from the full album
                </p>
              )}
            </Reveal>
          </div>

          <Reveal delay={80}>
            <div>
              {photos.length > 0 ? (
                <PhotoGallery photos={photos} albumUrl={albumUrl} />
              ) : (
                <div className="rounded-2xl border border-dashed border-[var(--border-color)] bg-[var(--accent-soft-05)] p-8 sm:p-12">
                  <Camera className="w-5 h-5 text-[var(--accent)] mb-4" aria-hidden />
                  <h3 className="text-[16px] font-semibold text-[var(--text-primary)] mb-2">
                    {albumUrl ? 'The album is taking a moment.' : 'The album is being arranged.'}
                  </h3>
                  <p className="max-w-xl text-[14px] leading-relaxed text-[var(--text-secondary)]">
                    {albumUrl
                      ? 'The full collection is on Google Photos — open it there while the gallery catches up.'
                      : 'A curated set of frames will live here. Check back soon.'}
                  </p>
                  {albumUrl && (
                    <a
                      href={albumUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center gap-1.5 text-[12px] font-mono text-[var(--accent)] link-hover"
                    >
                      Open the album <ArrowUpRight className="w-3 h-3" aria-hidden />
                    </a>
                  )}
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
