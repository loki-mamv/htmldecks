# DeckKit Templates

A collection of 8 premium HTML presentation templates. Each is a single, zero-dependency file with inline CSS and JavaScript.

## Templates

### 1. Startup Pitch (`startup-pitch.html`)
**Style:** Bold gradient dark theme (purple/blue)

A polished startup pitch deck template with slides for problem, solution, market opportunity, traction, team, and the ask. Features dramatic gradient backgrounds, glass-morphism cards, and animated stat counters.

**Best for:** Investor meetings, demo days, pitch competitions

---

### 2. Sales Deck (`sales-deck.html`)
**Style:** Clean professional light theme (blue accents)

A B2B sales presentation with slides covering pain points, solution overview, features, social proof, case studies, ROI calculator, pricing, and CTA. Clean, trustworthy aesthetic with data-focused layouts.

**Best for:** Sales calls, prospect presentations, product demos

---

### 3. Conference Talk (`conference-talk.html`)
**Style:** Dramatic dark with orange/amber accents

A keynote-worthy presentation template with bold typography, speaker intro, agenda, content sections, key takeaways, and Q&A. High contrast design that commands attention.

**Best for:** Conference talks, keynotes, webinars, meetups

---

### 4. Quarterly Review (`quarterly-review.html`)
**Style:** Corporate light, green/teal data-focused

A business quarterly review template with executive summary, KPI dashboards, revenue breakdowns, product scorecard, team updates, and roadmap. Optimized for presenting metrics clearly.

**Best for:** Board meetings, investor updates, team all-hands

---

### 5. Product Launch (`product-launch.html`)
**Style:** Modern SaaS, gradient meshes, vibrant

An eye-catching product announcement template with teaser, problem/solution, feature showcases, demo placeholder, pricing tiers, launch timeline, and CTA. Animated mesh gradient backgrounds.

**Best for:** Product launches, feature announcements, marketing events

---

### 6. Team Intro (`team-intro.html`)
**Style:** Warm, approachable, soft colors (terracotta/sage)

A friendly company/team introduction with mission, values, leadership bios, full team grid, culture highlights, and hiring callout. Warm color palette that feels human and approachable.

**Best for:** New hire onboarding, company overviews, recruiting presentations

---

### 7. Investor Update (`investor-update.html`)
**Style:** Minimal, Swiss-style, black/white with red accent

A clean monthly investor update with TL;DR summary, key metrics, revenue breakdown, pipeline health, product updates, milestones, financials, and asks. Data-dense but highly scannable.

**Best for:** Monthly/quarterly investor updates, board reports

---

### 8. Workshop (`workshop.html`)
**Style:** Friendly, colorful, engaging

An interactive training deck with learning objectives, agenda, content sections, exercise cards with checklists/timers, and resource links. Multiple accent colors keep energy high.

**Best for:** Workshops, training sessions, educational content

---

## Features (All Templates)

- ⌨️ **Keyboard navigation** — Arrow keys, Space
- 👆 **Touch/swipe support** — Mobile-friendly gestures
- 📜 **Scroll navigation** — Snap-scrolling between slides
- 📊 **Progress bar** — Fixed at top of viewport
- 🔘 **Navigation dots** — Click to jump to any slide
- ✨ **Scroll-triggered animations** — Staggered reveal effects
- 📱 **Responsive design** — Works on mobile, tablet, desktop
- 🖨️ **Print styles** — Clean output for PDF export
- 🎨 **Google Fonts** — Each template uses different fonts
- 📝 **Well-commented CSS** — Easy to customize with CSS variables
- ♿ **Reduced motion support** — Respects user preferences

## Customization

Each template has a comment block at the top explaining how to customize:

1. **Colors** — Edit the `:root` CSS variables
2. **Fonts** — Swap the Google Fonts import and update font variables
3. **Content** — Edit the `<section class="slide">` elements directly

### CSS Variables Example

```css
:root {
    --bg-primary: #0a0a1a;
    --accent-1: #7c3aed;
    --accent-2: #2563eb;
    --text-primary: #f1f5f9;
    --font-display: 'Space Grotesk', sans-serif;
    --font-body: 'DM Sans', sans-serif;
}
```

### Animation Classes

- `.reveal` — Fade in + slide up
- `.reveal.d1` through `.reveal.d5` — Staggered delays
- `.reveal-left` — Fade in + slide from left
- `.reveal-scale` — Fade in + scale up

## Fonts Used

| Template | Display Font | Body Font |
|----------|--------------|-----------|
| Startup Pitch | Space Grotesk | DM Sans |
| Sales Deck | Plus Jakarta Sans | Source Serif 4 |
| Conference Talk | Sora | Libre Baskerville |
| Quarterly Review | Outfit | Newsreader |
| Product Launch | Manrope | Crimson Pro |
| Team Intro | Fraunces | Lora |
| Investor Update | IBM Plex Sans | IBM Plex Serif |
| Workshop | Nunito | Atkinson Hyperlegible |

## Usage

1. Open any `.html` file in a browser
2. Navigate with arrow keys, space, scroll, or click the dots
3. Press `Cmd/Ctrl + P` to print or save as PDF

## License

Part of DeckKit. See main repository for license.
