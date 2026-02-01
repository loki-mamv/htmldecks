#!/usr/bin/env node

/**
 * HTML Decks — Programmatic SEO Page Generator
 * 
 * Reads structured JSON data and HTML templates to generate
 * static SEO pages for use cases, industries, and comparisons.
 * 
 * Usage: node seo/build.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(__dirname, 'data');
const TMPL_DIR = path.join(__dirname, 'templates');
const SITE_URL = 'https://htmldecks.com';

// ── Load data ────────────────────────────────────────────────
function loadJSON(file) {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf-8'));
}

const useCases = loadJSON('use-cases.json');
const industries = loadJSON('industries.json');
const comparisons = loadJSON('comparisons.json');

// ── Load templates ───────────────────────────────────────────
function loadTemplate(file) {
  return fs.readFileSync(path.join(TMPL_DIR, file), 'utf-8');
}

const useCaseTemplate = loadTemplate('use-case.html');
const industryTemplate = loadTemplate('industry.html');
const comparisonTemplate = loadTemplate('comparison.html');

// ── Helpers ──────────────────────────────────────────────────

/** Simple {{var}} replacement */
function render(template, vars) {
  let html = template;
  for (const [key, value] of Object.entries(vars)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    html = html.replace(regex, value);
  }
  return html;
}

/** Build FAQ schema JSON-LD */
function buildFaqSchema(faqs) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };
  return JSON.stringify(schema, null, 2);
}

/** Build breadcrumb schema JSON-LD */
function buildBreadcrumbSchema(crumbs) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };
  return JSON.stringify(schema, null, 2);
}

/** Build breadcrumb HTML */
function buildBreadcrumbHTML(crumbs) {
  return crumbs.map((crumb, i) => {
    if (i === crumbs.length - 1) {
      return `<span class="breadcrumb__current">${crumb.name}</span>`;
    }
    return `<a href="${crumb.url}" class="breadcrumb__link">${crumb.name}</a>`;
  }).join(' <span class="breadcrumb__sep">›</span> ');
}

/** Build FAQ HTML */
function buildFaqHTML(faqs) {
  return faqs.map(faq => `
      <div class="faq__item">
        <h3 class="faq__question">${faq.q}</h3>
        <p class="faq__answer">${faq.a}</p>
      </div>`).join('\n');
}

/** Build related links HTML */
function buildRelatedLinks(items, type) {
  return items.map(item => {
    const prefix = type === 'use-case' ? '/use-cases/' : type === 'industry' ? '/industries/' : '/vs/';
    return `<a href="${prefix}${item.slug}/" class="related__link">${item.title}</a>`;
  }).join('\n          ');
}

/** Lookup items by slug from a data array */
function lookupSlugs(slugs, dataArray) {
  return slugs
    .map(slug => dataArray.find(d => d.slug === slug))
    .filter(Boolean);
}

/** Write file, creating directories as needed */
function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf-8');
}

/** Calculate depth for relative paths */
function getRelativeRoot(outputDir) {
  const rel = path.relative(outputDir, ROOT);
  return rel || '.';
}

// ── Build Use Case Pages ─────────────────────────────────────
function buildUseCases() {
  let count = 0;
  for (const uc of useCases) {
    const outputDir = path.join(ROOT, 'use-cases', uc.slug);
    const canonicalUrl = `${SITE_URL}/use-cases/${uc.slug}/`;
    const relRoot = getRelativeRoot(outputDir);

    const breadcrumbs = [
      { name: 'Home', url: `${SITE_URL}/` },
      { name: 'Use Cases', url: `${SITE_URL}/use-cases/` },
      { name: uc.h1, url: canonicalUrl }
    ];

    // Resolve related items
    const relatedUC = lookupSlugs(uc.relatedUseCases || [], useCases);
    const relatedInd = lookupSlugs(uc.relatedIndustries || [], industries);

    // Build related HTML
    let relatedHTML = '';
    if (relatedUC.length > 0) {
      relatedHTML += `
        <div class="related__section">
          <h3 class="related__heading">Related Templates</h3>
          <div class="related__grid">
            ${buildRelatedLinks(relatedUC, 'use-case')}
          </div>
        </div>`;
    }
    if (relatedInd.length > 0) {
      relatedHTML += `
        <div class="related__section">
          <h3 class="related__heading">Popular Industries</h3>
          <div class="related__grid">
            ${buildRelatedLinks(relatedInd, 'industry')}
          </div>
        </div>`;
    }

    const vars = {
      title: uc.title,
      metaDescription: uc.metaDescription,
      h1: uc.h1,
      intro: uc.intro,
      content: uc.content,
      ctaText: uc.ctaText || 'Start building your presentation →',
      canonicalUrl,
      faqSchema: buildFaqSchema(uc.faqs),
      breadcrumbSchema: buildBreadcrumbSchema(breadcrumbs),
      breadcrumbHTML: buildBreadcrumbHTML(breadcrumbs),
      faqHTML: buildFaqHTML(uc.faqs),
      relatedHTML,
      relativeRoot: relRoot,
      siteUrl: SITE_URL,
      slug: uc.slug,
      ogType: 'website',
      pageType: 'use-case'
    };

    const html = render(useCaseTemplate, vars);
    writeFile(path.join(outputDir, 'index.html'), html);
    count++;
  }
  return count;
}

