/**
 * HTML Decks — Conference Talk Template Generator
 *
 * Dark theme with amber/gold accents.
 * Designed for stage presentations: big text, high contrast, speaker-friendly.
 *
 * @param {Object} config
 * @param {string} config.companyName
 * @param {string} config.accentColor
 * @param {Array<{title: string, content: string}>} config.slides
 * @returns {string} Complete standalone HTML document
 */
function generateConferenceTalk({ companyName, accentColor, slides }) {
  const slideCount = slides.length;
  const pageTitle = slides[0] ? slides[0].title : companyName;

  const slidesHTML = slides.map((slide, i) => {
    const bullets = slide.content
      .split('\n')
      .filter(line => line.trim())
      .map(line => `<li>${line.replace(/^[-•]\s*/, '')}</li>`)
      .join('\n              ');

    if (i === 0) {
      return `
      <section class="slide slide--title" data-index="${i}">
        <div class="slide__bg-glow"></div>
        <div class="slide__content">
          <h1>${slide.title}</h1>
          <p class="slide__subtitle">${slide.content.split('\n')[0] || ''}</p>
          <div class="slide__meta">
            <span class="slide__author">${companyName}</span>
          </div>
        </div>
      </section>`;
    }

    // Check if it's a "big statement" slide (single line, short)
    const lines = slide.content.split('\n').filter(l => l.trim());
    const isBigStatement = lines.length === 1 && lines[0].length < 80;

    if (isBigStatement) {
      return `
      <section class="slide slide--statement" data-index="${i}">
        <div class="slide__bg-glow"></div>
        <div class="slide__content">
          <h2>${slide.title}</h2>
          <p class="slide__big-text">${lines[0].replace(/^[-•]\s*/, '')}</p>
        </div>
      </section>`;
    }

    return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <h2>${slide.title}</h2>
          <ul class="slide__bullets">
            ${bullets}
          </ul>
        </div>
      </section>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle} — ${companyName}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --accent: ${accentColor};
      --bg: #0A0A0F;
      --surface: #141420;
      --text: #FFFFFF;
      --text-muted: rgba(255,255,255,0.5);
    }

    html { scroll-snap-type: y mandatory; scroll-behavior: smooth; overflow-x: hidden; }
    body {
      font-family: 'Lexend', sans-serif;
      background: var(--bg);
      color: var(--text);
      -webkit-font-smoothing: antialiased;
    }

    /* === Slides === */
    .slide {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      scroll-snap-align: start;
      position: relative;
      padding: 60px;
      overflow: hidden;
    }
    .slide__content {
      max-width: 900px;
      width: 100%;
      position: relative;
      z-index: 2;
      opacity: 0;
      transform: translateY(20px);
      animation: slideIn 0.6s ease forwards;
    }
    .slide__bg-glow {
      position: absolute;
      width: 500px;
      height: 500px;
      border-radius: 50%;
      background: var(--accent);
      opacity: 0.04;
      filter: blur(120px);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1;
    }

    /* === Title Slide === */
    .slide--title { text-align: center; }
    .slide--title h1 {
      font-size: clamp(2.5rem, 7vw, 5rem);
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1.1;
      margin-bottom: 20px;
    }
    .slide__subtitle {
      font-size: clamp(1rem, 2.5vw, 1.5rem);
      color: var(--text-muted);
      font-weight: 300;
      margin-bottom: 40px;
    }
    .slide__meta {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
    }
    .slide__author {
      font-size: 0.95rem;
      color: var(--accent);
      font-weight: 500;
    }

    /* === Statement Slide === */
    .slide--statement { text-align: center; }
    .slide--statement h2 {
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: var(--accent);
      margin-bottom: 24px;
      font-weight: 600;
    }
    .slide--statement h2::after { display: none; }
    .slide__big-text {
      font-size: clamp(1.8rem, 4.5vw, 3.5rem);
      font-weight: 600;
      line-height: 1.3;
      letter-spacing: -0.02em;
    }

    /* === Content Slides === */
    .slide h2 {
      font-size: clamp(1.5rem, 4vw, 2.8rem);
      font-weight: 700;
      margin-bottom: 36px;
      letter-spacing: -0.02em;
    }
    .slide h2::after {
      content: '';
      display: block;
      width: 48px;
      height: 4px;
      background: var(--accent);
      border-radius: 2px;
      margin-top: 16px;
    }
    .slide__bullets {
      list-style: none;
      font-size: clamp(1rem, 2vw, 1.35rem);
      font-weight: 300;
      line-height: 1.8;
    }
    .slide__bullets li {
      padding: 10px 0 10px 32px;
      position: relative;
      color: rgba(255,255,255,0.8);
    }
    .slide__bullets li::before {
      content: '→';
      position: absolute;
      left: 0;
      color: var(--accent);
      font-weight: 500;
    }

    /* === Progress === */
    .progress {
      position: fixed;
      bottom: 0;
      left: 0;
      height: 3px;
      background: var(--accent);
      z-index: 100;
      transition: width 0.3s ease;
    }

    /* === Nav Dots === */
    .nav-dots {
      position: fixed;
      left: 28px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      flex-direction: column;
      gap: 14px;
      z-index: 100;
    }
    .nav-dot {
      width: 3px;
      height: 20px;
      border-radius: 2px;
      background: rgba(255,255,255,0.15);
      border: none;
      cursor: pointer;
      transition: all 0.3s;
      padding: 0;
    }
    .nav-dot--active {
      background: var(--accent);
      height: 32px;
    }

    /* === Counter === */
    .slide-counter {
      position: fixed;
      bottom: 28px;
      right: 28px;
      font-size: 0.75rem;
      color: var(--text-muted);
      z-index: 100;
      font-variant-numeric: tabular-nums;
    }

    /* === Animations === */
    @keyframes slideIn {
      to { opacity: 1; transform: translateY(0); }
    }

    /* === Print === */
    @media print {
      html { scroll-snap-type: none; }
      .slide { min-height: auto; page-break-after: always; padding: 40px; break-inside: avoid; }
      .progress, .nav-dots, .slide-counter, .slide__bg-glow { display: none; }
      .slide__content { opacity: 1; transform: none; animation: none; }
      body { background: #fff; color: #111; }
      .slide { background: #fff !important; }
      .slide__subtitle, .slide__author, .slide__bullets li { color: #444 !important; }
      .slide h2::after { background: #333; }
    }

    @media (max-width: 768px) {
      .slide { padding: 40px 24px; }
      .nav-dots { left: 12px; }
    }
  </style>
</head>
<body>
  <div class="progress" id="progress"></div>

  <div class="nav-dots" id="navDots">
    ${slides.map((_, i) => `<button class="nav-dot${i === 0 ? ' nav-dot--active' : ''}" data-index="${i}" aria-label="Go to slide ${i + 1}"></button>`).join('\n    ')}
  </div>

  <div class="slide-counter" id="slideCounter">1 / ${slideCount}</div>

  ${slidesHTML}

  <script>
    (function() {
      const slides = document.querySelectorAll('.slide');
      const dots = document.querySelectorAll('.nav-dot');
      const progress = document.getElementById('progress');
      const counter = document.getElementById('slideCounter');
      const total = slides.length;
      let current = 0;

      function updateUI(index) {
        current = index;
        progress.style.width = ((index + 1) / total * 100) + '%';
        counter.textContent = (index + 1) + ' / ' + total;
        dots.forEach((d, i) => d.classList.toggle('nav-dot--active', i === index));
        const el = slides[index].querySelector('.slide__content');
        if (el) {
          el.style.animation = 'none';
          el.offsetHeight;
          el.style.animation = '';
        }
      }

      const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) updateUI(parseInt(e.target.dataset.index));
        });
      }, { threshold: 0.5 });
      slides.forEach(s => observer.observe(s));

      dots.forEach(dot => {
        dot.addEventListener('click', () => {
          slides[parseInt(dot.dataset.index)].scrollIntoView({ behavior: 'smooth' });
        });
      });

      document.addEventListener('keydown', e => {
        if (['ArrowDown','ArrowRight',' '].includes(e.key)) {
          e.preventDefault();
          if (current < total - 1) slides[current + 1].scrollIntoView({ behavior: 'smooth' });
        } else if (['ArrowUp','ArrowLeft'].includes(e.key)) {
          e.preventDefault();
          if (current > 0) slides[current - 1].scrollIntoView({ behavior: 'smooth' });
        }
      });

      let ty = 0;
      document.addEventListener('touchstart', e => { ty = e.touches[0].clientY; });
      document.addEventListener('touchend', e => {
        const d = ty - e.changedTouches[0].clientY;
        if (Math.abs(d) > 50) {
          if (d > 0 && current < total - 1) slides[current + 1].scrollIntoView({ behavior: 'smooth' });
          else if (d < 0 && current > 0) slides[current - 1].scrollIntoView({ behavior: 'smooth' });
        }
      });
    })();
  </script>
</body>
</html>`;

}
