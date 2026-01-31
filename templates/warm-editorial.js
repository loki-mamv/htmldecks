/**
 * HTML Decks — Warm Editorial Template Generator
 *
 * Human, storytelling, photographic, magazine aesthetic.
 * Features decorative serif caps, oversized quote marks, and warm textures.
 *
 * @param {Object} config
 * @param {string} config.companyName
 * @param {string} config.accentColor
 * @param {Array<{title: string, content: string, type?: string}>} config.slides
 * @param {boolean} config.watermark
 * @returns {string} Complete standalone HTML document
 */
function generateWarmEditorial({ companyName, accentColor, slides, watermark }) {
  const slideCount = slides.length;

  const chartColors = ['#b45309', '#0369a1', '#059669', '#dc2626', '#7c3aed'];

  const slidesHTML = slides.map((slide, i) => {
    switch (slide.type) {
      case 'title':
        return `
      <section class="slide slide--title" data-index="${i}">
        <div class="slide__content">
          <div class="slide__eyebrow">${companyName}</div>
          <h1><span class="initial-cap">${slide.title.charAt(0)}</span>${slide.title.slice(1)}</h1>
          ${slide.subtitle ? `<p class="slide__subtitle">${slide.subtitle}</p>` : ''}
          ${slide.badge ? `<div class="slide__title-badge">${slide.badge}</div>` : ''}
          <div class="decorative-line"></div>
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
          <div class="slide__header">
            <span class="chapter-number">Chapter ${String(i).padStart(2, '0')}</span>
          </div>
          <h2><span class="initial-cap">${slide.title.charAt(0)}</span>${slide.title.slice(1)}</h2>
          <ul class="slide__bullets">
            ${bullets}
          </ul>
          <div class="decorative-flourish"></div>
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
          <div class="slide__header">
            <span class="chapter-number">Chapter ${String(i).padStart(2, '0')}</span>
          </div>
          <h2><span class="initial-cap">${slide.title.charAt(0)}</span>${slide.title.slice(1)}</h2>
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
          <div class="decorative-flourish"></div>
        </div>
      </section>`;

      case 'stats':
        const statsHTML = slide.metrics.map((metric, idx) => `
          <div class="slide__stat" style="--delay: ${idx * 0.2}s">
            <div class="stat-ornament"></div>
            <div class="slide__stat-number">${metric.number}</div>
            <div class="slide__stat-label">${metric.label}</div>
          </div>
        `).join('');
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <div class="slide__header">
            <span class="chapter-number">Chapter ${String(i).padStart(2, '0')}</span>
          </div>
          <h2><span class="initial-cap">${slide.title.charAt(0)}</span>${slide.title.slice(1)}</h2>
          <div class="slide__stats">
            ${statsHTML}
          </div>
          <div class="decorative-flourish"></div>
        </div>
      </section>`;

      case 'quote':
        return `
      <section class="slide slide--quote" data-index="${i}">
        <div class="slide__content">
          <div class="slide__header">
            <span class="chapter-number">Chapter ${String(i).padStart(2, '0')}</span>
          </div>
          <h2><span class="initial-cap">${slide.title.charAt(0)}</span>${slide.title.slice(1)}</h2>
          <div class="quote-container">
            <div class="quote-mark-large">"</div>
            <blockquote class="slide__quote">
              ${slide.quote}
            </blockquote>
            <cite class="slide__attribution">— ${slide.attribution}</cite>
          </div>
          <div class="decorative-flourish"></div>
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
          <div class="slide__header">
            <span class="chapter-number">Chapter ${String(i).padStart(2, '0')}</span>
          </div>
          <h2><span class="initial-cap">${slide.title.charAt(0)}</span>${slide.title.slice(1)}</h2>
          <div class="table-container">
            <table class="slide__table">
              ${tableHTML}
            </table>
          </div>
          <div class="decorative-flourish"></div>
        </div>
      </section>`;

      case 'bar-chart':
        const barChartSVG = generateBarChart(slide.series, chartColors);
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <div class="slide__header">
            <span class="chapter-number">Chapter ${String(i).padStart(2, '0')}</span>
          </div>
          <h2><span class="initial-cap">${slide.title.charAt(0)}</span>${slide.title.slice(1)}</h2>
          <div class="slide__chart">
            ${barChartSVG}
          </div>
          <div class="decorative-flourish"></div>
        </div>
      </section>`;

      case 'line-chart':
        const lineChartSVG = generateLineChart(slide.series, chartColors);
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <div class="slide__header">
            <span class="chapter-number">Chapter ${String(i).padStart(2, '0')}</span>
          </div>
          <h2><span class="initial-cap">${slide.title.charAt(0)}</span>${slide.title.slice(1)}</h2>
          <div class="slide__chart">
            ${lineChartSVG}
          </div>
          <div class="decorative-flourish"></div>
        </div>
      </section>`;

      case 'pie-chart':
        const pieChartSVG = generatePieChart(slide.segments, chartColors);
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <div class="slide__header">
            <span class="chapter-number">Chapter ${String(i).padStart(2, '0')}</span>
          </div>
          <h2><span class="initial-cap">${slide.title.charAt(0)}</span>${slide.title.slice(1)}</h2>
          <div class="slide__chart">
            ${pieChartSVG}
          </div>
          <div class="decorative-flourish"></div>
        </div>
      </section>`;

      case 'image-text':
        const imageLeft = slide.layout === 'image-left';
        return `
      <section class="slide slide--image-text" data-index="${i}">
        <div class="slide__content">
          <div class="slide__header">
            <span class="chapter-number">Chapter ${String(i).padStart(2, '0')}</span>
          </div>
          <h2><span class="initial-cap">${slide.title.charAt(0)}</span>${slide.title.slice(1)}</h2>
          <div class="slide__image-text ${imageLeft ? 'slide__image-text--left' : 'slide__image-text--right'}">
            <div class="slide__image">
              <div class="image-frame">
                <img src="${slide.imageUrl}" alt="Slide image">
                <div class="image-overlay"></div>
              </div>
            </div>
            <div class="slide__text">
              <div class="text-content">
                <p>${slide.description.split('\n').join('</p><p>')}</p>
              </div>
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
          <div class="slide__header">
            <span class="chapter-number">Chapter ${String(i).padStart(2, '0')}</span>
          </div>
          <h2><span class="initial-cap">${slide.title.charAt(0)}</span>${slide.title.slice(1)}</h2>
          <ul class="slide__bullets">
            ${defaultBullets}
          </ul>
          <div class="decorative-flourish"></div>
        </div>
      </section>`;
    }
  }).join('\n');

  // Chart generation functions
  function generateBarChart(series, colors) {
    if (!series || series.length === 0) return '<div class="chart-placeholder">No data to display</div>';
    
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
        
        return `<rect x="${x}" y="${y}" width="${barWidth}" height="${height}" fill="${colors[seriesIndex % colors.length]}" rx="3" />`;
      }).join('');
    }).join('');
    
    const xAxisLabels = allLabels.map((label, index) => {
      const x = margin.left + index * barGroupWidth + barGroupWidth / 2;
      return `<text x="${x}" y="${chartHeight - 15}" text-anchor="middle" font-size="12" fill="#2d2a24" font-family="Work Sans">${label}</text>`;
    }).join('');
    
    const legend = series.map((s, index) => {
      const y = margin.top + index * 20;
      return `
        <rect x="${chartWidth - 100}" y="${y}" width="12" height="12" fill="${colors[index % colors.length]}" rx="2" />
        <text x="${chartWidth - 80}" y="${y + 9}" font-size="12" fill="#2d2a24" font-family="Work Sans">${s.name}</text>
      `;
    }).join('');
    
    return `
      <svg viewBox="0 0 ${chartWidth} ${chartHeight}" style="max-width: 100%; height: auto; filter: drop-shadow(0 4px 12px rgba(45, 42, 36, 0.1));">
        <!-- Bars -->
        ${bars}
        
        <!-- Axes -->
        <line x1="${margin.left}" y1="${margin.top + plotHeight}" x2="${margin.left + plotWidth}" y2="${margin.top + plotHeight}" stroke="#2d2a24" stroke-width="1" opacity="0.3"/>
        <line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${margin.top + plotHeight}" stroke="#2d2a24" stroke-width="1" opacity="0.3"/>
        
        <!-- Labels -->
        ${xAxisLabels}
        
        <!-- Legend -->
        ${legend}
      </svg>
    `;
  }

  function generateLineChart(series, colors) {
    if (!series || series.length === 0) return '<div class="chart-placeholder">No data to display</div>';
    
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
        <polyline points="${points}" fill="none" stroke="${colors[seriesIndex % colors.length]}" stroke-width="3" stroke-linecap="round" />
        ${circles}
      `;
    }).join('');
    
    const xAxisLabels = allXValues.map((label, index) => {
      const x = margin.left + (index / (allXValues.length - 1)) * plotWidth;
      return `<text x="${x}" y="${chartHeight - 15}" text-anchor="middle" font-size="12" fill="#2d2a24" font-family="Work Sans">${label}</text>`;
    }).join('');
    
    const legend = series.map((s, index) => {
      const y = margin.top + index * 20;
      return `
        <rect x="${chartWidth - 100}" y="${y}" width="12" height="12" fill="${colors[index % colors.length]}" rx="2" />
        <text x="${chartWidth - 80}" y="${y + 9}" font-size="12" fill="#2d2a24" font-family="Work Sans">${s.name}</text>
      `;
    }).join('');
    
    return `
      <svg viewBox="0 0 ${chartWidth} ${chartHeight}" style="max-width: 100%; height: auto; filter: drop-shadow(0 4px 12px rgba(45, 42, 36, 0.1));">
        <!-- Lines -->
        ${lines}
        
        <!-- Axes -->
        <line x1="${margin.left}" y1="${margin.top + plotHeight}" x2="${margin.left + plotWidth}" y2="${margin.top + plotHeight}" stroke="#2d2a24" stroke-width="1" opacity="0.3"/>
        <line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${margin.top + plotHeight}" stroke="#2d2a24" stroke-width="1" opacity="0.3"/>
        
        <!-- Labels -->
        ${xAxisLabels}
        
        <!-- Legend -->
        ${legend}
      </svg>
    `;
  }

  function generatePieChart(segments, colors) {
    if (!segments || segments.length === 0) return '<div class="chart-placeholder">No data to display</div>';
    
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
      
      return `<path d="${pathData}" fill="${colors[index % colors.length]}" stroke="#fffbf5" stroke-width="2" />`;
    }).join('');
    
    const legend = segments.map((segment, index) => {
      const y = 20 + index * 25;
      const percentage = ((segment.value / total) * 100).toFixed(1);
      return `
        <rect x="320" y="${y}" width="15" height="15" fill="${colors[index % colors.length]}" rx="2" />
        <text x="345" y="${y + 12}" font-size="14" fill="#2d2a24" font-family="Work Sans">${segment.label}: ${percentage}%</text>
      `;
    }).join('');
    
    return `
      <svg viewBox="0 0 500 ${chartSize}" style="max-width: 100%; height: auto; filter: drop-shadow(0 4px 12px rgba(45, 42, 36, 0.1));">
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
  <title>${companyName} — Warm Editorial</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Work+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --accent: ${accentColor};
      --bg: #fffbf5;
      --text: #2d2a24;
      --accent-amber: #b45309;
      --accent-blue: #0369a1;
      --text-muted: #6b7280;
      --border: rgba(45, 42, 36, 0.1);
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }

    html { scroll-snap-type: y mandatory; scroll-behavior: smooth; overflow-x: hidden; }
    body {
      font-family: 'Work Sans', sans-serif;
      background: var(--bg);
      color: var(--text);
      -webkit-font-smoothing: antialiased;
      position: relative;
    }

    /* Subtle Noise Texture */
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.02'/%3E%3C/svg%3E");
      pointer-events: none;
      z-index: -1;
    }

    /* === Slides === */
    .slide {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      scroll-snap-align: start;
      position: relative;
      padding: 80px;
    }

    .slide__content {
      max-width: 900px;
      width: 100%;
      opacity: 0;
      transform: translateY(30px) scale(0.98);
      animation: editorialFade 1s ease forwards;
    }

    /* === Title Slide === */
    .slide--title {
      text-align: center;
    }
    
    .slide__eyebrow {
      font-size: 0.9rem;
      color: var(--accent-amber);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      margin-bottom: 32px;
    }
    
    .slide--title h1 {
      font-family: 'Playfair Display', serif;
      font-size: clamp(3rem, 7vw, 5.5rem);
      font-weight: 900;
      letter-spacing: -0.02em;
      line-height: 0.9;
      margin-bottom: 32px;
      color: var(--text);
    }
    
    .initial-cap {
      font-size: 1.4em;
      color: var(--accent-amber);
      float: left;
      line-height: 0.8;
      margin-right: 8px;
      margin-top: 8px;
    }
    
    .slide__subtitle {
      font-size: clamp(1.2rem, 2.8vw, 1.8rem);
      color: var(--text-muted);
      font-weight: 400;
      max-width: 600px;
      margin: 0 auto 40px auto;
      line-height: 1.6;
      font-style: italic;
    }
    
    .slide__title-badge {
      display: inline-block;
      background: var(--accent-blue);
      color: white;
      padding: 12px 24px;
      border-radius: 24px;
      font-size: 0.9rem;
      font-weight: 600;
      margin-top: 32px;
    }
    
    .decorative-line {
      width: 120px;
      height: 2px;
      background: var(--accent-amber);
      margin: 40px auto 0;
    }

    /* === Content Slides === */
    .slide__header {
      margin-bottom: 32px;
    }
    
    .chapter-number {
      font-family: 'Playfair Display', serif;
      font-size: 0.9rem;
      color: var(--accent-amber);
      font-weight: 700;
      font-style: italic;
      text-transform: lowercase;
    }
    
    .slide h2 {
      font-family: 'Playfair Display', serif;
      font-size: clamp(2.5rem, 5vw, 4rem);
      font-weight: 900;
      margin-bottom: 48px;
      letter-spacing: -0.02em;
      line-height: 1.1;
      color: var(--text);
    }
    
    .slide__bullets {
      list-style: none;
      font-size: clamp(1.1rem, 2.2vw, 1.4rem);
      line-height: 1.8;
    }
    
    .slide__bullets li {
      padding: 24px 0;
      color: var(--text);
      border-bottom: 1px solid var(--border);
      position: relative;
      padding-left: 32px;
    }
    
    .slide__bullets li:last-child { border-bottom: none; }
    
    .slide__bullets li::before {
      content: '•';
      position: absolute;
      left: 0;
      top: 24px;
      color: var(--accent-amber);
      font-size: 1.2em;
      font-weight: 700;
    }

    /* === Two Column Layout === */
    .slide__two-column {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 64px;
      align-items: start;
    }

    /* === Stats === */
    .slide__stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 48px;
      margin-top: 32px;
    }
    
    .slide__stat {
      text-align: center;
      padding: 48px 32px;
      background: rgba(180, 83, 9, 0.03);
      border: 1px solid var(--border);
      border-radius: 12px;
      transition: all 1s ease;
      animation: statFloat 1.2s ease forwards;
      animation-delay: var(--delay, 0s);
      opacity: 0;
      transform: translateY(40px);
    }
    
    .stat-ornament {
      width: 40px;
      height: 2px;
      background: var(--accent-amber);
      margin: 0 auto 24px auto;
    }
    
    .slide__stat-number {
      font-family: 'Playfair Display', serif;
      font-size: clamp(2.5rem, 5vw, 3.8rem);
      font-weight: 900;
      color: var(--accent-amber);
      margin-bottom: 16px;
      line-height: 1;
    }
    
    .slide__stat-label {
      font-size: 1rem;
      color: var(--text-muted);
      font-weight: 500;
      line-height: 1.4;
    }

    /* === Quote === */
    .slide--quote .slide__content {
      max-width: 800px;
      text-align: center;
    }
    
    .quote-container {
      position: relative;
      padding: 64px 32px;
      margin-top: 32px;
    }
    
    .quote-mark-large {
      font-family: 'Playfair Display', serif;
      font-size: 8rem;
      font-weight: 900;
      color: rgba(180, 83, 9, 0.1);
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      line-height: 1;
      z-index: -1;
    }
    
    .slide__quote {
      font-family: 'Playfair Display', serif;
      font-size: clamp(1.6rem, 3.8vw, 2.8rem);
      font-style: italic;
      font-weight: 700;
      line-height: 1.4;
      color: var(--text);
      margin: 0 0 40px 0;
    }
    
    .slide__attribution {
      font-size: 1.1rem;
      color: var(--accent-blue);
      font-weight: 600;
      font-style: normal;
    }

    /* === Table === */
    .table-container {
      margin-top: 32px;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(45, 42, 36, 0.1);
    }
    
    .slide__table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .slide__table th,
    .slide__table td {
      padding: 24px 20px;
      text-align: left;
      border-bottom: 1px solid var(--border);
    }
    
    .slide__table th {
      background: linear-gradient(135deg, var(--accent-amber), #d97706);
      font-family: 'Playfair Display', serif;
      font-weight: 700;
      color: white;
      font-size: 1rem;
    }
    
    .slide__table td {
      font-weight: 500;
      color: var(--text);
      background: rgba(255, 255, 255, 0.8);
    }
    
    .slide__table tr:hover td {
      background: rgba(180, 83, 9, 0.05);
    }

    /* === Charts === */
    .slide__chart {
      margin-top: 48px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .chart-placeholder {
      background: rgba(180, 83, 9, 0.03);
      border: 2px dashed var(--border);
      border-radius: 12px;
      padding: 64px;
      text-align: center;
      color: var(--text-muted);
      font-family: 'Playfair Display', serif;
      font-style: italic;
      font-size: 1.2rem;
    }

    /* === Image + Text === */
    .slide__image-text {
      display: grid;
      gap: 56px;
      align-items: center;
      margin-top: 48px;
    }
    
    .slide__image-text--left {
      grid-template-columns: 1fr 1.3fr;
    }
    
    .slide__image-text--right {
      grid-template-columns: 1.3fr 1fr;
    }
    
    .slide__image-text--right .slide__image {
      order: 2;
    }
    
    .image-frame {
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 12px 48px rgba(45, 42, 36, 0.15);
    }
    
    .slide__image img {
      width: 100%;
      height: auto;
      display: block;
      transition: transform 1s ease;
    }
    
    .slide__image img:hover {
      transform: scale(1.05);
    }
    
    .image-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, rgba(180, 83, 9, 0.1), transparent 50%);
      pointer-events: none;
    }
    
    .text-content p {
      font-size: clamp(1.1rem, 2.2vw, 1.4rem);
      line-height: 1.8;
      color: var(--text);
      margin-bottom: 24px;
      font-weight: 400;
    }

    /* === Decorative Elements === */
    .decorative-flourish {
      width: 80px;
      height: 2px;
      background: var(--accent-amber);
      margin: 48px auto 0;
      position: relative;
    }
    
    .decorative-flourish::before,
    .decorative-flourish::after {
      content: '';
      position: absolute;
      width: 8px;
      height: 8px;
      background: var(--accent-amber);
      border-radius: 50%;
      top: -3px;
    }
    
    .decorative-flourish::before {
      left: -12px;
    }
    
    .decorative-flourish::after {
      right: -12px;
    }

    /* === Progress === */
    .progress {
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--accent-amber), var(--accent-blue));
      z-index: 100;
      transition: width 1s ease;
    }

    /* === Nav Dots === */
    .nav-dots {
      position: fixed;
      right: 32px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      flex-direction: column;
      gap: 16px;
      z-index: 100;
    }
    
    .nav-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: rgba(180, 83, 9, 0.3);
      border: none;
      cursor: pointer;
      transition: all 1s ease;
      padding: 0;
    }
    
    .nav-dot--active {
      background: var(--accent-amber);
      transform: scale(1.3);
      box-shadow: 0 4px 16px rgba(180, 83, 9, 0.3);
    }

    /* === Slide Counter === */
    .slide-counter {
      position: fixed;
      bottom: 32px;
      right: 32px;
      font-family: 'Playfair Display', serif;
      font-size: 0.9rem;
      color: var(--text-muted);
      z-index: 100;
      font-style: italic;
    }

    /* === Animations === */
    @keyframes editorialFade {
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    @keyframes statFloat {
      to { opacity: 1; transform: translateY(0); }
    }

    /* === Print === */
    @media print {
      html { scroll-snap-type: none; }
      .slide { min-height: auto; page-break-after: always; padding: 40px; break-inside: avoid; }
      .progress, .nav-dots, .slide-counter { display: none; }
      .slide__content { opacity: 1; transform: none; animation: none; }
      body::before { display: none; }
    }

    @media (max-width: 768px) {
      .slide { padding: 40px 24px; }
      .nav-dots { right: 16px; gap: 12px; }
      .nav-dot { width: 10px; height: 10px; }
      .slide__two-column { grid-template-columns: 1fr; gap: 40px; }
      .slide__stats { grid-template-columns: 1fr; gap: 32px; }
      .slide__image-text,
      .slide__image-text--left,
      .slide__image-text--right { 
        grid-template-columns: 1fr; 
        gap: 32px; 
      }
      .slide__image-text--right .slide__image { order: 0; }
      .decorative-flourish { margin: 32px auto 0; }
    }
  </style>
</head>
<body>
  <div class="progress" id="progress"></div>

  <div class="nav-dots" id="navDots">
    ${slides.map((_, i) => `<button class="nav-dot${i === 0 ? ' nav-dot--active' : ''}" data-index="${i}" aria-label="Go to slide ${i + 1}"></button>`).join('\n    ')}
  </div>

  <div class="slide-counter" id="slideCounter">page 1 of ${slideCount}</div>

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
        counter.textContent = 'page ' + (index + 1) + ' of ' + total;
        dots.forEach((d, i) => d.classList.toggle('nav-dot--active', i === index));
        
        // Re-trigger animations
        const content = slides[index].querySelector('.slide__content');
        if (content) {
          content.style.animation = 'none';
          content.offsetHeight;
          content.style.animation = '';
        }
      }

      const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) updateUI(parseInt(e.target.dataset.index));
        });
      }, { threshold: 0.5 });
      slides.forEach(s => observer.observe(s));

      dots.forEach(dot => {
        dot.addEventListener('click', () => {
          slides[parseInt(dot.dataset.index)].scrollIntoView({ behavior: 'smooth' });
        });
      });

      document.addEventListener('keydown', e => {
        if (['ArrowDown','ArrowRight',' '].includes(e.key)) {
          e.preventDefault();
          if (current < total - 1) slides[current + 1].scrollIntoView({ behavior: 'smooth' });
        } else if (['ArrowUp','ArrowLeft'].includes(e.key)) {
          e.preventDefault();
          if (current > 0) slides[current - 1].scrollIntoView({ behavior: 'smooth' });
        }
      });

      let ty = 0;
      document.addEventListener('touchstart', e => { ty = e.touches[0].clientY; });
      document.addEventListener('touchend', e => {
        const d = ty - e.changedTouches[0].clientY;
        if (Math.abs(d) > 50) {
          if (d > 0 && current < total - 1) slides[current + 1].scrollIntoView({ behavior: 'smooth' });
          else if (d < 0 && current > 0) slides[current - 1].scrollIntoView({ behavior: 'smooth' });
        }
      });
    })();
  </script>
  ${watermark ? `
  <!-- Made with HTML Decks watermark -->
  <div style="position: fixed; bottom: 16px; left: 16px; z-index: 9999; font-size: 10px; color: rgba(45, 42, 36, 0.5); font-family: 'Work Sans', sans-serif; pointer-events: none; font-style: italic;">
    <a href="https://htmldecks.com" target="_blank" style="color: inherit; text-decoration: none; pointer-events: auto;">Made with HTML Decks</a>
  </div>` : ''}
