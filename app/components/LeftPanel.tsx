'use client'

import { Github, Linkedin, Mail, ArrowUpRight } from 'lucide-react'
import { FaXTwitter } from 'react-icons/fa6'
import Terminal from './Terminal'

const socials = [
  { icon: Github, href: 'https://github.com/vkajith', label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com/in/vysyakh-ajith', label: 'LinkedIn' },
  { icon: FaXTwitter, href: 'https://x.com/whyshagajith', label: 'Twitter' },
  { icon: Mail, href: 'mailto:vysyakhajith@gmail.com', label: 'Email' },
]

export default function LeftPanel() {
  return (
    <aside className="w-full lg:w-[42%] lg:sticky lg:top-0 lg:h-screen p-6 sm:p-8 lg:p-10 xl:p-12 flex flex-col overflow-hidden">
      {/* Top: identity */}
      <div className="space-y-6 stagger-children">
        {/* Status badge */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="status-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]"></span>
          </span>
          <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-widest">Available for work</span>
        </div>

        {/* Identity */}
        <div>
          <h1 className="glitch-on-hover text-[2.2rem] lg:text-[2.6rem] font-bold tracking-tight text-[var(--text-primary)] leading-[1.1] cursor-default select-none">
            Vysyakh Ajith
          </h1>
          <div className="font-mono text-[13px] mt-3 text-[var(--text-secondary)] flex items-center gap-1.5 flex-wrap">
            <span
              className="neon-glow inline-flex items-center gap-1 px-2 py-0.5 rounded-md"
              style={{ background: 'var(--accent-soft-10)', color: 'var(--accent)' }}
            >
              Frontend Engineer
            </span>
            <span className="text-[var(--text-muted)]">·</span>
            <span className="text-[var(--text-muted)]">Fullstack [MERN]</span>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-3">
          <p className="text-[var(--text-secondary)] leading-relaxed text-[15px] max-w-sm">
            A creative developer building better experiences for the web, and learning the art of living.
          </p>
          <p className="text-[var(--text-muted)] text-[13px] italic font-mono">
            &quot;ask Pompu anything below — or hit{' '}
            <kbd className="not-italic px-1.5 py-0.5 rounded text-[10px] font-sans bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)]">
              /
            </kbd>{' '}
            anywhere ↓&quot;
          </p>
        </div>
      </div>

      {/* Bottom: terminal docked, then socials */}
      <div className="mt-auto pt-6 space-y-5">
        <Terminal />

        <div className="pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-all duration-300 hover:-translate-y-0.5"
                  aria-label={label}
                >
                  <Icon className="w-[17px] h-[17px]" />
                </a>
              ))}
            </div>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover neon-glow text-[12px] font-mono text-[var(--accent)] flex items-center gap-1 hover:gap-1.5 transition-all duration-200"
            >
              resume <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </aside>
  )
}
