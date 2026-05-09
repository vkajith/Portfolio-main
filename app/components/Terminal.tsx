'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface Message {
  type: 'system' | 'user' | 'response' | 'error'
  content: string
}

const SUGGESTIONS = [
  'about',
  'experience',
  'projects',
  'skills',
]

export default function Terminal() {
  const [messages, setMessages] = useState<Message[]>([
    { type: 'system', content: 'welcome to vysyakh.sh — ask me anything ↓' },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [displayedResponse, setDisplayedResponse] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
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
        setMessages(prev => [...prev, { type: 'response', content: text }])
      }
    }, 15)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (query: string) => {
    if (!query.trim() || isTyping || isAnimating) return

    const userMessage = query.trim()
    setInput('')
    setMessages(prev => [...prev, { type: 'user', content: userMessage }])
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
        setMessages(prev => [...prev, { type: 'error', content: data.error }])
      } else {
        animateResponse(data.reply)
      }
    } catch {
      setIsTyping(false)
      setMessages(prev => [...prev, { type: 'error', content: 'Connection error. Try again.' }])
    }
  }

  const handleTerminalClick = () => {
    inputRef.current?.focus()
  }

  const showSuggestions = messages.length <= 1 && !isTyping && !isAnimating

  return (
    <div
      className="rounded-xl overflow-hidden flex flex-col relative group/terminal"
      style={{
        height: 'clamp(220px, 32vh, 320px)',
        background: 'linear-gradient(145deg, #111111, #0a0a0a)',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.03)',
      }}
      onClick={handleTerminalClick}
    >
      {/* Subtle accent glow on the terminal top edge */}
      <div
        className="absolute top-0 left-4 right-4 h-px opacity-0 group-hover/terminal:opacity-100 transition-opacity duration-500"
        style={{ background: 'linear-gradient(90deg, transparent, var(--accent), transparent)' }}
      />

      {/* Header */}
      <div className="flex items-center gap-2 px-3.5 py-2 shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="flex gap-1.5">
          <div className="w-[9px] h-[9px] rounded-full bg-[#ff5f57]/80 hover:bg-[#ff5f57] transition-colors" />
          <div className="w-[9px] h-[9px] rounded-full bg-[#febc2e]/80 hover:bg-[#febc2e] transition-colors" />
          <div className="w-[9px] h-[9px] rounded-full bg-[#28c840]/80 hover:bg-[#28c840] transition-colors" />
        </div>
        <span className="text-[10px] text-[#444] font-mono ml-auto tracking-wide">vysyakh.sh</span>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-3.5 py-2.5 space-y-2 terminal-scroll font-mono text-[12px] leading-[1.6]"
      >
        {messages.map((msg, i) => (
          <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
            {msg.type === 'system' && (
              <div className="text-[#555] italic text-[11px]">{msg.content}</div>
            )}
            {msg.type === 'user' && (
              <div className="mt-1.5">
                <span className="text-[var(--accent)]">❯</span>
                <span className="text-[#d4d4d4] ml-1.5">{msg.content}</span>
              </div>
            )}
            {msg.type === 'response' && (
              <div className="text-[#999] leading-[1.7] whitespace-pre-wrap ml-3 py-0.5" style={{ borderLeft: '2px solid rgba(107,127,62,0.2)', paddingLeft: '8px' }}>
                {msg.content}
              </div>
            )}
            {msg.type === 'error' && (
              <div className="text-[#e55] text-[11px]">✗ {msg.content}</div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-1 mt-1 ml-3 text-[#555]">
            <span className="typing-dot text-[8px]">●</span>
            <span className="typing-dot text-[8px]">●</span>
            <span className="typing-dot text-[8px]">●</span>
          </div>
        )}

        {/* Animated response */}
        {isAnimating && displayedResponse && (
          <div className="text-[#999] leading-[1.7] whitespace-pre-wrap ml-3 py-0.5" style={{ borderLeft: '2px solid rgba(107,127,62,0.3)', paddingLeft: '8px' }}>
            {displayedResponse}
            <span className="cursor-blink text-[var(--accent)] ml-0.5">▎</span>
          </div>
        )}

        {/* Suggestion chips */}
        {showSuggestions && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); handleSubmit(s) }}
                className="text-[10px] px-2.5 py-[3px] rounded-full text-[#666] transition-all duration-200 cursor-pointer hover:text-[var(--accent)]"
                style={{
                  border: '1px solid rgba(255,255,255,0.06)',
                  background: 'rgba(255,255,255,0.02)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(107,127,62,0.3)'
                  e.currentTarget.style.background = 'rgba(107,127,62,0.05)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex items-center px-3.5 py-2 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.01)' }}>
        <span className="text-[var(--accent)] text-[12px] font-mono">❯</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit(input)}
          placeholder="ask me anything..."
          disabled={isTyping || isAnimating}
          className="flex-1 bg-transparent text-[#d4d4d4] text-[12px] font-mono outline-none placeholder:text-[#333] disabled:opacity-40 ml-2"
        />
        {!input && !isTyping && !isAnimating && (
          <span className="cursor-blink text-[var(--accent)] font-mono text-[11px]">▎</span>
        )}
      </div>
    </div>
  )
}
