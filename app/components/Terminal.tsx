'use client'

import { useEffect, useRef, useState, useCallback, FormEvent, KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMinimize2, FiMaximize2, FiX, FiTerminal } from 'react-icons/fi'
import { useTheme } from '../providers/theme-provider'

type LineKind = 'input' | 'output' | 'system' | 'error' | 'pompu'

interface Line {
  id: number
  kind: LineKind
  text: string
}

const PROMPT = 'visitor@portfolio:~$'
const POMPU = '🐰 pompu'

const HELP_LINES = [
  'available commands —',
  '  help                    show this list',
  '  whoami                  who you are (according to me)',
  '  about                   tl;dr on Vysyakh',
  '  experience              jump to work history',
  '  skills                  show the toolkit',
  '  projects                things he built',
  '  contact                 jump to contact section',
  '  send                    send a message right here (interactive)',
  '  resume                  open the resume',
  '  social                  github / linkedin / x',
  '  now                     what he is up to right now',
  '  ls                      list sections',
  '  cd <section>            hop to a section',
  '  theme                   flip between light and dark',
  '  joke                    a (probably bad) joke',
  '  clear                   wipe the screen',
  '  echo <text>             repeat after me',
  '  exit                    minimise the burrow',
  '',
  'tip: try `sudo hire-me` 🥕',
]

const JOKES = [
  'why did the dev rabbit refuse caffeine? he was already running on hops.',
  'i tried to write a recursive function but i got stuck in an infinite hop.',
  'my favourite design pattern? the singleton. it’s a lone bun-ny.',
  'i told my carrots a CSS joke. they didn’t respond — guess they were unstyled.',
  'how does pompu deploy? he just lets it loose into the wild.',
  '404: carrot not found.',
]

const SECTIONS = ['about', 'experience', 'projects', 'skills', 'contact'] as const

const SOCIALS = [
  '  github     https://github.com/vkajith',
  '  linkedin   https://linkedin.com/in/vysyakh-ajith',
  '  x          https://x.com/whyshagajith',
]

const PROJECTS = [
  '  ★ HabitAct          minimalist habit tracker  → https://habitact.vercel.app',
  '  ★ SpotOn AI         property analytics + AI   → https://spoton-ai.vercel.app',
  '  ☆ whatsapp-renderer react component library   → https://www.npmjs.com/package/whatsapp-chat-render',
]

const SKILLS = [
  '  languages   typescript · javascript · python',
  '  frontend    react · next.js · tailwind · framer-motion',
  '  backend     node · express · nestjs · fastapi · graphql',
  '  data        postgres · mongodb · firebase · supabase',
  '  vibes       building things people actually use 🐇',
]

const EXPERIENCE = [
  '  observe ai   sde ii · jul 2025 — present · agentic platform',
  '  anarock      sde ii · feb 2022 — jul 2025 · crm + marketing toolkit',
  '  nagarro      associate · aug 2021 — feb 2022 · invoicing + react migration',
]

const ABOUT_LINES = [
  'vysyakh ajith — software engineer.',
  'currently building agentic platform stuff at observe ai.',
  'previously: anarock (real-estate crm), nagarro.',
  'cares about: design × engineering, dev experience, shipping.',
  'pet rabbit (me): pompu 🐰',
]

const NOW_LINES = [
  '  shipping     agent building & analytics modules @ observe ai',
  '  learning     llm orchestration, eval pipelines',
  '  reading      whatever the algorithm throws at me',
  '  side quest   making this terminal cuter than it needs to be',
]

const POMPU_GREETINGS = [
  '*twitch twitch* hi! type `help` and i’ll show you around.',
  'oh hi 🥕 i was just napping. `help` for the menu.',
  'welcome! i’m pompu. small rabbit, big opinions. try `help`.',
]

let lineIdCounter = 0
const nextId = () => ++lineIdCounter

const scrollToSection = (id: string) => {
  if (typeof document === 'undefined') return false
  const el = document.getElementById(id)
  if (!el) return false
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  return true
}

interface SendState {
  active: boolean
  step: 'name' | 'email' | 'message' | null
  draft: { name: string; email: string; message: string }
}

const emptySend: SendState = {
  active: false,
  step: null,
  draft: { name: '', email: '', message: '' },
}

