/**
 * HTML Decks — Aurora Borealis Template Generator
 *
 * Dark ethereal theme with animated northern lights gradient effects.
 * Dreamy, cosmic aesthetic with flowing color shifts and soft glow.
 *
 * @param {Object} config
 * @param {string} config.companyName
 * @param {string} config.accentColor
 * @param {Array} config.slides
 * @param {boolean} config.watermark
 * @returns {string} Complete standalone HTML document
 */
function generateAuroraBorealis({ companyName, accentColor, slides, watermark }) {
  const slideCount = slides.length;
  const chartColors = ['#00ff88', '#00aaff', '#aa44ff', '#ff44aa', '#ffcc00'];

  const slidesHTML = slides.map((slide, i) => {
    switch (slide.type) {
      case 'title':
        return `
      <section class="slide slide--title" data-index="${i}">
        <div class="slide__content">
          <div class="slide__eyebrow">${companyName}</div>
          <h1>${slide.title}</h1>
          ${slide.subtitle ? `<p class="slide__subtitle">${slide.subtitle}</p>` : ''}
          ${slide.badge ? `<div class="slide__badge">${slide.badge}</div>` : ''}
          <div class="aurora-line"></div>
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
            <div class="slide__column"><ul class="slide__bullets">${leftB}</ul></div>
            <div class="slide__column"><ul class="slide__bullets">${rightB}</ul></div>
          </div>
        </div>
      </section>`;

      case 'stats':
        const statsHTML = slide.metrics.map((m, idx) => `
          <div class="slide__stat" style="animation-delay: ${idx * 0.15}s">
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
      return `<rect x="${m.l + li * gW + si * (bW + 2)}" y="${m.t + pH - h}" width="${bW}" height="${h}" fill="${colors[si % colors.length]}" rx="3"/>`;
    }).join('')).join('');
    const labels = allLabels.map((l, i) => `<text x="${m.l + i * gW + gW / 2}" y="${H - 12}" text-anchor="middle" font-size="12" fill="rgba(255,255,255,0.5)">${l}</text>`).join('');
    const legend = series.map((s, i) => `<rect x="${W - 110}" y="${m.t + i * 20}" width="12" height="12" rx="2" fill="${colors[i % colors.length]}"/><text x="${W - 90}" y="${m.t + i * 20 + 10}" font-size="12" fill="rgba(255,255,255,0.7)">${s.name}</text>`).join('');
    return `<svg viewBox="0 0 ${W} ${H}" style="max-width:100%;height:auto">${bars}<line x1="${m.l}" y1="${m.t + pH}" x2="${m.l + pW}" y2="${m.t + pH}" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>${labels}${legend}</svg>`;
  }

  function generateLineChart(series, colors) {
    if (!series || !series.length) return '<p>No data</p>';
    const allX = [...new Set(series.flatMap(s => s.data.map(d => d.x)))];
    const maxY = Math.max(...series.flatMap(s => s.data.map(d => d.y)));
    const W = 600, H = 300, m = { t: 20, r: 120, b: 40, l: 60 };
    const pW = W - m.l - m.r, pH = H - m.t - m.b;
    const lines = series.map((s, si) => {
      const pts = s.data.map(d => { const xi = allX.indexOf(d.x); return `${m.l + (xi / (allX.length - 1)) * pW},${m.t + pH - (d.y / maxY) * pH}`; }).join(' ');
      const circles = s.data.map(d => { const xi = allX.indexOf(d.x); const x = m.l + (xi / (allX.length - 1)) * pW, y = m.t + pH - (d.y / maxY) * pH; return `<circle cx="${x}" cy="${y}" r="4" fill="${colors[si % colors.length]}"/>`; }).join('');
      return `<polyline points="${pts}" fill="none" stroke="${colors[si % colors.length]}" stroke-width="3"/>${circles}`;
    }).join('');
    const labels = allX.map((l, i) => `<text x="${m.l + (i / (allX.length - 1)) * pW}" y="${H - 12}" text-anchor="middle" font-size="12" fill="rgba(255,255,255,0.5)">${l}</text>`).join('');
    return `<svg viewBox="0 0 ${W} ${H}" style="max-width:100%;height:auto">${lines}${labels}</svg>`;
  }

  function generatePieChart(segments, colors) {
    if (!segments || !segments.length) return '<p>No data</p>';
    const total = segments.reduce((s, seg) => s + seg.value, 0);
    const size = 300, r = 100, cx = size / 2, cy = size / 2;
    let angle = -90;
    const slices = segments.map((seg, i) => {
      const pct = seg.value / total, a = pct * 360, start = angle, end = angle + a;
      const sr = (start * Math.PI) / 180, er = (end * Math.PI) / 180;
      const x1 = cx + r * Math.cos(sr), y1 = cy + r * Math.sin(sr);
      const x2 = cx + r * Math.cos(er), y2 = cy + r * Math.sin(er);
      const large = a > 180 ? 1 : 0;
      angle = end;
      return `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z" fill="${colors[i % colors.length]}"/>`;
    }).join('');
    const legend = segments.map((seg, i) => `<rect x="320" y="${20 + i * 25}" width="15" height="15" rx="3" fill="${colors[i % colors.length]}"/><text x="345" y="${32 + i * 25}" font-size="14" fill="rgba(255,255,255,0.7)">${seg.label} (${((seg.value / total) * 100).toFixed(1)}%)</text>`).join('');
    return `<svg viewBox="0 0 500 ${size}" style="max-width:100%;height:auto">${slices}${legend}</svg>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${companyName} — Aurora Borealis Presentation</title>
  <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=general-sans@400;500;600;700&display=swap">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --accent: ${accentColor};
      --aurora-green: #00ff88;
      --aurora-blue: #00aaff;
      --aurora-purple: #aa44ff;
      --bg: #0a0e1a;
      --text: #e8eaf0;
      --text-muted: rgba(232,234,240,0.5);
    }

    html { scroll-snap-type: y mandatory; scroll-behavior: smooth; overflow-x: hidden; }

    body {
      font-family: 'DM Sans', -apple-system, sans-serif;
      background: var(--bg);
      color: var(--text);
      -webkit-font-smoothing: antialiased;
      position: relative;
      overflow-x: hidden;
    }

    /* === Aurora Background === */
    .aurora-bg {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      z-index: 1; pointer-events: none; overflow: hidden;
    }
    .aurora-bg::before, .aurora-bg::after {
      content: '';
      position: absolute;
      width: 200%; height: 200%;
      top: -50%; left: -50%;
      border-radius: 40%;
      opacity: 0.15;
    }
    .aurora-bg::before {
      background: radial-gradient(ellipse at 30% 40%, var(--aurora-green) 0%, transparent 50%),
                  radial-gradient(ellipse at 70% 60%, var(--aurora-blue) 0%, transparent 50%);
      animation: auroraShift1 12s ease-in-out infinite alternate;
    }
    .aurora-bg::after {
      background: radial-gradient(ellipse at 60% 30%, var(--aurora-purple) 0%, transparent 50%),
                  radial-gradient(ellipse at 20% 70%, var(--aurora-blue) 0%, transparent 40%);
      animation: auroraShift2 15s ease-in-out infinite alternate;
    }

    @keyframes auroraShift1 {
      0% { transform: translate(0, 0) rotate(0deg); }
      100% { transform: translate(5%, -3%) rotate(8deg); }
    }
    @keyframes auroraShift2 {
      0% { transform: translate(0, 0) rotate(0deg); }
      100% { transform: translate(-4%, 5%) rotate(-6deg); }
    }

    /* === Starfield === */
    .stars {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      z-index: 2; pointer-events: none;
      background-image:
        radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.6), transparent),
        radial-gradient(1px 1px at 30% 60%, rgba(255,255,255,0.4), transparent),
        radial-gradient(1.5px 1.5px at 50% 10%, rgba(255,255,255,0.7), transparent),
        radial-gradient(1px 1px at 70% 40%, rgba(255,255,255,0.3), transparent),
        radial-gradient(1px 1px at 90% 80%, rgba(255,255,255,0.5), transparent),
        radial-gradient(1px 1px at 15% 85%, rgba(255,255,255,0.4), transparent),
        radial-gradient(1.5px 1.5px at 45% 50%, rgba(255,255,255,0.6), transparent),
        radial-gradient(1px 1px at 80% 15%, rgba(255,255,255,0.3), transparent),
        radial-gradient(1px 1px at 60% 90%, rgba(255,255,255,0.5), transparent),
        radial-gradient(1px 1px at 25% 35%, rgba(255,255,255,0.4), transparent);
    }

    /* === Slides === */
    .slide {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      scroll-snap-align: start; position: relative; padding: 60px 40px; z-index: 10;
    }
    .slide__content {
      max-width: 900px; width: 100%; position: relative;
      opacity: 0; transform: translateY(30px);
      transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    .slide__content.animate { opacity: 1; transform: translateY(0); }

    /* === Typography === */
    h1, h2 { font-family: 'General Sans', sans-serif; font-weight: 700; }
    .slide--title { text-align: center; }
    .slide--title h1 {
      font-size: clamp(3rem, 8vw, 5.5rem); letter-spacing: -0.03em;
      margin-bottom: 20px; line-height: 0.95;
      background: linear-gradient(135deg, var(--aurora-green), var(--aurora-blue), var(--aurora-purple));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .slide__eyebrow {
      font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.2em;
      color: var(--aurora-green); margin-bottom: 20px; font-weight: 600;
    }
    .slide__subtitle {
      font-size: clamp(1.1rem, 2.5vw, 1.5rem); color: var(--text-muted);
      margin-bottom: 30px; font-weight: 400; max-width: 700px; margin-left: auto; margin-right: auto;
    }
    .slide__badge {
      display: inline-block;
      background: linear-gradient(135deg, rgba(0,255,136,0.15), rgba(0,170,255,0.15));
      border: 1px solid rgba(0,255,136,0.3);
      color: var(--aurora-green); padding: 8px 24px; border-radius: 30px;
      font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em;
    }
    .aurora-line {
      width: 120px; height: 2px; margin: 30px auto 0;
      background: linear-gradient(90deg, var(--aurora-green), var(--aurora-blue), var(--aurora-purple));
      border-radius: 1px;
    }

    /* === Content === */
    .slide h2 {
      font-size: clamp(2rem, 5vw, 3.2rem); margin-bottom: 40px;
      color: var(--text); position: relative;
    }
    .slide h2::after {
      content: ''; position: absolute; bottom: -12px; left: 0;
      width: 50px; height: 3px; border-radius: 2px;
      background: linear-gradient(90deg, var(--aurora-green), var(--aurora-blue));
    }
    .slide__bullets {
      list-style: none; font-size: clamp(1.05rem, 2vw, 1.35rem); line-height: 1.7;
    }
    .slide__bullets li {
      padding: 12px 0 12px 36px; position: relative;
      color: rgba(232,234,240,0.85);
      opacity: 0; transform: translateX(-15px);
      animation: fadeSlideIn 0.5s ease forwards;
    }
    .slide__bullets li::before {
      content: ''; position: absolute; left: 0; top: 20px;
      width: 8px; height: 8px; border-radius: 50%;
      background: var(--aurora-green);
      box-shadow: 0 0 8px var(--aurora-green);
    }
    @keyframes fadeSlideIn { to { opacity: 1; transform: translateX(0); } }

    /* === Two Column === */
    .slide__two-column { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; }

    /* === Stats === */
    .slide__stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px; }
    .slide__stat {
      text-align: center; padding: 32px 20px;
      background: rgba(0,255,136,0.04); border: 1px solid rgba(0,255,136,0.12);
      border-radius: 16px;
      opacity: 0; transform: translateY(20px); animation: fadeUp 0.6s ease forwards;
    }
    .slide__stat-number {
      font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: 700; line-height: 1;
      font-family: 'General Sans', sans-serif; margin-bottom: 8px;
      background: linear-gradient(135deg, var(--aurora-green), var(--aurora-blue));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }
    .slide__stat-label { font-size: 0.9rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; }
    @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }

    /* === Quote === */
    .slide--quote { text-align: center; }
    .slide__quote {
      font-size: clamp(1.4rem, 3.5vw, 2.2rem); font-style: italic; font-weight: 400;
      line-height: 1.6; margin: 0 0 30px; position: relative; padding: 30px 0;
    }
    .slide__quote::before {
      content: '"'; font-size: 6rem; position: absolute; top: -20px; left: 50%;
      transform: translateX(-50%); font-weight: 700; line-height: 1; font-style: normal;
      background: linear-gradient(135deg, var(--aurora-green), var(--aurora-purple));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }
    .slide__attribution { font-size: 1.1rem; color: var(--text-muted); font-style: normal; }

    /* === Table === */
    .slide__table {
      width: 100%; border-collapse: collapse; margin-top: 20px;
      background: rgba(0,255,136,0.03); border-radius: 12px; overflow: hidden;
      border: 1px solid rgba(0,255,136,0.1);
    }
    .slide__table th, .slide__table td { padding: 14px 16px; text-align: left; border-bottom: 1px solid rgba(0,255,136,0.08); }
    .slide__table th { background: rgba(0,255,136,0.08); color: var(--aurora-green); font-weight: 600; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; }
    .slide__table td { color: rgba(232,234,240,0.85); }

    /* === Charts === */
    .slide__chart { margin-top: 30px; display: flex; justify-content: center; }

    /* === Image Text === */
    .slide__image-text { display: grid; gap: 40px; align-items: center; margin-top: 20px; }
    .slide__image-text--left { grid-template-columns: 1fr 1.5fr; }
    .slide__image-text--right { grid-template-columns: 1.5fr 1fr; }
    .slide__image-text--right .slide__image { order: 2; }
    .slide__image { border-radius: 12px; overflow: hidden; border: 1px solid rgba(0,255,136,0.15); }
    .slide__image img { width: 100%; height: auto; display: block; }
    .slide__text p { font-size: clamp(1rem, 2vw, 1.25rem); line-height: 1.7; color: rgba(232,234,240,0.85); margin-bottom: 12px; }

    /* === Navigation === */
    .progress { position: fixed; top: 0; left: 0; height: 3px; z-index: 100; transition: width 0.3s;
      background: linear-gradient(90deg, var(--aurora-green), var(--aurora-blue), var(--aurora-purple));
    }
    .nav-dots { position: fixed; right: 30px; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; gap: 14px; z-index: 100; }
    .nav-dot {
      width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,0.15);
      border: 1.5px solid rgba(0,255,136,0.3); cursor: pointer; transition: all 0.3s; padding: 0;
    }
    .nav-dot:hover { background: rgba(0,255,136,0.2); }
    .nav-dot--active { background: var(--aurora-green); box-shadow: 0 0 12px var(--aurora-green); transform: scale(1.3); }
    .slide-counter { position: fixed; bottom: 30px; left: 30px; font-size: 0.8rem; color: var(--text-muted); z-index: 100; font-family: 'General Sans', sans-serif; }

    /* === Responsive === */
    @media (max-width: 768px) {
      .slide { padding: 40px 20px; }
      .nav-dots { right: 15px; gap: 10px; }
      .slide__two-column { grid-template-columns: 1fr; gap: 30px; }
      .slide__stats { grid-template-columns: 1fr; }
      .slide__image-text, .slide__image-text--left, .slide__image-text--right { grid-template-columns: 1fr; }
      .slide__image-text--right .slide__image { order: 0; }
    }

    @media (prefers-reduced-motion: reduce) {
      .aurora-bg::before, .aurora-bg::after { animation: none; }
      .slide__content { transition: opacity 0.3s ease; }
      .slide__bullets li, .slide__stat { animation: none; opacity: 1; transform: none; }
    }

    @media print {
      html { scroll-snap-type: none; }
      .slide { min-height: auto; page-break-after: always; padding: 40px; break-inside: avoid; }
      .progress, .nav-dots, .slide-counter, .aurora-bg, .stars { display: none; }
      .slide__content { opacity: 1; transform: none; transition: none; }
      body { background: #fff; color: #111; }
      .slide--title h1 { -webkit-text-fill-color: #111; background: none; }
    }
  </style>
</head>
<body>
  <div class="aurora-bg"></div>
  <div class="stars"></div>

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

      function updateUI(index) {
        current = index;
        progress.style.width = ((index + 1) / total * 100) + '%';
        counter.textContent = (index + 1) + ' / ' + total;
        dots.forEach((d, i) => d.classList.toggle('nav-dot--active', i === index));
      }

      const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            updateUI(parseInt(e.target.dataset.index));
            e.target.querySelector('.slide__content').classList.add('animate');
          }
        });
      }, { threshold: 0.5 });
      slides.forEach(s => observer.observe(s));

      dots.forEach(dot => dot.addEventListener('click', () => {
        slides[parseInt(dot.dataset.index)].scrollIntoView({ behavior: 'smooth' });
      }));

      document.addEventListener('keydown', e => {
        if (['ArrowDown','ArrowRight',' '].includes(e.key)) { e.preventDefault(); if (current < total - 1) slides[current + 1].scrollIntoView({ behavior: 'smooth' }); }
        else if (['ArrowUp','ArrowLeft'].includes(e.key)) { e.preventDefault(); if (current > 0) slides[current - 1].scrollIntoView({ behavior: 'smooth' }); }
      });

      let touchY = 0;
      document.addEventListener('touchstart', e => { touchY = e.touches[0].clientY; });
      document.addEventListener('touchend', e => {
        const d = touchY - e.changedTouches[0].clientY;
        if (Math.abs(d) > 50) {
          if (d > 0 && current < total - 1) slides[current + 1].scrollIntoView({ behavior: 'smooth' });
          else if (d < 0 && current > 0) slides[current - 1].scrollIntoView({ behavior: 'smooth' });
        }
      });
    })();
  </script>
  ${watermark ? `<div style="position:fixed;bottom:16px;right:16px;z-index:9999;font-size:18px;font-weight:600;color:rgba(0,255,136,0.4);font-family:'General Sans',sans-serif;pointer-events:none;"><a href="https://htmldecks.com" target="_blank" style="color:inherit;text-decoration:none;pointer-events:auto;">Made with HTML Decks</a></div>` : ''}
</body>
</html>`;
}

generateAuroraBorealis.defaults = {
  companyName: 'Lumina Labs',
  accentColor: '#00ff88',
  slides: [
    { type: 'title', title: 'Illuminate the Future', subtitle: 'Where breakthrough ideas meet the beauty of execution', badge: 'INNOVATION' },
    { type: 'bullets', title: 'Our Vision', content: 'Harnessing cutting-edge research to solve real-world problems\nBuilding technology that feels magical yet grounded\nCreating experiences that inspire and empower every user' },
    { type: 'stats', title: 'Traction & Impact', metrics: [
      { number: '3.2M', label: 'Active Users' },
      { number: '99.8%', label: 'Uptime' },
      { number: '4.9★', label: 'App Store Rating' },
      { number: '140+', label: 'Countries' }
    ]},
    { type: 'bar-chart', title: 'Revenue Growth', series: [
      { name: 'Revenue', data: [
        { label: 'Q1', value: 400 },
        { label: 'Q2', value: 800 },
        { label: 'Q3', value: 1400 },
        { label: 'Q4', value: 2200 }
      ]}
    ]},
    { type: 'quote', quote: 'The most profound technologies are those that disappear — they weave themselves into the fabric of everyday life until they are indistinguishable from it.', attribution: 'Mark Weiser' },
    { type: 'title', title: 'Join the Journey', subtitle: 'Let\'s build something extraordinary together', badge: 'GET STARTED' }
  ]
};
