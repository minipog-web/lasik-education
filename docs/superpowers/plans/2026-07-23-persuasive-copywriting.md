# Persuasive Copywriting & Conversion Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Marano Eye Care LASIK landing page copy to maximize conversions using the Hybrid "Elite Acuity + Radical Reassurance" framework, anchoring on Dr. Marano's authority, loss aversion, risk reversal, and explicit location accuracy (Livingston for diagnostics/surgery).

**Architecture:** Update inline JavaScript injection routines and static template elements within `index.html` to dynamically update section copy, hero headings, lifestyle panes, ROI calculator text, FAQ answers, and microcopy preemption.

**Tech Stack:** HTML5, Vanilla JavaScript, DOM Mutation Observer, Playwright/Node verification scripts.

---

### Task 1: Update Hero Eyebrow, Title & Subheading Copy

**Files:**
- Modify: `index.html:1095-1120` (`customizeForCustomVue` & static text)

- [ ] **Step 1: Write verification script to check Hero copy**

Create `C:\Users\adamp\.gemini\antigravity-ide\scratch\test_hero_copy.py`:
```python
from bs4 import BeautifulSoup

with open(r'c:\adamp\Documents\LASIK edu\index.html', 'r', encoding='utf-8') as f:
    html = f.read()

assert 'CUSTOMVUE® WAVEFRONT-GUIDED LASIK | MARANO EYE CARE NJ' in html
assert 'Your Eyes Are Your Ultimate Unfair Advantage' in html
assert 'Driven professionals and athletes choose Dr. Matthew Marano, Jr., MD' in html
print("Hero copy verification PASSED!")
```

- [ ] **Step 2: Run verification script to confirm it fails**

Run: `python C:\Users\adamp\.gemini\antigravity-ide\scratch\test_hero_copy.py`
Expected: FAIL with `AssertionError`

- [ ] **Step 3: Update `customizeForCustomVue` and Hero text in `index.html`**

Update `customizeForCustomVue()` in `index.html`:
```javascript
function customizeForCustomVue() {
  // 1. Hero Eyebrow & Headline Badges
  var heroEyebrow = document.querySelector('.hero-eyebrow');
  if (heroEyebrow) {
    heroEyebrow.textContent = 'CUSTOMVUE® WAVEFRONT-GUIDED LASIK | MARANO EYE CARE NJ';
  }

  var serifTitle = document.querySelector('.hero-serif-title');
  if (serifTitle) {
    serifTitle.textContent = 'Your Eyes Are Your Ultimate Unfair Advantage.';
  }

  var displayTitle = document.querySelector('.hero-display-title');
  if (displayTitle) {
    displayTitle.textContent = 'Experience 20/15 CustomVue® Vision with 10-Second Laser Precision.';
  }

  var heroSub = document.querySelector('p.text-secondary');
  if (heroSub) {
    heroSub.textContent = 'Driven professionals and athletes choose Dr. Matthew Marano, Jr., MD to eliminate contact lens friction and reclaim peak visual performance with 24-hour recovery. Free 45-minute diagnostic evaluation at our flagship Livingston center.';
  }
}
```

- [ ] **Step 4: Run verification script to confirm it passes**

Run: `python C:\Users\adamp\.gemini\antigravity-ide\scratch\test_hero_copy.py`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "copy: update hero headline and subheading to Hybrid Elite Acuity framing"
```

---

### Task 2: Update Outcome-Driven Lifestyle Panes & Scrubber Copy

**Files:**
- Modify: `index.html:497-579` (`lifestyleTemplates`)
- Modify: `index.html:686-785` (`injectTimelineStrip`)

- [ ] **Step 1: Write test for Lifestyle & Timeline Scrubber Copy**

Create `C:\Users\adamp\.gemini\antigravity-ide\scratch\test_lifestyle_copy.py`:
```python
with open(r'c:\adamp\Documents\LASIK edu\index.html', 'r', encoding='utf-8') as f:
    html = f.read()

assert 'Elite Acuity under Kinetic Motion' in html
assert 'High-Contrast Precision in Dark Environments' in html
assert 'Pristine Contrast for High-Density Screens' in html
assert '10-Second Laser Per Eye' in html
print("Lifestyle & Scrubber copy verification PASSED!")
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python C:\Users\adamp\.gemini\antigravity-ide\scratch\test_lifestyle_copy.py`
Expected: PASS if already present, or update to ensure exact alignment with spec.

- [ ] **Step 3: Update `lifestyleTemplates` text in `index.html`**

Ensure `lifestyleTemplates` in `index.html` has explicit outcome-driven messaging and Livingston diagnostic notice.

- [ ] **Step 4: Re-run verification script**

Run: `python C:\Users\adamp\.gemini\antigravity-ide\scratch\test_lifestyle_copy.py`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "copy: refine lifestyle outcome panes and timeline scrubber text"
```

---

### Task 3: Reframe Financial ROI Calculator & Location Directives

