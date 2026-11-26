'use client'

/* eslint-disable @next/next/no-img-element -- Google's CDN already serves the exact widths in srcSet; next/image would proxy them again. */

import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Photo, proxiedPhotoSrc, proxiedPhotoSrcSet } from '@/app/lib/photography'

export default function PhotoGallery({ photos, albumUrl }: { photos: Photo[]; albumUrl: string }) {
  const [active, setActive] = useState<number | null>(null)
  const [lightboxLoaded, setLightboxLoaded] = useState(false)
  const lastFocused = useRef<HTMLElement | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  const openAt = (index: number) => {
    lastFocused.current = document.activeElement as HTMLElement | null
    setActive(index)
    setTimeout(() => closeRef.current?.focus(), 0)
  }

  const close = useCallback(() => {
    setActive(null)
    requestAnimationFrame(() => lastFocused.current?.focus())
  }, [])

  const step = useCallback(
    (delta: number) => {
      setActive((current) => (current === null ? current : (current + delta + photos.length) % photos.length))
    },
    [photos.length]
  )

  useEffect(() => {
    if (active === null) return
    setLightboxLoaded(false)
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        step(-1)
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        step(1)
      }
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [active, close, step])

  if (photos.length === 0) return null

  const activePhoto = active !== null ? photos[active] : null

  return (
    <>
      <div>
        <div className="columns-2 gap-3 xl:columns-3">
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => openAt(index)}
              className="group relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)]"
              aria-label={`Open photograph ${index + 1}`}
            >
              <img
                src={proxiedPhotoSrc(photo, 800)}
                srcSet={proxiedPhotoSrcSet(photo)}
                sizes="(max-width: 1280px) 50vw, 226px"
                width={photo.width}
                height={photo.height}
                alt={`Photography by Vysyakh Ajith — frame ${index + 1}`}
                loading="lazy"
                decoding="async"
                className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none"
              />
              <span className="absolute left-2.5 top-2.5 rounded-full bg-black/45 px-2 py-0.5 font-mono text-[9px] tracking-wider text-white/80 backdrop-blur">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none"
              />
              <span className="pointer-events-none absolute bottom-2.5 left-2.5 flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.18em] text-white/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none">
                View frame <ArrowUpRight className="w-2.5 h-2.5" aria-hidden />
              </span>
            </button>
          ))}
        </div>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
          Tap a frame to open
        </p>
      </div>

      {activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photography viewer"
          data-lenis-prevent
          className="fixed inset-0 z-[130] flex flex-col bg-black text-white animate-fade-in-up"
          onClick={close}
        >
          <div
            className="flex shrink-0 items-center justify-between gap-4 px-4 py-3 sm:px-6"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55">
              Photography · Frame {String((active ?? 0) + 1).padStart(2, '0')}
            </span>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Close photo viewer"
              className="rounded-full border border-white/20 p-2 text-white/70 transition-colors hover:border-white/50 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div
            className="relative flex min-h-0 flex-1 items-center justify-center px-3 sm:px-6"
            onClick={(event) => event.stopPropagation()}
          >
            {!lightboxLoaded && (
              <span className="absolute font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 animate-pulse">
                loading frame…
              </span>
            )}
            <img
              key={activePhoto.id}
              src={proxiedPhotoSrc(activePhoto, 1600)}
              alt={`Photography by Vysyakh Ajith — frame ${(active ?? 0) + 1}`}
              onLoad={() => setLightboxLoaded(true)}
              onError={() => setLightboxLoaded(true)}
              className={`max-h-[72vh] max-w-full object-contain transition-opacity duration-300 sm:max-h-[76vh] ${lightboxLoaded ? 'opacity-100' : 'opacity-0'}`}
              draggable={false}
            />
          </div>

          <div
            className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-white/10 px-4 py-3 sm:px-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous photo"
                className="rounded-full border border-white/20 p-2 text-white/70 transition-colors hover:border-white/50 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next photo"
                className="rounded-full border border-white/20 p-2 text-white/70 transition-colors hover:border-white/50 hover:text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-4 font-mono text-[10px] text-white/55">
              <span className="hidden sm:inline">Arrow keys to move · Esc to close</span>
              {albumUrl && (
                <a
                  href={albumUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-white/70 transition-colors hover:text-white"
                >
                  Google Photos <ArrowUpRight className="w-3 h-3" aria-hidden />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
