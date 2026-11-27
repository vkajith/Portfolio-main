# Plan: Simple main page → dedicated creative routes

Status: first release implemented in this PR — Explore tiles on the home page, plus `/garden`, `/garden/[slug]`, `/writing`, and `/photography`.

---

## 1. What the shared portfolio actually is

There are **two layers**:

### A. Wall of Portfolios profile (the wrapper)
- Django app (`csrfmiddlewaretoken`, `/accounts/login/`, `/profile/bookmarks/`).
- Persistent left rail: avatar, name, role, location, experience logos, Message/Bookmark, and tabs: **Profile · Portfolio · Case studies**.
- The **Portfolio** tab is an iframe to the designer’s real site: `https://www.shahimim.com/`.
- **Case studies** are separate Wall of Portfolios routes (e.g. the Bumble case study).
- So the wrapper is a profile/aggregator, not the portfolio itself.

### B. Shahriyar’s actual site (`shahimim.com`)
- **Next.js App Router + Tailwind + Vercel** (generator meta, `_next/static`, `_vercel/insights`).
- Dark/light theme, narrow centered column, minimal chrome.
- Home page = a **bento tile dashboard**:
  - Intro + avatar.
  - Tiles: **Selected work**, **Digital garden**, **Writing**, **Work with me**, **Resources**.
  - Each tile previews real content (carousel, latest notes, latest essays, services, books).
  - Tiles have key chips and **keyboard shortcuts** (W, G, B, S, R).
- Clicking a tile opens an **in-page section via hash**:
  - `#work`, `#garden`, `#blog`, `#services`, `#resources`.
  - Not separate routes, so the URL is not shareable/SEO-friendly.
- Section view pattern:
  - A **Back** button.
  - A **sticky left context rail**: mini card, section letter (`[G]`, `[W]`, `[B]`, `[S]`, `[R]`), description.
  - Main canvas: grid/list of cards.
  - Garden notes: date + number (`0016`), title, summary, tags (`DESIGN`, `PHILOSOPHY`, `PSYCHOLOGY`), optional image.
  - Writing: 2-column cards with strong cover images, date, title, description.
  - Work: a project list with year, title, one-line summary.
  - Services: offerings with detail blocks.
  - Resources: setup + hand-picked books.
- What makes it feel designed: one clear home, strong previews, a consistent section shell, editorial cards, mono labels, keyboard shortcuts, restrained motion.

### What to borrow
- A **simple main page** with a small number of strong preview tiles.
- A **shared subpage shell** with a back affordance and a sticky context rail.
- **Content taxonomy** (garden tags, dated notes).
- **Editorial cards** with real imagery, dates, and one-line summaries.
- Optional **keyboard shortcuts** and key chips.

### What to improve
- Use **real routes** (`/garden`, `/writing`, `/photography`) instead of hash views — shareable, indexable, and better for Open Graph.
- Keep Vysyakh’s **narrative portfolio identity**; don’t turn the home page into a dashboard clone.
- Avoid the Wall of Portfolios iframe wrapper; it’s a platform profile, not the site.

---

## 2. Target information architecture

Keep the home page as the story. Move the heavy, browsable content to routes.

```
/                      Home: Hero → Story → Platform → Building → Explore → Contact
/garden                Creativity + tech philosophy notes (digital garden)
/garden/[slug]         Individual note
/writing               Essays (Substack list + optional native essays)
/photography           Full Google Photos gallery
```

Optional later:

```
/work                  Selected project detail pages
/work/[slug]
/about                 Longer bio / now page
```

The main page keeps:

- Hero + Pompu
- Career story + résumé paper
- Platform loop
- Building / projects
- **Explore** (new compact tile section)
- Contact + footer

Full Writing and Photography sections move off the main page and become **Explore tiles**. This keeps the home page short and makes the dedicated pages richer.

---

## 3. Main page: the Explore section

A compact, editorial tile grid between Building and Contact.

### Tiles (v1)

1. **Garden** → `/garden`
   - Preview: 3 latest note titles/dates or a small stack of note cards.
   - Copy: “Creativity, tech philosophy, and the things I keep thinking about.”
   - Key chip: `G` (optional).

