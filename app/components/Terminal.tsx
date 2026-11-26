'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { ArrowUpRight, CalendarPlus, Minus, Rabbit } from 'lucide-react'
import { commandReply, PompuAction, PompuReply } from '@/app/lib/context'
import { openPompu, PompuOpenDetail } from '@/app/lib/pompuEvents'
import BookingWidget from './BookingWidget'

type Message = {
  type: 'system' | 'user' | 'response'
  content: string
  actions?: PompuAction[]
}

type HistoryMessage = { role: 'user' | 'model'; content: string }

const SESSION_KEY = 'pompu-conversation-v2'
const SUGGESTIONS = ['What does he build?', 'How do the evals work?', 'Is he open to roles?']

const SLASH_COMMANDS: Record<string, string> = {
  '/help': 'help',
  '/about': 'about',
  '/experience': 'experience',
  '/systems': 'systems',
  '/skills': 'skills',
  '/contact': 'contact',
  '/photography': 'photography',
  '/resume': 'resume',
  '/book': 'book',
  '/pompu': 'pompu',
  '/carrot': 'carrot',
}

function moodForHour(h: number): { label: string; greeting: string } {
  if (h < 6) return { label: 'sleepy', greeting: "Pompu is half-asleep, but knows Vysyakh's work inside out. Ask away." }
  if (h < 12) return { label: 'energetic', greeting: "Morning! Ask Pompu anything about Vysyakh's work — or book a call." }
  if (h < 17) return { label: 'curious', greeting: "Hi! Ask Pompu about Vysyakh's agent platform work — or book a call." }
  if (h < 21) return { label: 'chatty', greeting: "Evening! Ask Pompu about Vysyakh's agent platform work — or grab time on his calendar." }
  return { label: 'cozy', greeting: 'Late one? Ask about the work, or book a call for tomorrow.' }
}

const INTERACTIVE = 'input, textarea, button, a, select, form, .booking-widget'