// ── Build Industry Pages ─────────────────────────────────────
function buildIndustries() {
  let count = 0;
  for (const ind of industries) {
    const outputDir = path.join(ROOT, 'industries', ind.slug);
    const canonicalUrl = `${SITE_URL}/industries/${ind.slug}/`;
    const relRoot = getRelativeRoot(outputDir);

    const breadcrumbs = [
      { name: 'Home', url: `${SITE_URL}/` },
      { name: 'Industries', url: `${SITE_URL}/industries/` },
      { name: ind.h1, url: canonicalUrl }
    ];

    const relatedUC = lookupSlugs(ind.relatedUseCases || [], useCases);
    const relatedInd = lookupSlugs(ind.relatedIndustries || [], industries);

    let relatedHTML = '';
    if (relatedUC.length > 0) {
      relatedHTML += `
        <div class="related__section">
          <h3 class="related__heading">Popular Templates for ${ind.shortName || ind.h1}</h3>
          <div class="related__grid">
            ${buildRelatedLinks(relatedUC, 'use-case')}
          </div>
        </div>`;
    }
    if (relatedInd.length > 0) {
      relatedHTML += `
        <div class="related__section">
          <h3 class="related__heading">Related Industries</h3>
          <div class="related__grid">
            ${buildRelatedLinks(relatedInd, 'industry')}
          </div>
        </div>`;
    }

    const vars = {
      title: ind.title,
      metaDescription: ind.metaDescription,
      h1: ind.h1,
      intro: ind.intro,
      content: ind.content,
      ctaText: ind.ctaText || 'Browse presentation templates →',
      canonicalUrl,
      faqSchema: buildFaqSchema(ind.faqs),
      breadcrumbSchema: buildBreadcrumbSchema(breadcrumbs),
      breadcrumbHTML: buildBreadcrumbHTML(breadcrumbs),
      faqHTML: buildFaqHTML(ind.faqs),
      relatedHTML,
      relativeRoot: relRoot,
      siteUrl: SITE_URL,
      slug: ind.slug,
      ogType: 'website',
      pageType: 'industry'
    };

    const html = render(industryTemplate, vars);
    writeFile(path.join(outputDir, 'index.html'), html);
    count++;
  }
  return count;
}

// ── Build Comparison Pages ───────────────────────────────────
function buildComparisons() {
  let count = 0;
  for (const comp of comparisons) {
    const outputDir = path.join(ROOT, 'vs', comp.slug);
    const canonicalUrl = `${SITE_URL}/vs/${comp.slug}/`;
    const relRoot = getRelativeRoot(outputDir);

    const breadcrumbs = [
      { name: 'Home', url: `${SITE_URL}/` },
      { name: 'Comparisons', url: `${SITE_URL}/vs/` },
      { name: `vs ${comp.competitor}`, url: canonicalUrl }
    ];

    // Comparison pages link to use cases and other comparisons
    const relatedComp = lookupSlugs(comp.relatedComparisons || [], comparisons);
    const relatedUC = lookupSlugs(comp.relatedUseCases || [], useCases);

    let relatedHTML = '';
    if (relatedComp.length > 0) {
      relatedHTML += `
        <div class="related__section">
          <h3 class="related__heading">More Comparisons</h3>
          <div class="related__grid">
            ${relatedComp.map(c => `<a href="/vs/${c.slug}/" class="related__link">HTML Decks vs ${c.competitor}</a>`).join('\n          ')}
          </div>
        </div>`;
    }
    if (relatedUC.length > 0) {
      relatedHTML += `
        <div class="related__section">
          <h3 class="related__heading">Popular Templates</h3>
          <div class="related__grid">
            ${buildRelatedLinks(relatedUC, 'use-case')}
          </div>
        </div>`;
    }

    const vars = {
      title: comp.title,
      metaDescription: comp.metaDescription,
      h1: comp.h1,
      intro: comp.intro,
      content: comp.content,
      competitor: comp.competitor,
      ctaText: comp.ctaText || 'Try HTML Decks free →',
      canonicalUrl,
      faqSchema: buildFaqSchema(comp.faqs),
      breadcrumbSchema: buildBreadcrumbSchema(breadcrumbs),
      breadcrumbHTML: buildBreadcrumbHTML(breadcrumbs),
      faqHTML: buildFaqHTML(comp.faqs),
      relatedHTML,
      relativeRoot: relRoot,
      siteUrl: SITE_URL,
      slug: comp.slug,
      ogType: 'website',
      pageType: 'comparison',
      comparisonTable: comp.comparisonTable || ''
    };

    const html = render(comparisonTemplate, vars);
    writeFile(path.join(outputDir, 'index.html'), html);
    count++;
  }
  return count;
}

