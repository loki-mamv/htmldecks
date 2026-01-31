/**
 * HTML Decks — Sunset Gradient Template Generator
 *
 * Warm sunset gradients with golden hour vibes. Smooth color transitions
 * from orange through pink to purple. Optimistic and inviting aesthetic.
 *
 * @param {Object} config
 * @param {string} config.companyName
 * @param {string} config.accentColor
 * @param {Array} config.slides
 * @param {boolean} config.watermark
 * @returns {string} Complete standalone HTML document
 */
function generateSunsetGradient({ companyName, accentColor, slides, watermark }) {
  const slideCount = slides.length;
  const chartColors = ['#f97316', '#ec4899', '#8b5cf6', '#f59e0b', '#d946ef'];

  const slidesHTML = slides.map((slide, i) => {
    switch (slide.type) {
      case 'title':
        return `
      <section class="slide slide--title" data-index="${i}">
        <div class="gradient-orb gradient-orb--1"></div>
        <div class="gradient-orb gradient-orb--2"></div>
        <div class="slide__content">
          <div class="slide__eyebrow">${companyName}</div>
          <h1>${slide.title}</h1>
          ${slide.subtitle ? `<p class="slide__subtitle">${slide.subtitle}</p>` : ''}
          ${slide.badge ? `<div class="slide__badge">${slide.badge}</div>` : ''}
        </div>
      </section>`;

      case 'bullets':
        const bullets = slide.content.split('\n').filter(l => l.trim())
          .map((line, idx) => `<li style="animation-delay: ${idx * 0.1}s">${line.replace(/^[-•]\s*/, '')}</li>`).join('\n');
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
            <div class="slide__column sunset-card"><ul class="slide__bullets">${leftB}</ul></div>
            <div class="slide__column sunset-card"><ul class="slide__bullets">${rightB}</ul></div>
          </div>
        </div>
      </section>`;

      case 'stats':
        const statsHTML = slide.metrics.map((m, idx) => `
          <div class="slide__stat sunset-card" style="animation-delay: ${idx * 0.12}s">
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
          <div class="quote-sun">☀</div>
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
          <div class="slide__chart sunset-card">${generateBarChart(slide.series, chartColors)}</div>
        </div>
      </section>`;

      case 'line-chart':
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <h2>${slide.title}</h2>
          <div class="slide__chart sunset-card">${generateLineChart(slide.series, chartColors)}</div>
        </div>
      </section>`;

      case 'pie-chart':
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <h2>${slide.title}</h2>
          <div class="slide__chart sunset-card">${generatePieChart(slide.segments, chartColors)}</div>
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
    const labels = allLabels.map((l, i) => `<text x="${m.l + i * gW + gW / 2}" y="${H - 12}" text-anchor="middle" font-size="12" fill="rgba(255,255,255,0.5)">${l}</text>`).join('');
    const legend = series.map((s, i) => `<rect x="${W - 110}" y="${m.t + i * 20}" width="12" height="12" rx="4" fill="${colors[i % colors.length]}"/><text x="${W - 90}" y="${m.t + i * 20 + 10}" font-size="12" fill="rgba(255,255,255,0.7)">${s.name}</text>`).join('');
    return `<svg viewBox="0 0 ${W} ${H}" style="max-width:100%;height:auto">${bars}<line x1="${m.l}" y1="${m.t + pH}" x2="${m.l + pW}" y2="${m.t + pH}" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>${labels}${legend}</svg>`;
  }

  function generateLineChart(series, colors) {
    if (!series || !series.length) return '<p>No data</p>';
    const allX = [...new Set(series.flatMap(s => s.data.map(d => d.x)))];
    const maxY = Math.max(...series.flatMap(s => s.data.map(d => d.y)));
    const W = 600, H = 300, m = { t: 20, r: 120, b: 40, l: 60 };
    const pW = W - m.l - m.r, pH = H - m.t - m.b;
    const lines = series.map((s, si) => {
      const pts = s.data.map(d => `${m.l + (allX.indexOf(d.x) / (allX.length - 1)) * pW},${m.t + pH - (d.y / maxY) * pH}`).join(' ');
      const circles = s.data.map(d => { const x = m.l + (allX.indexOf(d.x) / (allX.length - 1)) * pW, y = m.t + pH - (d.y / maxY) * pH; return `<circle cx="${x}" cy="${y}" r="5" fill="${colors[si % colors.length]}" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>`; }).join('');
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
    const legend = segments.map((seg, i) => `<rect x="320" y="${20 + i * 25}" width="15" height="15" rx="4" fill="${colors[i % colors.length]}"/><text x="345" y="${32 + i * 25}" font-size="14" fill="rgba(255,255,255,0.7)">${seg.label} (${((seg.value / total) * 100).toFixed(1)}%)</text>`).join('');
    return `<svg viewBox="0 0 500 ${size}" style="max-width:100%;height:auto">${slices}${legend}</svg>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${companyName} — Sunset Gradient Presentation</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --accent: ${accentColor};
      --orange: #f97316;
      --pink: #ec4899;
      --purple: #8b5cf6;
      --gold: #fbbf24;
      --text: #ffffff;
      --text-muted: rgba(255,255,255,0.6);
    }

    html { scroll-snap-type: y mandatory; scroll-behavior: smooth; overflow-x: hidden; }

    body {
      font-family: 'Outfit', -apple-system, sans-serif;
      background: linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 30%, #4a1942 60%, #6b2040 80%, #8b3a3a 100%);
      background-attachment: fixed;
      color: var(--text);
      -webkit-font-smoothing: antialiased;
      min-height: 100vh;
    }

    /* === Gradient orbs === */
    .gradient-orb {
      position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.3; z-index: 1;
      animation: orbFloat 15s ease-in-out infinite;
    }
    .gradient-orb--1 {
      width: 500px; height: 500px;
      background: linear-gradient(135deg, var(--orange), var(--pink));
      top: -15%; right: -10%;
    }
    .gradient-orb--2 {
      width: 400px; height: 400px;
      background: linear-gradient(135deg, var(--pink), var(--purple));
      bottom: -10%; left: -5%;
      animation-delay: -7s;
    }
    @keyframes orbFloat {
      0%, 100% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(30px, -20px) scale(1.05); }
    }

    .sunset-card {
      background: rgba(255,255,255,0.08); border-radius: 16px; padding: 24px;
      backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1);
    }

    .slide {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      scroll-snap-align: start; position: relative; padding: 60px 40px; z-index: 10;
      overflow: hidden;
    }
    .slide__content {
      max-width: 900px; width: 100%; position: relative; z-index: 5;
      opacity: 0; transform: translateY(25px);
      transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    .slide__content.animate { opacity: 1; transform: translateY(0); }

    h1, h2 { font-weight: 800; }

    .slide--title { text-align: center; }
    .slide--title h1 {
      font-size: clamp(3rem, 8vw, 5.5rem); letter-spacing: -0.02em;
      margin-bottom: 20px; line-height: 0.95;
      background: linear-gradient(135deg, var(--gold), var(--orange), var(--pink));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }
    .slide__eyebrow {
      font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.2em;
      color: var(--gold); margin-bottom: 20px; font-weight: 700;
    }
    .slide__subtitle {
      font-size: clamp(1.1rem, 2.5vw, 1.5rem); color: var(--text-muted);
      margin-bottom: 30px; max-width: 650px; margin-left: auto; margin-right: auto;
    }
    .slide__badge {
      display: inline-block;
      background: linear-gradient(135deg, var(--orange), var(--pink));
      color: #fff; padding: 12px 28px; border-radius: 30px;
      font-size: 0.85rem; font-weight: 700; letter-spacing: 0.08em;
      box-shadow: 0 4px 20px rgba(249,115,22,0.3);
    }

    .slide h2 {
      font-size: clamp(2rem, 5vw, 3.2rem); margin-bottom: 36px;
    }
    .slide h2::after {
      content: ''; display: block; width: 50px; height: 4px; margin-top: 14px;
      background: linear-gradient(90deg, var(--orange), var(--pink));
      border-radius: 2px;
    }

    .slide__bullets {
      list-style: none; font-size: clamp(1.05rem, 2vw, 1.3rem); line-height: 1.75;
    }
    .slide__bullets li {
      padding: 10px 0 10px 32px; position: relative; color: rgba(255,255,255,0.85);
      opacity: 0; transform: translateY(10px); animation: fadeUp 0.4s ease forwards;
    }
    .slide__bullets li::before {
      content: ''; position: absolute; left: 0; top: 18px;
      width: 10px; height: 10px; border-radius: 50%;
      background: linear-gradient(135deg, var(--orange), var(--pink));
    }
    @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }

    .slide__two-column { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

    .slide__stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
    .slide__stat {
      text-align: center;
      opacity: 0; transform: scale(0.95); animation: scaleIn 0.5s ease forwards;
    }
    .slide__stat-number {
      font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: 800; line-height: 1;
      background: linear-gradient(135deg, var(--gold), var(--orange), var(--pink));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
      margin-bottom: 8px;
    }
    .slide__stat-label { font-size: 0.88rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600; }
    @keyframes scaleIn { to { opacity: 1; transform: scale(1); } }

    .slide--quote { text-align: center; }
    .quote-sun { font-size: 4rem; line-height: 1; margin-bottom: 20px; filter: drop-shadow(0 0 20px rgba(251,191,36,0.5)); }
    .slide__quote {
      font-size: clamp(1.4rem, 3vw, 2.1rem); font-weight: 500;
      line-height: 1.7; margin: 0 0 30px; max-width: 700px; margin-left: auto; margin-right: auto;
    }
    .slide__attribution { font-size: 1rem; color: var(--gold); font-style: normal; font-weight: 700; }

    .slide__table {
      width: 100%; border-collapse: collapse; margin-top: 20px;
      background: rgba(255,255,255,0.05); border-radius: 12px; overflow: hidden;
      border: 1px solid rgba(255,255,255,0.1);
    }
    .slide__table th, .slide__table td { padding: 14px 18px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.08); }
    .slide__table th { background: rgba(249,115,22,0.15); color: var(--orange); font-weight: 700; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; }
    .slide__table td { color: rgba(255,255,255,0.75); }
    .slide__table tr:last-child td { border-bottom: none; }

    .slide__chart { margin-top: 20px; display: flex; justify-content: center; padding: 24px; }

    .slide__image-text { display: grid; gap: 30px; align-items: center; margin-top: 20px; }
    .slide__image-text--left { grid-template-columns: 1fr 1.5fr; }
    .slide__image-text--right { grid-template-columns: 1.5fr 1fr; }
    .slide__image-text--right .slide__image { order: 2; }
    .slide__image { border-radius: 16px; overflow: hidden; border: 2px solid rgba(255,255,255,0.1); }
    .slide__image img { width: 100%; height: auto; display: block; }
    .slide__text p { font-size: clamp(1rem, 2vw, 1.2rem); line-height: 1.75; color: rgba(255,255,255,0.8); margin-bottom: 12px; }

    .progress { position: fixed; top: 0; left: 0; height: 4px; z-index: 100; transition: width 0.3s;
      background: linear-gradient(90deg, var(--gold), var(--orange), var(--pink)); border-radius: 0 2px 2px 0; }
    .nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; gap: 12px; z-index: 100; }
    .nav-dot {
      width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,0.2);
      border: none; cursor: pointer; transition: all 0.3s; padding: 0;
    }
    .nav-dot:hover { background: rgba(255,255,255,0.4); }
    .nav-dot--active { background: var(--orange); box-shadow: 0 0 12px var(--orange); transform: scale(1.4); }
    .slide-counter { position: fixed; bottom: 24px; left: 24px; font-size: 0.8rem; color: var(--text-muted); z-index: 100; font-weight: 600; }

    @media (max-width: 768px) {
      .slide { padding: 40px 20px; }
      .slide__two-column { grid-template-columns: 1fr; }
      .slide__stats { grid-template-columns: 1fr 1fr; }
      .slide__image-text, .slide__image-text--left, .slide__image-text--right { grid-template-columns: 1fr; }
      .gradient-orb { display: none; }
    }

    @media (prefers-reduced-motion: reduce) {
      .gradient-orb { animation: none; }
      .slide__content { transition: opacity 0.3s; }
      .slide__bullets li, .slide__stat { animation: none; opacity: 1; transform: none; }
    }

    @media print {
      html { scroll-snap-type: none; }
      .slide { min-height: auto; page-break-after: always; padding: 40px; }
      .progress, .nav-dots, .slide-counter, .gradient-orb { display: none; }
      .slide__content { opacity: 1; transform: none; }
      body { background: #fff; color: #111; }
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
  ${watermark ? `<div style="position:fixed;bottom:16px;right:16px;z-index:9999;font-size:18px;font-weight:700;color:rgba(249,115,22,0.4);font-family:'Outfit',sans-serif;pointer-events:none;"><a href="https://htmldecks.com" target="_blank" style="color:inherit;text-decoration:none;pointer-events:auto;">Made with HTML Decks</a></div>` : ''}
</body>
</html>`;
}

generateSunsetGradient.defaults = {
  companyName: 'Golden Hour',
  accentColor: '#f97316',
  slides: [
    { type: 'title', title: 'Chase the Light', subtitle: 'A new era of creative tools designed for makers who refuse to settle', badge: 'Coming Soon' },
    { type: 'bullets', title: 'What We\'re Building', content: 'Creative software that feels like magic, not a maze\nAI that enhances your vision without replacing your voice\nTools that make professionals faster and beginners capable' },
    { type: 'stats', title: 'Early Traction', metrics: [
      { number: '47K', label: 'Waitlist Signups' },
      { number: '94%', label: 'Beta Retention' },
      { number: '4.9★', label: 'User Rating' },
      { number: '2.3M', label: 'Projects Created' }
    ]},
    { type: 'two-column', title: 'For Creators, By Creators', leftColumn: 'Our Team\nPreviously at Figma, Adobe, Canva\nActive creators with 2M+ combined followers\nShipped products used by 50M+ people', rightColumn: 'Our Backers\nY Combinator W24\n$12M Series A led by Benchmark\nAngels from Notion, Linear, Vercel' },
    { type: 'quote', quote: 'Finally, creative tools that understand the way I actually think and work. It feels like the software is collaborating with me.', attribution: 'Beta User, Designer' },
    { type: 'title', title: 'Join the Waitlist', subtitle: 'Be first to experience the future of creative tools' }
  ]
};
