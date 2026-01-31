/**
 * HTML Decks — Gradient Wave Template Generator
 *
 * Modern SaaS design with glassmorphism, animated gradient mesh, and floating orbs.
 * Energetic, approachable tech vibe with smooth flowing animations.
 *
 * @param {Object} config
 * @param {string} config.companyName
 * @param {string} config.accentColor
 * @param {Array<{title: string, content: string, type?: string}>} config.slides
 * @param {boolean} config.watermark
 * @returns {string} Complete standalone HTML document
 */
function generateGradientWave({ companyName, accentColor, slides, watermark }) {
  const slideCount = slides.length;

  const chartColors = ['#667eea', '#764ba2', '#f472b6', '#34d399', '#fbbf24'];

  const slidesHTML = slides.map((slide, i) => {
    switch (slide.type) {
      case 'title':
        return `
      <section class="slide slide--title" data-index="${i}">
        <div class="floating-orbs">
          <div class="orb orb--1"></div>
          <div class="orb orb--2"></div>
          <div class="orb orb--3"></div>
        </div>
        <div class="slide__content glass-card">
          <div class="slide__badge">${companyName}</div>
          <h1>${slide.title}</h1>
          ${slide.subtitle ? `<p class="slide__subtitle">${slide.subtitle}</p>` : ''}
          ${slide.badge ? `<div class="slide__title-badge">${slide.badge}</div>` : ''}
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
        <div class="slide__content glass-card">
          <div class="slide__number">${String(i + 1).padStart(2, '0')}</div>
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
          .map(line => `<li>${line.replace(/^[-•]\s*/, '')}</li>`)
          .join('\n              ');
        const rightBullets = slide.rightColumn
          .split('\n')
          .filter(line => line.trim())
          .map(line => `<li>${line.replace(/^[-•]\s*/, '')}</li>`)
          .join('\n              ');
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content glass-card">
          <div class="slide__number">${String(i + 1).padStart(2, '0')}</div>
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
          <div class="slide__stat glass-card" style="--delay: ${idx * 0.1}s">
            <div class="slide__stat-number">${metric.number}</div>
            <div class="slide__stat-label">${metric.label}</div>
          </div>
        `).join('');
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <div class="slide__number">${String(i + 1).padStart(2, '0')}</div>
          <h2>${slide.title}</h2>
          <div class="slide__stats">
            ${statsHTML}
          </div>
        </div>
      </section>`;

      case 'quote':
        return `
      <section class="slide slide--quote" data-index="${i}">
        <div class="slide__content glass-card">
          <div class="slide__number">${String(i + 1).padStart(2, '0')}</div>
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
          <div class="slide__number">${String(i + 1).padStart(2, '0')}</div>
          <h2>${slide.title}</h2>
          <div class="table-container glass-card">
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
          <div class="slide__number">${String(i + 1).padStart(2, '0')}</div>
          <h2>${slide.title}</h2>
          <div class="slide__chart glass-card">
            ${barChartSVG}
          </div>
        </div>
      </section>`;

      case 'line-chart':
        const lineChartSVG = generateLineChart(slide.series, chartColors);
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <div class="slide__number">${String(i + 1).padStart(2, '0')}</div>
          <h2>${slide.title}</h2>
          <div class="slide__chart glass-card">
            ${lineChartSVG}
          </div>
        </div>
      </section>`;

      case 'pie-chart':
        const pieChartSVG = generatePieChart(slide.segments, chartColors);
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <div class="slide__number">${String(i + 1).padStart(2, '0')}</div>
          <h2>${slide.title}</h2>
          <div class="slide__chart glass-card">
            ${pieChartSVG}
          </div>
        </div>
      </section>`;

      case 'image-text':
        const imageLeft = slide.layout === 'image-left';
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content">
          <div class="slide__number">${String(i + 1).padStart(2, '0')}</div>
          <h2>${slide.title}</h2>
          <div class="slide__image-text ${imageLeft ? 'slide__image-text--left' : 'slide__image-text--right'} glass-card">
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
        // Fall back to bullets
        const defaultBullets = (slide.content || '')
          .split('\n')
          .filter(line => line.trim())
          .map(line => `<li>${line.replace(/^[-•]\s*/, '')}</li>`)
          .join('\n              ');
        return `
      <section class="slide" data-index="${i}">
        <div class="slide__content glass-card">
          <div class="slide__number">${String(i + 1).padStart(2, '0')}</div>
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
    if (!series || series.length === 0) return '<p style="color: rgba(255,255,255,0.7);">No data available</p>';
    
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
        
        return `<rect x="${x}" y="${y}" width="${barWidth}" height="${height}" fill="${colors[seriesIndex % colors.length]}" rx="4" />`;
      }).join('');
    }).join('');
    
    const xAxisLabels = allLabels.map((label, index) => {
      const x = margin.left + index * barGroupWidth + barGroupWidth / 2;
      return `<text x="${x}" y="${chartHeight - 15}" text-anchor="middle" font-size="12" fill="rgba(255,255,255,0.7)">${label}</text>`;
    }).join('');
    
    const legend = series.map((s, index) => {
      const y = margin.top + index * 20;
      return `
        <rect x="${chartWidth - 100}" y="${y}" width="12" height="12" fill="${colors[index % colors.length]}" rx="2" />
        <text x="${chartWidth - 80}" y="${y + 9}" font-size="12" fill="rgba(255,255,255,0.9)">${s.name}</text>
      `;
    }).join('');
    
    return `
      <svg viewBox="0 0 ${chartWidth} ${chartHeight}" style="max-width: 100%; height: auto;">
        <!-- Bars -->
        ${bars}
        
        <!-- Axes -->
        <line x1="${margin.left}" y1="${margin.top + plotHeight}" x2="${margin.left + plotWidth}" y2="${margin.top + plotHeight}" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
        <line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${margin.top + plotHeight}" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
        
        <!-- Labels -->
        ${xAxisLabels}
        
        <!-- Legend -->
        ${legend}
      </svg>
    `;
  }

  function generateLineChart(series, colors) {
    if (!series || series.length === 0) return '<p style="color: rgba(255,255,255,0.7);">No data available</p>';
    
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
      return `<text x="${x}" y="${chartHeight - 15}" text-anchor="middle" font-size="12" fill="rgba(255,255,255,0.7)">${label}</text>`;
    }).join('');
    
    const legend = series.map((s, index) => {
      const y = margin.top + index * 20;
      return `
        <rect x="${chartWidth - 100}" y="${y}" width="12" height="12" fill="${colors[index % colors.length]}" rx="2" />
        <text x="${chartWidth - 80}" y="${y + 9}" font-size="12" fill="rgba(255,255,255,0.9)">${s.name}</text>
      `;
    }).join('');
    
    return `
      <svg viewBox="0 0 ${chartWidth} ${chartHeight}" style="max-width: 100%; height: auto;">
        <!-- Lines -->
        ${lines}
        
        <!-- Axes -->
        <line x1="${margin.left}" y1="${margin.top + plotHeight}" x2="${margin.left + plotWidth}" y2="${margin.top + plotHeight}" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
        <line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${margin.top + plotHeight}" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
        
        <!-- Labels -->
        ${xAxisLabels}
        
        <!-- Legend -->
        ${legend}
      </svg>
    `;
  }

  function generatePieChart(segments, colors) {
    if (!segments || segments.length === 0) return '<p style="color: rgba(255,255,255,0.7);">No data available</p>';
    
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
      
      return `<path d="${pathData}" fill="${colors[index % colors.length]}" stroke="rgba(15,15,26,0.3)" stroke-width="2" />`;
    }).join('');
    
    const legend = segments.map((segment, index) => {
      const y = 20 + index * 25;
      const percentage = ((segment.value / total) * 100).toFixed(1);
      return `
        <rect x="320" y="${y}" width="15" height="15" fill="${colors[index % colors.length]}" rx="2" />
        <text x="345" y="${y + 12}" font-size="14" fill="rgba(255,255,255,0.9)">${segment.label} (${percentage}%)</text>
      `;
    }).join('');
    
    return `
      <svg viewBox="0 0 500 ${chartSize}" style="max-width: 100%; height: auto;">
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
  <title>${companyName} — Gradient Wave</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@800;500&display=swap">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --accent: ${accentColor};
      --bg: #0f0f1a;
      --gradient-1: #667eea;
      --gradient-2: #764ba2;
      --gradient-3: #f472b6;
      --text: rgba(255, 255, 255, 0.9);
      --text-muted: rgba(255, 255, 255, 0.7);
      --glass: rgba(255, 255, 255, 0.05);
      --glass-border: rgba(255, 255, 255, 0.1);
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
      font-family: 'Inter', -apple-system, sans-serif;
      background: var(--bg);
      color: var(--text);
      -webkit-font-smoothing: antialiased;
      position: relative;
    }

    /* Animated Background Mesh */
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background: 
        radial-gradient(circle at 20% 30%, var(--gradient-1) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, var(--gradient-2) 0%, transparent 50%),
        radial-gradient(circle at 60% 20%, var(--gradient-3) 0%, transparent 50%),
        radial-gradient(circle at 30% 80%, var(--gradient-1) 0%, transparent 50%);
      opacity: 0.15;
      animation: meshMove 20s ease-in-out infinite alternate;
      z-index: -2;
    }

    @keyframes meshMove {
      0% { 
        background: 
          radial-gradient(circle at 20% 30%, var(--gradient-1) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, var(--gradient-2) 0%, transparent 50%),
          radial-gradient(circle at 60% 20%, var(--gradient-3) 0%, transparent 50%),
          radial-gradient(circle at 30% 80%, var(--gradient-1) 0%, transparent 50%);
      }
      100% { 
        background: 
          radial-gradient(circle at 80% 80%, var(--gradient-1) 0%, transparent 50%),
          radial-gradient(circle at 10% 20%, var(--gradient-2) 0%, transparent 50%),
          radial-gradient(circle at 70% 90%, var(--gradient-3) 0%, transparent 50%),
          radial-gradient(circle at 40% 10%, var(--gradient-1) 0%, transparent 50%);
      }
    }

    /* Floating Orbs */
    .floating-orbs {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: -1;
    }
    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(40px);
      animation: orbFloat 15s ease-in-out infinite;
    }
    .orb--1 {
      width: 200px;
      height: 200px;
      background: var(--gradient-1);
      top: 10%;
      right: 10%;
      animation-delay: 0s;
    }
    .orb--2 {
      width: 300px;
      height: 300px;
      background: var(--gradient-2);
      bottom: 20%;
      left: -10%;
      animation-delay: 5s;
    }
    .orb--3 {
      width: 150px;
      height: 150px;
      background: var(--gradient-3);
      top: 50%;
      right: -5%;
      animation-delay: 10s;
    }

    @keyframes orbFloat {
      0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.1; }
      50% { transform: translate(-20px, -30px) scale(1.1); opacity: 0.2; }
    }

    /* Glass Morphism Cards */
    .glass-card {
      background: var(--glass);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
      border-radius: 16px;
      padding: 40px;
      transition: all 0.6s ease;
    }

    .glass-card:hover {
      background: rgba(255, 255, 255, 0.08);
      transform: translateY(-2px);
      box-shadow: 0 20px 60px rgba(102, 126, 234, 0.2);
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
      max-width: 900px;
      width: 100%;
      opacity: 0;
      transform: translateY(30px);
      animation: flowIn 0.7s ease forwards;
    }

    /* === Title Slide === */
    .slide--title {
      text-align: center;
    }
    .slide__badge {
      display: inline-block;
      padding: 12px 24px;
      background: linear-gradient(135deg, var(--gradient-1), var(--gradient-2));
      color: #fff;
      border-radius: 100px;
      font-family: 'Cabinet Grotesk', sans-serif;
      font-size: 0.9rem;
      font-weight: 500;
      letter-spacing: 0.1em;
      margin-bottom: 32px;
      text-transform: uppercase;
      box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
    }
    .slide--title h1 {
      font-family: 'Cabinet Grotesk', sans-serif;
      font-size: clamp(2.5rem, 6vw, 4.5rem);
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1.1;
      margin-bottom: 24px;
      background: linear-gradient(135deg, var(--text), rgba(255,255,255,0.7));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .slide__subtitle {
      font-size: clamp(1.1rem, 2.5vw, 1.4rem);
      color: var(--text-muted);
      font-weight: 400;
      max-width: 600px;
      margin: 0 auto 24px auto;
      line-height: 1.6;
    }
    .slide__title-badge {
      display: inline-block;
      background: var(--gradient-3);
      color: white;
      padding: 8px 20px;
      border-radius: 100px;
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-top: 24px;
    }

    /* === Content Slides === */
    .slide__number {
      font-family: 'Cabinet Grotesk', sans-serif;
      font-size: 0.8rem;
      color: var(--gradient-1);
      font-weight: 500;
      letter-spacing: 0.1em;
      margin-bottom: 16px;
    }
    .slide h2 {
      font-family: 'Cabinet Grotesk', sans-serif;
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 800;
      margin-bottom: 32px;
      letter-spacing: -0.02em;
      line-height: 1.2;
      background: linear-gradient(135deg, var(--text), rgba(255,255,255,0.8));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .slide__bullets {
      list-style: none;
      font-size: clamp(1rem, 2vw, 1.2rem);
      line-height: 1.8;
    }
    .slide__bullets li {
      padding: 16px 0 16px 32px;
      position: relative;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      color: var(--text-muted);
      transition: color 0.3s ease;
    }
    .slide__bullets li:last-child { border-bottom: none; }
    .slide__bullets li:hover { color: var(--text); }
    .slide__bullets li::before {
      content: '';
      position: absolute;
      left: 0;
      top: 24px;
      width: 12px;
      height: 12px;
      background: linear-gradient(135deg, var(--gradient-1), var(--gradient-2));
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
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
      margin-top: 32px;
    }
    .slide__stat {
      text-align: center;
      padding: 40px 32px;
      transition: all 0.6s ease;
      animation: statReveal 0.8s ease forwards;
      animation-delay: var(--delay, 0s);
      opacity: 0;
      transform: translateY(20px);
    }
    .slide__stat-number {
      font-family: 'Cabinet Grotesk', sans-serif;
      font-size: clamp(2.5rem, 5vw, 3.5rem);
      font-weight: 800;
      background: linear-gradient(135deg, var(--gradient-1), var(--gradient-3));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 12px;
      line-height: 1;
    }
    .slide__stat-label {
      font-size: 0.95rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 500;
    }

    /* === Quote === */
    .slide--quote .slide__content {
      text-align: center;
      max-width: 800px;
    }
    .slide__quote {
      font-size: clamp(1.5rem, 3.5vw, 2.2rem);
      font-style: italic;
      font-weight: 400;
      line-height: 1.5;
      color: var(--text);
      margin: 0 0 32px 0;
      position: relative;
    }
    .slide__quote::before {
      content: '"';
      font-size: 5rem;
      color: var(--gradient-1);
      position: absolute;
      top: -20px;
      left: 50%;
      transform: translateX(-50%);
      font-weight: 800;
      opacity: 0.3;
    }
    .slide__attribution {
      font-size: 1rem;
      color: var(--text-muted);
      font-weight: 500;
      font-style: normal;
    }

    /* === Table === */
    .table-container {
      margin-top: 32px;
    }
    .slide__table {
      width: 100%;
      border-collapse: collapse;
      border-radius: 12px;
      overflow: hidden;
    }
    .slide__table th,
    .slide__table td {
      padding: 20px;
      text-align: left;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .slide__table th {
      background: linear-gradient(135deg, var(--gradient-1), var(--gradient-2));
      font-family: 'Cabinet Grotesk', sans-serif;
      font-weight: 500;
      color: #fff;
      text-transform: uppercase;
      font-size: 0.9rem;
      letter-spacing: 0.05em;
    }
    .slide__table td {
      font-weight: 400;
      color: var(--text-muted);
      background: rgba(255, 255, 255, 0.03);
    }
    .slide__table tr:hover td {
      background: rgba(255, 255, 255, 0.08);
    }

    /* === Charts === */
    .slide__chart {
      margin-top: 32px;
      padding: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    /* === Image + Text === */
    .slide__image-text {
      display: grid;
      gap: 40px;
      align-items: center;
      margin-top: 32px;
      padding: 32px;
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
    }
    .slide__image img {
      width: 100%;
      height: auto;
      display: block;
      transition: transform 0.6s ease;
    }
    .slide__image img:hover {
      transform: scale(1.05);
    }
    .slide__text p {
      font-size: clamp(1rem, 2vw, 1.2rem);
      line-height: 1.7;
      color: var(--text-muted);
      margin-bottom: 16px;
    }

    /* === Progress === */
    .progress {
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--gradient-1), var(--gradient-2), var(--gradient-3));
      z-index: 100;
      transition: width 0.6s ease;
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
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      border: none;
      cursor: pointer;
      transition: all 0.6s ease;
      padding: 0;
    }
    .nav-dot--active {
      background: var(--gradient-1);
      transform: scale(1.4);
      box-shadow: 0 0 20px var(--gradient-1);
    }

    /* === Slide Counter === */
    .slide-counter {
      position: fixed;
      bottom: 32px;
      right: 32px;
      font-family: 'Cabinet Grotesk', sans-serif;
      font-size: 0.8rem;
      color: var(--text-muted);
      z-index: 100;
      font-weight: 500;
    }

    /* === Animations === */
    @keyframes flowIn {
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes statReveal {
      to { opacity: 1; transform: translateY(0); }
    }

    /* === Print === */
    @media print {
      html { scroll-snap-type: none; }
      .slide { min-height: auto; page-break-after: always; padding: 40px; break-inside: avoid; }
      .progress, .nav-dots, .slide-counter { display: none; }
      .slide__content { opacity: 1; transform: none; animation: none; }
      body::before, .floating-orbs { display: none; }
    }

    @media (max-width: 768px) {
      .slide { padding: 40px 24px; }
      .nav-dots { right: 16px; gap: 8px; }
      .nav-dot { width: 8px; height: 8px; }
      .slide__two-column { grid-template-columns: 1fr; gap: 32px; }
      .slide__stats { grid-template-columns: 1fr; gap: 24px; }
      .slide__image-text,
      .slide__image-text--left,
      .slide__image-text--right { 
        grid-template-columns: 1fr; 
        gap: 24px; 
      }
      .slide__image-text--right .slide__image { order: 0; }
      .glass-card { padding: 24px; }
      .orb { display: none; }
    }
  </style>
</head>
<body>
  <div class="progress" id="progress"></div>

  <div class="nav-dots" id="navDots">
    ${slides.map((_, i) => `<button class="nav-dot${i === 0 ? ' nav-dot--active' : ''}" data-index="${i}" aria-label="Go to slide ${i + 1}"></button>`).join('\n    ')}
  </div>

  <div class="slide-counter" id="slideCounter">1 / ${slideCount}</div>

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
  <div style="position: fixed; bottom: 16px; left: 16px; z-index: 9999; font-size: 18px; font-weight: 600; color: rgba(255, 255, 255, 0.4); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; pointer-events: none;">
    <a href="https://htmldecks.com" target="_blank" style="color: inherit; text-decoration: none; pointer-events: auto;">Made with HTML Decks</a>
  </div>` : ''}
</body>
</html>`;
}