2. **Writing** → `/writing`
   - Preview: latest Substack cover image + title.
   - Copy: “Longer thoughts on agent platforms, systems, and building.”
   - Key chip: `W`.

3. **Photography** → `/photography`
   - Preview: a 2×2 mosaic or a 3-photo strip from the album.
   - Copy: “Frames from outside the terminal.”
   - Key chip: `P`.

### Tile design
- 2 columns on desktop, 1 on mobile.
- Each tile is a `next/link` with a preview area, title, one-liner, arrow.
- Hover: lift, accent border, image scale (reduced-motion safe).
- Add a small “Explore” section label with a rule, consistent with the site.
- No counts like “11 frames” — keep the copy count-free.

### Keyboard shortcuts (optional, recommended)
- `G` → `/garden`, `W` → `/writing`, `P` → `/photography` on the home page.
- Guard: ignore when focus is inside an input/textarea/contenteditable, or when a modifier is held.
- Show key chips on the tiles, like the reference.

---

## 4. Shared subpage shell

Create `app/components/SubpageShell.tsx` (server component) or an `app/(explore)/layout.tsx`.

Layout:

```
┌ Back to home ──────────────────────────────┐
│                                            │
│  [G] Garden              Note grid...      │
│  Description             ┌────┐ ┌────┐     │
│  Tags / filters           │    │ │    │     │
│  Context card             └────┘ └────┘     │
│                                            │
└────────────────────────────────────────────┘
```

- Sticky left rail on `lg+`; stacks on mobile.
- Left rail: section letter, title, description, tag/filter list, small context card, “Back to home”.
- Main canvas: content grid.
- Reuse the global `ThemeToggle` and `CommandPalette`.
- Add a subtle page-enter animation via `app/template.tsx` (fade/lift, reduced-motion safe).
- Subpages don’t need the full hero/Pompu chat; decide later whether to add a compact “ask Pompu” pill.

---

## 5. Garden (`/garden`)

The core new section for **creativity + tech philosophy**.

### Content model (recommended first pass: TS data, no new deps)

```ts
type GardenNote = {
  slug: string
  title: string
  date: string        // ISO or display
  number: string      // e.g. "001"
  summary: string
  tags: GardenTag[]   // creativity | philosophy | systems | ai | design | life
  body: string[]      // paragraphs for v1; MDX later if needed
  image?: string
  readingTime?: string
}
```

If long-form formatting is needed, add MDX later (`@next/mdx` + `@mdx-js/loader`). For v1, TS data avoids new dependencies and keeps the build simple.

### Index page
- Tag filter chips (client-side; `All · Creativity · Philosophy · Systems · AI · Design · Life`).
- Cards: date, number, title, summary, tags, optional image, hover arrow.
- 2 columns desktop, 1 mobile.
- Use the existing `Reveal` for staggered entry.

### Note page
- Narrow reading column (~680px).
- Large title, date, tags, reading time.
- Prose styles (headings, lists, blockquotes, code, images).
- Thin reading-progress line at the top (accent).
- Back to `/garden` and “Next note” links.
- `generateMetadata` for title/description/OG.

### Seed content
Start with 3–5 notes, e.g.:
- “What agents taught me about interfaces”
- “The platform is the product”
- “Taste is a systems problem”
- “Notes on light and patience” (photography crossover)
- “Why I keep a digital garden”

---

## 6. Writing (`/writing`)

- Move the current Substack list from the home page to `/writing`.
- Keep the **cover images from RSS enclosures** and the two-column card grid.
- Cards link out to Substack (no need to mirror posts).
- Optional: add native essays later in `content/writing/*.mdx` with the same card layout.
- Add a Substack subscribe CTA at the bottom.
- The home Explore tile shows the latest cover + title.

---

## 7. Photography (`/photography`)

- Move the full gallery + lightbox to `/photography`.
- Keep the editorial sticky rail + masonry layout.
- Reuse the Google Photos fetch and `/api/photo` proxy.
- Add a `preview` mode for the home tile: first 3–4 photos, no lightbox needed (or a lightweight link).
- Keep the album URL in `GOOGLE_PHOTOS_ALBUM_URL` only; never hardcode it.
- Vercel must have the env var, or the gallery shows the empty state.

