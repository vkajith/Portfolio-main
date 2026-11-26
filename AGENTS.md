# AGENTS.md

Guide for AI coding agents (and humans) working on this repo.
Keep this file up to date when you change the active file graph, conventions, or build commands.

---

## 1. What this is

Personal portfolio for **Vysyakh Ajith**, positioned as an **AI Agent Platform Engineer** (LLM gateways, agent orchestration, evals, analytics at scale). A single-page Next.js 15 app that reads top to bottom as a story:

1. **Hero** — positioning, stats, CTAs, and **Pompu** (a quirky rabbit concierge chat) as the centrepiece.
2. **The story** — a scroll-driven timeline (oldest → newest) beside a sticky **résumé paper** that "writes" each entry as its chapter scrolls into view.
3. **The platform** — an explorable loop: Agent Builder → LLM Gateway → Agentic Analytics → LLM-as-Judge → Agent Harness.
4. **Building** (projects, data-driven from `profile.ts`) → **Photography** (Google Photos album) → **Writing** (Substack) → **Contact**.

Once the hero scrolls away, Pompu docks into a bottom-right pill/panel and follows the visitor. Pompu answers from verified facts and **books real 15/30-minute calls on Vysyakh's Cal.com calendar inside the chat**.

Design language: warm cream paper (`#F5F0E8`) with a moss-green accent in **light mode**; deep ink-purple (`#0a0612`) with hot magenta + electric cyan in **dark (neon-noir) mode**. One rabbit, occasional carrot.

Live: vysyakhajith.com

---

## 2. Stack

- **Next.js 15** (App Router, React 19, server components by default)
- **TypeScript** strict
- **Tailwind CSS v3** + a small set of CSS variables in `app/globals.css`
- **lucide-react** for icons (notably `Rabbit`)
- **react-icons** for `FaXTwitter` and the mono Simple Icons brand marks rendered by `ToolIcon.tsx`
- **lenis** for smooth scroll (mounted globally via `app/components/SmoothScroll.tsx`)
- **@vercel/analytics**
- **Google Gemini** (`gemini-2.0-flash`) via REST — no SDK

No state management library, no testing framework, no Storybook. Keep it that way unless there's a real reason.

---

## 3. File map (the active graph)

Everything reachable from `app/page.tsx` and `app/layout.tsx`. If a file isn't listed, it shouldn't exist — check git history before re-adding.

```
app/
├── layout.tsx                  Root layout, fonts, metadata/OG, JSON-LD, pre-hydration theme script.
├── page.tsx                    The only route: Hero → CareerStory → SelectedSystems → Projects → Notes → Contact.
├── globals.css                 Palette tokens (incl. --paper-*), animations, dock/timeline/résumé/platform styles.
├── icon.svg / apple-icon.svg   Carrot favicons.
├── opengraph-image.tsx         Generated OG card. robots.ts / sitemap.ts for SEO.
│
├── lib/
│   ├── profile.ts              ★ SINGLE SOURCE OF TRUTH: identity, roles, highlights, platform, skills, projects.
│   ├── context.ts              Pompu's prompt + grounded fallback topics, GENERATED from profile.ts.
│   ├── cal.ts                  Server-only Cal.com v2 helpers (config from CAL_COM_BOOKING_URL, rate limit).
│   ├── photography.ts          Server fetch + parser for the public Google Photos album; photo URL helpers.
│   └── pompuEvents.ts          openPompu({ book?, prompt? }) — window event to summon Pompu from anywhere.
│
├── api/
│   ├── chat/route.ts           POST — Pompu's brain (Gemini, grounded on context.ts; deterministic fallback).
│   ├── cal/slots/route.ts      GET  — next open slots for 15/30 min, in the visitor's time zone.
│   ├── cal/book/route.ts       POST — creates the booking on Cal.com (validated, rate-limited).
│   ├── book/route.ts           GET  — plain redirect to the Cal.com page (no-JS fallback).
│   ├── contact/route.ts        POST — contact form via Resend.
│   └── photo/route.ts          GET  — allow-listed, cached proxy for Google Photos CDN images.
│
├── components/
│   ├── Hero.tsx / HeroActions.tsx   Intro + stats + CTAs; hosts PompuShell.
│   ├── PompuShell.tsx          Single Terminal instance: in-flow in the hero, fixed dock/pill once scrolled past.
│   ├── Terminal.tsx            Pompu chat UI: slash commands, history, action buttons, in-chat booking.
│   ├── BookingWidget.tsx       Duration → day → time → name/email → confirm, all inside the chat.
│   ├── CareerStory.tsx         Scroll timeline; IntersectionObserver picks the active chapter.
│   ├── ResumePaper.tsx         Sticky one-page résumé; the chapter in view expands, others collapse to one line.
│   ├── SelectedSystems.tsx     Platform loop (click to explore) + infra card; "ask pompu about this".
│   ├── Projects.tsx            Renders `projects` from profile.ts; returns null when empty.
│   ├── Photography.tsx         Server section: fetches the Google Photos album + renders the gallery shell.
│   ├── PhotoGallery.tsx        Client gallery: editorial grid + keyboard lightbox.
│   ├── ToolIcon.tsx            Mono brand mark for a tool name (react-icons/si); null when unknown.
│   ├── Reveal.tsx              One-shot scroll reveal (IntersectionObserver) with reduced-motion fallback.
│   ├── Notes.tsx               Substack RSS (server component, revalidates hourly).
│   ├── Contact.tsx             Contact form + "book a call with Pompu".
│   ├── CommandPalette.tsx / CarrotRain.tsx / ThemeToggle.tsx / SmoothScroll.tsx
```

