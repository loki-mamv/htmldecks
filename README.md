# HTML Decks

**Build stunning presentations in 2 minutes.**

HTML Decks is a client-side web app where you pick a presentation template, fill in your content via a form, preview it live, and download a single self-contained HTML file.

No backend. No sign-up. No PowerPoint.

## Features

- **8 template designs** (3 fully working in MVP: Startup Pitch, Sales Deck, Conference Talk)
- **Live preview** — see changes as you type
- **One-click download** — get a complete standalone HTML file
- **Generated decks include:**
  - Keyboard navigation (arrow keys, spacebar)
  - Touch/swipe support
  - Scroll snap between slides
  - Progress bar & navigation dots
  - Reveal animations
  - Print-friendly styles
- **Zero dependencies** — pure HTML/CSS/JS
- **Fully responsive** — works on mobile

## Running Locally

Just open `index.html` in a browser. No server needed.

```bash
open index.html
# or
python3 -m http.server 8080   # then visit http://localhost:8080
```

## Hosting

Drop the entire folder on GitHub Pages, Netlify, Vercel, or any static host.

## File Structure

```
htmldecks/
├── index.html              # Landing page + app (single page)
├── styles.css              # Main styles
├── app.js                  # Builder logic
├── templates/
│   ├── startup-pitch.js    # Template: Startup Pitch (dark purple/blue)
│   ├── sales-deck.js       # Template: Sales Deck (clean light blue)
│   └── conference-talk.js  # Template: Conference Talk (dark + amber)
└── README.md
```

## Templates

| Template | Status | Style |
|----------|--------|-------|
| Startup Pitch | ✅ Ready | Dark gradient, purple/blue |
| Sales Deck | ✅ Ready | Clean light, blue accents |
| Conference Talk | ✅ Ready | Dark + amber/gold |
| Quarterly Review | 🔜 Coming | Green/teal light |
| Product Launch | 🔜 Coming | Vibrant gradient mesh |
| Team Intro | 🔜 Coming | Warm soft colors |
| Investor Update | 🔜 Coming | Minimal Swiss b&w |
| Workshop | 🔜 Coming | Colorful friendly |

## Gumroad Integration

The download is currently free. There's a commented-out Gumroad overlay in `index.html` that can be enabled to gate downloads behind a pay-what-you-want checkout.

## Tech

- Fonts: Lexend + Inter (Google Fonts)
- Colors: Primary #5A49E1, Accent #46D19A
- Zero backend — everything runs in the browser
- Generated HTML files are fully self-contained (only external dep is Google Fonts CDN)

---

Built by [mamv.co](https://mamv.co)
