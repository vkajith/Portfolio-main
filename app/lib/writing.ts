export type Post = {
  title: string
  link: string
  pubDate: string
  description: string
  image?: string
}

const SUBSTACK_RSS_URL = process.env.SUBSTACK_RSS_URL

function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim()
}

function decodeEntities(input: string): string {
  return input
    .replace(/&#8217;/g, '\u2019')
    .replace(/&#8220;/g, '\u201c')
    .replace(/&#8221;/g, '\u201d')
    .replace(/&#8211;/g, '\u2013')
    .replace(/&#8212;/g, '\u2014')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, '\u2019')
}

function extractTag(block: string, tag: string): string {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`))
  if (!match) return ''
  return decodeEntities(stripHtml(match[1].replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '')))
}

function extractLink(block: string): string {
  const match = block.match(/<link>([\s\S]*?)<\/link>/)
  return match ? match[1].trim() : ''
}

function extractImage(block: string): string {
  const enclosure = block.match(/<enclosure[^>]+url="([^"]+)"/i)
  if (enclosure) return decodeEntities(enclosure[1])
  const media = block.match(/<media:(?:content|thumbnail)[^>]+url="([^"]+)"/i)
  if (media) return decodeEntities(media[1])
  const image = block.match(/<img[^>]+src="([^"]+)"/i)
  if (image) return decodeEntities(image[1])
  return ''
}

// Fetched in server components only. Revalidates hourly, so the writing list
// and the home Explore preview stay in sync with Substack.
export async function getLatestPosts(limit = 3): Promise<Post[]> {
  if (!SUBSTACK_RSS_URL) return []
  try {
    const response = await fetch(SUBSTACK_RSS_URL, { next: { revalidate: 3600 } })
    if (!response.ok) return []
    const xml = await response.text()
    const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? []
    return items.slice(0, limit).map((item) => ({
      title: extractTag(item, 'title'),
      link: extractLink(item),
      pubDate: extractTag(item, 'pubDate'),
      description: extractTag(item, 'description'),
      image: extractImage(item),
    }))
  } catch {
    return []
  }
}

export function formatDate(pubDate: string): string {
  const date = new Date(pubDate)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
