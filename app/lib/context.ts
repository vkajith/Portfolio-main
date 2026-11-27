import { infraProject, platform, profile, projects, roles, skills } from './profile'
import { gardenNotes } from './garden'

export type PompuAction = {
  label: string
  kind: 'scroll' | 'link' | 'book' | 'route'
  target: string
}

export type PompuReply = {
  message: string
  intent: 'portfolio' | 'systems' | 'writing' | 'booking' | 'contact' | 'clarify'
  actions?: PompuAction[]
}

type KnowledgeTopic = PompuReply & { keywords: string[] }

const BOOK: PompuAction = { label: 'Book a time', kind: 'book', target: 'book' }
const SYSTEMS: PompuAction = { label: 'Explore the platform', kind: 'scroll', target: '#systems' }
const EXPERIENCE: PompuAction = { label: 'Walk the timeline', kind: 'scroll', target: '#experience' }
const WRITING: PompuAction = { label: 'Read the writing', kind: 'route', target: '/writing' }
const CONTACT: PompuAction = { label: 'Send a message', kind: 'scroll', target: '#contact' }
const PHOTOGRAPHY: PompuAction = { label: 'See the photography', kind: 'route', target: '/photography' }
const GARDEN: PompuAction = { label: 'Enter the garden', kind: 'route', target: '/garden' }
const RESUME: PompuAction = { label: 'Open resume', kind: 'link', target: profile.links.resume }

// ---- Prompt: generated from profile.ts so it can never drift from the site ----
const roleFacts = [...roles]
  .reverse()
  .map((r) => {
    const head = `${r.org} — ${r.title}${r.team ? ` (${r.team})` : ''}, ${r.start}–${r.end}, ${r.location}`
    return `${head}\n${r.highlights.map((h) => `  • ${h.title}: ${h.text}`).join('\n')}`
  })
  .join('\n')

const platformFacts = platform.map((p) => `• ${p.name}: ${p.detail}`).join('\n')
const skillFacts = Object.entries(skills).map(([group, list]) => `${group}: ${list.join(', ')}`).join('\n')
const projectFacts = projects.length
  ? projects.map((p) => `• ${p.title}: ${p.summary}${p.link ? ` (${p.link})` : ''}`).join('\n')
  : '• No side projects are featured right now. Do not mention HabitAct or older projects.'

const gardenFacts = gardenNotes
  .slice(0, 4)
  .map((note) => `• ${note.title} — ${note.tags.join(', ')}`)
  .join('\n')

export const VYSYAKH_CONTEXT = `
You are Pompu — Vysyakh Ajith's rabbit-shaped portfolio concierge. You help visitors (often recruiters, founders, and engineers) understand what Vysyakh builds and get in touch.

VOICE
- Friendly, curious, a little quirky — but readable. Normal sentence case with correct capitalisation of names (Vysyakh, TensorZero, OpenAI, ClickHouse, Temporal).
- 2–3 short sentences, plain text, no markdown, no lists.
- Rabbit/carrot wordplay is rare: at most one small touch every few replies, never in back-to-back replies. No stock phrases like "hop down the rabbit hole" or "burrow into".
- Don't end every reply with an offer or question. Only suggest booking a call when the visitor wants to talk, hire, or asks something you can't verify.
- Never call yourself an AI or an assistant.
- Lead with the most concrete fact relevant to the question (numbers, named systems).

POSITIONING
${profile.name} is an ${profile.role} in ${profile.location}. ${profile.summary}
Headline: "${profile.headline}"

EXPERIENCE (newest first)
${roleFacts}

THE PLATFORM HE BUILDS (a loop: build → route → capture → judge → improve)
${platformFacts}

INFRASTRUCTURE PROJECT
• ${infraProject.title}: ${infraProject.summary}

SKILLS
${skillFacts}

PROJECTS
${projectFacts}

GARDEN (notes on creativity, tech philosophy, systems, and AI)
${gardenFacts}

PHOTOGRAPHY
- Outside the terminal, Vysyakh shoots photography. A curated gallery lives at /photography, with the full album linked on Google Photos.

CONTACT
- Email ${profile.links.email}, GitHub ${profile.links.github}, LinkedIn ${profile.links.linkedin}. Writing on Substack: ${profile.links.substack} and at /writing.
- Pompu can book a 15 or 30 minute call on Vysyakh's real calendar right inside this chat. When someone wants to talk, hire, collaborate, or meet, offer that.
- If someone wants to support the work, there's a Buy Me a Coffee link: ${profile.links.coffee}.

RULES
- Use only the facts above. If asked something not covered (salary, notice period, visa, personal life, opinions he hasn't published), say Pompu can't verify that and suggest booking a call or sending a message.
- Never invent customers, metrics, or details beyond the facts.
- Off-topic chit-chat and general tech questions are fine — answer briefly in character, then gently steer back.
`

