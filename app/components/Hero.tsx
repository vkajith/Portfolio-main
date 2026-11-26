import { Github, Linkedin, Mail } from 'lucide-react'
import { FaXTwitter } from 'react-icons/fa6'
import { profile } from '@/app/lib/profile'
import PompuShell from './PompuShell'
import HeroActions from './HeroActions'

const socials = [
  { icon: Github, href: profile.links.github, label: 'GitHub' },
  { icon: Linkedin, href: profile.links.linkedin, label: 'LinkedIn' },
  { icon: FaXTwitter, href: profile.links.x, label: 'X' },
  { icon: Mail, href: `mailto:${profile.links.email}`, label: 'Email' },
]

export default function Hero() {
  return (
    <header id="top" className="relative min-h-[100svh] flex flex-col justify-center px-5 sm:px-10 lg:px-16 pt-20 pb-12">
      <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-14 items-center">
        {/* Intro — animated wrapper is fine here; PompuShell must NOT be inside it (see PompuShell note). */}
        <div className="stagger-children space-y-6">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="status-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]" />
            </span>
            <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-widest">
              {profile.status} · {profile.location}
            </span>
          </div>

          <div>
            <h1 className="glitch-on-hover text-[2.6rem] sm:text-[3.4rem] font-bold tracking-tight text-[var(--text-primary)] leading-[1.02] cursor-default select-none">
              {profile.name}
            </h1>
            <p className="mt-3 font-mono text-[13px] flex items-center gap-1.5 flex-wrap">
              <span className="neon-glow px-2 py-0.5 rounded-md" style={{ background: 'var(--accent-soft-10)', color: 'var(--accent)' }}>
                {profile.role}
              </span>
              <span className="text-[var(--text-muted)]">· Observe.AI</span>
            </p>
          </div>

          <div className="space-y-3 max-w-xl">
            <p className="text-[1.45rem] sm:text-[1.7rem] font-semibold leading-snug tracking-tight text-[var(--text-primary)]">
              {profile.headline}
            </p>
            <p className="text-[15px] leading-relaxed text-[var(--text-secondary)]">{profile.summary}</p>
          </div>

          <dl className="flex flex-wrap gap-x-8 gap-y-3">
            {profile.stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-[1.6rem] font-bold tracking-tight text-[var(--accent)] neon-glow leading-none">{s.value}</dd>
                <dd className="mt-1 text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">{s.label}</dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <HeroActions />
            <div className="flex items-center gap-4">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Icon className="w-[17px] h-[17px]" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <PompuShell />
      </div>

      <a
        href="#experience"
        className="scroll-cue hidden sm:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-1 text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--text-muted)] hover:text-[var(--accent)]"
      >
        scroll for the story
        <span aria-hidden className="scroll-cue-line" />
      </a>
    </header>
  )
}
