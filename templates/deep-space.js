/**
 * HTML Decks — Deep Space Template Generator
 * 
 * Inspiring cosmic theme with animated starfield background and cinematic typography.
 * Perfect for visionary presentations, long-term strategy, and inspirational content.
 * 
 * @param {Object} config
 * @param {string} config.companyName
 * @param {string} config.accentColor
 * @param {Array<{title: string, content: string}>} config.slides
 * @param {boolean} config.watermark
 * @returns {string} Complete standalone HTML document
 */
function generateDeepSpace({ companyName, accentColor, slides, watermark }) {
  const slideCount = slides.length;

  const chartColors = ['#818cf8', '#c084fc', '#f472b6', '#34d399', '#fbbf24'];

  const slidesHTML = slides.map((slide, i) => {
    switch (slide.type) {
      case 'title':
        return `
      <section class="slide slide--title" data-index="${i}">
        <div class="slide__spotlight"></div>
        <div class="slide__content">
          <h1>${slide.title}</h1>
          ${slide.subtitle ? `<p class="slide__subtitle">${slide.subtitle}</p>` : ''}
          ${slide.badge ? `<div class="slide__badge">${slide.badge}</div>` : ''}
          <div class="slide__cosmic-line"></div>
          <p class="slide__company">${companyName}</p>
        </div>
        <div class="slide__floating-element slide__floating-element--1"></div>
        <div class="slide__floating-element slide__floating-element--2"></div>
      </section>`;

      case 'bullets':
        const bullets = slide.content
          .split('\n')
          .filter(line => line.trim())
          .map((line, idx) => `<li style="animation-delay: ${(idx * 0.15) + 0.3}s">${line.replace(/^[-•]\s*/, '')}</li>`)
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
          .map((line, idx) => `<li style="animation-delay: ${(idx * 0.15) + 0.3}s">${line.replace(/^[-•]\s*/, '')}</li>`)
          .join('\n              ');
        const rightBullets = slide.rightColumn
          .split('\n')
          .filter(line => line.trim())
          .map((line, idx) => `<li style="animation-delay: ${(idx * 0.15) + 0.6}s">${line.replace(/^[-•]\s*/, '')}</li>`)
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
          <div class="slide__stat" style="animation-delay: ${(idx * 0.2) + 0.4}s">
            <div class="slide__stat-number">${metric.number}</div>
            <div class="slide__stat-label">${metric.label}</div>
          </div>
        `).join('');
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__spotlight"></div>
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
        <div class="slide__spotlight"></div>
        <div class="slide__content">
          <blockquote class="slide__quote">
            "${slide.quote}"
          </blockquote>
          <cite class="slide__attribution">— ${slide.attribution}</cite>
        </div>
        <div class="slide__floating-element slide__floating-element--3"></div>
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
          .map((line, idx) => `<li style="animation-delay: ${(idx * 0.15) + 0.3}s">${line.replace(/^[-•]\s*/, '')}</li>`)
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
        
        return `<rect x="${x}" y="${y}" width="${barWidth}" height="${height}" fill="${colors[seriesIndex % colors.length]}" />`;
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
          <pattern id="space-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(129,140,248,0.1)" stroke-width="1"/>
          </pattern>
        </defs>
        <rect x="${margin.left}" y="${margin.top}" width="${plotWidth}" height="${plotHeight}" fill="url(#space-grid)" />
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
        return `<circle cx="${x}" cy="${y}" r="4" fill="${colors[seriesIndex % colors.length]}" />`;
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
          <pattern id="space-grid-line" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(129,140,248,0.1)" stroke-width="1"/>
          </pattern>
        </defs>
        <rect x="${margin.left}" y="${margin.top}" width="${plotWidth}" height="${plotHeight}" fill="url(#space-grid-line)" />
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
  <title>${companyName} — Deep Space Presentation</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    
    :root {
      --accent: ${accentColor};
      --primary: #818cf8;
      --secondary: #c084fc;
      --bg: #030712;
      --text: #ffffff;
      --text-muted: rgba(255,255,255,0.6);
    }

    html { 
      scroll-snap-type: y mandatory; 
      scroll-behavior: smooth; 
      overflow-x: hidden; 
    }
    
    body {
      font-family: 'DM Sans', sans-serif;
      background: var(--bg);
      color: var(--text);
      -webkit-font-smoothing: antialiased;
      position: relative;
      overflow-x: hidden;
    }

    /* === Animated Starfield Background === */
    body::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: 
        radial-gradient(1px 1px at 20px 30px, rgba(255,255,255,0.8), transparent),
        radial-gradient(1px 1px at 40px 70px, rgba(129,140,248,0.6), transparent),
        radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,0.5), transparent),
        radial-gradient(1px 1px at 130px 80px, rgba(192,132,252,0.4), transparent),
        radial-gradient(1px 1px at 160px 30px, rgba(255,255,255,0.7), transparent),
        radial-gradient(1px 1px at 180px 90px, rgba(129,140,248,0.5), transparent),
        radial-gradient(1px 1px at 220px 50px, rgba(255,255,255,0.6), transparent),
        radial-gradient(1px 1px at 280px 20px, rgba(192,132,252,0.7), transparent),
        radial-gradient(1px 1px at 320px 100px, rgba(255,255,255,0.4), transparent),
        radial-gradient(1px 1px at 380px 60px, rgba(129,140,248,0.6), transparent);
      background-size: 400px 200px;
      animation: starfieldMove 60s linear infinite;
      z-index: 1;
      pointer-events: none;
    }

    @keyframes starfieldMove {
      0% { background-position: 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0; }
      100% { background-position: 400px 200px, -400px -200px, 400px -200px, -400px 200px, 400px 200px, -400px -200px, 400px -200px, -400px 200px, 400px 200px, -400px -200px; }
    }

    /* === Slide Layout === */
    .slide {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      scroll-snap-align: start;
      position: relative;
      padding: 80px 60px;
      z-index: 10;
    }
    
    .slide__content {
      max-width: 1000px;
      width: 100%;
      position: relative;
      z-index: 3;
      opacity: 0;
      transform: translateY(40px) scale(0.98);
      transition: all 1.2s cubic-bezier(0.165, 0.84, 0.44, 1);
    }
    
    .slide__content.animate {
      opacity: 1;
      transform: translateY(0) scale(1);
    }

    /* === Spotlight Effects === */
    .slide__spotlight {
      position: absolute;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      background: radial-gradient(circle, var(--primary) 0%, transparent 70%);
      opacity: 0.05;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 2;
      animation: spotlightPulse 8s ease-in-out infinite;
    }

    @keyframes spotlightPulse {
      0%, 100% { opacity: 0.05; transform: translate(-50%, -50%) scale(1); }
      50% { opacity: 0.08; transform: translate(-50%, -50%) scale(1.1); }
    }

    /* === Floating Elements === */
    .slide__floating-element {
      position: absolute;
      border-radius: 50%;
      background: radial-gradient(circle, var(--primary) 0%, transparent 70%);
      opacity: 0.1;
      z-index: 2;
    }
    
    .slide__floating-element--1 {
      width: 200px;
      height: 200px;
      top: 15%;
      right: 10%;
      animation: float1 12s ease-in-out infinite;
    }
    
    .slide__floating-element--2 {
      width: 120px;
      height: 120px;
      bottom: 20%;
      left: 8%;
      background: radial-gradient(circle, var(--secondary) 0%, transparent 70%);
      animation: float2 15s ease-in-out infinite;
    }
    
    .slide__floating-element--3 {
      width: 150px;
      height: 150px;
      top: 25%;
      left: 15%;
      animation: float3 10s ease-in-out infinite;
    }

    @keyframes float1 {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(180deg); }
    }
    
    @keyframes float2 {
      0%, 100% { transform: translateX(0px) rotate(0deg); }
      50% { transform: translateX(15px) rotate(-180deg); }
    }
    
    @keyframes float3 {
      0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
      50% { transform: translate(-10px, -15px) rotate(90deg); }
    }

    /* === Typography === */
    h1, h2 {
      font-family: 'Space Grotesk', sans-serif;
    }

    /* === Title Slide === */
    .slide--title { 
      text-align: center;
      padding: 100px 60px;
    }
    
    .slide--title h1 {
      font-size: clamp(3.5rem, 10vw, 8rem);
      font-weight: 700;
      letter-spacing: -0.03em;
      margin-bottom: 30px;
      line-height: 0.85;
      background: linear-gradient(135deg, var(--primary), var(--secondary), var(--primary));
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .slide__subtitle {
      font-size: clamp(1.2rem, 3vw, 2rem);
      color: var(--text-muted);
      margin-bottom: 60px;
      font-weight: 300;
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
      line-height: 1.4;
    }
    
    .slide__cosmic-line {
      width: 120px;
      height: 2px;
      background: linear-gradient(90deg, var(--primary), var(--secondary), var(--primary));
      margin: 0 auto 40px;
      border-radius: 1px;
      box-shadow: 0 0 20px var(--primary);
    }
    
    .slide__company {
      font-size: 1.1rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.3em;
      font-weight: 500;
      margin-top: 40px;
    }
    
    .slide__badge {
      display: inline-block;
      background: linear-gradient(45deg, var(--primary), var(--secondary));
      color: white;
      padding: 10px 24px;
      border-radius: 25px;
      font-size: 0.9rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin: 30px 0;
      box-shadow: 0 0 30px rgba(129,140,248,0.3);
    }

    /* === Content Slides === */
    .slide h2 {
      font-size: clamp(2.5rem, 6vw, 4.5rem);
      font-weight: 600;
      margin-bottom: 60px;
      letter-spacing: -0.02em;
      line-height: 1.1;
      color: var(--primary);
      position: relative;
    }
    
    .slide h2::after {
      content: '';
      position: absolute;
      bottom: -20px;
      left: 0;
      width: 80px;
      height: 3px;
      background: linear-gradient(90deg, var(--primary), var(--secondary));
      border-radius: 2px;
      box-shadow: 0 0 15px var(--primary);
    }

    .slide__bullets {
      list-style: none;
      font-size: clamp(1.2rem, 2.5vw, 1.6rem);
      line-height: 1.8;
      font-weight: 300;
    }
    
    .slide__bullets li {
      padding: 20px 0 20px 50px;
      position: relative;
      color: rgba(255,255,255,0.9);
      opacity: 0;
      transform: translateY(30px);
      animation: cosmicReveal 1s ease forwards;
    }
    
    .slide__bullets li::before {
      content: '✦';
      position: absolute;
      left: 0;
      top: 20px;
      color: var(--primary);
      font-size: 1rem;
      text-shadow: 0 0 10px var(--primary);
    }

    @keyframes cosmicReveal {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* === Two Column Layout === */
    .slide__two-column {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 80px;
      align-items: start;
    }

    /* === Stats === */
    .slide__stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 40px;
      margin-top: 40px;
    }
    
    .slide__stat {
      text-align: center;
      padding: 40px 30px;
      background: rgba(129,140,248,0.05);
      border: 1px solid rgba(129,140,248,0.2);
      border-radius: 16px;
      position: relative;
      opacity: 0;
      transform: translateY(40px) scale(0.9);
      animation: statEmerge 1.2s ease forwards;
    }
    
    .slide__stat::before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 2px;
      background: linear-gradient(90deg, var(--primary), var(--secondary));
      border-radius: 1px;
    }
    
    .slide__stat-number {
      font-size: clamp(3rem, 6vw, 5rem);
      font-weight: 700;
      color: var(--primary);
      margin-bottom: 15px;
      line-height: 1;
      font-family: 'Space Grotesk', sans-serif;
      text-shadow: 0 0 20px rgba(129,140,248,0.5);
    }
    
    .slide__stat-label {
      font-size: 1rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.15em;
      font-weight: 500;
    }

    @keyframes statEmerge {
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    /* === Quote === */
    .slide--quote { 
      text-align: center;
      padding: 120px 60px;
    }
    
    .slide__quote {
      font-size: clamp(1.6rem, 4vw, 2.8rem);
      font-style: italic;
      font-weight: 300;
      line-height: 1.4;
      color: var(--text);
      margin: 0 0 50px 0;
      position: relative;
      max-width: 900px;
      margin-left: auto;
      margin-right: auto;
      padding: 40px 0;
    }
    
    .slide__quote::before {
      content: '"';
      font-size: 8rem;
      color: var(--primary);
      position: absolute;
      top: -40px;
      left: 50%;
      transform: translateX(-50%);
      font-weight: 700;
      opacity: 0.6;
      text-shadow: 0 0 30px var(--primary);
    }
    
    .slide__attribution {
      font-size: 1.2rem;
      color: var(--text-muted);
      font-weight: 500;
      font-style: normal;
    }

    /* === Table === */
    .slide__table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 40px;
      background: rgba(129,140,248,0.03);
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid rgba(129,140,248,0.2);
    }
    
    .slide__table th,
    .slide__table td {
      padding: 20px;
      text-align: left;
      border-bottom: 1px solid rgba(129,140,248,0.1);
    }
    
    .slide__table th {
      background: rgba(129,140,248,0.1);
      font-weight: 600;
      color: var(--primary);
      text-transform: uppercase;
      font-size: 0.9rem;
      letter-spacing: 0.1em;
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
      margin-top: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    /* === Image + Text === */
    .slide__image-text {
      display: grid;
      gap: 50px;
      align-items: center;
      margin-top: 40px;
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
      border-radius: 12px;
      border: 1px solid rgba(129,140,248,0.2);
      box-shadow: 0 0 40px rgba(129,140,248,0.1);
    }
    
    .slide__image img {
      width: 100%;
      height: auto;
      display: block;
    }
    
    .slide__text p {
      font-size: clamp(1.1rem, 2.2vw, 1.4rem);
      line-height: 1.7;
      color: rgba(255,255,255,0.9);
      margin-bottom: 20px;
    }

    /* === Progress Bar === */
    .progress {
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--primary), var(--secondary));
      z-index: 100;
      transition: width 0.3s ease;
      box-shadow: 0 0 15px var(--primary);
    }

    /* === Nav Dots === */
    .nav-dots {
      position: fixed;
      right: 40px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      flex-direction: column;
      gap: 20px;
      z-index: 100;
    }
    
    .nav-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      border: 2px solid rgba(129,140,248,0.3);
      cursor: pointer;
      transition: all 0.5s ease;
      padding: 0;
    }
    
    .nav-dot:hover {
      background: rgba(129,140,248,0.4);
      transform: scale(1.2);
      box-shadow: 0 0 10px var(--primary);
    }
    
    .nav-dot--active {
      background: var(--primary);
      border-color: var(--primary);
      transform: scale(1.4);
      box-shadow: 0 0 20px var(--primary);
    }

    /* === Slide Counter === */
    .slide-counter {
      position: fixed;
      bottom: 40px;
      left: 40px;
      font-size: 0.9rem;
      color: var(--text-muted);
      z-index: 100;
      font-weight: 500;
      font-family: 'Space Grotesk', sans-serif;
      letter-spacing: 0.1em;
    }

    /* === Reduced Motion === */
    @media (prefers-reduced-motion: reduce) {
      body::before { animation: none; }
      .slide__spotlight { animation: none; }
      .slide__floating-element--1,
      .slide__floating-element--2,
      .slide__floating-element--3 { animation: none; }
      .slide__content { transition: opacity 0.5s ease; }
      .slide__bullets li { animation: none; opacity: 1; transform: none; }
      .slide__stat { animation: none; opacity: 1; transform: none; }
    }

    /* === Mobile === */
    @media (max-width: 768px) {
      .slide { padding: 60px 30px; }
      .slide--title { padding: 80px 30px; }
      .slide--quote { padding: 80px 30px; }
      .nav-dots { right: 20px; gap: 15px; }
      .slide-counter, .slide__company { bottom: 20px; left: 20px; }
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
      .slide__table td { padding: 12px 10px; }
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
      .progress, .nav-dots, .slide-counter, 
      .slide__spotlight, .slide__floating-element { display: none; }
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
              // Parallax-like reveal effect
              setTimeout(() => content.classList.add('animate'), 100);
            }
          }
        });
      }, { threshold: 0.3 });
      
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
        if (Math.abs(diff) > 60) {
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
          setTimeout(() => firstContent.classList.add('animate'), 200);
        }
      }
    })();
  </script>
  ${watermark ? `
  <div style="position: fixed; bottom: 16px; right: 16px; z-index: 9999; font-size: 10px; color: rgba(129, 140, 248, 0.5); font-family: 'DM Sans', sans-serif; pointer-events: none;">
    <a href="https://htmldecks.com" target="_blank" style="color: inherit; text-decoration: none; pointer-events: auto;">Made with HTML Decks</a>
  </div>` : ''}
</body>
</html>`;
}