// ---- Offline/grounded answers (used without a Gemini key, and as the fact
// Gemini rephrases when a topic matches). ----
const observe = roles.find((r) => r.id === 'observe')!
const anarock = roles.find((r) => r.id === 'anarock')!
const nagarro = roles.find((r) => r.id === 'nagarro')!

const topics: KnowledgeTopic[] = [
  {
    message: `Vysyakh is an ${profile.role.toLowerCase()} at Observe.AI. He builds the core primitives of a production agentic platform — the agent builder, an LLM gateway, LLM-as-judge evals, and analytics over 10M+ agent events a month.`,
    intent: 'portfolio',
    actions: [SYSTEMS, EXPERIENCE],
    keywords: ['who is', 'who are', 'intro', 'about him', 'about vysyakh', 'what does', 'what do you do', 'summary', 'tldr', 'tl;dr'],
  },
  {
    message: `The agent builder is a flow-based canvas: node-driven orchestration with 15+ tool types, conditional branching, and context passed between steps. Versions live in S3, and Pipecat deploys one agent to voice, chat, or copilot.`,
    intent: 'systems',
    actions: [SYSTEMS],
    keywords: ['agent builder', 'builder', 'orchestration', 'pipecat', 'voice agent', 'flow'],
  },
  {
    message: `He integrated TensorZero as the LLM gateway, routing across OpenAI, Azure, Anthropic, and Bedrock. It supports bring-your-own-key, per-request fallback when a provider fails, and streaming for low latency.`,
    intent: 'systems',
    actions: [SYSTEMS],
    keywords: ['gateway', 'tensorzero', 'routing', 'llm provider', 'byok', 'fallback', 'openai', 'anthropic', 'bedrock', 'azure', 'model'],
  },
  {
    message: `Agent quality is scored by an LLM-as-judge framework running on Temporal — thousands of interactions a day, task-adherence and pillar-based quality metrics, plus automatic regression detection.`,
    intent: 'systems',
    actions: [SYSTEMS],
    keywords: ['eval', 'judge', 'quality', 'temporal', 'regression', 'benchmark', 'testing agents'],
  },
  {
    message: `The analytics layer is self-hosted ClickHouse taking in 10M+ events a month, with a multi-tenant Apache Superset fork for per-account dashboards. He also built an Agno AnalyticsAgent that turns plain-English questions into ClickHouse SQL.`,
    intent: 'systems',
    actions: [SYSTEMS],
    keywords: ['analytics', 'clickhouse', 'click house', 'superset', 'dashboard', 'agno', 'data', 'sql', 'events'],
  },
  {
    message: `Agent definitions are versioned in a Git-based harness on Gitea, live agents get benchmarked continuously through Temporal, and A/B infrastructure compares models and prompt strategies with tracked deltas.`,
    intent: 'systems',
    actions: [SYSTEMS],
    keywords: ['harness', 'gitea', 'a/b', 'ab test', 'experiment', 'prompt strateg', 'version control'],
  },
  {
    message: `On the infra side: per-tenant S3 buckets with customer-managed KMS keys, scoped IAM roles, ABAC via Casbin, and zero-touch tenant onboarding. Strict multi-tenant isolation is a recurring theme in his work.`,
    intent: 'systems',
    actions: [SYSTEMS],
    keywords: ['security', 'tenant', 'multi-tenant', 'iam', 'kms', 'casbin', 'abac', 'terraform', 'infra', 'aws'],
  },
  {
    message: `The path so far: BITS Pilani (with deep-RL research) → Nagarro, building billing systems → Anarock for 3.5 years, scaling products to 15,000+ users and shipping early Gen-AI → now Observe.AI on the agent platform.`,
    intent: 'portfolio',
    actions: [EXPERIENCE, RESUME],
    keywords: ['experience', 'career', 'journey', 'history', 'background', 'resume', 'cv', 'previous', 'years'],
  },
  {
    message: `At Anarock he led the CRM rebuild for 15,000+ users, scaled Gen-AI integrations from 1,500 to 7,000 monthly interactions, and built an Expo marketing toolkit that saved $10K a year. ${anarock.start}–${anarock.end}.`,
    intent: 'portfolio',
    actions: [EXPERIENCE],
    keywords: ['anarock', 'crm', 'real estate', 'marketing toolkit', 'expo', 'react native'],
  },
  {
    message: `His first role was at Nagarro (${nagarro.start}–${nagarro.end}): a full-stack invoice module that cut manual billing work by 60%, plus partial billing that reduced payment errors by 35%.`,
    intent: 'portfolio',
    actions: [EXPERIENCE],
    keywords: ['nagarro', 'first job', 'invoice', 'billing'],
  },
  {
    message: `He studied civil engineering at BITS Pilani (CGPA 8.5) and published deep reinforcement learning research on traffic optimisation at IEEE SusTech 2021 — the first ML detour that stuck.`,
    intent: 'portfolio',
    actions: [EXPERIENCE],
    keywords: ['education', 'college', 'university', 'bits', 'degree', 'study', 'research', 'paper', 'civil'],
  },
  {
    message: `AI/LLM: ${skills['AI / LLM'].slice(0, 5).join(', ')}. platform: ${skills.Platform.slice(0, 4).join(', ')}. and the product side he grew up on: ${skills.Product.slice(0, 4).join(', ')}.`,
    intent: 'portfolio',
    actions: [EXPERIENCE],
    keywords: ['skill', 'stack', 'tech', 'language', 'framework', 'tools', 'know'],
  },
  {
    message: `Vysyakh writes about building AI-native products and agent platforms on Substack. The latest pieces are at /writing and on Substack.`,
    intent: 'writing',
    actions: [WRITING],
    keywords: ['blog', 'writing', 'substack', 'article', 'post', 'read'],
  },
  {
    message: `Pompu can book you a 15 or 30 minute call on Vysyakh's real calendar right here — pick a slot and you're done.`,
    intent: 'booking',
    actions: [BOOK],
    keywords: ['book', 'calendar', 'schedule', 'appointment', 'meeting', 'call', 'meet', 'slot', 'available', 'availability', 'talk to him'],
  },
  {
    message: `He's open to conversations about AI agent platforms, LLM infrastructure, and product engineering. the fastest route is a call — Pompu can book one right here — or send a message.`,
    intent: 'contact',
    actions: [BOOK, CONTACT],
    keywords: ['hire', 'hiring', 'job', 'role', 'opportunit', 'recruit', 'collaborat', 'freelance', 'contract', 'work with', 'open to'],
  },
  {
    message: `Email ${profile.links.email}, or find him on GitHub (vkajith) and LinkedIn (vysyakh-ajith). Pompu can also book a call for you.`,
    intent: 'contact',
    actions: [CONTACT, BOOK],
    keywords: ['contact', 'email', 'reach', 'linkedin', 'github', 'connect', 'message'],
  },
  {
    message: `Vysyakh is based in ${profile.location}.`,
    intent: 'portfolio',
    keywords: ['where', 'location', 'based', 'city', 'country', 'india', 'remote'],
  },
  {
    message: `If you'd like to support the work, there's a Buy Me a Coffee link: ${profile.links.coffee}. No pressure — a good problem to solve is just as welcome.`,
    intent: 'contact',
    actions: [{ label: 'Buy me a coffee', kind: 'link', target: profile.links.coffee }, CONTACT],
    keywords: ['coffee', 'buy me', 'buy me a coffee', 'support', 'donate', 'tip', 'sponsor'],
  },
  {
    message: `Outside the terminal, Vysyakh shoots photography. The gallery is a curated set of frames — the full album lives on Google Photos.`,
    intent: 'portfolio',
    actions: [PHOTOGRAPHY],
    keywords: ['photography', 'photo', 'photos', 'camera', 'shoot', 'gallery', 'frame', 'lens'],
  },
  {
    message: `The garden is where the stray thoughts go — notes on creativity, tech philosophy, systems, and AI. Start with "${gardenNotes[0].title}" or wander the index at /garden.`,
    intent: 'portfolio',
    actions: [GARDEN],
    keywords: ['garden', 'notes', 'creativity', 'philosophy', 'thinking', 'ideas', 'essay', 'essays'],
  },
]

