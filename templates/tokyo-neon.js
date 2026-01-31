/**
 * HTML Decks — Tokyo Neon Template Generator
 *
 * Cyberpunk-inspired professional theme with hot pink/electric blue neon accents
 * on dark background. Urban energy with Japanese-inspired geometric precision.
 *
 * @param {Object} config
 * @param {string} config.companyName
 * @param {string} config.accentColor
 * @param {Array} config.slides
 * @param {boolean} config.watermark
 * @returns {string} Complete standalone HTML document
 */
function generateTokyoNeon({ companyName, accentColor, slides, watermark }) {
  const slideCount = slides.length;
  const chartColors = ['#ff2d95', '#00d4ff', '#fbbf24', '#a855f7', '#34d399'];

  const slidesHTML = slides.map((slide, i) => {
    switch (slide.type) {
      case 'title':
        return `
      <section class="slide slide--title" data-index="${i}">
        <div class="scan-line"></div>
        <div class="slide__content">
          <div class="slide__tag"><span class="tag-dot"></span>${companyName}</div>
          <h1>${slide.title}</h1>
          ${slide.subtitle ? `<p class="slide__subtitle">${slide.subtitle}</p>` : ''}
          ${slide.badge ? `<div class="slide__badge">${slide.badge}</div>` : ''}
        </div>
      </section>`;

      case 'bullets':
        const bullets = slide.content.split('\n').filter(l => l.trim())
          .map((line, idx) => `<li style="animation-delay: ${idx * 0.1}s"><span class="li-marker">◈</span>${line.replace(/^[-•]\s*/, '')}</li>`).join('\n');
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <h2>${slide.title}</h2>
          <ul class="slide__bullets">${bullets}</ul>
        </div>
      </section>`;

      case 'two-column':
        const leftB = slide.leftColumn.split('\n').filter(l => l.trim())
          .map(line => `<li><span class="li-marker">◈</span>${line.replace(/^[-•]\s*/, '')}</li>`).join('\n');
        const rightB = slide.rightColumn.split('\n').filter(l => l.trim())
          .map(line => `<li><span class="li-marker">◈</span>${line.replace(/^[-•]\s*/, '')}</li>`).join('\n');
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <h2>${slide.title}</h2>
          <div class="slide__two-column">
            <div class="slide__column neon-card neon-card--pink"><ul class="slide__bullets">${leftB}</ul></div>
            <div class="slide__column neon-card neon-card--blue"><ul class="slide__bullets">${rightB}</ul></div>
          </div>
        </div>
      </section>`;

      case 'stats':
        const statsHTML = slide.metrics.map((m, idx) => `
          <div class="slide__stat neon-card" style="animation-delay: ${idx * 0.12}s">
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
          <div class="neon-quote-mark">❝</div>
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
          .map(line => `<li><span class="li-marker">◈</span>${line.replace(/^[-•]\s*/, '')}</li>`).join('\n');
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
      return `<rect x="${m.l + li * gW + si * (bW + 2)}" y="${m.t + pH - h}" width="${bW}" height="${h}" fill="${colors[si % colors.length]}" rx="2"/>`;
    }).join('')).join('');
    const labels = allLabels.map((l, i) => `<text x="${m.l + i * gW + gW / 2}" y="${H - 12}" text-anchor="middle" font-size="12" fill="rgba(255,255,255,0.4)">${l}</text>`).join('');
    const legend = series.map((s, i) => `<rect x="${W - 110}" y="${m.t + i * 20}" width="12" height="12" rx="2" fill="${colors[i % colors.length]}"/><text x="${W - 90}" y="${m.t + i * 20 + 10}" font-size="12" fill="rgba(255,255,255,0.6)">${s.name}</text>`).join('');
    return `<svg viewBox="0 0 ${W} ${H}" style="max-width:100%;height:auto">${bars}<line x1="${m.l}" y1="${m.t + pH}" x2="${m.l + pW}" y2="${m.t + pH}" stroke="rgba(255,45,149,0.2)" stroke-width="1"/>${labels}${legend}</svg>`;
  }

  function generateLineChart(series, colors) {
    if (!series || !series.length) return '<p>No data</p>';
    const allX = [...new Set(series.flatMap(s => s.data.map(d => d.x)))];
    const maxY = Math.max(...series.flatMap(s => s.data.map(d => d.y)));
    const W = 600, H = 300, m = { t: 20, r: 120, b: 40, l: 60 };
    const pW = W - m.l - m.r, pH = H - m.t - m.b;
    const lines = series.map((s, si) => {
      const pts = s.data.map(d => `${m.l + (allX.indexOf(d.x) / (allX.length - 1)) * pW},${m.t + pH - (d.y / maxY) * pH}`).join(' ');
      const circles = s.data.map(d => { const x = m.l + (allX.indexOf(d.x) / (allX.length - 1)) * pW, y = m.t + pH - (d.y / maxY) * pH; return `<circle cx="${x}" cy="${y}" r="4" fill="${colors[si % colors.length]}"/>`; }).join('');
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
      return `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${a > 180 ? 1 : 0} 1 ${x2} ${y2} Z" fill="${colors[i % colors.length]}"/>`;
    }).join('');
    const legend = segments.map((seg, i) => `<rect x="320" y="${20 + i * 25}" width="15" height="15" rx="2" fill="${colors[i % colors.length]}"/><text x="345" y="${32 + i * 25}" font-size="14" fill="rgba(255,255,255,0.6)">${seg.label} (${((seg.value / total) * 100).toFixed(1)}%)</text>`).join('');
    return `<svg viewBox="0 0 500 ${size}" style="max-width:100%;height:auto">${slices}${legend}</svg>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${companyName} — Tokyo Neon Presentation</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --accent: ${accentColor};
      --neon-pink: #ff2d95;
      --neon-blue: #00d4ff;
      --bg: #12121e;
      --bg-card: #1a1a2e;
      --text: #e8e8f0;
      --text-muted: rgba(232,232,240,0.45);
    }

    html { scroll-snap-type: y mandatory; scroll-behavior: smooth; overflow-x: hidden; }

    body {
      font-family: 'DM Sans', -apple-system, sans-serif;
      background: var(--bg);
      color: var(--text);
      -webkit-font-smoothing: antialiased;
    }

    /* === Scan line effect === */
    .scan-line {
      position: absolute; inset: 0; z-index: 2; pointer-events: none; overflow: hidden;
    }
    .scan-line::after {
      content: ''; position: absolute; width: 100%; height: 2px;
      background: linear-gradient(90deg, transparent, var(--neon-pink), var(--neon-blue), transparent);
      opacity: 0.15; animation: scanDown 6s linear infinite;
    }
    @keyframes scanDown {
      0% { top: -2px; }
      100% { top: 100%; }
    }

    /* === Grid bg === */
    body::before {
      content: ''; position: fixed; inset: 0; z-index: 1; pointer-events: none;
      background-image:
        linear-gradient(rgba(255,45,149,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px);
      background-size: 60px 60px;
    }

    .neon-card {
      background: var(--bg-card); border-radius: 12px; padding: 24px;
      border: 1px solid rgba(255,45,149,0.12);
      position: relative;
    }
    .neon-card--pink { border-color: rgba(255,45,149,0.2); box-shadow: inset 0 0 30px rgba(255,45,149,0.03); }
    .neon-card--blue { border-color: rgba(0,212,255,0.2); box-shadow: inset 0 0 30px rgba(0,212,255,0.03); }

    .slide {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      scroll-snap-align: start; position: relative; padding: 60px 40px; z-index: 10;
    }
    .slide__content {
      max-width: 900px; width: 100%; position: relative;
      opacity: 0; transform: translateY(25px);
      transition: all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    .slide__content.animate { opacity: 1; transform: translateY(0); }

    h1, h2 { font-family: 'Syne', sans-serif; font-weight: 800; }

    .slide--title { text-align: center; }
    .slide--title h1 {
      font-size: clamp(3rem, 8vw, 6rem); letter-spacing: -0.02em;
      margin-bottom: 20px; line-height: 0.9;
      background: linear-gradient(135deg, var(--neon-pink), var(--neon-blue));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }
    .slide__tag {
      display: inline-flex; align-items: center; gap: 8px;
      font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.15em;
      color: var(--neon-pink); margin-bottom: 20px; font-weight: 600;
    }
    .tag-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--neon-pink); box-shadow: 0 0 8px var(--neon-pink); animation: pulse 2s ease infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

    .slide__subtitle {
      font-size: clamp(1.1rem, 2.5vw, 1.5rem); color: var(--text-muted);
      margin-bottom: 30px; max-width: 650px; margin-left: auto; margin-right: auto;
    }
    .slide__badge {
      display: inline-block;
      background: linear-gradient(135deg, var(--neon-pink), var(--neon-blue));
      color: var(--bg); padding: 10px 24px; border-radius: 6px;
      font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;
    }

    .slide h2 {
      font-size: clamp(2rem, 5vw, 3.2rem); margin-bottom: 36px;
    }
    .slide h2::after {
      content: ''; display: block; width: 60px; height: 3px; margin-top: 14px;
      background: linear-gradient(90deg, var(--neon-pink), var(--neon-blue));
      border-radius: 2px;
    }

    .slide__bullets {
      list-style: none; font-size: clamp(1.05rem, 2vw, 1.3rem); line-height: 1.7;
    }
    .slide__bullets li {
      padding: 10px 0 10px 8px; position: relative; color: rgba(232,232,240,0.8);
      opacity: 0; transform: translateX(-10px); animation: slideIn 0.4s ease forwards;
    }
    .li-marker { color: var(--neon-pink); margin-right: 12px; font-size: 0.7em; }
    @keyframes slideIn { to { opacity: 1; transform: translateX(0); } }

    .slide__two-column { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

    .slide__stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
    .slide__stat {
      text-align: center;
      opacity: 0; transform: translateY(15px); animation: fadeUp 0.5s ease forwards;
    }
    .slide__stat-number {
      font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: 800; line-height: 1;
      font-family: 'Syne', sans-serif; margin-bottom: 8px;
      background: linear-gradient(135deg, var(--neon-pink), var(--neon-blue));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }
    .slide__stat-label { font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; }
    @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }

    .slide--quote { text-align: center; }
    .neon-quote-mark {
      font-size: 5rem; line-height: 1;
      background: linear-gradient(135deg, var(--neon-pink), var(--neon-blue));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
      margin-bottom: 10px;
    }
    .slide__quote {
      font-size: clamp(1.4rem, 3vw, 2rem); font-style: italic; font-weight: 400;
      line-height: 1.7; margin: 0 0 30px;
    }
    .slide__attribution { font-size: 1rem; color: var(--neon-pink); font-style: normal; font-weight: 600; }

    .slide__table {
      width: 100%; border-collapse: collapse; margin-top: 20px;
      background: var(--bg-card); border-radius: 12px; overflow: hidden;
      border: 1px solid rgba(255,45,149,0.12);
    }
    .slide__table th, .slide__table td { padding: 14px 18px; text-align: left; border-bottom: 1px solid rgba(255,45,149,0.08); }
    .slide__table th { background: rgba(255,45,149,0.08); color: var(--neon-pink); font-weight: 700; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; }
    .slide__table td { color: rgba(232,232,240,0.75); }

    .slide__chart { margin-top: 30px; display: flex; justify-content: center; }

    .slide__image-text { display: grid; gap: 30px; align-items: center; margin-top: 20px; }
    .slide__image-text--left { grid-template-columns: 1fr 1.5fr; }
    .slide__image-text--right { grid-template-columns: 1.5fr 1fr; }
    .slide__image-text--right .slide__image { order: 2; }
    .slide__image { border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,45,149,0.15); }
    .slide__image img { width: 100%; height: auto; display: block; }
    .slide__text p { font-size: clamp(1rem, 2vw, 1.2rem); line-height: 1.7; color: rgba(232,232,240,0.8); margin-bottom: 12px; }

    .progress { position: fixed; top: 0; left: 0; height: 3px; z-index: 100; transition: width 0.3s;
      background: linear-gradient(90deg, var(--neon-pink), var(--neon-blue)); }
    .nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; gap: 12px; z-index: 100; }
    .nav-dot {
      width: 10px; height: 10px; border-radius: 3px; background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,45,149,0.3); cursor: pointer; transition: all 0.3s; padding: 0;
    }
    .nav-dot:hover { background: rgba(255,45,149,0.2); }
    .nav-dot--active { background: var(--neon-pink); box-shadow: 0 0 10px var(--neon-pink); transform: scale(1.3); }
    .slide-counter { position: fixed; bottom: 24px; left: 24px; font-size: 0.8rem; color: var(--text-muted); z-index: 100; font-weight: 600; font-family: 'Syne', sans-serif; }

    @media (max-width: 768px) {
      .slide { padding: 40px 20px; }
      .slide__two-column { grid-template-columns: 1fr; }
      .slide__stats { grid-template-columns: 1fr 1fr; }
      .slide__image-text, .slide__image-text--left, .slide__image-text--right { grid-template-columns: 1fr; }
    }

    @media (prefers-reduced-motion: reduce) {
      .scan-line::after { animation: none; }
      .tag-dot { animation: none; }
      .slide__content { transition: opacity 0.3s; }
      .slide__bullets li, .slide__stat { animation: none; opacity: 1; transform: none; }
    }

    @media print {
      html { scroll-snap-type: none; }
      .slide { min-height: auto; page-break-after: always; padding: 40px; }
      .progress, .nav-dots, .slide-counter, .scan-line { display: none; }
      .slide__content { opacity: 1; transform: none; }
      body { background: #fff; color: #111; }
      body::before { display: none; }
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
  ${watermark ? `<div style="position:fixed;bottom:16px;right:16px;z-index:9999;font-size:18px;font-weight:600;color:rgba(255,45,149,0.4);font-family:'DM Sans',sans-serif;pointer-events:none;"><a href="https://htmldecks.com" target="_blank" style="color:inherit;text-decoration:none;pointer-events:auto;">Made with HTML Decks</a></div>` : ''}
</body>
</html>`;
}

generateTokyoNeon.defaults = {
  companyName: 'NexGen AI',
  accentColor: '#ff2d95',
  slides: [
    { type: 'title', title: 'Intelligence Amplified', subtitle: 'Next-generation AI infrastructure for enterprises that move fast', badge: 'EARLY ACCESS' },
    { type: 'bullets', title: 'The Platform', content: 'Deploy custom AI models in minutes, not months\nAuto-scaling infrastructure that handles 10 to 10M requests seamlessly\nEnterprise-grade security with SOC2 and HIPAA compliance built in' },
    { type: 'stats', title: 'Platform Metrics', metrics: [
      { number: '400M', label: 'Daily Inferences' },
      { number: '12ms', label: 'Avg Latency' },
      { number: '99.99%', label: 'Uptime SLA' },
      { number: '3.7x', label: 'Cost Savings vs AWS' }
    ]},
    { type: 'two-column', title: 'Before & After', leftColumn: 'Traditional ML Ops\n6-month deployment cycles\n$500K+ infrastructure setup\nTeam of 5 ML engineers required\nBrittle pipelines that break weekly', rightColumn: 'With NexGen\nSame-day deployment\n$0 upfront — pay per inference\n1 engineer can manage it all\nSelf-healing infrastructure' },
    { type: 'quote', quote: 'We went from idea to production AI in 48 hours. That used to take us two quarters.', attribution: 'CTO, Series C Fintech' },
    { type: 'title', title: 'Get Access', subtitle: 'Limited spots in our enterprise beta program', badge: 'APPLY NOW' }
  ]
};