const Terminal = () => {
  const [open, setOpen] = useState(false)
  const [maximised, setMaximised] = useState(false)
  const [lines, setLines] = useState<Line[]>([])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIdx, setHistoryIdx] = useState<number | null>(null)
  const [sendState, setSendState] = useState<SendState>(emptySend)
  const [booted, setBooted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const { theme, toggleTheme } = useTheme()

  const append = useCallback((entries: Omit<Line, 'id'>[] | Omit<Line, 'id'>) => {
    setLines(prev => {
      const arr = Array.isArray(entries) ? entries : [entries]
      return [...prev, ...arr.map(e => ({ ...e, id: nextId() }))]
    })
  }, [])

  const boot = useCallback(async () => {
    if (booted) return
    setBooted(true)
    const seq: { kind: LineKind; text: string; delay: number }[] = [
      { kind: 'system', text: 'pompu-os v1.0 — booting…', delay: 250 },
      { kind: 'system', text: '[ok] mounting carrots.fs', delay: 220 },
      { kind: 'system', text: '[ok] warming up burrow', delay: 220 },
      { kind: 'system', text: '[ok] caffeinating vysyakh', delay: 220 },
      { kind: 'system', text: '[ok] ready.', delay: 200 },
      {
        kind: 'pompu',
        text: POMPU_GREETINGS[Math.floor(Math.random() * POMPU_GREETINGS.length)],
        delay: 220,
      },
    ]
    for (const step of seq) {
      await new Promise(r => setTimeout(r, step.delay))
      append({ kind: step.kind, text: step.text })
    }
  }, [append, booted])

  // Open helper used by external events (navbar, hero buttons)
  const openTerminal = useCallback(() => {
    setOpen(true)
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])

  useEffect(() => {
    if (open && !booted) boot()
  }, [open, booted, boot])

  // External command hook
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ command?: string; open?: boolean }>).detail || {}
      if (detail.open !== false) openTerminal()
      if (detail.command) {
        setTimeout(() => runCommand(detail.command as string), 350)
      }
    }
    window.addEventListener('terminal:run', handler as EventListener)
    return () => window.removeEventListener('terminal:run', handler as EventListener)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openTerminal])

  // Global hotkeys: / focuses, ⌘K toggles, Esc closes
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const typingElsewhere =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)

      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(o => !o)
        return
      }
      if (e.key === 'Escape' && open) {
        setOpen(false)
        return
      }
      if (e.key === '/' && !typingElsewhere && !open) {
        e.preventDefault()
        openTerminal()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, openTerminal])

  // Auto-scroll on new lines
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' })
  }, [lines])

  const runCommand = useCallback(
    async (raw: string) => {
      const cmd = raw.trim()
      if (!cmd) return

      // Always echo the input
      append({ kind: 'input', text: `${PROMPT} ${cmd}` })
      setHistory(h => [...h, cmd])
      setHistoryIdx(null)

      // Interactive `send` flow
      if (sendState.active) {
        if (cmd.toLowerCase() === 'cancel' || cmd.toLowerCase() === 'exit') {
          append({ kind: 'pompu', text: 'cancelled. no carrots harmed.' })
          setSendState(emptySend)
          return
        }
        if (sendState.step === 'name') {
          if (cmd.length < 2) {
            append({ kind: 'error', text: 'name must be at least 2 chars. try again or type cancel.' })
            return
          }
          setSendState(s => ({ ...s, step: 'email', draft: { ...s.draft, name: cmd } }))
          append({ kind: 'pompu', text: 'and your email? (we won’t spam you, rabbit’s honour)' })
          return
        }
        if (sendState.step === 'email') {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cmd)) {
            append({ kind: 'error', text: 'that doesn’t look like an email. try again or type cancel.' })
            return
          }
          setSendState(s => ({ ...s, step: 'message', draft: { ...s.draft, email: cmd } }))
          append({ kind: 'pompu', text: 'finally — your message (10 chars min):' })
          return
        }
        if (sendState.step === 'message') {
          if (cmd.length < 10) {
            append({ kind: 'error', text: 'a bit longer please (10+ chars).' })
            return
          }
          const draft = { ...sendState.draft, message: cmd }
          setSendState(emptySend)
          append({ kind: 'system', text: 'sending…' })
          try {
            const res = await fetch('/api/contact', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(draft),
            })
            if (!res.ok) {
              const err = await res.json().catch(() => ({}))
              throw new Error(err.error || 'send failed')
            }
            append({ kind: 'pompu', text: '✉️ off it goes! vysyakh will get back within 24–48h.' })
          } catch (err) {
            append({
              kind: 'error',
              text: `couldn’t send: ${err instanceof Error ? err.message : 'unknown error'}`,
            })
          }
          return
        }
      }

      const [head, ...rest] = cmd.split(/\s+/)
      const args = rest.join(' ')
      const c = head.toLowerCase()

      switch (c) {
        case 'help':
          append(HELP_LINES.map(text => ({ kind: 'output' as LineKind, text })))
          return
        case 'whoami':
          append({
            kind: 'pompu',
            text: 'a delightful human with excellent taste in portfolios. probably hiring? 👀',
          })
          return
        case 'about':
          append(ABOUT_LINES.map(text => ({ kind: 'output' as LineKind, text })))
          return
        case 'experience':
          append(EXPERIENCE.map(text => ({ kind: 'output' as LineKind, text })))
          if (scrollToSection('experience')) {
            append({ kind: 'pompu', text: 'hopping over to the experience section…' })
          }
          return
        case 'skills':
          append(SKILLS.map(text => ({ kind: 'output' as LineKind, text })))
          return
        case 'projects':
          append(PROJECTS.map(text => ({ kind: 'output' as LineKind, text })))
          if (scrollToSection('projects')) {
            append({ kind: 'pompu', text: 'scrolling you to the projects shelf 📦' })
          }
          return
        case 'contact':
          if (scrollToSection('contact')) {
            append({ kind: 'pompu', text: 'contact section incoming. or run `send` and i’ll do it for you.' })
          } else {
            append({ kind: 'output', text: 'try `send` to message right here.' })
          }
          return
        case 'send':
          setSendState({ active: true, step: 'name', draft: { name: '', email: '', message: '' } })
          append({ kind: 'pompu', text: 'okay! what’s your name? (type `cancel` to bail)' })
          return
        case 'resume':
          append({ kind: 'pompu', text: 'opening resume.pdf in a new tab…' })
          window.open('/resume.pdf', '_blank', 'noopener,noreferrer')
          return
        case 'social':
          append(SOCIALS.map(text => ({ kind: 'output' as LineKind, text })))
          return
        case 'now':
          append(NOW_LINES.map(text => ({ kind: 'output' as LineKind, text })))
          return
        case 'ls':
          append({ kind: 'output', text: SECTIONS.join('  ') })
          return
        case 'cd': {
          const target = args.trim().toLowerCase()
          if (!target) {
            append({ kind: 'error', text: 'usage: cd <section>. try `ls`.' })
            return
          }
          if (!(SECTIONS as readonly string[]).includes(target)) {
            append({ kind: 'error', text: `no such section: ${target}. try \`ls\`.` })
            return
          }
          if (scrollToSection(target)) {
            append({ kind: 'pompu', text: `→ ${target}` })
          }
          return
        }
        case 'theme':
          toggleTheme()
          append({ kind: 'pompu', text: `flipped to ${theme === 'light' ? 'dark' : 'light'} mode 🌗` })
          return
        case 'joke':
          append({ kind: 'pompu', text: JOKES[Math.floor(Math.random() * JOKES.length)] })
          return
        case 'echo':
          append({ kind: 'output', text: args })
          return
        case 'clear':
          setLines([])
          return
        case 'exit':
        case 'close':
          setOpen(false)
          return
        case 'sudo':
          if (rest.join(' ').toLowerCase() === 'hire-me') {
            append([
              { kind: 'pompu', text: 'permission granted. 🥕' },
              { kind: 'output', text: '→ run `send` to draft an offer, or `contact` for the form.' },
            ])
            return
          }
          append({ kind: 'error', text: `pompu: ${head} ${args}: permission denied (try \`sudo hire-me\`).` })
          return
        case 'pompu':
          append({
            kind: 'pompu',
            text: 'i’m pompu — vysyakh’s rabbit-shaped help bunny. small ears, large opinions.',
          })
          return
        case 'rm':
          append({ kind: 'error', text: 'nice try. this rabbit doesn’t do destructive ops.' })
          return
        default:
          append({
            kind: 'error',
            text: `pompu: command not found: ${head}. type \`help\` to see what i can do.`,
          })
      }
    },
    [append, sendState, theme, toggleTheme],
  )

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const value = input
    setInput('')
    runCommand(value)
  }

  const onInputKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length === 0) return
      const idx = historyIdx === null ? history.length - 1 : Math.max(0, historyIdx - 1)
      setHistoryIdx(idx)
      setInput(history[idx])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIdx === null) return
      const idx = historyIdx + 1
      if (idx >= history.length) {
        setHistoryIdx(null)
        setInput('')
      } else {
        setHistoryIdx(idx)
        setInput(history[idx])
      }
    } else if (e.key === 'l' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      setLines([])
    }
  }

  const lineClass = (kind: LineKind) => {
    switch (kind) {
      case 'input':
        return 'text-gray-200'
      case 'system':
        return 'text-emerald-300/80'
      case 'pompu':
        return 'text-pink-300'
      case 'error':
        return 'text-red-300'
      default:
        return 'text-gray-300'
    }
  }

  // Collapsed dock (always visible)
  return (
    <>
      {/* Bottom dock */}
      <motion.button
        type="button"
        onClick={() => (open ? setOpen(false) : openTerminal())}
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between gap-3 px-4 sm:px-6 py-3 bg-gray-950/90 dark:bg-black/85 backdrop-blur border-t border-indigo-500/30 text-gray-200 hover:bg-gray-900 transition-colors text-left"
        aria-label="Toggle Pompu terminal"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-lg">🐰</span>
          <div className="min-w-0">
            <div className="font-mono text-xs sm:text-sm text-gray-200 truncate">
              <span className="text-emerald-400">pompu@portfolio</span>
              <span className="text-gray-500"> ~ </span>
              <span className="text-gray-400">$</span>
              <span className="ml-2 text-gray-300">type `help` for tricks</span>
              <span className="ml-1 inline-block w-2 h-4 align-middle bg-emerald-400 animate-pulse" />
            </div>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-gray-400 shrink-0">
          <kbd className="px-1.5 py-0.5 rounded bg-gray-800 border border-gray-700">/</kbd>
          <span>focus</span>
          <kbd className="px-1.5 py-0.5 rounded bg-gray-800 border border-gray-700">⌘K</kbd>
          <span>toggle</span>
        </div>
        <FiTerminal className="sm:hidden text-gray-300 w-5 h-5 shrink-0" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
              onClick={() => setOpen(false)}
            />

            {/* Terminal panel */}
            <motion.section
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              className={`fixed left-0 right-0 bottom-0 z-50 ${
                maximised ? 'top-0 sm:top-12' : 'top-auto'
              } sm:left-4 sm:right-4 ${
                maximised ? 'sm:bottom-4' : 'sm:bottom-14'
              } sm:rounded-xl shadow-2xl border border-indigo-500/40 bg-[#0b0d12] flex flex-col font-mono`}
              style={{ maxHeight: maximised ? '100vh' : '70vh', height: maximised ? '100vh' : '70vh' }}
              role="dialog"
              aria-label="Pompu terminal"
              onClick={() => inputRef.current?.focus()}
            >
              {/* Title bar */}
              <header className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-950 sm:rounded-t-xl">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-3 h-3 rounded-full bg-red-500/80" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <span className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="ml-3 text-gray-400">🐰 pompu — /portfolio</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setMaximised(m => !m) }}
                    className="p-1.5 hover:bg-gray-800 rounded"
                    aria-label={maximised ? 'Restore' : 'Maximise'}
                  >
                    {maximised ? <FiMinimize2 className="w-3.5 h-3.5" /> : <FiMaximize2 className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setOpen(false) }}
                    className="p-1.5 hover:bg-gray-800 rounded"
                    aria-label="Close"
                  >
                    <FiX className="w-3.5 h-3.5" />
                  </button>
                </div>
              </header>

              {/* Body */}
              <div
                ref={bodyRef}
                className="flex-1 overflow-y-auto px-4 py-3 text-sm leading-relaxed terminal-scanlines"
              >
                {lines.length === 0 && !booted && (
                  <p className="text-gray-500">click anywhere — pompu boots when you do.</p>
                )}
                {lines.map(line => (
                  <pre
                    key={line.id}
                    className={`whitespace-pre-wrap break-words font-mono ${lineClass(line.kind)}`}
                  >
                    {line.kind === 'pompu' ? `${POMPU} » ${line.text}` : line.text}
                  </pre>
                ))}
              </div>

              {/* Input */}
              <form
                onSubmit={onSubmit}
                className="flex items-center gap-2 px-4 py-3 border-t border-gray-800 bg-[#0b0d12] sm:rounded-b-xl"
              >
                <span className="text-emerald-400 text-sm shrink-0">
                  {sendState.active
                    ? `pompu (${sendState.step}) →`
                    : PROMPT}
                </span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={onInputKey}
                  spellCheck={false}
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  className="flex-1 bg-transparent outline-none text-gray-100 placeholder:text-gray-600 text-sm"
                  placeholder={sendState.active ? '' : 'type a command…'}
                  aria-label="Terminal input"
                />
              </form>
            </motion.section>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Terminal