---

## 8. Discovery, SEO, and Pompu

- **⌘K**: add Garden, Writing, Photography entries (route navigation).
- **Sitemap**: add `/garden`, each `/garden/[slug]`, `/writing`, `/photography`.
- **Metadata**: per-route `metadata`; per-note `generateMetadata` with OG title/description.
- **Pompu**:
  - Add topics: “What do you write about?”, “What’s in the garden?”, “Show me your photography.”
  - Extend `PompuAction` with a `route` kind, or use internal links in the action.
  - Keep the main page Pompu; subpages can get a compact pill later.
- **Footer**: links to the new routes.

---

## 9. Motion and design language

Reuse what is already there:
- `Reveal` for scroll-in cards.
- Hover lift + image scale on tiles/cards.
- Mono labels, thin rules, one accent.
- Existing light/paper and dark/neon-noir themes.

Add:
- Page-enter fade (`app/template.tsx`).
- Tile preview micro-motion (slow crossfade between 2–3 photos on the Photography tile; optional).
- Reading progress on garden notes.
- Optional key chips + shortcuts.

Guardrails:
- Respect `prefers-reduced-motion` for every new transition.
- No auto-advancing carousels; the reference’s cycling work tile is not necessary.
- Keep the home page under the current size budget; moving the gallery/feed off it should help.

---

## 10. Implementation phases

### Phase 0 — Decisions
- Confirm routes and names: `/garden`, `/writing`, `/photography`.
- Choose TS data vs MDX for garden notes.
- Decide whether to keep Photography/Writing previews on the home page.
- Draft 3–5 garden notes and tag taxonomy.

### Phase 1 — Route shell + Explore
- Add `SubpageShell` / `app/(explore)/layout.tsx`.
- Add empty routes with metadata.
- Add Explore tiles; move the full Writing/Photography sections off the home page.
- Add ⌘K + sitemap entries.
- Verify build, lint, tsc, mobile/desktop, light/dark.

### Phase 2 — Garden
- Add content model + seed notes.
- Build index with tag filters.
- Build note detail with prose, reading progress, metadata.
- Add Garden tile preview.

### Phase 3 — Writing route
- Move the RSS cards to `/writing`.
- Add the subscribe CTA.
- Add the Writing tile preview.

### Phase 4 — Photography route
- Move the gallery/lightbox to `/photography`.
- Add the home preview mosaic.
- Verify the Vercel env var.

### Phase 5 — Polish
- Page transitions, tile hover/preview motion.
- Pompu topics/actions.
- OG images, sitemap, accessibility/reduced-motion pass.
- Update AGENTS.md and the build-size budget.

---

## 11. Open questions

1. **Naming**: `/garden` vs `/thinking` vs `/creativity`; `/writing` vs `/notes`.
2. **Garden format**: TS data (simple, no deps) or MDX (rich prose)? Recommend TS for v1.
3. **Garden topics**: creativity, tech philosophy, systems, AI, design, life — anything else?
4. **Writing**: keep Substack as the source and link out, or start native essays too?
5. **Home page**: keep a photography preview and a latest-post preview, or just one Explore tile each?
6. **Keyboard shortcuts**: add `G`/`W`/`P` with key chips, or skip?
7. **Projects**: keep the Building cards on the home page, or also move them to `/work/[slug]`?
8. **Pompu on subpages**: full dock, compact pill, or home-page only?
9. **Content volume for v1**: how many garden notes and essays do you want at launch?
10. **Newsletter**: should `/writing` include a Substack subscribe CTA?

---

## 12. Recommendation

For the first release:

- Keep the home page as the narrative + a **3-tile Explore** section.
- Build `/garden` + `/garden/[slug]` first — it is the clearest expression of “creativity + tech philosophy.”
- Move `/writing` and `/photography` to routes with strong preview tiles.
- Use TS data for garden notes; avoid MDX until the content needs it.
- Use real routes, not hashes; borrow the reference’s layout and taxonomy, not its URL model.
