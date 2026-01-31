/**
 * HTML Decks — Team Introduction Template Generator
 * 
 * Warm tones (orange/coral), friendly and approachable design.
 * Designed for team pages, company culture presentations, and introductions.
 * 
 * @param {Object} config
 * @param {string} config.companyName
 * @param {string} config.accentColor
 * @param {Array<{title: string, content: string, type?: string, data?: any}>} config.slides
 * @returns {string} Complete standalone HTML document
 */
function generateTeamIntro({ companyName, accentColor, slides }) {
  const slideCount = slides.length;

  const generateChart = (type, data) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return '<div class="chart-placeholder">No data available</div>';
    }

    const colors = ['#F5A623', '#E8785E', '#FF9F43', '#E17055', '#FDCB6E'];
    
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
          <div class="slide__decoration">
            <div class="decoration-circle decoration-circle--1"></div>
            <div class="decoration-circle decoration-circle--2"></div>
            <div class="decoration-circle decoration-circle--3"></div>
          </div>
          <div class="slide__content">
            <h1>${slide.title}</h1>
            <p class="slide__subtitle">${slide.subtitle || ''}</p>
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
                <div class="stat-card" style="--delay: ${idx * 0.15}s">
                  <div class="stat-icon">${stat.icon || '👥'}</div>
                  <div class="stat-value">${stat.number || stat.value || ''}</div>
                  <div class="stat-label">${stat.label}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </section>`;

      case 'two-column':
        const leftColumn = slide.leftColumn || '';
        const rightColumn = slide.rightColumn || '';
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
        const quoteText = slide.quote || '';
        const attribution = slide.attribution || '';
        return `
        <section class="slide slide--quote" data-index="${i}">
          <div class="slide__content">
            <h2>${slide.title}</h2>
            <blockquote class="quote">
              <p class="quote__text">"${quoteText}"</p>
              <cite class="quote__author">— ${attribution}</cite>
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

      case 'image-text':
        const imageUrl = slide.imageUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRkJGQkZCIiBzdHJva2U9IiNFNUU3RUIiLz4KPGNpcmNsZSBjeD0iMjAwIiBjeT0iMTUwIiByPSI0MCIgZmlsbD0iI0ZFRENCNiIgc3Ryb2tlPSIjRjVBNjIzIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjIwIiBmb250LWZhbWlseT0ic3lzdGVtLXVpIiBmb250LXNpemU9IjE2IiBmaWxsPSIjNkI3MjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5UZWFtIFBob3RvIFBsYWNlaG9sZGVyPC90ZXh0Pgo8L3N2Zz4=';
        return `
        <section class="slide slide--image-text" data-index="${i}">
          <div class="slide__content">
            <h2>${slide.title}</h2>
            <div class="image-text">
              <div class="image-container">
                <img src="${imageUrl}" alt="${slide.title}" class="slide-image" />
              </div>
              <div class="text-container">
                ${(slide.description || '').split('\n').filter(line => line.trim()).map(line => `<p>${line.replace(/^[-•]\s*/, '')}</p>`).join('')}
              </div>
            </div>
          </div>
        </section>`;

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
  <title>${slides[0]?.title || companyName} — Team Introduction</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    /* === Reset === */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    
    :root {
      --accent: ${accentColor};
      --warm-1: #F5A623;
      --warm-2: #E8785E;
      --warm-3: #FDCB6E;
      --bg: #FFF9F5;
      --bg-alt: #FFFFFF;
      --text: #2D3748;
      --text-muted: #718096;
      --text-light: #A0AEC0;
      --surface: #FFF5E6;
      --border: #F7D794;
      --shadow: rgba(245, 166, 35, 0.15);
    }

    html { scroll-snap-type: y mandatory; scroll-behavior: smooth; overflow-x: hidden; }
    body {
      font-family: 'Nunito', sans-serif;
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
      transform: translateY(25px);
      animation: warmSlideIn 0.7s ease-out forwards;
    }

    /* === Title Slide === */
    .slide--title {
      background: linear-gradient(135deg, var(--warm-1) 0%, var(--warm-2) 100%);
      color: white;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .slide__decoration {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
    .decoration-circle {
      position: absolute;
      border-radius: 50%;
      background: rgba(255,255,255,0.1);
      animation: float 8s ease-in-out infinite;
    }
    .decoration-circle--1 {
      width: 120px;
      height: 120px;
      top: 10%;
      right: 15%;
      animation-delay: 0s;
    }
    .decoration-circle--2 {
      width: 80px;
      height: 80px;
      bottom: 20%;
      left: 10%;
      animation-delay: 2s;
    }
    .decoration-circle--3 {
      width: 150px;
      height: 150px;
      top: 60%;
      right: -75px;
      animation-delay: 4s;
    }
    .slide--title h1 {
      font-size: clamp(2.5rem, 6vw, 4rem);
      font-weight: 800;
      margin-bottom: 20px;
      line-height: 1.1;
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
      font-size: 1rem;
      font-weight: 600;
      opacity: 0.8;
      letter-spacing: 0.05em;
      position: relative;
      z-index: 2;
    }

    /* === Content Slides === */
    .slide h2 {
      font-size: clamp(1.8rem, 4vw, 2.8rem);
      font-weight: 700;
      margin-bottom: 40px;
      position: relative;
      padding-bottom: 12px;
      color: var(--warm-1);
    }
    .slide h2::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 70px;
      height: 4px;
      background: linear-gradient(90deg, var(--warm-1), var(--warm-2));
      border-radius: 2px;
    }

    /* === Bullets === */
    .slide__bullets {
      list-style: none;
      font-size: clamp(1rem, 2.2vw, 1.3rem);
      line-height: 1.8;
    }
    .slide__bullets li {
      padding-left: 36px;
      position: relative;
      margin-bottom: 18px;
      color: var(--text);
    }
    .slide__bullets li::before {
      content: '🌟';
      position: absolute;
      left: 0;
      top: 0;
      font-size: 1.2em;
    }

    /* === Stats Grid === */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 24px;
      margin-top: 20px;
    }
    .stat-card {
      background: var(--surface);
      padding: 32px 24px;
      border-radius: 20px;
      text-align: center;
      box-shadow: 0 4px 20px var(--shadow);
      transition: all 0.3s ease;
      animation: statBounceIn 0.6s ease forwards;
      animation-delay: var(--delay, 0s);
      opacity: 0;
      transform: translateY(30px) scale(0.9);
    }
    .stat-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 12px 30px var(--shadow);
    }
    .stat-icon {
      font-size: 2.5rem;
      margin-bottom: 16px;
      display: block;
    }
    .stat-value {
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--warm-1);
      margin-bottom: 8px;
      line-height: 1;
    }
    .stat-label {
      font-size: 1rem;
      color: var(--text-muted);
      font-weight: 600;
    }

    /* === Two Column === */
    .two-column {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 48px;
      margin-top: 20px;
    }
    .column p {
      margin-bottom: 18px;
      font-size: 1.1rem;
      line-height: 1.7;
      color: var(--text);
    }

    /* === Quote === */
    .quote {
      text-align: center;
      margin-top: 40px;
      padding: 40px;
      background: var(--surface);
      border-radius: 20px;
      position: relative;
    }
    .quote::before {
      content: '';
      position: absolute;
      top: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 20px;
      height: 20px;
      background: var(--warm-1);
      border-radius: 50%;
    }
    .quote__text {
      font-size: clamp(1.3rem, 3vw, 2rem);
      font-style: italic;
      margin-bottom: 24px;
      color: var(--text);
      line-height: 1.4;
      font-weight: 500;
    }
    .quote__author {
      font-size: 1.1rem;
      color: var(--warm-1);
      font-weight: 700;
      font-style: normal;
    }

    /* === Table === */
    .table-container {
      overflow-x: auto;
      margin-top: 20px;
      border-radius: 16px;
      box-shadow: 0 4px 20px var(--shadow);
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.95rem;
    }
    .data-table th {
      background: var(--warm-1);
      color: white;
      font-weight: 700;
      padding: 18px 20px;
      text-align: left;
    }
    .data-table td {
      padding: 16px 20px;
      border-bottom: 1px solid var(--border);
      background: white;
    }
    .data-table tr:nth-child(even) td {
      background: var(--surface);
    }
    .data-table tr:hover td {
      background: rgba(245, 166, 35, 0.1);
    }

    /* === Charts === */
    .chart-container {
      margin-top: 20px;
      text-align: center;
    }
    .chart {
      max-width: 100%;
      height: auto;
      filter: drop-shadow(0 4px 12px var(--shadow));
    }
    .chart-placeholder {
      background: var(--surface);
      border: 2px dashed var(--border);
      border-radius: 16px;
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
      border-radius: 16px;
      box-shadow: 0 8px 30px var(--shadow);
      transition: transform 0.3s ease;
    }
    .slide-image:hover {
      transform: scale(1.02) rotate(1deg);
    }
    .text-container p {
      margin-bottom: 18px;
      font-size: 1.1rem;
      line-height: 1.7;
    }

    /* === Progress Bar === */
    .progress {
      position: fixed;
      top: 0;
      left: 0;
      height: 4px;
      background: linear-gradient(90deg, var(--warm-1), var(--warm-2));
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
      background: rgba(245, 166, 35, 0.3);
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      padding: 0;
    }
    .nav-dot--active {
      background: var(--warm-1);
      transform: scale(1.3);
      box-shadow: 0 2px 8px rgba(245, 166, 35, 0.4);
    }

    /* === Slide Counter === */
    .slide-counter {
      position: fixed;
      bottom: 24px;
      left: 24px;
      font-size: 0.9rem;
      color: var(--text-muted);
      z-index: 100;
      font-weight: 600;
    }

    /* === Animations === */
    @keyframes warmSlideIn {
      0% { opacity: 0; transform: translateY(25px) scale(0.98); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes statBounceIn {
      0% { opacity: 0; transform: translateY(30px) scale(0.9); }
      50% { transform: translateY(-5px) scale(1.05); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
      33% { transform: translateY(-15px) rotate(5deg); opacity: 0.9; }
      66% { transform: translateY(10px) rotate(-3deg); opacity: 0.8; }
    }

    /* === Responsive === */
    @media (max-width: 768px) {
      .slide { padding: 40px 24px; }
      .two-column, .image-text { grid-template-columns: 1fr; gap: 24px; }
      .nav-dots { right: 12px; gap: 8px; }
      .nav-dot { width: 10px; height: 10px; }
      .stats-grid { grid-template-columns: 1fr; }
      .decoration-circle { display: none; }
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
        background: linear-gradient(135deg, var(--warm-1), var(--warm-2)) !important;
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
  <div style="position: fixed; bottom: 16px; right: 16px; z-index: 9999; font-size: 18px; font-weight: 600; color: rgba(245, 166, 35, 0.7); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; pointer-events: none;">
    <a href="https://htmldecks.com" target="_blank" style="color: inherit; text-decoration: none; pointer-events: auto;">Made with HTML Decks</a>
  </div>` : ''}
</body>
</html>`;
}

// Default configuration for team introductions
generateTeamIntro.defaults = {
  companyName: 'Acme Team',
  accentColor: '#F5A623',
  slides: [
    { 
      type: 'title',
      title: 'Meet the Acme Team', 
      subtitle: 'The people behind the magic'
    },
    { 
      type: 'image-text',
      title: 'Our Founder\'s Story', 
      description: 'Sarah started Acme in her garage with a simple belief: great software should feel effortless to use. After 15 years building products at Google and Airbnb, she knew exactly what teams needed.\n\nToday, Sarah leads our product vision while still writing code every week. She believes the best leaders stay close to the work.',
      imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=300&fit=crop&crop=face',
      layout: 'image-left'
    },
    { 
      type: 'stats',
      title: 'Our Team in Numbers', 
      metrics: [
        { number: '18', label: 'Team Members' },
        { number: '8', label: 'Countries' },
        { number: '12', label: 'Languages Spoken' },
        { number: '47', label: 'Cups of Coffee/Day' }
      ]
    },
    { 
      type: 'two-column',
      title: 'What Makes Us Different', 
      leftColumn: 'Remote-first culture since day one\nWe hire for curiosity, not just credentials\nEveryone ships code, even our designers\n15% time for passion projects',
      rightColumn: 'No meetings Wednesdays\nAsynchronous by default, meetings by exception\nRadical transparency in decision-making\nWe trust people to do their best work'
    },
    { 
      type: 'bullets',
      title: 'Team Values', 
      content: '🎯 Ship fast, learn faster\n🤝 Help first, compete second\n🧠 Curiosity over cleverness\n✨ Simple solutions win\n🌱 Growth mindset always'
    },
    { 
      type: 'quote',
      quote: 'This is the most talented and kind group of people I\'ve ever worked with. We challenge each other to be better every day.',
      attribution: 'Alex Chen, Senior Engineer'
    }
  ]
};