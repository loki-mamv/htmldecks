/**
 * HTML Decks — Brutalist Template Generator
 * 
 * Raw, bold, unconventional design with thick borders and oversized typography.
 * Perfect for attention-grabbing presentations and unconventional approaches.
 * 
 * @param {Object} config
 * @param {string} config.companyName
 * @param {string} config.accentColor
 * @param {Array<{title: string, content: string}>} config.slides
 * @param {boolean} config.watermark
 * @returns {string} Complete standalone HTML document
 */
function generateBrutalist({ companyName, accentColor, slides, watermark }) {
  const slideCount = slides.length;

  const chartColors = ['#ff0000', '#000000', '#333333', '#666666', '#999999'];

  const slidesHTML = slides.map((slide, i) => {
    switch (slide.type) {
      case 'title':
        return `
      <section class="slide slide--title" data-index="${i}">
        <div class="slide__content">
          <h1>${slide.title.toUpperCase()}</h1>
          ${slide.subtitle ? `<p class="slide__subtitle">${slide.subtitle}</p>` : ''}
          ${slide.badge ? `<div class="slide__badge">${slide.badge.toUpperCase()}</div>` : ''}
          <div class="slide__company-block">
            <p class="slide__company">${companyName.toUpperCase()}</p>
          </div>
        </div>
      </section>`;

      case 'bullets':
        const bullets = slide.content
          .split('\n')
          .filter(line => line.trim())
          .map(line => `<li>${line.replace(/^[-•]\s*/, '').toUpperCase()}</li>`)
          .join('\n              ');
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <h2>${slide.title.toUpperCase()}</h2>
          <div class="slide__content-block">
            <ul class="slide__bullets">
              ${bullets}
            </ul>
          </div>
        </div>
      </section>`;

      case 'two-column':
        const leftBullets = slide.leftColumn
          .split('\n')
          .filter(line => line.trim())
          .map(line => `<li>${line.replace(/^[-•]\s*/, '').toUpperCase()}</li>`)
          .join('\n              ');
        const rightBullets = slide.rightColumn
          .split('\n')
          .filter(line => line.trim())
          .map(line => `<li>${line.replace(/^[-•]\s*/, '').toUpperCase()}</li>`)
          .join('\n              ');
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <h2>${slide.title.toUpperCase()}</h2>
          <div class="slide__two-column">
            <div class="slide__column-block">
              <ul class="slide__bullets">
                ${leftBullets}
              </ul>
            </div>
            <div class="slide__column-block">
              <ul class="slide__bullets">
                ${rightBullets}
              </ul>
            </div>
          </div>
        </div>
      </section>`;

      case 'stats':
        const statsHTML = slide.metrics.map(metric => `
          <div class="slide__stat-block">
            <div class="slide__stat-number">${metric.number}</div>
            <div class="slide__stat-label">${metric.label.toUpperCase()}</div>
          </div>
        `).join('');
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <h2>${slide.title.toUpperCase()}</h2>
          <div class="slide__stats">
            ${statsHTML}
          </div>
        </div>
      </section>`;

      case 'quote':
        return `
      <section class="slide slide--quote" data-index="${i}">
        <div class="slide__content">
          <div class="slide__quote-block">
            <blockquote class="slide__quote">
              "${slide.quote.toUpperCase()}"
            </blockquote>
            <cite class="slide__attribution">— ${slide.attribution.toUpperCase()}</cite>
          </div>
        </div>
      </section>`;

      case 'table':
        const tableHTML = slide.tableData.map((row, rowIndex) => {
          const tag = rowIndex === 0 ? 'th' : 'td';
          const cells = row.map(cell => `<${tag}>${rowIndex === 0 ? cell.toUpperCase() : cell}</${tag}>`).join('');
          return `<tr>${cells}</tr>`;
        }).join('');
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <h2>${slide.title.toUpperCase()}</h2>
          <div class="slide__table-block">
            <table class="slide__table">
              ${tableHTML}
            </table>
          </div>
        </div>
      </section>`;

      case 'bar-chart':
        const barChartSVG = generateBarChart(slide.series, chartColors);
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <h2>${slide.title.toUpperCase()}</h2>
          <div class="slide__chart-block">
            ${barChartSVG}
          </div>
        </div>
      </section>`;

      case 'line-chart':
        const lineChartSVG = generateLineChart(slide.series, chartColors);
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <h2>${slide.title.toUpperCase()}</h2>
          <div class="slide__chart-block">
            ${lineChartSVG}
          </div>
        </div>
      </section>`;

      case 'pie-chart':
        const pieChartSVG = generatePieChart(slide.segments, chartColors);
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <h2>${slide.title.toUpperCase()}</h2>
          <div class="slide__chart-block">
            ${pieChartSVG}
          </div>
        </div>
      </section>`;

      case 'image-text':
        const imageLeft = slide.layout === 'image-left';
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <h2>${slide.title.toUpperCase()}</h2>
          <div class="slide__image-text ${imageLeft ? 'slide__image-text--left' : 'slide__image-text--right'}">
            <div class="slide__image-block">
              <img src="${slide.imageUrl}" alt="Slide image">
            </div>
            <div class="slide__text-block">
              <p>${slide.description.toUpperCase()}</p>
            </div>
          </div>
        </div>
      </section>`;

      default:
        const defaultBullets = (slide.content || '')
          .split('\n')
          .filter(line => line.trim())
          .map(line => `<li>${line.replace(/^[-•]\s*/, '').toUpperCase()}</li>`)
          .join('\n              ');
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <h2>${slide.title.toUpperCase()}</h2>
          <div class="slide__content-block">
            <ul class="slide__bullets">
              ${defaultBullets}
            </ul>
          </div>
        </div>
      </section>`;
    }
  }).join('\n');

  // Chart generation functions
  function generateBarChart(series, colors) {
    if (!series || series.length === 0) return '<p style="color: var(--text);">NO DATA AVAILABLE</p>';
    
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
        
        return `<rect x="${x}" y="${y}" width="${barWidth}" height="${height}" fill="${colors[seriesIndex % colors.length]}" stroke="#000" stroke-width="3" />`;
      }).join('');
    }).join('');
    
    const xAxisLabels = allLabels.map((label, index) => {
      const x = margin.left + index * barGroupWidth + barGroupWidth / 2;
      return `<text x="${x}" y="${chartHeight - 15}" text-anchor="middle" font-size="14" fill="var(--text)" font-family="Anton, sans-serif" font-weight="400">${label.toUpperCase()}</text>`;
    }).join('');
    
    const legend = series.map((s, index) => {
      const y = margin.top + index * 25;
      return `
        <rect x="${chartWidth - 120}" y="${y}" width="15" height="15" fill="${colors[index % colors.length]}" stroke="#000" stroke-width="2" />
        <text x="${chartWidth - 95}" y="${y + 12}" font-size="14" fill="var(--text)" font-family="IBM Plex Mono, monospace" font-weight="400">${s.name.toUpperCase()}</text>
      `;
    }).join('');
    
    return `
      <svg viewBox="0 0 ${chartWidth} ${chartHeight}" style="max-width: 100%; height: auto;">
        ${bars}
        <line x1="${margin.left}" y1="${margin.top + plotHeight}" x2="${margin.left + plotWidth}" y2="${margin.top + plotHeight}" stroke="#000" stroke-width="3"/>
        <line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${margin.top + plotHeight}" stroke="#000" stroke-width="3"/>
        ${xAxisLabels}
        ${legend}
      </svg>
    `;
  }

  function generateLineChart(series, colors) {
    if (!series || series.length === 0) return '<p style="color: var(--text);">NO DATA AVAILABLE</p>';
    
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
        return `<circle cx="${x}" cy="${y}" r="6" fill="${colors[seriesIndex % colors.length]}" stroke="#000" stroke-width="3" />`;
      }).join('');
      
      return `
        <polyline points="${points}" fill="none" stroke="${colors[seriesIndex % colors.length]}" stroke-width="4" />
        ${circles}
      `;
    }).join('');
    
    const xAxisLabels = allXValues.map((label, index) => {
      const x = margin.left + (index / (allXValues.length - 1)) * plotWidth;
      return `<text x="${x}" y="${chartHeight - 15}" text-anchor="middle" font-size="14" fill="var(--text)" font-family="Anton, sans-serif" font-weight="400">${label.toString().toUpperCase()}</text>`;
    }).join('');
    
    const legend = series.map((s, index) => {
      const y = margin.top + index * 25;
      return `
        <rect x="${chartWidth - 120}" y="${y}" width="15" height="15" fill="${colors[index % colors.length]}" stroke="#000" stroke-width="2" />
        <text x="${chartWidth - 95}" y="${y + 12}" font-size="14" fill="var(--text)" font-family="IBM Plex Mono, monospace" font-weight="400">${s.name.toUpperCase()}</text>
      `;
    }).join('');
    
    return `
      <svg viewBox="0 0 ${chartWidth} ${chartHeight}" style="max-width: 100%; height: auto;">
        ${lines}
        <line x1="${margin.left}" y1="${margin.top + plotHeight}" x2="${margin.left + plotWidth}" y2="${margin.top + plotHeight}" stroke="#000" stroke-width="3"/>
        <line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${margin.top + plotHeight}" stroke="#000" stroke-width="3"/>
        ${xAxisLabels}
        ${legend}
      </svg>
    `;
  }

  function generatePieChart(segments, colors) {
    if (!segments || segments.length === 0) return '<p style="color: var(--text);">NO DATA AVAILABLE</p>';
    
    const total = segments.reduce((sum, seg) => sum + seg.value, 0);
    const chartSize = 300;
    const radius = 100;
    const center = chartSize / 2;
    
    let currentAngle = -90;
    
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
      
      return `<path d="${pathData}" fill="${colors[index % colors.length]}" stroke="#000" stroke-width="3" />`;
    }).join('');
    
    const legend = segments.map((segment, index) => {
      const y = 20 + index * 30;
      const percentage = ((segment.value / total) * 100).toFixed(1);
      return `
        <rect x="320" y="${y}" width="20" height="20" fill="${colors[index % colors.length]}" stroke="#000" stroke-width="2" />
        <text x="350" y="${y + 15}" font-size="16" fill="var(--text)" font-family="IBM Plex Mono, monospace" font-weight="400">${segment.label.toUpperCase()} (${percentage}%)</text>
      `;
    }).join('');
    
    return `
      <svg viewBox="0 0 600 ${chartSize}" style="max-width: 100%; height: auto;">
        ${slices}
        ${legend}
      </svg>
    `;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${companyName} — Brutalist Presentation</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Anton:wght@400&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    
    :root {
      --accent: ${accentColor};
      --primary: #ff0000;
      --bg: #ffffff;
      --text: #000000;
    }

    html { 
      scroll-snap-type: y mandatory; 
      scroll-behavior: smooth; 
      overflow-x: hidden; 
    }
    
    body {
      font-family: 'IBM Plex Mono', 'Courier New', monospace;
      background: var(--bg);
      color: var(--text);
      -webkit-font-smoothing: auto;
      font-weight: 400;
    }

    /* === Slide Layout === */
    .slide {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      scroll-snap-align: start;
      position: relative;
      padding: 60px;
    }
    
    .slide__content {
      max-width: 1000px;
      width: 100%;
      position: relative;
      opacity: 0;
      transform: translateX(-20px);
      transition: all 0.1s linear;
    }
    
    .slide__content.animate {
      opacity: 1;
      transform: translateX(0);
    }

    /* === Typography === */
    h1, h2 {
      font-family: 'Anton', sans-serif;
      font-weight: 400;
    }

    /* === Title Slide === */
    .slide--title .slide__content {
      max-width: 800px;
      margin-left: 80px;
    }
    
    .slide--title h1 {
      font-size: clamp(4rem, 12vw, 10rem);
      line-height: 0.85;
      margin-bottom: 40px;
      color: var(--text);
      letter-spacing: -0.02em;
    }
    
    .slide__subtitle {
      font-size: clamp(1.2rem, 3vw, 2rem);
      color: var(--text);
      margin-bottom: 60px;
      font-weight: 400;
      line-height: 1.2;
      max-width: 600px;
    }
    
    .slide__badge {
      display: inline-block;
      background: var(--primary);
      color: white;
      padding: 16px 32px;
      border: 4px solid var(--text);
      font-size: 1rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      margin-bottom: 60px;
      font-family: 'Anton', sans-serif;
    }
    
    .slide__company-block {
      border: 6px solid var(--text);
      padding: 30px;
      background: var(--bg);
      max-width: 400px;
    }
    
    .slide__company {
      font-size: 1.4rem;
      font-weight: 700;
      letter-spacing: 0.2em;
      font-family: 'Anton', sans-serif;
    }

    /* === Content Slides === */
    .slide h2 {
      font-size: clamp(3rem, 8vw, 6rem);
      margin-bottom: 50px;
      letter-spacing: -0.01em;
      line-height: 0.9;
      color: var(--text);
    }

    /* === Content Blocks === */
    .slide__content-block,
    .slide__column-block,
    .slide__table-block,
    .slide__chart-block,
    .slide__image-block,
    .slide__text-block,
    .slide__quote-block {
      border: 6px solid var(--text);
      padding: 40px;
      background: var(--bg);
    }

    .slide__bullets {
      list-style: none;
      font-size: clamp(1rem, 2.2vw, 1.4rem);
      line-height: 1.5;
      font-weight: 400;
    }
    
    .slide__bullets li {
      margin-bottom: 20px;
      padding-left: 30px;
      position: relative;
    }
    
    .slide__bullets li::before {
      content: '■';
      position: absolute;
      left: 0;
      top: 0;
      color: var(--primary);
      font-size: 1.2em;
    }

    /* === Two Column Layout === */
    .slide__two-column {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
    }

    /* === Stats === */
    .slide__stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 40px;
      margin-top: 40px;
    }
    
    .slide__stat-block {
      border: 6px solid var(--text);
      padding: 40px 30px;
      background: var(--bg);
      text-align: center;
    }
    
    .slide__stat-number {
      font-size: clamp(3rem, 6vw, 5rem);
      font-weight: 400;
      color: var(--primary);
      margin-bottom: 20px;
      line-height: 1;
      font-family: 'Anton', sans-serif;
    }
    
    .slide__stat-label {
      font-size: 1rem;
      color: var(--text);
      letter-spacing: 0.1em;
      font-weight: 700;
      font-family: 'IBM Plex Mono', monospace;
    }

    /* === Quote === */
    .slide--quote .slide__content {
      margin-left: 80px;
      max-width: 800px;
    }
    
    .slide__quote-block {
      border: 6px solid var(--text);
      padding: 60px;
      background: var(--bg);
    }
    
    .slide__quote {
      font-size: clamp(1.6rem, 4vw, 2.8rem);
      font-weight: 700;
      line-height: 1.2;
      color: var(--text);
      margin-bottom: 40px;
      font-family: 'Anton', sans-serif;
    }
    
    .slide__attribution {
      font-size: 1.2rem;
      color: var(--text);
      font-weight: 400;
      font-family: 'IBM Plex Mono', monospace;
    }

    /* === Table === */
    .slide__table {
      width: 100%;
      border-collapse: collapse;
      font-family: 'IBM Plex Mono', monospace;
    }
    
    .slide__table th,
    .slide__table td {
      padding: 20px;
      text-align: left;
      border: 3px solid var(--text);
    }
    
    .slide__table th {
      background: var(--primary);
      color: white;
      font-weight: 700;
      font-size: 1rem;
      letter-spacing: 0.1em;
    }
    
    .slide__table td {
      font-weight: 400;
      color: var(--text);
      background: var(--bg);
    }

    /* === Charts === */
    .slide__chart-block {
      border: 6px solid var(--text);
      padding: 40px;
      background: var(--bg);
      margin-top: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    /* === Image + Text === */
    .slide__image-text {
      display: grid;
      gap: 40px;
      margin-top: 40px;
    }
    
    .slide__image-text--left {
      grid-template-columns: 1fr 1.2fr;
    }
    
    .slide__image-text--right {
      grid-template-columns: 1.2fr 1fr;
    }
    
    .slide__image-text--right .slide__image-block {
      order: 2;
    }
    
    .slide__image-block {
      border: 6px solid var(--text);
      padding: 0;
      background: var(--bg);
    }
    
    .slide__image-block img {
      width: 100%;
      height: auto;
      display: block;
      filter: grayscale(100%) contrast(1.2);
    }
    
    .slide__text-block {
      border: 6px solid var(--text);
      padding: 40px;
      background: var(--bg);
    }
    
    .slide__text-block p {
      font-size: clamp(1rem, 2vw, 1.3rem);
      line-height: 1.4;
      color: var(--text);
      font-weight: 400;
    }

    /* === Progress Bar === */
    .progress {
      position: fixed;
      top: 0;
      left: 0;
      height: 8px;
      background: var(--primary);
      z-index: 100;
      transition: width 0.1s linear;
      border-right: 4px solid var(--text);
    }

    /* === Nav Dots === */
    .nav-dots {
      position: fixed;
      right: 30px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      flex-direction: column;
      gap: 12px;
      z-index: 100;
    }
    
    .nav-dot {
      width: 20px;
      height: 20px;
      border-radius: 0;
      background: var(--bg);
      border: 3px solid var(--text);
      cursor: pointer;
      transition: all 0.1s linear;
      padding: 0;
    }
    
    .nav-dot:hover {
      background: var(--primary);
    }
    
    .nav-dot--active {
      background: var(--primary);
      transform: scale(1.2);
    }

    /* === Slide Counter === */
    .slide-counter {
      position: fixed;
      bottom: 30px;
      left: 30px;
      font-size: 1.2rem;
      color: var(--text);
      z-index: 100;
      font-weight: 700;
      font-family: 'Anton', sans-serif;
      background: var(--bg);
      border: 4px solid var(--text);
      padding: 12px 20px;
    }

    /* === Reduced Motion === */
    @media (prefers-reduced-motion: reduce) {
      .slide__content { transition: opacity 0.2s linear; }
      * { 
        animation: none !important; 
        transition-duration: 0.1s !important; 
        transition-timing-function: linear !important;
      }
    }

    /* === Mobile === */
    @media (max-width: 768px) {
      .slide { padding: 30px 20px; }
      .slide--title .slide__content { margin-left: 0; }
      .slide--quote .slide__content { margin-left: 0; }
      .nav-dots { right: 15px; gap: 8px; }
      .nav-dot { width: 16px; height: 16px; border-width: 2px; }
      .slide-counter { bottom: 15px; left: 15px; padding: 8px 15px; border-width: 3px; }
      .slide__two-column { grid-template-columns: 1fr; gap: 30px; }
      .slide__stats { grid-template-columns: 1fr; gap: 30px; }
      .slide__image-text,
      .slide__image-text--left,
      .slide__image-text--right { 
        grid-template-columns: 1fr; 
        gap: 30px; 
      }
      .slide__image-text--right .slide__image-block { order: 0; }
      .slide__table { font-size: 0.8rem; }
      .slide__table th,
      .slide__table td { padding: 12px 8px; border-width: 2px; }
      
      /* Reduce border thickness on mobile */
      .slide__content-block,
      .slide__column-block,
      .slide__table-block,
      .slide__chart-block,
      .slide__image-block,
      .slide__text-block,
      .slide__quote-block,
      .slide__company-block,
      .slide__stat-block,
      .slide__badge {
        border-width: 4px;
        padding: 25px;
      }
      
      .progress { height: 6px; border-right-width: 3px; }
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
      .slide__content { opacity: 1; transform: none; transition: none; }
      body { background: #fff; color: #000; }
      .slide { background: #fff !important; }
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
            const content = e.target.querySelector('.slide__content');
            if (content) {
              // Hard cut reveal - no smooth transitions
              content.classList.add('animate');
            }
          }
        });
      }, { threshold: 0.5 });
      
      slides.forEach(s => observer.observe(s));

      dots.forEach(dot => {
        dot.addEventListener('click', () => {
          slides[parseInt(dot.dataset.index)].scrollIntoView({ behavior: 'smooth' });
        });
      });

      document.addEventListener('keydown', e => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ') {
          e.preventDefault();
          if (current < total - 1) {
            slides[current + 1].scrollIntoView({ behavior: 'smooth' });
          }
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          if (current > 0) {
            slides[current - 1].scrollIntoView({ behavior: 'smooth' });
          }
        }
      });

      let touchStartY = 0;
      document.addEventListener('touchstart', e => { touchStartY = e.touches[0].clientY; });
      document.addEventListener('touchend', e => {
        const diff = touchStartY - e.changedTouches[0].clientY;
        if (Math.abs(diff) > 50) {
          if (diff > 0 && current < total - 1) {
            slides[current + 1].scrollIntoView({ behavior: 'smooth' });
          } else if (diff < 0 && current > 0) {
            slides[current - 1].scrollIntoView({ behavior: 'smooth' });
          }
        }
      });

      // Initialize first slide with immediate reveal
      if (slides[0]) {
        const firstContent = slides[0].querySelector('.slide__content');
        if (firstContent) {
          firstContent.classList.add('animate');
        }
      }
    })();
  </script>
  ${watermark ? `
  <div style="position: fixed; bottom: 16px; right: 16px; z-index: 9999; font-size: 18px; font-weight: 600; color: #000000; font-family: 'IBM Plex Mono', monospace; pointer-events: none; background: #ffffff; border: 2px solid #000000; padding: 4px 8px;">
    <a href="https://htmldecks.com" target="_blank" style="color: inherit; text-decoration: none; pointer-events: auto;">MADE WITH HTML DECKS</a>
  </div>` : ''}
</body>
</html>`;
}