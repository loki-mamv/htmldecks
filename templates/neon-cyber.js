/**
 * HTML Decks — Neon Cyber Template Generator
 * 
 * Futuristic neon theme with particle system background, glitch effects, and cyber aesthetics.
 * Perfect for tech presentations, startup pitches, and cutting-edge demos.
 * 
 * @param {Object} config
 * @param {string} config.companyName
 * @param {string} config.accentColor
 * @param {Array<{title: string, content: string}>} config.slides
 * @param {boolean} config.watermark
 * @returns {string} Complete standalone HTML document
 */
function generateNeonCyber({ companyName, accentColor, slides, watermark }) {
  const slideCount = slides.length;

  const chartColors = ['#00ffcc', '#ff00aa', '#667eea', '#fbbf24', '#34d399'];

  const slidesHTML = slides.map((slide, i) => {
    switch (slide.type) {
      case 'title':
        return `
      <section class="slide slide--title" data-index="${i}">
        <div class="slide__content">
          <h1 class="glitch" data-text="${slide.title}">${slide.title}</h1>
          ${slide.subtitle ? `<p class="slide__subtitle">${slide.subtitle}</p>` : ''}
          ${slide.badge ? `<div class="slide__badge">${slide.badge}</div>` : ''}
          <div class="slide__accent-line"></div>
          <p class="slide__company">${companyName}</p>
        </div>
      </section>`;

      case 'bullets':
        const bullets = slide.content
          .split('\n')
          .filter(line => line.trim())
          .map((line, idx) => `<li style="animation-delay: ${idx * 0.1}s">${line.replace(/^[-•]\s*/, '')}</li>`)
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
          .map((line, idx) => `<li style="animation-delay: ${idx * 0.1}s">${line.replace(/^[-•]\s*/, '')}</li>`)
          .join('\n              ');
        const rightBullets = slide.rightColumn
          .split('\n')
          .filter(line => line.trim())
          .map((line, idx) => `<li style="animation-delay: ${(idx + 3) * 0.1}s">${line.replace(/^[-•]\s*/, '')}</li>`)
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
        const statsHTML = slide.metrics.map((metric, idx) => `
          <div class="slide__stat" style="animation-delay: ${idx * 0.15}s">
            <div class="slide__stat-number neon-text">${metric.number}</div>
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
        const defaultBullets = (slide.content || '')
          .split('\n')
          .filter(line => line.trim())
          .map((line, idx) => `<li style="animation-delay: ${idx * 0.1}s">${line.replace(/^[-•]\s*/, '')}</li>`)
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
        
        return `<rect x="${x}" y="${y}" width="${barWidth}" height="${height}" fill="${colors[seriesIndex % colors.length]}" stroke="rgba(0,255,204,0.3)" stroke-width="1" />`;
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
        <defs>
          <pattern id="cyber-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,255,204,0.1)" stroke-width="1"/>
          </pattern>
        </defs>
        <rect x="${margin.left}" y="${margin.top}" width="${plotWidth}" height="${plotHeight}" fill="url(#cyber-grid)" />
        ${bars}
        <line x1="${margin.left}" y1="${margin.top + plotHeight}" x2="${margin.left + plotWidth}" y2="${margin.top + plotHeight}" stroke="var(--text-muted)" stroke-width="1"/>
        <line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${margin.top + plotHeight}" stroke="var(--text-muted)" stroke-width="1"/>
        ${xAxisLabels}
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
        return `<circle cx="${x}" cy="${y}" r="4" fill="${colors[seriesIndex % colors.length]}" stroke="rgba(0,255,204,0.5)" stroke-width="2" />`;
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
        <defs>
          <pattern id="cyber-grid-line" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,255,204,0.1)" stroke-width="1"/>
          </pattern>
        </defs>
        <rect x="${margin.left}" y="${margin.top}" width="${plotWidth}" height="${plotHeight}" fill="url(#cyber-grid-line)" />
        ${lines}
        <line x1="${margin.left}" y1="${margin.top + plotHeight}" x2="${margin.left + plotWidth}" y2="${margin.top + plotHeight}" stroke="var(--text-muted)" stroke-width="1"/>
        <line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${margin.top + plotHeight}" stroke="var(--text-muted)" stroke-width="1"/>
        ${xAxisLabels}
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
      
      return `<path d="${pathData}" fill="${colors[index % colors.length]}" stroke="rgba(0,255,204,0.3)" stroke-width="2" />`;
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
  <title>${companyName} — Neon Cyber Presentation</title>
  <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=clash-display@700&f[]=satoshi@400;500;700&display=swap">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    
    :root {
      --accent: ${accentColor};
      --primary-neon: #00ffcc;
      --secondary-neon: #ff00aa;
      --bg: #0a0f1c;
      --text: #ffffff;
      --text-muted: rgba(255,255,255,0.6);
    }

    html { scroll-snap-type: y mandatory; scroll-behavior: smooth; overflow-x: hidden; }
    
    body {
      font-family: 'Satoshi', -apple-system, sans-serif;
      background: var(--bg);
      color: var(--text);
      -webkit-font-smoothing: antialiased;
      position: relative;
    }

    /* === Particle Canvas Background === */
    #particle-canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      pointer-events: none;
    }

    /* === Grid Overlay === */
    body::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: 
        linear-gradient(rgba(0,255,204,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,255,204,0.03) 1px, transparent 1px);
      background-size: 50px 50px;
      z-index: 2;
      pointer-events: none;
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
      z-index: 10;
    }
    
    .slide__content {
      max-width: 900px;
      width: 100%;
      position: relative;
      opacity: 0;
      transform: translateY(30px);
      transition: all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    .slide__content.animate {
      opacity: 1;
      transform: translateY(0);
    }

    /* === Typography === */
    h1, h2 {
      font-family: 'Clash Display', sans-serif;
      font-weight: 700;
    }

    /* === Title Slide === */
    .slide--title { text-align: center; }
    
    .slide--title h1 {
      font-size: clamp(3rem, 8vw, 6rem);
      letter-spacing: -0.02em;
      margin-bottom: 20px;
      line-height: 0.9;
    }
    
    .glitch {
      position: relative;
      color: var(--primary-neon);
      text-shadow: 
        0 0 5px var(--primary-neon),
        0 0 10px var(--primary-neon),
        0 0 20px var(--primary-neon);
    }
    
    .glitch::before,
    .glitch::after {
      content: attr(data-text);
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    
    .glitch::before {
      animation: glitch-1 2s infinite;
      color: var(--secondary-neon);
      z-index: -1;
    }
    
    .glitch::after {
      animation: glitch-2 2s infinite;
      color: var(--primary-neon);
      z-index: -2;
    }

    @keyframes glitch-1 {
      0%, 14%, 15%, 49%, 50%, 99%, 100% { transform: translate(0); }
      15%, 49% { transform: translate(-2px, 1px); }
    }
    
    @keyframes glitch-2 {
      0%, 20%, 21%, 62%, 63%, 99%, 100% { transform: translate(0); }
      21%, 62% { transform: translate(2px, -1px); }
    }

    .slide__subtitle {
      font-size: clamp(1.1rem, 2.5vw, 1.6rem);
      color: var(--text-muted);
      margin-bottom: 40px;
      font-weight: 400;
    }
    
    .slide__accent-line {
      width: 100px;
      height: 2px;
      background: linear-gradient(90deg, var(--primary-neon), var(--secondary-neon));
      margin: 0 auto 30px;
      box-shadow: 0 0 10px var(--primary-neon);
    }
    
    .slide__company {
      font-size: 1rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.2em;
      font-weight: 500;
    }
    
    .slide__badge {
      display: inline-block;
      background: linear-gradient(45deg, var(--primary-neon), var(--secondary-neon));
      color: var(--bg);
      padding: 8px 20px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin: 20px 0;
      box-shadow: 0 0 20px rgba(0,255,204,0.5);
    }

    /* === Content Slides === */
    .slide h2 {
      font-size: clamp(2rem, 5vw, 3.5rem);
      margin-bottom: 40px;
      position: relative;
      color: var(--primary-neon);
      text-shadow: 0 0 10px rgba(0,255,204,0.5);
    }
    
    .slide h2::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 0;
      width: 60px;
      height: 3px;
      background: linear-gradient(90deg, var(--primary-neon), var(--secondary-neon));
      border-radius: 2px;
      box-shadow: 0 0 10px var(--primary-neon);
    }

    .slide__bullets {
      list-style: none;
      font-size: clamp(1.1rem, 2.2vw, 1.4rem);
      line-height: 1.7;
      font-weight: 400;
    }
    
    .slide__bullets li {
      padding: 12px 0 12px 40px;
      position: relative;
      color: rgba(255,255,255,0.9);
      opacity: 0;
      transform: translateX(-20px);
      animation: slideInStagger 0.6s ease forwards;
    }
    
    .slide__bullets li::before {
      content: '▶';
      position: absolute;
      left: 0;
      top: 12px;
      color: var(--primary-neon);
      font-size: 0.8rem;
      text-shadow: 0 0 5px var(--primary-neon);
    }

    @keyframes slideInStagger {
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    /* === Two Column Layout === */
    .slide__two-column {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      align-items: start;
    }

    /* === Stats === */
    .slide__stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 30px;
      margin-top: 30px;
    }
    
    .slide__stat {
      text-align: center;
      padding: 30px 20px;
      background: rgba(0,255,204,0.05);
      border: 1px solid rgba(0,255,204,0.2);
      border-radius: 8px;
      position: relative;
      opacity: 0;
      transform: translateY(20px) scale(0.95);
      animation: statReveal 0.8s ease forwards;
    }
    
    .slide__stat::before {
      content: '';
      position: absolute;
      top: -1px;
      left: -1px;
      right: -1px;
      bottom: -1px;
      background: linear-gradient(45deg, var(--primary-neon), var(--secondary-neon));
      border-radius: 8px;
      z-index: -1;
      opacity: 0.3;
    }
    
    .slide__stat-number {
      font-size: clamp(2.5rem, 5vw, 4rem);
      font-weight: 700;
      color: var(--primary-neon);
      margin-bottom: 10px;
      line-height: 1;
      font-family: 'Clash Display', sans-serif;
    }
    
    .neon-text {
      text-shadow: 
        0 0 5px currentColor,
        0 0 10px currentColor,
        0 0 20px currentColor;
    }
    
    .slide__stat-label {
      font-size: 0.9rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 500;
    }

    @keyframes statReveal {
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    /* === Quote === */
    .slide--quote { text-align: center; }
    
    .slide__quote {
      font-size: clamp(1.4rem, 3.5vw, 2.2rem);
      font-style: italic;
      font-weight: 400;
      line-height: 1.5;
      color: var(--text);
      margin: 0 0 40px 0;
      position: relative;
      padding: 20px 0;
    }
    
    .slide__quote::before {
      content: '"';
      font-size: 5rem;
      color: var(--primary-neon);
      position: absolute;
      top: -30px;
      left: 50%;
      transform: translateX(-50%);
      font-weight: 700;
      text-shadow: 0 0 20px var(--primary-neon);
    }
    
    .slide__attribution {
      font-size: 1.1rem;
      color: var(--text-muted);
      font-weight: 500;
      font-style: normal;
    }

    /* === Table === */
    .slide__table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 30px;
      background: rgba(0,255,204,0.03);
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid rgba(0,255,204,0.2);
    }
    
    .slide__table th,
    .slide__table td {
      padding: 16px;
      text-align: left;
      border-bottom: 1px solid rgba(0,255,204,0.1);
    }
    
    .slide__table th {
      background: rgba(0,255,204,0.1);
      font-weight: 700;
      color: var(--primary-neon);
      text-transform: uppercase;
      font-size: 0.9rem;
      letter-spacing: 0.05em;
      text-shadow: 0 0 5px rgba(0,255,204,0.5);
    }
    
    .slide__table td {
      font-weight: 400;
      color: rgba(255,255,255,0.9);
    }
    
    .slide__table tr:last-child td {
      border-bottom: none;
    }

    /* === Charts === */
    .slide__chart {
      margin-top: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    /* === Image + Text === */
    .slide__image-text {
      display: grid;
      gap: 40px;
      align-items: center;
      margin-top: 30px;
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
      border: 1px solid rgba(0,255,204,0.3);
      box-shadow: 0 0 20px rgba(0,255,204,0.1);
    }
    
    .slide__image img {
      width: 100%;
      height: auto;
      display: block;
    }
    
    .slide__text p {
      font-size: clamp(1rem, 2vw, 1.3rem);
      line-height: 1.7;
      color: rgba(255,255,255,0.9);
      margin-bottom: 16px;
    }

    /* === Progress Bar === */
    .progress {
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--primary-neon), var(--secondary-neon));
      z-index: 100;
      transition: width 0.3s ease;
      box-shadow: 0 0 10px var(--primary-neon);
    }

    /* === Nav Dots === */
    .nav-dots {
      position: fixed;
      right: 30px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      flex-direction: column;
      gap: 15px;
      z-index: 100;
    }
    
    .nav-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      border: 2px solid rgba(0,255,204,0.3);
      cursor: pointer;
      transition: all 0.3s;
      padding: 0;
    }
    
    .nav-dot:hover {
      background: rgba(0,255,204,0.3);
      box-shadow: 0 0 10px rgba(0,255,204,0.5);
    }
    
    .nav-dot--active {
      background: var(--primary-neon);
      box-shadow: 0 0 15px var(--primary-neon);
      transform: scale(1.3);
    }

    /* === Slide Counter === */
    .slide-counter {
      position: fixed;
      bottom: 30px;
      left: 30px;
      font-size: 0.85rem;
      color: var(--text-muted);
      z-index: 100;
      font-weight: 500;
      font-family: 'Clash Display', sans-serif;
    }

    /* === Reduced Motion === */
    @media (prefers-reduced-motion: reduce) {
      .glitch::before,
      .glitch::after {
        animation: none;
      }
      .slide__content {
        transition: opacity 0.3s ease;
      }
      .slide__bullets li {
        animation: none;
        opacity: 1;
        transform: none;
      }
      .slide__stat {
        animation: none;
        opacity: 1;
        transform: none;
      }
    }

    /* === Mobile === */
    @media (max-width: 768px) {
      .slide { padding: 40px 20px; }
      .nav-dots { right: 20px; gap: 10px; }
      .nav-dot { width: 10px; height: 10px; }
      .slide__two-column { grid-template-columns: 1fr; gap: 30px; }
      .slide__stats { grid-template-columns: 1fr; gap: 20px; }
      .slide__image-text,
      .slide__image-text--left,
      .slide__image-text--right { 
        grid-template-columns: 1fr; 
        gap: 30px; 
      }
      .slide__image-text--right .slide__image { order: 0; }
      .slide__table { font-size: 0.8rem; }
      .slide__table th,
      .slide__table td { padding: 10px 8px; }
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
      .progress, .nav-dots, .slide-counter, #particle-canvas { display: none; }
      body::before { display: none; }
      .slide__content { opacity: 1; transform: none; transition: none; }
      body { background: #fff; color: #111; }
      .slide { background: #fff !important; }
    }
  </style>
</head>
<body>
  <!-- Particle Canvas -->
  <canvas id="particle-canvas"></canvas>

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
      // === Particle System ===
      const canvas = document.getElementById('particle-canvas');
      const ctx = canvas.getContext('2d');
      const particles = [];
      const maxParticles = 50;
      const connectionDistance = 120;

      function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }

      class Particle {
        constructor() {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.vx = (Math.random() - 0.5) * 0.5;
          this.vy = (Math.random() - 0.5) * 0.5;
          this.radius = Math.random() * 2 + 1;
        }

        update() {
          this.x += this.vx;
          this.y += this.vy;

          if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
          if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }

        draw() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0, 255, 204, 0.6)';
          ctx.fill();
          
          // Glow effect
          ctx.shadowColor = '#00ffcc';
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      function createParticles() {
        for (let i = 0; i < maxParticles; i++) {
          particles.push(new Particle());
        }
      }

      function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
              const opacity = 1 - distance / connectionDistance;
              ctx.strokeStyle = \`rgba(0, 255, 204, \${opacity * 0.3})\`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      }

      function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
          particle.update();
          particle.draw();
        });
        
        connectParticles();
        requestAnimationFrame(animate);
      }

      // === Slide Navigation ===
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
            e.target.querySelector('.slide__content').classList.add('animate');
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
          if (current < total - 1) slides[current + 1].scrollIntoView({ behavior: 'smooth' });
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          if (current > 0) slides[current - 1].scrollIntoView({ behavior: 'smooth' });
        }
      });

      let touchStartY = 0;
      document.addEventListener('touchstart', e => { touchStartY = e.touches[0].clientY; });
      document.addEventListener('touchend', e => {
        const diff = touchStartY - e.changedTouches[0].clientY;
        if (Math.abs(diff) > 50) {
          if (diff > 0 && current < total - 1) slides[current + 1].scrollIntoView({ behavior: 'smooth' });
          else if (diff < 0 && current > 0) slides[current - 1].scrollIntoView({ behavior: 'smooth' });
        }
      });

      // Initialize
      window.addEventListener('resize', resizeCanvas);
      resizeCanvas();
      createParticles();
      animate();
    })();
  </script>
  ${watermark ? `
  <div style="position: fixed; bottom: 16px; right: 16px; z-index: 9999; font-size: 18px; font-weight: 600; color: rgba(0, 255, 204, 0.5); font-family: 'Satoshi', sans-serif; pointer-events: none;">
    <a href="https://htmldecks.com" target="_blank" style="color: inherit; text-decoration: none; pointer-events: auto;">Made with HTML Decks</a>
  </div>` : ''}
</body>
</html>`;
}