`public/` holds `resume.pdf` only. The live résumé link (`profile.links.resume`) points at the hosted Google Drive PDF; the local file is kept as a fallback.

---

## 4. Commands

```bash
npm install        # one-time / after dep changes
npm run dev        # http://localhost:3000
npm run build      # production build — must pass before merging
npm run lint       # next lint, must be clean
npx tsc --noEmit   # type-check, must be clean
```

Build size budget: the `/` route is **27.7 kB** (First Load 133 kB) — the booking widget, scroll story, résumé paper, platform loop, tool marks, and photo gallery are client components. If a change pushes it by more than ~5 kB, justify it in the PR. (The +7.8 kB from 19.9 kB covers the three project cards, eight Simple Icons marks, the conversational chat bubbles, the photography gallery, and the scroll-reveal wrapper.)

---

## 5. Environment

All optional — every feature degrades gracefully:

```
GEMINI_API_KEY=...         # without it Pompu answers from the grounded topic table only
CAL_COM_BOOKING_URL=...    # https://cal.com/<username>/<slug> — enables in-chat booking + /api/book redirect
CAL_COM_API_KEY=...        # optional; Cal.com public endpoints work without it (higher limits with it)
RESEND_API_KEY=...         # contact form delivery
CONTACT_TO_EMAIL=...       # where contact form messages go
SUBSTACK_RSS_URL=...       # writing section feed
GOOGLE_PHOTOS_ALBUM_URL=... # full https://photos.google.com/share/<id>?key=<key> URL; short photos.app.goo.gl links are a JS shell
```

Lives in `.env` locally (gitignored). Set in Vercel for prod. Cal.com event slugs live in `bookingDurations` in `profile.ts` (currently `15min`, `30min`). The photography album URL must be the resolved `photos.google.com/share/...` link, not the short `photos.app.goo.gl` share link.

There is no `NEXT_PUBLIC_*` surface.

---

## 6. Conventions

### 6.1 Palette — use the CSS variables, not raw hex

Two themes defined in `app/globals.css`. Light is the `:root` default. Dark lives under `[data-theme="dark"]`. The active theme is set on `<html>` by an inline pre-hydration script in `layout.tsx`.

| token                  | light (default)               | dark (neon-noir)                 | use for                                |
|-----------------------|-------------------------------|----------------------------------|----------------------------------------|
| `--bg-primary`         | `#F5F0E8` (cream)             | `#0a0612` (deep ink)             | page background                         |
| `--bg-card`            | `#EAE5DB`                     | `#15102a`                        | cards, terminal, raised surfaces        |
| `--bg-card-hover`      | `#E3DED4`                     | `#1d1638`                        | card hover                              |
| `--text-primary`       | `#1a1a1a`                     | `#f0e8ff`                        | headings, prompts, typed text           |
| `--text-secondary`     | `#5a5a5a`                     | `#b9aed3`                        | body                                    |
| `--text-muted`         | `#999999`                     | `#7d6f9d`                        | meta, placeholders                      |
| `--accent`             | `#6B7F3E` (moss)              | `#ff3dc8` (hot magenta)          | prompt, links, active state, status     |
| `--accent-light`       | `#8BA34E`                     | `#ff6cd9`                        | secondary highlights                    |
| `--accent-secondary`   | `#6B7F3E` (same as accent)    | `#00e6ff` (electric cyan)        | dark-mode hover borders, glitch shift   |
| `--accent-glow`        | `rgba(107,127,62,0.15)`       | `rgba(255,61,200,0.30)`          | glow shadows                            |
| `--accent-soft-{05,10,15,25,35}` | various moss alphas | various magenta alphas         | tinted backgrounds, scrollbars          |
| `--border-color`       | `#DDD8CE`                     | `#2d1f4a`                        | hairline dividers                       |
| `--glow-strength`      | `0`                           | `1`                              | scales `.neon-glow` text-shadow         |

