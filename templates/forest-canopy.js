/**
 * HTML Decks — Forest Canopy Template Generator
 *
 * Deep greens and earthy tones with nature-inspired organic design.
 * Calming, grounded aesthetic with botanical elegance and warm accents.
 *
 * @param {Object} config
 * @param {string} config.companyName
 * @param {string} config.accentColor
 * @param {Array} config.slides
 * @param {boolean} config.watermark
 * @returns {string} Complete standalone HTML document
 */
function generateForestCanopy({ companyName, accentColor, slides, watermark }) {
  const slideCount = slides.length;
  const chartColors = ['#2d5a3d', '#8b6914', '#4a7c59', '#c9a227', '#1e3d2f'];

  const slidesHTML = slides.map((slide, i) => {
    switch (slide.type) {
      case 'title':
        return `
      <section class="slide slide--title" data-index="${i}">
        <div class="leaf leaf--1"></div>
        <div class="leaf leaf--2"></div>
        <div class="slide__content">
          <div class="slide__eyebrow">${companyName}</div>
          <h1>${slide.title}</h1>
          ${slide.subtitle ? `<p class="slide__subtitle">${slide.subtitle}</p>` : ''}
          ${slide.badge ? `<div class="slide__badge">${slide.badge}</div>` : ''}
          <div class="botanical-divider">✦</div>
        </div>
      </section>`;

      case 'bullets':
        const bullets = slide.content.split('\n').filter(l => l.trim())
          .map((line, idx) => `<li style="animation-delay: ${idx * 0.12}s">${line.replace(/^[-•]\s*/, '')}</li>`).join('\n');
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
            <div class="slide__column nature-card"><ul class="slide__bullets">${leftB}</ul></div>
            <div class="slide__column nature-card"><ul class="slide__bullets">${rightB}</ul></div>
          </div>
        </div>
      </section>`;

      case 'stats':
        const statsHTML = slide.metrics.map((m, idx) => `
          <div class="slide__stat nature-card" style="animation-delay: ${idx * 0.12}s">
            <div class="slide__stat-number">${m.number}</div>
            <div class="slide__stat-label">${m.label}</div>
          </div>`).join('');
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <h2>${slide.title}</h2>
          <div class="slide__stats">${statsHTML}</div>
        </div>
      </section>`;

      case 'quote':
        return `
      <section class="slide slide--quote" data-index="${i}">
        <div class="slide__content">
          <div class="quote-leaf">❧</div>
          <blockquote class="slide__quote">"${slide.quote}"</blockquote>
          <cite class="slide__attribution">— ${slide.attribution}</cite>
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
          <div class="slide__chart nature-card">${generateBarChart(slide.series, chartColors)}</div>
        </div>
      </section>`;

      case 'line-chart':
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <h2>${slide.title}</h2>
          <div class="slide__chart nature-card">${generateLineChart(slide.series, chartColors)}</div>
        </div>
      </section>`;

      case 'pie-chart':
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <h2>${slide.title}</h2>
          <div class="slide__chart nature-card">${generatePieChart(slide.segments, chartColors)}</div>
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
      return `<rect x="${m.l + li * gW + si * (bW + 2)}" y="${m.t + pH - h}" width="${bW}" height="${h}" fill="${colors[si % colors.length]}" rx="4"/>`;
    }).join('')).join('');
    const labels = allLabels.map((l, i) => `<text x="${m.l + i * gW + gW / 2}" y="${H - 12}" text-anchor="middle" font-size="12" fill="#5a6b5a">${l}</text>`).join('');
    const legend = series.map((s, i) => `<rect x="${W - 110}" y="${m.t + i * 20}" width="12" height="12" rx="3" fill="${colors[i % colors.length]}"/><text x="${W - 90}" y="${m.t + i * 20 + 10}" font-size="12" fill="#3a4a3a">${s.name}</text>`).join('');
    return `<svg viewBox="0 0 ${W} ${H}" style="max-width:100%;height:auto">${bars}<line x1="${m.l}" y1="${m.t + pH}" x2="${m.l + pW}" y2="${m.t + pH}" stroke="rgba(45,90,61,0.15)" stroke-width="1"/>${labels}${legend}</svg>`;
  }

  function generateLineChart(series, colors) {
    if (!series || !series.length) return '<p>No data</p>';
    const allX = [...new Set(series.flatMap(s => s.data.map(d => d.x)))];
    const maxY = Math.max(...series.flatMap(s => s.data.map(d => d.y)));
    const W = 600, H = 300, m = { t: 20, r: 120, b: 40, l: 60 };
    const pW = W - m.l - m.r, pH = H - m.t - m.b;
    const lines = series.map((s, si) => {
      const pts = s.data.map(d => `${m.l + (allX.indexOf(d.x) / (allX.length - 1)) * pW},${m.t + pH - (d.y / maxY) * pH}`).join(' ');
      const circles = s.data.map(d => { const x = m.l + (allX.indexOf(d.x) / (allX.length - 1)) * pW, y = m.t + pH - (d.y / maxY) * pH; return `<circle cx="${x}" cy="${y}" r="5" fill="${colors[si % colors.length]}" stroke="#f5f0e8" stroke-width="2"/>`; }).join('');
      return `<polyline points="${pts}" fill="none" stroke="${colors[si % colors.length]}" stroke-width="3" stroke-linecap="round"/>${circles}`;
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
      return `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${a > 180 ? 1 : 0} 1 ${x2} ${y2} Z" fill="${colors[i % colors.length]}"/>`;
    }).join('');
    const legend = segments.map((seg, i) => `<rect x="320" y="${20 + i * 25}" width="15" height="15" rx="4" fill="${colors[i % colors.length]}"/><text x="345" y="${32 + i * 25}" font-size="14" fill="#3a4a3a">${seg.label} (${((seg.value / total) * 100).toFixed(1)}%)</text>`).join('');
    return `<svg viewBox="0 0 500 ${size}" style="max-width:100%;height:auto">${slices}${legend}</svg>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${companyName} — Forest Canopy Presentation</title>
  <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=zodiak@400;500;600;700&display=swap">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --accent: ${accentColor};
      --forest: #2d5a3d;
      --forest-dark: #1e3d2f;
      --moss: #4a7c59;
      --gold: #c9a227;
      --cream: #f5f0e8;
      --bark: #8b6914;
      --bg: #f9f6f1;
      --text: #2a3a2a;
      --text-muted: rgba(42,58,42,0.55);
    }

    html { scroll-snap-type: y mandatory; scroll-behavior: smooth; overflow-x: hidden; }

    body {
      font-family: 'Nunito', -apple-system, sans-serif;
      background: var(--bg);
      color: var(--text);
      -webkit-font-smoothing: antialiased;
    }

    /* === Decorative leaves === */
    .leaf {
      position: absolute; width: 150px; height: 150px; opacity: 0.06; z-index: 1;
      background: var(--forest);
      border-radius: 0 100% 0 100%;
    }
    .leaf--1 { top: 10%; right: 5%; transform: rotate(25deg); animation: sway 8s ease-in-out infinite; }
    .leaf--2 { bottom: 15%; left: 3%; transform: rotate(-15deg); animation: sway 10s ease-in-out infinite reverse; width: 100px; height: 100px; }

    @keyframes sway {
      0%, 100% { transform: rotate(25deg) translateY(0); }
      50% { transform: rotate(28deg) translateY(-10px); }
    }

    .nature-card {
      background: var(--cream); border-radius: 16px; padding: 24px;
      border: 1px solid rgba(45,90,61,0.1);
    }

    .slide {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      scroll-snap-align: start; position: relative; padding: 60px 40px; z-index: 10;
      overflow: hidden;
    }
    .slide__content {
      max-width: 880px; width: 100%; position: relative; z-index: 5;
      opacity: 0; transform: translateY(25px);
      transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    .slide__content.animate { opacity: 1; transform: translateY(0); }

    h1, h2 { font-family: 'Zodiak', Georgia, serif; font-weight: 600; }

    .slide--title { text-align: center; }
    .slide--title h1 {
      font-size: clamp(3rem, 8vw, 5.5rem); letter-spacing: -0.02em;
      margin-bottom: 20px; line-height: 0.95; color: var(--forest-dark);
    }
    .slide__eyebrow {
      font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.2em;
      color: var(--moss); margin-bottom: 16px; font-weight: 700;
    }
    .slide__subtitle {
      font-size: clamp(1.1rem, 2.5vw, 1.45rem); color: var(--text-muted);
      margin-bottom: 28px; max-width: 620px; margin-left: auto; margin-right: auto;
      font-style: italic;
    }
    .slide__badge {
      display: inline-block; background: var(--forest); color: var(--cream);
      padding: 10px 26px; border-radius: 30px;
      font-size: 0.85rem; font-weight: 700; letter-spacing: 0.08em;
    }
    .botanical-divider {
      color: var(--gold); font-size: 1.5rem; margin-top: 30px;
    }

    .slide h2 {
      font-size: clamp(2rem, 5vw, 3rem); margin-bottom: 36px; color: var(--forest-dark);
    }
    .slide h2::after {
      content: ''; display: block; width: 40px; height: 3px; margin-top: 14px;
      background: linear-gradient(90deg, var(--forest), var(--moss));
      border-radius: 2px;
    }

    .slide__bullets {
      list-style: none; font-size: clamp(1.05rem, 2vw, 1.25rem); line-height: 1.75;
    }
    .slide__bullets li {
      padding: 10px 0 10px 32px; position: relative; color: rgba(42,58,42,0.8);
      opacity: 0; transform: translateX(-10px); animation: fadeRight 0.5s ease forwards;
    }
    .slide__bullets li::before {
      content: '●'; position: absolute; left: 0; top: 10px;
      color: var(--moss); font-size: 0.6rem;
    }
    @keyframes fadeRight { to { opacity: 1; transform: translateX(0); } }

    .slide__two-column { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

    .slide__stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
    .slide__stat {
      text-align: center;
      opacity: 0; transform: translateY(15px); animation: fadeUp 0.5s ease forwards;
    }
    .slide__stat-number {
      font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: 600; line-height: 1;
      font-family: 'Zodiak', serif; color: var(--forest); margin-bottom: 8px;
    }
    .slide__stat-label { font-size: 0.88rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600; }
    @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }

    .slide--quote { text-align: center; }
    .quote-leaf { font-size: 3.5rem; color: var(--moss); line-height: 1; margin-bottom: 16px; }
    .slide__quote {
      font-size: clamp(1.4rem, 3vw, 2rem); font-style: italic; font-weight: 400;
      line-height: 1.7; margin: 0 0 30px; font-family: 'Zodiak', serif; color: var(--forest-dark);
    }
    .slide__attribution { font-size: 1rem; color: var(--moss); font-style: normal; font-weight: 700; }

    .slide__table {
      width: 100%; border-collapse: collapse; margin-top: 20px;
      background: var(--cream); border-radius: 12px; overflow: hidden;
    }
    .slide__table th, .slide__table td { padding: 14px 18px; text-align: left; border-bottom: 1px solid rgba(45,90,61,0.08); }
    .slide__table th { background: var(--forest); color: var(--cream); font-weight: 700; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; }
    .slide__table td { color: rgba(42,58,42,0.75); }
    .slide__table tr:last-child td { border-bottom: none; }

    .slide__chart { margin-top: 20px; display: flex; justify-content: center; padding: 24px; }

    .slide__image-text { display: grid; gap: 30px; align-items: center; margin-top: 20px; }
    .slide__image-text--left { grid-template-columns: 1fr 1.5fr; }
    .slide__image-text--right { grid-template-columns: 1.5fr 1fr; }
    .slide__image-text--right .slide__image { order: 2; }
    .slide__image { border-radius: 16px; overflow: hidden; border: 3px solid var(--cream); box-shadow: 0 4px 20px rgba(45,90,61,0.1); }
    .slide__image img { width: 100%; height: auto; display: block; }
    .slide__text p { font-size: clamp(1rem, 2vw, 1.2rem); line-height: 1.75; color: rgba(42,58,42,0.75); margin-bottom: 12px; }

    .progress { position: fixed; top: 0; left: 0; height: 4px; z-index: 100; transition: width 0.3s;
      background: linear-gradient(90deg, var(--forest), var(--moss)); border-radius: 0 2px 2px 0; }
    .nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; gap: 12px; z-index: 100; }
    .nav-dot {
      width: 10px; height: 10px; border-radius: 50%; background: rgba(45,90,61,0.15);
      border: none; cursor: pointer; transition: all 0.3s; padding: 0;
    }
    .nav-dot:hover { background: rgba(45,90,61,0.3); }
    .nav-dot--active { background: var(--forest); transform: scale(1.4); }
    .slide-counter { position: fixed; bottom: 24px; left: 24px; font-size: 0.8rem; color: var(--text-muted); z-index: 100; font-weight: 600; }

    @media (max-width: 768px) {
      .slide { padding: 40px 20px; }
      .slide__two-column { grid-template-columns: 1fr; }
      .slide__stats { grid-template-columns: 1fr 1fr; }
      .slide__image-text, .slide__image-text--left, .slide__image-text--right { grid-template-columns: 1fr; }
      .leaf { display: none; }
    }

    @media (prefers-reduced-motion: reduce) {
      .leaf { animation: none; }
      .slide__content { transition: opacity 0.3s; }
      .slide__bullets li, .slide__stat { animation: none; opacity: 1; transform: none; }
    }

    @media print {
      html { scroll-snap-type: none; }
      .slide { min-height: auto; page-break-after: always; padding: 40px; }
      .progress, .nav-dots, .slide-counter, .leaf { display: none; }
      .slide__content { opacity: 1; transform: none; }
    }
  </style>
</head>
<body>
  <div class="progress" id="progress"></div>
  <div class="nav-dots" id="navDots">
    ${slides.map((_, i) => `<button class="nav-dot${i === 0 ? ' nav-dot--active' : ''}" data-index="${i}" aria-label="Slide ${i + 1}"></button>`).join('\n    ')}
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
      function updateUI(i) { current = i; progress.style.width = ((i+1)/total*100)+'%'; counter.textContent = (i+1)+' / '+total; dots.forEach((d,j) => d.classList.toggle('nav-dot--active', j===i)); }
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
  ${watermark ? `<div style="position:fixed;bottom:16px;right:16px;z-index:9999;font-size:18px;font-weight:600;color:rgba(45,90,61,0.35);font-family:'Nunito',sans-serif;pointer-events:none;"><a href="https://htmldecks.com" target="_blank" style="color:inherit;text-decoration:none;pointer-events:auto;">Made with HTML Decks</a></div>` : ''}
</body>
</html>`;
}

generateForestCanopy.defaults = {
  companyName: 'Terra Collective',
  accentColor: '#2d5a3d',
  slides: [
    { type: 'title', title: 'Rooted in Purpose', subtitle: 'Building sustainable solutions that honor the earth while driving growth', badge: 'Sustainability Report' },
    { type: 'bullets', title: 'Our Commitments', content: 'Carbon neutral operations by 2025 — we\'re already 78% there\nRegenerative supply chains that restore rather than deplete\nTransparent impact reporting with third-party verification' },
    { type: 'stats', title: 'Impact Metrics', metrics: [
      { number: '2.4M', label: 'Trees Planted' },
      { number: '89%', label: 'Waste Diverted' },
      { number: '156K', label: 'Tons CO₂ Offset' },
      { number: 'B Corp', label: 'Certified' }
    ]},
    { type: 'two-column', title: 'The Path Forward', leftColumn: 'Short Term (2024)\nComplete renewable energy transition\nLaunch supplier sustainability program\nExpand reforestation partnerships', rightColumn: 'Long Term (2030)\nNet positive carbon impact\n100% circular product lifecycle\nIndustry-wide coalition for change' },
    { type: 'quote', quote: 'The earth does not belong to us. We belong to the earth. Business must operate with this truth at its core.', attribution: 'Chief Sustainability Officer' },
    { type: 'title', title: 'Join the Movement', subtitle: 'Together we can build a regenerative future' }
  ]
};
