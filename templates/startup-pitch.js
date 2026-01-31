/**
 * HTML Decks — Startup Pitch Template Generator
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

  const chartColors = ['#5A49E1', '#46D19A', '#F5A623', '#E14A8B', '#4A9FF5', '#FF6B6B'];

  const slidesHTML = slides.map((slide, i) => {
    switch (slide.type) {
      case 'title':
        return `
      <section class="slide slide--title" data-index="${i}">
        <div class="slide__content">
          <h1>${slide.title}</h1>
          ${slide.subtitle ? `<p class="slide__subtitle">${slide.subtitle}</p>` : ''}
          <div class="slide__accent-bar"></div>
          ${slide.badge ? `<div class="slide__badge">${slide.badge}</div>` : ''}
          <p class="slide__company">${companyName}</p>
        </div>
      </section>`;

      case 'bullets':
        const bullets = slide.content
          .split('\n')
          .filter(line => line.trim())
          .map(line => `<li>${line.replace(/^[-•]\s*/, '')}</li>`)
          .join('\n              ');
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <h2>${slide.title}</h2>
          <ul class="slide__bullets">
            ${bullets}
          </ul>
        </div>
      </section>`;

      case 'two-column':
        const leftBullets = slide.leftColumn
          .split('\n')
          .filter(line => line.trim())
          .map(line => `<li>${line.replace(/^[-•]\s*/, '')}</li>`)
          .join('\n              ');
        const rightBullets = slide.rightColumn
          .split('\n')
          .filter(line => line.trim())
          .map(line => `<li>${line.replace(/^[-•]\s*/, '')}</li>`)
          .join('\n              ');
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <h2>${slide.title}</h2>
          <div class="slide__two-column">
            <div class="slide__column">
              <ul class="slide__bullets">
                ${leftBullets}
              </ul>
            </div>
            <div class="slide__column">
              <ul class="slide__bullets">
                ${rightBullets}
              </ul>
            </div>
          </div>
        </div>
      </section>`;

      case 'stats':
        const statsHTML = slide.metrics.map(metric => `
          <div class="slide__stat">
            <div class="slide__stat-number">${metric.number}</div>
            <div class="slide__stat-label">${metric.label}</div>
          </div>
        `).join('');
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <h2>${slide.title}</h2>
          <div class="slide__stats">
            ${statsHTML}
          </div>
        </div>
      </section>`;

      case 'quote':
        return `
      <section class="slide slide--quote" data-index="${i}">
        <div class="slide__content">
          <blockquote class="slide__quote">
            "${slide.quote}"
          </blockquote>
          <cite class="slide__attribution">— ${slide.attribution}</cite>
        </div>
      </section>`;

      case 'table':
        const tableHTML = slide.tableData.map((row, rowIndex) => {
          const tag = rowIndex === 0 ? 'th' : 'td';
          const cells = row.map(cell => `<${tag}>${cell}</${tag}>`).join('');
          return `<tr>${cells}</tr>`;
        }).join('');
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <h2>${slide.title}</h2>
          <table class="slide__table">
            ${tableHTML}
          </table>
        </div>
      </section>`;

      case 'bar-chart':
        const barChartSVG = generateBarChart(slide.series, chartColors);
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <h2>${slide.title}</h2>
          <div class="slide__chart">
            ${barChartSVG}
          </div>
        </div>
      </section>`;

      case 'line-chart':
        const lineChartSVG = generateLineChart(slide.series, chartColors);
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <h2>${slide.title}</h2>
          <div class="slide__chart">
            ${lineChartSVG}
          </div>
        </div>
      </section>`;

      case 'pie-chart':
        const pieChartSVG = generatePieChart(slide.segments, chartColors);
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <h2>${slide.title}</h2>
          <div class="slide__chart">
            ${pieChartSVG}
          </div>
        </div>
      </section>`;

      case 'image-text':
        const imageLeft = slide.layout === 'image-left';
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <h2>${slide.title}</h2>
          <div class="slide__image-text ${imageLeft ? 'slide__image-text--left' : 'slide__image-text--right'}">
            <div class="slide__image">
              <img src="${slide.imageUrl}" alt="Slide image">
            </div>
            <div class="slide__text">
              <p>${slide.description.split('\n').join('</p><p>')}</p>
            </div>
          </div>
        </div>
      </section>`;

      default:
        // Fall back to bullets
        const defaultBullets = (slide.content || '')
          .split('\n')
          .filter(line => line.trim())
          .map(line => `<li>${line.replace(/^[-•]\s*/, '')}</li>`)
          .join('\n              ');
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <h2>${slide.title}</h2>
          <ul class="slide__bullets">
            ${defaultBullets}
          </ul>
        </div>
      </section>`;
    }
  }).join('\n');

  // Chart generation functions
  function generateBarChart(series, colors) {
    if (!series || series.length === 0) return '<p>No data available</p>';
    
    const allLabels = [...new Set(series.flatMap(s => s.data.map(d => d.label)))];
    const maxValue = Math.max(...series.flatMap(s => s.data.map(d => d.value)));
    const chartWidth = 600;
    const chartHeight = 300;
    const margin = { top: 20, right: 120, bottom: 40, left: 60 };
    const plotWidth = chartWidth - margin.left - margin.right;
    const plotHeight = chartHeight - margin.top - margin.bottom;
    
    const barGroupWidth = plotWidth / allLabels.length;
    const barWidth = Math.max(10, barGroupWidth / series.length - 4);
    
    const bars = series.map((s, seriesIndex) => {
      return s.data.map((d, dataIndex) => {
        const labelIndex = allLabels.indexOf(d.label);
        const height = (d.value / maxValue) * plotHeight;
        const x = margin.left + labelIndex * barGroupWidth + seriesIndex * (barWidth + 2);
        const y = margin.top + plotHeight - height;
        
        return `<rect x="${x}" y="${y}" width="${barWidth}" height="${height}" fill="${colors[seriesIndex % colors.length]}" />`;
      }).join('');
    }).join('');
    
    const xAxisLabels = allLabels.map((label, index) => {
      const x = margin.left + index * barGroupWidth + barGroupWidth / 2;
      return `<text x="${x}" y="${chartHeight - 15}" text-anchor="middle" font-size="12" fill="var(--text-muted)">${label}</text>`;
    }).join('');
    
    const legend = series.map((s, index) => {
      const y = margin.top + index * 20;
      return `
        <rect x="${chartWidth - 100}" y="${y}" width="12" height="12" fill="${colors[index % colors.length]}" />
        <text x="${chartWidth - 80}" y="${y + 9}" font-size="12" fill="var(--text)">${s.name}</text>
      `;
    }).join('');
    
    return `
      <svg viewBox="0 0 ${chartWidth} ${chartHeight}" style="max-width: 100%; height: auto;">
        <!-- Background grid -->
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
          </pattern>
        </defs>
        <rect x="${margin.left}" y="${margin.top}" width="${plotWidth}" height="${plotHeight}" fill="url(#grid)" />
        
        <!-- Bars -->
        ${bars}
        
        <!-- Axes -->
        <line x1="${margin.left}" y1="${margin.top + plotHeight}" x2="${margin.left + plotWidth}" y2="${margin.top + plotHeight}" stroke="var(--text-muted)" stroke-width="1"/>
        <line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${margin.top + plotHeight}" stroke="var(--text-muted)" stroke-width="1"/>
        
        <!-- Labels -->
        ${xAxisLabels}
        
        <!-- Legend -->
        ${legend}
      </svg>
    `;
  }

  function generateLineChart(series, colors) {
    if (!series || series.length === 0) return '<p>No data available</p>';
    
    const allXValues = [...new Set(series.flatMap(s => s.data.map(d => d.x)))];
    const maxY = Math.max(...series.flatMap(s => s.data.map(d => d.y)));
    const chartWidth = 600;
    const chartHeight = 300;
    const margin = { top: 20, right: 120, bottom: 40, left: 60 };
    const plotWidth = chartWidth - margin.left - margin.right;
    const plotHeight = chartHeight - margin.top - margin.bottom;
    
    const lines = series.map((s, seriesIndex) => {
      const points = s.data.map(d => {
        const xIndex = allXValues.indexOf(d.x);
        const x = margin.left + (xIndex / (allXValues.length - 1)) * plotWidth;
        const y = margin.top + plotHeight - (d.y / maxY) * plotHeight;
        return `${x},${y}`;
      }).join(' ');
      
      const circles = s.data.map(d => {
        const xIndex = allXValues.indexOf(d.x);
        const x = margin.left + (xIndex / (allXValues.length - 1)) * plotWidth;
        const y = margin.top + plotHeight - (d.y / maxY) * plotHeight;
        return `<circle cx="${x}" cy="${y}" r="4" fill="${colors[seriesIndex % colors.length]}" />`;
      }).join('');
      
      return `
        <polyline points="${points}" fill="none" stroke="${colors[seriesIndex % colors.length]}" stroke-width="3" />
        ${circles}
      `;
    }).join('');
    
    const xAxisLabels = allXValues.map((label, index) => {
      const x = margin.left + (index / (allXValues.length - 1)) * plotWidth;
      return `<text x="${x}" y="${chartHeight - 15}" text-anchor="middle" font-size="12" fill="var(--text-muted)">${label}</text>`;
    }).join('');
    
    const legend = series.map((s, index) => {
      const y = margin.top + index * 20;
      return `
        <rect x="${chartWidth - 100}" y="${y}" width="12" height="12" fill="${colors[index % colors.length]}" />
        <text x="${chartWidth - 80}" y="${y + 9}" font-size="12" fill="var(--text)">${s.name}</text>
      `;
    }).join('');
    
    return `
      <svg viewBox="0 0 ${chartWidth} ${chartHeight}" style="max-width: 100%; height: auto;">
        <!-- Background grid -->
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
          </pattern>
        </defs>
        <rect x="${margin.left}" y="${margin.top}" width="${plotWidth}" height="${plotHeight}" fill="url(#grid)" />
        
        <!-- Lines -->
        ${lines}
        
        <!-- Axes -->
        <line x1="${margin.left}" y1="${margin.top + plotHeight}" x2="${margin.left + plotWidth}" y2="${margin.top + plotHeight}" stroke="var(--text-muted)" stroke-width="1"/>
        <line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${margin.top + plotHeight}" stroke="var(--text-muted)" stroke-width="1"/>
        
        <!-- Labels -->
        ${xAxisLabels}
        
        <!-- Legend -->
        ${legend}
      </svg>
    `;
  }

  function generatePieChart(segments, colors) {
    if (!segments || segments.length === 0) return '<p>No data available</p>';
    
    const total = segments.reduce((sum, seg) => sum + seg.value, 0);
    const chartSize = 300;
    const radius = 100;
    const center = chartSize / 2;
    
    let currentAngle = -90; // Start at top
    
    const slices = segments.map((segment, index) => {
      const percentage = segment.value / total;
      const angle = percentage * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      
      const startRadians = (startAngle * Math.PI) / 180;
      const endRadians = (endAngle * Math.PI) / 180;
      
      const x1 = center + radius * Math.cos(startRadians);
      const y1 = center + radius * Math.sin(startRadians);
      const x2 = center + radius * Math.cos(endRadians);
      const y2 = center + radius * Math.sin(endRadians);
      
      const largeArcFlag = angle > 180 ? 1 : 0;
      
      const pathData = [
        `M ${center} ${center}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');
      
      currentAngle = endAngle;
      
      return `<path d="${pathData}" fill="${colors[index % colors.length]}" stroke="var(--bg-end)" stroke-width="2" />`;
    }).join('');
    
    const legend = segments.map((segment, index) => {
      const y = 20 + index * 25;
      const percentage = ((segment.value / total) * 100).toFixed(1);
      return `
        <rect x="320" y="${y}" width="15" height="15" fill="${colors[index % colors.length]}" />
        <text x="345" y="${y + 12}" font-size="14" fill="var(--text)">${segment.label} (${percentage}%)</text>
      `;
    }).join('');
    
    return `
      <svg viewBox="0 0 500 ${chartSize}" style="max-width: 100%; height: auto;">
        <!-- Pie slices -->
        ${slices}
        
        <!-- Legend -->
        ${legend}
      </svg>
    `;
  }

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
    .slide__badge {
      display: inline-block;
      background: var(--accent);
      color: white;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 16px 0;
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

    /* === Two Column Layout === */
    .slide__two-column {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 48px;
      align-items: start;
    }

    /* === Stats === */
    .slide__stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 32px;
      margin-top: 24px;
    }
    .slide__stat {
      text-align: center;
      padding: 24px;
      background: rgba(255,255,255,0.05);
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.1);
    }
    .slide__stat-number {
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 700;
      color: var(--accent);
      margin-bottom: 8px;
      line-height: 1;
    }
    .slide__stat-label {
      font-size: 0.9rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    /* === Quote === */
    .slide--quote {
      text-align: center;
    }
    .slide__quote {
      font-size: clamp(1.3rem, 3vw, 2rem);
      font-style: italic;
      font-weight: 300;
      line-height: 1.6;
      color: var(--text);
      margin: 0 0 32px 0;
      position: relative;
    }
    .slide__quote::before {
      content: '"';
      font-size: 4rem;
      color: var(--accent);
      position: absolute;
      top: -20px;
      left: -40px;
      font-weight: 700;
    }
    .slide__attribution {
      font-size: 1rem;
      color: var(--text-muted);
      font-weight: 500;
      font-style: normal;
    }

    /* === Table === */
    .slide__table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 24px;
      background: rgba(255,255,255,0.03);
      border-radius: 8px;
      overflow: hidden;
    }
    .slide__table th,
    .slide__table td {
      padding: 16px;
      text-align: left;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .slide__table th {
      background: rgba(255,255,255,0.05);
      font-weight: 600;
      color: var(--accent);
      text-transform: uppercase;
      font-size: 0.9rem;
      letter-spacing: 0.05em;
    }
    .slide__table td {
      font-weight: 300;
    }
    .slide__table tr:last-child td {
      border-bottom: none;
    }

    /* === Charts === */
    .slide__chart {
      margin-top: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    /* === Image + Text === */
    .slide__image-text {
      display: grid;
      gap: 32px;
      align-items: center;
      margin-top: 24px;
    }
    .slide__image-text--left {
      grid-template-columns: 1fr 1.5fr;
    }
    .slide__image-text--right {
      grid-template-columns: 1.5fr 1fr;
    }
    .slide__image-text--right .slide__image {
      order: 2;
    }
    .slide__image {
      overflow: hidden;
      border-radius: 8px;
    }
    .slide__image img {
      width: 100%;
      height: auto;
      display: block;
    }
    .slide__text p {
      font-size: clamp(1rem, 2vw, 1.2rem);
      line-height: 1.7;
      color: rgba(255,255,255,0.85);
      margin-bottom: 16px;
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
      .slide__two-column { grid-template-columns: 1fr; gap: 24px; }
      .slide__stats { grid-template-columns: 1fr; gap: 24px; }
      .slide__image-text,
      .slide__image-text--left,
      .slide__image-text--right { 
        grid-template-columns: 1fr; 
        gap: 24px; 
      }
      .slide__image-text--right .slide__image { order: 0; }
      .slide__table { font-size: 0.85rem; }
      .slide__table th,
      .slide__table td { padding: 12px 8px; }
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
  ${config.watermark ? `
  <!-- Made with HTML Decks watermark -->
  <div style="position: fixed; bottom: 16px; right: 16px; z-index: 9999; font-size: 10px; color: rgba(255, 255, 255, 0.6); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; pointer-events: none;">
    <a href="https://htmldecks.com" target="_blank" style="color: inherit; text-decoration: none; pointer-events: auto;">Made with HTML Decks</a>
  </div>` : ''}
</body>
</html>`;
}
