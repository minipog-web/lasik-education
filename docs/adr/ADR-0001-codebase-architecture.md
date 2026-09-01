# ADR-0001: Codebase Architecture Consolidation & Telemetry Seam

- **Status:** Accepted
- **Date:** September 1, 2026
- **Context:** Architecture review performed via `/improve-codebase-architecture`

---

## Context and Problem Statement

The Marano Eye Care landing page originated as an exported Single Page Application bundle (`assets/index-nb1vded4_v2.js`, `assets/index-DhXpI4H_.css`). Over time, custom copy updates, conversion rate optimizations, and luxury aesthetic overhauls were introduced via:
1. Extensive inline JavaScript inside `index.html` (interception observers, polling intervals, and direct DOM rewrites).
2. An overriding CSS layer (`assets/custom-styles.css`) growing to 5,400+ lines with 4 to 11 competing definitions for critical components (`.hero-container`, `.hero-display-title`, `.hero-proof-text`) and heavy reliance on `!important`.
3. Marketing event analytics (`gtag`, Google Ads conversion tags, phone call tracking) coupled directly to volatile CSS class names and scattered inline event handlers.

This structure created temporal coupling (script execution race conditions), cache thrashing (`?v=99`), and high cognitive overhead for both human engineers and AI agents.

---

## Decision Drivers

- **Zero Visual & Functional Regressions:** Preserve 100% of the live high-converting luxury visual design, bold 3D hero typography, prominent 10px bezel hero imagery, and interactive widgets (60-second quiz, 6-step journey, vision simulator).
- **Preserve Dynamic Text Replacement:** Keep all dynamic text replacement mechanisms active and operational per explicit stakeholder directive.
- **Strict Single Source of Truth:** Unify CSS component definitions so that each layout block has one authoritative declaration.
- **Decoupled Telemetry:** Establish a clean, isolated telemetry module (`assets/telemetry.js`) with declarative contracts (`data-track`, `data-analytics-event`).
- **Strict Deployment Prohibition:** Strictly comply with `.agents/AGENTS.md` (no automated deployments or remote pushes).

---

## Considered Options

1. **Option 1: Complete Framework Rewrite (Vite + React from scratch):** High risk of visual discrepancy, timing regression, or loss of nuanced micro-interactions.
2. **Option 2: Status Quo (Continue appending CSS & inline scripts):** Worsens specificity wars and cache thrashing (`?v=100+`).
3. **Option 3: Deepened In-Place Architecture (Selected):**
   - Extract tracking logic into an isolated, testable Telemetry module (`assets/telemetry.js`).
   - Consolidate redundant CSS rules into canonical component layers in `assets/custom-styles.css`.
   - Preserve and stabilize dynamic text replacement engines.

---

## Decision Outcome

**Chosen Option:** Option 3 (Deepened In-Place Architecture).

### Architectural Seams Established:
1. **Telemetry Adapter (`assets/telemetry.js`):**
   - Encapsulates GA4, Google Tag (`GT-WKTZM5GN`), Google Ads (`AW-17962563730`), form interception, click-to-call conversion dispatches, and scroll/engagement milestones.
   - Provides global API `window.MaranoTelemetry` and listens to declarative `data-track` attributes.
2. **Canonical Stylesheet Architecture (`assets/custom-styles.css`):**
   - Single authoritative definition for `.hero-container` with built-in responsive media queries (1080px, 768px).
   - Single authoritative definition for `.hero-proof-text` enforcing strict single-line presentation.
   - Consolidated hero visual anchor (`.hero-image-card` 10px bezel, `.hero-image-wrapper`, `portalPulse`).
   - Pruned 100+ lines of duplicate and conflicting overrides.
3. **Dynamic Text Replacement Preservation:**
   - Maintained `customizeForCustomVue()` and section formatters in `index.html` with zero race conditions.

---

## Consequences

### Positive:
- **Maintainability:** AI agents and developers can now edit component rules in one predictable location without fighting multiple `!important` declarations.
- **Stability:** Marketing tracking will not break when CSS classes are refactored or renamed.
- **Performance:** Reduced stylesheet parse overhead and eliminated redundant timer execution.
- **Zero FOUC:** Clean, synchronous execution without visual regressions.

### Neutral / Trade-offs:
- Minified vendor bundles (`assets/index-nb1vded4_v2.js`) remain in the repository as compiled artifacts, with component adjustments mediated via clean CSS and stabilized DOM customization hooks.
