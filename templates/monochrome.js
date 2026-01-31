/**
 * HTML Decks — Monochrome Template Generator
 *
 * Pure black & white with bold typography and editorial magazine style.
 * High contrast, dramatic, confident design with heavy type treatments.
 *
 * @param {Object} config
 * @param {string} config.companyName
 * @param {string} config.accentColor
 * @param {Array} config.slides
 * @param {boolean} config.watermark
 * @returns {string} Complete standalone HTML document
 */
function generateMonochrome({ companyName, accentColor, slides, watermark }) {
  const slideCount = slides.length;
  const chartColors = ['#000000', '#666666', '#999999', '#bbbbbb', '#444444'];

  const slidesHTML = slides.map((slide, i) => {
    switch (slide.type) {
      case 'title':
        return `
      <section class="slide slide--title ${i % 2 === 0 ? 'slide--dark' : ''}" data-index="${i}">
        <div class="slide__content">
          <div class="slide__number">${String(i + 1).padStart(2, '0')}</div>
          <h1>${slide.title}</h1>
          ${slide.subtitle ? `<p class="slide__subtitle">${slide.subtitle}</p>` : ''}
          ${slide.badge ? `<div class="slide__badge">${slide.badge}</div>` : ''}
          <div class="slide__company">${companyName}</div>
        </div>
      </section>`;

      case 'bullets':
        const bullets = slide.content.split('\n').filter(l => l.trim())
          .map((line, idx) => `<li style="animation-delay: ${idx * 0.08}s"><span class="bullet-num">${String(idx + 1).padStart(2, '0')}</span>${line.replace(/^[-•]\s*/, '')}</li>`).join('\n');
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <h2>${slide.title}</h2>
          <ul class="slide__bullets">${bullets}</ul>
        </div>
      </section>`;

      case 'two-column':
        const leftB = slide.leftColumn.split('\n').filter(l => l.trim())
          .map(line => `<li>${line.replace(/^[-•]\s*/, '')}</li>`).join('\n');
        const rightB = slide.rightColumn.split('\n').filter(l => l.trim())
          .map(line => `<li>${line.replace(/^[-•]\s*/, '')}</li>`).join('\n');
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <h2>${slide.title}</h2>
          <div class="slide__two-column">
            <div class="slide__column"><ul class="slide__bullets">${leftB}</ul></div>
            <div class="slide__column"><ul class="slide__bullets">${rightB}</ul></div>
          </div>
        </div>
      </section>`;

      case 'stats':
        const statsHTML = slide.metrics.map((m, idx) => `
          <div class="slide__stat" style="animation-delay: ${idx * 0.1}s">
            <div class="slide__stat-number">${m.number}</div>
            <div class="slide__stat-label">${m.label}</div>
          </div>`).join('');
        return `
      <section class="slide slide--dark" data-index="${i}">
        <div class="slide__content">
          <h2>${slide.title}</h2>
          <div class="slide__stats">${statsHTML}</div>
        </div>
      </section>`;

      case 'quote':
        return `
      <section class="slide slide--dark" data-index="${i}">
        <div class="slide__content">
          <blockquote class="slide__quote">${slide.quote}</blockquote>
          <cite class="slide__attribution">${slide.attribution}</cite>
        </div>
      </section>`;

      case 'table':
        const tableHTML = slide.tableData.map((row, ri) => {
          const tag = ri === 0 ? 'th' : 'td';
          return `<tr>${row.map(c => `<${tag}>${c}</${tag}>`).join('')}</tr>`;
        }).join('');
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <h2>${slide.title}</h2>
          <table class="slide__table">${tableHTML}</table>
        </div>
      </section>`;

      case 'bar-chart':
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <h2>${slide.title}</h2>
          <div class="slide__chart">${generateBarChart(slide.series, chartColors)}</div>
        </div>
      </section>`;

      case 'line-chart':
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <h2>${slide.title}</h2>
          <div class="slide__chart">${generateLineChart(slide.series, chartColors)}</div>
        </div>
      </section>`;

      case 'pie-chart':
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <h2>${slide.title}</h2>
          <div class="slide__chart">${generatePieChart(slide.segments, chartColors)}</div>
        </div>
      </section>`;

      case 'image-text':
        const imgLeft = slide.layout === 'image-left';
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <h2>${slide.title}</h2>
          <div class="slide__image-text ${imgLeft ? 'slide__image-text--left' : 'slide__image-text--right'}">
            <div class="slide__image"><img src="${slide.imageUrl}" alt="Slide image"></div>
            <div class="slide__text"><p>${slide.description.split('\n').join('</p><p>')}</p></div>
          </div>
        </div>
      </section>`;

      default:
        const defBullets = (slide.content || '').split('\n').filter(l => l.trim())
          .map(line => `<li>${line.replace(/^[-•]\s*/, '')}</li>`).join('\n');
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <h2>${slide.title}</h2>
          <ul class="slide__bullets">${defBullets}</ul>
        </div>
      </section>`;
    }
  }).join('\n');

  function generateBarChart(series, colors) {
    if (!series || !series.length) return '<p>No data</p>';
    const allLabels = [...new Set(series.flatMap(s => s.data.map(d => d.label)))];
    const maxVal = Math.max(...series.flatMap(s => s.data.map(d => d.value)));
    const W = 600, H = 300, m = { t: 20, r: 120, b: 40, l: 60 };
    const pW = W - m.l - m.r, pH = H - m.t - m.b;
    const gW = pW / allLabels.length, bW = Math.max(10, gW / series.length - 4);
    const bars = series.map((s, si) => s.data.map(d => {
      const li = allLabels.indexOf(d.label), h = (d.value / maxVal) * pH;
      return `<rect x="${m.l + li * gW + si * (bW + 2)}" y="${m.t + pH - h}" width="${bW}" height="${h}" fill="${colors[si % colors.length]}"/>`;
    }).join('')).join('');
    const labels = allLabels.map((l, i) => `<text x="${m.l + i * gW + gW / 2}" y="${H - 12}" text-anchor="middle" font-size="12" fill="#999">${l}</text>`).join('');
    const legend = series.map((s, i) => `<rect x="${W - 110}" y="${m.t + i * 20}" width="12" height="12" fill="${colors[i % colors.length]}"/><text x="${W - 90}" y="${m.t + i * 20 + 10}" font-size="12" fill="#666">${s.name}</text>`).join('');
    return `<svg viewBox="0 0 ${W} ${H}" style="max-width:100%;height:auto">${bars}<line x1="${m.l}" y1="${m.t + pH}" x2="${m.l + pW}" y2="${m.t + pH}" stroke="#ddd" stroke-width="1"/>${labels}${legend}</svg>`;
  }

  function generateLineChart(series, colors) {
    if (!series || !series.length) return '<p>No data</p>';
    const allX = [...new Set(series.flatMap(s => s.data.map(d => d.x)))];
    const maxY = Math.max(...series.flatMap(s => s.data.map(d => d.y)));
    const W = 600, H = 300, m = { t: 20, r: 120, b: 40, l: 60 };
    const pW = W - m.l - m.r, pH = H - m.t - m.b;
    const lines = series.map((s, si) => {
      const pts = s.data.map(d => `${m.l + (allX.indexOf(d.x) / (allX.length - 1)) * pW},${m.t + pH - (d.y / maxY) * pH}`).join(' ');
      const circles = s.data.map(d => { const x = m.l + (allX.indexOf(d.x) / (allX.length - 1)) * pW, y = m.t + pH - (d.y / maxY) * pH; return `<circle cx="${x}" cy="${y}" r="4" fill="${colors[si % colors.length]}" stroke="#fff" stroke-width="2"/>`; }).join('');
      return `<polyline points="${pts}" fill="none" stroke="${colors[si % colors.length]}" stroke-width="3"/>${circles}`;
    }).join('');
    return `<svg viewBox="0 0 ${W} ${H}" style="max-width:100%;height:auto">${lines}</svg>`;
  }

  function generatePieChart(segments, colors) {
    if (!segments || !segments.length) return '<p>No data</p>';
    const total = segments.reduce((s, seg) => s + seg.value, 0);
    const size = 300, r = 100, cx = size / 2, cy = size / 2;
    let angle = -90;
    const slices = segments.map((seg, i) => {
      const a = (seg.value / total) * 360, start = angle, end = angle + a;
      const sr = (start * Math.PI) / 180, er = (end * Math.PI) / 180;
      const x1 = cx + r * Math.cos(sr), y1 = cy + r * Math.sin(sr);
      const x2 = cx + r * Math.cos(er), y2 = cy + r * Math.sin(er);
      angle = end;
      return `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${a > 180 ? 1 : 0} 1 ${x2} ${y2} Z" fill="${colors[i % colors.length]}" stroke="#fff" stroke-width="2"/>`;
    }).join('');
    const legend = segments.map((seg, i) => `<rect x="320" y="${20 + i * 25}" width="15" height="15" fill="${colors[i % colors.length]}"/><text x="345" y="${32 + i * 25}" font-size="14" fill="#666">${seg.label} (${((seg.value / total) * 100).toFixed(1)}%)</text>`).join('');
    return `<svg viewBox="0 0 500 ${size}" style="max-width:100%;height:auto">${slices}${legend}</svg>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${companyName} — Monochrome Presentation</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Archivo:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --accent: ${accentColor};
      --black: #0a0a0a;
      --white: #ffffff;
      --gray-100: #f5f5f5;
      --gray-300: #d4d4d4;
      --gray-500: #737373;
      --gray-700: #404040;
    }

    html { scroll-snap-type: y mandatory; scroll-behavior: smooth; overflow-x: hidden; }

    body {
      font-family: 'Archivo', -apple-system, sans-serif;
      background: var(--white);
      color: var(--black);
      -webkit-font-smoothing: antialiased;
    }

    .slide {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      scroll-snap-align: start; position: relative; padding: 60px 60px; z-index: 10;
      background: var(--white); color: var(--black);
    }
    .slide--dark { background: var(--black); color: var(--white); }

    .slide__content {
      max-width: 950px; width: 100%; position: relative;
      opacity: 0; transform: translateY(20px);
      transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    .slide__content.animate { opacity: 1; transform: translateY(0); }

    /* === Typography === */
    h1 { font-family: 'Bebas Neue', Impact, sans-serif; font-weight: 400; }
    h2 { font-family: 'Bebas Neue', Impact, sans-serif; font-weight: 400; }

    .slide--title { text-align: left; }
    .slide--title h1 {
      font-size: clamp(4rem, 12vw, 10rem); letter-spacing: 0.02em;
      margin-bottom: 16px; line-height: 0.85; text-transform: uppercase;
    }
    .slide--dark h1, .slide--dark h2 { color: var(--white); }
    .slide__number {
      font-family: 'Archivo', sans-serif; font-size: 0.8rem; font-weight: 700;
      letter-spacing: 0.1em; margin-bottom: 20px; color: var(--gray-500);
    }
    .slide__subtitle {
      font-size: clamp(1.1rem, 2.5vw, 1.5rem); color: var(--gray-500);
      margin-bottom: 24px; font-weight: 400; max-width: 600px;
      font-family: 'Archivo', sans-serif;
    }
    .slide__badge {
      display: inline-block; background: var(--black); color: var(--white);
      padding: 10px 24px; font-size: 0.8rem; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.1em;
    }
    .slide--dark .slide__badge { background: var(--white); color: var(--black); }
    .slide__company {
      font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.15em;
      color: var(--gray-500); margin-top: 30px; font-weight: 600;
    }

    .slide h2 {
      font-size: clamp(2.5rem, 6vw, 5rem); margin-bottom: 40px;
      text-transform: uppercase; letter-spacing: 0.02em; line-height: 0.9;
    }

    .slide__bullets {
      list-style: none; font-size: clamp(1.05rem, 2vw, 1.3rem); line-height: 1.6;
    }
    .slide__bullets li {
      padding: 16px 0; position: relative; border-bottom: 1px solid rgba(0,0,0,0.08);
      opacity: 0; transform: translateX(-10px); animation: fadeRight 0.4s ease forwards;
    }
    .slide--dark .slide__bullets li { border-color: rgba(255,255,255,0.1); }
    .bullet-num {
      font-size: 0.75rem; font-weight: 700; color: var(--gray-500);
      margin-right: 16px; letter-spacing: 0.05em;
    }
    @keyframes fadeRight { to { opacity: 1; transform: translateX(0); } }

    .slide__two-column { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; }
    .slide__two-column .slide__column { border-left: 3px solid var(--black); padding-left: 24px; }

    .slide__stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 30px; }
    .slide__stat {
      text-align: left; padding: 20px 0; border-top: 3px solid var(--white);
      opacity: 0; transform: translateY(15px); animation: fadeUp 0.5s ease forwards;
    }
    .slide__stat-number {
      font-size: clamp(3rem, 6vw, 5rem); font-weight: 400; line-height: 1;
      font-family: 'Bebas Neue', sans-serif; margin-bottom: 8px;
    }
    .slide__stat-label { font-size: 0.85rem; color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; }
    .slide--dark .slide__stat-label { color: rgba(255,255,255,0.5); }
    @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }

    .slide--quote .slide__content { max-width: 800px; }
    .slide__quote {
      font-size: clamp(2rem, 5vw, 4rem); font-family: 'Bebas Neue', sans-serif;
      font-weight: 400; line-height: 1.1; margin: 0 0 30px;
      text-transform: uppercase; letter-spacing: 0.02em;
    }
    .slide__attribution {
      font-size: 1rem; font-weight: 600; text-transform: uppercase;
      letter-spacing: 0.1em; font-style: normal;
    }
    .slide--dark .slide__attribution { color: var(--gray-500); }

    .slide__table {
      width: 100%; border-collapse: collapse; margin-top: 20px;
    }
    .slide__table th, .slide__table td { padding: 16px 20px; text-align: left; border-bottom: 1px solid var(--gray-300); }
    .slide__table th { font-weight: 700; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.08em; border-bottom: 3px solid var(--black); }
    .slide__table td { color: var(--gray-700); }

    .slide__chart { margin-top: 30px; display: flex; justify-content: center; }

    .slide__image-text { display: grid; gap: 40px; align-items: center; margin-top: 20px; }
    .slide__image-text--left { grid-template-columns: 1fr 1.5fr; }
    .slide__image-text--right { grid-template-columns: 1.5fr 1fr; }
    .slide__image-text--right .slide__image { order: 2; }
    .slide__image { overflow: hidden; }
    .slide__image img { width: 100%; height: auto; display: block; filter: grayscale(100%); }
    .slide__text p { font-size: clamp(1rem, 2vw, 1.2rem); line-height: 1.7; color: var(--gray-700); margin-bottom: 12px; }

    .progress { position: fixed; top: 0; left: 0; height: 3px; z-index: 100; transition: width 0.3s; background: var(--black); }
    .nav-dots { position: fixed; right: 30px; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; gap: 12px; z-index: 100; }
    .nav-dot {
      width: 8px; height: 8px; border-radius: 0; background: var(--gray-300);
      border: none; cursor: pointer; transition: all 0.3s; padding: 0;
    }
    .nav-dot:hover { background: var(--gray-500); }
    .nav-dot--active { background: var(--black); transform: scale(1.5); }
    .slide-counter { position: fixed; bottom: 30px; left: 30px; font-size: 0.8rem; color: var(--gray-500); z-index: 100; font-weight: 700; letter-spacing: 0.1em; }

    @media (max-width: 768px) {
      .slide { padding: 40px 24px; }
      .slide__two-column { grid-template-columns: 1fr; gap: 30px; }
      .slide__stats { grid-template-columns: 1fr 1fr; }
      .slide__image-text, .slide__image-text--left, .slide__image-text--right { grid-template-columns: 1fr; }
    }

    @media (prefers-reduced-motion: reduce) {
      .slide__content { transition: opacity 0.3s; }
      .slide__bullets li, .slide__stat { animation: none; opacity: 1; transform: none; }
    }

    @media print {
      html { scroll-snap-type: none; }
      .slide { min-height: auto; page-break-after: always; padding: 40px; }
      .progress, .nav-dots, .slide-counter { display: none; }
      .slide__content { opacity: 1; transform: none; }
      .slide--dark { background: #fff; color: #000; }
    }
  </style>
</head>
<body>
  <div class="progress" id="progress"></div>
  <div class="nav-dots" id="navDots">
    ${slides.map((_, i) => `<button class="nav-dot${i === 0 ? ' nav-dot--active' : ''}" data-index="${i}" aria-label="Slide ${i + 1}"></button>`).join('\n    ')}
  </div>
  <div class="slide-counter" id="slideCounter">01 / ${String(slideCount).padStart(2, '0')}</div>

  ${slidesHTML}

  <script>
    (function() {
      const slides = document.querySelectorAll('.slide');
      const dots = document.querySelectorAll('.nav-dot');
      const progress = document.getElementById('progress');
      const counter = document.getElementById('slideCounter');
      const total = slides.length;
      let current = 0;
      function pad(n){return String(n).padStart(2,'0');}
      function updateUI(i) { current = i; progress.style.width = ((i+1)/total*100)+'%'; counter.textContent = pad(i+1)+' / '+pad(total); dots.forEach((d,j) => d.classList.toggle('nav-dot--active', j===i));
        // Update progress bar color based on slide
        const isDark = slides[i].classList.contains('slide--dark');
        progress.style.background = isDark ? '#fff' : '#0a0a0a';
      }
      const obs = new IntersectionObserver(es => { es.forEach(e => { if(e.isIntersecting){ updateUI(parseInt(e.target.dataset.index)); e.target.querySelector('.slide__content').classList.add('animate'); } }); }, { threshold: 0.5 });
      slides.forEach(s => obs.observe(s));
      dots.forEach(d => d.addEventListener('click', () => slides[parseInt(d.dataset.index)].scrollIntoView({ behavior:'smooth' })));
      document.addEventListener('keydown', e => {
        if(['ArrowDown','ArrowRight',' '].includes(e.key)){e.preventDefault();if(current<total-1)slides[current+1].scrollIntoView({behavior:'smooth'});}
        else if(['ArrowUp','ArrowLeft'].includes(e.key)){e.preventDefault();if(current>0)slides[current-1].scrollIntoView({behavior:'smooth'});}
      });
      let ty=0;
      document.addEventListener('touchstart',e=>{ty=e.touches[0].clientY;});
      document.addEventListener('touchend',e=>{const d=ty-e.changedTouches[0].clientY;if(Math.abs(d)>50){if(d>0&&current<total-1)slides[current+1].scrollIntoView({behavior:'smooth'});else if(d<0&&current>0)slides[current-1].scrollIntoView({behavior:'smooth'});}});
    })();
  </script>
  ${watermark ? `<div style="position:fixed;bottom:16px;right:16px;z-index:9999;font-size:18px;font-weight:700;color:rgba(0,0,0,0.25);font-family:'Archivo',sans-serif;pointer-events:none;text-transform:uppercase;letter-spacing:0.1em;"><a href="https://htmldecks.com" target="_blank" style="color:inherit;text-decoration:none;pointer-events:auto;">Made with HTML Decks</a></div>` : ''}
</body>
</html>`;
}

generateMonochrome.defaults = {
  companyName: 'BOLD STUDIO',
  accentColor: '#000000',
  slides: [
    { type: 'title', title: 'Think Different', subtitle: 'A manifesto for the ones who see the world not as it is, but as it could be', badge: 'MANIFESTO' },
    { type: 'bullets', title: 'Principles', content: 'Clarity above all — strip away everything that doesn\'t serve the message\nBold choices beat safe ones — mediocrity is the real risk\nEvery pixel has purpose — if it doesn\'t earn its place, remove it' },
    { type: 'stats', title: 'By The Numbers', metrics: [
      { number: '147', label: 'Projects Delivered' },
      { number: '98%', label: 'Client Satisfaction' },
      { number: '12', label: 'Design Awards' },
      { number: '8', label: 'Years Running' }
    ]},
    { type: 'two-column', title: 'Process', leftColumn: 'Discovery\nDeep research into your audience\nCompetitive landscape analysis\nBrand positioning workshop', rightColumn: 'Execution\nRapid prototyping and iteration\nPixel-perfect implementation\nLaunch strategy and optimization' },
    { type: 'quote', quote: 'Less is more. But only when every element that remains is absolutely essential.', attribution: 'Ludwig Mies van der Rohe' },
    { type: 'title', title: 'Let\'s Build', subtitle: 'Your next big idea deserves the best execution' }
  ]
};
