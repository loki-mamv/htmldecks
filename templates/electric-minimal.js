/**
 * HTML Decks — Electric Minimal Template Generator
 *
 * Ultra-clean white design with electric blue accents. Modern minimalism
 * with geometric precision, generous whitespace, and crisp typography.
 *
 * @param {Object} config
 * @param {string} config.companyName
 * @param {string} config.accentColor
 * @param {Array} config.slides
 * @param {boolean} config.watermark
 * @returns {string} Complete standalone HTML document
 */
function generateElectricMinimal({ companyName, accentColor, slides, watermark }) {
  const slideCount = slides.length;
  const chartColors = ['#0066ff', '#00c2ff', '#6366f1', '#14b8a6', '#8b5cf6'];

  const slidesHTML = slides.map((slide, i) => {
    switch (slide.type) {
      case 'title':
        return `
      <section class="slide slide--title" data-index="${i}">
        <div class="slide__content">
          <div class="slide__logo">${companyName}</div>
          <h1>${slide.title}</h1>
          ${slide.subtitle ? `<p class="slide__subtitle">${slide.subtitle}</p>` : ''}
          ${slide.badge ? `<div class="slide__badge">${slide.badge}</div>` : ''}
        </div>
        <div class="slide__accent-bar"></div>
      </section>`;

      case 'bullets':
        const bullets = slide.content.split('\n').filter(l => l.trim())
          .map((line, idx) => `<li style="animation-delay: ${idx * 0.08}s">${line.replace(/^[-•]\s*/, '')}</li>`).join('\n');
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <div class="slide__header">
            <span class="slide__num">${String(i + 1).padStart(2, '0')}</span>
            <h2>${slide.title}</h2>
          </div>
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
          <div class="slide__header">
            <span class="slide__num">${String(i + 1).padStart(2, '0')}</span>
            <h2>${slide.title}</h2>
          </div>
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
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <div class="slide__header">
            <span class="slide__num">${String(i + 1).padStart(2, '0')}</span>
            <h2>${slide.title}</h2>
          </div>
          <div class="slide__stats">${statsHTML}</div>
        </div>
      </section>`;

      case 'quote':
        return `
      <section class="slide slide--quote" data-index="${i}">
        <div class="slide__content">
          <div class="quote-line"></div>
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
          <div class="slide__header">
            <span class="slide__num">${String(i + 1).padStart(2, '0')}</span>
            <h2>${slide.title}</h2>
          </div>
          <table class="slide__table">${tableHTML}</table>
        </div>
      </section>`;

      case 'bar-chart':
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <div class="slide__header">
            <span class="slide__num">${String(i + 1).padStart(2, '0')}</span>
            <h2>${slide.title}</h2>
          </div>
          <div class="slide__chart">${generateBarChart(slide.series, chartColors)}</div>
        </div>
      </section>`;

      case 'line-chart':
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <div class="slide__header">
            <span class="slide__num">${String(i + 1).padStart(2, '0')}</span>
            <h2>${slide.title}</h2>
          </div>
          <div class="slide__chart">${generateLineChart(slide.series, chartColors)}</div>
        </div>
      </section>`;

      case 'pie-chart':
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <div class="slide__header">
            <span class="slide__num">${String(i + 1).padStart(2, '0')}</span>
            <h2>${slide.title}</h2>
          </div>
          <div class="slide__chart">${generatePieChart(slide.segments, chartColors)}</div>
        </div>
      </section>`;

      case 'image-text':
        const imgLeft = slide.layout === 'image-left';
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <div class="slide__header">
            <span class="slide__num">${String(i + 1).padStart(2, '0')}</span>
            <h2>${slide.title}</h2>
          </div>
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
          <div class="slide__header">
            <span class="slide__num">${String(i + 1).padStart(2, '0')}</span>
            <h2>${slide.title}</h2>
          </div>
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
    const labels = allLabels.map((l, i) => `<text x="${m.l + i * gW + gW / 2}" y="${H - 12}" text-anchor="middle" font-size="12" fill="#94a3b8">${l}</text>`).join('');
    const legend = series.map((s, i) => `<rect x="${W - 110}" y="${m.t + i * 20}" width="12" height="12" rx="2" fill="${colors[i % colors.length]}"/><text x="${W - 90}" y="${m.t + i * 20 + 10}" font-size="12" fill="#64748b">${s.name}</text>`).join('');
    return `<svg viewBox="0 0 ${W} ${H}" style="max-width:100%;height:auto">${bars}<line x1="${m.l}" y1="${m.t + pH}" x2="${m.l + pW}" y2="${m.t + pH}" stroke="#e2e8f0" stroke-width="1"/>${labels}${legend}</svg>`;
  }

  function generateLineChart(series, colors) {
    if (!series || !series.length) return '<p>No data</p>';
    const allX = [...new Set(series.flatMap(s => s.data.map(d => d.x)))];
    const maxY = Math.max(...series.flatMap(s => s.data.map(d => d.y)));
    const W = 600, H = 300, m = { t: 20, r: 120, b: 40, l: 60 };
    const pW = W - m.l - m.r, pH = H - m.t - m.b;
    const lines = series.map((s, si) => {
      const pts = s.data.map(d => `${m.l + (allX.indexOf(d.x) / (allX.length - 1)) * pW},${m.t + pH - (d.y / maxY) * pH}`).join(' ');
      const circles = s.data.map(d => { const x = m.l + (allX.indexOf(d.x) / (allX.length - 1)) * pW, y = m.t + pH - (d.y / maxY) * pH; return `<circle cx="${x}" cy="${y}" r="5" fill="${colors[si % colors.length]}" stroke="#fff" stroke-width="2"/>`; }).join('');
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
    const legend = segments.map((seg, i) => `<rect x="320" y="${20 + i * 25}" width="15" height="15" rx="3" fill="${colors[i % colors.length]}"/><text x="345" y="${32 + i * 25}" font-size="14" fill="#64748b">${seg.label} (${((seg.value / total) * 100).toFixed(1)}%)</text>`).join('');
    return `<svg viewBox="0 0 500 ${size}" style="max-width:100%;height:auto">${slices}${legend}</svg>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${companyName} — Electric Minimal Presentation</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --accent: ${accentColor};
      --electric: #0066ff;
      --electric-light: #e8f0ff;
      --white: #ffffff;
      --gray-50: #f8fafc;
      --gray-100: #f1f5f9;
      --gray-300: #cbd5e1;
      --gray-500: #64748b;
      --gray-700: #334155;
      --gray-900: #0f172a;
    }

    html { scroll-snap-type: y mandatory; scroll-behavior: smooth; overflow-x: hidden; }

    body {
      font-family: 'Manrope', -apple-system, sans-serif;
      background: var(--white);
      color: var(--gray-900);
      -webkit-font-smoothing: antialiased;
    }

    .slide {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      scroll-snap-align: start; position: relative; padding: 60px 60px; z-index: 10;
      background: var(--white);
    }
    .slide__content {
      max-width: 900px; width: 100%; position: relative;
      opacity: 0; transform: translateY(20px);
      transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    .slide__content.animate { opacity: 1; transform: translateY(0); }

    .slide__accent-bar {
      position: absolute; bottom: 0; left: 0; right: 0; height: 4px;
      background: linear-gradient(90deg, var(--electric), #00c2ff);
    }

    h1, h2 { font-weight: 800; }

    .slide--title { text-align: left; }
    .slide--title .slide__content { max-width: 800px; }
    .slide--title h1 {
      font-size: clamp(3.5rem, 9vw, 6rem); letter-spacing: -0.03em;
      margin-bottom: 20px; line-height: 0.95; color: var(--gray-900);
    }
    .slide__logo {
      font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.15em;
      color: var(--electric); margin-bottom: 24px; font-weight: 800;
    }
    .slide__subtitle {
      font-size: clamp(1.15rem, 2.5vw, 1.5rem); color: var(--gray-500);
      margin-bottom: 32px; max-width: 550px; font-weight: 500;
    }
    .slide__badge {
      display: inline-flex; align-items: center; gap: 8px;
      background: var(--electric); color: var(--white);
      padding: 12px 28px; border-radius: 6px;
      font-size: 0.85rem; font-weight: 700; letter-spacing: 0.05em;
    }

    .slide__header { display: flex; align-items: baseline; gap: 20px; margin-bottom: 40px; }
    .slide__num { font-size: 0.8rem; font-weight: 700; color: var(--electric); letter-spacing: 0.05em; }
    .slide h2 { font-size: clamp(2rem, 5vw, 3rem); color: var(--gray-900); }

    .slide__bullets {
      list-style: none; font-size: clamp(1.05rem, 2vw, 1.25rem); line-height: 1.7;
    }
    .slide__bullets li {
      padding: 12px 0 12px 28px; position: relative; color: var(--gray-700);
      border-left: 2px solid var(--gray-100);
      opacity: 0; transform: translateX(-10px); animation: fadeRight 0.4s ease forwards;
    }
    .slide__bullets li::before {
      content: ''; position: absolute; left: -5px; top: 20px;
      width: 8px; height: 8px; border-radius: 50%;
      background: var(--electric);
    }
    @keyframes fadeRight { to { opacity: 1; transform: translateX(0); } }

    .slide__two-column { display: grid; grid-template-columns: 1fr 1fr; gap: 50px; }
    .slide__column { border-left: 2px solid var(--electric); padding-left: 24px; }
    .slide__column .slide__bullets li { border-left: none; }
    .slide__column .slide__bullets li::before { left: -29px; }

    .slide__stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 24px; }
    .slide__stat {
      padding: 24px; background: var(--gray-50); border-radius: 12px;
      opacity: 0; transform: translateY(15px); animation: fadeUp 0.5s ease forwards;
    }
    .slide__stat-number {
      font-size: clamp(2.8rem, 5vw, 4rem); font-weight: 800; line-height: 1;
      color: var(--electric); margin-bottom: 8px;
    }
    .slide__stat-label { font-size: 0.85rem; color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600; }
    @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }

    .slide--quote { text-align: left; }
    .slide--quote .slide__content { max-width: 750px; }
    .quote-line { width: 60px; height: 4px; background: var(--electric); margin-bottom: 30px; border-radius: 2px; }
    .slide__quote {
      font-size: clamp(1.5rem, 3.5vw, 2.2rem); font-weight: 600;
      line-height: 1.5; margin: 0 0 24px; color: var(--gray-900);
    }
    .slide__attribution { font-size: 1rem; color: var(--gray-500); font-style: normal; font-weight: 600; }

    .slide__table {
      width: 100%; border-collapse: collapse; margin-top: 10px;
    }
    .slide__table th, .slide__table td { padding: 14px 18px; text-align: left; border-bottom: 1px solid var(--gray-100); }
    .slide__table th { font-weight: 700; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--gray-500); border-bottom: 2px solid var(--electric); }
    .slide__table td { color: var(--gray-700); }

    .slide__chart { margin-top: 20px; display: flex; justify-content: center; }

    .slide__image-text { display: grid; gap: 40px; align-items: center; margin-top: 10px; }
    .slide__image-text--left { grid-template-columns: 1fr 1.5fr; }
    .slide__image-text--right { grid-template-columns: 1.5fr 1fr; }
    .slide__image-text--right .slide__image { order: 2; }
    .slide__image { border-radius: 12px; overflow: hidden; background: var(--gray-100); }
    .slide__image img { width: 100%; height: auto; display: block; }
    .slide__text p { font-size: clamp(1rem, 2vw, 1.2rem); line-height: 1.75; color: var(--gray-700); margin-bottom: 12px; }

    .progress { position: fixed; top: 0; left: 0; height: 3px; z-index: 100; transition: width 0.3s;
      background: var(--electric); }
    .nav-dots { position: fixed; right: 30px; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; gap: 12px; z-index: 100; }
    .nav-dot {
      width: 8px; height: 8px; border-radius: 50%; background: var(--gray-200);
      border: none; cursor: pointer; transition: all 0.3s; padding: 0;
    }
    .nav-dot:hover { background: var(--gray-300); }
    .nav-dot--active { background: var(--electric); transform: scale(1.5); }
    .slide-counter { position: fixed; bottom: 30px; left: 30px; font-size: 0.8rem; color: var(--gray-400); z-index: 100; font-weight: 700; }

    @media (max-width: 768px) {
      .slide { padding: 40px 24px; }
      .slide__two-column { grid-template-columns: 1fr; gap: 30px; }
      .slide__stats { grid-template-columns: 1fr 1fr; }
      .slide__image-text, .slide__image-text--left, .slide__image-text--right { grid-template-columns: 1fr; }
      .slide__header { flex-direction: column; gap: 8px; }
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
      function updateUI(i) { current = i; progress.style.width = ((i+1)/total*100)+'%'; counter.textContent = pad(i+1)+' / '+pad(total); dots.forEach((d,j) => d.classList.toggle('nav-dot--active', j===i)); }
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
  ${watermark ? `<div style="position:fixed;bottom:16px;right:16px;z-index:9999;font-size:18px;font-weight:700;color:rgba(0,102,255,0.25);font-family:'Manrope',sans-serif;pointer-events:none;"><a href="https://htmldecks.com" target="_blank" style="color:inherit;text-decoration:none;pointer-events:auto;">Made with HTML Decks</a></div>` : ''}
</body>
</html>`;
}

generateElectricMinimal.defaults = {
  companyName: 'Blueprint',
  accentColor: '#0066ff',
  slides: [
    { type: 'title', title: 'Design Systems at Scale', subtitle: 'How we built a component library used by 200+ engineers across 12 product teams', badge: 'Case Study →' },
    { type: 'bullets', title: 'The Challenge', content: 'Inconsistent UI across products — same feature, different implementations\nDesign debt accumulating faster than we could address it\nEngineers spending 40% of time rebuilding common patterns' },
    { type: 'stats', title: 'Results After 12 Months', metrics: [
      { number: '73%', label: 'Faster Development' },
      { number: '89', label: 'Reusable Components' },
      { number: '12', label: 'Product Teams' },
      { number: '0', label: 'Design Inconsistencies' }
    ]},
    { type: 'two-column', title: 'Our Approach', leftColumn: 'Foundation First\nDesign tokens for colors, spacing, type\nAccessibility baked in from day one\nDocumentation as code', rightColumn: 'Adoption Strategy\nComponent champions in each team\nMigration guides and office hours\nMetrics dashboards for visibility' },
    { type: 'quote', quote: 'The system paid for itself in the first quarter. What used to take a week now takes an afternoon.', attribution: 'VP of Engineering' },
    { type: 'title', title: 'Let\'s Talk', subtitle: 'Ready to scale your design system?' }
  ]
};
