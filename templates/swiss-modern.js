/**
 * HTML Decks — Swiss Modern Template Generator
 *
 * Clean, precise, Bauhaus-inspired geometric design.
 * Features visible grid system, asymmetric layouts, and precise typography.
 *
 * @param {Object} config
 * @param {string} config.companyName
 * @param {string} config.accentColor
 * @param {Array<{title: string, content: string, type?: string}>} config.slides
 * @param {boolean} config.watermark
 * @returns {string} Complete standalone HTML document
 */
function generateSwissModern({ companyName, accentColor, slides, watermark }) {
  const slideCount = slides.length;

  const chartColors = ['#ff3300', '#000000', '#333333', '#0066ff', '#009900'];

  const slidesHTML = slides.map((slide, i) => {
    switch (slide.type) {
      case 'title':
        return `
      <section class="slide slide--title" data-index="${i}">
        <div class="slide__content">
          <div class="geometric-shapes">
            <div class="shape shape--circle"></div>
            <div class="shape shape--rectangle"></div>
          </div>
          <div class="slide__number-large">${String(i + 1).padStart(2, '0')}</div>
          <h1>${slide.title}</h1>
          ${slide.subtitle ? `<p class="slide__subtitle">${slide.subtitle}</p>` : ''}
          ${slide.badge ? `<div class="slide__title-badge">${slide.badge}</div>` : ''}
          <div class="slide__meta">${companyName}</div>
        </div>
      </section>`;

      case 'bullets':
        const bullets = slide.content
          .split('\n')
          .filter(line => line.trim())
          .map((line, idx) => `<li><span class="bullet-number">${String(idx + 1).padStart(2, '0')}</span>${line.replace(/^[-•]\s*/, '')}</li>`)
          .join('\n              ');
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <div class="slide__header">
            <div class="slide__number">${String(i + 1).padStart(2, '0')}</div>
            <div class="accent-element"></div>
          </div>
          <div class="content-layout">
            <div class="content-main">
              <h2>${slide.title}</h2>
              <ul class="slide__bullets">
                ${bullets}
              </ul>
            </div>
            <div class="content-decoration">
              <div class="decoration-grid"></div>
            </div>
          </div>
        </div>
      </section>`;

      case 'two-column':
        const leftBullets = slide.leftColumn
          .split('\n')
          .filter(line => line.trim())
          .map((line, idx) => `<li><span class="bullet-number">${String(idx + 1).padStart(2, '0')}</span>${line.replace(/^[-•]\s*/, '')}</li>`)
          .join('\n              ');
        const rightBullets = slide.rightColumn
          .split('\n')
          .filter(line => line.trim())
          .map((line, idx) => `<li><span class="bullet-number">${String(idx + leftBullets.split('\n').length + 1).padStart(2, '0')}</span>${line.replace(/^[-•]\s*/, '')}</li>`)
          .join('\n              ');
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <div class="slide__header">
            <div class="slide__number">${String(i + 1).padStart(2, '0')}</div>
            <div class="accent-element"></div>
          </div>
          <div class="content-layout">
            <div class="content-main">
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
            <div class="content-decoration">
              <div class="decoration-lines"></div>
            </div>
          </div>
        </div>
      </section>`;

      case 'stats':
        const statsHTML = slide.metrics.map((metric, idx) => `
          <div class="slide__stat" style="--delay: ${idx * 0.1}s">
            <div class="stat-number-large">${String(idx + 1).padStart(2, '0')}</div>
            <div class="slide__stat-number">${metric.number}</div>
            <div class="slide__stat-label">${metric.label}</div>
          </div>
        `).join('');
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <div class="slide__header">
            <div class="slide__number">${String(i + 1).padStart(2, '0')}</div>
            <div class="accent-element"></div>
          </div>
          <div class="content-layout">
            <div class="content-main">
              <h2>${slide.title}</h2>
              <div class="slide__stats">
                ${statsHTML}
              </div>
            </div>
            <div class="content-decoration">
              <div class="decoration-circles"></div>
            </div>
          </div>
        </div>
      </section>`;

      case 'quote':
        return `
      <section class="slide slide--quote" data-index="${i}">
        <div class="slide__content">
          <div class="slide__header">
            <div class="slide__number">${String(i + 1).padStart(2, '0')}</div>
            <div class="accent-element"></div>
          </div>
          <div class="content-layout">
            <div class="content-main">
              <h2>${slide.title}</h2>
              <div class="quote-container">
                <div class="quote-mark">"</div>
                <blockquote class="slide__quote">
                  ${slide.quote}
                </blockquote>
                <cite class="slide__attribution">${slide.attribution}</cite>
              </div>
            </div>
            <div class="content-decoration">
              <div class="decoration-square"></div>
            </div>
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
          <div class="slide__header">
            <div class="slide__number">${String(i + 1).padStart(2, '0')}</div>
            <div class="accent-element"></div>
          </div>
          <div class="content-layout">
            <div class="content-main">
              <h2>${slide.title}</h2>
              <div class="table-container">
                <table class="slide__table">
                  ${tableHTML}
                </table>
              </div>
            </div>
            <div class="content-decoration">
              <div class="decoration-grid"></div>
            </div>
          </div>
        </div>
      </section>`;

      case 'bar-chart':
        const barChartSVG = generateBarChart(slide.series, chartColors);
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <div class="slide__header">
            <div class="slide__number">${String(i + 1).padStart(2, '0')}</div>
            <div class="accent-element"></div>
          </div>
          <div class="content-layout">
            <div class="content-main">
              <h2>${slide.title}</h2>
              <div class="slide__chart">
                ${barChartSVG}
              </div>
            </div>
            <div class="content-decoration">
              <div class="decoration-lines"></div>
            </div>
          </div>
        </div>
      </section>`;

      case 'line-chart':
        const lineChartSVG = generateLineChart(slide.series, chartColors);
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <div class="slide__header">
            <div class="slide__number">${String(i + 1).padStart(2, '0')}</div>
            <div class="accent-element"></div>
          </div>
          <div class="content-layout">
            <div class="content-main">
              <h2>${slide.title}</h2>
              <div class="slide__chart">
                ${lineChartSVG}
              </div>
            </div>
            <div class="content-decoration">
              <div class="decoration-circles"></div>
            </div>
          </div>
        </div>
      </section>`;

      case 'pie-chart':
        const pieChartSVG = generatePieChart(slide.segments, chartColors);
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <div class="slide__header">
            <div class="slide__number">${String(i + 1).padStart(2, '0')}</div>
            <div class="accent-element"></div>
          </div>
          <div class="content-layout">
            <div class="content-main">
              <h2>${slide.title}</h2>
              <div class="slide__chart">
                ${pieChartSVG}
              </div>
            </div>
            <div class="content-decoration">
              <div class="decoration-square"></div>
            </div>
          </div>
        </div>
      </section>`;

      case 'image-text':
        const imageLeft = slide.layout === 'image-left';
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <div class="slide__header">
            <div class="slide__number">${String(i + 1).padStart(2, '0')}</div>
            <div class="accent-element"></div>
          </div>
          <div class="content-layout">
            <div class="content-main">
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
            <div class="content-decoration">
              <div class="decoration-lines"></div>
            </div>
          </div>
        </div>
      </section>`;

      default:
        // Fall back to bullets
        const defaultBullets = (slide.content || '')
          .split('\n')
          .filter(line => line.trim())
          .map((line, idx) => `<li><span class="bullet-number">${String(idx + 1).padStart(2, '0')}</span>${line.replace(/^[-•]\s*/, '')}</li>`)
          .join('\n              ');
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <div class="slide__header">
            <div class="slide__number">${String(i + 1).padStart(2, '0')}</div>
            <div class="accent-element"></div>
          </div>
          <div class="content-layout">
            <div class="content-main">
              <h2>${slide.title}</h2>
              <ul class="slide__bullets">
                ${defaultBullets}
              </ul>
            </div>
            <div class="content-decoration">
              <div class="decoration-grid"></div>
            </div>
          </div>
        </div>
      </section>`;
    }
  }).join('\n');

  // Chart generation functions
  function generateBarChart(series, colors) {
    if (!series || series.length === 0) return '<div class="chart-placeholder">NO DATA</div>';
    
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
        
        return `<rect x="${x}" y="${y}" width="${barWidth}" height="${height}" fill="${colors[seriesIndex % colors.length]}" stroke="none" />`;
      }).join('');
    }).join('');
    
    const xAxisLabels = allLabels.map((label, index) => {
      const x = margin.left + index * barGroupWidth + barGroupWidth / 2;
      return `<text x="${x}" y="${chartHeight - 15}" text-anchor="middle" font-size="12" fill="#333" font-family="Archivo">${label}</text>`;
    }).join('');
    
    const legend = series.map((s, index) => {
      const y = margin.top + index * 20;
      return `
        <rect x="${chartWidth - 100}" y="${y}" width="12" height="12" fill="${colors[index % colors.length]}" />
        <text x="${chartWidth - 80}" y="${y + 9}" font-size="12" fill="#000" font-family="Archivo">${s.name}</text>
      `;
    }).join('');
    
    return `
      <svg viewBox="0 0 ${chartWidth} ${chartHeight}" style="max-width: 100%; height: auto; border: 1px solid #000;">
        <!-- Bars -->
        ${bars}
        
        <!-- Axes -->
        <line x1="${margin.left}" y1="${margin.top + plotHeight}" x2="${margin.left + plotWidth}" y2="${margin.top + plotHeight}" stroke="#000" stroke-width="2"/>
        <line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${margin.top + plotHeight}" stroke="#000" stroke-width="2"/>
        
        <!-- Labels -->
        ${xAxisLabels}
        
        <!-- Legend -->
        ${legend}
      </svg>
    `;
  }

  function generateLineChart(series, colors) {
    if (!series || series.length === 0) return '<div class="chart-placeholder">NO DATA</div>';
    
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
      return `<text x="${x}" y="${chartHeight - 15}" text-anchor="middle" font-size="12" fill="#333" font-family="Archivo">${label}</text>`;
    }).join('');
    
    const legend = series.map((s, index) => {
      const y = margin.top + index * 20;
      return `
        <rect x="${chartWidth - 100}" y="${y}" width="12" height="12" fill="${colors[index % colors.length]}" />
        <text x="${chartWidth - 80}" y="${y + 9}" font-size="12" fill="#000" font-family="Archivo">${s.name}</text>
      `;
    }).join('');
    
    return `
      <svg viewBox="0 0 ${chartWidth} ${chartHeight}" style="max-width: 100%; height: auto; border: 1px solid #000;">
        <!-- Lines -->
        ${lines}
        
        <!-- Axes -->
        <line x1="${margin.left}" y1="${margin.top + plotHeight}" x2="${margin.left + plotWidth}" y2="${margin.top + plotHeight}" stroke="#000" stroke-width="2"/>
        <line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${margin.top + plotHeight}" stroke="#000" stroke-width="2"/>
        
        <!-- Labels -->
        ${xAxisLabels}
        
        <!-- Legend -->
        ${legend}
      </svg>
    `;
  }

  function generatePieChart(segments, colors) {
    if (!segments || segments.length === 0) return '<div class="chart-placeholder">NO DATA</div>';
    
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
      
      return `<path d="${pathData}" fill="${colors[index % colors.length]}" stroke="#fff" stroke-width="2" />`;
    }).join('');
    
    const legend = segments.map((segment, index) => {
      const y = 20 + index * 25;
      const percentage = ((segment.value / total) * 100).toFixed(1);
      return `
        <rect x="320" y="${y}" width="15" height="15" fill="${colors[index % colors.length]}" />
        <text x="345" y="${y + 12}" font-size="14" fill="#000" font-family="Archivo">${segment.label}: ${percentage}%</text>
      `;
    }).join('');
    
    return `
      <svg viewBox="0 0 500 ${chartSize}" style="max-width: 100%; height: auto; border: 1px solid #000;">
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
  <title>${companyName} — Swiss Modern</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;700;800;900&family=Nunito:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --accent: ${accentColor};
      --bg: #ffffff;
      --text: #000000;
      --accent-red: #ff3300;
      --grid: rgba(0, 0, 0, 0.05);
      --border: rgba(0, 0, 0, 0.1);
      --text-muted: #333333;
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
      font-family: 'Nunito', sans-serif;
      background: var(--bg);
      color: var(--text);
      -webkit-font-smoothing: antialiased;
      position: relative;
    }

    /* Visible Grid System */
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background-image: 
        linear-gradient(var(--grid) 1px, transparent 1px),
        linear-gradient(90deg, var(--grid) 1px, transparent 1px);
      background-size: 20px 20px;
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
      padding: 60px 80px;
    }

    .slide__content {
      max-width: 1200px;
      width: 100%;
      opacity: 0;
      transform: translateX(-20px);
      animation: slideIn 0.4s ease-out forwards;
    }

    /* === Title Slide === */
    .slide--title {
      text-align: left;
    }
    
    .geometric-shapes {
      position: absolute;
      top: 10%;
      right: 10%;
    }
    
    .shape {
      position: absolute;
    }
    
    .shape--circle {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: var(--accent-red);
      top: 0;
      right: 0;
    }
    
    .shape--rectangle {
      width: 80px;
      height: 200px;
      background: var(--text);
      top: 60px;
      right: 140px;
    }
    
    .slide__number-large {
      font-family: 'Archivo', sans-serif;
      font-size: 8rem;
      font-weight: 900;
      color: var(--grid);
      line-height: 1;
      margin-bottom: -40px;
    }
    
    .slide--title h1 {
      font-family: 'Archivo', sans-serif;
      font-size: clamp(3rem, 7vw, 5rem);
      font-weight: 900;
      letter-spacing: -0.03em;
      line-height: 0.9;
      margin-bottom: 32px;
      max-width: 60%;
    }
    
    .slide__subtitle {
      font-size: clamp(1.2rem, 2.5vw, 1.6rem);
      color: var(--text-muted);
      font-weight: 400;
      max-width: 50%;
      margin-bottom: 40px;
      line-height: 1.5;
    }
    
    .slide__title-badge {
      display: inline-block;
      background: var(--accent-red);
      color: white;
      padding: 12px 24px;
      font-family: 'Archivo', sans-serif;
      font-size: 0.9rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 40px;
    }
    
    .slide__meta {
      font-family: 'Archivo', sans-serif;
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    /* === Content Layout === */
    .slide__header {
      display: flex;
      align-items: center;
      gap: 24px;
      margin-bottom: 48px;
    }
    
    .slide__number {
      font-family: 'Archivo', sans-serif;
      font-size: 1.2rem;
      font-weight: 900;
      color: var(--text);
    }
    
    .accent-element {
      width: 60px;
      height: 4px;
      background: var(--accent-red);
    }
    
    .content-layout {
      display: grid;
      grid-template-columns: 60% 40%;
      gap: 80px;
      align-items: start;
    }
    
    .content-main h2 {
      font-family: 'Archivo', sans-serif;
      font-size: clamp(2rem, 4.5vw, 3.5rem);
      font-weight: 900;
      margin-bottom: 40px;
      letter-spacing: -0.02em;
      line-height: 1.1;
      max-width: 90%;
    }

    /* === Bullets === */
    .slide__bullets {
      list-style: none;
      font-size: clamp(1rem, 2vw, 1.2rem);
      line-height: 1.7;
    }
    
    .slide__bullets li {
      display: flex;
      align-items: flex-start;
      gap: 20px;
      padding: 20px 0;
      border-bottom: 1px solid var(--border);
    }
    
    .slide__bullets li:last-child { border-bottom: none; }
    
    .bullet-number {
      font-family: 'Archivo', sans-serif;
      font-size: 0.8rem;
      font-weight: 900;
      color: var(--accent-red);
      flex-shrink: 0;
      width: 32px;
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
    }
    
    .slide__stat {
      text-align: left;
      padding: 40px 0;
      border-bottom: 2px solid var(--text);
      transition: all 0.4s ease-out;
      animation: statReveal 0.6s ease forwards;
      animation-delay: var(--delay, 0s);
      opacity: 0;
      transform: translateX(-20px);
    }
    
    .stat-number-large {
      font-family: 'Archivo', sans-serif;
      font-size: 1.5rem;
      font-weight: 900;
      color: var(--accent-red);
      margin-bottom: 16px;
    }
    
    .slide__stat-number {
      font-family: 'Archivo', sans-serif;
      font-size: clamp(2.5rem, 5vw, 4rem);
      font-weight: 900;
      color: var(--text);
      margin-bottom: 8px;
      line-height: 1;
    }
    
    .slide__stat-label {
      font-size: 0.9rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 700;
    }

    /* === Quote === */
    .slide--quote .content-layout {
      grid-template-columns: 1fr;
    }
    
    .quote-container {
      position: relative;
      padding: 48px 0;
    }
    
    .quote-mark {
      font-family: 'Archivo', sans-serif;
      font-size: 12rem;
      font-weight: 900;
      color: var(--grid);
      position: absolute;
      top: -80px;
      left: -40px;
      line-height: 1;
      z-index: -1;
    }
    
    .slide__quote {
      font-family: 'Archivo', sans-serif;
      font-size: clamp(1.5rem, 3.5vw, 2.5rem);
      font-style: normal;
      font-weight: 700;
      line-height: 1.3;
      color: var(--text);
      margin: 0 0 32px 0;
      max-width: 80%;
    }
    
    .slide__attribution {
      font-size: 1rem;
      color: var(--text-muted);
      font-weight: 700;
      font-style: normal;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* === Table === */
    .table-container {
      border: 2px solid var(--text);
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
      background: var(--text);
      font-family: 'Archivo', sans-serif;
      font-weight: 900;
      color: white;
      text-transform: uppercase;
      font-size: 0.8rem;
      letter-spacing: 0.1em;
    }
    
    .slide__table td {
      font-weight: 600;
      color: var(--text);
    }
    
    .slide__table tr:hover td {
      background: rgba(255, 51, 0, 0.05);
    }

    /* === Charts === */
    .slide__chart {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .chart-placeholder {
      background: var(--grid);
      border: 2px solid var(--text);
      padding: 60px;
      text-align: center;
      color: var(--text-muted);
      font-family: 'Archivo', sans-serif;
      font-weight: 900;
      font-size: 1.2rem;
    }

    /* === Image + Text === */
    .slide__image-text {
      display: grid;
      gap: 40px;
      align-items: center;
    }
    
    .slide__image-text--left {
      grid-template-columns: 1fr 1.2fr;
    }
    
    .slide__image-text--right {
      grid-template-columns: 1.2fr 1fr;
    }
    
    .slide__image-text--right .slide__image {
      order: 2;
    }
    
    .slide__image {
      border: 2px solid var(--text);
      overflow: hidden;
    }
    
    .slide__image img {
      width: 100%;
      height: auto;
      display: block;
      transition: transform 0.4s ease;
    }
    
    .slide__image img:hover {
      transform: scale(1.02);
    }
    
    .slide__text p {
      font-size: clamp(1rem, 2vw, 1.2rem);
      line-height: 1.7;
      color: var(--text);
      margin-bottom: 20px;
      font-weight: 500;
    }

    /* === Decorative Elements === */
    .content-decoration {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .decoration-grid {
      width: 120px;
      height: 120px;
      background-image: 
        linear-gradient(var(--accent-red) 2px, transparent 2px),
        linear-gradient(90deg, var(--accent-red) 2px, transparent 2px);
      background-size: 20px 20px;
    }
    
    .decoration-lines {
      position: relative;
      width: 100px;
      height: 200px;
    }
    
    .decoration-lines::before,
    .decoration-lines::after {
      content: '';
      position: absolute;
      background: var(--accent-red);
    }
    
    .decoration-lines::before {
      width: 4px;
      height: 100%;
      left: 0;
    }
    
    .decoration-lines::after {
      width: 100%;
      height: 4px;
      top: 50%;
      transform: translateY(-50%);
    }
    
    .decoration-circles {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    
    .decoration-circles::before,
    .decoration-circles::after {
      content: '';
      width: 60px;
      height: 60px;
      border-radius: 50%;
    }
    
    .decoration-circles::before {
      background: var(--accent-red);
    }
    
    .decoration-circles::after {
      background: var(--text);
    }
    
    .decoration-square {
      width: 100px;
      height: 100px;
      background: var(--accent-red);
    }

    /* === Progress === */
    .progress {
      position: fixed;
      top: 0;
      left: 0;
      height: 4px;
      background: var(--accent-red);
      z-index: 100;
      transition: width 0.4s linear;
    }

    /* === Nav Dots === */
    .nav-dots {
      position: fixed;
      right: 32px;
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
      background: var(--border);
      border: none;
      cursor: pointer;
      transition: all 0.4s ease;
      padding: 0;
    }
    
    .nav-dot--active {
      background: var(--accent-red);
      transform: scale(1.3);
    }

    /* === Slide Counter === */
    .slide-counter {
      position: fixed;
      bottom: 32px;
      right: 32px;
      font-family: 'Archivo', sans-serif;
      font-size: 0.9rem;
      color: var(--text-muted);
      z-index: 100;
      font-weight: 900;
    }

    /* === Animations === */
    @keyframes slideIn {
      to { opacity: 1; transform: translateX(0); }
    }

    @keyframes statReveal {
      to { opacity: 1; transform: translateX(0); }
    }

    /* === Print === */
    @media print {
      html { scroll-snap-type: none; }
      .slide { min-height: auto; page-break-after: always; padding: 40px; break-inside: avoid; }
      .progress, .nav-dots, .slide-counter { display: none; }
      .slide__content { opacity: 1; transform: none; animation: none; }
      body::before { display: none; }
      .geometric-shapes { display: none; }
    }

    @media (max-width: 768px) {
      .slide { padding: 40px 24px; }
      .content-layout { 
        grid-template-columns: 1fr; 
        gap: 40px; 
      }
      .content-decoration { display: none; }
      .slide__two-column { grid-template-columns: 1fr; gap: 24px; }
      .slide__stats { grid-template-columns: 1fr; gap: 24px; }
      .slide__image-text,
      .slide__image-text--left,
      .slide__image-text--right { 
        grid-template-columns: 1fr; 
        gap: 32px; 
      }
      .slide__image-text--right .slide__image { order: 0; }
      .slide--title h1 { max-width: 100%; }
      .slide__subtitle { max-width: 100%; }
      .geometric-shapes { display: none; }
      .nav-dots { right: 16px; gap: 8px; }
      .nav-dot { width: 10px; height: 10px; }
    }
  </style>
</head>
<body>
  <div class="progress" id="progress"></div>

  <div class="nav-dots" id="navDots">
    ${slides.map((_, i) => `<button class="nav-dot${i === 0 ? ' nav-dot--active' : ''}" data-index="${i}" aria-label="Go to slide ${i + 1}"></button>`).join('\n    ')}
  </div>

  <div class="slide-counter" id="slideCounter">${String(1).padStart(2, '0')} / ${String(slideCount).padStart(2, '0')}</div>

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
        counter.textContent = String(index + 1).padStart(2, '0') + ' / ' + String(total).padStart(2, '0');
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
  <div style="position: fixed; bottom: 16px; left: 16px; z-index: 9999; font-size: 10px; color: #333; font-family: 'Archivo', sans-serif; pointer-events: none; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">
    <a href="https://htmldecks.com" target="_blank" style="color: inherit; text-decoration: none; pointer-events: auto;">MADE WITH HTML DECKS</a>
  </div>` : ''}
</body>
</html>`;
}