/**
 * DeckKit — Sales Deck Template Generator
 *
 * Clean light theme with blue accents.
 * Designed for sales presentations: value prop → features → pricing → CTA.
 *
 * @param {Object} config
 * @param {string} config.companyName
 * @param {string} config.accentColor
 * @param {Array<{title: string, content: string}>} config.slides
 * @returns {string} Complete standalone HTML document
 */
function generateSalesDeck({ companyName, accentColor, slides }) {
  const slideCount = slides.length;

  const slidesHTML = slides.map((slide, i) => {
    const bullets = slide.content
      .split('\n')
      .filter(line => line.trim())
      .map(line => `<li>${line.replace(/^[-•]\s*/, '')}</li>`)
      .join('\n              ');

    if (i === 0) {
      return `
      <section class="slide slide--title" data-index="${i}">
        <div class="slide__badge">${companyName}</div>
        <div class="slide__content">
          <h1>${slide.title}</h1>
          <p class="slide__subtitle">${slide.content.split('\n')[0] || ''}</p>
        </div>
        <div class="slide__decoration"></div>
      </section>`;
    }

    return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <div class="slide__number">${String(i).padStart(2, '0')}</div>
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
  <title>${companyName} — Sales Deck</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --accent: ${accentColor};
      --bg: #FFFFFF;
      --bg-alt: #F7F9FC;
      --text: #1B2540;
      --text-muted: #6B7B99;
      --border: #E5EAF2;
    }

    html { scroll-snap-type: y mandatory; scroll-behavior: smooth; overflow-x: hidden; }
    body {
      font-family: 'Inter', -apple-system, sans-serif;
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
      padding: 60px 80px;
      background: var(--bg);
    }
    .slide:nth-child(even) {
      background: var(--bg-alt);
    }
    .slide__content {
      max-width: 720px;
      width: 100%;
      opacity: 0;
      transform: translateY(24px);
      animation: fadeUp 0.6s ease forwards;
    }

    /* === Title Slide === */
    .slide--title {
      text-align: center;
      flex-direction: column;
      gap: 0;
    }
    .slide__badge {
      display: inline-block;
      padding: 8px 20px;
      background: var(--accent);
      color: #fff;
      border-radius: 100px;
      font-size: 0.85rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      margin-bottom: 40px;
      text-transform: uppercase;
    }
    .slide--title h1 {
      font-size: clamp(2rem, 5vw, 3.8rem);
      font-weight: 700;
      letter-spacing: -0.03em;
      line-height: 1.15;
      margin-bottom: 20px;
    }
    .slide__subtitle {
      font-size: clamp(1rem, 2vw, 1.3rem);
      color: var(--text-muted);
      font-weight: 400;
      max-width: 560px;
      margin: 0 auto;
      line-height: 1.6;
    }
    .slide__decoration {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, var(--accent), transparent);
    }

    /* === Content Slides === */
    .slide__number {
      font-size: 0.75rem;
      color: var(--accent);
      font-weight: 700;
      letter-spacing: 0.1em;
      margin-bottom: 12px;
    }
    .slide h2 {
      font-size: clamp(1.5rem, 3.5vw, 2.5rem);
      font-weight: 700;
      margin-bottom: 28px;
      letter-spacing: -0.02em;
      line-height: 1.2;
    }
    .slide__bullets {
      list-style: none;
      font-size: clamp(0.95rem, 1.8vw, 1.15rem);
      line-height: 1.7;
    }
    .slide__bullets li {
      padding: 12px 0 12px 20px;
      position: relative;
      border-bottom: 1px solid var(--border);
      color: var(--text-muted);
    }
    .slide__bullets li:last-child { border-bottom: none; }
    .slide__bullets li::before {
      content: '';
      position: absolute;
      left: 0;
      top: 20px;
      width: 6px;
      height: 6px;
      background: var(--accent);
      border-radius: 2px;
    }

    /* === Progress === */
    .progress {
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      background: var(--accent);
      z-index: 100;
      transition: width 0.3s ease;
    }

    /* === Nav Dots === */
    .nav-dots {
      position: fixed;
      right: 28px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      flex-direction: column;
      gap: 10px;
      z-index: 100;
    }
    .nav-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--border);
      border: none;
      cursor: pointer;
      transition: all 0.3s;
      padding: 0;
    }
    .nav-dot--active {
      background: var(--accent);
      transform: scale(1.4);
    }

    /* === Slide Counter === */
    .slide-counter {
      position: fixed;
      bottom: 28px;
      right: 28px;
      font-size: 0.75rem;
      color: var(--text-muted);
      z-index: 100;
      font-weight: 500;
    }

    /* === Animations === */
    @keyframes fadeUp {
      to { opacity: 1; transform: translateY(0); }
    }

    /* === Print === */
    @media print {
      html { scroll-snap-type: none; }
      .slide { min-height: auto; page-break-after: always; padding: 40px; break-inside: avoid; }
      .progress, .nav-dots, .slide-counter { display: none; }
      .slide__content { opacity: 1; transform: none; animation: none; }
    }

    @media (max-width: 768px) {
      .slide { padding: 40px 24px; }
      .nav-dots { right: 12px; }
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
        slides[index].querySelector('.slide__content, .slide__badge').style.animation = 'none';
        slides[index].offsetHeight;
        const el = slides[index].querySelector('.slide__content');
        if (el) el.style.animation = '';
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
