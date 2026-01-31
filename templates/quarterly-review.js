/**
 * HTML Decks — Quarterly Review Template Generator
 * 
 * Green/teal gradient theme with professional, data-heavy feel.
 * Designed for business reviews, board updates, and performance reporting.
 * 
 * @param {Object} config
 * @param {string} config.companyName
 * @param {string} config.accentColor
 * @param {Array<{title: string, content: string, type?: string, data?: any}>} config.slides
 * @returns {string} Complete standalone HTML document
 */
function generateQuarterlyReview({ companyName, accentColor, slides }) {
  const slideCount = slides.length;

  const generateChart = (type, data) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return '<div class="chart-placeholder">No data available</div>';
    }

    const colors = ['#38B584', '#2DD4AA', '#4FD1C7', '#22C55E', '#16A34A'];
    
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
                      fill="${colors[i % colors.length]}" rx="2"/>
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
            <polyline points="${points}" fill="none" stroke="${colors[0]}" stroke-width="3" stroke-linecap="round"/>
            ${data.map((d, i) => {
              const x = 50 + i * stepX;
              const y = lineMax > 0 ? 170 - (d.value / lineMax) * 120 : 170;
              return `
                <circle cx="${x}" cy="${y}" r="4" fill="${colors[0]}"/>
                <text x="${x}" y="185" text-anchor="middle" fill="currentColor" font-size="12">${d.label}</text>
                <text x="${x}" y="${y - 10}" text-anchor="middle" fill="currentColor" font-size="11" font-weight="600">${d.value}</text>
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
          <div class="slide__accent-bg"></div>
          <div class="slide__content">
            <h1>${slide.title}</h1>
            <p class="slide__subtitle">${slide.subtitle || ''}</p>
            ${slide.badge ? `<div class="slide__badge">${slide.badge}</div>` : ''}
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
              ${stats.map(stat => `
                <div class="stat-card">
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
  <title>${slides[0]?.title || companyName} — Quarterly Review</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    /* === Reset === */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    
    :root {
      --accent: ${accentColor};
      --gradient-start: #38B584;
      --gradient-end: #1A8A6A;
      --bg: #FFFFFF;
      --bg-alt: #F8FFFE;
      --surface: #F0F9F7;
      --text: #0A2A1F;
      --text-muted: #4A6B5A;
      --border: #C7E6D9;
      --success: #22C55E;
      --warning: #F59E0B;
      --danger: #EF4444;
    }

    html { scroll-snap-type: y mandatory; scroll-behavior: smooth; overflow-x: hidden; }
    body {
      font-family: 'DM Sans', sans-serif;
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
      transform: translateY(20px);
      animation: slideIn 0.6s ease forwards;
    }

    /* === Title Slide === */
    .slide--title {
      background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
      color: white;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .slide__accent-bg {
      position: absolute;
      top: -50%;
      right: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
      animation: rotate 20s linear infinite;
    }
    .slide--title h1 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: clamp(2.5rem, 6vw, 4rem);
      font-weight: 700;
      margin-bottom: 16px;
      position: relative;
      z-index: 2;
    }
    .slide__subtitle {
      font-size: clamp(1.1rem, 2.5vw, 1.6rem);
      margin-bottom: 32px;
      opacity: 0.9;
      font-weight: 400;
      position: relative;
      z-index: 2;
    }
    .slide__brand {
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      font-weight: 600;
      opacity: 0.8;
      position: relative;
      z-index: 2;
    }

    /* === Content Slides === */
    .slide h2 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: clamp(1.8rem, 4vw, 2.8rem);
      font-weight: 600;
      margin-bottom: 40px;
      position: relative;
      padding-bottom: 12px;
    }
    .slide h2::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 60px;
      height: 4px;
      background: linear-gradient(90deg, var(--accent), var(--gradient-start));
      border-radius: 2px;
    }

    /* === Bullets === */
    .slide__bullets {
      list-style: none;
      font-size: clamp(1rem, 2.2vw, 1.4rem);
      line-height: 1.7;
    }
    .slide__bullets li {
      padding-left: 32px;
      position: relative;
      margin-bottom: 16px;
      color: var(--text);
    }
    .slide__bullets li::before {
      content: '';
      position: absolute;
      left: 0;
      top: 12px;
      width: 12px;
      height: 12px;
      background: var(--accent);
      border-radius: 50%;
    }

    /* === Stats Grid === */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
      margin-top: 20px;
    }
    .stat-card {
      background: var(--surface);
      padding: 24px;
      border-radius: 12px;
      text-align: center;
      border: 2px solid var(--border);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(56, 181, 132, 0.15);
    }
    .stat-value {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--accent);
      margin-bottom: 8px;
    }
    .stat-label {
      font-size: 0.9rem;
      color: var(--text-muted);
      font-weight: 500;
      margin-bottom: 4px;
    }
    .stat-change {
      font-size: 0.8rem;
      font-weight: 600;
    }
    .stat-change.positive { color: var(--success); }
    .stat-change.negative { color: var(--danger); }

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
      font-size: clamp(1.3rem, 3vw, 2.2rem);
      font-style: italic;
      margin-bottom: 24px;
      color: var(--text);
      line-height: 1.4;
      position: relative;
    }
    .quote__text::before {
      content: '"';
      font-size: 4rem;
      color: var(--accent);
      position: absolute;
      left: -40px;
      top: -20px;
      font-family: serif;
    }
    .quote__author {
      font-size: 1rem;
      color: var(--text-muted);
      font-weight: 500;
      font-style: normal;
    }

    /* === Table === */
    .table-container {
      overflow-x: auto;
      margin-top: 20px;
      border-radius: 8px;
      border: 2px solid var(--border);
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.95rem;
    }
    .data-table th {
      background: var(--surface);
      color: var(--text);
      font-weight: 600;
      padding: 16px 20px;
      text-align: left;
      border-bottom: 2px solid var(--border);
    }
    .data-table td {
      padding: 14px 20px;
      border-bottom: 1px solid var(--border);
    }
    .data-table tr:hover {
      background: var(--bg-alt);
    }

    /* === Charts === */
    .chart-container {
      margin-top: 20px;
      text-align: center;
    }
    .chart {
      max-width: 100%;
      height: auto;
    }
    .chart-placeholder {
      background: var(--surface);
      border: 2px dashed var(--border);
      border-radius: 8px;
      padding: 40px;
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
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
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
      background: linear-gradient(90deg, var(--accent), var(--gradient-start));
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
      background: rgba(56, 181, 132, 0.3);
      border: none;
      cursor: pointer;
      transition: all 0.3s;
      padding: 0;
    }
    .nav-dot--active {
      background: var(--accent);
      transform: scale(1.2);
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
    @keyframes slideIn {
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes rotate {
      to { transform: rotate(360deg); }
    }

    /* === Responsive === */
    @media (max-width: 768px) {
      .slide { padding: 40px 24px; }
      .two-column, .image-text { grid-template-columns: 1fr; gap: 24px; }
      .nav-dots { right: 12px; gap: 8px; }
      .nav-dot { width: 10px; height: 10px; }
      .stats-grid { grid-template-columns: 1fr; }
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
      .slide--title { background: var(--gradient-start) !important; }
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
  <div style="position: fixed; bottom: 16px; right: 16px; z-index: 9999; font-size: 18px; font-weight: 600; color: rgba(56, 181, 132, 0.7); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; pointer-events: none;">
    <a href="https://htmldecks.com" target="_blank" style="color: inherit; text-decoration: none; pointer-events: auto;">Made with HTML Decks</a>
  </div>` : ''}
</body>
</html>`;
}

// Default configuration for quarterly reviews
generateQuarterlyReview.defaults = {
  companyName: 'Acme Corp',
  accentColor: '#38B584',
  slides: [
    { 
      type: 'title',
      title: 'Q4 2024 Business Review', 
      subtitle: 'Performance summary and strategic outlook'
    },
    { 
      type: 'stats',
      title: 'Key Metrics', 
      metrics: [
        { number: '$2.4M', label: 'Revenue' },
        { number: '45%', label: 'Growth Rate' },
        { number: '1,240', label: 'Customers' },
        { number: '94%', label: 'Retention' }
      ]
    },
    { 
      type: 'bar-chart',
      title: 'Revenue Trend', 
      series: [{
        name: 'Revenue',
        data: [
          { label: 'Q1', value: 1600 },
          { label: 'Q2', value: 1850 },
          { label: 'Q3', value: 2100 },
          { label: 'Q4', value: 2400 }
        ]
      }]
    },
    { 
      type: 'line-chart',
      title: 'Growth Trajectory', 
      series: [{
        name: 'Growth',
        data: [
          { x: 'Jan', y: 800 },
          { x: 'Mar', y: 1200 },
          { x: 'Jun', y: 1600 },
          { x: 'Sep', y: 2000 },
          { x: 'Dec', y: 2400 }
        ]
      }]
    },
    { 
      type: 'bullets',
      title: 'Key Achievements', 
      content: 'Exceeded revenue targets by 15%\nLaunched 3 major product features\nExpanded to 2 new markets\nGrew team from 12 to 18 people'
    },
    { 
      type: 'two-column',
      title: 'Performance Analysis', 
      leftColumn: 'Strong Growth\nRevenue up 23% from last quarter\nCustomer acquisition accelerated\nProduct-market fit validated',
      rightColumn: 'Challenges\nCash burn higher than projected\nHiring took longer than expected\nSome enterprise deals pushed to Q1'
    }
  ]
};