// ── Build Hub/Index Pages ────────────────────────────────────
function buildHubPages() {
  // Use Cases hub
  const ucHubTemplate = loadTemplate('hub-use-cases.html');
  const ucLinks = useCases.map(uc => 
    `<a href="/use-cases/${uc.slug}/" class="hub__card">
        <h3 class="hub__card-title">${uc.h1}</h3>
        <p class="hub__card-desc">${uc.metaDescription}</p>
      </a>`
  ).join('\n      ');
  
  const ucHubHTML = render(ucHubTemplate, {
    links: ucLinks,
    siteUrl: SITE_URL,
    relativeRoot: '../..'
  });
  writeFile(path.join(ROOT, 'use-cases', 'index.html'), ucHubHTML);

  // Industries hub
  const indHubTemplate = loadTemplate('hub-industries.html');
  const indLinks = industries.map(ind =>
    `<a href="/industries/${ind.slug}/" class="hub__card">
        <h3 class="hub__card-title">${ind.h1}</h3>
        <p class="hub__card-desc">${ind.metaDescription}</p>
      </a>`
  ).join('\n      ');
  
  const indHubHTML = render(indHubTemplate, {
    links: indLinks,
    siteUrl: SITE_URL,
    relativeRoot: '../..'
  });
  writeFile(path.join(ROOT, 'industries', 'index.html'), indHubHTML);

  // Comparisons hub
  const compHubTemplate = loadTemplate('hub-comparisons.html');
  const compLinks = comparisons.map(comp =>
    `<a href="/vs/${comp.slug}/" class="hub__card">
        <h3 class="hub__card-title">HTML Decks vs ${comp.competitor}</h3>
        <p class="hub__card-desc">${comp.metaDescription}</p>
      </a>`
  ).join('\n      ');
  
  const compHubHTML = render(compHubTemplate, {
    links: compLinks,
    siteUrl: SITE_URL,
    relativeRoot: '../..'
  });
  writeFile(path.join(ROOT, 'vs', 'index.html'), compHubHTML);

  return 3;
}

// ── Build Sitemap ────────────────────────────────────────────
function buildSitemap() {
  const today = new Date().toISOString().split('T')[0];
  
  let urls = [];
  
  // Hub pages
  urls.push({ loc: `${SITE_URL}/use-cases/`, priority: '0.8' });
  urls.push({ loc: `${SITE_URL}/industries/`, priority: '0.8' });
  urls.push({ loc: `${SITE_URL}/vs/`, priority: '0.8' });

  // Use case pages
  for (const uc of useCases) {
    urls.push({ loc: `${SITE_URL}/use-cases/${uc.slug}/`, priority: '0.7' });
  }

  // Industry pages
  for (const ind of industries) {
    urls.push({ loc: `${SITE_URL}/industries/${ind.slug}/`, priority: '0.7' });
  }

  // Comparison pages
  for (const comp of comparisons) {
    urls.push({ loc: `${SITE_URL}/vs/${comp.slug}/`, priority: '0.7' });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  writeFile(path.join(ROOT, 'sitemap-seo.xml'), xml);
  return urls.length;
}

// ── Main ─────────────────────────────────────────────────────
function main() {
  console.log('🔨 HTML Decks — SEO Page Generator\n');

  const ucCount = buildUseCases();
  console.log(`  ✅ Use cases:    ${ucCount} pages`);

  const indCount = buildIndustries();
  console.log(`  ✅ Industries:   ${indCount} pages`);

  const compCount = buildComparisons();
  console.log(`  ✅ Comparisons:  ${compCount} pages`);

  const hubCount = buildHubPages();
  console.log(`  ✅ Hub pages:    ${hubCount} pages`);

  const sitemapCount = buildSitemap();
  console.log(`  ✅ Sitemap:      ${sitemapCount} URLs`);

  const total = ucCount + indCount + compCount + hubCount;
  console.log(`\n  📄 Total:        ${total} pages generated`);
  console.log(`  🗺️  Sitemap:      sitemap-seo.xml`);
  console.log('\nDone! ✨');
}

main();
