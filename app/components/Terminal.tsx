'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { Rabbit } from 'lucide-react'
import { FALLBACK_RESPONSES } from '@/app/lib/context'

interface Message {
  type: 'system' | 'user' | 'response' | 'error'
  content: string
}

const SUGGESTIONS = ['about', 'experience', 'projects', 'skills']

// Slash commands handled instantly client-side (no API hop).
const SLASH_COMMANDS: Record<string, string> = {
  '/help': FALLBACK_RESPONSES.help,
  '/about': FALLBACK_RESPONSES.about,
  '/experience': FALLBACK_RESPONSES.experience,
  '/projects': FALLBACK_RESPONSES.projects,
  '/skills': FALLBACK_RESPONSES.skills,
  '/contact': FALLBACK_RESPONSES.contact,
  '/resume': FALLBACK_RESPONSES.resume,
  '/pompu': FALLBACK_RESPONSES.pompu,
  '/carrot': FALLBACK_RESPONSES.carrot,
  '/clear': '__CLEAR__',
}

function moodForHour(h: number): { label: string; greeting: string } {
  if (h < 6)  return { label: 'sleepy',    greeting: 'shh — Pompu is half-asleep, but still here. ask away ↓' }
  if (h < 12) return { label: 'energetic', greeting: 'morning! Pompu has had three carrots. ready when you are ↓' }
  if (h < 17) return { label: 'curious',   greeting: 'hi! Pompu is poking around. ask anything ↓' }
  if (h < 21) return { label: 'chatty',    greeting: 'evenings hit different. Pompu is in the mood to chat ↓' }
  return        { label: 'cozy',      greeting: 'late one, huh? Pompu put the kettle on. ask away ↓' }
}

