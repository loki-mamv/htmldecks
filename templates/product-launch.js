/**
 * HTML Decks — Product Launch Template Generator
 * 
 * Vibrant multi-color gradient theme (pink → orange → purple), energetic and bold.
 * Designed for product announcements, launches, and exciting reveals.
 * 
 * @param {Object} config
 * @param {string} config.companyName
 * @param {string} config.accentColor
 * @param {Array<{title: string, content: string, type?: string, data?: any}>} config.slides
 * @returns {string} Complete standalone HTML document
 */
function generateProductLaunch({ companyName, accentColor, slides }) {
  const slideCount = slides.length;

  const generateChart = (type, data) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return '<div class="chart-placeholder">No data available</div>';
    }

    const colors = ['#E14A8B', '#F5A623', '#5A49E1', '#FF6B6B', '#4ECDC4'];
    
    switch (type) {
      case 'bar-chart':
        const maxVal = Math.max(...data.map(d => d.value || 0));
        const barWidth = Math.max(40, 300 / data.length);
        return `
          <svg class="chart" viewBox="0 0 400 200" style="width: 100%; max-width: 500px; height: 200px;">
            ${data.map((d, i) => {
              const height = maxVal > 0 ? (d.value / maxVal) * 150 : 0;
              const x = 50 + i * (barWidth + 10);
              return `
                <rect x="${x}" y="${170 - height}" width="${barWidth}" height="${height}" 
                      fill="${colors[i % colors.length]}" rx="4"/>
                <text x="${x + barWidth/2}" y="185" text-anchor="middle" 
                      fill="currentColor" font-size="12">${d.label}</text>
                <text x="${x + barWidth/2}" y="${165 - height}" text-anchor="middle" 
                      fill="currentColor" font-size="11" font-weight="600">${d.value}</text>
              `;
            }).join('')}
          </svg>`;
      
      case 'line-chart':
        const lineMax = Math.max(...data.map(d => d.value || 0));
        const stepX = data.length > 1 ? 300 / (data.length - 1) : 150;
        const points = data.map((d, i) => {
          const x = 50 + i * stepX;
          const y = lineMax > 0 ? 170 - (d.value / lineMax) * 120 : 170;
          return `${x},${y}`;
        }).join(' ');
        
        return `
          <svg class="chart" viewBox="0 0 400 200" style="width: 100%; max-width: 500px; height: 200px;">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="${colors[0]}"/>
                <stop offset="50%" stop-color="${colors[1]}"/>
                <stop offset="100%" stop-color="${colors[2]}"/>
              </linearGradient>
            </defs>
            <polyline points="${points}" fill="none" stroke="url(#lineGradient)" stroke-width="4" stroke-linecap="round"/>
            ${data.map((d, i) => {
              const x = 50 + i * stepX;
              const y = lineMax > 0 ? 170 - (d.value / lineMax) * 120 : 170;
              return `
                <circle cx="${x}" cy="${y}" r="5" fill="${colors[i % colors.length]}"/>
                <text x="${x}" y="185" text-anchor="middle" fill="currentColor" font-size="12">${d.label}</text>
                <text x="${x}" y="${y - 12}" text-anchor="middle" fill="currentColor" font-size="11" font-weight="600">${d.value}</text>
              `;
            }).join('')}
          </svg>`;
      
      case 'pie-chart':
        const total = data.reduce((sum, d) => sum + (d.value || 0), 0);
        let cumulativePercentage = 0;
        const radius = 70;
        const centerX = 100, centerY = 100;
        
        return `
          <svg class="chart" viewBox="0 0 200 200" style="width: 200px; height: 200px; margin: 0 auto;">
            ${data.map((d, i) => {
              const percentage = total > 0 ? d.value / total : 0;
              const startAngle = cumulativePercentage * 360;
              const endAngle = (cumulativePercentage + percentage) * 360;
              cumulativePercentage += percentage;
              
              if (percentage === 0) return '';
              
              const startAngleRad = (startAngle - 90) * Math.PI / 180;
              const endAngleRad = (endAngle - 90) * Math.PI / 180;
              
              const x1 = centerX + radius * Math.cos(startAngleRad);
              const y1 = centerY + radius * Math.sin(startAngleRad);
              const x2 = centerX + radius * Math.cos(endAngleRad);
              const y2 = centerY + radius * Math.sin(endAngleRad);
              
              const largeArcFlag = percentage > 0.5 ? 1 : 0;
              
              return `
                <path d="M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} z" 
                      fill="${colors[i % colors.length]}" stroke="#fff" stroke-width="2"/>
              `;
            }).join('')}
          </svg>`;
            
      default:
        return '<div class="chart-placeholder">Chart type not supported</div>';
    }
  };

  const slidesHTML = slides.map((slide, i) => {
    const type = slide.type || (i === 0 ? 'title' : 'bullets');
    
    switch (type) {
      case 'title':
        return `
        <section class="slide slide--title" data-index="${i}">
          <div class="slide__particles"></div>
          <div class="slide__content">
            <div class="launch-badge">🚀 LAUNCHING NOW</div>
            <h1>${slide.title}</h1>
            <p class="slide__subtitle">${slide.subtitle || ''}</p>
            ${slide.badge ? `<div class="slide__title-badge">${slide.badge}</div>` : ''}
            <div class="slide__brand">${companyName}</div>
          </div>
        </section>`;

      case 'stats':
        const stats = slide.metrics || [];
        return `
        <section class="slide slide--stats" data-index="${i}">
          <div class="slide__content">
            <h2>${slide.title}</h2>
            <div class="stats-grid">
              ${stats.map((stat, idx) => `
                <div class="stat-card" style="--delay: ${idx * 0.1}s">
                  <div class="stat-value">${stat.number || ''}</div>
                  <div class="stat-label">${stat.label || ''}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </section>`;

      case 'two-column':
        const leftCol = (slide.leftColumn || '').split('\n').filter(line => line.trim()).map(line => `<p>${line.replace(/^[-•]\s*/, '')}</p>`).join('');
        const rightCol = (slide.rightColumn || '').split('\n').filter(line => line.trim()).map(line => `<p>${line.replace(/^[-•]\s*/, '')}</p>`).join('');
        return `
        <section class="slide slide--two-column" data-index="${i}">
          <div class="slide__content">
            <h2>${slide.title}</h2>
            <div class="two-column">
              <div class="column">
                ${leftCol}
              </div>
              <div class="column">
                ${rightCol}
              </div>
            </div>
          </div>
        </section>`;

      case 'quote':
        return `
        <section class="slide slide--quote" data-index="${i}">
          <div class="slide__content">
            <blockquote class="quote">
              <p class="quote__text">"${(slide.quote || '').replace(/^["']|["']$/g, '')}"</p>
              <cite class="quote__author">— ${slide.attribution || ''}</cite>
            </blockquote>
          </div>
        </section>`;

      case 'table':
        const tableData = slide.tableData || [];
        if (tableData.length === 0) {
          return `
          <section class="slide" data-index="${i}">
            <div class="slide__content">
              <h2>${slide.title}</h2>
              <div class="table-placeholder">No table data available</div>
            </div>
          </section>`;
        }
        const tableHTML = tableData.map((row, rowIndex) => {
          const tag = rowIndex === 0 ? 'th' : 'td';
          const cells = (row || []).map(cell => `<${tag}>${cell || ''}</${tag}>`).join('');
          return `<tr>${cells}</tr>`;
        }).join('');
        return `
        <section class="slide slide--table" data-index="${i}">
          <div class="slide__content">
            <h2>${slide.title}</h2>
            <div class="table-container">
              <table class="data-table">
                ${tableHTML}
              </table>
            </div>
          </div>
        </section>`;

      case 'bar-chart': {
        const barData = (slide.series || []).flatMap(s => (s.data || []).map(d => ({label: d.label || '', value: d.value || 0})));
        return `
        <section class="slide slide--chart" data-index="${i}">
          <div class="slide__content">
            <h2>${slide.title}</h2>
            <div class="chart-container">
              ${generateChart('bar-chart', barData)}
            </div>
          </div>
        </section>`;
      }
      case 'line-chart': {
        const lineData = (slide.series || []).flatMap(s => (s.data || []).map(d => ({label: d.x || d.label || '', value: d.y || d.value || 0})));
        return `
        <section class="slide slide--chart" data-index="${i}">
          <div class="slide__content">
            <h2>${slide.title}</h2>
            <div class="chart-container">
              ${generateChart('line-chart', lineData)}
            </div>
          </div>
        </section>`;
      }
      case 'pie-chart': {
        return `
        <section class="slide slide--chart" data-index="${i}">
          <div class="slide__content">
            <h2>${slide.title}</h2>
            <div class="chart-container">
              ${generateChart('pie-chart', slide.segments || [])}
            </div>
          </div>
        </section>`;
      }

      case 'image-text': {
        const imgUrl = slide.imageUrl || '';
        const imageLeft = slide.layout === 'image-left';
        const descriptionHTML = (slide.description || '').split('\n').filter(line => line.trim()).map(line => `<p>${line.replace(/^[-•]\s*/, '')}</p>`).join('');
        return `
        <section class="slide slide--image-text" data-index="${i}">
          <div class="slide__content">
            <h2>${slide.title}</h2>
            <div class="image-text ${imageLeft ? '' : 'image-text--right'}">
              <div class="image-container">
                <img src="${imgUrl}" alt="${slide.title}" class="slide-image" />
              </div>
              <div class="text-container">
                ${descriptionHTML}
              </div>
            </div>
          </div>
        </section>`;
      }

      default: // bullets
        const bullets = (slide.content || '')
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
    }
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${slides[0]?.title || companyName} — Product Launch</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    /* === Reset === */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    
    :root {
      --accent: ${accentColor};
      --gradient-1: #E14A8B;
      --gradient-2: #F5A623;
      --gradient-3: #5A49E1;
      --bg: #FFFFFF;
      --bg-alt: #FEFEFE;
      --text: #1A1A2E;
      --text-muted: #6B7280;
      --surface: #F9FAFB;
      --border: #E5E7EB;
      --shadow: rgba(0,0,0,0.1);
    }

    html { scroll-snap-type: y mandatory; scroll-behavior: smooth; overflow-x: hidden; }
    body {
      font-family: 'Inter', sans-serif;
      background: var(--bg);
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
      background: var(--bg);
    }
    .slide:nth-child(even) {
      background: var(--bg-alt);
    }
    .slide__content {
      max-width: 900px;
      width: 100%;
      opacity: 0;
      transform: translateY(30px);
      animation: bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
    }

    /* === Title Slide === */
    .slide--title {
      background: linear-gradient(135deg, var(--gradient-1) 0%, var(--gradient-2) 50%, var(--gradient-3) 100%);
      color: white;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .slide__particles {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.3)"/><circle cx="80" cy="20" r="1.5" fill="rgba(255,255,255,0.2)"/><circle cx="40" cy="70" r="1" fill="rgba(255,255,255,0.4)"/><circle cx="70" cy="60" r="2.5" fill="rgba(255,255,255,0.1)"/></svg>');
      animation: float 6s ease-in-out infinite;
    }
    .launch-badge {
      display: inline-block;
      background: rgba(255,255,255,0.2);
      border: 1px solid rgba(255,255,255,0.3);
      border-radius: 25px;
      padding: 8px 16px;
      font-size: 0.85rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      margin-bottom: 24px;
      backdrop-filter: blur(10px);
    }
    .slide--title h1 {
      font-family: 'Sora', sans-serif;
      font-size: clamp(2.5rem, 6vw, 4.5rem);
      font-weight: 800;
      margin-bottom: 16px;
      line-height: 1.1;
    }
    .slide__subtitle {
      font-size: clamp(1.1rem, 2.5vw, 1.8rem);
      margin-bottom: 32px;
      opacity: 0.9;
      font-weight: 400;
    }
    .slide__brand {
      font-size: 1rem;
      font-weight: 600;
      opacity: 0.8;
      letter-spacing: 0.1em;
    }

    /* === Content Slides === */
    .slide h2 {
      font-family: 'Sora', sans-serif;
      font-size: clamp(1.8rem, 4vw, 3rem);
      font-weight: 700;
      margin-bottom: 40px;
      position: relative;
      padding-bottom: 12px;
      background: linear-gradient(135deg, var(--gradient-1), var(--gradient-2), var(--gradient-3));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .slide h2::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 80px;
      height: 4px;
      background: linear-gradient(90deg, var(--gradient-1), var(--gradient-2));
      border-radius: 2px;
    }

    /* === Bullets === */
    .slide__bullets {
      list-style: none;
      font-size: clamp(1rem, 2.2vw, 1.4rem);
      line-height: 1.7;
    }
    .slide__bullets li {
      padding-left: 36px;
      position: relative;
      margin-bottom: 20px;
      color: var(--text);
    }
    .slide__bullets li::before {
      content: '✨';
      position: absolute;
      left: 0;
      top: 0;
      font-size: 1.2em;
    }

    /* === Stats Grid === */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
      margin-top: 20px;
    }
    .stat-card {
      background: linear-gradient(135deg, rgba(225,74,139,0.05) 0%, rgba(245,166,35,0.05) 100%);
      padding: 32px;
      border-radius: 16px;
      text-align: center;
      border: 2px solid transparent;
      background-clip: padding-box;
      transition: all 0.3s ease;
      animation: statSlideIn 0.6s ease forwards;
      animation-delay: var(--delay, 0s);
      opacity: 0;
      transform: translateY(20px);
    }
    .stat-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(225,74,139,0.2);
      border: 2px solid var(--gradient-1);
    }
    .stat-value {
      font-family: 'Sora', sans-serif;
      font-size: 2.8rem;
      font-weight: 800;
      background: linear-gradient(135deg, var(--gradient-1), var(--gradient-2));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 8px;
    }
    .stat-label {
      font-size: 1rem;
      color: var(--text-muted);
      font-weight: 500;
      margin-bottom: 8px;
    }
    .stat-change {
      font-size: 0.9rem;
      font-weight: 600;
    }
    .stat-change.positive { color: #10B981; }
    .stat-change.negative { color: #EF4444; }

    /* === Two Column === */
    .two-column {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 48px;
      margin-top: 20px;
    }
    .column p {
      margin-bottom: 16px;
      font-size: 1.1rem;
      line-height: 1.6;
    }

    /* === Quote === */
    .quote {
      text-align: center;
      margin-top: 40px;
    }
    .quote__text {
      font-size: clamp(1.4rem, 3vw, 2.4rem);
      font-style: italic;
      margin-bottom: 24px;
      color: var(--text);
      line-height: 1.3;
      position: relative;
      font-weight: 500;
    }
    .quote__text::before {
      content: '"';
      font-size: 5rem;
      background: linear-gradient(135deg, var(--gradient-1), var(--gradient-2));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      position: absolute;
      left: -50px;
      top: -30px;
      font-family: serif;
    }
    .quote__author {
      font-size: 1.1rem;
      color: var(--text-muted);
      font-weight: 600;
      font-style: normal;
    }

    /* === Table === */
    .table-container {
      overflow-x: auto;
      margin-top: 20px;
      border-radius: 12px;
      box-shadow: 0 4px 20px var(--shadow);
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.95rem;
    }
    .data-table th {
      background: linear-gradient(135deg, var(--gradient-1), var(--gradient-2));
      color: white;
      font-weight: 600;
      padding: 20px 24px;
      text-align: left;
    }
    .data-table td {
      padding: 16px 24px;
      border-bottom: 1px solid var(--border);
      background: white;
    }
    .data-table tr:nth-child(even) td {
      background: var(--surface);
    }
    .data-table tr:hover td {
      background: rgba(225,74,139,0.05);
    }

    /* === Charts === */
    .chart-container {
      margin-top: 20px;
      text-align: center;
    }
    .chart {
      max-width: 100%;
      height: auto;
      filter: drop-shadow(0 4px 12px rgba(0,0,0,0.1));
    }
    .chart-placeholder {
      background: var(--surface);
      border: 2px dashed var(--border);
      border-radius: 12px;
      padding: 60px;
      text-align: center;
      color: var(--text-muted);
      font-weight: 500;
    }

    /* === Image Text === */
    .image-text {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      align-items: center;
      margin-top: 20px;
    }
    .image-container {
      text-align: center;
    }
    .slide-image {
      max-width: 100%;
      height: auto;
      border-radius: 12px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.12);
      transition: transform 0.3s ease;
    }
    .slide-image:hover {
      transform: scale(1.02);
    }
    .text-container p {
      margin-bottom: 16px;
      font-size: 1.1rem;
      line-height: 1.6;
    }

    /* === Progress Bar === */
    .progress {
      position: fixed;
      top: 0;
      left: 0;
      height: 4px;
      background: linear-gradient(90deg, var(--gradient-1), var(--gradient-2), var(--gradient-3));
      z-index: 100;
      transition: width 0.3s ease;
    }

    /* === Navigation === */
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
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: rgba(225,74,139,0.3);
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      padding: 0;
    }
    .nav-dot--active {
      background: var(--gradient-1);
      transform: scale(1.3);
      box-shadow: 0 2px 8px rgba(225,74,139,0.4);
    }

    /* === Slide Counter === */
    .slide-counter {
      position: fixed;
      bottom: 24px;
      left: 24px;
      font-size: 0.9rem;
      color: var(--text-muted);
      z-index: 100;
      font-weight: 500;
    }

    /* === Animations === */
    @keyframes bounceIn {
      0% { opacity: 0; transform: translateY(30px) scale(0.95); }
      50% { transform: translateY(-5px) scale(1.02); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes statSlideIn {
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-10px) rotate(5deg); }
    }

    /* === Responsive === */
    @media (max-width: 768px) {
      .slide { padding: 40px 24px; }
      .two-column, .image-text { grid-template-columns: 1fr; gap: 24px; }
      .nav-dots { right: 12px; gap: 8px; }
      .nav-dot { width: 10px; height: 10px; }
      .stats-grid { grid-template-columns: 1fr; }
      .quote__text::before { left: -25px; font-size: 3rem; }
    }

    /* === Print === */
    @media print {
      html { scroll-snap-type: none; }
      .slide { 
        min-height: auto; 
        page-break-after: always; 
        padding: 40px;
        break-inside: avoid;
        background: white !important;
      }
      .slide--title { 
        background: linear-gradient(135deg, var(--gradient-1), var(--gradient-2)) !important;
        -webkit-print-color-adjust: exact;
        color-adjust: exact;
      }
      .progress, .nav-dots, .slide-counter { display: none; }
      .slide__content { opacity: 1; transform: none; animation: none; }
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
        progress.style.width = ((index + 1) / total * 100) + '%';
        counter.textContent = (index + 1) + ' / ' + total;
        dots.forEach((d, i) => d.classList.toggle('nav-dot--active', i === index));
        // Re-trigger animation
        const content = slides[index].querySelector('.slide__content');
        if (content) {
          content.style.animation = 'none';
          content.offsetHeight; // force reflow
          content.style.animation = '';
        }
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

      // Dot navigation
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

      // Touch/swipe support
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
  <div style="position: fixed; bottom: 16px; right: 16px; z-index: 9999; font-size: 18px; font-weight: 600; color: rgba(225, 74, 139, 0.7); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; pointer-events: none;">
    <a href="https://htmldecks.com" target="_blank" style="color: inherit; text-decoration: none; pointer-events: auto;">Made with HTML Decks</a>
  </div>` : ''}