</body>
</html>`;
}

// Default configuration for warm editorial
generateWarmEditorial.defaults = {
  companyName: 'Story & Co',
  accentColor: '#b45309',
  slides: [
    { 
      title: 'The Art of Storytelling', 
      subtitle: 'How narratives shape our understanding of the world',
      type: 'title',
      badge: 'Editorial Feature'
    },
    { 
      title: 'Why Stories Matter', 
      content: 'Stories are how we make sense of complex information and connect emotionally with ideas\nThey create shared understanding and build empathy between different perspectives\nEvery great presentation is fundamentally a story waiting to be told\nNarratives help audiences remember and act on what they\'ve learned',
      type: 'bullets'
    },
    { 
      title: 'Structure vs. Spontaneity', 
      leftColumn: 'The Power of Structure\nClassic three-act frameworks\nClear beginning, middle, and end\nBuilds tension and resolution',
      rightColumn: 'Room for Spontaneity\nUnexpected moments of insight\nPersonal anecdotes and tangents\nAuthentic human connection',
      type: 'two-column'
    },
    { 
      title: 'The Impact of Great Stories', 
      type: 'stats',
      metrics: [
        { number: '65%', label: 'Better retention with narrative structure' },
        { number: '300%', label: 'More engagement with personal stories' },
        { number: '5x', label: 'Higher action rates after emotional connection' }
      ]
    },
    { 
      title: 'Words to Live By', 
      quote: 'Stories are the most powerful way to put ideas into the world today.',
      attribution: 'Robert McKee, Story Expert',
      type: 'quote'
    },
    { 
      title: 'Your Story Starts Here', 
      content: 'What narrative will you tell?\nHow will you connect with your audience?\nWhat change do you want to create in the world?\nEvery great story begins with a single word.',
      type: 'bullets'
    }
  ]
};