export default function Terminal() {
  const mood = useMemo(() => moodForHour(new Date().getHours()), [])

  const [messages, setMessages] = useState<Message[]>([
    { type: 'system', content: mood.greeting },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [displayedResponse, setDisplayedResponse] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)

  // ↑/↓ command history
  const [history, setHistory] = useState<string[]>([])
  const [historyIdx, setHistoryIdx] = useState<number | null>(null)

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, displayedResponse, scrollToBottom])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Global `/` keybinding — focuses Pompu from anywhere on the page.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== '/') return
      const t = e.target as HTMLElement | null
      const tag = t?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || t?.isContentEditable) return
      e.preventDefault()
      inputRef.current?.focus()
      inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const animateResponse = useCallback((text: string) => {
    setIsAnimating(true)
    setDisplayedResponse('')
    let i = 0
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedResponse(text.slice(0, i + 1))
        i++
      } else {
        clearInterval(interval)
        setIsAnimating(false)
        setDisplayedResponse('')
        setMessages((prev) => [...prev, { type: 'response', content: text }])
      }
    }, 14)
    return () => clearInterval(interval)
  }, [])

  const pushHistory = (q: string) => {
    setHistory((h) => (h[h.length - 1] === q ? h : [...h, q]))
    setHistoryIdx(null)
  }

  const handleSubmit = async (query: string) => {
    if (!query.trim() || isTyping || isAnimating) return

    const userMessage = query.trim()
    setInput('')
    pushHistory(userMessage)
    setMessages((prev) => [...prev, { type: 'user', content: userMessage }])

    // Slash-command short-circuit — no network hit.
    const slashKey = userMessage.toLowerCase()
    if (slashKey in SLASH_COMMANDS) {
      const reply = SLASH_COMMANDS[slashKey]
      if (reply === '__CLEAR__') {
        setMessages([{ type: 'system', content: mood.greeting }])
        return
      }
      if (slashKey === '/carrot') {
        window.dispatchEvent(new CustomEvent('pompu:carrot-rain'))
      }
      animateResponse(reply)
      return
    }

    setIsTyping(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      })

      const data = await res.json()
      setIsTyping(false)

      if (data.error) {
        setMessages((prev) => [...prev, { type: 'error', content: data.error }])
      } else {
        animateResponse(data.reply)
      }
    } catch {
      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        { type: 'error', content: 'connection wobbled. try once more?' },
      ])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(input)
      return
    }
    if (e.key === 'ArrowUp') {
      if (history.length === 0) return
      e.preventDefault()
      const next = historyIdx === null ? history.length - 1 : Math.max(0, historyIdx - 1)
      setHistoryIdx(next)
      setInput(history[next])
      return
    }
    if (e.key === 'ArrowDown') {
      if (historyIdx === null) return
      e.preventDefault()
      const next = historyIdx + 1
      if (next >= history.length) {
        setHistoryIdx(null)
        setInput('')
      } else {
        setHistoryIdx(next)
        setInput(history[next])
      }
    }
  }

  const handleTerminalClick = () => {
    inputRef.current?.focus()
  }

  const showSuggestions = messages.length <= 1 && !isTyping && !isAnimating
  const earTwitch = isTyping || isAnimating || input.length > 0
  const [isFocused, setIsFocused] = useState(false)
  const inputDisabled = isTyping || isAnimating
  const showBlockCursor = isFocused && !inputDisabled

  return (
    <div
      className="pompu-card rounded-xl overflow-hidden flex flex-col relative group/terminal transition-all duration-300"
      style={{
        height: 'clamp(220px, 30vh, 300px)',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
      }}
      onClick={handleTerminalClick}
    >
      {/* Header — slim, native to the page */}
      <div
        className="flex items-center gap-2 px-3.5 py-2 shrink-0"
        style={{ borderBottom: '1px solid var(--border-color)' }}
      >
        <Rabbit
          className={`w-[14px] h-[14px] text-[var(--accent)] ${earTwitch ? 'ear-twitch' : ''}`}
          aria-hidden
        />
        <span className="text-[12px] font-mono text-[var(--text-primary)] tracking-wide">pompu</span>
        <span className="text-[11px] text-[var(--text-muted)] font-mono">·</span>
        <span className="text-[11px] text-[var(--text-muted)] font-mono italic">{mood.label}</span>

        <span className="ml-auto flex items-center gap-1 text-[10px] text-[var(--text-muted)] font-mono">
          <kbd className="px-1 py-[1px] rounded border border-[var(--border-color)]">/</kbd>
          <span>focus</span>
        </span>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-3.5 py-2.5 space-y-2 pompu-scroll font-mono text-[12.5px] leading-[1.65] relative"
      >
        {/* Carrot watermark — quiet, decorative */}
        <span
          aria-hidden
          className="pointer-events-none select-none absolute right-2 bottom-1 text-[44px] opacity-[0.06] leading-none"
        >
          🥕
        </span>
        {messages.map((msg, i) => (
          <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.03}s` }}>
            {msg.type === 'system' && (
              <div className="text-[var(--text-muted)] italic text-[11.5px] flex items-start gap-1.5">
                <Rabbit className="w-3 h-3 mt-[3px] text-[var(--accent)] shrink-0" aria-hidden />
                <span>{msg.content}</span>
              </div>
            )}
            {msg.type === 'user' && (
              <div className="mt-1.5">
                <span className="text-[var(--accent)] neon-glow">❯</span>
                <span className="text-[var(--text-primary)] ml-1.5">{msg.content}</span>
              </div>
            )}
            {msg.type === 'response' && (
              <div
                className="text-[var(--text-secondary)] leading-[1.7] whitespace-pre-wrap ml-3 py-0.5 flex items-start gap-1.5"
                style={{ borderLeft: '2px solid var(--accent-soft-35)', paddingLeft: '8px' }}
              >
                <Rabbit className="w-3 h-3 mt-[3px] text-[var(--accent)] shrink-0" aria-hidden />
                <span>{msg.content}</span>
              </div>
            )}
            {msg.type === 'error' && (
              <div className="text-[#b04040] text-[11.5px]">✗ {msg.content}</div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-1.5 mt-1 ml-3 text-[var(--text-muted)]">
            <Rabbit className="w-3 h-3 text-[var(--accent)] ear-twitch" aria-hidden />
            <span className="typing-dot text-[8px]">●</span>
            <span className="typing-dot text-[8px]">●</span>
            <span className="typing-dot text-[8px]">●</span>
          </div>
        )}

        {/* Animated response */}
        {isAnimating && displayedResponse && (
          <div
            className="text-[var(--text-secondary)] leading-[1.7] whitespace-pre-wrap ml-3 py-0.5 flex items-start gap-1.5"
            style={{ borderLeft: '2px solid var(--accent)', paddingLeft: '8px' }}
          >
            <Rabbit className="w-3 h-3 mt-[3px] text-[var(--accent)] ear-twitch shrink-0" aria-hidden />
            <span>
              {displayedResponse}
              <span className="cursor-blink text-[var(--accent)] ml-0.5">▎</span>
            </span>
          </div>
        )}

        {/* Suggestion chips — same shape as the experience/project tags */}
        {showSuggestions && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={(e) => {
                  e.stopPropagation()
                  handleSubmit(s)
                }}
                className="tag-interactive text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-[var(--accent)]/40 text-[var(--accent)] cursor-pointer"
              >
                {s}
              </button>
            ))}
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleSubmit('/carrot')
              }}
              className="text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-dashed border-[var(--accent)]/40 text-[var(--accent)]/80 cursor-pointer hover:bg-[var(--accent)]/5 transition-colors"
              title="try it"
            >
              <span aria-hidden className="mr-0.5">🥕</span>/carrot
            </button>
          </div>
        )}
      </div>

      {/* Input — terminal-style: invisible real input layered under a styled
          fake render so we can show a true block cursor right after the text. */}
      <div
        className="flex items-center px-3.5 py-2 shrink-0"
        style={{
          borderTop: '1px solid var(--border-color)',
          background: 'var(--accent-soft-05)',
        }}
      >
        <span className="text-[var(--accent)] text-[12.5px] font-mono neon-glow">❯</span>

        <div className="relative flex-1 ml-2 h-[18px] font-mono text-[12.5px] leading-[18px]">
          {/* Visible: fake input (typed text + block caret) */}
          <div
            aria-hidden
            className="pointer-events-none whitespace-pre overflow-hidden"
          >
            {input ? (
              <span className="text-[var(--text-primary)]">{input}</span>
            ) : (
              <span className="text-[var(--text-muted)]">
                {inputDisabled ? 'pompu is thinking…' : 'ask pompu anything (/help)'}
              </span>
            )}
            {showBlockCursor && (
              <span className="cursor-blink text-[var(--accent)]">▎</span>
            )}
          </div>

          {/* Invisible: real input — owns keyboard, selection, focus state */}
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={inputDisabled}
            aria-label="Ask Pompu"
            spellCheck={false}
            autoComplete="off"
            className="pompu-input absolute inset-0 w-full bg-transparent outline-none border-none m-0 p-0 font-mono text-[12.5px] leading-[18px]"
            style={{
              color: 'transparent',
              caretColor: 'transparent',
              WebkitTextFillColor: 'transparent',
            }}
          />
        </div>
      </div>
    </div>
  )
}
