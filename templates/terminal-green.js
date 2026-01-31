/**
 * HTML Decks — Terminal Green Template Generator
 *
 * Developer-focused hacker aesthetic with retro-tech vibes.
 * Features scanline overlay, typewriter effects, and terminal styling.
 *
 * @param {Object} config
 * @param {string} config.companyName
 * @param {string} config.accentColor
 * @param {Array<{title: string, content: string, type?: string}>} config.slides
 * @param {boolean} config.watermark
 * @returns {string} Complete standalone HTML document
 */
function generateTerminalGreen({ companyName, accentColor, slides, watermark }) {
  const slideCount = slides.length;

  const chartColors = ['#39d353', '#58a6ff', '#f78166', '#d2a8ff', '#ffa657'];

  const slidesHTML = slides.map((slide, i) => {
    switch (slide.type) {
      case 'title':
        return `
      <section class="slide slide--title" data-index="${i}">
        <div class="slide__content">
          <div class="slide__terminal-header">
            <div class="slide__prompt">$</div>
            <div class="slide__path">${companyName.toLowerCase().replace(/\s+/g, '-')}</div>
          </div>
          <h1 class="typewriter">${slide.title}<span class="cursor"></span></h1>
          ${slide.subtitle ? `<p class="slide__subtitle">${slide.subtitle}</p>` : ''}
          ${slide.badge ? `<div class="slide__title-badge">[${slide.badge}]</div>` : ''}
          <div class="ascii-line">
            ┌─────────────────────────────────────────────────────────────────┐
            └─────────────────────────────────────────────────────────────────┘
          </div>
        </div>
      </section>`;

      case 'bullets':
        const bullets = slide.content
          .split('\n')
          .filter(line => line.trim())
          .map(line => `<li>> ${line.replace(/^[-•]\s*/, '')}</li>`)
          .join('\n              ');
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <div class="slide__number">[${String(i + 1).padStart(2, '0')}]</div>
          <h2 class="typewriter">${slide.title}<span class="cursor"></span></h2>
          <ul class="slide__bullets">
            ${bullets}
          </ul>
        </div>
      </section>`;

      case 'two-column':
        const leftBullets = slide.leftColumn
          .split('\n')
          .filter(line => line.trim())
          .map(line => `<li>> ${line.replace(/^[-•]\s*/, '')}</li>`)
          .join('\n              ');
        const rightBullets = slide.rightColumn
          .split('\n')
          .filter(line => line.trim())
          .map(line => `<li>> ${line.replace(/^[-•]\s*/, '')}</li>`)
          .join('\n              ');
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <div class="slide__number">[${String(i + 1).padStart(2, '0')}]</div>
          <h2 class="typewriter">${slide.title}<span class="cursor"></span></h2>
          <div class="slide__two-column">
            <div class="slide__column">
              <div class="column-header">// LEFT COLUMN</div>
              <ul class="slide__bullets">
                ${leftBullets}
              </ul>
            </div>
            <div class="slide__column">
              <div class="column-header">// RIGHT COLUMN</div>
              <ul class="slide__bullets">
                ${rightBullets}
              </ul>
            </div>
          </div>
        </div>
      </section>`;

      case 'stats':
        const statsHTML = slide.metrics.map((metric, idx) => `
          <div class="slide__stat" style="--delay: ${idx * 0.1}s">
            <div class="stat-label">// ${metric.label.toUpperCase()}</div>
            <div class="slide__stat-number">${metric.number}</div>
          </div>
        `).join('');
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <div class="slide__number">[${String(i + 1).padStart(2, '0')}]</div>
          <h2 class="typewriter">${slide.title}<span class="cursor"></span></h2>
          <div class="slide__stats">
            ${statsHTML}
          </div>
        </div>
      </section>`;

      case 'quote':
        return `
      <section class="slide slide--quote" data-index="${i}">
        <div class="slide__content">
          <div class="slide__number">[${String(i + 1).padStart(2, '0')}]</div>
          <h2 class="typewriter">${slide.title}<span class="cursor"></span></h2>
          <div class="quote-container">
            <div class="quote-header">/* QUOTE */</div>
            <blockquote class="slide__quote">
              "${slide.quote}"
            </blockquote>
            <cite class="slide__attribution">// ${slide.attribution}</cite>
          </div>
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
          <div class="slide__number">[${String(i + 1).padStart(2, '0')}]</div>
          <h2 class="typewriter">${slide.title}<span class="cursor"></span></h2>
          <div class="table-container">
            <div class="table-header">// DATA_TABLE</div>
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
          <div class="slide__number">[${String(i + 1).padStart(2, '0')}]</div>
          <h2 class="typewriter">${slide.title}<span class="cursor"></span></h2>
          <div class="slide__chart">
            <div class="chart-header">// BAR_CHART.SVG</div>
            ${barChartSVG}
          </div>
        </div>
      </section>`;

      case 'line-chart':
        const lineChartSVG = generateLineChart(slide.series, chartColors);
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <div class="slide__number">[${String(i + 1).padStart(2, '0')}]</div>
          <h2 class="typewriter">${slide.title}<span class="cursor"></span></h2>
          <div class="slide__chart">
            <div class="chart-header">// LINE_CHART.SVG</div>
            ${lineChartSVG}
          </div>
        </div>
      </section>`;

      case 'pie-chart':
        const pieChartSVG = generatePieChart(slide.segments, chartColors);
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <div class="slide__number">[${String(i + 1).padStart(2, '0')}]</div>
          <h2 class="typewriter">${slide.title}<span class="cursor"></span></h2>
          <div class="slide__chart">
            <div class="chart-header">// PIE_CHART.SVG</div>
            ${pieChartSVG}
          </div>
        </div>
      </section>`;

      case 'image-text':
        const imageLeft = slide.layout === 'image-left';
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <div class="slide__number">[${String(i + 1).padStart(2, '0')}]</div>
          <h2 class="typewriter">${slide.title}<span class="cursor"></span></h2>
          <div class="slide__image-text ${imageLeft ? 'slide__image-text--left' : 'slide__image-text--right'}">
            <div class="slide__image">
              <div class="image-header">// ${imageLeft ? 'LEFT_IMAGE' : 'RIGHT_IMAGE'}.PNG</div>
              <img src="${slide.imageUrl}" alt="Slide image">
            </div>
            <div class="slide__text">
              <div class="text-header">// DESCRIPTION</div>
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
          .map(line => `<li>> ${line.replace(/^[-•]\s*/, '')}</li>`)
          .join('\n              ');
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <div class="slide__number">[${String(i + 1).padStart(2, '0')}]</div>
          <h2 class="typewriter">${slide.title}<span class="cursor"></span></h2>
          <ul class="slide__bullets">
            ${defaultBullets}
          </ul>
        </div>
      </section>`;
    }
  }).join('\n');

  // Chart generation functions
  function generateBarChart(series, colors) {
    if (!series || series.length === 0) return '<div class="chart-placeholder">// NO_DATA_AVAILABLE</div>';
    
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
        
        return `<rect x="${x}" y="${y}" width="${barWidth}" height="${height}" fill="${colors[seriesIndex % colors.length]}" rx="0" />`;
      }).join('');
    }).join('');
    
    const xAxisLabels = allLabels.map((label, index) => {
      const x = margin.left + index * barGroupWidth + barGroupWidth / 2;
      return `<text x="${x}" y="${chartHeight - 15}" text-anchor="middle" font-size="12" fill="#c9d1d9" font-family="JetBrains Mono">${label}</text>`;
    }).join('');
    
    const legend = series.map((s, index) => {
      const y = margin.top + index * 20;
      return `
        <rect x="${chartWidth - 100}" y="${y}" width="12" height="12" fill="${colors[index % colors.length]}" />
        <text x="${chartWidth - 80}" y="${y + 9}" font-size="12" fill="#c9d1d9" font-family="JetBrains Mono">${s.name}</text>
      `;
    }).join('');
    
    return `
      <svg viewBox="0 0 ${chartWidth} ${chartHeight}" style="max-width: 100%; height: auto; border: 1px solid #30363d;">
        <!-- Bars -->
        ${bars}
        
        <!-- Axes -->
        <line x1="${margin.left}" y1="${margin.top + plotHeight}" x2="${margin.left + plotWidth}" y2="${margin.top + plotHeight}" stroke="#30363d" stroke-width="1"/>
        <line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${margin.top + plotHeight}" stroke="#30363d" stroke-width="1"/>
        
        <!-- Grid -->
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#30363d" stroke-width="0.5" opacity="0.3"/>
          </pattern>
        </defs>
        <rect x="${margin.left}" y="${margin.top}" width="${plotWidth}" height="${plotHeight}" fill="url(#grid)" />
        
        <!-- Labels -->
        ${xAxisLabels}
        
        <!-- Legend -->
        ${legend}
      </svg>
    `;
  }

  function generateLineChart(series, colors) {
    if (!series || series.length === 0) return '<div class="chart-placeholder">// NO_DATA_AVAILABLE</div>';
    
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
        return `<circle cx="${x}" cy="${y}" r="3" fill="${colors[seriesIndex % colors.length]}" />`;
      }).join('');
      
      return `
        <polyline points="${points}" fill="none" stroke="${colors[seriesIndex % colors.length]}" stroke-width="2" />
        ${circles}
      `;
    }).join('');
    
    const xAxisLabels = allXValues.map((label, index) => {
      const x = margin.left + (index / (allXValues.length - 1)) * plotWidth;
      return `<text x="${x}" y="${chartHeight - 15}" text-anchor="middle" font-size="12" fill="#c9d1d9" font-family="JetBrains Mono">${label}</text>`;
    }).join('');
    
    const legend = series.map((s, index) => {
      const y = margin.top + index * 20;
      return `
        <rect x="${chartWidth - 100}" y="${y}" width="12" height="12" fill="${colors[index % colors.length]}" />
        <text x="${chartWidth - 80}" y="${y + 9}" font-size="12" fill="#c9d1d9" font-family="JetBrains Mono">${s.name}</text>
      `;
    }).join('');
    
    return `
      <svg viewBox="0 0 ${chartWidth} ${chartHeight}" style="max-width: 100%; height: auto; border: 1px solid #30363d;">
        <!-- Grid -->
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#30363d" stroke-width="0.5" opacity="0.3"/>
          </pattern>
        </defs>
        <rect x="${margin.left}" y="${margin.top}" width="${plotWidth}" height="${plotHeight}" fill="url(#grid)" />
        
        <!-- Lines -->
        ${lines}
        
        <!-- Axes -->
        <line x1="${margin.left}" y1="${margin.top + plotHeight}" x2="${margin.left + plotWidth}" y2="${margin.top + plotHeight}" stroke="#30363d" stroke-width="1"/>
        <line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${margin.top + plotHeight}" stroke="#30363d" stroke-width="1"/>
        
        <!-- Labels -->
        ${xAxisLabels}
        
        <!-- Legend -->
        ${legend}
      </svg>
    `;
  }

  function generatePieChart(segments, colors) {
    if (!segments || segments.length === 0) return '<div class="chart-placeholder">// NO_DATA_AVAILABLE</div>';
    
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
      
      return `<path d="${pathData}" fill="${colors[index % colors.length]}" stroke="#0d1117" stroke-width="2" />`;
    }).join('');
    
    const legend = segments.map((segment, index) => {
      const y = 20 + index * 25;
      const percentage = ((segment.value / total) * 100).toFixed(1);
      return `
        <rect x="320" y="${y}" width="15" height="15" fill="${colors[index % colors.length]}" />
        <text x="345" y="${y + 12}" font-size="14" fill="#c9d1d9" font-family="JetBrains Mono">${segment.label}: ${percentage}%</text>
      `;
    }).join('');
    
    return `
      <svg viewBox="0 0 500 ${chartSize}" style="max-width: 100%; height: auto; border: 1px solid #30363d;">
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
  <title>${companyName} — Terminal Green</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --accent: ${accentColor};
      --bg: #0d1117;
      --text: #c9d1d9;
      --accent-green: #39d353;
      --border: #30363d;
      --text-muted: #8b949e;
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
      .typewriter::after { animation: none !important; }
      .cursor { display: none !important; }
    }

    html { scroll-snap-type: y mandatory; scroll-behavior: smooth; overflow-x: hidden; }
    body {
      font-family: 'JetBrains Mono', monospace;
      background: var(--bg);
      color: var(--text);
      -webkit-font-smoothing: antialiased;
      position: relative;
    }

    /* Scanline Overlay */
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(57, 211, 83, 0.03) 2px,
        rgba(57, 211, 83, 0.03) 3px
      );
      pointer-events: none;
      z-index: 1;
    }

    /* === Slides === */
    .slide {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      scroll-snap-align: start;
      position: relative;
      padding: 60px 80px;
      border: 1px solid var(--border);
    }

    .slide__content {
      max-width: 900px;
      width: 100%;
      opacity: 0;
      transform: translateY(20px);
      animation: terminalBoot 0.3s ease forwards;
    }

    /* === Title Slide === */
    .slide--title {
      text-align: center;
    }
    
    .slide__terminal-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 32px;
      font-size: 0.9rem;
      color: var(--text-muted);
    }
    
    .slide__prompt {
      color: var(--accent-green);
      font-weight: 700;
    }
    
    .slide__path {
      color: var(--text-muted);
    }
    
    .slide--title h1 {
      font-size: clamp(2rem, 5vw, 3.5rem);
      font-weight: 700;
      letter-spacing: -0.02em;
      line-height: 1.2;
      margin-bottom: 24px;
      color: var(--accent-green);
    }
    
    .slide__subtitle {
      font-size: clamp(1rem, 2.2vw, 1.3rem);
      color: var(--text-muted);
      font-weight: 400;
      max-width: 600px;
      margin: 0 auto 32px auto;
      line-height: 1.6;
    }
    
    .slide__title-badge {
      display: inline-block;
      background: var(--border);
      color: var(--accent-green);
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 0.85rem;
      font-weight: 700;
      margin-top: 24px;
      border: 1px solid var(--accent-green);
    }
    
    .ascii-line {
      font-size: 0.8rem;
      color: var(--border);
      margin-top: 32px;
      line-height: 1;
      letter-spacing: 0;
    }

    /* === Content Slides === */
    .slide__number {
      font-size: 0.8rem;
      color: var(--accent-green);
      font-weight: 700;
      margin-bottom: 16px;
    }
    
    .slide h2 {
      font-size: clamp(1.5rem, 3.5vw, 2.5rem);
      font-weight: 700;
      margin-bottom: 32px;
      letter-spacing: -0.01em;
      line-height: 1.3;
      color: var(--accent-green);
    }
    
    /* Typewriter Effect */
    .typewriter {
      overflow: hidden;
      border-right: 2px solid var(--accent-green);
      white-space: nowrap;
      animation: typing 1.5s steps(40, end), blink 0.75s step-end infinite;
    }
    
    .cursor {
      display: inline-block;
      background-color: var(--accent-green);
      width: 2px;
      animation: blink 1s infinite;
    }
    
    @keyframes typing {
      from { width: 0; }
      to { width: 100%; }
    }
    
    @keyframes blink {
      from, to { opacity: 1; }
      50% { opacity: 0; }
    }
    
    .slide__bullets {
      list-style: none;
      font-size: clamp(0.9rem, 1.8vw, 1.1rem);
      line-height: 1.8;
    }
    
    .slide__bullets li {
      padding: 12px 0;
      color: var(--text);
      border-bottom: 1px solid var(--border);
      font-family: 'JetBrains Mono', monospace;
    }
    
    .slide__bullets li:last-child { border-bottom: none; }
    
    .slide__bullets li:hover { 
      color: var(--accent-green);
      background: rgba(57, 211, 83, 0.05);
    }

    /* === Two Column Layout === */
    .slide__two-column {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 48px;
      align-items: start;
    }
    
    .column-header {
      color: var(--text-muted);
      font-size: 0.8rem;
      margin-bottom: 16px;
      border-bottom: 1px solid var(--border);
      padding-bottom: 8px;
    }

    /* === Stats === */
    .slide__stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
      margin-top: 32px;
    }
    
    .slide__stat {
      text-align: center;
      padding: 24px;
      background: rgba(57, 211, 83, 0.05);
      border: 1px solid var(--border);
      border-radius: 4px;
      transition: all 0.3s ease;
      animation: statReveal 0.5s ease forwards;
      animation-delay: var(--delay, 0s);
      opacity: 0;
      transform: translateY(10px);
    }
    
    .slide__stat:hover {
      border-color: var(--accent-green);
      background: rgba(57, 211, 83, 0.1);
    }
    
    .stat-label {
      font-size: 0.7rem;
      color: var(--text-muted);
      margin-bottom: 8px;
      letter-spacing: 0.05em;
    }
    
    .slide__stat-number {
      font-size: clamp(1.8rem, 4vw, 2.5rem);
      font-weight: 700;
      color: var(--accent-green);
      line-height: 1;
    }

    /* === Quote === */
    .slide--quote .slide__content {
      max-width: 800px;
    }
    
    .quote-container {
      margin-top: 32px;
      padding: 32px;
      background: rgba(57, 211, 83, 0.05);
      border: 1px solid var(--border);
      border-left: 4px solid var(--accent-green);
    }
    
    .quote-header {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-bottom: 16px;
    }
    
    .slide__quote {
      font-size: clamp(1.2rem, 2.8vw, 1.8rem);
      font-style: normal;
      font-weight: 400;
      line-height: 1.6;
      color: var(--text);
      margin: 0 0 24px 0;
    }
    
    .slide__attribution {
      font-size: 0.9rem;
      color: var(--text-muted);
      font-style: normal;
    }

    /* === Headers for sections === */
    .table-header,
    .chart-header,
    .image-header,
    .text-header {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-bottom: 16px;
      border-bottom: 1px solid var(--border);
      padding-bottom: 8px;
    }

    /* === Table === */
    .table-container {
      margin-top: 32px;
    }
    
    .slide__table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid var(--border);
    }
    
    .slide__table th,
    .slide__table td {
      padding: 16px;
      text-align: left;
      border-bottom: 1px solid var(--border);
      font-family: 'JetBrains Mono', monospace;
    }
    
    .slide__table th {
      background: rgba(57, 211, 83, 0.1);
      font-weight: 700;
      color: var(--accent-green);
      font-size: 0.85rem;
    }
    
    .slide__table td {
      font-weight: 400;
      color: var(--text);
    }
    
    .slide__table tr:hover td {
      background: rgba(57, 211, 83, 0.05);
    }

    /* === Charts === */
    .slide__chart {
      margin-top: 32px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .chart-placeholder {
      background: rgba(57, 211, 83, 0.05);
      border: 1px dashed var(--border);
      padding: 40px;
      text-align: center;
      color: var(--text-muted);
      font-family: 'JetBrains Mono', monospace;
    }

    /* === Image + Text === */
    .slide__image-text {
      display: grid;
      gap: 32px;
      align-items: start;
      margin-top: 32px;
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
      border: 1px solid var(--border);
    }
    
    .slide__image img {
      width: 100%;
      height: auto;
      display: block;
    }
    
    .slide__text p {
      font-size: clamp(0.9rem, 1.8vw, 1.1rem);
      line-height: 1.7;
      color: var(--text);
      margin-bottom: 16px;
    }

    /* === Progress === */
    .progress {
      position: fixed;
      top: 0;
      left: 0;
      height: 2px;
      background: var(--accent-green);
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
      gap: 8px;
      z-index: 100;
    }
    
    .nav-dot {
      width: 8px;
      height: 8px;
      background: var(--border);
      border: 1px solid var(--border);
      cursor: pointer;
      transition: all 0.3s ease;
      padding: 0;
    }
    
    .nav-dot--active {
      background: var(--accent-green);
      border-color: var(--accent-green);
      transform: scale(1.2);
    }

    /* === Slide Counter === */
    .slide-counter {
      position: fixed;
      bottom: 24px;
      right: 24px;
      font-size: 0.8rem;
      color: var(--text-muted);
      z-index: 100;
      font-family: 'JetBrains Mono', monospace;
    }

    /* === Animations === */
    @keyframes terminalBoot {
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes statReveal {
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
        border: none;
      }
      .progress, .nav-dots, .slide-counter { display: none; }
      .slide__content { opacity: 1; transform: none; animation: none; }
      body::before { display: none; }
      .typewriter { border-right: none; animation: none; }
      .cursor { display: none; }
    }

    @media (max-width: 768px) {
      .slide { padding: 40px 24px; }
      .nav-dots { right: 16px; gap: 6px; }
      .nav-dot { width: 6px; height: 6px; }
      .slide__two-column { grid-template-columns: 1fr; gap: 24px; }
      .slide__stats { grid-template-columns: 1fr; gap: 16px; }
      .slide__image-text,
      .slide__image-text--left,
      .slide__image-text--right { 
        grid-template-columns: 1fr; 
        gap: 24px; 
      }
      .slide__image-text--right .slide__image { order: 0; }
      .ascii-line { font-size: 0.6rem; }
    }
  </style>
</head>
<body>
  <div class="progress" id="progress"></div>

  <div class="nav-dots" id="navDots">
    ${slides.map((_, i) => `<button class="nav-dot${i === 0 ? ' nav-dot--active' : ''}" data-index="${i}" aria-label="Go to slide ${i + 1}"></button>`).join('\n    ')}
  </div>

  <div class="slide-counter" id="slideCounter">[01/${slideCount.toString().padStart(2, '0')}]</div>

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
        counter.textContent = '[' + String(index + 1).padStart(2, '0') + '/' + String(total).padStart(2, '0') + ']';
        dots.forEach((d, i) => d.classList.toggle('nav-dot--active', i === index));
        
        // Re-trigger animations
        const content = slides[index].querySelector('.slide__content');
        if (content) {
          content.style.animation = 'none';
          content.offsetHeight;
          content.style.animation = '';
        }
        
        // Re-trigger typewriter effect
        const typewriters = slides[index].querySelectorAll('.typewriter');
        typewriters.forEach(tw => {
          tw.style.animation = 'none';
          tw.offsetHeight;
          tw.style.animation = '';
        });
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
  <div style="position: fixed; bottom: 16px; left: 16px; z-index: 9999; font-size: 18px; font-weight: 600; color: rgba(139, 148, 158, 0.6); font-family: 'JetBrains Mono', monospace; pointer-events: none;">
    <a href="https://htmldecks.com" target="_blank" style="color: inherit; text-decoration: none; pointer-events: auto;">// Made with HTML Decks</a>
  </div>` : ''}
</body>
</html>`;
}