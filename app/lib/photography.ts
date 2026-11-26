// Photography comes from a link-shared Google Photos album.
//
// Google now serves short `photos.app.goo.gl/...` links as a JS-only shell, so
// the server cannot read the album from that URL. Use the resolved
// `https://photos.google.com/share/<id>?key=<key>` URL instead; that page
// server-renders the album data.
//
// The page embeds photo rows like:
//   "https://lh3.googleusercontent.com/pw/<token>",<width>,<height>,
// We keep the largest row per base URL, then request sized renditions from
// Google's CDN (`=w1600` etc.). Revalidates hourly, so new album photos appear
// on the next build/revalidation without a redeploy.

export type Photo = {
  id: string
  base: string
  width: number
  height: number
}

const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'

const PHOTO_ROW = /https:\/\/lh3\.googleusercontent\.com\/pw\/[^"]+",(\d+),(\d+),/g

export function parseAlbum(html: string): Photo[] {
  const best = new Map<string, { base: string; width: number; height: number }>()
  const order: string[] = []

  let match: RegExpExecArray | null
  PHOTO_ROW.lastIndex = 0
  while ((match = PHOTO_ROW.exec(html))) {
    const raw = match[0]
    const base = raw.slice(0, raw.indexOf('"'))
    const width = Number(match[1])
    const height = Number(match[2])
    if (!width || !height) continue

    if (!best.has(base)) order.push(base)
    const previous = best.get(base)
    if (!previous || width * height > previous.width * previous.height) {
      best.set(base, { base, width, height })
    }
  }

  return order
    .map((base) => best.get(base)!)
    .filter((photo) => photo.width * photo.height >= 250_000 && Math.min(photo.width, photo.height) >= 150)
    .slice(0, 18)
    .map((photo, index) => ({ id: `frame-${index + 1}`, ...photo }))
}

export async function getPhotography(): Promise<Photo[]> {
  const url = process.env.GOOGLE_PHOTOS_ALBUM_URL?.trim()
  if (!url) return []

  // The short share link is a JS shell; only the full share URL works here.
  if (url.includes('photos.app.goo.gl')) return []

  try {
    const response = await fetch(url, {
      headers: {
        'user-agent': USER_AGENT,
        accept: 'text/html,application/xhtml+xml',
        'accept-language': 'en-US,en;q=0.9',
      },
      next: { revalidate: 3600 },
    })
    if (!response.ok) return []
    return parseAlbum(await response.text())
  } catch {
    return []
  }
}

export function photoSrc(photo: Photo, width: number): string {
  const height = Math.max(1, Math.round((width * photo.height) / photo.width))
  return `${photo.base}=w${width}-h${height}`
}

// Google's CDN is flaky under the gallery's concurrent sized requests, so the
// browser requests these through the cached /api/photo proxy instead.
export function proxiedPhotoSrc(photo: Photo, width: number): string {
  return `/api/photo?url=${encodeURIComponent(photoSrc(photo, width))}`
}

export function proxiedPhotoSrcSet(photo: Photo): string {
  return [480, 800, 1200, 1600]
    .map((width) => `${proxiedPhotoSrc(photo, width)} ${width}w`)
    .join(', ')
}
