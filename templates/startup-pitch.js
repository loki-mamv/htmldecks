/**
 * DeckKit — Startup Pitch Template Generator
 * 
 * Dark gradient theme with purple/blue tones.
 * Designed for startup pitch decks: problem → solution → market → team → ask.
 * 
 * @param {Object} config
 * @param {string} config.companyName
 * @param {string} config.accentColor
 * @param {Array<{title: string, content: string}>} config.slides
 * @returns {string} Complete standalone HTML document
 */
function generateStartupPitch({ companyName, accentColor, slides }) {
  const slideCount = slides.length;

  const slidesHTML = slides.map((slide, i) => {
    const bullets = slide.content
      .split('\n')
      .filter(line => line.trim())
      .map(line => `<li>${line.replace(/^[-•]\s*/, '')}</li>`)
      .join('\n              ');

    // First slide is the title slide
    if (i === 0) {
      return `
      <section class="slide slide--title" data-index="${i}">
        <div class="slide__content">
          <h1>${slide.title}</h1>
          <p class="slide__subtitle">${slide.content.split('\n')[0] || ''}</p>
          <div class="slide__accent-bar"></div>
          <p class="slide__company">${companyName}</p>
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
  <title>${companyName} — Pitch Deck</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    /* === Reset === */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    
    :root {
      --accent: ${accentColor};
      --bg-start: #1A1145;
      --bg-end: #0D0B1A;
      --text: #FFFFFF;
      --text-muted: rgba(255,255,255,0.55);
    }

    html { scroll-snap-type: y mandatory; scroll-behavior: smooth; overflow-x: hidden; }
    body {
      font-family: 'Lexend', sans-serif;
      background: var(--bg-end);
      color: var(--text);
      -webkit-font-smoothing: antialiased;
    }

    /* === Slide Layout === */
    .slide {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      scroll-snap-align: start;
      position: relative;
      padding: 60px 40px;
      background: linear-gradient(135deg, var(--bg-start), var(--bg-end));
    }
    .slide:nth-child(even) {
      background: linear-gradient(135deg, #12103A, #1A1145);
    }
    .slide__content {
      max-width: 800px;
      width: 100%;
      opacity: 0;
      transform: translateY(30px);
      animation: fadeUp 0.7s ease forwards;
    }

    /* === Title Slide === */
    .slide--title { text-align: center; }
    .slide--title h1 {
      font-size: clamp(2.5rem, 6vw, 4.5rem);
      font-weight: 700;
      letter-spacing: -0.02em;
      margin-bottom: 16px;
    }
    .slide__subtitle {
      font-size: clamp(1rem, 2vw, 1.4rem);
      color: var(--text-muted);
      margin-bottom: 32px;
      font-weight: 300;
    }
    .slide__accent-bar {
      width: 60px;
      height: 4px;
      background: var(--accent);
      border-radius: 2px;
      margin: 0 auto 24px;
    }
    .slide__company {
      font-size: 0.9rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.15em;
      font-weight: 500;
    }

    /* === Content Slides === */
    .slide h2 {
      font-size: clamp(1.8rem, 4vw, 3rem);
      font-weight: 600;
      margin-bottom: 32px;
      position: relative;
      padding-bottom: 16px;
    }
    .slide h2::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 40px;
      height: 3px;
      background: var(--accent);
      border-radius: 2px;
    }
    .slide__bullets {
      list-style: none;
      font-size: clamp(1rem, 2vw, 1.3rem);
      line-height: 1.8;
      font-weight: 300;
    }
    .slide__bullets li {
      padding-left: 28px;
      position: relative;
      margin-bottom: 12px;
      color: rgba(255,255,255,0.85);
    }
    .slide__bullets li::before {
      content: '';
      position: absolute;
      left: 0;
      top: 10px;
      width: 8px;
      height: 8px;
      background: var(--accent);
      border-radius: 50%;
    }

    /* === Progress Bar === */
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
      right: 24px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      flex-direction: column;
      gap: 12px;
      z-index: 100;
    }
    .nav-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      border: none;
      cursor: pointer;
      transition: all 0.3s;
      padding: 0;
    }
    .nav-dot--active {
      background: var(--accent);
      transform: scale(1.3);
    }

    /* === Slide Counter === */
    .slide-counter {
      position: fixed;
      bottom: 24px;
      left: 24px;
      font-size: 0.8rem;
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
      .slide { 
        min-height: auto; 
        page-break-after: always; 
        padding: 40px;
        break-inside: avoid;
      }
      .progress, .nav-dots, .slide-counter { display: none; }
      .slide__content { opacity: 1; transform: none; animation: none; }
      body { background: #fff; color: #111; }
      .slide { background: #fff !important; }
      .slide__subtitle, .slide__company, .slide__bullets li { color: #444 !important; }
    }

    /* === Mobile === */
    @media (max-width: 768px) {
      .slide { padding: 40px 24px; }
      .nav-dots { right: 12px; gap: 8px; }
      .nav-dot { width: 8px; height: 8px; }
    }
  </style>
</head>
<body>
  <!-- Progress bar -->
  <div class="progress" id="progress"></div>

  <!-- Navigation dots -->
  <div class="nav-dots" id="navDots">
    ${slides.map((_, i) => `<button class="nav-dot${i === 0 ? ' nav-dot--active' : ''}" data-index="${i}" aria-label="Go to slide ${i + 1}"></button>`).join('\n    ')}
  </div>

  <!-- Slide counter -->
  <div class="slide-counter" id="slideCounter">1 / ${slideCount}</div>

  <!-- Slides -->
  ${slidesHTML}

  <script>
    (function() {
      const slides = document.querySelectorAll('.slide');
      const dots = document.querySelectorAll('.nav-dot');
      const progress = document.getElementById('progress');
      const counter = document.getElementById('slideCounter');
      const total = slides.length;
      let current = 0;

      // Update UI for current slide
      function updateUI(index) {
        current = index;
        // Progress bar
        progress.style.width = ((index + 1) / total * 100) + '%';
        // Counter
        counter.textContent = (index + 1) + ' / ' + total;
        // Dots
        dots.forEach((d, i) => d.classList.toggle('nav-dot--active', i === index));
        // Re-trigger animation
        slides[index].querySelector('.slide__content').style.animation = 'none';
        slides[index].offsetHeight; // reflow
        slides[index].querySelector('.slide__content').style.animation = '';
      }

      // Scroll observer
      const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            updateUI(parseInt(e.target.dataset.index));
          }
        });
      }, { threshold: 0.5 });
      slides.forEach(s => observer.observe(s));

      // Dot click
      dots.forEach(dot => {
        dot.addEventListener('click', () => {
          slides[parseInt(dot.dataset.index)].scrollIntoView({ behavior: 'smooth' });
        });
      });

      // Keyboard navigation
      document.addEventListener('keydown', e => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ') {
          e.preventDefault();
          if (current < total - 1) slides[current + 1].scrollIntoView({ behavior: 'smooth' });
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          if (current > 0) slides[current - 1].scrollIntoView({ behavior: 'smooth' });
        }
      });

      // Touch/swipe
      let touchStartY = 0;
      document.addEventListener('touchstart', e => { touchStartY = e.touches[0].clientY; });
      document.addEventListener('touchend', e => {
        const diff = touchStartY - e.changedTouches[0].clientY;
        if (Math.abs(diff) > 50) {
          if (diff > 0 && current < total - 1) slides[current + 1].scrollIntoView({ behavior: 'smooth' });
          else if (diff < 0 && current > 0) slides[current - 1].scrollIntoView({ behavior: 'smooth' });
        }
      });
    })();
  </script>
</body>
</html>`;
}
