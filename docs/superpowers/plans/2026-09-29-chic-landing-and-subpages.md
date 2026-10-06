# Chic High-Converting Landing Page & 4 Dedicated Subpages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the monolithic 4,900-line portal into a chic, sleek, high-converting flagship landing page (`index.html`) and 4 dedicated, deep clinical educational subpages (`technology.html`, `procedure-journey.html`, `surgeons.html`, `pricing-financing.html`).

**Architecture:** Maintain a cohesive luxury dark spatial design system (`custom-styles.css`) across all pages. The landing page focuses on high conversion with rapid visual scan, immediate trust, and retained high-engagement interactive tools (20/15 Vision Simulator, Candidacy Quiz, ROI Calculator). The 4 subpages deliver comprehensive clinical depth, diagnostic charts, procedural breakdowns, surgical credentials, and financing guides.

**Tech Stack:** HTML5, CSS3 (Vanilla + Custom Design Tokens), JavaScript (ES Modules/Vanilla), Schema.org JSON-LD, Netlify Forms, Google Tag Manager & GA4 Telemetry.

---

### Task 1: Build the Dedicated Technology & Biophysics Subpage (`technology.html`)

**Files:**
- Create: `c:\adamp\Documents\LASIK edu\technology.html`
- Reference: `c:\adamp\Documents\LASIK edu\assets\custom-styles.css`
- Reference: `c:\adamp\Documents\LASIK edu\assets\corneal-topography.js`

- [x] **Step 1: Write `technology.html` with full clinical depth, structured data, navigation, and corneal topography integration**
  - Clinical breakdown of Hartmann-Shack WaveScan® wavefront aberrometry (measuring 240+ higher-order aberrations 25x finer than standard glasses/contacts).
  - Iris registration technology and active 3D cyclotorsional eye tracking (60Hz active tracking compensating for pupil centroid shift).
  - STAR S4 IR® cold ultraviolet (193nm) excimer laser photoablation mechanism (reshaping corneal curvature without thermal degradation).
  - Interactive Corneal Topography section powered by `assets/corneal-topography.js`.
  - Detailed comparison table: Custom Wavefront-Guided vs. Wavefront-Optimized vs. Conventional Bladed LASIK.
  - Full breadcrumbs (`Home > Technology & Biophysics`), canonical tags, OpenGraph metadata, and `MedicalWebPage` schema.
  - Global luxury navigation bar with active state on "Technology" and responsive mobile handling.
  - Direct conversion links to `/index.html#quiz` and `/index.html#booking`.

- [x] **Step 2: Validate `technology.html` syntax and script integration**
  Run: `node -e "const fs = require('fs'); const html = fs.readFileSync('technology.html', 'utf8'); console.log('File size:', html.length, 'Contains scripts:', (html.match(/<script/g)||[]).length);"`
  Expected: File size > 20,000 bytes, valid script and link references.

---

### Task 2: Build the Procedure Journey & 24-Hour Recovery Subpage (`procedure-journey.html`)

**Files:**
- Create: `c:\adamp\Documents\LASIK edu\procedure-journey.html`
- Reference: `c:\adamp\Documents\LASIK edu\assets\custom-styles.css`
- Reference: `c:\adamp\Documents\LASIK edu\assets\lasik_24hr_recovery.webp`

- [x] **Step 1: Write `procedure-journey.html` with step-by-step procedural guides and the 24-hour recovery scrubber**
  - 5-Stage Step-by-Step Clinical Journey:
    1. *Stage 01: 3D WaveScan Diagnostic Mapping & Iris Fingerprinting*
    2. *Stage 02: Blade-Free Femtosecond Flap Creation (IntraLase laser precision)*
    3. *Stage 03: Custom Ultraviolet Reshaping (Cold excimer photoablation, 10 seconds per eye)*
    4. *Stage 04: Flap Repositioning & Natural Capillary Adhesion (Microscopic seal without stitches)*
    5. *Stage 05: Immediate Stabilization & Next-Day Clarity*
  - Interactive 24-Hour Recovery Scrubber: Hour 0 through Hour 24 interactive scrubber card with driving, screen work, and exercise milestones.
  - Complete post-op clinical recovery protocol: Day 1, Week 1, Month 1, Month 3, and Year 1 milestones.
  - Surgery Day Itinerary: 90-minute clinic timeline breakdown.
  - Full breadcrumbs (`Home > Procedure & Recovery`), canonical URL, and schema markup.
  - Direct booking and candidacy CTAs.

