/**
 * HTML Decks — Main Application Logic
 * 
 * Handles:
 * - Template gallery rendering & selection
 * - Editor form (slides, fields, add/remove)
 * - Live preview via iframe
 * - Download generation
 * - Scroll animations
 * - Nav behavior
 */

(function () {
  'use strict';

  // ===================================================================
  // TEMPLATE REGISTRY
  // ===================================================================

  /**
   * Each template defines:
   *  - id: unique key
   *  - name: display name
   *  - description: short tagline
   *  - gradient: CSS gradient for the card thumbnail
   *  - available: whether it's fully implemented
   *  - generator: function(config) → HTML string
   *  - defaults: default slide content for pre-fill
   */
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
          { type: 'bullets', title: 'Our Mission', content: 'To push the boundaries of human achievement\nTo explore uncharted territories of possibility\nTo inspire generations of tomorrow's pioneers' },
          { type: 'two-column', title: 'Vision & Reality', leftColumn: 'Where we see ourselves\n\nLeading the next wave of breakthrough discoveries\n\nBuilding bridges between imagination and reality', rightColumn: 'What we're building today\n\nFoundational technologies for tomorrow\n\nSustainable solutions for complex challenges' },
          { type: 'stats', title: 'Impact Metrics', metrics: [
            { number: '∞', label: 'POSSIBILITIES' },
            { number: '127', label: 'COUNTRIES REACHED' },
            { number: '2.8M', label: 'LIVES CHANGED' }
          ]},
          { type: 'quote', quote: 'The universe is not only stranger than we imagine, it is stranger than we can imagine. And that's exactly what makes it worth exploring.', attribution: 'Visionary Leader' },
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
          { type: 'bullets', title: 'Why Teams Choose Us', content: 'Reduce context switching by 70% with unified workspace\nAI-powered insights that learn from your team's patterns\nSeamless integrations with 200+ tools your team already uses\nReal-time collaboration that feels natural and effortless' },
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

  let selectedTemplate = null;   // template object
  let currentPreviewSlide = 0;   // for preview nav
  let activeEditingSlide = -1;   // which slide editor has focus (-1 = none)
  let debounceTimer = null;      // preview update debounce

  // ===================================================================
  // DOM REFERENCES
  // ===================================================================

  const $templateGrid    = document.getElementById('templateGrid');
  const $editorForm      = document.getElementById('editorForm');
  const $editorName      = document.getElementById('editorTemplateName');
  const $companyName     = document.getElementById('companyName');
  const $accentColor     = document.getElementById('accentColor');
  const $accentValue     = document.getElementById('accentColorValue');
  const $slidesContainer = document.getElementById('slidesContainer');
  const $addSlideBtn     = document.getElementById('addSlideBtn');
  const $downloadFreeBtn = document.getElementById('downloadFreeBtn');
  const $downloadProBtn  = document.getElementById('downloadProBtn');
  const $previewFrame    = document.getElementById('previewFrame');
  const $slideCounter    = document.getElementById('slideCounter');
  const $prevSlideBtn    = document.getElementById('prevSlideBtn');
  const $nextSlideBtn    = document.getElementById('nextSlideBtn');
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

    // Attach click handlers
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

    // Highlight card
    $templateGrid.querySelectorAll('.tpl-card').forEach(c => {
      c.classList.toggle('tpl-card--selected', c.dataset.template === tpl.id);
    });

    // Update editor
    $editorName.textContent = tpl.name;
    $companyName.value = tpl.defaults.companyName;
    $accentColor.value = tpl.defaults.accentColor;
    $accentValue.textContent = tpl.defaults.accentColor;

    // Populate slides
    renderSlideEditors(tpl.defaults.slides);

    // Update download buttons based on license status
    updateDownloadButtons();

    // Update preview
    updatePreview();

    // Scroll to editor
    document.getElementById('editor').scrollIntoView({ behavior: 'smooth' });
  }

  // ===================================================================
  // SLIDE EDITORS
  // ===================================================================

  function renderSlideEditors(slides) {
    $slidesContainer.innerHTML = slides.map((slide, i) => createSlideEditorHTML(i, slide)).join('');
    attachSlideHandlers();
  }

  function createSlideEditorHTML(index, slide = { title: '', type: 'bullets', content: '' }) {
    return `
      <div class="slide-editor" data-slide-index="${index}">
        <div class="slide-editor__header">
          <span class="slide-editor__num">Slide ${index + 1}</span>
          <button class="slide-editor__remove" data-remove="${index}" title="Remove slide">✕ Remove</button>
        </div>
        <div class="form-group">
          <label>Slide Type</label>
          <select class="slide-type">
            <option value="title"${slide.type === 'title' ? ' selected' : ''}>Title Slide</option>
            <option value="bullets"${slide.type === 'bullets' ? ' selected' : ''}>Bullets</option>
            <option value="two-column"${slide.type === 'two-column' ? ' selected' : ''}>Two Column</option>
            <option value="stats"${slide.type === 'stats' ? ' selected' : ''}>Stats / Metrics</option>
            <option value="quote"${slide.type === 'quote' ? ' selected' : ''}>Quote</option>
            <option value="table"${slide.type === 'table' ? ' selected' : ''}>Table</option>
            <option value="bar-chart"${slide.type === 'bar-chart' ? ' selected' : ''}>Bar Chart</option>
            <option value="line-chart"${slide.type === 'line-chart' ? ' selected' : ''}>Line Chart</option>
            <option value="pie-chart"${slide.type === 'pie-chart' ? ' selected' : ''}>Pie Chart</option>
            <option value="image-text"${slide.type === 'image-text' ? ' selected' : ''}>Image + Text</option>
          </select>
        </div>
        <div class="slide-type-content">
          ${renderTypeSpecificInputs(slide.type || 'bullets', slide)}
        </div>
      </div>
    `;
  }

  function renderTypeSpecificInputs(type, slide = {}) {
    switch (type) {
      case 'title':
        return `
          <div class="form-group">
            <label>Main Title</label>
            <input type="text" class="slide-title" value="${escapeAttr(slide.title || '')}" placeholder="Main title...">
          </div>
          <div class="form-group">
            <label>Subtitle</label>
            <input type="text" class="slide-subtitle" value="${escapeAttr(slide.subtitle || '')}" placeholder="Subtitle...">
          </div>
          <div class="form-group">
            <label>Badge Text (optional)</label>
            <input type="text" class="slide-badge" value="${escapeAttr(slide.badge || '')}" placeholder="Badge text...">
          </div>
        `;

      case 'bullets':
        return `
          <div class="form-group">
            <label>Slide Title</label>
            <input type="text" class="slide-title" value="${escapeAttr(slide.title || '')}" placeholder="Slide title...">
          </div>
          <div class="form-group">
            <label>Content (one bullet per line)</label>
            <textarea class="slide-content" rows="3" placeholder="Bullet point 1&#10;Bullet point 2&#10;Bullet point 3">${escapeHTML(slide.content || '')}</textarea>
          </div>
        `;

      case 'two-column':
        return `
          <div class="form-group">
            <label>Slide Title</label>
            <input type="text" class="slide-title" value="${escapeAttr(slide.title || '')}" placeholder="Slide title...">
          </div>
          <div class="form-group">
            <label>Left Column</label>
            <textarea class="slide-left-column" rows="3" placeholder="Left column content...">${escapeHTML(slide.leftColumn || '')}</textarea>
          </div>
          <div class="form-group">
            <label>Right Column</label>
            <textarea class="slide-right-column" rows="3" placeholder="Right column content...">${escapeHTML(slide.rightColumn || '')}</textarea>
          </div>
        `;

      case 'stats':
        const metrics = slide.metrics || [
          { number: '100', label: 'Users' },
          { number: '99%', label: 'Uptime' }
        ];
        const metricsHTML = metrics.map((metric, i) => `
          <div class="metric-group" data-metric="${i}">
            <div class="metric-inputs">
              <input type="text" class="metric-number" value="${escapeAttr(metric.number)}" placeholder="100">
              <input type="text" class="metric-label" value="${escapeAttr(metric.label)}" placeholder="Label">
              <button type="button" class="remove-metric" data-remove-metric="${i}">✕</button>
            </div>
          </div>
        `).join('');
        
        return `
          <div class="form-group">
            <label>Slide Title</label>
            <input type="text" class="slide-title" value="${escapeAttr(slide.title || '')}" placeholder="Slide title...">
          </div>
          <div class="form-group">
            <label>Metrics</label>
            <div class="metrics-container">
              ${metricsHTML}
            </div>
            <button type="button" class="add-metric-btn">+ Add Metric</button>
          </div>
        `;

      case 'quote':
        return `
          <div class="form-group">
            <label>Quote Text</label>
            <textarea class="slide-quote" rows="3" placeholder="Quote text...">${escapeHTML(slide.quote || '')}</textarea>
          </div>
          <div class="form-group">
            <label>Attribution</label>
            <input type="text" class="slide-attribution" value="${escapeAttr(slide.attribution || '')}" placeholder="Author, Title">
          </div>
        `;

      case 'table':
        const tableData = slide.tableData || [
          ['Header 1', 'Header 2', 'Header 3'],
          ['Row 1 Col 1', 'Row 1 Col 2', 'Row 1 Col 3'],
          ['Row 2 Col 1', 'Row 2 Col 2', 'Row 2 Col 3']
        ];
        const tableHTML = tableData.map((row, rowIndex) => `
          <div class="table-row" data-row="${rowIndex}">
            ${row.map((cell, cellIndex) => `
              <input type="text" class="table-cell" data-row="${rowIndex}" data-col="${cellIndex}" value="${escapeAttr(cell)}" placeholder="Cell ${rowIndex + 1}-${cellIndex + 1}">
            `).join('')}
            ${rowIndex > 0 ? `<button type="button" class="remove-row" data-remove-row="${rowIndex}">✕</button>` : ''}
          </div>
        `).join('');

        return `
          <div class="form-group">
            <label>Slide Title</label>
            <input type="text" class="slide-title" value="${escapeAttr(slide.title || '')}" placeholder="Slide title...">
          </div>
          <div class="form-group">
            <label>Table Data</label>
            <div class="table-container">
              ${tableHTML}
            </div>
            <div class="table-controls">
              <button type="button" class="add-row-btn">+ Add Row</button>
              <button type="button" class="add-column-btn">+ Add Column</button>
            </div>
          </div>
        `;

      case 'bar-chart':
        const series = slide.series || [{
          name: 'Series 1',
          data: [
            { label: 'Q1', value: 100 },
            { label: 'Q2', value: 150 },
            { label: 'Q3', value: 120 },
            { label: 'Q4', value: 180 }
          ]
        }];
        const seriesHTML = series.map((s, seriesIndex) => {
          const dataHTML = s.data.map((d, dataIndex) => `
            <div class="data-point" data-series="${seriesIndex}" data-point="${dataIndex}">
              <input type="text" class="data-label" value="${escapeAttr(d.label)}" placeholder="Label">
              <input type="number" class="data-value" value="${d.value}" placeholder="Value">
              <button type="button" class="remove-data-point" data-remove-point="${seriesIndex}-${dataIndex}">✕</button>
            </div>
          `).join('');
          
          return `
            <div class="series-group" data-series="${seriesIndex}">
              <div class="series-header">
                <input type="text" class="series-name" value="${escapeAttr(s.name)}" placeholder="Series name">
                <button type="button" class="remove-series" data-remove-series="${seriesIndex}">Remove Series</button>
              </div>
              <div class="series-data">
                ${dataHTML}
              </div>
              <button type="button" class="add-data-point" data-add-point="${seriesIndex}">+ Add Data Point</button>
            </div>
          `;
        }).join('');

        return `
          <div class="form-group">
            <label>Chart Title</label>
            <input type="text" class="slide-title" value="${escapeAttr(slide.title || '')}" placeholder="Chart title...">
          </div>
          <div class="form-group">
            <label>Data Series</label>
            <div class="chart-series-container">
              ${seriesHTML}
            </div>
            <button type="button" class="add-series-btn">+ Add Series</button>
          </div>
        `;

      case 'line-chart':
        const lineSeries = slide.series || [{
          name: 'Series 1',
          data: [
            { x: 'Jan', y: 100 },
            { x: 'Feb', y: 150 },
            { x: 'Mar', y: 120 },
            { x: 'Apr', y: 180 },
            { x: 'May', y: 200 }
          ]
        }];
        const lineSeriesHTML = lineSeries.map((s, seriesIndex) => {
          const dataHTML = s.data.map((d, dataIndex) => `
            <div class="data-point" data-series="${seriesIndex}" data-point="${dataIndex}">
              <input type="text" class="data-x" value="${escapeAttr(d.x)}" placeholder="X-Label">
              <input type="number" class="data-y" value="${d.y}" placeholder="Y-Value">
              <button type="button" class="remove-data-point" data-remove-point="${seriesIndex}-${dataIndex}">✕</button>
            </div>
          `).join('');
          
          return `
            <div class="series-group" data-series="${seriesIndex}">
              <div class="series-header">
                <input type="text" class="series-name" value="${escapeAttr(s.name)}" placeholder="Series name">
                <button type="button" class="remove-series" data-remove-series="${seriesIndex}">Remove Series</button>
              </div>
              <div class="series-data">
                ${dataHTML}
              </div>
              <button type="button" class="add-data-point" data-add-point="${seriesIndex}">+ Add Data Point</button>
            </div>
          `;
        }).join('');

        return `
          <div class="form-group">
            <label>Chart Title</label>
            <input type="text" class="slide-title" value="${escapeAttr(slide.title || '')}" placeholder="Chart title...">
          </div>
          <div class="form-group">
            <label>Data Series</label>
            <div class="chart-series-container">
              ${lineSeriesHTML}
            </div>
            <button type="button" class="add-series-btn">+ Add Series</button>
          </div>
        `;

      case 'pie-chart':
        const segments = slide.segments || [
          { label: 'Segment 1', value: 40 },
          { label: 'Segment 2', value: 30 },
          { label: 'Segment 3', value: 20 },
          { label: 'Segment 4', value: 10 }
        ];
        const segmentsHTML = segments.map((segment, i) => `
          <div class="segment-group" data-segment="${i}">
            <input type="text" class="segment-label" value="${escapeAttr(segment.label)}" placeholder="Segment label">
            <input type="number" class="segment-value" value="${segment.value}" placeholder="Value">
            <button type="button" class="remove-segment" data-remove-segment="${i}">✕</button>
          </div>
        `).join('');

        return `
          <div class="form-group">
            <label>Chart Title</label>
            <input type="text" class="slide-title" value="${escapeAttr(slide.title || '')}" placeholder="Chart title...">
          </div>
          <div class="form-group">
            <label>Segments</label>
            <div class="segments-container">
              ${segmentsHTML}
            </div>
            <button type="button" class="add-segment-btn">+ Add Segment</button>
          </div>
        `;

      case 'image-text':
        return `
          <div class="form-group">
            <label>Slide Title</label>
            <input type="text" class="slide-title" value="${escapeAttr(slide.title || '')}" placeholder="Slide title...">
          </div>
          <div class="form-group">
            <label>Image URL</label>
            <input type="url" class="slide-image-url" value="${escapeAttr(slide.imageUrl || '')}" placeholder="https://example.com/image.jpg">
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea class="slide-description" rows="3" placeholder="Image description...">${escapeHTML(slide.description || '')}</textarea>
          </div>
          <div class="form-group">
            <label>Layout</label>
            <select class="slide-layout">
              <option value="image-left"${slide.layout === 'image-left' ? ' selected' : ''}>Image Left</option>
              <option value="image-right"${slide.layout === 'image-right' ? ' selected' : ''}>Image Right</option>
            </select>
          </div>
        `;

      default:
        return renderTypeSpecificInputs('bullets', slide);
    }
  }

  function attachSlideHandlers() {
    // Remove buttons
    $slidesContainer.querySelectorAll('.slide-editor__remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const slides = getSlideEditors();
        if (slides.length <= 1) return; // minimum 1 slide
        btn.closest('.slide-editor').remove();
        renumberSlides();
        schedulePreviewUpdate();
      });
    });

    // Slide type change
    $slidesContainer.querySelectorAll('.slide-type').forEach(select => {
      select.addEventListener('change', (e) => {
        const editor = e.target.closest('.slide-editor');
        const slideIndex = parseInt(editor.dataset.slideIndex, 10);
        const newType = e.target.value;
        
        // Preserve the title if it exists
        const currentTitle = editor.querySelector('.slide-title')?.value || '';
        
        // Get current slide data before replacing
        const currentSlide = getSlideData(editor);
        currentSlide.type = newType;
        
        // Render new inputs
        const contentContainer = editor.querySelector('.slide-type-content');
        contentContainer.innerHTML = renderTypeSpecificInputs(newType, currentSlide);
        
        // Reattach handlers for the new inputs
        attachSlideHandlers();
        
        schedulePreviewUpdate();
      });
    });

    // Dynamic button handlers
    attachDynamicButtonHandlers();

    // Input change → preview update + track active slide
    $slidesContainer.querySelectorAll('input, textarea, select').forEach(el => {
      el.addEventListener('focus', () => {
        const editor = el.closest('.slide-editor');
        if (editor) {
          activeEditingSlide = parseInt(editor.dataset.slideIndex, 10);
        }
      });
      el.addEventListener('blur', () => {
        // Small delay so the value persists through the update cycle
        setTimeout(() => { activeEditingSlide = -1; }, 500);
      });
      el.addEventListener('input', () => {
        const editor = el.closest('.slide-editor');
        if (editor) {
          activeEditingSlide = parseInt(editor.dataset.slideIndex, 10);
        }
        schedulePreviewUpdate();
      });
      el.addEventListener('change', () => {
        const editor = el.closest('.slide-editor');
        if (editor) {
          activeEditingSlide = parseInt(editor.dataset.slideIndex, 10);
        }
        schedulePreviewUpdate();
      });
    });
  }

  function attachDynamicButtonHandlers() {
    // Metric buttons
    $slidesContainer.querySelectorAll('.add-metric-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const container = e.target.closest('.form-group').querySelector('.metrics-container');
        const nextIndex = container.children.length;
        const newMetric = document.createElement('div');
        newMetric.className = 'metric-group';
        newMetric.dataset.metric = nextIndex;
        newMetric.innerHTML = `
          <div class="metric-inputs">
            <input type="text" class="metric-number" value="" placeholder="100">
            <input type="text" class="metric-label" value="" placeholder="Label">
            <button type="button" class="remove-metric" data-remove-metric="${nextIndex}">✕</button>
          </div>
        `;
        container.appendChild(newMetric);
        attachSlideHandlers();
        schedulePreviewUpdate();
      });
    });

    $slidesContainer.querySelectorAll('.remove-metric').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.target.closest('.metric-group').remove();
        schedulePreviewUpdate();
      });
    });

    // Table buttons
    $slidesContainer.querySelectorAll('.add-row-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const container = e.target.closest('.form-group').querySelector('.table-container');
        const colCount = container.querySelector('.table-row').children.length - 1; // -1 for remove button
        const rowIndex = container.children.length;
        const newRow = document.createElement('div');
        newRow.className = 'table-row';
        newRow.dataset.row = rowIndex;
        
        let rowHTML = '';
        for (let col = 0; col < colCount; col++) {
          rowHTML += `<input type="text" class="table-cell" data-row="${rowIndex}" data-col="${col}" value="" placeholder="Cell ${rowIndex + 1}-${col + 1}">`;
        }
        rowHTML += `<button type="button" class="remove-row" data-remove-row="${rowIndex}">✕</button>`;
        
        newRow.innerHTML = rowHTML;
        container.appendChild(newRow);
        attachSlideHandlers();
        schedulePreviewUpdate();
      });
    });

    $slidesContainer.querySelectorAll('.add-column-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const container = e.target.closest('.form-group').querySelector('.table-container');
        const rows = container.querySelectorAll('.table-row');
        const newColIndex = rows[0].querySelectorAll('.table-cell').length;
        
        rows.forEach((row, rowIndex) => {
          const newCell = document.createElement('input');
          newCell.type = 'text';
          newCell.className = 'table-cell';
          newCell.dataset.row = rowIndex;
          newCell.dataset.col = newColIndex;
          newCell.value = '';
          newCell.placeholder = `Cell ${rowIndex + 1}-${newColIndex + 1}`;
          
          const removeBtn = row.querySelector('.remove-row');
          if (removeBtn) {
            row.insertBefore(newCell, removeBtn);
          } else {
            row.appendChild(newCell);
          }
        });
        
        attachSlideHandlers();
        schedulePreviewUpdate();
      });
    });

    $slidesContainer.querySelectorAll('.remove-row').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.target.closest('.table-row').remove();
        schedulePreviewUpdate();
      });
    });

    // Chart series buttons
    $slidesContainer.querySelectorAll('.add-series-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const container = e.target.closest('.form-group').querySelector('.chart-series-container');
        const seriesIndex = container.children.length;
        const editor = e.target.closest('.slide-editor');
        const type = editor.querySelector('.slide-type').value;
        
        const newSeries = document.createElement('div');
        newSeries.className = 'series-group';
        newSeries.dataset.series = seriesIndex;
        
        if (type === 'line-chart') {
          newSeries.innerHTML = `
            <div class="series-header">
              <input type="text" class="series-name" value="Series ${seriesIndex + 1}" placeholder="Series name">
              <button type="button" class="remove-series" data-remove-series="${seriesIndex}">Remove Series</button>
            </div>
            <div class="series-data">
              <div class="data-point" data-series="${seriesIndex}" data-point="0">
                <input type="text" class="data-x" value="" placeholder="X-Label">
                <input type="number" class="data-y" value="" placeholder="Y-Value">
                <button type="button" class="remove-data-point" data-remove-point="${seriesIndex}-0">✕</button>
              </div>
            </div>
            <button type="button" class="add-data-point" data-add-point="${seriesIndex}">+ Add Data Point</button>
          `;
        } else {
          newSeries.innerHTML = `
            <div class="series-header">
              <input type="text" class="series-name" value="Series ${seriesIndex + 1}" placeholder="Series name">
              <button type="button" class="remove-series" data-remove-series="${seriesIndex}">Remove Series</button>
            </div>
            <div class="series-data">
              <div class="data-point" data-series="${seriesIndex}" data-point="0">
                <input type="text" class="data-label" value="" placeholder="Label">
                <input type="number" class="data-value" value="" placeholder="Value">
                <button type="button" class="remove-data-point" data-remove-point="${seriesIndex}-0">✕</button>
              </div>
            </div>
            <button type="button" class="add-data-point" data-add-point="${seriesIndex}">+ Add Data Point</button>
          `;
        }
        
        container.appendChild(newSeries);
        attachSlideHandlers();
        schedulePreviewUpdate();
      });
    });

    $slidesContainer.querySelectorAll('.remove-series').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.target.closest('.series-group').remove();
        schedulePreviewUpdate();
      });
    });

    $slidesContainer.querySelectorAll('.add-data-point').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const seriesContainer = e.target.closest('.series-group').querySelector('.series-data');
        const seriesIndex = e.target.dataset.addPoint;
        const pointIndex = seriesContainer.children.length;
        const editor = e.target.closest('.slide-editor');
        const type = editor.querySelector('.slide-type').value;
        
        const newPoint = document.createElement('div');
        newPoint.className = 'data-point';
        newPoint.dataset.series = seriesIndex;
        newPoint.dataset.point = pointIndex;
        
        if (type === 'line-chart') {
          newPoint.innerHTML = `
            <input type="text" class="data-x" value="" placeholder="X-Label">
            <input type="number" class="data-y" value="" placeholder="Y-Value">
            <button type="button" class="remove-data-point" data-remove-point="${seriesIndex}-${pointIndex}">✕</button>
          `;
        } else {
          newPoint.innerHTML = `
            <input type="text" class="data-label" value="" placeholder="Label">
            <input type="number" class="data-value" value="" placeholder="Value">
            <button type="button" class="remove-data-point" data-remove-point="${seriesIndex}-${pointIndex}">✕</button>
          `;
        }
        
        seriesContainer.appendChild(newPoint);
        attachSlideHandlers();
        schedulePreviewUpdate();
      });
    });

    $slidesContainer.querySelectorAll('.remove-data-point').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.target.closest('.data-point').remove();
        schedulePreviewUpdate();
      });
    });

    // Pie chart segment buttons
    $slidesContainer.querySelectorAll('.add-segment-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const container = e.target.closest('.form-group').querySelector('.segments-container');
        const segmentIndex = container.children.length;
        const newSegment = document.createElement('div');
        newSegment.className = 'segment-group';
        newSegment.dataset.segment = segmentIndex;
        newSegment.innerHTML = `
          <input type="text" class="segment-label" value="" placeholder="Segment label">
          <input type="number" class="segment-value" value="" placeholder="Value">
          <button type="button" class="remove-segment" data-remove-segment="${segmentIndex}">✕</button>
        `;
        container.appendChild(newSegment);
        attachSlideHandlers();
        schedulePreviewUpdate();
      });
    });

    $slidesContainer.querySelectorAll('.remove-segment').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.target.closest('.segment-group').remove();
        schedulePreviewUpdate();
      });
    });
  }

  function renumberSlides() {
    $slidesContainer.querySelectorAll('.slide-editor').forEach((el, i) => {
      el.dataset.slideIndex = i;
      el.querySelector('.slide-editor__num').textContent = `Slide ${i + 1}`;
      el.querySelector('.slide-editor__remove').dataset.remove = i;
    });
  }

  function getSlideEditors() {
    return Array.from($slidesContainer.querySelectorAll('.slide-editor'));
  }

  // ===================================================================
  // COLLECT FORM DATA
  // ===================================================================

  function getSlideData(editor) {
    const type = editor.querySelector('.slide-type').value;
    const slideData = { type };

    switch (type) {
      case 'title':
        slideData.title = editor.querySelector('.slide-title')?.value || '';
        slideData.subtitle = editor.querySelector('.slide-subtitle')?.value || '';
        slideData.badge = editor.querySelector('.slide-badge')?.value || '';
        break;

      case 'bullets':
        slideData.title = editor.querySelector('.slide-title')?.value || '';
        slideData.content = editor.querySelector('.slide-content')?.value || '';
        break;

      case 'two-column':
        slideData.title = editor.querySelector('.slide-title')?.value || '';
        slideData.leftColumn = editor.querySelector('.slide-left-column')?.value || '';
        slideData.rightColumn = editor.querySelector('.slide-right-column')?.value || '';
        break;

      case 'stats':
        slideData.title = editor.querySelector('.slide-title')?.value || '';
        slideData.metrics = Array.from(editor.querySelectorAll('.metric-group')).map(group => ({
          number: group.querySelector('.metric-number')?.value || '',
          label: group.querySelector('.metric-label')?.value || ''
        }));
        break;

      case 'quote':
        slideData.quote = editor.querySelector('.slide-quote')?.value || '';
        slideData.attribution = editor.querySelector('.slide-attribution')?.value || '';
        break;

      case 'table':
        slideData.title = editor.querySelector('.slide-title')?.value || '';
        const rows = Array.from(editor.querySelectorAll('.table-row'));
        slideData.tableData = rows.map(row => 
          Array.from(row.querySelectorAll('.table-cell')).map(cell => cell.value || '')
        );
        break;

      case 'bar-chart':
      case 'line-chart':
        slideData.title = editor.querySelector('.slide-title')?.value || '';
        slideData.series = Array.from(editor.querySelectorAll('.series-group')).map(series => {
          const name = series.querySelector('.series-name')?.value || '';
          const dataPoints = Array.from(series.querySelectorAll('.data-point')).map(point => {
            if (type === 'line-chart') {
              return {
                x: point.querySelector('.data-x')?.value || '',
                y: parseFloat(point.querySelector('.data-y')?.value) || 0
              };
            } else {
              return {
                label: point.querySelector('.data-label')?.value || '',
                value: parseFloat(point.querySelector('.data-value')?.value) || 0
              };
            }
          });
          return { name, data: dataPoints };
        });
        break;

      case 'pie-chart':
        slideData.title = editor.querySelector('.slide-title')?.value || '';
        slideData.segments = Array.from(editor.querySelectorAll('.segment-group')).map(segment => ({
          label: segment.querySelector('.segment-label')?.value || '',
          value: parseFloat(segment.querySelector('.segment-value')?.value) || 0
        }));
        break;

      case 'image-text':
        slideData.title = editor.querySelector('.slide-title')?.value || '';
        slideData.imageUrl = editor.querySelector('.slide-image-url')?.value || '';
        slideData.description = editor.querySelector('.slide-description')?.value || '';
        slideData.layout = editor.querySelector('.slide-layout')?.value || 'image-left';
        break;

      default:
        slideData.title = editor.querySelector('.slide-title')?.value || '';
        slideData.content = editor.querySelector('.slide-content')?.value || '';
        break;
    }

    return slideData;
  }

  function getFormData() {
    const slides = getSlideEditors().map(getSlideData);

    return {
      companyName: $companyName.value || 'Company',
      accentColor: $accentColor.value,
      slides,
    };
  }

  // ===================================================================
  // LIVE PREVIEW
  // ===================================================================

  function schedulePreviewUpdate() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(updatePreview, 300);
  }

  function updatePreview() {
    if (!selectedTemplate) return;

    const config = getFormData();
    const html = selectedTemplate.generator(config);

    // Determine which slide to show after render
    const targetSlide = activeEditingSlide >= 0
      ? Math.min(activeEditingSlide, config.slides.length - 1)
      : currentPreviewSlide;

    // Write to iframe via srcdoc
    $previewFrame.srcdoc = html;

    // Update slide counter
    const total = config.slides.length;
    currentPreviewSlide = Math.min(targetSlide, total - 1);
    $slideCounter.textContent = `${currentPreviewSlide + 1} / ${total}`;

    // After iframe loads, scroll to the target slide
    $previewFrame.onload = () => {
      if (currentPreviewSlide > 0) {
        try {
          const iframeDoc = $previewFrame.contentDocument || $previewFrame.contentWindow.document;
          const slides = iframeDoc.querySelectorAll('.slide, section[data-index]');
          if (slides[currentPreviewSlide]) {
            slides[currentPreviewSlide].scrollIntoView({ behavior: 'instant' });
          }
        } catch (e) {}
      }
    };
  }

  function navigatePreview(direction) {
    const config = getFormData();
    const total = config.slides.length;
    const next = currentPreviewSlide + direction;

    if (next < 0 || next >= total) return;
    currentPreviewSlide = next;
    $slideCounter.textContent = `${currentPreviewSlide + 1} / ${total}`;

    // Scroll the iframe to the target slide
    try {
      const iframeDoc = $previewFrame.contentDocument || $previewFrame.contentWindow.document;
      const slides = iframeDoc.querySelectorAll('.slide, section[data-index]');
      if (slides[currentPreviewSlide]) {
        slides[currentPreviewSlide].scrollIntoView({ behavior: 'smooth' });
      }
    } catch (e) {
      // Cross-origin fallback — won't happen with srcdoc but just in case
    }
  }

  // ===================================================================
  // DOWNLOAD
  // ===================================================================

  function downloadDeck() {
    if (!selectedTemplate) {
      alert('Please select a template first.');
      document.getElementById('templates').scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const config = getFormData();
    config.watermark = !isLicensed(); // Add watermark for free downloads
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
  // SCROLL ANIMATIONS & FLOATING DOWNLOAD BUTTON
  // ===================================================================

  function initScrollAnimations() {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // once
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
      // Exit current slide
      slides[idx].classList.remove('mockup__slide--active');
      slides[idx].classList.add('mockup__slide--exit');
      if (dots[idx]) dots[idx].classList.remove('mockup__dot--active');

      // After exit transition, hide it
      const exitIdx = idx;
      setTimeout(() => {
        slides[exitIdx].classList.remove('mockup__slide--exit');
      }, 600);

      // Enter next slide
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add('mockup__slide--active');
      if (dots[idx]) dots[idx].classList.add('mockup__dot--active');
    }, 3500);
  }

  // ===================================================================
  // UTILITIES
  // ===================================================================

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function escapeAttr(str) {
    return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function slugify(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'deck';
  }

  // ===================================================================
  // LICENSE KEY MANAGEMENT
  // ===================================================================

  const GUMROAD_PRODUCT_ID = 'DgpsRDZt7gAd_8TVqrp1hw==';
  const LICENSE_STORAGE_KEY = 'htmldecks_license';

  /**
   * Get stored license data from localStorage.
   * @returns {object|null} { key, email, verified_at, uses } or null
   */
  function getLicense() {
    try {
      const raw = localStorage.getItem(LICENSE_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Save license data to localStorage.
   * @param {object} data - { key, email, verified_at, uses }
   */
  function saveLicense(data) {
    localStorage.setItem(LICENSE_STORAGE_KEY, JSON.stringify(data));
  }

  /**
   * Check if a valid license exists in localStorage.
   * @returns {boolean}
   */
  function isLicensed() {
    const license = getLicense();
    return !!(license && license.key && license.verified_at);
  }

  /**
   * Verify a license key against the Gumroad API.
   * @param {string} key - license key to verify
   * @returns {Promise<{success: boolean, email?: string, uses?: number, error?: string}>}
   */
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

  /**
   * Show the license key modal.
   */
  function showLicenseModal() {
    var $modal = document.getElementById('licenseModal');
    var $input = document.getElementById('licenseKeyInput');
    var $error = document.getElementById('licenseError');
    var $btn   = document.getElementById('licenseVerifyBtn');

    // Reset state
    $input.value = '';
    $error.style.display = 'none';
    $btn.textContent = 'Verify Key';
    $btn.disabled = false;
    $modal.style.display = 'flex';
  }

  /**
   * Close the license key modal.
   */
  function closeLicenseModal() {
    document.getElementById('licenseModal').style.display = 'none';
  }

  /**
   * Update UI elements based on license status.
   * Shows/hides badge, updates download button visibility.
   */
  function updateLicenseUI() {
    updateDownloadButtons();
  }

  /**
   * Update the two download buttons based on license status.
   * Free button: always visible (email gate, watermarked download)
   * Pro button: hidden when licensed, shown when not
   */
  function updateDownloadButtons() {
    var licensed = isLicensed();
    var $badge = document.getElementById('licenseBadge');
    var $divider = document.querySelector('.editor__download-divider');
    var $proNote = document.querySelector('.editor__download-note-pro');

    // Show/hide badge
    if ($badge) {
      $badge.style.display = licensed ? 'inline-flex' : 'none';
    }

    // If licensed, hide the pro button + divider (they already have access)
    if ($downloadProBtn) {
      $downloadProBtn.style.display = licensed ? 'none' : '';
    }
    if ($divider) {
      $divider.style.display = licensed ? 'none' : '';
    }
    if ($proNote) {
      $proNote.style.display = licensed ? 'none' : '';
    }

    // Update free button text based on license
    if ($downloadFreeBtn) {
      if (licensed) {
        $downloadFreeBtn.textContent = '⬇ Download Your Deck';
        // Restyle as primary when it's the only button
        $downloadFreeBtn.className = 'btn btn--download-pro btn--lg btn--block';
      } else {
        $downloadFreeBtn.textContent = '⬇ Download This Template — Free';
        $downloadFreeBtn.className = 'btn btn--download-free btn--lg btn--block';
      }
    }
  }

  /**
   * Handle the license key verification flow.
   * Called from verify button click or after Gumroad purchase callback.
   */
  async function handleLicenseVerify() {
    var $input = document.getElementById('licenseKeyInput');
    var $error = document.getElementById('licenseError');
    var $btn   = document.getElementById('licenseVerifyBtn');
    var key    = $input.value.trim();

    // Basic validation
    if (!key) {
      $error.textContent = 'Please enter a license key.';
      $error.style.display = 'block';
      return;
    }

    // Loading state
    $btn.textContent = 'Verifying…';
    $btn.disabled = true;
    $btn.style.opacity = '0.7';
    $error.style.display = 'none';

    var result = await verifyLicenseKey(key);

    if (result.success) {
      // Save license
      saveLicense({
        key: key,
        email: result.email,
        verified_at: new Date().toISOString(),
        uses: result.uses,
      });

      // Close modal, update UI, trigger download
      closeLicenseModal();
      updateLicenseUI();
      downloadDeck();
    } else {
      $error.textContent = result.error;
      $error.style.display = 'block';
    }

    // Reset button
    $btn.textContent = 'Verify Key';
    $btn.disabled = false;
    $btn.style.opacity = '1';
  }

  /**
   * Listen for Gumroad overlay purchase completion via postMessage.
   * If a license key is received, auto-fill and verify.
   */
  function initGumroadListener() {
    window.addEventListener('message', function (event) {
      // Only accept messages from Gumroad
      if (!event.origin || event.origin.indexOf('gumroad.com') === -1) return;

      var data = event.data;
      if (typeof data === 'string') {
        try { data = JSON.parse(data); } catch (e) { return; }
      }
      if (!data) return;

      // Check for sale completion — Gumroad may send license key
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
  // EVENT BINDINGS
  // ===================================================================

  function bindEvents() {
    // Add slide
    $addSlideBtn.addEventListener('click', () => {
      const slides = getSlideEditors();
      const newIndex = slides.length;
      const div = document.createElement('div');
      div.innerHTML = createSlideEditorHTML(newIndex, { title: 'New Slide', content: 'Your content here' });
      $slidesContainer.appendChild(div.firstElementChild);
      attachSlideHandlers();
      schedulePreviewUpdate();

      // Scroll to new slide editor
      $slidesContainer.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    // Global field changes → preview
    $companyName.addEventListener('input', schedulePreviewUpdate);
    $accentColor.addEventListener('input', () => {
      $accentValue.textContent = $accentColor.value;
      schedulePreviewUpdate();
    });

    // Free download button — email gate for any template (watermarked)
    $downloadFreeBtn.addEventListener('click', function() {
      if (!selectedTemplate) {
        alert('Please select a template first.');
        document.getElementById('templates').scrollIntoView({ behavior: 'smooth' });
        return;
      }

      if (isLicensed()) {
        // Licensed users get clean download directly
        downloadDeck();
      } else {
        // Show email capture modal for free (watermarked) download
        document.getElementById('emailModal').style.display = 'flex';
      }
    });

    // Pro download button — license key / Gumroad purchase
    $downloadProBtn.addEventListener('click', function() {
      if (!selectedTemplate) {
        alert('Please select a template first.');
        document.getElementById('templates').scrollIntoView({ behavior: 'smooth' });
        return;
      }
      showLicenseModal();
    });

    // Email modal submit
    document.getElementById('emailForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const email = document.getElementById('emailInput').value;
      if (!email) return;

      // Send email to collection endpoint (Formspree or similar)
      const formEndpoint = document.getElementById('emailForm').getAttribute('action');
      if (formEndpoint && formEndpoint !== '#') {
        fetch(formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ email: email, source: 'htmldecks', template: selectedTemplate ? selectedTemplate.id : 'unknown' })
        }).catch(() => {}); // fire and forget
      }

      // Close modal and trigger download
      document.getElementById('emailModal').style.display = 'none';
      downloadDeck();
    });

    // Email modal close
    document.getElementById('emailModalClose').addEventListener('click', function() {
      document.getElementById('emailModal').style.display = 'none';
    });

    // License modal — verify button
    document.getElementById('licenseVerifyBtn').addEventListener('click', handleLicenseVerify);

    // License modal — enter key submits
    document.getElementById('licenseKeyInput').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') handleLicenseVerify();
    });

    // License modal — close button
    document.getElementById('licenseModalClose').addEventListener('click', closeLicenseModal);

    // Preview navigation
    $prevSlideBtn.addEventListener('click', () => navigatePreview(-1));
    $nextSlideBtn.addEventListener('click', () => navigatePreview(1));

    // Change template button
    $changeTemplateBtn.addEventListener('click', () => {
      document.getElementById('templates').scrollIntoView({ behavior: 'smooth' });
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

    // Auto-select first template so editor isn't empty
    const firstAvailable = TEMPLATES.find(t => t.available);
    if (firstAvailable) {
      selectTemplate(firstAvailable);
      // Don't scroll to editor on load
      window.scrollTo(0, 0);
    }

    // Show license badge if already licensed
    updateLicenseUI();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
