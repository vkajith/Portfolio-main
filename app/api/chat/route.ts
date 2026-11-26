import { NextRequest, NextResponse } from 'next/server'
import { BOOK_ACTION, getFallbackResponse, PompuReply, VYSYAKH_CONTEXT } from '@/app/lib/context'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
// gemini-2.0-flash and gemini-2.5-flash have both been retired for new API
// keys as of late 2026 (calls 404). gemini-3.8-flash works but takes 5-8s
// even at thinkingLevel "low" — too slow for a chat UI. flash-lite at
// "minimal" thinking answers in ~1-2s with plenty of quality for short,
// in-character replies.
const GEMINI_MODEL = 'gemini-3.5-flash-lite'
const MAX_HISTORY = 8

// Simple in-memory sliding-window rate limit. Resets on redeploy/cold start,
// which is an acceptable trade-off for a low-traffic personal site — it just
// needs to stop a naive script loop from burning the Gemini quota.
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_REQUESTS = 12
const requestLog = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const timestamps = (requestLog.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
  timestamps.push(now)
  requestLog.set(ip, timestamps)
  // Bound memory: drop stale IPs occasionally.
  if (requestLog.size > 500) {
    for (const [key, values] of requestLog) {
      if (!values.some((t) => now - t < RATE_LIMIT_WINDOW_MS)) requestLog.delete(key)
    }
  }
  return timestamps.length > RATE_LIMIT_MAX_REQUESTS
}

type ChatMessage = { role: 'user' | 'model'; content: string }
const VALID_INTENTS = new Set<PompuReply['intent']>(['portfolio', 'systems', 'writing', 'booking', 'contact', 'clarify'])

function isPompuReply(value: unknown): value is PompuReply {
  if (!value || typeof value !== 'object') return false
  const reply = value as PompuReply
  return typeof reply.message === 'string' && reply.message.length > 0
}

// Gemini's responseSchema enum is advisory, not enforced — it has been
// observed returning values outside the declared enum. Never trust it
// without a runtime check; fall back to 'clarify' (no special UI meaning)
// rather than let an arbitrary string flow into typed state.
function normaliseIntent(intent: unknown): PompuReply['intent'] {
  return VALID_INTENTS.has(intent as PompuReply['intent']) ? (intent as PompuReply['intent']) : 'clarify'
}

export async function POST(request: NextRequest) {
  let rawMessage = ''
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown'
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { reply: { message: 'Pompu needs a moment to catch their breath — try again in a bit.', intent: 'clarify' } },
        { status: 429 }
      )
    }

    const { message, history = [] } = await request.json()
    rawMessage = typeof message === 'string' ? message : ''

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const groundedReply = getFallbackResponse(message)

    // No key at all: the curated route is the only option.
    if (!GEMINI_API_KEY) {
      return NextResponse.json({ reply: groundedReply })
    }

    const safeHistory = Array.isArray(history)
      ? history
          .filter((entry): entry is ChatMessage => entry?.role && typeof entry.content === 'string' && (entry.role === 'user' || entry.role === 'model'))
          .slice(-MAX_HISTORY)
      : []

    // For a matched topic, ask Gemini to rephrase the verified fact in Pompu's
    // voice instead of bypassing the model entirely — keeps replies varied
    // without letting the model invent anything beyond the grounded fact.
    // For an unmatched topic, Pompu answers freely and in character — general
    // knowledge, jokes, whatever — the only hard rule is not inventing new
    // "facts" about Vysyakh himself beyond what's listed above.
    const groundingInstruction =
      groundedReply.intent !== 'clarify'
        ? `${VYSYAKH_CONTEXT}\n\nA verified fact has already been matched for this question. Rephrase ONLY this fact in Pompu's voice — do not add new claims, numbers, or details beyond it:\n"${groundedReply.message}"`
        : `${VYSYAKH_CONTEXT}\n\nThis question isn't about a specific verified fact above. Answer it anyway, freely and helpfully, staying in Pompu's playful rabbit-concierge voice. The only rule: never invent new facts, numbers, or claims about Vysyakh himself beyond what's listed above — for anything about Vysyakh not covered there, say Pompu can't verify it. General knowledge, jokes, and casual chat are all fine.`

    const controller = new AbortController()
    // Gemini latency is spiky (1–7s, occasional 503s). Past 4.5s the grounded
    // reply is a better experience than waiting.
    const timeout = setTimeout(() => controller.abort(), 4500)
    let response: Response
    try {
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: groundingInstruction }] },
            contents: [
              ...safeHistory.map((entry) => ({ role: entry.role, parts: [{ text: entry.content }] })),
              { role: 'user', parts: [{ text: message }] },
            ],
            generationConfig: {
              maxOutputTokens: 260,
              temperature: 0.35,
              responseMimeType: 'application/json',
              responseSchema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  intent: { type: 'string', enum: ['portfolio', 'systems', 'writing', 'booking', 'contact', 'clarify'] },
                },
                required: ['message', 'intent'],
              },
              // gemini-3.5-flash-lite defaults to "minimal" thinking already,
              // but set it explicitly so a future model swap doesn't silently
              // re-enable slower reasoning for this short chat-length task.
              thinkingConfig: { thinkingLevel: 'minimal' },
            },
          }),
        }
      )
    } catch {
      // Timeout (AbortController) or network failure — the grounded reply
      // for THIS message is still a better answer than the generic
      // "something went wrong, contact Vysyakh" catch-all.
      return NextResponse.json({ reply: groundedReply })
    } finally {
      clearTimeout(timeout)
    }

    if (!response.ok) return NextResponse.json({ reply: groundedReply })

    const data = await response.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
    try {
      const reply = JSON.parse(text)
      if (isPompuReply(reply)) {
        if (groundedReply.intent !== 'clarify') {
          // Preserve the grounded actions/intent — only the phrasing came from Gemini.
          return NextResponse.json({ reply: { message: reply.message, intent: groundedReply.intent, actions: groundedReply.actions } })
        }
        const intent = normaliseIntent(reply.intent)
        // Free-form answers still get the in-chat booking button when the
        // visitor is clearly trying to meet / hire / reach Vysyakh.
        const actions = intent === 'booking' || intent === 'contact' ? [BOOK_ACTION] : undefined
        return NextResponse.json({ reply: { message: reply.message, intent, actions } })
      }
    } catch {
      // A deterministic reply is better than returning unstructured model text.
    }

    return NextResponse.json({ reply: groundedReply })
  } catch {
    // Anything unexpected here (malformed request body, etc.) still gets the
    // best available reply for whatever message we did manage to read,
    // rather than always the generic "something went wrong" contact text.
    return NextResponse.json({ reply: getFallbackResponse(rawMessage || 'contact') })
  }
}