- [x] **Step 2: Validate `procedure-journey.html` syntax and interactive elements**
  Run: `node -e "const fs = require('fs'); const html = fs.readFileSync('procedure-journey.html', 'utf8'); console.log('File size:', html.length, 'Contains scrubber:', html.includes('scrubber'));"`
  Expected: File size > 20,000 bytes, scrubber elements present.

---

### Task 3: Build the Surgeons & Clinical Standards Subpage (`surgeons.html`)

**Files:**
- Create: `c:\adamp\Documents\LASIK edu\surgeons.html`
- Reference: `c:\adamp\Documents\LASIK edu\assets\dr-marano.jpg`
- Reference: `c:\adamp\Documents\LASIK edu\assets\dr-raouf.jpg`

- [x] **Step 1: Write `surgeons.html` with complete surgeon dossiers, hospital credentials, and the 5 Buyer Questions Dossier**
  - Dr. Matthew J. Marano, Jr., M.D. Dossier: Chief of Ophthalmology at Cooperman Barnabas ACC and St. Michael's Medical Center, 40,000+ total surgical procedures, 15x NJ Top Doctor, pioneer in NJ refractive surgery, proctor and peer educator on complicated corneal cases.
  - Dr. Sherief Raouf, M.D. Dossier: Board-Certified Cornea, External Disease & Refractive Surgery Specialist, Fellowship-trained at the Illinois Eye and Ear Infirmary (UIC), complex astigmatism and custom topography specialist.
  - The 5 Critical Questions Every LASIK Provider Must Answer Before Touching Your Eyes (Buyer Dossier against high-volume commercial mills).
  - "Commercial Retail Mill vs. The Marano Clinical Standard" comprehensive comparison matrix.
  - Hospital accreditations, FAAO/ASCRS fellowships, and verified clinical standing.
  - Full breadcrumbs, schema markup, and direct CTAs.

- [x] **Step 2: Validate `surgeons.html` content and structure**
  Run: `node -e "const fs = require('fs'); const html = fs.readFileSync('surgeons.html', 'utf8'); console.log('File size:', html.length, 'Contains Marano:', html.includes('Marano'));"`
  Expected: File size > 20,000 bytes, contains both surgeon dossiers and comparison matrix.

---

### Task 4: Build the All-Inclusive Pricing, Financing & ROI Subpage (`pricing-financing.html`)

**Files:**
- Create: `c:\adamp\Documents\LASIK edu\pricing-financing.html`
- Reference: `c:\adamp\Documents\LASIK edu\assets\custom-styles.css`

- [x] **Step 1: Write `pricing-financing.html` detailing all-inclusive pricing, 0% APR terms, and tax savings**
  - Complete definition of "All-Inclusive Care": pre-op scans, dual-laser surgery, surgeon fees, facility fees, 12 months of follow-ups, and complimentary enhancement warranty.
  - The $37,000+ Lifetime Contact Lens & Glasses Expense Audit (breakdown of 25 years of lenses, solutions, prescription sunglasses, doctor visits).
  - 0% APR Financing: CareCredit & Alphaeon Credit promotional 12-month and 24-month options.
  - Pre-Tax HSA & FSA Strategies: How to utilize pre-tax healthcare dollars to save 20%–35% on LASIK.
  - Out-of-Network Vision Insurance Allowances (VSP, EyeMed, Blue Cross Blue Shield).
  - Deconstructing the "$250/Eye" Retail Mill Bait-and-Switch scam.
  - Full breadcrumbs, schema markup, and direct booking CTAs.

