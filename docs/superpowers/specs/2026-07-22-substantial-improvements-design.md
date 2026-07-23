# Design Spec: Substantial Improvements (ROI Calculator & Adaptive Quiz)

**Date:** 2026-07-22  
**Status:** Approved  
**Target Application:** LASIK Education Landing Page (Marano Eye Care)

---

## 1. Overview & Objectives

This design introduces two major functional & conversion upgrades:
1. **Interactive LASIK Lifetime Cost & ROI Savings Calculator:** Demonstrates the long-term financial superiority of custom LASIK over recurring contacts and glasses tax, eliminating price friction upfront.
2. **Adaptive Multi-Step Biometric Candidacy Quiz & Visual Readiness Generator:** Replaces basic form fields with an engaging diagnostic quiz that provides immediate feedback and increases high-intent appointment scheduling.

---

## 2. Technical Specifications

### 2.1 Interactive ROI Calculator Widget
* **Target Location:** Replace static cards inside `#roi-section` in `index.html`.
* **Inputs & Controls:**
  * Age Slider (`#roi-age`): Range `18` to `55`, default `28`.
  * Monthly Spend Slider (`#roi-monthly`): Range `$30` to `$200`, default `$85`.
* **Dynamic Formulas:**
  * `Years Remaining = Math.max(15, 65 - Age)`
  * `Lifetime Tax = Monthly Spend * 12 * Years Remaining`
  * `Net Lifetime Savings = Lifetime Tax - 5000`
  * `Breakeven Month = Math.ceil(5000 / Monthly Spend)`
* **UI Elements:**
  * Animated progress bar comparing Lifetime Tax (red gradient) vs LASIK investment (gold gradient `#e2b857`).
  * Live-updated stat counters for Lifetime Tax, Breakeven Month, and Net Savings.

### 2.2 Adaptive Candidacy Quiz & Report Generator
* **Target Location:** `#quiz` section in `index.html`.
* **Flow & State Machine:**
  * **Step 1:** Age group (`18-24`, `25-39`, `40-54`, `55+`).
  * **Step 2:** Primary Vision Issue (`Nearsightedness`, `Farsightedness`, `Astigmatism`, `Reading Lenses`).
  * **Step 3:** Lifestyle Priority (`Athletics & Motion`, `Night & Low-Light Driving`, `Screen / Executive Focus`).
  * **Step 4:** Prescription Stability (`Stable 1+ Yrs`, `Recent Change`, `Dryness`).
* **Report Generation Screen:**
  * 1.2s HUD scanning animation (`Scanning Corneal Biometrics...`).
  * Personalized result card displaying candidate match rating (**"98% Biometric Candidate Match"**).
  * Lifestyle outcome summary tailored to selected priority.
  * Direct location selector buttons (**Livingston Clinic** vs. **Newark Clinic**) that auto-fill the consultation form and scroll into view.

---

## 3. Verification & Accessibility Requirements

* **Accessibility:** Full keyboard navigation support, labeled inputs, WCAG AAA text contrast.
* **Responsiveness:** Fluid grid and stack behavior for mobile viewports (down to 360px).