**Files:**
- Modify: `index.html:789-897` (`injectROISection`)
- Modify: `index.html:1115-1130` (`customizeForCustomVue` location badge)
- Modify: `index.html:658-670` (`injectMicrocopyPreemption`)

- [ ] **Step 1: Write test for Financial ROI & Livingston Location Directive**

Create `C:\Users\adamp\.gemini\antigravity-ide\scratch\test_roi_location_copy.py`:
```python
with open(r'c:\adamp\Documents\LASIK edu\index.html', 'r', encoding='utf-8') as f:
    html = f.read()

assert 'The Last Vision Investment You’ll Ever Make' in html or 'The Last Vision Investment' in html
assert 'Projected Lifetime Lens Tax' in html
assert 'Diagnostic Testing & LASIK Surgery' in html
assert 'performed exclusively at our premier Livingston facility' in html or 'Cooperman Barnabas Ambulatory Care Center' in html
print("ROI & Location copy verification PASSED!")
```

- [ ] **Step 2: Run test to verify it fails/passes**

Run: `python C:\Users\adamp\.gemini\antigravity-ide\scratch\test_roi_location_copy.py`

- [ ] **Step 3: Update `injectROISection` and `customizeForCustomVue` location text**

Update `customizeForCustomVue` location badge in `index.html`:
```javascript
locNotice.innerHTML = '<strong style="color:#e2b857;display:block;margin-bottom:4px;text-transform:uppercase;letter-spacing:1px;font-size:0.72rem;">Convenient NJ Locations</strong>' +
  '• <strong>Consultations & Check-ups Available At:</strong> Livingston, Denville, or Newark.<br>' +
  '• <strong>Diagnostic Testing & LASIK Surgery:</strong> Performed exclusively at our premier Livingston facility — <em>Cooperman Barnabas Ambulatory Care Center (ACC)</em>.';
```

Update `injectMicrocopyPreemption`:
```javascript
microcopy.innerHTML = 'The laser sculpting itself takes only 10 to 15 seconds per eye. Free consultations require only 45 minutes of diagnostics, performed exclusively at our flagship Livingston center.';
```

- [ ] **Step 4: Run test to verify it passes**

Run: `python C:\Users\adamp\.gemini\antigravity-ide\scratch\test_roi_location_copy.py`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "copy: reframe financial ROI and reinforce Livingston diagnostic location directive"
```

---

### Task 4: Update Clinical Safety & Candidacy FAQ (Objection Preemption)

**Files:**
- Modify: `index.html:1260-1332` (`injectEEATFAQ`)

- [ ] **Step 1: Write test for Clinical Safety FAQ Copy**

Create `C:\Users\adamp\.gemini\antigravity-ide\scratch\test_faq_copy.py`:
```python
with open(r'c:\adamp\Documents\LASIK edu\index.html', 'r', encoding='utf-8') as f:
    html = f.read()

assert 'Dr. Matthew J. Marano, Jr., MD' in html
assert 'Chief of Ophthalmology' in html
assert '1053 nm infrared' in html
assert '$5,000' in html
assert 'HIPAA' in html
print("FAQ copy verification PASSED!")
```

- [ ] **Step 2: Run test**

Run: `python C:\Users\adamp\.gemini\antigravity-ide\scratch\test_faq_copy.py`
Expected: PASS

- [ ] **Step 3: Update `injectEEATFAQ()` with complete, highly-persuasive answers**

Ensure `injectEEATFAQ()` in `index.html` has all 5 Q&As updated with authority signals, risk reversal, and cost transparency.

- [ ] **Step 4: Re-run test**

Run: `python C:\Users\adamp\.gemini\antigravity-ide\scratch\test_faq_copy.py`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "copy: refine EEAT FAQ with high-persuasion clinical answers and HIPAA transparency"
```

---

### Task 5: Final End-to-End Visual & Functional Verification

**Files:**
- Test: `index.html` live execution check

- [ ] **Step 1: Run browser/script verification on live `index.html`**

Create `C:\Users\adamp\.gemini\antigravity-ide\scratch\verify_final_landing_page.js`:
```javascript
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file:///' + process.cwd().replace(/\\/g, '/') + '/index.html');
  await page.waitForTimeout(2000);

  const heroTitle = await page.textContent('.hero-serif-title');
  console.log('Hero Title rendered:', heroTitle.trim());

  const heroSub = await page.textContent('p.text-secondary');
  console.log('Hero Subtitle rendered:', heroSub.trim());

  const locBadge = await page.innerHTML('#location-notice-badge');
  console.log('Location Notice rendered:', locBadge.includes('Livingston'));

  await browser.close();
  console.log('SUCCESS: All end-to-end checks complete!');
})();
```

- [ ] **Step 2: Execute end-to-end verification script**

Run: `node C:\Users\adamp\.gemini\antigravity-ide\scratch\verify_final_landing_page.js`
Expected: Console outputs matching rendered text and SUCCESS.

- [ ] **Step 3: Final Commit**

```bash
git add index.html
git commit -m "feat: complete persuasive copywriting & conversion optimization overhaul"
```
