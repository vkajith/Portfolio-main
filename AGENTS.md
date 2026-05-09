# AGENTS.md

Guide for AI coding agents (and humans) working on this repo.
Keep this file up to date when you change the active file graph, conventions, or build commands.

---

## 1. What this is

Personal portfolio for **Vysyakh Ajith**. A single-page Next.js 15 app with a sticky left sidebar (identity + a chat terminal) and a scrollable right column (experience + projects). The terminal hosts **Pompu**, a quirky rabbit assistant that answers questions about Vysyakh — backed by Google Gemini in production and a hand-written keyword fallback when the API key is absent.

Design language: warm cream paper (`#F5F0E8`) with a moss-green accent in **light mode**; deep ink-purple (`#0a0612`) with hot magenta + electric cyan in **dark (neon-noir) mode**. One rabbit, occasional carrot.

Live: vysyakhajith.com

---

## 2. Stack

- **Next.js 15** (App Router, React 19, server components by default)
- **TypeScript** strict
- **Tailwind CSS v3** + a small set of CSS variables in `app/globals.css`
- **lucide-react** for icons (notably `Rabbit`)
- **react-icons** only for `FaXTwitter` (the X/Twitter logo isn't in lucide)
- **lenis** for smooth scroll (mounted globally via `app/components/SmoothScroll.tsx`)
- **@vercel/analytics**
- **Google Gemini** (`gemini-2.0-flash`) via REST — no SDK

No state management library, no testing framework, no Storybook. Keep it that way unless there's a real reason.

---

## 3. File map (the active graph)

Everything reachable from `app/page.tsx` and `app/layout.tsx`. If a file isn't listed, it shouldn't exist — check git history before re-adding.

```
app/
├── layout.tsx                  Root layout. Inter + JetBrains Mono. Wraps children in <SmoothScroll>.
├── page.tsx                    The only route. Mounts LeftPanel + Experience + Projects + global overlays.
├── globals.css                 CSS variables (palette), animations, .pompu-*, .section-divider, etc.
├── icon.svg                    Carrot favicon (Next.js auto-serves at /icon.svg).
├── apple-icon.svg              180×180 carrot for iOS.
│
├── api/
│   └── chat/route.ts           POST /api/chat — Pompu's brain. Calls Gemini or falls back.
│
├── lib/
│   └── context.ts              VYSYAKH_CONTEXT system prompt + FALLBACK_RESPONSES table + getFallbackResponse().
│
├── components/
│   ├── SmoothScroll.tsx        Lenis wrapper.
│   ├── LeftPanel.tsx           Sticky sidebar. Identity → bio → Terminal (docked bottom) → socials/resume.
│   ├── Terminal.tsx            Pompu UI: rabbit avatar, mood, slash commands, ↑/↓ history, custom block cursor.
│   ├── Experience.tsx          Right-column section. Static array of 3 jobs.
│   ├── Projects.tsx            Right-column section. Static array of 3 projects.
│   ├── CommandPalette.tsx      ⌘K / Ctrl+K palette (rendered globally).
│   ├── CarrotRain.tsx          Konami code listener + 'pompu:carrot-rain' event handler. Renders falling 🥕.
│   └── ThemeToggle.tsx         Fixed top-right sun/moon button. View Transitions API circular wipe.
│
└── img/                        PNG/JPG assets used by Experience and Projects only.
```

`public/` holds `resume.pdf` only. Don't add Next.js boilerplate SVGs back.

---

## 4. Commands

```bash
npm install        # one-time / after dep changes
npm run dev        # http://localhost:3000
npm run build      # production build — must pass before merging
npm run lint       # next lint, must be clean
npx tsc --noEmit   # type-check, must be clean
```

Build size budget: the `/` route is currently **17.1 kB** First Load JS shared = 122 kB. If a change pushes either by more than ~5 kB, justify it in the PR.

---

## 5. Environment

Single env var, optional:

```
GEMINI_API_KEY=...         # if missing, Pompu gracefully falls back to keyword matching
```

Lives in `.env` locally (gitignored). Set in Vercel for prod.

There is no `NEXT_PUBLIC_*` surface. Everything Pompu does happens server-side in `app/api/chat/route.ts`.

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

### 6.1.1 Glow utilities

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

```
User types in Terminal
        │
        ▼
handleSubmit(query)
        │
        ├── lowercase match against SLASH_COMMANDS in Terminal.tsx → instant local reply (no network)
        │   └── /carrot also dispatches CustomEvent('pompu:carrot-rain')
        │
        └── otherwise → POST /api/chat { message }
                              │
                              ▼
                         api/chat/route.ts
                              │
                              ├── GEMINI_API_KEY present? → call Gemini with VYSYAKH_CONTEXT
                              │                              └── on error → getFallbackResponse(message)
                              │
                              └── GEMINI_API_KEY missing? → getFallbackResponse(message)
```

`getFallbackResponse()` does direct-key match → `/key` match → substring match → fuzzy topic routing → final "outside my burrow" reply.

History (↑/↓): kept in component state only — does not persist across reloads. (Adding `sessionStorage` persistence is a tracked nice-to-have.)

---

## 8. How to add a new section to the right column

1. Create `app/components/<Name>.tsx` — copy the shape of `Experience.tsx`:
   - `'use client'` only if you need it (most static sections don't)
   - `<section id="<name>" className="mb-16">`
   - `<h2 className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--text-muted)] mb-8">`
   - `card-hover` + `bg-[var(--bg-card)]` for cards
   - `tag-interactive` for filled tag pills
2. Import + mount in `app/page.tsx` between Experience and Projects (with a `<div className="section-divider my-12" />` between).
3. Add an entry to the `CommandPalette` items array in `app/components/CommandPalette.tsx` so ⌘K can jump to it.
4. Mention it in `VYSYAKH_CONTEXT` and `FALLBACK_RESPONSES` so Pompu can answer about it.

---

## 9. How to add a new slash command

In `app/components/Terminal.tsx`, extend `SLASH_COMMANDS`:

```ts
const SLASH_COMMANDS: Record<string, string> = {
  ...,
  '/yourcommand': FALLBACK_RESPONSES.yourcommand,
}
```

Then add `yourcommand` to `FALLBACK_RESPONSES` in `app/lib/context.ts`. Also surface it in the `/help` reply if it's user-visible.

If the command should trigger a global side-effect (like `/carrot` does), dispatch a `CustomEvent` and listen for it in the relevant global component (e.g. `CarrotRain.tsx`).

---

## 10. Layout invariants — do not break

- **LeftPanel is sticky on `lg+`** with `lg:h-screen`. Total content (status + identity + bio + terminal + socials) must fit a 100vh viewport without scrolling at 1280×720. The terminal is `clamp(220px, 30vh, 300px)` for that reason.
- **Terminal docks at the bottom** of LeftPanel via `mt-auto`. Don't put `flex-1` on its wrapper — that stretches it.
- **`ThemeToggle`, `CommandPalette`, `CarrotRain` are mounted at the page root** (`app/page.tsx`), not inside LeftPanel. They listen on `window`, so they need a stable mount point.
- **`/` global hotkey** is owned by `Terminal.tsx`. If a future input wants to claim `/`, coordinate.
- **`⌘K` / `Ctrl+K`** is owned by `CommandPalette.tsx`. Same rule.
- **Pompu input has no focus ring** — focus is signalled by the accent block cursor (`▎`, glows in dark). `.pompu-input:focus-visible { outline: none }` enforces this. Other inputs use the global `:focus-visible` accent ring.
- **`<html>` has `suppressHydrationWarning`** because the inline pre-hydration script writes `data-theme` before React mounts. Don't remove that prop or you'll get hydration warnings.
- **The pre-hydration script must remain in `<head>` of `layout.tsx`**, before any other content. If you move it to `<body>` you'll get a flash of wrong theme.

---

## 11. Accessibility checklist

- All decorative emoji/icons get `aria-hidden`.
- Pompu input has `aria-label="Ask Pompu"` (the CommandPalette uses it to find the input).
- Carrot rain is `aria-hidden` and `pointer-events-none`.
- Reduced-motion users get a static page — extend the `@media (prefers-reduced-motion: reduce)` block in `globals.css` whenever you add a new animation.
- Color contrast: moss `#6B7F3E` on cream `#F5F0E8` is 4.6:1 (AA for normal text). Don't lighten the accent below `--accent-light` (`#8BA34E`) for body text.

---

## 12. Gotchas

- **Terminal cursor positioning** is achieved with a layered invisible `<input>` (transparent text + transparent caret) on top of a styled `<div>` that re-renders the typed text and the `▎`. Both must share **exactly** the same font, size, and line-height — if you change `text-[12.5px]` or `leading-[18px]` on one, change both, or the cursor will drift off the last character.
- **Gemini key absence is silent** — the user sees Pompu working, just with simpler answers. Don't add a warning UI; the keyword fallback is the contract.
- **`sessionStorage` is not used yet.** All state is in-memory.
- **Lenis smooth scroll** intercepts `scrollIntoView`. Behavior is fine in current code; if you add programmatic scrolling, test with smooth scroll on.
- **Static images live in `app/img/`**, not `public/`. They're imported with `next/image`'s static-import path so Next.js can size them at build time. Keep new images there.

---

## 13. What was deliberately removed (as of the last cleanup)

So future agents don't re-add them in good faith:

- The pre-facelift portfolio components (`Hero`, `Skills`, `Achievements`, `Testimonials`, `Marquee`, `Navbar`, `Footer`, `Contact`, `GitHubActivity`, `GitHubContributionMap`, `CustomCursor`)
- `app/components/ui/` (shadcn-style folder, never wired up)
- The old `providers/theme-provider.tsx` (a `next-themes`-style provider). The current theme system uses a simple `data-theme` attribute + inline bootstrap script + `ThemeToggle` component — no provider, no context.
- `app/actions.ts` + `app/api/contact/route.ts` (the contact form was unmounted)
- `public/{file,globe,next,vercel,window}.svg` (Next.js boilerplate)
- Deps: `axios`, `framer-motion`, `nodemailer`, `react-fast-marquee`, `react-intersection-observer`, `react-tsparticles`, `tsparticles`

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