export const FALLBACK_RESPONSES: Record<string, string> = {
  help: 'Ask about the agent platform, the career timeline, skills, garden, writing, or photography. Try /book to grab 15 or 30 minutes on Vysyakh\'s calendar, or /clear to start over.',
  about: topics[0].message,
  experience: topics[7].message,
  systems: `he builds the loop behind production AI agents: ${platform.map((p) => p.name).join(' → ')}. ${observe.chapter}`,
  skills: topics[11].message,
  contact: 'Email, GitHub, LinkedIn — or book a call. Pompu can do the booking part right here.',
  garden: 'The garden is where the stray thoughts go — notes on creativity, tech philosophy, systems, and AI. It lives at /garden.',
  writing: 'The writing page has the latest essays — or read the archive on Substack.',
  photography: 'The photography gallery is at /photography — or open the full album on Google Photos.',
  resume: 'The résumé sits beside the timeline as you scroll — or grab the PDF.',
  book: topics[13].message,
  pompu: 'Pompu is Vysyakh\'s rabbit-shaped portfolio concierge: here to connect the right question to the right piece of work, and to book you onto his calendar.',
  carrot: 'A wild carrot appears. Pompu considers this excellent product feedback.',
}

const COMMAND_ACTIONS: Record<string, PompuAction[]> = {
  about: [SYSTEMS, EXPERIENCE],
  experience: [EXPERIENCE, RESUME],
  systems: [SYSTEMS],
  skills: [EXPERIENCE],
  contact: [CONTACT, BOOK],
  garden: [GARDEN],
  writing: [WRITING],
  photography: [PHOTOGRAPHY],
  resume: [EXPERIENCE, RESUME],
  book: [BOOK],
}

function findTopic(query: string) {
  return topics
    .map((topic) => ({
      topic,
      score: topic.keywords.reduce((total, k) => total + (query.includes(k) ? k.length : 0), 0),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)[0]?.topic
}

export function commandReply(command: string): PompuReply {
  return {
    message: FALLBACK_RESPONSES[command] ?? FALLBACK_RESPONSES.help,
    intent: command === 'book' ? 'booking' : 'portfolio',
    actions: COMMAND_ACTIONS[command],
  }
}

export function getFallbackResponse(query: string): PompuReply {
  const normalised = query.toLowerCase().trim()
  const direct = normalised.replace(/^\//, '')
  if (direct in FALLBACK_RESPONSES) return commandReply(direct)

  const topic = findTopic(normalised)
  if (topic) return { message: topic.message, intent: topic.intent, actions: topic.actions }

  return {
    message: "Pompu doesn't have a verified answer for that, and would rather not make one up. the quickest way to get the real answer is a short call with Vysyakh — or leave him a note.",
    intent: 'clarify',
    actions: [BOOK, CONTACT],
  }
}

export const BOOK_ACTION = BOOK
