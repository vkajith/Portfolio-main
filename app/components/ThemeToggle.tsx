'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

type Theme = 'light' | 'dark'

// Browsers without View Transitions (Firefox, Safari < 18) just get the
// CSS color cross-fade we set on `html, body { transition: ... }`.
type DocWithVT = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void>; finished: Promise<void> }
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  // Read the value the bootstrap script wrote so the icon matches reality.
  useEffect(() => {
    const t = (document.documentElement.getAttribute('data-theme') as Theme | null) ?? 'light'
    setTheme(t)
    setMounted(true)
  }, [])

  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'

    // Capture click coordinates so the wipe radiates from the button.
    const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    document.documentElement.style.setProperty('--theme-x', `${x}px`)
    document.documentElement.style.setProperty('--theme-y', `${y}px`)

    const apply = () => {
      document.documentElement.setAttribute('data-theme', next)
      try { localStorage.setItem('theme', next) } catch {}
      setTheme(next)
    }

    const doc = document as DocWithVT
    if (typeof doc.startViewTransition === 'function') {
      doc.startViewTransition(apply)
    } else {
      apply()
    }
  }

  // Avoid rendering the wrong icon during the brief moment before useEffect
  // reads the bootstrap value. Render a placeholder of identical size.
  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        className="fixed top-4 right-4 z-50 w-9 h-9 rounded-full"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
        }}
        disabled
      />
    )
  }

  const Icon = theme === 'dark' ? Sun : Moon
  const label = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="theme-toggle-btn fixed top-4 right-4 z-50 w-9 h-9 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent)]"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        boxShadow: theme === 'dark'
          ? '0 0 0 1px rgba(255, 61, 200, 0.18), 0 4px 16px rgba(0,0,0,0.35)'
          : '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      <Icon className="w-[15px] h-[15px]" />
    </button>
  )
}