export default function Terminal({
  variant = 'hero',
  onMinimize,
}: {
  variant?: 'hero' | 'dock'
  onMinimize?: () => void
}) {
  const mood = useMemo(() => moodForHour(new Date().getHours()), [])
  const [messages, setMessages] = useState<Message[]>([{ type: 'system', content: mood.greeting }])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [booking, setBooking] = useState(false)
  const [history, setHistory] = useState<string[]>([])
  const [historyIdx, setHistoryIdx] = useState<number | null>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const submitRef = useRef<(q: string) => void>(() => {})

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY)
      if (saved) {
        const restored = JSON.parse(saved) as Message[]
        if (Array.isArray(restored) && restored.length) setMessages(restored)
      }
    } catch {
      // A fresh conversation is a safe fallback.
    } finally {
      setHydrated(true)
    }
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(messages.slice(-20)))
    } catch {}
  }, [hydrated, messages])

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    })
  }, [])
  useEffect(() => scrollToBottom(), [messages, isTyping, booking, scrollToBottom])

  const focusInput = useCallback(() => {
    setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 60)
  }, [])

  // Autofocus on desktop only — on mobile it pops the keyboard unasked.
  useEffect(() => {
    if (window.matchMedia('(pointer: fine)').matches) inputRef.current?.focus({ preventScroll: true })
  }, [])

  // '/' anywhere → open + focus Pompu.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== '/' || event.metaKey || event.ctrlKey) return
      const target = event.target as HTMLElement | null
      if (target?.closest('input, textarea, [contenteditable="true"]')) return
      event.preventDefault()
      openPompu()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const addReply = useCallback((reply: PompuReply) => {
    setMessages((current) => [...current, { type: 'response', content: reply.message, actions: reply.actions }])
  }, [])

  const startBooking = useCallback(() => {
    setBooking(true)
  }, [])

  // External triggers (CommandPalette, Contact, hero buttons).
  useEffect(() => {
    const onOpen = (event: Event) => {
      const detail = (event as CustomEvent<PompuOpenDetail>).detail ?? {}
      if (variant === 'hero') document.getElementById('pompu')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      if (detail.book) startBooking()
      else if (detail.prompt) submitRef.current(detail.prompt)
      focusInput()
    }
    window.addEventListener('pompu:open', onOpen)
    return () => window.removeEventListener('pompu:open', onOpen)
  }, [variant, startBooking, focusInput])

  const runAction = (action: PompuAction) => {
    if (action.kind === 'book') return startBooking()
    if (action.kind === 'scroll') {
      onMinimize?.()
      document.querySelector(action.target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    window.open(action.target, '_blank', 'noopener,noreferrer')
  }

  const conversationHistory = (): HistoryMessage[] =>
    messages
      .filter((m): m is Message & { type: 'user' | 'response' } => m.type === 'user' || m.type === 'response')
      .slice(-8)
      .map((m) => ({ role: m.type === 'user' ? 'user' : 'model', content: m.content }))

  const handleSubmit = async (query: string) => {
    if (!query.trim() || isTyping) return
    const userMessage = query.trim()
    const slash = userMessage.toLowerCase()
    setInput('')
    setHistory((current) => (current.at(-1) === userMessage ? current : [...current, userMessage]))
    setHistoryIdx(null)

    if (slash === '/clear') {
      setMessages([{ type: 'system', content: mood.greeting }])
      setBooking(false)
      try { sessionStorage.removeItem(SESSION_KEY) } catch {}
      return
    }

    setMessages((current) => [...current, { type: 'user', content: userMessage }])
    if (slash === '/carrot') window.dispatchEvent(new CustomEvent('pompu:carrot-rain'))

    const command = SLASH_COMMANDS[slash]
    if (command) {
      addReply(commandReply(command))
      if (command === 'book') startBooking()
      return
    }

    setIsTyping(true)
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, history: conversationHistory() }),
      })
      const data = (await response.json()) as { reply?: PompuReply }
      const reply = data.reply ?? commandReply('contact')
      addReply(reply)
      // A clear "book me in" request opens the picker straight away.
      if (reply.intent === 'booking') startBooking()
    } catch {
      addReply(commandReply('contact'))
    } finally {
      setIsTyping(false)
    }
  }
  submitRef.current = handleSubmit

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') return void handleSubmit(input)
    if (event.key === 'Escape' && onMinimize) return onMinimize()
    if (event.key === 'ArrowUp') {
      if (!history.length) return
      event.preventDefault()
      const next = historyIdx === null ? history.length - 1 : Math.max(0, historyIdx - 1)
      setHistoryIdx(next)
      setInput(history[next])
    }
    if (event.key === 'ArrowDown' && historyIdx !== null) {
      event.preventDefault()
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

  const showSuggestions = messages.length <= 1 && !isTyping && !booking
  const lastMessage = messages[messages.length - 1]
  const askedQuestions = new Set(
    messages.filter((m) => m.type === 'user').map((m) => m.content.toLowerCase())
  )
  const followUps = SUGGESTIONS.filter((s) => !askedQuestions.has(s.toLowerCase())).slice(0, 2)
  const showFollowUps =
    !isTyping && !booking && lastMessage?.type === 'response' && followUps.length > 0
  const lastResponseIdx = messages.map((m) => m.type).lastIndexOf('response')
  const chip = 'tag-interactive text-[10.5px] font-medium px-2 py-0.5 rounded-full border border-[var(--accent)]/40 text-[var(--accent)]'

  return (
    <div
      id="pompu"
      className={`pompu-card rounded-xl overflow-hidden flex flex-col relative h-full ${variant === 'dock' ? 'pompu-card--dock' : ''}`}
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
      onClick={(event) => {
        if (!(event.target as HTMLElement).closest(INTERACTIVE)) inputRef.current?.focus({ preventScroll: true })
      }}
    >
      <div className="flex items-center gap-2 px-3.5 py-2 shrink-0" style={{ borderBottom: '1px solid var(--border-color)' }}>
        <Rabbit className={`w-[14px] h-[14px] text-[var(--accent)] ${isTyping || input ? 'ear-twitch' : ''}`} aria-hidden />
        <span className="text-[12px] font-mono text-[var(--text-primary)] tracking-wide">pompu</span>
        <span className="text-[11px] text-[var(--text-muted)] font-mono">·</span>
        <span className="text-[11px] text-[var(--text-muted)] font-mono italic">{booking ? 'booking' : mood.label}</span>
        <div className="ml-auto flex items-center gap-2">
          {!booking && (
            <button onClick={startBooking} className="flex items-center gap-1 text-[10.5px] font-mono text-[var(--accent)] hover:opacity-80" title="Book a call with Vysyakh">
              <CalendarPlus className="w-3 h-3" aria-hidden /> book
            </button>
          )}
          {onMinimize ? (
            <button onClick={onMinimize} className="text-[var(--text-muted)] hover:text-[var(--accent)]" aria-label="Minimise Pompu" title="Minimise (esc)">
              <Minus className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="hidden sm:flex items-center gap-1 text-[10px] text-[var(--text-muted)] font-mono">
              <kbd className="px-1 py-[1px] rounded border border-[var(--border-color)]">/</kbd>focus
            </span>
          )}
        </div>
      </div>

      <div ref={scrollRef} data-lenis-prevent className="flex-1 overflow-y-auto overscroll-contain px-3.5 py-2.5 pompu-scroll font-mono text-[12.5px] leading-[1.65] relative" aria-live="polite">
        <span aria-hidden className="pointer-events-none select-none absolute right-2 bottom-1 text-[44px] opacity-[0.06] leading-none">🥕</span>
        <div className="flex min-h-full flex-col justify-end gap-2.5">
          {messages.map((message, index) => (
            <div key={`${message.type}-${index}`} className="animate-fade-in-up" style={{ animationDelay: `${Math.min(index, 4) * 0.03}s` }}>
              {message.type === 'system' && (
                <div className="flex items-start gap-2">
                  <span className="pompu-avatar"><Rabbit className="w-3 h-3" aria-hidden /></span>
                  <div className="pompu-bubble pompu-bubble--pompu pompu-bubble--muted w-fit text-[11.5px]">{message.content}</div>
                </div>
              )}
              {message.type === 'user' && (
                <div className="flex justify-end">
                  <div className="pompu-bubble pompu-bubble--user max-w-[85%] text-[12px]">{message.content}</div>
                </div>
              )}
              {message.type === 'response' && (
                <div className="flex items-start gap-2">
                  <span className="pompu-avatar"><Rabbit className="w-3 h-3" aria-hidden /></span>
                  <div className="min-w-0 flex-1">
                    <div className="pompu-bubble pompu-bubble--pompu w-fit whitespace-pre-wrap text-[12px]">{message.content}</div>
                    {(message.actions?.length ?? 0) > 0 && index === lastResponseIdx && !booking ? (
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {message.actions!.map((action) => (
                          <button key={`${action.label}-${action.target}`} onClick={() => runAction(action)} className={chip}>
                            {action.label}
                            {action.kind === 'book' ? <CalendarPlus className="inline w-2.5 h-2.5 ml-1" aria-hidden /> : <ArrowUpRight className="inline w-2.5 h-2.5 ml-1" aria-hidden />}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start gap-2">
              <span className="pompu-avatar"><Rabbit className="w-3 h-3 ear-twitch" aria-hidden /></span>
              <div className="pompu-bubble pompu-bubble--pompu w-fit flex items-center gap-1">
                <span className="typing-dot text-[8px]">●</span>
                <span className="typing-dot text-[8px]">●</span>
                <span className="typing-dot text-[8px]">●</span>
              </div>
            </div>
          )}

          {booking && (
            <BookingWidget
              onCancel={() => setBooking(false)}
              onBooked={(summary) => {
                setBooking(false)
                addReply({ message: summary, intent: 'booking' })
                window.dispatchEvent(new CustomEvent('pompu:carrot-rain'))
              }}
            />
          )}

          {showSuggestions && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => handleSubmit(s)} className={chip}>{s}</button>
              ))}
              <button onClick={startBooking} className={chip}>
                Book a call <CalendarPlus className="inline w-2.5 h-2.5 ml-0.5" aria-hidden />
              </button>
            </div>
          )}

          {showFollowUps && (
            <div className="flex flex-wrap gap-1.5 pl-7">
              {followUps.map((s) => (
                <button key={s} onClick={() => handleSubmit(s)} className={chip}>{s}</button>
              ))}
              <button onClick={startBooking} className={chip}>
                Book a call <CalendarPlus className="inline w-2.5 h-2.5 ml-0.5" aria-hidden />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center px-3.5 py-2 shrink-0" style={{ borderTop: '1px solid var(--border-color)', background: 'var(--accent-soft-05)' }}>
        <span className="text-[var(--accent)] text-[12.5px] font-mono neon-glow">❯</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          // Never disable: a disabled input drops focus, so the visitor's next
          // keystrokes would land on the page (spaces scroll it). Sending is
          // blocked in handleSubmit while a reply is pending instead.
          aria-busy={isTyping}
          aria-label="Ask Pompu"
          spellCheck={false}
          autoComplete="off"
          placeholder={isTyping ? 'pompu is thinking…' : 'ask about the work, or say "book a call"'}
          className="pompu-input flex-1 ml-2 bg-transparent outline-none border-none m-0 p-0 font-mono text-[12.5px] leading-[18px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
        />
        {isFocused && <span aria-hidden className="cursor-blink text-[var(--accent)]">▎</span>}
      </div>
    </div>
  )
}