**Always use the soft-alpha tokens (`--accent-soft-*`) instead of inline `rgba(107,127,62,...)` literals** — the inline forms don't switch when the theme changes.

Don't introduce new top-level palette tokens without updating this table.

### 6.1.1 Tool marks

`ToolIcon.tsx` maps a tool name to its Simple Icons mark (`react-icons/si`). Marks are monochrome (`currentColor`), sized `w-3 h-3`, and `aria-hidden`; unknown names render nothing so a chip falls back to text. Use it inside tag/stack chips rather than loading per-tool SVGs or PNGs.

### 6.1.2 Glow utilities

- `.neon-glow` — adds a magenta text-shadow scaled by `--glow-strength`. No-op in light mode.
- `.neon-glow-cyan` — same with cyan, used sparingly.
- `.glitch-on-hover` — RGB-shift glitch wobble on hover, dark mode only (the H1 name uses this).
- The block cursor `▎` (`.cursor-blink`) gets an automatic magenta glow in dark mode.

### 6.2 Typography

- Sans: **Inter** (`--font-inter`, default body)
- Mono: **JetBrains Mono** (`--font-jetbrains`, used via `font-mono`)
- Section labels: `text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--text-muted)]`
- Headings: `font-semibold text-[var(--text-primary)] text-[14px]`

### 6.3 Animation

Existing keyframes live in `globals.css`. Reuse before inventing:

- `cursor-blink` — terminal block cursor (auto-glows in dark mode)
- `ear-twitch` — rotates the rabbit icon's ears
- `carrotFall` — konami rain (gets an orange glow in dark mode)
- `paletteFade` / `palettePop` — command palette open
- `fadeInUp` / `slideInLeft` / `statusPing` / `pulseGlow` — generic
- `glitchShift` — RGB-shift glitch on `.glitch-on-hover` (dark mode only)
- `themeWipeIn` — circular clip-path reveal driven by the View Transitions API on theme swap
- `nodeSweep` — accent line sweep on the active platform node
- `Reveal` (`components/Reveal.tsx`) — one-shot fade/lift when a section enters the viewport; automatically disabled for reduced-motion users
- `.stagger-children > *` — staggered fade-in for lists

The `html, body` selector has a `transition: background-color 0.45s, color 0.45s` so that browsers without View Transitions still get a smooth color cross-fade between themes.

**Always wrap loud animations in `prefers-reduced-motion`** (already done in the global `@media` block — keep extending it when you add new animations, including any new `::view-transition-*` rules).

### 6.4 Pompu's voice

Defined in `app/lib/context.ts` (`VYSYAKH_CONTEXT`). Two rules that matter:

1. **Stay in character** — Pompu refers to themselves as Pompu, never "AI" or "assistant". Vysyakh is "Vysyakh" or "the human upstairs".
2. **Concise + lowercase quirky** — 2–4 short sentences, plain text, occasional rabbit/carrot reference but at most one per reply. No emoji except 🐰 or 🥕, sparingly.

If you change the prompt, update **both** `VYSYAKH_CONTEXT` and the matching `FALLBACK_RESPONSES` so the offline tone stays consistent.

### 6.5 Carrot theme

The carrot is decorative and quiet, not loud. Existing carrot surfaces:

- `app/icon.svg` + `app/apple-icon.svg` — favicon
- Section divider on the right column (the dot is a tilted 🥕)
- Watermark in the terminal messages area (opacity 0.06)
- `/carrot` slash command + chip
- Konami code → carrot rain
- Footer line `🐰🥕` after Pompu's name
- Pompu's fallback responses occasionally say "carrot"

