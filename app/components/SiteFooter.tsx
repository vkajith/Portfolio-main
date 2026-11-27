import Link from 'next/link'
import { Coffee } from 'lucide-react'
import { profile } from '@/app/lib/profile'

const links = [
  { href: '/garden', label: 'Garden' },
  { href: '/writing', label: 'Writing' },
  { href: '/photography', label: 'Photography' },
  { href: '/#contact', label: 'Contact' },
]

export default function SiteFooter() {
  return (
    <footer className="px-5 pb-10 pt-8 text-center">
      <nav
        aria-label="Explore"
        className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--text-muted)]"
      >
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="hover:text-[var(--accent)] transition-colors">
            {link.label}
          </Link>
        ))}
      </nav>
      <p className="mt-5 text-[11px] text-[var(--text-muted)] font-mono">
        &copy; {new Date().getFullYear()} Vysyakh Ajith — built with help from Pompu <span aria-hidden>🐰🥕</span>
      </p>
      <a
        href={profile.links.coffee}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-mono text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
      >
        <Coffee className="w-3.5 h-3.5" aria-hidden /> Buy Pompu a coffee
      </a>
    </footer>
  )
}
