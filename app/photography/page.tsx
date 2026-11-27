import { ArrowUpRight, Camera } from 'lucide-react'
import { getPhotography } from '@/app/lib/photography'
import SubpageShell from '@/app/components/SubpageShell'
import PhotoGallery from '@/app/components/PhotoGallery'

export const metadata = {
  title: 'Photography — Vysyakh Ajith',
  description: 'A running collection of frames from outside the terminal — the offline practice behind the platform work.',
}

export default async function PhotographyPage() {
  const photos = await getPhotography()
  const albumUrl = process.env.GOOGLE_PHOTOS_ALBUM_URL?.trim() ?? ''

  return (
    <SubpageShell
      letter="P"
      title="Photography"
      description="Light, place, and the patience to wait for the frame — the offline practice behind the platform work."
      aside={
        albumUrl ? (
          <a
            href={albumUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-soft-35)] px-4 py-2 font-mono text-[10px] text-[var(--accent)] transition-colors hover:bg-[var(--accent-soft-10)]"
          >
            <Camera className="w-3.5 h-3.5" aria-hidden /> Google Photos{' '}
            <ArrowUpRight className="w-3 h-3" aria-hidden />
          </a>
        ) : undefined
      }
    >
      {photos.length > 0 ? (
        <PhotoGallery photos={photos} albumUrl={albumUrl} />
      ) : (
        <div className="rounded-2xl border border-dashed border-[var(--border-color)] bg-[var(--accent-soft-05)] p-8 sm:p-12">
          <Camera className="w-5 h-5 text-[var(--accent)] mb-4" aria-hidden />
          <h2 className="text-[16px] font-semibold text-[var(--text-primary)] mb-2">
            {albumUrl ? 'The album is taking a moment.' : 'The album is being arranged.'}
          </h2>
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
    </SubpageShell>
  )
}
