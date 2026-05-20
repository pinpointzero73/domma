# Domma CMS Point-of-Sale Band — Homepage

**Date:** 2026-05-20
**Owner:** Darryl Waterhouse
**Status:** Approved (pending spec review)

## Problem

The Domma JS homepage drives strong engagement with the framework but has no point-of-sale for **Domma CMS** (https://cms.dommajs.org/). We need a swish, in-character marketing band that converts framework users into CMS prospects.

## Goal

Insert a single, high-impact section on `public/index.html` that:

- Pitches Domma CMS in under five seconds of scanning.
- Mirrors the CMS site's own copy ("Get Started Free") for continuity.
- Doubles as a live demonstration of Domma's effects library, so the section *is* the proof.

## Placement

Between the **Examples** section (ends at line 701) and the **MiniApps** section (starts at line 704). Rationale: user has just seen "real apps you can build" → CMS offer ("or skip the build") → "or these production apps". Strong narrative flow.

## Visual Design

- Full-bleed `<section>`, breaking the container rhythm intentionally.
- Background: `bg-dark bg-ambient-rotate-glow` — mirrors the splash hero, bookending the page.
- Generous vertical padding (~6rem).
- Inner `.container` for content.

### Content stack

1. **Eyebrow** — small, uppercase, tracking-wide: *"Want Domma JS power in a CMS?"*
2. **Headline** (`h2`) — *"Meet Domma CMS."* — animated with `scribe()` typewriter on scroll-in.
3. **Lead** — *"The CMS that actually delivers. Markdown-first, JSON or MongoDB, 28 themes, zero build step."*
4. **Stat row** — 4 tiles, each fires `counter()` on reveal:
   | Number | Label |
   |--------|-------|
   | 27 | Built-in shortcodes |
   | 28 | Themes with live preview |
   | 6 | Free plugins included |
   | 0 | Build steps |
5. **Dual CTA**:
   - Primary `Get Started Free →` — large, `glow-primary`, `ripple` — → `https://cms.dommajs.org/`
   - Secondary `See Features` — outline — → `https://cms.dommajs.org/#features`
6. **Footer tagline** — muted small: *"Built on Domma · Self-hosted · Free to try"*

### Effects choreography

Fires **once** when the section enters the viewport (via `Domma.effects.reveal()` with `once: true`):

| t+ (ms) | Effect | Target |
|---------|--------|--------|
| 0 | `reveal()` slide-up | section content |
| 200 | `scribe()` typewriter | headline |
| 600 | `counter()` cascade (80ms stagger) | 4 stat tiles |
| 900 | `tickerTape({mode:'burst'})` | one-shot burst, `'theme'` palette, low density |
| 1200 | `.glow-primary` pulse | primary CTA briefly highlights |

`respectMotionPreference: true` on every effect — users with `prefers-reduced-motion` see a static section.

## Responsive Behaviour

- Stat tiles stack **2×2** on viewports ≤ `md`.
- CTAs go full-width, stacked vertically on viewports ≤ `sm`.
- `tickerTape` density reduced on mobile (perf).

## Implementation Footprint

- HTML block in `public/index.html` (~50 lines) inserted between lines 701 and 703.
- Inline `<style>` block (or appended to existing inline styles) for band gradient, stat-tile styling, CTA polish.
- Inline `<script type="module">` orchestrating the reveal → effect cascade (~25 lines).
- **No new files. No build step needed.** (`build:kickstart-files` not affected.)

## Domma Features Demonstrated

The section showcases six effects from the framework as it pitches the CMS, making it dual-purpose:

- `Domma.effects.reveal`
- `Domma.effects.scribe`
- `Domma.effects.counter`
- `Domma.effects.tickerTape`
- `Domma.effects.ripple`
- `.glow-primary` utility class

## Out of Scope

- Pricing tiers (cms.dommajs.org handles this on its own `/pricing` page).
- Iframed live demo (the CMS site is itself a marketing page, no demo to iframe).
- A/B testing or analytics instrumentation (can be added later if needed).
- Screenshot of the CMS admin UI (none available; the section relies on motion + copy).

## Success Criteria

- Section renders correctly on desktop and mobile.
- All six effects fire in the choreographed sequence on first scroll-in.
- Reduced-motion users see a static, fully-readable section with the same copy and CTAs.
- Primary CTA navigates to `https://cms.dommajs.org/`.
- No console errors. No regressions to surrounding Examples / MiniApps sections.

## Risks

- **`tickerTape` overdose** — if density is too high, it competes with the headline. Mitigation: start with `density: 0.3` and tune down if it dominates.
- **Effect chain timing on slow devices** — choreography assumes ~60fps reveal; if reveal lags, downstream effects might fire over an unfinished slide-up. Mitigation: use `onReveal` callbacks to chain rather than fixed `setTimeout`s where possible.
- **Mobile perf with tickerTape** — canvas effect on low-end devices. Mitigation: reduce density on mobile, or skip tickerTape entirely on viewports below `sm`.
