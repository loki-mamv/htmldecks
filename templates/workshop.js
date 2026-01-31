/**
 * HTML Decks — Workshop Template Generator
 * 
 * Colorful friendly design with teal + blue + pink accents on white/light background.
 * Designed for teaching, workshops, tutorials, and educational presentations.
 * 
 * @param {Object} config
 * @param {string} config.companyName
 * @param {string} config.accentColor
 * @param {Array<{title: string, content: string, type?: string, data?: any}>} config.slides
 * @returns {string} Complete standalone HTML document
 */
function generateWorkshop({ companyName, accentColor, slides }) {
  const slideCount = slides.length;

  const generateChart = (type, data) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return '<div class="chart-placeholder">No data available</div>';
    }

    const colors = ['#46D19A', '#4A9FF5', '#E14A8B', '#F59E0B', '#8B5CF6'];
    
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
                      fill="${colors[i % colors.length]}" rx="6"/>
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
                <stop offset="100%" stop-color="${colors[1]}"/>
              </linearGradient>
            </defs>
            <polyline points="${points}" fill="none" stroke="url(#lineGradient)" stroke-width="3" stroke-linecap="round"/>
            ${data.map((d, i) => {
              const x = 50 + i * stepX;
              const y = lineMax > 0 ? 170 - (d.value / lineMax) * 120 : 170;
              return `
                <circle cx="${x}" cy="${y}" r="5" fill="${colors[i % colors.length]}"/>
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
          <div class="slide__decorations">
            <div class="decoration-shape decoration-shape--1"></div>
            <div class="decoration-shape decoration-shape--2"></div>
            <div class="decoration-shape decoration-shape--3"></div>
          </div>
          <div class="slide__content">
            <div class="workshop-badge">📚 WORKSHOP</div>
            <h1>${slide.title}</h1>
            <p class="slide__subtitle">${slide.subtitle || ''}</p>
            <div class="slide__instructor">${companyName}</div>
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
                <div class="stat-card" style="--delay: ${idx * 0.1}s; --color: ${colors[idx % colors.length]}">
                  <div class="stat-icon">${stat.icon || '📊'}</div>
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
        
        const headers = tableData[0] || [];
        return `
        <section class="slide slide--table" data-index="${i}">
          <div class="slide__content">
            <h2>${slide.title}</h2>
            <div class="table-container">
              <table class="data-table">
                <thead>
                  <tr>${headerRow.map(h => `<th>${h}</th>`).join('')}</tr>
                </thead>
                <tbody>
                  ${tableData.slice(1).map(row => `<tr>${row.map(cell => `<td>${cell || ''}</td>`).join('')}</tr>`).join('')}
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
              ${generateChart(type, slide.series ? slide.series[0]?.data : slide.segments)}
            </div>
          </div>
        </section>`;

      case 'image-text':
        const imageUrl = slide.imageUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGOUZGIiBzdHJva2U9IiNEMUVCRkYiLz4KPGNpcmNsZSBjeD0iMjAwIiBjeT0iMTUwIiByPSI0MCIgZmlsbD0iIzQ2RDE5QSIgZmlsbC1vcGFjaXR5PSIwLjIiLz4KPHN2ZyB4PSIxODAiIHk9IjEzMCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIj4KPHN2ZyB4PSIxMCIgeT0iMTAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iIzQ2RDE5QSI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcng9IjIiLz4KPC9zdmc+CjwvcHN2Zz4KPHN2ZyB4PSIxNzAiIHk9IjIwMCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjE2Ij4KPHN2ZyB4PSIxMCIgeT0iNCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjgiIGZpbGw9IiM2QjczODAiIGZvbnQtZmFtaWx5PSJzeXN0ZW0tdWkiIGZvbnQtc2l6ZT0iMTAiPgo8dGV4dCB4PSIwIiB5PSI4Ij5XcmtTaG9wPC90ZXh0Pgo8L3N2Zz4KPC9zdmc+CjwvcHN2Zz4KPC9zdmc+';
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
  <title>${slides[0]?.title || companyName} — Workshop</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&family=Nunito+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    /* === Reset === */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    
    :root {
      --accent: ${accentColor};
      --primary: #46D19A;
      --secondary: #4A9FF5;
      --tertiary: #E14A8B;
      --warning: #F59E0B;
      --purple: #8B5CF6;
      --bg: #FFFFFF;
      --bg-alt: #F8FCFF;
      --bg-accent: #F0FDF9;
      --text: #1F2937;
      --text-muted: #6B7280;
      --text-light: #9CA3AF;
      --surface: #F3F9FF;
      --border: #E5E7EB;
      --shadow: rgba(70, 209, 154, 0.12);
    }

    html { scroll-snap-type: y mandatory; scroll-behavior: smooth; overflow-x: hidden; }
    body {
      font-family: 'Nunito Sans', sans-serif;
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
      animation: cheerfulSlideIn 0.6s ease-out forwards;
    }

    /* === Title Slide === */
    .slide--title {
      background: linear-gradient(135deg, var(--bg-accent) 0%, var(--surface) 100%);
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .slide__decorations {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
    .decoration-shape {
      position: absolute;
      border-radius: 50%;
      animation: gentleFloat 10s ease-in-out infinite;
    }
    .decoration-shape--1 {
      width: 100px;
      height: 100px;
      background: var(--primary);
      opacity: 0.1;
      top: 15%;
      right: 10%;
      animation-delay: 0s;
    }
    .decoration-shape--2 {
      width: 140px;
      height: 140px;
      background: var(--secondary);
      opacity: 0.08;
      bottom: 20%;
      left: 5%;
      animation-delay: 3s;
    }
    .decoration-shape--3 {
      width: 80px;
      height: 80px;
      background: var(--tertiary);
      opacity: 0.12;
      top: 40%;
      right: -40px;
      animation-delay: 6s;
    }
    .workshop-badge {
      display: inline-block;
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      color: white;
      border-radius: 25px;
      padding: 8px 20px;
      font-size: 0.85rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      margin-bottom: 24px;
      box-shadow: 0 4px 15px rgba(70, 209, 154, 0.3);
    }
    .slide--title h1 {
      font-family: 'Quicksand', sans-serif;
      font-size: clamp(2.5rem, 6vw, 4rem);
      font-weight: 700;
      margin-bottom: 20px;
      line-height: 1.1;
      color: var(--text);
    }
    .slide__subtitle {
      font-size: clamp(1.1rem, 2.5vw, 1.6rem);
      margin-bottom: 32px;
      color: var(--text-muted);
      font-weight: 400;
    }
    .slide__instructor {
      font-size: 1rem;
      font-weight: 600;
      color: var(--primary);
      letter-spacing: 0.05em;
    }

    /* === Content Slides === */
    .slide h2 {
      font-family: 'Quicksand', sans-serif;
      font-size: clamp(1.8rem, 4vw, 2.8rem);
      font-weight: 700;
      margin-bottom: 40px;
      position: relative;
      padding-bottom: 12px;
      color: var(--text);
    }
    .slide h2::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 60px;
      height: 4px;
      background: linear-gradient(90deg, var(--primary), var(--secondary));
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
      margin-bottom: 20px;
      color: var(--text);
    }
    .slide__bullets li::before {
      content: '✓';
      position: absolute;
      left: 0;
      top: 0;
      color: var(--primary);
      font-weight: 700;
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
      border-radius: 16px;
      text-align: center;
      box-shadow: 0 4px 20px var(--shadow);
      transition: all 0.3s ease;
      animation: cardPopIn 0.6s ease forwards;
      animation-delay: var(--delay, 0s);
      opacity: 0;
      transform: translateY(30px) scale(0.95);
      border: 2px solid transparent;
    }
    .stat-card:hover {
      transform: translateY(-6px) scale(1.02);
      box-shadow: 0 12px 35px var(--shadow);
      border-color: var(--color, var(--primary));
    }
    .stat-icon {
      font-size: 2.5rem;
      margin-bottom: 16px;
      display: block;
    }
    .stat-value {
      font-family: 'Quicksand', sans-serif;
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--color, var(--primary));
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
      background: linear-gradient(135deg, var(--bg-accent), var(--surface));
      border-radius: 20px;
      position: relative;
      border: 2px solid rgba(70, 209, 154, 0.1);
    }
    .quote::before {
      content: '💡';
      position: absolute;
      top: -15px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 2rem;
      background: var(--bg);
      padding: 0 10px;
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
      color: var(--primary);
      font-weight: 700;
      font-style: normal;
    }

    /* === Table === */
    .table-container {
      overflow-x: auto;
      margin-top: 20px;
      border-radius: 16px;
      box-shadow: 0 4px 20px var(--shadow);
      border: 2px solid rgba(70, 209, 154, 0.1);
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.95rem;
    }
    .data-table th {
      background: linear-gradient(135deg, var(--primary), var(--secondary));
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
      background: var(--bg-accent);
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
      border: 3px solid transparent;
      background: linear-gradient(white, white) padding-box, linear-gradient(135deg, var(--primary), var(--secondary)) border-box;
    }
    .slide-image:hover {
      transform: scale(1.02) rotate(-1deg);
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
      background: linear-gradient(90deg, var(--primary), var(--secondary));
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
      background: rgba(70, 209, 154, 0.3);
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      padding: 0;
    }
    .nav-dot--active {
      background: var(--primary);
      transform: scale(1.3);
      box-shadow: 0 2px 8px rgba(70, 209, 154, 0.4);
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
    @keyframes cheerfulSlideIn {
      0% { opacity: 0; transform: translateY(20px) scale(0.98); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes cardPopIn {
      0% { opacity: 0; transform: translateY(30px) scale(0.95); }
      50% { transform: translateY(-5px) scale(1.02); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes gentleFloat {
      0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
      50% { transform: translateY(-20px) rotate(10deg); opacity: 1; }
    }

    /* === Responsive === */
    @media (max-width: 768px) {
      .slide { padding: 40px 24px; }
      .two-column, .image-text { grid-template-columns: 1fr; gap: 24px; }
      .nav-dots { right: 12px; gap: 8px; }
      .nav-dot { width: 10px; height: 10px; }
      .stats-grid { grid-template-columns: 1fr; }
      .decoration-shape { display: none; }
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
</body>
</html>`;
}

// Default configuration for workshops
generateWorkshop.defaults = {
  companyName: 'Sarah Johnson',
  accentColor: '#46D19A',
  slides: [
    { 
      type: 'title',
      title: 'Building Better APIs', 
      subtitle: 'A hands-on workshop for modern web developers'
    },
    { 
      type: 'bullets',
      title: 'What You\'ll Learn Today', 
      content: 'RESTful API design principles that scale\nAuthentication and authorization patterns\nAPI documentation that developers actually use\nTesting strategies for reliable endpoints\nPerformance optimization techniques'
    },
    { 
      type: 'two-column',
      title: 'Theory vs Practice', 
      leftColumn: 'Why APIs Matter\nAPIs are the backbone of modern applications. Good API design makes your entire system more maintainable, your developers happier, and your users\' experience smoother.',
      rightColumn: 'What We\'ll Build\nTogether, we\'ll build a real-world API for a task management system. You\'ll see every concept applied to actual code.'
    },
    { 
      type: 'table',
      title: 'Workshop Schedule', 
      tableData: [
        ['Time', 'Topic', 'Format'],
        ['9:00-9:30', 'Welcome & Setup', 'Intro'],
        ['9:30-10:30', 'API Design Principles', 'Lecture + Q&A'],
        ['10:30-11:30', 'Hands-on: Building Endpoints', 'Code Along'],
        ['11:30-12:30', 'Authentication & Security', 'Workshop'],
        ['1:30-2:30', 'Testing & Documentation', 'Practice'],
        ['2:30-3:00', 'Wrap-up & Next Steps', 'Discussion']
      ]
    },
    { 
      type: 'quote',
      quote: 'This workshop completely changed how I approach API design. The hands-on format made complex concepts click instantly.',
      attribution: 'Alex Chen, Senior Developer at TechCorp'
    },
    { 
      type: 'bullets',
      title: 'Ready to Get Started?', 
      content: '💻 Make sure you have Node.js installed\n📝 Clone the starter repo from GitHub\n☕ Grab some coffee – we\'re diving in!\n❓ Questions? Just ask anytime during the workshop'
    }
  ]
};