- [x] **Step 2: Validate `pricing-financing.html` content and structure**
  Run: `node -e "const fs = require('fs'); const html = fs.readFileSync('pricing-financing.html', 'utf8'); console.log('File size:', html.length, 'Contains CareCredit:', html.includes('CareCredit'));"`
  Expected: File size > 20,000 bytes, contains all financing and pricing modules.

---

### Task 5: Refactor Flagship Landing Page (`index.html`)

**Files:**
- Modify: `c:\adamp\Documents\LASIK edu\index.html`
- Reference: `c:\adamp\Documents\LASIK edu\assets\custom-styles.css`

- [x] **Step 1: Back up existing `index.html` to `scratch/index_backup.html`**
  Ensure safe reversibility before editing.

- [x] **Step 2: Refactor `index.html` into a chic, sleek, high-converting flagship landing page**
  - Maintain the high-converting luxury dark spatial aesthetic with generous negative space (25-35%).
  - Retain top navigation with direct links to the new subpages (`/technology.html`, `/procedure-journey.html`, `/surgeons.html`, `/pricing-financing.html`) plus smooth internal jump links.
  - Hero Section: High-impact typography ("Goodbye Lenses. Hello High-Definition Freedom."), 20/15 clarity guarantee, trust badges, and the 2-step consultation booking card (`#hero-mc-card`).
  - 60-Second Candidacy Screener (`#quiz`): Retained directly on the home page for immediate interactive self-testing.
  - 20/15 vs. 20/20 Night-Driving Vision Simulator (`#lasik-vision-simulator-section`): Retained directly below the quiz for high visual engagement.
  - Compact Surgeon Authority Strip (`#surgeons`): High-status bios of Dr. Marano & Dr. Raouf with clear link to `/surgeons.html`.
  - Visual Freedom Lifestyle Strip (`#lifestyle`): 4-tab interactive benefit showcase.
  - Financial ROI & Lifetime Expense Calculator (`#roi-section`): Retained interactive slider with link to `/pricing-financing.html`.
  - Curated Clinical Teaser Bento Grid ("The Science of Visual Clarity"): 4 luxury frosted-glass preview cards linking to `/technology.html`, `/procedure-journey.html`, `/surgeons.html`, and `/pricing-financing.html`.
  - Social Proof Showcase (`#reviews`): Curated 5-star Google patient outcome cards.
  - Top 5 Patient FAQs (`#faq`): Streamlined accordion with link to full clinical guide.
  - Practice Locations & Final Reservation Suite (`#contact`): Livingston, Denville, Newark centers + consultation form.
  - Footer & Mobile Sticky Dock: Full subpage links, sitemap links, and phone dial.

- [x] **Step 3: Validate `index.html` syntax, script integrity, and load behavior**
  Run: `node -e "const fs = require('fs'); const html = fs.readFileSync('index.html', 'utf8'); console.log('Index size:', html.length, 'Contains all 4 subpage links:', ['technology.html', 'procedure-journey.html', 'surgeons.html', 'pricing-financing.html'].every(s => html.includes(s)));"`
  Expected: Clean HTML structure, all 4 subpages linked, scripts functioning.

---

### Task 6: Cross-Page Navigation, Sitemap & QA Verification

**Files:**
- Modify: `c:\adamp\Documents\LASIK edu\sitemap.html` (Update links to reflect the 4 dedicated subpage URLs)
- Test: All 5 pages (`index.html`, `technology.html`, `procedure-journey.html`, `surgeons.html`, `pricing-financing.html`)

- [x] **Step 1: Update `sitemap.html` to prominently feature the 4 dedicated educational subpages**
  Ensure all category cards link directly to `/technology.html`, `/procedure-journey.html`, `/surgeons.html`, and `/pricing-financing.html`.

- [x] **Step 2: Test local web server using `server.cjs`**
  Start `server.cjs` and verify HTTP 200 responses across all 5 pages.
  Ensure zero 404 links, zero script errors, and responsive layouts.

- [x] **Step 3: Strict Deployment Check**
  Verify that NO deployment commands (Netlify, GitHub, Vercel) have been or will be executed per project rules.