</body>
</html>`;
}

// Default configuration for product launches
generateProductLaunch.defaults = {
  companyName: 'Acme',
  accentColor: '#E14A8B',
  slides: [
    { 
      type: 'title',
      title: 'Introducing AcmeFlow', 
      subtitle: 'The workspace that thinks ahead'
    },
    { 
      type: 'bullets',
      title: 'Why We Built This', 
      content: 'Teams waste 30% of time context-switching\nCollaboration tools create more silos, not fewer\nKnowledge gets lost in endless message threads\nOnboarding new teammates takes weeks'
    },
    { 
      type: 'image-text',
      title: 'The AcmeFlow Experience', 
      description: 'AcmeFlow learns your team\'s patterns and proactively organizes your work. No more hunting for files, forgetting follow-ups, or losing context.\n\nYour AI assistant handles the busy work while you focus on what matters: creating amazing products.',
      imageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=500&h=300&fit=crop',
      layout: 'image-left'
    },
    { 
      type: 'stats',
      title: 'Early Access Results', 
      metrics: [
        { number: '42%', label: 'Faster delivery' },
        { number: '3.2x', label: 'Team satisfaction' },
        { number: '$240K', label: 'Annual savings' },
        { number: '48hrs', label: 'Onboarding time' }
      ]
    },
    { 
      type: 'quote',
      quote: 'AcmeFlow is like having a brilliant assistant who never sleeps. It knows what I need before I do.',
      attribution: 'Sarah Chen, Head of Product at TechCorp'
    },
    { 
      type: 'bullets',
      title: 'Available Today', 
      content: '✨ Free 14-day trial for all teams\n🚀 Pro features unlock after trial\n📱 Available on web, desktop & mobile\n👥 Dedicated onboarding for teams 10+'
    }
  ]
};