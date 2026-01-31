/**
 * HTML Decks — Paper & Ink Template Generator
 * 
 * Editorial literary theme with paper texture and refined typography.
 * Perfect for thoughtful presentations, editorial content, and classic elegance.
 * 
 * @param {Object} config
 * @param {string} config.companyName
 * @param {string} config.accentColor
 * @param {Array<{title: string, content: string}>} config.slides
 * @param {boolean} config.watermark
 * @returns {string} Complete standalone HTML document
 */
function generatePaperInk({ companyName, accentColor, slides, watermark }) {
  const slideCount = slides.length;

  const chartColors = ['#c41e3a', '#1a1a1a', '#78716c', '#b45309', '#0369a1'];

  const slidesHTML = slides.map((slide, i) => {
    switch (slide.type) {
      case 'title':
        return `
      <section class="slide slide--title" data-index="${i}">
        <div class="slide__content">
          <div class="slide__title-ornament"></div>
          <h1>${slide.title}</h1>
          ${slide.subtitle ? `<p class="slide__subtitle">${slide.subtitle}</p>` : ''}
          ${slide.badge ? `<div class="slide__badge">${slide.badge}</div>` : ''}
          <div class="slide__rule-set">
            <div class="slide__rule slide__rule--thick"></div>
            <div class="slide__rule slide__rule--thin"></div>
          </div>
          <p class="slide__company">${companyName}</p>
          <div class="slide__date">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>
      </section>`;

      case 'bullets':
        const bullets = slide.content
          .split('\n')
          .filter(line => line.trim())
          .map((line, idx) => {
            const isFirst = idx === 0;
            const cleanLine = line.replace(/^[-•]\s*/, '');
            return `<li class="${isFirst ? 'slide__bullet--drop-cap' : ''}">${cleanLine}</li>`;
          })
          .join('\n              ');
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <h2>${slide.title}</h2>
          <div class="slide__rule-set">
            <div class="slide__rule slide__rule--thick"></div>
            <div class="slide__rule slide__rule--thin"></div>
          </div>
          <ul class="slide__bullets">
            ${bullets}
          </ul>
        </div>
      </section>`;

      case 'two-column':
        const leftBullets = slide.leftColumn
          .split('\n')
          .filter(line => line.trim())
          .map((line, idx) => {
            const isFirst = idx === 0;
            const cleanLine = line.replace(/^[-•]\s*/, '');
            return `<li class="${isFirst ? 'slide__bullet--drop-cap' : ''}">${cleanLine}</li>`;
          })
          .join('\n              ');
        const rightBullets = slide.rightColumn
          .split('\n')
          .filter(line => line.trim())
          .map((line, idx) => {
            const cleanLine = line.replace(/^[-•]\s*/, '');
            return `<li>${cleanLine}</li>`;
          })
          .join('\n              ');
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <h2>${slide.title}</h2>
          <div class="slide__rule-set">
            <div class="slide__rule slide__rule--thick"></div>
            <div class="slide__rule slide__rule--thin"></div>
          </div>
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
          <div class="slide__stat">
            <div class="slide__stat-number">${metric.number}</div>
            <div class="slide__stat-rule"></div>
            <div class="slide__stat-label">${metric.label}</div>
          </div>
        `).join('');
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <h2>${slide.title}</h2>
          <div class="slide__rule-set">
            <div class="slide__rule slide__rule--thick"></div>
            <div class="slide__rule slide__rule--thin"></div>
          </div>
          <div class="slide__stats">
            ${statsHTML}
          </div>
        </div>
      </section>`;

      case 'quote':
        return `
      <section class="slide slide--quote" data-index="${i}">
        <div class="slide__content">
          <div class="slide__quote-ornament">"</div>
          <blockquote class="slide__quote">
            ${slide.quote}
          </blockquote>
          <div class="slide__rule-set slide__rule-set--centered">
            <div class="slide__rule slide__rule--thick"></div>
            <div class="slide__rule slide__rule--thin"></div>
          </div>
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
          <div class="slide__rule-set">
            <div class="slide__rule slide__rule--thick"></div>
            <div class="slide__rule slide__rule--thin"></div>
          </div>
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
          <div class="slide__rule-set">
            <div class="slide__rule slide__rule--thick"></div>
            <div class="slide__rule slide__rule--thin"></div>
          </div>
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
          <div class="slide__rule-set">
            <div class="slide__rule slide__rule--thick"></div>
            <div class="slide__rule slide__rule--thin"></div>
          </div>
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
          <div class="slide__rule-set">
            <div class="slide__rule slide__rule--thick"></div>
            <div class="slide__rule slide__rule--thin"></div>
          </div>
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
          <div class="slide__rule-set">
            <div class="slide__rule slide__rule--thick"></div>
            <div class="slide__rule slide__rule--thin"></div>
          </div>
          <div class="slide__image-text ${imageLeft ? 'slide__image-text--left' : 'slide__image-text--right'}">
            <div class="slide__image">
              <img src="${slide.imageUrl}" alt="Slide image">
            </div>
            <div class="slide__text">
              <p class="slide__text-drop-cap">${slide.description.split('\n').join('</p><p>')}</p>
            </div>
          </div>
        </div>
      </section>`;

      default:
        const defaultBullets = (slide.content || '')
          .split('\n')
          .filter(line => line.trim())
          .map((line, idx) => {
            const isFirst = idx === 0;
            const cleanLine = line.replace(/^[-•]\s*/, '');
            return `<li class="${isFirst ? 'slide__bullet--drop-cap' : ''}">${cleanLine}</li>`;
          })
          .join('\n              ');
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <h2>${slide.title}</h2>
          <div class="slide__rule-set">
            <div class="slide__rule slide__rule--thick"></div>
            <div class="slide__rule slide__rule--thin"></div>
          </div>
          <ul class="slide__bullets">
            ${defaultBullets}
          </ul>
        </div>
      </section>`;
    }
  }).join('\n');

  // Chart generation functions
  function generateBarChart(series, colors) {
    if (!series || series.length === 0) return '<p style="color: var(--text-muted);">No data available</p>';
    
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
        
        return `<rect x="${x}" y="${y}" width="${barWidth}" height="${height}" fill="${colors[seriesIndex % colors.length]}" stroke="var(--bg)" stroke-width="1" />`;
      }).join('');
    }).join('');
    
    const xAxisLabels = allLabels.map((label, index) => {
      const x = margin.left + index * barGroupWidth + barGroupWidth / 2;
      return `<text x="${x}" y="${chartHeight - 15}" text-anchor="middle" font-size="12" fill="var(--text-muted)" font-family="Source Serif 4, serif">${label}</text>`;
    }).join('');
    
    const legend = series.map((s, index) => {
      const y = margin.top + index * 20;
      return `
        <rect x="${chartWidth - 100}" y="${y}" width="12" height="12" fill="${colors[index % colors.length]}" />
        <text x="${chartWidth - 80}" y="${y + 9}" font-size="12" fill="var(--text)" font-family="Source Serif 4, serif">${s.name}</text>
      `;
    }).join('');
    
    return `
      <svg viewBox="0 0 ${chartWidth} ${chartHeight}" style="max-width: 100%; height: auto;">
        <defs>
          <pattern id="paper-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(26,26,26,0.1)" stroke-width="1"/>
          </pattern>
        </defs>
        <rect x="${margin.left}" y="${margin.top}" width="${plotWidth}" height="${plotHeight}" fill="url(#paper-grid)" />
        ${bars}
        <line x1="${margin.left}" y1="${margin.top + plotHeight}" x2="${margin.left + plotWidth}" y2="${margin.top + plotHeight}" stroke="var(--text-muted)" stroke-width="1"/>
        <line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${margin.top + plotHeight}" stroke="var(--text-muted)" stroke-width="1"/>
        ${xAxisLabels}
        ${legend}
      </svg>
    `;
  }

  function generateLineChart(series, colors) {
    if (!series || series.length === 0) return '<p style="color: var(--text-muted);">No data available</p>';
    
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
        return `<circle cx="${x}" cy="${y}" r="4" fill="${colors[seriesIndex % colors.length]}" stroke="var(--bg)" stroke-width="2" />`;
      }).join('');
      
      return `
        <polyline points="${points}" fill="none" stroke="${colors[seriesIndex % colors.length]}" stroke-width="2" />
        ${circles}
      `;
    }).join('');
    
    const xAxisLabels = allXValues.map((label, index) => {
      const x = margin.left + (index / (allXValues.length - 1)) * plotWidth;
      return `<text x="${x}" y="${chartHeight - 15}" text-anchor="middle" font-size="12" fill="var(--text-muted)" font-family="Source Serif 4, serif">${label}</text>`;
    }).join('');
    
    const legend = series.map((s, index) => {
      const y = margin.top + index * 20;
      return `
        <rect x="${chartWidth - 100}" y="${y}" width="12" height="12" fill="${colors[index % colors.length]}" />
        <text x="${chartWidth - 80}" y="${y + 9}" font-size="12" fill="var(--text)" font-family="Source Serif 4, serif">${s.name}</text>
      `;
    }).join('');
    
    return `
      <svg viewBox="0 0 ${chartWidth} ${chartHeight}" style="max-width: 100%; height: auto;">
        <defs>
          <pattern id="paper-grid-line" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(26,26,26,0.1)" stroke-width="1"/>
          </pattern>
        </defs>
        <rect x="${margin.left}" y="${margin.top}" width="${plotWidth}" height="${plotHeight}" fill="url(#paper-grid-line)" />
        ${lines}
        <line x1="${margin.left}" y1="${margin.top + plotHeight}" x2="${margin.left + plotWidth}" y2="${margin.top + plotHeight}" stroke="var(--text-muted)" stroke-width="1"/>
        <line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${margin.top + plotHeight}" stroke="var(--text-muted)" stroke-width="1"/>
        ${xAxisLabels}
        ${legend}
      </svg>
    `;
  }

  function generatePieChart(segments, colors) {
    if (!segments || segments.length === 0) return '<p style="color: var(--text-muted);">No data available</p>';
    
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
      
      return `<path d="${pathData}" fill="${colors[index % colors.length]}" stroke="var(--bg)" stroke-width="2" />`;
    }).join('');
    
    const legend = segments.map((segment, index) => {
      const y = 20 + index * 25;
      const percentage = ((segment.value / total) * 100).toFixed(1);
      return `
        <rect x="320" y="${y}" width="15" height="15" fill="${colors[index % colors.length]}" />
        <text x="345" y="${y + 12}" font-size="14" fill="var(--text)" font-family="Source Serif 4, serif">${segment.label} (${percentage}%)</text>
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
  <title>${companyName} — Editorial Presentation</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=Source+Serif+4:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    
    :root {
      --accent: ${accentColor};
      --primary: #c41e3a;
      --bg: #faf9f7;
      --text: #1a1a1a;
      --text-muted: #6b6b6b;
    }

    html { 
      scroll-snap-type: y mandatory; 
      scroll-behavior: smooth; 
      overflow-x: hidden; 
    }
    
    body {
      font-family: 'Source Serif 4', Georgia, serif;
      background: var(--bg);
      color: var(--text);
      -webkit-font-smoothing: antialiased;
      position: relative;
    }

    /* === Paper Texture Background === */
    body::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cfilter id='noise' x='0%25' y='0%25' width='100%25' height='100%25'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='discrete' tableValues='0.05 0.1 0.08 0.07'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E") repeat,
        linear-gradient(180deg, #faf9f7 0%, #f7f6f3 100%);
      z-index: 1;
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
      padding: 80px;
      z-index: 10;
    }
    
    .slide__content {
      max-width: 900px;
      width: 100%;
      position: relative;
      z-index: 3;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.6s ease;
    }
    
    .slide__content.animate {
      opacity: 1;
      transform: translateY(0);
    }

    /* === Typography === */
    h1, h2 {
      font-family: 'Cormorant Garamond', Georgia, serif;
    }

    /* === Title Slide === */
    .slide--title { 
      text-align: center;
      max-width: 700px;
      margin: 0 auto;
    }
    
    .slide__title-ornament {
      width: 60px;
      height: 40px;
      margin: 0 auto 40px;
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 40'%3E%3Cpath d='M10 20 Q20 10 30 20 Q40 30 50 20' fill='none' stroke='%23c41e3a' stroke-width='2'/%3E%3Ccircle cx='30' cy='20' r='3' fill='%23c41e3a'/%3E%3C/svg%3E") no-repeat center;
    }
    
    .slide--title h1 {
      font-size: clamp(3rem, 8vw, 5.5rem);
      font-weight: 700;
      letter-spacing: -0.02em;
      margin-bottom: 30px;
      line-height: 1;
      color: var(--text);
    }
    
    .slide__subtitle {
      font-size: clamp(1.2rem, 2.8vw, 1.8rem);
      color: var(--text-muted);
      margin-bottom: 50px;
      font-weight: 400;
      line-height: 1.5;
      font-style: italic;
    }
    
    .slide__badge {
      display: inline-block;
      background: var(--primary);
      color: white;
      padding: 8px 20px;
      border-radius: 0;
      font-size: 0.8rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      margin: 20px 0 40px;
      font-family: 'Source Serif 4', serif;
    }
    
    .slide__company {
      font-size: 1rem;
      color: var(--text);
      text-transform: uppercase;
      letter-spacing: 0.3em;
      font-weight: 500;
      margin-bottom: 10px;
      font-family: 'Source Serif 4', serif;
    }
    
    .slide__date {
      font-size: 0.85rem;
      color: var(--text-muted);
      font-style: italic;
    }

    /* === Rule Sets (Decorative Lines) === */
    .slide__rule-set {
      margin: 30px 0;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .slide__rule-set--centered {
      justify-content: center;
      margin: 40px auto;
      max-width: 200px;
    }
    
    .slide__rule {
      background: var(--primary);
    }
    
    .slide__rule--thick {
      height: 3px;
      width: 40px;
    }
    
    .slide__rule--thin {
      height: 1px;
      width: 20px;
    }

    /* === Content Slides === */
    .slide h2 {
      font-size: clamp(2.2rem, 5vw, 3.5rem);
      font-weight: 600;
      margin-bottom: 20px;
      letter-spacing: -0.01em;
      line-height: 1.1;
      color: var(--text);
    }

    .slide__bullets {
      list-style: none;
      font-size: clamp(1.1rem, 2.2vw, 1.4rem);
      line-height: 1.8;
      font-weight: 400;
      margin-top: 30px;
    }
    
    .slide__bullets li {
      margin-bottom: 24px;
      text-align: justify;
      hyphens: auto;
      color: var(--text);
    }
    
    .slide__bullet--drop-cap::first-letter {
      float: left;
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 3.2em;
      line-height: 0.8;
      padding-right: 8px;
      padding-top: 4px;
      color: var(--primary);
      font-weight: 700;
    }

    /* === Two Column Layout === */
    .slide__two-column {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      align-items: start;
      margin-top: 30px;
    }

    /* === Stats === */
    .slide__stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 40px;
      margin-top: 40px;
    }
    
    .slide__stat {
      text-align: center;
      padding: 30px 20px;
      position: relative;
    }
    
    .slide__stat-number {
      font-size: clamp(3rem, 6vw, 4.5rem);
      font-weight: 700;
      color: var(--primary);
      margin-bottom: 15px;
      line-height: 1;
      font-family: 'Cormorant Garamond', Georgia, serif;
    }
    
    .slide__stat-rule {
      width: 40px;
      height: 2px;
      background: var(--primary);
      margin: 0 auto 15px;
    }
    
    .slide__stat-label {
      font-size: 0.9rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.15em;
      font-weight: 500;
      font-family: 'Source Serif 4', serif;
    }

    /* === Quote === */
    .slide--quote { 
      text-align: center;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .slide__quote-ornament {
      font-size: 8rem;
      color: var(--primary);
      margin-bottom: 20px;
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-weight: 700;
      line-height: 1;
      opacity: 0.7;
    }
    
    .slide__quote {
      font-size: clamp(1.6rem, 4vw, 2.4rem);
      font-style: italic;
      font-weight: 400;
      line-height: 1.5;
      color: var(--text);
      margin: 0 0 40px 0;
      font-family: 'Cormorant Garamond', Georgia, serif;
      text-align: justify;
    }
    
    .slide__attribution {
      font-size: 1.1rem;
      color: var(--text-muted);
      font-weight: 500;
      font-style: normal;
      font-family: 'Source Serif 4', serif;
    }

    /* === Table === */
    .slide__table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 40px;
      font-family: 'Source Serif 4', serif;
    }
    
    .slide__table th,
    .slide__table td {
      padding: 16px;
      text-align: left;
      border-bottom: 1px solid rgba(26,26,26,0.15);
    }
    
    .slide__table th {
      background: rgba(196,30,58,0.05);
      font-weight: 600;
      color: var(--primary);
      text-transform: uppercase;
      font-size: 0.85rem;
      letter-spacing: 0.1em;
    }
    
    .slide__table td {
      font-weight: 400;
      color: var(--text);
    }
    
    .slide__table tr:last-child td {
      border-bottom: none;
    }

    /* === Charts === */
    .slide__chart {
      margin-top: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    /* === Image + Text === */
    .slide__image-text {
      display: grid;
      gap: 50px;
      align-items: start;
      margin-top: 40px;
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
    
    .slide__image {
      overflow: hidden;
      border: 1px solid rgba(26,26,26,0.1);
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    
    .slide__image img {
      width: 100%;
      height: auto;
      display: block;
      filter: sepia(0.1);
    }
    
    .slide__text p {
      font-size: clamp(1.1rem, 2.2vw, 1.4rem);
      line-height: 1.8;
      color: var(--text);
      margin-bottom: 20px;
      text-align: justify;
      hyphens: auto;
    }
    
    .slide__text-drop-cap::first-letter {
      float: left;
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 3.5em;
      line-height: 0.8;
      padding-right: 8px;
      padding-top: 4px;
      color: var(--primary);
      font-weight: 700;
    }

    /* === Progress Bar === */
    .progress {
      position: fixed;
      top: 0;
      left: 0;
      height: 4px;
      background: var(--primary);
      z-index: 100;
      transition: width 0.3s ease;
    }

    /* === Nav Dots === */
    .nav-dots {
      position: fixed;
      right: 40px;
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
      border-radius: 0;
      background: rgba(26,26,26,0.2);
      border: 1px solid rgba(196,30,58,0.3);
      cursor: pointer;
      transition: all 0.3s ease;
      padding: 0;
    }
    
    .nav-dot:hover {
      background: rgba(196,30,58,0.3);
      transform: scale(1.1);
    }
    
    .nav-dot--active {
      background: var(--primary);
      border-color: var(--primary);
      transform: scale(1.2);
    }

    /* === Slide Counter === */
    .slide-counter {
      position: fixed;
      bottom: 40px;
      left: 40px;
      font-size: 0.85rem;
      color: var(--text-muted);
      z-index: 100;
      font-weight: 500;
      font-family: 'Source Serif 4', serif;
      letter-spacing: 0.1em;
    }

    /* === Reduced Motion === */
    @media (prefers-reduced-motion: reduce) {
      .slide__content { transition: opacity 0.4s ease; }
      * { animation: none !important; transition-duration: 0.3s !important; }
    }

    /* === Mobile === */
    @media (max-width: 768px) {
      .slide { padding: 50px 30px; }
      .nav-dots { right: 20px; gap: 12px; }
      .nav-dot { width: 10px; height: 10px; }
      .slide-counter { bottom: 20px; left: 20px; }
      .slide__two-column { grid-template-columns: 1fr; gap: 40px; }
      .slide__stats { grid-template-columns: 1fr; gap: 30px; }
      .slide__image-text,
      .slide__image-text--left,
      .slide__image-text--right { 
        grid-template-columns: 1fr; 
        gap: 30px; 
      }
      .slide__image-text--right .slide__image { order: 0; }
      .slide__table { font-size: 0.85rem; }
      .slide__table th,
      .slide__table td { padding: 12px 8px; }
      
      /* Drop caps don't work well on mobile */
      .slide__bullet--drop-cap::first-letter,
      .slide__text-drop-cap::first-letter {
        float: none;
        font-size: inherit;
        line-height: inherit;
        padding: 0;
        color: inherit;
        font-weight: inherit;
        font-family: inherit;
      }
    }

    /* === Print === */
    @media print {
      html { scroll-snap-type: none; }
      .slide { 
        min-height: auto; 
        page-break-after: always; 
        padding: 60px;
        break-inside: avoid;
      }
      .progress, .nav-dots, .slide-counter { display: none; }
      body::before { display: none; }
      .slide__content { opacity: 1; transform: none; transition: none; }
      body { background: #fff; color: #111; }
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

      // Initialize first slide
      if (slides[0]) {
        const firstContent = slides[0].querySelector('.slide__content');
        if (firstContent) {
          setTimeout(() => firstContent.classList.add('animate'), 100);
        }
      }
    })();
  </script>
  ${watermark ? `
  <div style="position: fixed; bottom: 16px; right: 16px; z-index: 9999; font-size: 18px; font-weight: 600; color: rgba(50, 50, 50, 0.9); background: rgba(255,255,255,0.9); padding: 8px 16px; border-radius: 6px; font-family: 'Source Serif 4', serif; pointer-events: none;">
    <a href="https://htmldecks.com" target="_blank" style="color: inherit; text-decoration: none; pointer-events: auto;">Made with HTML Decks</a>
  </div>` : ''}
</body>
</html>`;
}