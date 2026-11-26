import { BookOpen, ArrowUpRight } from 'lucide-react'
import Reveal from './Reveal'

type Post = {
  title: string
  link: string
  pubDate: string
  description: string
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

// Fetched at build time (this is a server component with no 'use client'),
// so there is no client-side RSS parsing or extra JS shipped to the browser.
async function getLatestPosts(): Promise<Post[]> {
  if (!SUBSTACK_RSS_URL) return []
  try {
    const response = await fetch(SUBSTACK_RSS_URL, { next: { revalidate: 3600 } })
    if (!response.ok) return []
    const xml = await response.text()
    const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? []
    return items.slice(0, 3).map((item) => ({
      title: extractTag(item, 'title'),
      link: extractLink(item),
      pubDate: extractTag(item, 'pubDate'),
      description: extractTag(item, 'description'),
    }))
  } catch {
    return []
  }
}

function formatDate(pubDate: string): string {
  const date = new Date(pubDate)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default async function Notes() {
  const posts = await getLatestPosts()

  if (posts.length === 0) {
    return (
      <section id="notes" className="px-5 sm:px-10 lg:px-16 py-20"><div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between gap-4 mb-8">
          <h2 className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--text-muted)]">Writing</h2>
          <a href="https://vysyakhajith.substack.com/" target="_blank" rel="noopener noreferrer" className="text-[11px] font-mono text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">Substack feed</a>
        </div>
        <div className="rounded-xl p-6 sm:p-8 border border-dashed border-[var(--border-color)] bg-[var(--accent-soft-05)]">
          <BookOpen className="w-5 h-5 text-[var(--accent)] mb-4" aria-hidden />
          <h3 className="font-semibold text-[var(--text-primary)] text-[16px] mb-2">Writing deserves its own shelf.</h3>
          <p className="max-w-xl text-[14px] leading-relaxed text-[var(--text-secondary)]">Notes from building production AI agents: LLM gateways, evals, agent analytics, and the platform work nobody demos.</p>
          <a href="https://vysyakhajith.substack.com/" target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-1 text-[12px] font-mono text-[var(--accent)] link-hover">Read on Substack <ArrowUpRight className="w-3 h-3" aria-hidden /></a>
        </div>
      </div>
      </section>
    )
  }

  return (
    <section id="notes" className="px-5 sm:px-10 lg:px-16 py-20"><div className="max-w-6xl mx-auto">
      <div className="flex items-end justify-between gap-4 mb-8">
        <h2 className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--text-muted)]">Writing</h2>
        <a href="https://vysyakhajith.substack.com/" target="_blank" rel="noopener noreferrer" className="text-[11px] font-mono text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">All posts <ArrowUpRight className="inline w-2.5 h-2.5" aria-hidden /></a>
      </div>
      <Reveal delay={60}>
        <div className="space-y-3">
          {posts.map((post) => (
            <a
              key={post.link}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="card-hover group block rounded-xl p-5 sm:p-6 border border-[var(--border-color)] bg-[var(--bg-card)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  {post.pubDate && <p className="text-[11px] font-mono text-[var(--text-muted)] mb-2">{formatDate(post.pubDate)}</p>}
                  <h3 className="font-semibold text-[var(--text-primary)] text-[15px] mb-1.5 group-hover:text-[var(--accent)] transition-colors">{post.title}</h3>
                  {post.description && <p className="text-[13.5px] leading-relaxed text-[var(--text-secondary)] line-clamp-2">{post.description}</p>}
                </div>
                <ArrowUpRight className="shrink-0 w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors mt-1" aria-hidden />
              </div>
            </a>
          ))}
        </div>
      </Reveal>
      </div>
    </section>
  )
}
