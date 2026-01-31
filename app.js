/**
 * HTML Decks — Main Application Logic (Canva-style Inline Editor)
 * 
 * Handles:
 * - Template gallery rendering & selection
 * - Inline slide canvas with contentEditable
 * - Slide sidebar with thumbnails
 * - Floating toolbar for formatting
 * - Download generation
 * - Scroll animations
 */

(function () {
  'use strict';

  // ===================================================================
  // TEMPLATE REGISTRY
  // ===================================================================

  const TEMPLATES = [
    {
      id: 'startup-pitch',
      name: 'Startup Pitch',
      description: 'Dark gradient — for investor pitches',
      gradient: 'linear-gradient(135deg, #5A49E1, #2D1B69)',
      available: true,
      generator: generateStartupPitch,
      defaults: {
        companyName: 'Acme Corp',
        accentColor: '#7B6EF6',
        slides: [
          { type: 'title', title: 'Acme Corp', subtitle: 'The Future of Smart Automation' },
          { type: 'bullets', title: 'The Problem', content: '80% of businesses waste 20+ hours/week on manual tasks\nExisting solutions are fragmented and expensive\nTeams are burned out from repetitive work' },
          { type: 'stats', title: 'Our Traction', metrics: [
            { number: '2,400', label: 'Active Companies' },
            { number: '$1.2M', label: 'ARR' },
            { number: '94%', label: 'Retention Rate' },
            { number: '72', label: 'NPS Score' }
          ]},
          { type: 'bar-chart', title: 'Revenue Growth', series: [
            { name: 'Revenue', data: [
              { label: 'Q1 2023', value: 200 },
              { label: 'Q2 2023', value: 350 },
              { label: 'Q3 2023', value: 600 },
              { label: 'Q4 2023', value: 1200 }
            ]}
          ]},
          { type: 'bullets', title: 'Our Solution', content: 'AI-powered automation platform\nOne-click integrations with 200+ tools\nSaves teams 15+ hours per week on average' },
          { type: 'title', title: 'The Ask', subtitle: 'Raising $5M Series A', badge: 'Investment Opportunity' },
        ],
      },
    },
    {
      id: 'sales-deck',
      name: 'Sales Deck',
      description: 'Clean light — for closing deals',
      gradient: 'linear-gradient(135deg, #4A9FF5, #1B6DC1)',
      available: true,
      generator: generateSalesDeck,
      defaults: {
        companyName: 'Acme Solutions',
        accentColor: '#4A9FF5',
        slides: [
          { type: 'title', title: 'Transform Your Workflow', subtitle: 'Acme Solutions helps teams ship faster with less friction' },
          { type: 'two-column', title: 'The Challenge', leftColumn: 'Your team spends 30% of time on coordination, not creation\n\nTools are disconnected — context gets lost between apps', rightColumn: 'Onboarding new team members takes weeks, not days\n\nProjects stall waiting for status updates' },
          { type: 'bullets', title: 'How We Help', content: 'Unified workspace that replaces 5+ tools\nAI assistant handles scheduling, notes, and follow-ups\nNew team members are productive in 48 hours' },
          { type: 'stats', title: 'Results That Matter', metrics: [
            { number: '42%', label: 'Faster Delivery' },
            { number: '3.2x', label: 'Team Satisfaction' },
            { number: '$240K', label: 'Annual Savings' }
          ]},
          { type: 'quote', quote: 'Switched our entire org in a week. Best decision we made.', attribution: 'VP Engineering, TechCo' },
          { type: 'title', title: 'Next Steps', subtitle: '14-day free pilot — no credit card required', badge: 'Free Trial' },
        ],
      },
    },
    {
      id: 'conference-talk',
      name: 'Conference Talk',
      description: 'Dark + amber — for the stage',
      gradient: 'linear-gradient(135deg, #1A1A2E, #D4A843)',
      available: true,
      generator: generateConferenceTalk,
      defaults: {
        companyName: 'Jane Doe',
        accentColor: '#D4A843',
        slides: [
          { type: 'title', title: 'The Future of Developer Experience', subtitle: 'Why the best tools feel invisible' },
          { type: 'bullets', title: 'Context', content: 'I\'ve been building developer tools for 12 years\nShipped products used by 500K+ developers\nKeep making the same mistakes — and learning from them' },
          { type: 'image-text', title: 'The Big Idea', imageUrl: 'https://via.placeholder.com/400x300/1A1A2E/D4A843?text=Great+Tools', description: 'The best developer tool is the one you forget you\'re using. It should feel like an extension of your thought process.', layout: 'image-left' },
          { type: 'quote', quote: 'Zero-config defaults that actually work. Error messages that tell you what to DO, not what went wrong.', attribution: 'Great DX Principles' },
          { type: 'bullets', title: 'The Anti-Patterns', content: 'Requiring a PhD in YAML to get started\n"Flexible" really meaning "nothing works out of the box"\nChangelogs that break more than they fix' },
          { type: 'title', title: 'Thank You', subtitle: '@janedoe on Twitter\njanedoe.dev' },
        ],
      },
    },
    {
      id: 'quarterly-review',
      name: 'Quarterly Review',
      description: 'Green/teal — for business reviews',
      gradient: 'linear-gradient(135deg, #38B584, #1A8A6A)',
      available: true,
      generator: generateQuarterlyReview,
      defaults: generateQuarterlyReview.defaults,
    },
    {
      id: 'product-launch',
      name: 'Product Launch',
      description: 'Vibrant gradient — for launches',
      gradient: 'linear-gradient(135deg, #E14A8B, #F5A623, #5A49E1)',
      available: true,
      generator: generateProductLaunch,
      defaults: generateProductLaunch.defaults,
    },
    {
      id: 'team-intro',
      name: 'Team Intro',
      description: 'Warm tones — for team pages',
      gradient: 'linear-gradient(135deg, #F5A623, #E8785E)',
      available: true,
      generator: generateTeamIntro,
      defaults: generateTeamIntro.defaults,
    },
    {
      id: 'investor-update',
      name: 'Investor Update',
      description: 'Swiss minimal — for updates',
      gradient: 'linear-gradient(135deg, #2C2C2C, #666)',
      available: true,
      generator: generateInvestorUpdate,
      defaults: generateInvestorUpdate.defaults,
    },
    {
      id: 'workshop',
      name: 'Workshop',
      description: 'Colorful friendly — for teaching',
      gradient: 'linear-gradient(135deg, #46D19A, #4A9FF5, #E14A8B)',
      available: true,
      generator: generateWorkshop,
      defaults: generateWorkshop.defaults,
    },
    {
      id: 'neon-cyber',
      name: 'Neon Cyber',
      description: 'Futuristic tech — cutting-edge presentations',
      gradient: 'linear-gradient(135deg, #0a0f1c, #00ffcc, #ff00aa)',
      available: true,
      generator: generateNeonCyber,
      defaults: {
        companyName: 'TechNova',
        accentColor: '#00ffcc',
        slides: [
          { type: 'title', title: 'The Future Is Now', subtitle: 'Revolutionizing the digital landscape with next-gen technology', badge: 'INNOVATION' },
          { type: 'bullets', title: 'System Status', content: 'Neural networks operating at 99.7% efficiency\nQuantum processors enabled across all nodes\nReal-time data streams synchronized globally' },
          { type: 'stats', title: 'Performance Metrics', metrics: [
            { number: '2.4M', label: 'TRANSACTIONS/SEC' },
            { number: '0.003s', label: 'LATENCY' },
            { number: '99.99%', label: 'UPTIME' }
          ]},
          { type: 'bar-chart', title: 'Growth Trajectory', series: [
            { name: 'Users', data: [
              { label: 'Q1', value: 1200 },
              { label: 'Q2', value: 2800 },
              { label: 'Q3', value: 5400 },
              { label: 'Q4', value: 8900 }
            ]}
          ]},
          { type: 'quote', quote: 'This platform has redefined what we thought was possible in real-time computing.', attribution: 'Dr. Sarah Chen, MIT' },
          { type: 'title', title: 'Access Granted', subtitle: 'Join the revolution', badge: 'EARLY ACCESS' },
        ],
      },
    },
    {
      id: 'deep-space',
      name: 'Deep Space',
      description: 'Cosmic inspiration — for visionary content',
      gradient: 'linear-gradient(135deg, #030712, #818cf8, #c084fc)',
      available: true,
      generator: generateDeepSpace,
      defaults: {
        companyName: 'Stellar Ventures',
        accentColor: '#818cf8',
        slides: [
          { type: 'title', title: 'Beyond the Horizon', subtitle: 'Exploring infinite possibilities in the vast expanse of innovation' },
          { type: 'bullets', title: 'Our Mission', content: 'To push the boundaries of human achievement\nTo explore uncharted territories of possibility\nTo inspire generations of tomorrow\'s pioneers' },
          { type: 'two-column', title: 'Vision & Reality', leftColumn: 'Where we see ourselves\n\nLeading the next wave of breakthrough discoveries\n\nBuilding bridges between imagination and reality', rightColumn: 'What we\'re building today\n\nFoundational technologies for tomorrow\n\nSustainable solutions for complex challenges' },
          { type: 'stats', title: 'Impact Metrics', metrics: [
            { number: '∞', label: 'POSSIBILITIES' },
            { number: '127', label: 'COUNTRIES REACHED' },
            { number: '2.8M', label: 'LIVES CHANGED' }
          ]},
          { type: 'quote', quote: 'The universe is not only stranger than we imagine, it is stranger than we can imagine. And that\'s exactly what makes it worth exploring.', attribution: 'Visionary Leader' },
          { type: 'title', title: 'Join the Journey', subtitle: 'The future is calling' },
        ],
      },
    },
    {
      id: 'paper-ink',
      name: 'Paper & Ink',
      description: 'Literary elegance — for thoughtful presentations',
      gradient: 'linear-gradient(135deg, #faf9f7, #c41e3a)',
      available: true,
      generator: generatePaperInk,
      defaults: {
        companyName: 'Chronicle & Co.',
        accentColor: '#c41e3a',
        slides: [
          { type: 'title', title: 'The Art of Storytelling', subtitle: 'Where words meet wisdom and narratives shape the future', badge: 'Editorial' },
          { type: 'bullets', title: 'Our Philosophy', content: 'Every story deserves to be told with grace and purpose\nWords have the power to change minds and move hearts\nCraftsmanship in communication is not a luxury, but a necessity' },
          { type: 'two-column', title: 'Tradition Meets Innovation', leftColumn: 'Time-tested principles\n\nEditorial excellence through decades of refinement\n\nClassical typography and thoughtful design', rightColumn: 'Modern applications\n\nDigital platforms with traditional sensibilities\n\nAccessible storytelling for contemporary audiences' },
          { type: 'stats', title: 'Our Reach', metrics: [
            { number: '847', label: 'Stories Published' },
            { number: '94%', label: 'Reader Satisfaction' },
            { number: '23', label: 'Awards Received' }
          ]},
          { type: 'quote', quote: 'The pen is mightier than the sword, but only when wielded with skill, purpose, and unwavering commitment to truth.', attribution: 'Edward Bulwer-Lytton (adapted)' },
          { type: 'title', title: 'Write Your Chapter', subtitle: 'Every voice matters in the grand narrative' },
        ],
      },
    },
    {
      id: 'brutalist',
      name: 'Brutalist',
      description: 'Raw & bold — for unconventional approaches',
      gradient: 'linear-gradient(135deg, #ffffff, #ff0000, #000000)',
      available: true,
      generator: generateBrutalist,
      defaults: {
        companyName: 'DISRUPTOR LABS',
        accentColor: '#ff0000',
        slides: [
          { type: 'title', title: 'BREAK THE RULES', subtitle: 'Sometimes the only way forward is to tear down what came before', badge: 'MANIFESTO' },
          { type: 'bullets', title: 'OUR PRINCIPLES', content: 'FORM FOLLOWS FUNCTION — NO EXCEPTIONS\nAUTHENTICITY OVER AESTHETICS\nREJECT THE CONVENTIONAL — EMBRACE THE RADICAL' },
          { type: 'stats', title: 'IMPACT BY NUMBERS', metrics: [
            { number: '100%', label: 'UNCOMPROMISING' },
            { number: '0', label: 'APOLOGIES' },
            { number: '∞', label: 'ATTITUDE' }
          ]},
          { type: 'bar-chart', title: 'DISRUPTION METRICS', series: [
            { name: 'CONVENTIONAL', data: [
              { label: 'BEFORE', value: 100 },
              { label: 'AFTER', value: 20 }
            ]},
            { name: 'REVOLUTIONARY', data: [
              { label: 'BEFORE', value: 10 },
              { label: 'AFTER', value: 95 }
            ]}
          ]},
          { type: 'quote', quote: 'THE ONLY WAY TO MAKE SENSE OUT OF CHANGE IS TO PLUNGE INTO IT, MOVE WITH IT, AND JOIN THE DANCE.', attribution: 'ALAN WATTS' },
          { type: 'title', title: 'JOIN THE REVOLUTION', subtitle: 'THE FUTURE BELONGS TO THE BOLD' },
        ],
      },
    },
    {
      id: 'gradient-wave',
      name: 'Gradient Wave',
      description: 'Modern SaaS — energetic tech vibes',
      gradient: 'linear-gradient(135deg, #667eea, #764ba2, #f472b6)',
      available: true,
      generator: generateGradientWave,
      defaults: {
        companyName: 'WaveFlow',
        accentColor: '#667eea',
        slides: [
          { type: 'title', title: 'The Future of Workflow', subtitle: 'Seamlessly connecting teams, ideas, and innovation through intelligent automation', badge: 'Beta Launch' },
          { type: 'bullets', title: 'Why Teams Choose Us', content: 'Reduce context switching by 70% with unified workspace\nAI-powered insights that learn from your team\'s patterns\nSeamless integrations with 200+ tools your team already uses\nReal-time collaboration that feels natural and effortless' },
          { type: 'stats', title: 'Platform Performance', metrics: [
            { number: '10K+', label: 'Active Teams' },
            { number: '99.9%', label: 'Uptime' },
            { number: '2.3x', label: 'Productivity Gain' },
            { number: '47ms', label: 'Avg Response Time' }
          ]},
          { type: 'bar-chart', title: 'User Growth', series: [
            { name: 'Monthly Active Users', data: [
              { label: 'Jan', value: 2400 },
              { label: 'Feb', value: 4200 },
              { label: 'Mar', value: 6800 },
              { label: 'Apr', value: 10200 }
            ]}
          ]},
          { type: 'quote', quote: 'WaveFlow transformed how our distributed team collaborates. The AI insights are genuinely helpful, not just noise.', attribution: 'Sarah Chen, VP Engineering' },
          { type: 'title', title: 'Ready to Flow?', subtitle: 'Join thousands of teams building the future', badge: 'Start Free Trial' },
        ],
      },
    },
    {
      id: 'terminal-green',
      name: 'Terminal Green',
      description: 'Developer focused — hacker aesthetic',
      gradient: 'linear-gradient(135deg, #0d1117, #39d353)',
      available: true,
      generator: generateTerminalGreen,
      defaults: {
        companyName: 'DevTools Inc',
        accentColor: '#39d353',
        slides: [
          { type: 'title', title: 'Building the Future of Code', subtitle: 'Tools that understand developers, by developers', badge: 'Open Source' },
          { type: 'bullets', title: 'Core Features', content: 'Lightning-fast build times with intelligent caching\nZero-config deployments that just work\nBuilt-in security scanning and dependency management\nSeamless local-to-production environment parity' },
          { type: 'two-column', title: 'Before vs After', leftColumn: 'Traditional DevOps\n\nHours of configuration\nBrittle build pipelines\nManual security checks', rightColumn: 'Our Platform\n\nZero configuration\nSelf-healing infrastructure\nAutomated security by default' },
          { type: 'stats', title: 'Performance Metrics', metrics: [
            { number: '15x', label: 'Faster Builds' },
            { number: '0', label: 'Config Files' },
            { number: '99.99%', label: 'Success Rate' }
          ]},
          { type: 'quote', quote: 'Finally, developer tools that feel like they were built by someone who actually codes for a living.', attribution: 'Alex Rodriguez, Senior Engineer' },
          { type: 'title', title: 'Join the Revolution', subtitle: 'Available on GitHub', badge: 'Star Us' },
        ],
      },
    },
    {
      id: 'swiss-modern',
      name: 'Swiss Modern',
      description: 'Clean precision — Bauhaus inspired',
      gradient: 'linear-gradient(135deg, #ffffff, #ff3300)',
      available: true,
      generator: generateSwissModern,
      defaults: {
        companyName: 'Design Systems Co',
        accentColor: '#ff3300',
        slides: [
          { type: 'title', title: 'Form Follows Function', subtitle: 'Building design systems that scale with mathematical precision', badge: 'Design Excellence' },
          { type: 'bullets', title: 'Our Philosophy', content: 'Every element serves a purpose\nConsistency creates trust\nSimplicity is the ultimate sophistication\nGrid systems bring order to chaos' },
          { type: 'two-column', title: 'Design Principles', leftColumn: 'Visual Hierarchy\n\nClear information architecture\nDeliberate use of whitespace', rightColumn: 'Systematic Approach\n\nModular components\nScalable design tokens' },
          { type: 'stats', title: 'Impact Metrics', metrics: [
            { number: '73%', label: 'Faster Development' },
            { number: '45%', label: 'Fewer Bugs' },
            { number: '12', label: 'Design Awards' }
          ]},
          { type: 'quote', quote: 'Good design is as little design as possible. Less, but better.', attribution: 'Dieter Rams' },
          { type: 'title', title: 'Build Better Systems', subtitle: 'Design with intention' },
        ],
      },
    },
    {
      id: 'warm-editorial',
      name: 'Warm Editorial',
      description: 'Human storytelling — magazine aesthetic',
      gradient: 'linear-gradient(135deg, #fffbf5, #b45309, #0369a1)',
      available: true,
      generator: generateWarmEditorial,
      defaults: generateWarmEditorial.defaults,
    },
  ];

  // ===================================================================
  // STATE
  // ===================================================================

  let selectedTemplate = null;
  let currentSlideIndex = 0;
  let slidesData = [];
  let debounceTimer = null;

  // ===================================================================
  // DOM REFERENCES
  // ===================================================================

  const $templateGrid = document.getElementById('templateGrid');
  const $editorName = document.getElementById('editorTemplateName');
  const $companyName = document.getElementById('companyName');
  const $accentColor = document.getElementById('accentColor');
  const $slideThumbnails = document.getElementById('slideThumbnails');
  const $addSlideBtn = document.getElementById('addSlideBtn');
  const $editorCanvas = document.getElementById('editorCanvas');
  const $editorToolbar = document.getElementById('editorToolbar');
  const $toolbarSlideType = document.getElementById('toolbarSlideType');
  const $downloadFreeBtn = document.getElementById('downloadFreeBtn');
  const $downloadProBtn = document.getElementById('downloadProBtn');
  const $changeTemplateBtn = document.getElementById('changeTemplateBtn');

  // ===================================================================
  // TEMPLATE GALLERY
  // ===================================================================

  function renderTemplateCards() {
    $templateGrid.innerHTML = TEMPLATES.map(tpl => `
      <div class="tpl-card animate-in ${!tpl.available ? 'tpl-card--coming-soon' : ''}" 
           data-template="${tpl.id}">
        <div class="tpl-card__preview">
          <div class="tpl-card__thumb" style="background: ${tpl.gradient}">
            ${tpl.name}
          </div>
          ${!tpl.available ? '<div class="tpl-card__coming">Coming Soon</div>' : ''}
          ${tpl.id === 'startup-pitch' ? '<div class="tpl-card__badge" style="position:absolute;top:8px;right:8px;background:#46D19A;color:#fff;padding:3px 10px;border-radius:20px;font-size:0.7rem;font-weight:700;letter-spacing:0.05em;">FREE</div>' : ''}
          <div class="tpl-card__check">✓</div>
        </div>
        <div class="tpl-card__info">
          <div class="tpl-card__name">${tpl.name}</div>
          <div class="tpl-card__desc">${tpl.description}</div>
        </div>
      </div>
    `).join('');

    $templateGrid.querySelectorAll('.tpl-card').forEach(card => {
      card.addEventListener('click', () => {
        const tpl = TEMPLATES.find(t => t.id === card.dataset.template);
        if (!tpl || !tpl.available) return;
        selectTemplate(tpl);
      });
    });
  }

  function selectTemplate(tpl) {
    selectedTemplate = tpl;

    $templateGrid.querySelectorAll('.tpl-card').forEach(c => {
      c.classList.toggle('tpl-card--selected', c.dataset.template === tpl.id);
    });

    $editorName.textContent = tpl.name;
    $companyName.value = tpl.defaults.companyName;
    $accentColor.value = tpl.defaults.accentColor;

    // Deep clone slides data
    slidesData = JSON.parse(JSON.stringify(tpl.defaults.slides));
    currentSlideIndex = 0;

    renderSidebar();
    renderCanvas();
    updateDownloadButtons();

    document.getElementById('editor').scrollIntoView({ behavior: 'smooth' });
  }

  // ===================================================================
  // SIDEBAR (Slide Thumbnails)
  // ===================================================================

  function renderSidebar() {
    $slideThumbnails.innerHTML = slidesData.map((slide, i) => {
      const title = slide.title || slide.quote || 'Untitled';
      const displayTitle = title.length > 20 ? title.substring(0, 20) + '...' : title;
      return `
        <div class="slide-thumbnail ${i === currentSlideIndex ? 'slide-thumbnail--active' : ''}" 
             data-index="${i}">
          <span class="slide-thumbnail__num">${i + 1}</span>
          <div class="slide-thumbnail__info">
            <div class="slide-thumbnail__title">${escapeHTML(displayTitle)}</div>
            <div class="slide-thumbnail__type">${slide.type}</div>
          </div>
          <button class="slide-thumbnail__delete" data-delete="${i}" title="Delete slide">✕</button>
        </div>
      `;
    }).join('');

    // Attach click handlers
    $slideThumbnails.querySelectorAll('.slide-thumbnail').forEach(thumb => {
      thumb.addEventListener('click', (e) => {
        if (e.target.closest('.slide-thumbnail__delete')) return;
        currentSlideIndex = parseInt(thumb.dataset.index, 10);
        renderSidebar();
        renderCanvas();
      });
    });

    // Delete handlers
    $slideThumbnails.querySelectorAll('.slide-thumbnail__delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(btn.dataset.delete, 10);
        removeSlide(index);
      });
    });
  }

  // ===================================================================
  // CANVAS (Inline Slide Rendering)
  // ===================================================================

  function renderCanvas() {
    if (!selectedTemplate || slidesData.length === 0) {
      $editorCanvas.innerHTML = '<div class="slide-preview"><p style="opacity: 0.5;">Select a template to start editing</p></div>';
      return;
    }

    const slide = slidesData[currentSlideIndex];
    const accentColor = $accentColor.value;
    const companyName = $companyName.value;

    // Apply template-specific styling
    const templateStyles = getTemplateStyles(selectedTemplate.id, accentColor);
    
    let slideHTML = '';
    
    switch (slide.type) {
      case 'title':
        slideHTML = renderTitleSlide(slide, companyName);
        break;
      case 'bullets':
        slideHTML = renderBulletsSlide(slide);
        break;
      case 'two-column':
        slideHTML = renderTwoColumnSlide(slide);
        break;
      case 'stats':
        slideHTML = renderStatsSlide(slide);
        break;
      case 'quote':
        slideHTML = renderQuoteSlide(slide);
        break;
      case 'table':
        slideHTML = renderTableSlide(slide);
        break;
      case 'bar-chart':
      case 'line-chart':
      case 'pie-chart':
        slideHTML = renderChartSlide(slide);
        break;
      case 'image-text':
        slideHTML = renderImageTextSlide(slide);
        break;
      default:
        slideHTML = renderBulletsSlide(slide);
    }

    $editorCanvas.innerHTML = `
      <div class="slide-preview" style="${templateStyles}">
        <div class="slide__content">
          ${slideHTML}
        </div>
      </div>
    `;

    attachEditableHandlers();
  }

  function getTemplateStyles(templateId, accentColor) {
    // Return CSS custom properties for template styling
    const baseStyles = {
      'startup-pitch': `--accent: ${accentColor}; background: linear-gradient(135deg, #2D1B69, #1A1145);`,
      'sales-deck': `--accent: ${accentColor}; background: linear-gradient(135deg, #f8fafc, #e2e8f0); color: #1e293b;`,
      'conference-talk': `--accent: ${accentColor}; background: linear-gradient(135deg, #1A1A2E, #2D2040);`,
      'quarterly-review': `--accent: ${accentColor}; background: linear-gradient(135deg, #134e4a, #0f766e);`,
      'product-launch': `--accent: ${accentColor}; background: linear-gradient(135deg, #2D1B69, #1A1145);`,
      'team-intro': `--accent: ${accentColor}; background: linear-gradient(135deg, #fef3c7, #fed7aa);`,
      'investor-update': `--accent: ${accentColor}; background: #1a1a1a; color: #fff;`,
      'workshop': `--accent: ${accentColor}; background: linear-gradient(135deg, #f0fdf4, #dcfce7);`,
      'neon-cyber': `--accent: ${accentColor}; background: #0a0f1c; color: #fff;`,
      'deep-space': `--accent: ${accentColor}; background: linear-gradient(135deg, #030712, #0f172a); color: #fff;`,
      'paper-ink': `--accent: ${accentColor}; background: #faf9f7; color: #1a1a1a;`,
      'brutalist': `--accent: ${accentColor}; background: #fff; color: #000;`,
      'gradient-wave': `--accent: ${accentColor}; background: linear-gradient(135deg, #1e1b4b, #312e81); color: #fff;`,
      'terminal-green': `--accent: ${accentColor}; background: #0d1117; color: #c9d1d9;`,
      'swiss-modern': `--accent: ${accentColor}; background: #fff; color: #000;`,
      'warm-editorial': `--accent: ${accentColor}; background: #fffbf5; color: #292524;`,
    };
    return baseStyles[templateId] || baseStyles['startup-pitch'];
  }

  // ===================================================================
  // SLIDE TYPE RENDERERS
  // ===================================================================

  function renderTitleSlide(slide, companyName) {
    return `
      ${slide.badge ? `<div class="slide__badge" contenteditable="true" data-field="badge" data-placeholder="Badge text">${escapeHTML(slide.badge)}</div>` : ''}
      <h1 contenteditable="true" data-field="title" data-placeholder="Main Title">${escapeHTML(slide.title || '')}</h1>
      ${slide.subtitle !== undefined ? `<p class="slide__subtitle" contenteditable="true" data-field="subtitle" data-placeholder="Subtitle">${escapeHTML(slide.subtitle || '')}</p>` : ''}
      <div class="slide__accent-bar"></div>
      <p class="slide__company">${escapeHTML(companyName)}</p>
    `;
  }

  function renderBulletsSlide(slide) {
    const bullets = (slide.content || '').split('\n').filter(line => line.trim());
    const bulletsHTML = bullets.map((bullet, i) => 
      `<li contenteditable="true" data-field="content" data-bullet-index="${i}" data-placeholder="Bullet point">${escapeHTML(bullet.replace(/^[-•]\s*/, ''))}</li>`
    ).join('');
    
    return `
      <h2 contenteditable="true" data-field="title" data-placeholder="Slide Title">${escapeHTML(slide.title || '')}</h2>
      <ul class="slide__bullets" id="bulletsList">
        ${bulletsHTML}
        <li class="slide__bullet-add" id="addBulletBtn">+ Add bullet</li>
      </ul>
    `;
  }

  function renderTwoColumnSlide(slide) {
    const leftBullets = (slide.leftColumn || '').split('\n').filter(line => line.trim());
    const rightBullets = (slide.rightColumn || '').split('\n').filter(line => line.trim());
    
    const leftHTML = leftBullets.map((bullet, i) => 
      `<li contenteditable="true" data-field="leftColumn" data-bullet-index="${i}" data-placeholder="Left column point">${escapeHTML(bullet.replace(/^[-•]\s*/, ''))}</li>`
    ).join('');
    
    const rightHTML = rightBullets.map((bullet, i) => 
      `<li contenteditable="true" data-field="rightColumn" data-bullet-index="${i}" data-placeholder="Right column point">${escapeHTML(bullet.replace(/^[-•]\s*/, ''))}</li>`
    ).join('');
    
    return `
      <h2 contenteditable="true" data-field="title" data-placeholder="Slide Title">${escapeHTML(slide.title || '')}</h2>
      <div class="slide__two-column">
        <div class="slide__column">
          <ul class="slide__bullets">
            ${leftHTML}
            <li class="slide__bullet-add" data-add-bullet="leftColumn">+ Add bullet</li>
          </ul>
        </div>
        <div class="slide__column">
          <ul class="slide__bullets">
            ${rightHTML}
            <li class="slide__bullet-add" data-add-bullet="rightColumn">+ Add bullet</li>
          </ul>
        </div>
      </div>
    `;
  }

  function renderStatsSlide(slide) {
    const metrics = slide.metrics || [];
    const statsHTML = metrics.map((metric, i) => `
      <div class="slide__stat" data-metric-index="${i}">
        <div class="slide__stat-number" contenteditable="true" data-field="metrics" data-metric-index="${i}" data-metric-field="number" data-placeholder="100">${escapeHTML(metric.number || '')}</div>
        <div class="slide__stat-label" contenteditable="true" data-field="metrics" data-metric-index="${i}" data-metric-field="label" data-placeholder="Label">${escapeHTML(metric.label || '')}</div>
      </div>
    `).join('');
    
    return `
      <h2 contenteditable="true" data-field="title" data-placeholder="Slide Title">${escapeHTML(slide.title || '')}</h2>
      <div class="slide__stats" id="statsContainer">
        ${statsHTML}
      </div>
      <button class="slide__add-stat" id="addStatBtn" style="margin-top: 16px; padding: 8px 16px; background: rgba(255,255,255,0.1); border: none; border-radius: 8px; color: inherit; cursor: pointer; opacity: 0.6;">+ Add Metric</button>
    `;
  }

  function renderQuoteSlide(slide) {
    return `
      <blockquote class="slide__quote" contenteditable="true" data-field="quote" data-placeholder="Enter your quote here...">${escapeHTML(slide.quote || '')}</blockquote>
      <cite class="slide__attribution" contenteditable="true" data-field="attribution" data-placeholder="— Attribution">— ${escapeHTML(slide.attribution || '')}</cite>
    `;
  }

  function renderTableSlide(slide) {
    const tableData = slide.tableData || [['Header 1', 'Header 2'], ['Row 1', 'Data']];
    const numCols = tableData[0] ? tableData[0].length : 2;
    
    const tableHTML = tableData.map((row, rowIndex) => {
      const tag = rowIndex === 0 ? 'th' : 'td';
      const cells = row.map((cell, colIndex) => 
        `<${tag} contenteditable="true" data-field="tableData" data-row="${rowIndex}" data-col="${colIndex}" data-placeholder="Cell">${escapeHTML(cell)}</${tag}>`
      ).join('');
      // Add delete row button for non-header rows
      const deleteBtn = rowIndex > 0 
        ? `<td class="slide__table-action"><button class="slide__table-delete-row" data-delete-row="${rowIndex}" title="Delete row">✕</button></td>` 
        : `<th class="slide__table-action"></th>`;
      return `<tr>${cells}${deleteBtn}</tr>`;
    }).join('');
    
    // Column delete buttons row
    const colDeleteRow = `<tr class="slide__table-col-actions">
      ${Array(numCols).fill(0).map((_, i) => 
        `<td><button class="slide__table-delete-col" data-delete-col="${i}" title="Delete column">✕</button></td>`
      ).join('')}
      <td></td>
    </tr>`;
    
    return `
      <h2 contenteditable="true" data-field="title" data-placeholder="Slide Title">${escapeHTML(slide.title || '')}</h2>
      <div class="slide__table-wrapper">
        <table class="slide__table">
          ${tableHTML}
          ${colDeleteRow}
        </table>
        <div class="slide__table-controls">
          <button class="slide__table-add" id="addTableRow" title="Add row">+ Row</button>
          <button class="slide__table-add" id="addTableCol" title="Add column">+ Column</button>
        </div>
      </div>
    `;
  }

  function renderChartSlide(slide) {
    // For charts, we'll render a simplified placeholder with the data
    // The actual chart will be generated by the template on download
    const chartColors = ['#5A49E1', '#46D19A', '#F5A623', '#E14A8B', '#4A9FF5'];
    
    let chartPreview = '';
    let chartEditor = '';
    
    if (slide.type === 'bar-chart' && slide.series && slide.series[0]) {
      const data = slide.series[0].data || [];
      const maxVal = Math.max(...data.map(d => d.value || 0), 1);
      const bars = data.map((d, i) => {
        const height = ((d.value || 0) / maxVal) * 100;
        return `
          <div class="slide__chart-bar-container" style="display: flex; flex-direction: column; align-items: center; flex: 1; max-width: 80px;">
            <div style="height: 150px; display: flex; align-items: flex-end; width: 100%;">
              <div class="slide__chart-bar" style="width: 100%; height: ${height}%; background: ${chartColors[i % chartColors.length]}; border-radius: 4px 4px 0 0; cursor: pointer;" data-bar-index="${i}" title="Click to edit"></div>
            </div>
            <div style="font-size: 0.75rem; margin-top: 8px; opacity: 0.7;">${escapeHTML(d.label || '')}</div>
          </div>
        `;
      }).join('');
      
      chartPreview = `<div class="slide__chart-bars" style="display: flex; gap: 12px; justify-content: center; padding: 20px;">${bars}</div>`;
      
      // Editable data table for bar chart
      const dataRows = data.map((d, i) => `
        <tr>
          <td><input type="text" class="slide__chart-input" data-chart-field="label" data-chart-index="${i}" value="${escapeHTML(d.label || '')}" placeholder="Label"></td>
          <td><input type="number" class="slide__chart-input" data-chart-field="value" data-chart-index="${i}" value="${d.value || 0}" placeholder="Value"></td>
          <td><button class="slide__chart-delete-row" data-delete-chart-row="${i}" title="Delete">✕</button></td>
        </tr>
      `).join('');
      
      chartEditor = `
        <div class="slide__chart-editor" id="chartEditor">
          <div class="slide__chart-editor-header">
            <span>Edit Chart Data</span>
            <button class="slide__chart-editor-close" id="closeChartEditor">✕</button>
          </div>
          <div class="slide__chart-type-selector">
            <label>Chart Type:</label>
            <select id="chartTypeSelect" class="slide__chart-type-select">
              <option value="bar-chart" ${slide.type === 'bar-chart' ? 'selected' : ''}>Bar Chart</option>
              <option value="line-chart" ${slide.type === 'line-chart' ? 'selected' : ''}>Line Chart</option>
              <option value="pie-chart" ${slide.type === 'pie-chart' ? 'selected' : ''}>Pie Chart</option>
            </select>
          </div>
          <table class="slide__chart-data-table">
            <thead><tr><th>Label</th><th>Value</th><th></th></tr></thead>
            <tbody>${dataRows}</tbody>
          </table>
          <button class="slide__chart-add-row" id="addChartRow">+ Add Data Point</button>
        </div>
      `;
    } else if (slide.type === 'pie-chart') {
      const segments = slide.segments || [{ label: 'A', value: 60 }, { label: 'B', value: 40 }];
      const total = segments.reduce((sum, s) => sum + (s.value || 0), 0) || 1;
      
      // Simple pie preview
      let cumulativePercent = 0;
      const pieSlices = segments.map((seg, i) => {
        const percent = (seg.value || 0) / total;
        const startAngle = cumulativePercent * 360;
        cumulativePercent += percent;
        const endAngle = cumulativePercent * 360;
        
        // For simplicity, just show colored segments in a legend
        return `<div style="display: flex; align-items: center; gap: 8px; margin: 4px 0;">
          <div style="width: 16px; height: 16px; background: ${chartColors[i % chartColors.length]}; border-radius: 2px;"></div>
          <span style="font-size: 0.85rem;">${escapeHTML(seg.label || 'Segment')} (${seg.value || 0})</span>
        </div>`;
      }).join('');
      
      chartPreview = `
        <div style="display: flex; align-items: center; justify-content: center; gap: 40px; padding: 20px;">
          <svg width="150" height="150" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="${chartColors[0]}" />
            ${segments.length > 1 ? `<circle cx="50" cy="50" r="40" fill="${chartColors[1]}" stroke-dasharray="${(segments[1].value / total) * 251.2} 251.2" stroke-dashoffset="${-(segments[0].value / total) * 251.2}" stroke-width="80" stroke="${chartColors[1]}" fill="none" transform="rotate(-90 50 50)"/>` : ''}
          </svg>
          <div>${pieSlices}</div>
        </div>
      `;
      
      // Editable data for pie chart
      const dataRows = segments.map((seg, i) => `
        <tr>
          <td><input type="text" class="slide__chart-input" data-chart-field="label" data-chart-index="${i}" data-chart-type="pie" value="${escapeHTML(seg.label || '')}" placeholder="Label"></td>
          <td><input type="number" class="slide__chart-input" data-chart-field="value" data-chart-index="${i}" data-chart-type="pie" value="${seg.value || 0}" placeholder="Value"></td>
          <td><button class="slide__chart-delete-row" data-delete-chart-row="${i}" data-chart-type="pie" title="Delete">✕</button></td>
        </tr>
      `).join('');
      
      chartEditor = `
        <div class="slide__chart-editor" id="chartEditor">
          <div class="slide__chart-editor-header">
            <span>Edit Chart Data</span>
            <button class="slide__chart-editor-close" id="closeChartEditor">✕</button>
          </div>
          <div class="slide__chart-type-selector">
            <label>Chart Type:</label>
            <select id="chartTypeSelect" class="slide__chart-type-select">
              <option value="bar-chart" ${slide.type === 'bar-chart' ? 'selected' : ''}>Bar Chart</option>
              <option value="line-chart" ${slide.type === 'line-chart' ? 'selected' : ''}>Line Chart</option>
              <option value="pie-chart" ${slide.type === 'pie-chart' ? 'selected' : ''}>Pie Chart</option>
            </select>
          </div>
          <table class="slide__chart-data-table">
            <thead><tr><th>Label</th><th>Value</th><th></th></tr></thead>
            <tbody>${dataRows}</tbody>
          </table>
          <button class="slide__chart-add-row" id="addChartRow" data-chart-type="pie">+ Add Segment</button>
        </div>
      `;
    } else if (slide.type === 'line-chart' && slide.series && slide.series[0]) {
      const data = slide.series[0].data || [];
      const maxY = Math.max(...data.map(d => d.y || d.value || 0), 1);
      
      // Generate SVG polyline points
      const points = data.map((d, i) => {
        const x = 10 + (i / Math.max(data.length - 1, 1)) * 80;
        const y = 45 - ((d.y || d.value || 0) / maxY) * 35;
        return `${x},${y}`;
      }).join(' ');
      
      chartPreview = `
        <div style="text-align: center; padding: 20px;">
          <svg width="300" height="150" viewBox="0 0 100 50">
            <polyline points="${points}" fill="none" stroke="${chartColors[0]}" stroke-width="2"/>
            ${data.map((d, i) => {
              const x = 10 + (i / Math.max(data.length - 1, 1)) * 80;
              const y = 45 - ((d.y || d.value || 0) / maxY) * 35;
              return `<circle cx="${x}" cy="${y}" r="3" fill="${chartColors[0]}"/>`;
            }).join('')}
          </svg>
          <div style="display: flex; justify-content: space-around; margin-top: 8px; font-size: 0.75rem; opacity: 0.7;">
            ${data.map(d => `<span>${escapeHTML(d.x || d.label || '')}</span>`).join('')}
          </div>
        </div>
      `;
      
      // Editable data for line chart
      const dataRows = data.map((d, i) => `
        <tr>
          <td><input type="text" class="slide__chart-input" data-chart-field="x" data-chart-index="${i}" data-chart-type="line" value="${escapeHTML(d.x || d.label || '')}" placeholder="X Label"></td>
          <td><input type="number" class="slide__chart-input" data-chart-field="y" data-chart-index="${i}" data-chart-type="line" value="${d.y || d.value || 0}" placeholder="Y Value"></td>
          <td><button class="slide__chart-delete-row" data-delete-chart-row="${i}" data-chart-type="line" title="Delete">✕</button></td>
        </tr>
      `).join('');
      
      chartEditor = `
        <div class="slide__chart-editor" id="chartEditor">
          <div class="slide__chart-editor-header">
            <span>Edit Chart Data</span>
            <button class="slide__chart-editor-close" id="closeChartEditor">✕</button>
          </div>
          <div class="slide__chart-type-selector">
            <label>Chart Type:</label>
            <select id="chartTypeSelect" class="slide__chart-type-select">
              <option value="bar-chart" ${slide.type === 'bar-chart' ? 'selected' : ''}>Bar Chart</option>
              <option value="line-chart" ${slide.type === 'line-chart' ? 'selected' : ''}>Line Chart</option>
              <option value="pie-chart" ${slide.type === 'pie-chart' ? 'selected' : ''}>Pie Chart</option>
            </select>
          </div>
          <table class="slide__chart-data-table">
            <thead><tr><th>X Label</th><th>Y Value</th><th></th></tr></thead>
            <tbody>${dataRows}</tbody>
          </table>
          <button class="slide__chart-add-row" id="addChartRow" data-chart-type="line">+ Add Data Point</button>
        </div>
      `;
    }
    
    return `
      <h2 contenteditable="true" data-field="title" data-placeholder="Chart Title">${escapeHTML(slide.title || '')}</h2>
      <div class="slide__chart" id="chartContainer">
        ${chartPreview}
        <button class="slide__chart-edit-btn" id="editChartBtn">✎ Edit Chart Data</button>
        ${chartEditor}
      </div>
    `;
  }

  function renderImageTextSlide(slide) {
    const imageLeft = slide.layout === 'image-left';
    const layoutToggle = imageLeft ? 'image-right' : 'image-left';
    const layoutLabel = imageLeft ? 'Move image right →' : '← Move image left';
    
    return `
      <h2 contenteditable="true" data-field="title" data-placeholder="Slide Title">${escapeHTML(slide.title || '')}</h2>
      <div class="slide__image-text ${imageLeft ? 'slide__image-text--left' : 'slide__image-text--right'}">
        <div class="slide__image">
          <div class="slide__image-wrapper">
            <img src="${escapeHTML(slide.imageUrl || 'https://via.placeholder.com/400x300')}" alt="Slide image" id="slideImage">
            <div class="slide__image-overlay" id="imageOverlay">
              <button class="slide__image-edit-btn" id="editImageBtn">✎ Change Image</button>
            </div>
          </div>
          <div class="slide__image-editor" id="imageEditor" style="display: none;">
            <label>Image URL:</label>
            <input type="text" class="slide__image-url-input" id="imageUrlInput" value="${escapeHTML(slide.imageUrl || '')}" placeholder="https://example.com/image.jpg">
            <div class="slide__image-editor-actions">
              <button class="slide__image-save-btn" id="saveImageUrl">Save</button>
              <button class="slide__image-cancel-btn" id="cancelImageEdit">Cancel</button>
            </div>
          </div>
        </div>
        <div class="slide__text">
          <p contenteditable="true" data-field="description" data-placeholder="Image description...">${escapeHTML(slide.description || '')}</p>
        </div>
      </div>
      <button class="slide__layout-toggle" id="toggleLayout" data-layout="${layoutToggle}">${layoutLabel}</button>
    `;
  }

  // ===================================================================
  // EDITABLE HANDLERS
  // ===================================================================

  function attachEditableHandlers() {
    // ContentEditable elements
    $editorCanvas.querySelectorAll('[contenteditable="true"]').forEach(el => {
      el.addEventListener('focus', () => {
        showToolbar(el);
      });
      
      el.addEventListener('blur', () => {
        // Small delay to allow toolbar clicks
        setTimeout(() => {
          hideToolbar();
          syncElementToData(el);
        }, 200);
      });
      
      el.addEventListener('input', debounce(() => {
        syncElementToData(el);
        renderSidebar(); // Update thumbnail titles
      }, 300));
      
      // Handle Enter key for bullets
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && el.dataset.bulletIndex !== undefined) {
          e.preventDefault();
          addBulletAfter(el);
        }
        if (e.key === 'Backspace' && el.textContent === '' && el.dataset.bulletIndex !== undefined) {
          e.preventDefault();
          removeBullet(el);
        }
      });
    });

    // Add bullet button (regular bullets slide)
    const addBulletBtn = document.getElementById('addBulletBtn');
    if (addBulletBtn) {
      addBulletBtn.addEventListener('click', () => {
        const slide = slidesData[currentSlideIndex];
        slide.content = (slide.content || '') + '\nNew bullet point';
        renderCanvas();
        renderSidebar();
      });
    }

    // Add bullet buttons for two-column slides
    $editorCanvas.querySelectorAll('[data-add-bullet]').forEach(btn => {
      btn.addEventListener('click', () => {
        const field = btn.dataset.addBullet;
        const slide = slidesData[currentSlideIndex];
        slide[field] = (slide[field] || '') + '\nNew bullet point';
        renderCanvas();
        renderSidebar();
      });
    });

    // Add stat button
    const addStatBtn = document.getElementById('addStatBtn');
    if (addStatBtn) {
      addStatBtn.addEventListener('click', () => {
        const slide = slidesData[currentSlideIndex];
        if (!slide.metrics) slide.metrics = [];
        slide.metrics.push({ number: '0', label: 'New Metric' });
        renderCanvas();
        renderSidebar();
      });
    }

    // ===== TABLE HANDLERS =====
    const addTableRowBtn = document.getElementById('addTableRow');
    if (addTableRowBtn) {
      addTableRowBtn.addEventListener('click', () => {
        const slide = slidesData[currentSlideIndex];
        if (!slide.tableData) slide.tableData = [['Header 1', 'Header 2'], ['Row 1', 'Data']];
        const numCols = slide.tableData[0] ? slide.tableData[0].length : 2;
        slide.tableData.push(Array(numCols).fill(''));
        renderCanvas();
        renderSidebar();
      });
    }

    const addTableColBtn = document.getElementById('addTableCol');
    if (addTableColBtn) {
      addTableColBtn.addEventListener('click', () => {
        const slide = slidesData[currentSlideIndex];
        if (!slide.tableData) slide.tableData = [['Header 1', 'Header 2'], ['Row 1', 'Data']];
        slide.tableData.forEach((row, i) => {
          row.push(i === 0 ? 'New Column' : '');
        });
        renderCanvas();
        renderSidebar();
      });
    }

    // Delete table row buttons
    $editorCanvas.querySelectorAll('.slide__table-delete-row').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const rowIndex = parseInt(btn.dataset.deleteRow, 10);
        const slide = slidesData[currentSlideIndex];
        if (slide.tableData && slide.tableData.length > 2) {
          slide.tableData.splice(rowIndex, 1);
          renderCanvas();
          renderSidebar();
        }
      });
    });

    // Delete table column buttons
    $editorCanvas.querySelectorAll('.slide__table-delete-col').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const colIndex = parseInt(btn.dataset.deleteCol, 10);
        const slide = slidesData[currentSlideIndex];
        if (slide.tableData && slide.tableData[0] && slide.tableData[0].length > 1) {
          slide.tableData.forEach(row => row.splice(colIndex, 1));
          renderCanvas();
          renderSidebar();
        }
      });
    });

    // ===== CHART HANDLERS =====
    const editChartBtn = document.getElementById('editChartBtn');
    const chartEditor = document.getElementById('chartEditor');
    const closeChartEditor = document.getElementById('closeChartEditor');
    
    if (editChartBtn && chartEditor) {
      editChartBtn.addEventListener('click', () => {
        chartEditor.classList.add('slide__chart-editor--visible');
        editChartBtn.style.display = 'none';
      });
    }
    
    if (closeChartEditor && chartEditor) {
      closeChartEditor.addEventListener('click', () => {
        chartEditor.classList.remove('slide__chart-editor--visible');
        const editBtn = document.getElementById('editChartBtn');
        if (editBtn) editBtn.style.display = '';
      });
    }

    // Chart type selector
    const chartTypeSelect = document.getElementById('chartTypeSelect');
    if (chartTypeSelect) {
      chartTypeSelect.addEventListener('change', (e) => {
        const newType = e.target.value;
        const slide = slidesData[currentSlideIndex];
        
        // Convert data between chart types
        if (slide.type === 'bar-chart' && newType === 'pie-chart') {
          const data = slide.series?.[0]?.data || [];
          slide.segments = data.map(d => ({ label: d.label, value: d.value }));
          delete slide.series;
        } else if (slide.type === 'bar-chart' && newType === 'line-chart') {
          const data = slide.series?.[0]?.data || [];
          slide.series = [{ name: 'Series', data: data.map(d => ({ x: d.label, y: d.value })) }];
        } else if (slide.type === 'pie-chart' && newType === 'bar-chart') {
          const segments = slide.segments || [];
          slide.series = [{ name: 'Series', data: segments.map(s => ({ label: s.label, value: s.value })) }];
          delete slide.segments;
        } else if (slide.type === 'pie-chart' && newType === 'line-chart') {
          const segments = slide.segments || [];
          slide.series = [{ name: 'Series', data: segments.map(s => ({ x: s.label, y: s.value })) }];
          delete slide.segments;
        } else if (slide.type === 'line-chart' && newType === 'bar-chart') {
          const data = slide.series?.[0]?.data || [];
          slide.series = [{ name: 'Series', data: data.map(d => ({ label: d.x || d.label, value: d.y || d.value })) }];
        } else if (slide.type === 'line-chart' && newType === 'pie-chart') {
          const data = slide.series?.[0]?.data || [];
          slide.segments = data.map(d => ({ label: d.x || d.label, value: d.y || d.value }));
          delete slide.series;
        }
        
        slide.type = newType;
        renderCanvas();
        renderSidebar();
      });
    }

    // Chart data inputs
    $editorCanvas.querySelectorAll('.slide__chart-input').forEach(input => {
      input.addEventListener('change', () => {
        const slide = slidesData[currentSlideIndex];
        const index = parseInt(input.dataset.chartIndex, 10);
        const field = input.dataset.chartField;
        const chartType = input.dataset.chartType;
        
        if (chartType === 'pie' && slide.segments) {
          if (!slide.segments[index]) slide.segments[index] = { label: '', value: 0 };
          slide.segments[index][field] = field === 'value' ? parseFloat(input.value) || 0 : input.value;
        } else if (chartType === 'line' && slide.series?.[0]) {
          if (!slide.series[0].data[index]) slide.series[0].data[index] = { x: '', y: 0 };
          slide.series[0].data[index][field] = field === 'y' ? parseFloat(input.value) || 0 : input.value;
        } else if (slide.series?.[0]) {
          if (!slide.series[0].data[index]) slide.series[0].data[index] = { label: '', value: 0 };
          slide.series[0].data[index][field] = field === 'value' ? parseFloat(input.value) || 0 : input.value;
        }
        
        renderCanvas();
        renderSidebar();
      });
    });

    // Add chart data row
    const addChartRowBtn = document.getElementById('addChartRow');
    if (addChartRowBtn) {
      addChartRowBtn.addEventListener('click', () => {
        const slide = slidesData[currentSlideIndex];
        const chartType = addChartRowBtn.dataset.chartType;
        
        if (chartType === 'pie') {
          if (!slide.segments) slide.segments = [];
          slide.segments.push({ label: 'New', value: 10 });
        } else if (chartType === 'line') {
          if (!slide.series) slide.series = [{ name: 'Series', data: [] }];
          if (!slide.series[0].data) slide.series[0].data = [];
          slide.series[0].data.push({ x: 'New', y: 10 });
        } else {
          if (!slide.series) slide.series = [{ name: 'Series', data: [] }];
          if (!slide.series[0].data) slide.series[0].data = [];
          slide.series[0].data.push({ label: 'New', value: 10 });
        }
        
        renderCanvas();
        renderSidebar();
      });
    }

    // Delete chart data row
    $editorCanvas.querySelectorAll('.slide__chart-delete-row').forEach(btn => {
      btn.addEventListener('click', () => {
        const slide = slidesData[currentSlideIndex];
        const index = parseInt(btn.dataset.deleteChartRow, 10);
        const chartType = btn.dataset.chartType;
        
        if (chartType === 'pie' && slide.segments && slide.segments.length > 1) {
          slide.segments.splice(index, 1);
        } else if (chartType === 'line' && slide.series?.[0]?.data && slide.series[0].data.length > 1) {
          slide.series[0].data.splice(index, 1);
        } else if (slide.series?.[0]?.data && slide.series[0].data.length > 1) {
          slide.series[0].data.splice(index, 1);
        }
        
        renderCanvas();
        renderSidebar();
      });
    });

    // ===== IMAGE HANDLERS =====
    const editImageBtn = document.getElementById('editImageBtn');
    const imageEditor = document.getElementById('imageEditor');
    const imageUrlInput = document.getElementById('imageUrlInput');
    const saveImageUrl = document.getElementById('saveImageUrl');
    const cancelImageEdit = document.getElementById('cancelImageEdit');
    const slideImage = document.getElementById('slideImage');
    
    if (editImageBtn && imageEditor) {
      editImageBtn.addEventListener('click', () => {
        imageEditor.style.display = 'block';
      });
    }
    
    if (saveImageUrl && imageUrlInput) {
      saveImageUrl.addEventListener('click', () => {
        const slide = slidesData[currentSlideIndex];
        slide.imageUrl = imageUrlInput.value;
        renderCanvas();
        renderSidebar();
      });
    }
    
    if (cancelImageEdit && imageEditor) {
      cancelImageEdit.addEventListener('click', () => {
        imageEditor.style.display = 'none';
        if (imageUrlInput) {
          const slide = slidesData[currentSlideIndex];
          imageUrlInput.value = slide.imageUrl || '';
        }
      });
    }

    // Image layout toggle
    const toggleLayoutBtn = document.getElementById('toggleLayout');
    if (toggleLayoutBtn) {
      toggleLayoutBtn.addEventListener('click', () => {
        const slide = slidesData[currentSlideIndex];
        slide.layout = toggleLayoutBtn.dataset.layout;
        renderCanvas();
        renderSidebar();
      });
    }
  }

  function syncElementToData(el) {
    const field = el.dataset.field;
    const slide = slidesData[currentSlideIndex];
    
    if (!field || !slide) return;

    if (field === 'content' && el.dataset.bulletIndex !== undefined) {
      // Update specific bullet
      const bullets = (slide.content || '').split('\n').filter(line => line.trim());
      const index = parseInt(el.dataset.bulletIndex, 10);
      bullets[index] = el.textContent;
      slide.content = bullets.join('\n');
    } else if (field === 'leftColumn' && el.dataset.bulletIndex !== undefined) {
      const bullets = (slide.leftColumn || '').split('\n').filter(line => line.trim());
      const index = parseInt(el.dataset.bulletIndex, 10);
      bullets[index] = el.textContent;
      slide.leftColumn = bullets.join('\n');
    } else if (field === 'rightColumn' && el.dataset.bulletIndex !== undefined) {
      const bullets = (slide.rightColumn || '').split('\n').filter(line => line.trim());
      const index = parseInt(el.dataset.bulletIndex, 10);
      bullets[index] = el.textContent;
      slide.rightColumn = bullets.join('\n');
    } else if (field === 'metrics') {
      const metricIndex = parseInt(el.dataset.metricIndex, 10);
      const metricField = el.dataset.metricField;
      if (slide.metrics && slide.metrics[metricIndex]) {
        slide.metrics[metricIndex][metricField] = el.textContent;
      }
    } else if (field === 'tableData') {
      const row = parseInt(el.dataset.row, 10);
      const col = parseInt(el.dataset.col, 10);
      if (slide.tableData && slide.tableData[row]) {
        slide.tableData[row][col] = el.textContent;
      }
    } else {
      slide[field] = el.textContent;
    }
  }

  function addBulletAfter(el) {
    const field = el.dataset.field;
    const slide = slidesData[currentSlideIndex];
    const index = parseInt(el.dataset.bulletIndex, 10);
    
    if (field === 'content') {
      const bullets = (slide.content || '').split('\n').filter(line => line.trim());
      bullets.splice(index + 1, 0, '');
      slide.content = bullets.join('\n');
    } else if (field === 'leftColumn') {
      const bullets = (slide.leftColumn || '').split('\n').filter(line => line.trim());
      bullets.splice(index + 1, 0, '');
      slide.leftColumn = bullets.join('\n');
    } else if (field === 'rightColumn') {
      const bullets = (slide.rightColumn || '').split('\n').filter(line => line.trim());
      bullets.splice(index + 1, 0, '');
      slide.rightColumn = bullets.join('\n');
    }
    
    renderCanvas();
    // Focus the new bullet
    setTimeout(() => {
      const newBullet = $editorCanvas.querySelector(`[data-field="${field}"][data-bullet-index="${index + 1}"]`);
      if (newBullet) newBullet.focus();
    }, 50);
  }

  function removeBullet(el) {
    const field = el.dataset.field;
    const slide = slidesData[currentSlideIndex];
    const index = parseInt(el.dataset.bulletIndex, 10);
    
    let bullets;
    if (field === 'content') {
      bullets = (slide.content || '').split('\n').filter(line => line.trim());
      if (bullets.length <= 1) return; // Keep at least one
      bullets.splice(index, 1);
      slide.content = bullets.join('\n');
    } else if (field === 'leftColumn') {
      bullets = (slide.leftColumn || '').split('\n').filter(line => line.trim());
      if (bullets.length <= 1) return;
      bullets.splice(index, 1);
      slide.leftColumn = bullets.join('\n');
    } else if (field === 'rightColumn') {
      bullets = (slide.rightColumn || '').split('\n').filter(line => line.trim());
      if (bullets.length <= 1) return;
      bullets.splice(index, 1);
      slide.rightColumn = bullets.join('\n');
    }
    
    renderCanvas();
    // Focus previous bullet
    const prevIndex = Math.max(0, index - 1);
    setTimeout(() => {
      const prevBullet = $editorCanvas.querySelector(`[data-field="${field}"][data-bullet-index="${prevIndex}"]`);
      if (prevBullet) prevBullet.focus();
    }, 50);
  }

  // ===================================================================
  // TOOLBAR
  // ===================================================================

  function showToolbar(element) {
    const rect = element.getBoundingClientRect();
    const slide = slidesData[currentSlideIndex];
    
    $toolbarSlideType.value = slide.type;
    
    $editorToolbar.style.display = 'flex';
    $editorToolbar.style.left = `${rect.left}px`;
    $editorToolbar.style.top = `${rect.top - 50}px`;
    
    // Make sure toolbar stays in viewport
    const toolbarRect = $editorToolbar.getBoundingClientRect();
    if (toolbarRect.left < 10) {
      $editorToolbar.style.left = '10px';
    }
    if (toolbarRect.top < 10) {
      $editorToolbar.style.top = `${rect.bottom + 10}px`;
    }
  }

  function hideToolbar() {
    $editorToolbar.style.display = 'none';
  }

  // ===================================================================
  // SLIDE MANAGEMENT
  // ===================================================================

  function addSlide(type = 'bullets') {
    const newSlide = getDefaultSlideData(type);
    slidesData.push(newSlide);
    currentSlideIndex = slidesData.length - 1;
    renderSidebar();
    renderCanvas();
  }

  function removeSlide(index) {
    if (slidesData.length <= 1) {
      alert('Cannot delete the last slide.');
      return;
    }
    
    slidesData.splice(index, 1);
    if (currentSlideIndex >= slidesData.length) {
      currentSlideIndex = slidesData.length - 1;
    }
    renderSidebar();
    renderCanvas();
  }

  function changeSlideType(newType) {
    const slide = slidesData[currentSlideIndex];
    const oldContent = slide.content || slide.title || '';
    
    // Convert content where possible
    const newSlide = getDefaultSlideData(newType);
    newSlide.title = slide.title || '';
    
    // Try to preserve content
    if (newType === 'bullets' && slide.type !== 'bullets') {
      newSlide.content = oldContent;
    } else if (newType === 'two-column' && slide.type === 'bullets') {
      const bullets = (slide.content || '').split('\n').filter(l => l.trim());
      const mid = Math.ceil(bullets.length / 2);
      newSlide.leftColumn = bullets.slice(0, mid).join('\n');
      newSlide.rightColumn = bullets.slice(mid).join('\n');
    } else if (newType === 'quote' && slide.content) {
      newSlide.quote = slide.content.split('\n')[0];
    }
    
    slidesData[currentSlideIndex] = { ...slide, ...newSlide, type: newType };
    renderSidebar();
    renderCanvas();
  }

  function getDefaultSlideData(type) {
    const defaults = {
      'title': { type: 'title', title: 'New Title', subtitle: 'Subtitle here' },
      'bullets': { type: 'bullets', title: 'New Slide', content: 'First point\nSecond point\nThird point' },
      'two-column': { type: 'two-column', title: 'Comparison', leftColumn: 'Left point 1\nLeft point 2', rightColumn: 'Right point 1\nRight point 2' },
      'stats': { type: 'stats', title: 'Key Metrics', metrics: [{ number: '100', label: 'Metric 1' }, { number: '200', label: 'Metric 2' }] },
      'quote': { type: 'quote', quote: 'Your quote here', attribution: 'Author Name' },
      'table': { type: 'table', title: 'Data Table', tableData: [['Header 1', 'Header 2'], ['Row 1', 'Data']] },
      'bar-chart': { type: 'bar-chart', title: 'Chart', series: [{ name: 'Series', data: [{ label: 'A', value: 100 }, { label: 'B', value: 150 }] }] },
      'line-chart': { type: 'line-chart', title: 'Trend', series: [{ name: 'Series', data: [{ x: 'Jan', y: 100 }, { x: 'Feb', y: 150 }] }] },
      'pie-chart': { type: 'pie-chart', title: 'Distribution', segments: [{ label: 'A', value: 60 }, { label: 'B', value: 40 }] },
      'image-text': { type: 'image-text', title: 'Feature', imageUrl: 'https://via.placeholder.com/400x300', description: 'Description here', layout: 'image-left' },
    };
    return defaults[type] || defaults['bullets'];
  }

  // ===================================================================
  // DOWNLOAD
  // ===================================================================

  function getFormData() {
    return {
      companyName: $companyName.value || 'Company',
      accentColor: $accentColor.value,
      slides: slidesData,
    };
  }

  function downloadDeck() {
    if (!selectedTemplate) {
      alert('Please select a template first.');
      document.getElementById('templates').scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const config = getFormData();
    config.watermark = !isLicensed();
    const html = selectedTemplate.generator(config);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${slugify(config.companyName)}-${selectedTemplate.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // ===================================================================
  // LICENSE KEY MANAGEMENT
  // ===================================================================

  const GUMROAD_PRODUCT_ID = 'DgpsRDZt7gAd_8TVqrp1hw==';
  const LICENSE_STORAGE_KEY = 'htmldecks_license';

  function getLicense() {
    try {
      const raw = localStorage.getItem(LICENSE_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function saveLicense(data) {
    localStorage.setItem(LICENSE_STORAGE_KEY, JSON.stringify(data));
  }

  function isLicensed() {
    const license = getLicense();
    return !!(license && license.key && license.verified_at);
  }

  async function verifyLicenseKey(key) {
    try {
      const res = await fetch('https://api.gumroad.com/v2/licenses/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'product_id=' + GUMROAD_PRODUCT_ID + '&license_key=' + encodeURIComponent(key.trim()),
      });
      const data = await res.json();

      if (data.success) {
        return {
          success: true,
          email: (data.purchase && data.purchase.email) || '',
          uses: data.uses || 0,
        };
      }
      return { success: false, error: data.message || 'Invalid license key.' };
    } catch (e) {
      return { success: false, error: 'Could not verify key. Check your connection.' };
    }
  }

  function showLicenseModal() {
    var $modal = document.getElementById('licenseModal');
    var $input = document.getElementById('licenseKeyInput');
    var $error = document.getElementById('licenseError');
    var $btn = document.getElementById('licenseVerifyBtn');

    $input.value = '';
    $error.style.display = 'none';
    $btn.textContent = 'Verify Key';
    $btn.disabled = false;
    $modal.style.display = 'flex';
  }

  function closeLicenseModal() {
    document.getElementById('licenseModal').style.display = 'none';
  }

  function updateDownloadButtons() {
    var licensed = isLicensed();
    var $badge = document.getElementById('licenseBadge');
    var $divider = document.querySelector('.editor__download-divider');
    var $proNote = document.querySelector('.editor__download-note-pro');

    if ($badge) {
      $badge.style.display = licensed ? 'inline-flex' : 'none';
    }

    if ($downloadProBtn) {
      $downloadProBtn.style.display = licensed ? 'none' : '';
    }
    if ($divider) {
      $divider.style.display = licensed ? 'none' : '';
    }
    if ($proNote) {
      $proNote.style.display = licensed ? 'none' : '';
    }

    if ($downloadFreeBtn) {
      if (licensed) {
        $downloadFreeBtn.textContent = '⬇ Download Your Deck';
        $downloadFreeBtn.className = 'btn btn--download-pro btn--lg btn--block';
      } else {
        $downloadFreeBtn.textContent = '⬇ Download This Template — Free';
        $downloadFreeBtn.className = 'btn btn--download-free btn--lg btn--block';
      }
    }
  }

  async function handleLicenseVerify() {
    var $input = document.getElementById('licenseKeyInput');
    var $error = document.getElementById('licenseError');
    var $btn = document.getElementById('licenseVerifyBtn');
    var key = $input.value.trim();

    if (!key) {
      $error.textContent = 'Please enter a license key.';
      $error.style.display = 'block';
      return;
    }

    $btn.textContent = 'Verifying…';
    $btn.disabled = true;
    $btn.style.opacity = '0.7';
    $error.style.display = 'none';

    var result = await verifyLicenseKey(key);

    if (result.success) {
      saveLicense({
        key: key,
        email: result.email,
        verified_at: new Date().toISOString(),
        uses: result.uses,
      });

      closeLicenseModal();
      updateDownloadButtons();
      downloadDeck();
    } else {
      $error.textContent = result.error;
      $error.style.display = 'block';
    }

    $btn.textContent = 'Verify Key';
    $btn.disabled = false;
    $btn.style.opacity = '1';
  }

  function initGumroadListener() {
    window.addEventListener('message', function (event) {
      if (!event.origin || event.origin.indexOf('gumroad.com') === -1) return;

      var data = event.data;
      if (typeof data === 'string') {
        try { data = JSON.parse(data); } catch (e) { return; }
      }
      if (!data) return;

      var licenseKey = null;
      if (data.post_message_name === 'sale') {
        licenseKey = data.license_key || (data.sale && data.sale.license_key);
      } else if (data.sale) {
        licenseKey = data.sale.license_key;
      }

      if (licenseKey) {
        var $input = document.getElementById('licenseKeyInput');
        if ($input) $input.value = licenseKey;
        handleLicenseVerify();
      }
    });
  }

  // ===================================================================
  // UTILITIES
  // ===================================================================

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function slugify(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'deck';
  }

  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  // ===================================================================
  // SCROLL ANIMATIONS & NAV
  // ===================================================================

  function initScrollAnimations() {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.animate-in').forEach(el => observer.observe(el));
  }

  function initNavScroll() {
    const nav = document.getElementById('nav');
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          nav.classList.toggle('nav--scrolled', window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ===================================================================
  // MOCKUP ANIMATION (Hero)
  // ===================================================================

  function initMockupCycle() {
    const slides = document.querySelectorAll('.mockup__slide');
    const dots = document.querySelectorAll('.mockup__dot');
    if (slides.length === 0) return;
    let idx = 0;

    setInterval(() => {
      slides[idx].classList.remove('mockup__slide--active');
      slides[idx].classList.add('mockup__slide--exit');
      if (dots[idx]) dots[idx].classList.remove('mockup__dot--active');

      const exitIdx = idx;
      setTimeout(() => {
        slides[exitIdx].classList.remove('mockup__slide--exit');
      }, 600);

      idx = (idx + 1) % slides.length;
      slides[idx].classList.add('mockup__slide--active');
      if (dots[idx]) dots[idx].classList.add('mockup__dot--active');
    }, 3500);
  }

  // ===================================================================
  // EVENT BINDINGS
  // ===================================================================

  function bindEvents() {
    // Add slide button
    $addSlideBtn.addEventListener('click', () => {
      addSlide('bullets');
    });

    // Global field changes
    $companyName.addEventListener('input', () => renderCanvas());
    $accentColor.addEventListener('input', () => renderCanvas());

    // Toolbar slide type change
    $toolbarSlideType.addEventListener('change', (e) => {
      changeSlideType(e.target.value);
    });

    // Toolbar bold/italic buttons
    document.getElementById('toolbarBold')?.addEventListener('click', () => {
      document.execCommand('bold', false, null);
    });
    document.getElementById('toolbarItalic')?.addEventListener('click', () => {
      document.execCommand('italic', false, null);
    });

    // Free download button
    $downloadFreeBtn.addEventListener('click', function () {
      if (!selectedTemplate) {
        alert('Please select a template first.');
        document.getElementById('templates').scrollIntoView({ behavior: 'smooth' });
        return;
      }

      if (isLicensed()) {
        downloadDeck();
      } else {
        document.getElementById('emailModal').style.display = 'flex';
      }
    });

    // Pro download button
    $downloadProBtn.addEventListener('click', function () {
      if (!selectedTemplate) {
        alert('Please select a template first.');
        document.getElementById('templates').scrollIntoView({ behavior: 'smooth' });
        return;
      }
      showLicenseModal();
    });

    // Email modal submit
    document.getElementById('emailForm').addEventListener('submit', function (e) {
      e.preventDefault();
      const email = document.getElementById('emailInput').value;
      if (!email) return;

      const formEndpoint = document.getElementById('emailForm').getAttribute('action');
      if (formEndpoint && formEndpoint !== '#') {
        fetch(formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ email: email, source: 'htmldecks', template: selectedTemplate ? selectedTemplate.id : 'unknown' })
        }).catch(() => {});
      }

      document.getElementById('emailModal').style.display = 'none';
      downloadDeck();
    });

    // Email modal close
    document.getElementById('emailModalClose').addEventListener('click', function () {
      document.getElementById('emailModal').style.display = 'none';
    });

    // License modal
    document.getElementById('licenseVerifyBtn').addEventListener('click', handleLicenseVerify);
    document.getElementById('licenseKeyInput').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') handleLicenseVerify();
    });
    document.getElementById('licenseModalClose').addEventListener('click', closeLicenseModal);

    // Change template button
    $changeTemplateBtn.addEventListener('click', () => {
      document.getElementById('templates').scrollIntoView({ behavior: 'smooth' });
    });

    // Click outside canvas to deselect
    document.addEventListener('click', (e) => {
      if (!$editorCanvas.contains(e.target) && !$editorToolbar.contains(e.target)) {
        hideToolbar();
      }
    });
  }

  // ===================================================================
  // INIT
  // ===================================================================

  function init() {
    renderTemplateCards();
    bindEvents();
    initScrollAnimations();
    initNavScroll();
    initMockupCycle();
    initGumroadListener();

    const firstAvailable = TEMPLATES.find(t => t.available);
    if (firstAvailable) {
      selectTemplate(firstAvailable);
      window.scrollTo(0, 0);
    }

    updateDownloadButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
