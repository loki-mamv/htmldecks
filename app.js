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
          { title: 'Acme Corp', content: 'The Future of Smart Automation' },
          { title: 'The Problem', content: '80% of businesses waste 20+ hours/week on manual tasks\nExisting solutions are fragmented and expensive\nTeams are burned out from repetitive work' },
          { title: 'Our Solution', content: 'AI-powered automation platform\nOne-click integrations with 200+ tools\nSaves teams 15+ hours per week on average' },
          { title: 'Market Opportunity', content: '$47B market growing 24% annually\n10M+ businesses underserved by current solutions\nFirst-mover advantage in SMB segment' },
          { title: 'Traction', content: '2,400 active companies on the platform\n$1.2M ARR — 3x growth year over year\n94% retention rate with NPS of 72' },
          { title: 'The Ask', content: 'Raising $5M Series A\nScale sales team from 4 → 20\nExpand to European market in Q3' },
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
          { title: 'Transform Your Workflow', content: 'Acme Solutions helps teams ship faster with less friction.' },
          { title: 'The Challenge', content: 'Your team spends 30% of time on coordination, not creation\nTools are disconnected — context gets lost between apps\nOnboarding new team members takes weeks, not days' },
          { title: 'How We Help', content: 'Unified workspace that replaces 5+ tools\nAI assistant handles scheduling, notes, and follow-ups\nNew team members are productive in 48 hours' },
          { title: 'Results That Matter', content: '42% faster project delivery\n3.2x improvement in team satisfaction scores\n$240K average annual savings per 50-person team' },
          { title: 'What Our Clients Say', content: '"Switched our entire org in a week. Best decision we made." — VP Eng, TechCo\n"Finally, a tool that works the way we think." — COO, ScaleUp Inc' },
          { title: 'Next Steps', content: '14-day free pilot — no credit card required\nDedicated onboarding specialist for your team\nLet\'s schedule a 30-minute walkthrough' },
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
          { title: 'The Future of Developer Experience', content: 'Why the best tools feel invisible' },
          { title: 'Context', content: 'I\'ve been building developer tools for 12 years\nShipped products used by 500K+ developers\nKeep making the same mistakes — and learning from them' },
          { title: 'The Big Idea', content: 'The best developer tool is the one you forget you\'re using' },
          { title: 'What Great DX Looks Like', content: 'Zero-config defaults that actually work\nError messages that tell you what to DO, not what went wrong\nDocumentation that starts with examples, not concepts' },
          { title: 'The Anti-Patterns', content: 'Requiring a PhD in YAML to get started\n"Flexible" really meaning "nothing works out of the box"\nChangelogs that break more than they fix' },
          { title: 'Thank You', content: '@janedoe on Twitter\njanedoe.dev' },
        ],
      },
    },
    {
      id: 'quarterly-review',
      name: 'Quarterly Review',
      description: 'Green/teal — for business reviews',
      gradient: 'linear-gradient(135deg, #38B584, #1A8A6A)',
      available: false,
    },
    {
      id: 'product-launch',
      name: 'Product Launch',
      description: 'Vibrant gradient — for launches',
      gradient: 'linear-gradient(135deg, #E14A8B, #F5A623, #5A49E1)',
      available: false,
    },
    {
      id: 'team-intro',
      name: 'Team Intro',
      description: 'Warm tones — for team pages',
      gradient: 'linear-gradient(135deg, #F5A623, #E8785E)',
      available: false,
    },
    {
      id: 'investor-update',
      name: 'Investor Update',
      description: 'Swiss minimal — for updates',
      gradient: 'linear-gradient(135deg, #2C2C2C, #666)',
      available: false,
    },
    {
      id: 'workshop',
      name: 'Workshop',
      description: 'Colorful friendly — for teaching',
      gradient: 'linear-gradient(135deg, #46D19A, #4A9FF5, #E14A8B)',
      available: false,
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
  const $downloadBtn     = document.getElementById('downloadBtn');
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

    // Update download button text
    if (tpl.id === 'startup-pitch') {
      $downloadBtn.textContent = '⬇ Download Free — just enter your email';
    } else if (isLicensed()) {
      $downloadBtn.textContent = '⬇ Download Your Deck';
    } else {
      $downloadBtn.textContent = '⬇ Download Your Deck — $29';
    }

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

  function createSlideEditorHTML(index, slide = { title: '', content: '' }) {
    return `
      <div class="slide-editor" data-slide-index="${index}">
        <div class="slide-editor__header">
          <span class="slide-editor__num">Slide ${index + 1}</span>
          <button class="slide-editor__remove" data-remove="${index}" title="Remove slide">✕ Remove</button>
        </div>
        <div class="form-group">
          <label>Slide Title</label>
          <input type="text" class="slide-title" value="${escapeAttr(slide.title)}" placeholder="Slide title...">
        </div>
        <div class="form-group">
          <label>Content (one bullet per line)</label>
          <textarea class="slide-content" rows="3" placeholder="Bullet point 1&#10;Bullet point 2&#10;Bullet point 3">${escapeHTML(slide.content)}</textarea>
        </div>
      </div>
    `;
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

    // Input change → preview update + track active slide
    $slidesContainer.querySelectorAll('input, textarea').forEach(el => {
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

  function getFormData() {
    const slides = getSlideEditors().map(el => ({
      title: el.querySelector('.slide-title').value || 'Untitled',
      content: el.querySelector('.slide-content').value || '',
    }));

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

  const GUMROAD_PRODUCT_ID = 'qaxrgd';
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
   * Shows/hides badge, updates download button text.
   */
  function updateLicenseUI() {
    var licensed = isLicensed();
    var $badge = document.getElementById('licenseBadge');

    // Show/hide badge
    if ($badge) {
      $badge.style.display = licensed ? 'inline-flex' : 'none';
    }

    // Update download button text if a premium template is selected
    if (selectedTemplate && selectedTemplate.id !== 'startup-pitch') {
      $downloadBtn.textContent = licensed
        ? '⬇ Download Your Deck'
        : '⬇ Download Your Deck — $29';
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

    // Download — free template = email gate, premium = license check
    $downloadBtn.addEventListener('click', function() {
      if (!selectedTemplate) {
        alert('Please select a template first.');
        document.getElementById('templates').scrollIntoView({ behavior: 'smooth' });
        return;
      }

      if (selectedTemplate.id === 'startup-pitch') {
        // Free template — show email capture modal
        document.getElementById('emailModal').style.display = 'flex';
      } else if (isLicensed()) {
        // Premium template — already licensed, download immediately
        downloadDeck();
      } else {
        // Premium template — show license key modal
        showLicenseModal();
      }
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
          body: JSON.stringify({ email: email, source: 'htmldecks', template: 'startup-pitch' })
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
