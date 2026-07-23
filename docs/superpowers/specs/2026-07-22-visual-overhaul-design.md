# Design Spec: LASIK Edu Visual Overhaul

**Date:** 2026-07-22  
**Status:** Approved  
**Target Application:** LASIK Education Landing Page (Marano Eye Care)

---

## 1. Overview & Business Objective

The goal of this visual overhaul is to transform the landing page into a state-of-the-art visual experience that reinforces Dr. Matthew J. Marano, Jr.'s reputation as a premier refractive surgeon. By introducing an interactive 3D wavefront corneal visualizer, a dynamic 24-hour recovery timeline scrubber, and high-craft tactile HUD micro-interactions, the page eliminates AI-template genericism and achieves a luxury agency design standard.

---

## 2. Component Specifications

### 2.1 Interactive 3D Wavefront Corneal Map
* **Target Container:** `.hero-image-card` inside `.hero-image-wrapper`
* **Implementation:** HTML5 Canvas visualizer with light particle animation.
* **Nodes & Mesh:** Render a 3D hemisphere representation of a human cornea mapped with a grid of 10,240 micro-focal nodes in `#e2b857` (gold) and `#a855f7` (violet laser).
* **Interactions:**
  * Mouse movement across the hero section rotates/tilts the 3D mesh slightly (parallax effect) and focuses an optical targeting reticle at the cursor position.
  * Live HUD status overlays:
    * `STATUS: WAVEFRONT_SCAN_ACTIVE`
    * `NODES: 10,240 REFINED`
    * `PRECISION: 0.01 MICRON`
* **Fallback:** Image element displays if WebGL/Canvas fails or prefers-reduced-motion is enabled.

### 2.2 Interactive 24-Hour Recovery Scrubber
* **Target Container:** `#speed-timeline-strip`
* **Structure:**
  * Horizontal interactive range control / step buttons.
  * 4 Recovery Stages:
    1. **Hour 0:** Surgical Completion — Natural osmotic flap adhesion initialized.
    2. **Hour 4:** Cellular Sealing — Epithelial alignment; baseline focus stabilizing.
    3. **Hour 12:** HD Contrast Restoration — Night glare reduction active; 95%+ clarity.
    4. **Hour 24:** Full Active Freedom — Screen, driving, and active sports clearance.
* **Interactions:**
  * Dragging slider or clicking stage pills smoothly transitions stage detail cards with cubic-bezier easing.
  * Visual indicator highlight displays estimated clarity percentage and clinical milestone text.

### 2.3 Dark-Mode Tactile HUD & Ambient Luminescence System
* **CSS System Enhancements:**
  * Diagnostic Wavelength Badges:
    * Femtosecond Flap creation step tagged with `SYS_OK // 1053nm INFRARED` (violet accent `#a855f7`).
    * Excimer Corneal Sculpting step tagged with `SYS_OK // 193nm ULTRAVIOLET` (gold accent `#e2b857`).
  * Ambient Background Glows: Multi-stop radial gradients placed behind profile grid and primary CTA section.
  * Micro-Interactions: Light-sweep hover shimmer animations on CTAs, 44px+ touch targets, AAA-compliant high-contrast focus rings (`outline: 2px solid #e2b857`).

---

## 3. Verification & Compliance Criteria

* **Performance:** Hero asset loading stays under performance budget (LCP < 2.5s).
* **Accessibility:** WCAG AAA contrast (minimum 7:1 for body text, 4.5:1 for headers) maintained across dark backgrounds.
* **Responsiveness:** All 3 interactive components scale seamlessly from mobile (390px) to desktop (1440px+).
