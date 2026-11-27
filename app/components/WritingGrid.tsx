/* eslint-disable @next/next/no-img-element -- Substack's CDN already serves optimized cover images. */
import { ArrowUpRight, BookOpen } from 'lucide-react'
import { Post, formatDate } from '@/app/lib/writing'

export default function WritingGrid({ posts }: { posts: Post[] }) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {posts.map((post) => (
        <a
          key={post.link}
          href={post.link}
          target="_blank"
          rel="noopener noreferrer"
          className="card-hover group flex flex-col overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)]"
        >
          {post.image ? (
            <div className="aspect-[16/10] overflow-hidden bg-[var(--accent-soft-05)] p-3">
              <img
                src={post.image}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-contain"
              />
            </div>
          ) : (
            <div className="flex aspect-[16/10] items-center justify-center bg-[var(--accent-soft-05)]">
              <BookOpen className="w-5 h-5 text-[var(--accent)]" aria-hidden />
            </div>
          )}
          <div className="flex flex-1 flex-col p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              {post.pubDate && (
                <p className="text-[11px] font-mono text-[var(--text-muted)]">{formatDate(post.pubDate)}</p>
              )}
              <ArrowUpRight className="shrink-0 w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" aria-hidden />
            </div>
            <h3 className="mt-2 font-semibold text-[var(--text-primary)] text-[15px] leading-snug group-hover:text-[var(--accent)] transition-colors">
              {post.title}
            </h3>
            {post.description && (
              <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--text-secondary)] line-clamp-2">
                {post.description}
              </p>
            )}
          </div>
        </a>
      ))}
    </div>
  )
}