Don't add another carrot without retiring or merging an existing one. Decorations go opaque ≤ 0.10 unless they're the explicit focal point of an interaction (chip, easter egg).

---

## 7. How Pompu works

**Knowledge:** `profile.ts` → `context.ts` builds `VYSYAKH_CONTEXT` (the Gemini system prompt) and a scored keyword topic table. Edit `profile.ts`, never the prompt text by hand.

```
Visitor types in Terminal
  ├── slash command (/help /about /book /clear …) → commandReply() locally, no network
  └── POST /api/chat { message, history }
         ├── topic matched → Gemini rephrases ONLY that grounded fact; actions come from the topic
         ├── no match      → Gemini answers freely in character; booking/contact intent → adds "Book a time"
         └── no key / error / timeout → the grounded reply as-is
Reply intent 'booking' or a "book" action → BookingWidget opens inside the chat
  → GET /api/cal/slots?minutes=&tz=  → visitor picks a time → POST /api/cal/book → confirmation + carrot rain
```

**Summoning:** anything can call `openPompu({ book?, prompt? })` (`lib/pompuEvents.ts`). `PompuShell` expands the dock; `Terminal` focuses, starts booking, or sends the prompt. Used by the `/` hotkey, ⌘K, hero CTA, Contact, and the platform section's "ask pompu about this".

**State:** the conversation persists in `sessionStorage` (`pompu-conversation-v2`). There is exactly one `Terminal` instance, so docking never loses the conversation or a half-finished booking.

---

## 8. How to update content

- **New role, bullet, metric, skill:** edit `roles` / `skills` / `profile.stats` in `app/lib/profile.ts`. The timeline, résumé paper, and Pompu all update.
- **Projects:** add entries to `projects` in `profile.ts`; the "Building" section appears automatically.
- **Photography:** set `GOOGLE_PHOTOS_ALBUM_URL` to the full public Google Photos share URL. The server fetch parses the album page and revalidates hourly; the section shows an empty state if the album is missing or unreachable. The intro copy lives in `photography` in `profile.ts`.
- **Platform loop:** edit `platform` in `profile.ts` (5 nodes fits the grid; change `grid-template-columns` in `.platform-loop` if you change the count).
- **New section:** create `app/components/<Name>.tsx` with `<section id="…" className="px-5 sm:px-10 lg:px-16 py-20"><div className="max-w-6xl mx-auto">`, mount it in `page.tsx`, add a ⌘K item in `CommandPalette.tsx`, and a scroll action/topic in `context.ts`.

---

## 9. How to add a new slash command

1. In `app/components/Terminal.tsx`, map the command to a reply key: `'/yourcommand': 'yourcommand'` in `SLASH_COMMANDS`.
2. In `app/lib/context.ts`, add `yourcommand` to `FALLBACK_RESPONSES` (text) and, if useful, `COMMAND_ACTIONS` (buttons).
3. Mention it in the `help` reply if it's user-visible.

For a global side-effect (like `/carrot`), dispatch a `CustomEvent` and listen for it in the relevant component (e.g. `CarrotRain.tsx`). `/book` both replies and opens the booking widget.
---

## 10. Layout invariants — do not break

- **`PompuShell` must have no transformed/filtered ancestor.** The dock is `position: fixed`; a `transform` on any ancestor (e.g. `.stagger-children`, which animates `transform`) would pin it to that ancestor instead of the viewport. That's why it sits beside, not inside, the hero's `.stagger-children` block.
- **One Terminal instance.** Collapse the dock with `display: none` (`.is-closed`), never by unmounting.
- **The dock always collapses to the pill on scroll-away** so it never covers the timeline/résumé; the conversation is kept.
- **Never `disabled` the chat input.** A disabled input drops focus, so the visitor's next keystrokes hit the page (spaces scroll it). Block sending in `handleSubmit` instead.
- **Nested scroll areas need `data-lenis-prevent`** (chat, booking slots, ⌘K list, résumé body) or Lenis swallows the wheel.
- **Keep the story calm:** one change per scroll step (the active chapter expands on the paper and its dot fills). No skeletons, auto-scrolling, or auto-advancing carousels.
- **CareerStory steps are `lg:min-h-[78vh]`**; the active step is decided by a thin band (`rootMargin: '-45% 0px -50% 0px'`). The sticky résumé is desktop-only; mobile shows full bullets in each step.
- **The résumé must fit one viewport with the largest chapter (Observe.AI) expanded** at 1440×900; if you add bullets, check it still does.
- **`/` hotkey** is owned by `Terminal.tsx`; **⌘K** by `CommandPalette.tsx`.
- **Pompu input has no focus ring** — focus is the blinking `▎` cursor.
- **`<html suppressHydrationWarning>`** + the pre-hydration theme script stay in `<head>`.

