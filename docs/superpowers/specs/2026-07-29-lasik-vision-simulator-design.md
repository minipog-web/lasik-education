# Meticulously Accurate LASIK Optical Vision Simulator Design Specification

**Date**: 2026-07-29  
**Status**: Approved  

---

## Executive Summary

The LASIK Optical Vision Simulator provides patients with a meticulously accurate, real-time visual simulation of optical refractive errors (myopia and hyperopia), corneal astigmatism with axis angle rotation, and higher-order aberration glare. It directly contrasts uncorrected refractive error against the crystal-clear, high-contrast 20/15 HD acuity achieved through Custom Wavefront-Guided LASIK surgery at Marano Eye Care.

---

## 1. Optical Physics Engine & Rendering Mathematics

The simulator calculates optical aberrations using a real-time **Dual-Pass Point Spread Function (PSF)** HTML5 Canvas rendering engine.

### 1.1 Sphere Defocus Blur (\(S\))
Calculates isotropic focal defocus radius in pixels based on diopters:
\[
r_{\text{defocus}} = k_{\text{sphere}} \cdot |S|
\]
- Negative diopters (Myopia, e.g. -1.00D to -10.00D): Simulates distance defocus.
- Positive diopters (Hyperopia, e.g. +1.00D to +4.00D): Simulates accommodative breakdown & near defocus.

### 1.2 Astigmatism Cylinder (\(C\)) & Axis Angle (\(\alpha\))
Models toroidal corneal asymmetry creating directional focal distortion:
- **Axis Stretch Vector**: Rotates the directional blur kernel by \(\alpha \in [0^\circ, 180^\circ]\).
- **Directional Point Spread Function**:
  \[
  \sigma_x = k_{\text{cyl}} \cdot |C| \cdot \cos^2(\alpha) + r_{\text{defocus}}
  \]
  \[
  \sigma_y = k_{\text{cyl}} \cdot |C| \cdot \sin^2(\alpha) + r_{\text{defocus}}
  \]
  Light sources (headlights, street signs, tail lights) stretch into elongated focal lines along axis angle \(\alpha\), faithfully representing astigmatism.

### 1.3 Night Light Glare & Starburst Bloom
- Bright pixels (headlights, city skyline lights) undergo radial bloom expansion under astigmatic and myopic conditions, creating realistic night glare and halos.

### 1.4 Custom Wavefront HD Post-LASIK Mode (20/15 Acuity)
- Completely eliminates spherical defocus and cylinder distortion.
- Applies micro-sharpening contrast enhancement and sub-pixel clarity boost, illustrating 20/15 HD post-op visual performance.

---

## 2. Component Architecture & User Experience

### 2.1 Placement
Integrated directly into the main landing page flow under the Hero / LASIK Science area for maximum engagement.

### 2.2 UI Elements & Controls
1. **Interactive Dual-Layer Canvas Stage**:
   - Renders a High-Contrast Night Highway & City Skyline scene featuring fine detail street signs, car headlights, and distance city buildings.
   - **Interactive Split Slider**: Drag handle allowing patients to compare **Pre-LASIK refractive error** (left) vs **Post-LASIK 20/15 HD vision** (right).
2. **Clinical Presets**:
   - `Normal Vision (20/20)`: 0.00D / 0.00D
   - `Mild Myopia (-2.00 D)`: Soft distance blur.
   - `High Myopia (-6.00 D)`: Heavy distance defocus.
   - `Astigmatism (-2.50 D @ 90°)`: Vertical streak distortion on light sources.
   - `Combined (-4.50 D / -2.00 D @ 45°)`: Diagonal astigmatic blur.
   - `Custom Wavefront HD (20/15 Acuity)`: Pristine post-LASIK outcome.
3. **Precision Adjustment Sliders**:
   - **Sphere Slider**: `-10.00 D` to `+4.00 D` (0.25D step).
   - **Cylinder Slider**: `0.00 D` to `-5.00 D` (0.25D step).
   - **Axis Angle Slider**: `0°` to `180°` (1° step) with visual axis orientation graphic.

---

## 3. Technical Implementation & Quality Standards

- **Performance**: 60 FPS rendering cycle using `requestAnimationFrame` with cached canvas buffers.
- **Accessibility (WCAG AAA)**: Full keyboard navigation, ARIA slider attributes, 7:1 contrast ratio for all text controls, 48px minimum touch targets.
- **Responsive**: Mobile-first responsive layout adapting smoothly from 320px mobile up to 4K displays.
