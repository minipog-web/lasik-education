const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const configPath = path.join(ROOT, 'assets', 'site-nav.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

/**
 * Builds the canonical navigation markup for a specific page.
 * @param {string} pageId - e.g. 'home', 'technology', 'procedure', 'surgeons', 'pricing', 'sitemap'
 */
function buildNav(pageId) {
  const isHome = pageId === 'home';
  const navItems = config.nav.items.map(item => {
    const isActive = item.id === pageId;
    const activeClass = isActive ? ' active-nav-link' : '';
    const ariaCurrent = isActive ? ' aria-current="page"' : '';
    return `        <a class="nav-link-item${activeClass}" href="${item.href}" data-nav="${item.id}"${ariaCurrent}>${item.label}</a>`;
  }).join('\n');

  const ctaHref = isHome ? '#hero-mc-card' : '/#hero-mc-card';
  const ctaOnClick = isHome ? ' onclick="scrollToElement(\'hero-mc-card\')"' : '';

  return `<nav id="main-navigation" class="scrolled subpage-nav-fixed" role="navigation" aria-label="Main Navigation">
      <a id="logo-container" href="/" aria-label="Marano Eye Care Homepage">
        <img alt="Marano Eye Care" class="nav-logo" src="./assets/marano-logo-Dw0Rx_0B.png" width="180" height="40" />
      </a>
      <div class="nav-links-group">
${navItems}
      </div>
      <a id="header-phone-link" href="tel:${config.nav.phone.tel}" class="header-phone-link" title="${config.nav.phone.title}" aria-label="Call Direct Surgical Coordinator Line at ${config.nav.phone.display}">
        <span class="btn-icon-bubble-phone" aria-hidden="true">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        </span>
        <span class="phone-text">${config.nav.phone.display}</span>
      </a>
      <a id="header-cta-btn" href="${ctaHref}"${ctaOnClick} class="btn btn-primary header-cta-btn" aria-label="${config.nav.cta.desktopLabel}">
        <span><span class="cta-desktop">${config.nav.cta.desktopLabel}</span><span class="cta-mobile">${config.nav.cta.mobileLabel}</span></span>
        <span class="btn-icon-bubble" aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </span>
      </a>
    </nav>`;
}

/**
 * Builds the canonical subpage footer markup for a specific page.
 * @param {string} pageId - e.g. 'technology', 'procedure', 'surgeons', 'pricing', 'sitemap'
 */
function buildSubpageFooter(pageId) {
  const links = config.footer.links.map(item => {
    const isActive = item.id === pageId;
    const activeClass = isActive ? ' footer-link-item-active' : '';
    const ariaCurrent = isActive ? ' aria-current="page"' : '';
    return `<a href="${item.href}" class="footer-link-item${activeClass}"${ariaCurrent}>${item.label}</a>`;
  }).join('\n        ');

  const offices = config.footer.offices.map(o => {
    return `<div class="footer-office-item"><strong>${o.name}:</strong> ${o.detail} &bull; <a href="tel:${o.tel}">${o.phone}</a></div>`;
  }).join('\n        ');

  return `<footer class="footer-subpage-master" role="contentinfo" aria-label="Footer Navigation & Practice Information">
      <div class="footer-subpage-container">
        <div class="footer-subpage-brand">
          <a href="/" aria-label="Marano Eye Care Homepage">
            <img alt="Marano Eye Care Logo" class="footer-logo-img" src="./assets/marano-logo-Dw0Rx_0B.png" width="180" height="40" loading="lazy" />
          </a>
          <p class="footer-brand-sub">
            Board-Certified Custom Wavefront-Guided Refractive Surgery Center in New Jersey led by Dr. Matthew J. Marano, Jr., M.D. and Dr. Sherief Raouf, M.D.
          </p>
        </div>

        <div class="footer-links-row" role="navigation" aria-label="Footer Navigation Links">
        ${links}
        </div>

        <div class="footer-offices-strip">
        ${offices}
        </div>

        <p class="footer-copyright">
          ${config.footer.copyright}
        </p>
        <p class="footer-disclaimer">
          ${config.footer.disclaimer}
        </p>
      </div>
    </footer>`;
}

// Map files to page IDs
const pages = [
  { file: 'index.html', id: 'home', isSubpage: false },
  { file: 'technology.html', id: 'technology', isSubpage: true },
  { file: 'procedure-journey.html', id: 'procedure', isSubpage: true },
  { file: 'surgeons.html', id: 'surgeons', isSubpage: true },
  { file: 'pricing-financing.html', id: 'pricing', isSubpage: true },
  { file: 'sitemap.html', id: 'sitemap', isSubpage: true }
];

console.log('=== SYNCHRONIZING SHARED NAVIGATION & FOOTER COMPONENTS ===\n');

pages.forEach(p => {
  const filePath = path.join(ROOT, p.file);
  if (!fs.existsSync(filePath)) {
    console.log(`[SKIP]: ${p.file} does not exist`);
    return;
  }

  let html = fs.readFileSync(filePath, 'utf8');
  const canonicalNav = buildNav(p.id);

  // 1. Replace nav
  if (p.file === 'sitemap.html') {
    // Sitemap originally had <header class="sitemap-header">...</header>
    if (html.includes('<nav id="main-navigation"')) {
      html = html.replace(/<nav id="main-navigation"[\s\S]*?<\/nav>/, canonicalNav);
    } else if (html.includes('<header class="sitemap-header">')) {
      html = html.replace(/<header class="sitemap-header">[\s\S]*?<\/header>/, canonicalNav);
    }
  } else {
    html = html.replace(/<nav id="main-navigation"[\s\S]*?<\/nav>/, canonicalNav);
  }

  // 2. Replace subpage footer if applicable
  if (p.isSubpage) {
    const canonicalFooter = buildSubpageFooter(p.id);
    html = html.replace(/<footer[\s\S]*?<\/footer>/, canonicalFooter);
  }

  fs.writeFileSync(filePath, html);
  console.log(`✓ Synchronized ${p.file} (Page ID: ${p.id})`);
});

console.log('\nAll pages synchronized successfully with assets/site-nav.json!');
