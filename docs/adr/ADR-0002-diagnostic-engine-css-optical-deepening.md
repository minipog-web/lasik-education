# ADR-0002: Candidacy Diagnostic Engine, Stylesheet Consolidation & Optical Physics Seam

- **Status:** Accepted
- **Date:** October 7, 2026
- **Context:** Architecture review performed via `/improve-codebase-architecture` (Candidates 1, 2, and 3 selected).

---

## Context and Problem Statement

Following the multi-page educational portal expansion (technology, procedure journey, surgeons, pricing & financing subpages), architectural friction emerged across three core areas:

1. **67KB Monolithic Inline Script in `index.html`:** The 60-second adaptive candidacy quiz screener, multi-step consultation appointment booking flow, and phone number normalization were tightly coupled to imperative DOM queries without a testable seam.
2. **13,200-Line Stylesheet with Specificity Wars:** `assets/custom-styles.css` expanded from 5,400 to 13,233 lines with 18 scattered `@media (max-width: 768px)` blocks and repeated override definitions (`.hero-image-card` defined 6x, `.trust-pillar-card` defined 6x) with escalating `!important` declarations.
3. **Dual Implementations of Refractive Physics:** Astigmatism cylinder formulas, Zernike aberration RMS, and corneal photoablation math were implemented independently in `assets/corneal-topography.js` and an inline ray-tracing script in `technology.html`.

---

## Decision Drivers

- **Preserve 100% Visual & Behavioral Fidelity:** Zero regressions in conversion UI, quiz scoring, consultation scheduling, 3D/2D optical simulations, and responsive layout across desktop and mobile.
- **Locality:** Consolidate quiz scoring, booking flows, and CSS component declarations into single authoritative locations.
- **The Interface is the Test Surface:** Establish pure interfaces (`window.MaranoDiagnostic`, `window.MaranoOptical`) with headless in-memory test harnesses capable of sub-millisecond execution.
- **Strict Deployment Prohibition:** Full compliance with `.agents/AGENTS.md` (no automated deployments or remote git pushes).

---

## Decision Outcomes

### 1. Candidacy Diagnostic & Consultation Engine (`assets/diagnostic-consultation.js`)
- Encapsulate both the 60-second Candidacy Screener state machine and the Hero Micro-Commitment Consultation Flow behind `window.MaranoDiagnostic`.
- Expose `initQuiz()`, `initConsultation()`, `evaluateCandidacy(answers)`, and `setMockMode(boolean)`.
- Replace 1,300+ lines of inline script in `index.html` with a single external module link.

### 2. Stylesheet In-Place Consolidation (`assets/custom-styles.css`)
- In-place refactoring of `assets/custom-styles.css` into canonical structural layers:
  - Global Design Tokens & Typography
  - Core Portal Shell (Nav, Footer, Buttons)
  - Hero & Conversion Architecture (authoritative single-definition rules for `.hero-container`, `.hero-image-card`, `.hero-proof-text`)
  - Diagnostic & Simulation Components (Quiz, Calculator, Scrubber)
  - Subpage Modules
  - Consolidated Responsive Breakpoint Matrix (grouped `@media` queries)
- Eliminate duplicate selector rules and redundant `!important` escalation.

### 3. Biometric Optical Simulation Core (`assets/corneal-topography.js`)
- Deepen `assets/corneal-topography.js` to expose `window.MaranoOptical`, containing pure calculations for diopter-to-ablation depth, Zernike higher-order aberrations, and focal distance.
- `corneal-topography.js` 3D Pentacam canvas and `technology.html` 2D SVG ray-tracing canvas act as rendering adapters consuming `window.MaranoOptical`.

---

## Consequences

### Positive:
- **Testability:** Headless testing can verify 100% of candidacy quiz decision logic and optical physics formulas without browser rendering overhead.
- **Maintainability:** Component styling and layout bugs can be diagnosed in one predictable location per selector.
- **Performance:** Significant reduction in stylesheet parse and evaluation times, eliminating 1,300+ lines of duplicate inline DOM scripts.
- **Zero FOUC & Zero Drift:** Single source of truth for styles and shared simulation math.

### Neutral:
- Requires sequential verification across `index.html`, `technology.html`, and `assets/custom-styles.css` to confirm zero visual regression.