---

## 11. Accessibility checklist

- All decorative emoji/icons get `aria-hidden`.
- Pompu input has `aria-label="Ask Pompu"` (the CommandPalette uses it to find the input).
- Carrot rain is `aria-hidden` and `pointer-events-none`.
- Reduced-motion users get a static page — extend the `@media (prefers-reduced-motion: reduce)` block in `globals.css` whenever you add a new animation.
- Color contrast: moss `#6B7F3E` on cream `#F5F0E8` is 4.6:1 (AA for normal text). Don't lighten the accent below `--accent-light` (`#8BA34E`) for body text.
- The photography lightbox is a `role="dialog"` with `aria-modal`, arrow-key navigation, `Escape` to close, and focus returned to the tile that opened it.

---

## 12. Gotchas

- **Cal.com API versions are pinned per endpoint** (`cal-api-version`: `2024-09-04` for slots, `2024-08-13` for bookings). Bumping one without reading the changelog breaks the response shape.
- **Slots are fetched in the visitor's time zone** (so day groupings match their calendar) and normalised to UTC ISO; the widget formats them back with `Intl`.
- **Gemini is told to rephrase, not invent.** For a matched topic it only gets that one fact; actions/intent always come from the grounded topic, never the model.
- **Lenis smooth scroll** intercepts programmatic `window.scrollTo`; use `scrollIntoView` on elements, which Lenis handles.
- **`profile.links.resume` points at the hosted Google Drive PDF**, not `public/resume.pdf`. The site renders the résumé from `profile.ts`; update the Drive link there when the PDF changes. Keep the local file only as a fallback.
- **Google Photos share links must be the resolved `photos.google.com/share/<id>?key=<key>` URL.** The short `photos.app.goo.gl/...` link is a JS-only shell and returns no photo rows to the server. `lib/photography.ts` parses `lh3.googleusercontent.com/pw/...",W,H,` rows and revalidates hourly. The grid requests sized CDN URLs through `/api/photo` (allow-listed, cached) because Google's CDN is flaky under concurrent sized requests; the lightbox uses a 1600px rendition.
- **Don't run `next build` while `next dev` is running** — both write `.next/`, and the dev server ends up serving an unstyled page.
- **Gemini latency is spiky** (1–7s, occasional 503). The chat route aborts at 4.5s and serves the grounded reply.

---

## 13. What was deliberately removed

So future agents don't re-add them in good faith:

- **Old projects** (HabitAct, WhatsApp Chat Render, SpotOn AI) and their screenshots — Vysyakh no longer wants them featured. Don't mention them anywhere, including Pompu.
- `LeftPanel.tsx` (sticky sidebar layout) and `Experience.tsx` (card list) — replaced by `Hero` + `CareerStory`.
- `ScrollProgress.tsx`, timeline company logos (`app/img/`), résumé skeleton lines / accumulating skills, and the platform auto-advance — removed as visual noise.
- Pre-facelift components (`Skills`, `Achievements`, `Testimonials`, `Marquee`, `Navbar`, `Footer`, `GitHubActivity`, `GitHubContributionMap`, `CustomCursor`), `components/ui/`, `providers/theme-provider.tsx`.
- Deps: `axios`, `framer-motion`, `nodemailer`, `react-fast-marquee`, `react-intersection-observer`, `react-tsparticles`, `tsparticles`.

If you genuinely need any of these, restore from git rather than re-creating. Then update this file.

---

## 14. Definition of done

A change is done when:

1. `npm run lint` is clean
2. `npx tsc --noEmit` is clean
3. `npm run build` succeeds
4. The First Load JS for `/` hasn't grown by more than ~5 kB without justification
5. **Verified in both light and dark themes** — toggle once mid-review and look at every surface you touched
6. Reduced-motion preview doesn't break the layout
7. This file (AGENTS.md) is updated if conventions, files, or commands changed
