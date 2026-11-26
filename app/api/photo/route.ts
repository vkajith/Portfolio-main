import { NextRequest, NextResponse } from 'next/server'

// A tiny allow-listed image proxy for the public Google Photos album.
// Google's CDN occasionally drops/corrupts concurrent sized requests; fetching
// through the server and caching the result keeps the gallery stable without
// copying the photos into the repo.

const ALLOWED_PREFIX = 'https://lh3.googleusercontent.com/pw/'
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')
  if (!url || url.length > 600 || !url.startsWith(ALLOWED_PREFIX)) {
    return new NextResponse('Bad request', { status: 400 })
  }

  try {
    const response = await fetch(url, {
      headers: { 'user-agent': USER_AGENT, accept: 'image/avif,image/webp,image/jpeg,image/*' },
      next: { revalidate: 604800 },
    })

    const contentType = response.headers.get('content-type') ?? ''
    if (!response.ok || !contentType.startsWith('image/')) {
      return new NextResponse('Upstream image unavailable', { status: 502 })
    }

    return new NextResponse(response.body, {
      headers: {
        'content-type': contentType,
        'cache-control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
      },
    })
  } catch {
    return new NextResponse('Upstream image unavailable', { status: 502 })
  }
}
