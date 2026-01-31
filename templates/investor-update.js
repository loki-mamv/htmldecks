/**
 * HTML Decks — Investor Update Template Generator
 * 
 * Swiss minimal design with dark (#1a1a1a) background and white text, very clean.
 * Designed for investor updates, board decks, and formal business presentations.
 * 
 * @param {Object} config
 * @param {string} config.companyName
 * @param {string} config.accentColor
 * @param {Array<{title: string, content: string, type?: string, data?: any}>} config.slides
 * @returns {string} Complete standalone HTML document
 */
function generateInvestorUpdate({ companyName, accentColor, slides }) {
  const slideCount = slides.length;

  const generateChart = (type, data) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return '<div class="chart-placeholder">No data available</div>';
    }

    const colors = ['#FFFFFF', '#E5E5E5', '#CCCCCC', '#B3B3B3', '#999999'];
    
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
                      fill="${i === data.length - 1 ? accentColor : colors[i % colors.length]}" rx="2"/>
                <text x="${x + barWidth/2}" y="185" text-anchor="middle" 
                      fill="currentColor" font-size="12" font-family="'Libre Baskerville', serif">${d.label}</text>
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
            <polyline points="${points}" fill="none" stroke="${accentColor}" stroke-width="2" stroke-linecap="round"/>
            ${data.map((d, i) => {
              const x = 50 + i * stepX;
              const y = lineMax > 0 ? 170 - (d.value / lineMax) * 120 : 170;
              return `
                <circle cx="${x}" cy="${y}" r="3" fill="${accentColor}"/>
                <text x="${x}" y="185" text-anchor="middle" fill="currentColor" font-size="12">${d.label}</text>
                <text x="${x}" y="${y - 8}" text-anchor="middle" fill="currentColor" font-size="11" font-weight="600">${d.value}</text>
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
                      fill="${i === 0 ? accentColor : colors[i % colors.length]}" stroke="#1a1a1a" stroke-width="1"/>
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
          <div class="slide__content">
            <div class="title-meta">
              <div class="title-period">Q4 2024</div>
              <div class="title-type">INVESTOR UPDATE</div>
            </div>
            <h1>${slide.title}</h1>
            <p class="slide__subtitle">${slide.content.split('\n')[0] || ''}</p>
            <div class="slide__brand">${companyName}</div>
          </div>
        </section>`;

      case 'stats':
        const stats = slide.data || [];
        return `
        <section class="slide slide--stats" data-index="${i}">
          <div class="slide__content">
            <h2>${slide.title}</h2>
            <div class="stats-grid">
              ${stats.map(stat => `
                <div class="stat-card">
                  <div class="stat-value">${stat.value}</div>
                  <div class="stat-label">${stat.label}</div>
                  <div class="stat-change ${stat.change && stat.change.startsWith('+') ? 'positive' : stat.change && stat.change.startsWith('-') ? 'negative' : ''}">${stat.change || ''}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </section>`;

      case 'two-column':
        const columns = slide.content.split('\n---\n');
        const leftColumn = columns[0] || '';
        const rightColumn = columns[1] || '';
        return `
        <section class="slide slide--two-column" data-index="${i}">
          <div class="slide__content">
            <h2>${slide.title}</h2>
            <div class="two-column">
              <div class="column">
                ${leftColumn.split('\n').filter(line => line.trim()).map(line => `<p>${line.replace(/^[-•]\s*/, '')}</p>`).join('')}
              </div>
              <div class="column">
                ${rightColumn.split('\n').filter(line => line.trim()).map(line => `<p>${line.replace(/^[-•]\s*/, '')}</p>`).join('')}
              </div>
            </div>
          </div>
        </section>`;

      case 'quote':
        const lines = slide.content.split('\n').filter(line => line.trim());
        const quote = lines[0] || '';
        const attribution = lines[1] || '';
        return `
        <section class="slide slide--quote" data-index="${i}">
          <div class="slide__content">
            <h2>${slide.title}</h2>
            <blockquote class="quote">
              <p class="quote__text">"${quote.replace(/^["']|["']$/g, '')}"</p>
              <cite class="quote__author">${attribution.replace(/^[-—]\s*/, '')}</cite>
            </blockquote>
          </div>
        </section>`;

      case 'table':
        const tableData = slide.data || [];
        if (tableData.length === 0) {
          return `
          <section class="slide" data-index="${i}">
            <div class="slide__content">
              <h2>${slide.title}</h2>
              <div class="table-placeholder">No table data available</div>
            </div>
          </section>`;
        }
        
        const headers = Object.keys(tableData[0] || {});
        return `
        <section class="slide slide--table" data-index="${i}">
          <div class="slide__content">
            <h2>${slide.title}</h2>
            <div class="table-container">
              <table class="data-table">
                <thead>
                  <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
                </thead>
                <tbody>
                  ${tableData.map(row => `
                    <tr>${headers.map(h => `<td>${row[h] || ''}</td>`).join('')}</tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </section>`;

      case 'bar-chart':
      case 'line-chart':
      case 'pie-chart':
        return `
        <section class="slide slide--chart" data-index="${i}">
          <div class="slide__content">
            <h2>${slide.title}</h2>
            <div class="chart-container">
              ${generateChart(type, slide.data)}
            </div>
          </div>
        </section>`;

      case 'image-text':
        const imageUrl = slide.imageUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMkEyQTJBIiBzdHJva2U9IiM0NDRNNDQI+CjxyZWN0IHg9IjE2MCIgeT0iMTIwIiB3aWR0aD0iODAiIGhlaWdodD0iNjAiIGZpbGw9IiM1NTTU1NSIvPgo8dGV4dCB4PSIyMDAiIHk9IjIyMCIgZm9udC1mYW1pbHk9InN5c3RlbS11aSIgZm9udC1zaXplPSIxNCIgZmlsbD0iI0NDQ0NDQyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW1hZ2UgUGxhY2Vob2xkZXI8L3RleHQ+Cjwvc3ZnPgo=';
        return `
        <section class="slide slide--image-text" data-index="${i}">
          <div class="slide__content">
            <h2>${slide.title}</h2>
            <div class="image-text">
              <div class="image-container">
                <img src="${imageUrl}" alt="${slide.title}" class="slide-image" />
              </div>
              <div class="text-container">
                ${slide.content.split('\n').filter(line => line.trim()).map(line => `<p>${line.replace(/^[-•]\s*/, '')}</p>`).join('')}
              </div>
            </div>
          </div>
        </section>`;

      default: // bullets
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
    }
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${slides[0]?.title || companyName} — Investor Update</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Source+Sans+3:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    /* === Reset === */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    
    :root {
      --accent: ${accentColor};
      --bg: #1a1a1a;
      --bg-alt: #202020;
      --text: #ffffff;
      --text-muted: #b3b3b3;
      --text-subtle: #888888;
      --surface: #252525;
      --border: #444444;
      --success: #4ade80;
      --danger: #f87171;
    }

    html { scroll-snap-type: y mandatory; scroll-behavior: smooth; overflow-x: hidden; }
    body {
      font-family: 'Source Sans 3', sans-serif;
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
      transform: translateY(15px);
      animation: minimalistFadeIn 0.5s ease forwards;
    }

    /* === Title Slide === */
    .slide--title {
      text-align: center;
    }
    .title-meta {
      display: flex;
      justify-content: center;
      gap: 32px;
      margin-bottom: 32px;
      font-size: 0.8rem;
      font-weight: 500;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--text-muted);
    }
    .title-period {
      padding: 8px 16px;
      border: 1px solid var(--border);
      border-radius: 2px;
    }
    .title-type {
      padding: 8px 16px;
      background: var(--accent);
      color: var(--bg);
      border-radius: 2px;
    }
    .slide--title h1 {
      font-family: 'Libre Baskerville', serif;
      font-size: clamp(2.5rem, 6vw, 4rem);
      font-weight: 700;
      margin-bottom: 24px;
      line-height: 1.1;
    }
    .slide__subtitle {
      font-size: clamp(1rem, 2vw, 1.3rem);
      margin-bottom: 40px;
      color: var(--text-muted);
      font-weight: 300;
    }
    .slide__brand {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-subtle);
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    /* === Content Slides === */
    .slide h2 {
      font-family: 'Libre Baskerville', serif;
      font-size: clamp(1.6rem, 4vw, 2.4rem);
      font-weight: 700;
      margin-bottom: 40px;
      position: relative;
      padding-bottom: 16px;
    }
    .slide h2::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 40px;
      height: 1px;
      background: var(--accent);
    }

    /* === Bullets === */
    .slide__bullets {
      list-style: none;
      font-size: clamp(1rem, 2vw, 1.2rem);
      line-height: 1.8;
      font-weight: 300;
    }
    .slide__bullets li {
      padding-left: 20px;
      position: relative;
      margin-bottom: 16px;
      color: var(--text-muted);
    }
    .slide__bullets li::before {
      content: '—';
      position: absolute;
      left: 0;
      top: 0;
      color: var(--accent);
      font-weight: 400;
    }

    /* === Stats Grid === */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 32px;
      margin-top: 32px;
    }
    .stat-card {
      padding: 32px 24px;
      border: 1px solid var(--border);
      background: var(--surface);
      transition: all 0.2s ease;
    }
    .stat-card:hover {
      border-color: var(--accent);
    }
    .stat-value {
      font-family: 'Libre Baskerville', serif;
      font-size: 2.2rem;
      font-weight: 700;
      color: var(--text);
      margin-bottom: 8px;
    }
    .stat-label {
      font-size: 0.9rem;
      color: var(--text-muted);
      font-weight: 400;
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .stat-change {
      font-size: 0.8rem;
      font-weight: 500;
    }
    .stat-change.positive { color: var(--success); }
    .stat-change.negative { color: var(--danger); }

    /* === Two Column === */
    .two-column {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 64px;
      margin-top: 32px;
    }
    .column p {
      margin-bottom: 16px;
      font-size: 1rem;
      line-height: 1.7;
      color: var(--text-muted);
      font-weight: 300;
    }

    /* === Quote === */
    .quote {
      margin-top: 48px;
      padding: 40px;
      border-left: 2px solid var(--accent);
      background: var(--surface);
    }
    .quote__text {
      font-family: 'Libre Baskerville', serif;
      font-size: clamp(1.2rem, 2.5vw, 1.8rem);
      font-style: italic;
      margin-bottom: 24px;
      color: var(--text);
      line-height: 1.5;
      font-weight: 400;
    }
    .quote__author {
      font-size: 0.9rem;
      color: var(--text-muted);
      font-weight: 500;
      font-style: normal;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* === Table === */
    .table-container {
      overflow-x: auto;
      margin-top: 32px;
      border: 1px solid var(--border);
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.9rem;
      font-weight: 300;
    }
    .data-table th {
      background: var(--surface);
      color: var(--text);
      font-weight: 600;
      padding: 16px 20px;
      text-align: left;
      border-bottom: 1px solid var(--border);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-size: 0.8rem;
    }
    .data-table td {
      padding: 16px 20px;
      border-bottom: 1px solid var(--border);
      color: var(--text-muted);
    }
    .data-table tr:last-child td {
      border-bottom: none;
    }
    .data-table tr:hover {
      background: rgba(255,255,255,0.02);
    }

    /* === Charts === */
    .chart-container {
      margin-top: 32px;
      text-align: center;
    }
    .chart {
      max-width: 100%;
      height: auto;
    }
    .chart-placeholder {
      background: var(--surface);
      border: 1px solid var(--border);
      padding: 60px;
      text-align: center;
      color: var(--text-muted);
      font-weight: 300;
    }

    /* === Image Text === */
    .image-text {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 48px;
      align-items: center;
      margin-top: 32px;
    }
    .image-container {
      text-align: center;
    }
    .slide-image {
      max-width: 100%;
      height: auto;
      border: 1px solid var(--border);
    }
    .text-container p {
      margin-bottom: 16px;
      font-size: 1rem;
      line-height: 1.7;
      color: var(--text-muted);
      font-weight: 300;
    }

    /* === Progress Bar === */
    .progress {
      position: fixed;
      top: 0;
      left: 0;
      height: 2px;
      background: var(--accent);
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
      gap: 16px;
      z-index: 100;
    }
    .nav-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--border);
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      padding: 0;
    }
    .nav-dot--active {
      background: var(--accent);
      transform: scale(1.5);
    }

    /* === Slide Counter === */
    .slide-counter {
      position: fixed;
      bottom: 24px;
      left: 24px;
      font-size: 0.8rem;
      color: var(--text-subtle);
      z-index: 100;
      font-weight: 500;
      font-family: 'Libre Baskerville', serif;
    }

    /* === Animations === */
    @keyframes minimalistFadeIn {
      to { opacity: 1; transform: translateY(0); }
    }

    /* === Responsive === */
    @media (max-width: 768px) {
      .slide { padding: 40px 24px; }
      .two-column, .image-text { grid-template-columns: 1fr; gap: 32px; }
      .nav-dots { right: 12px; gap: 12px; }
      .nav-dot { width: 6px; height: 6px; }
      .stats-grid { grid-template-columns: 1fr; }
      .title-meta { flex-direction: column; gap: 16px; }
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
        color: black !important;
      }
      .progress, .nav-dots, .slide-counter { display: none; }
      .slide__content { opacity: 1; transform: none; animation: none; }
      h1, h2 { color: black !important; }
      .slide__bullets li, .column p, .text-container p { color: #333 !important; }
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
</body>
</html>`;
}

// Default configuration for investor updates
generateInvestorUpdate.defaults = {
  companyName: 'Acme Corp',
  accentColor: '#ffffff',
  slides: [
    { 
      title: 'Acme Corp', 
      content: 'Q4 2024 Investor Update',
      type: 'title'
    },
    { 
      title: 'Key Metrics', 
      content: '',
      type: 'stats',
      data: [
        { value: '$3.2M', label: 'ARR', change: '+42%' },
        { value: '850', label: 'Customers', change: '+125' },
        { value: '$47K', label: 'ACV', change: '+18%' },
        { value: '92%', label: 'Net Retention', change: '+3%' }
      ]
    },
    { 
      title: 'Revenue Growth', 
      content: '',
      type: 'line-chart',
      data: [
        { label: 'Q1', value: 1800 },
        { label: 'Q2', value: 2200 },
        { label: 'Q3', value: 2800 },
        { label: 'Q4', value: 3200 }
      ]
    },
    { 
      title: 'Financial Summary', 
      content: '',
      type: 'table',
      data: [
        { Metric: 'Revenue', 'Q3 2024': '$2.8M', 'Q4 2024': '$3.2M', Change: '+14%' },
        { Metric: 'Gross Margin', 'Q3 2024': '78%', 'Q4 2024': '81%', Change: '+3pp' },
        { Metric: 'Cash Burn', 'Q3 2024': '$480K', 'Q4 2024': '$520K', Change: '+8%' },
        { Metric: 'Runway', 'Q3 2024': '18 months', 'Q4 2024': '16 months', Change: '-2m' }
      ]
    },
    { 
      title: 'Key Achievements', 
      content: 'Closed Series A funding round of $8M\nExpanded to European market with first 50 customers\nLaunched enterprise tier with 95% gross margins\nGrew engineering team from 8 to 14 people\nAchieved SOC 2 Type II certification',
      type: 'bullets'
    },
    { 
      title: 'Next Quarter Focus', 
      content: 'Product Development\nShip multi-tenant architecture\nLaunch mobile app beta\nExpand AI capabilities\n---\nGo-to-Market\nHire VP of Sales\nScale customer success team\nExpand partner channel',
      type: 'two-column'
    }
  ]
};