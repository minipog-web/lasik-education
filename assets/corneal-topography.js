/**
 * Marano Eye Care - Interactive Wavefront Topography (Pentacam) 3D Corneal Map Viewer
 * 
 * Features:
 * - 3D Parametric Polar Corneal Mesh with real-time vector projection and depth shading
 * - Clinical Pentacam / WaveScan spectral elevation heatmap (Blue -> Cyan -> Green -> Yellow -> Red)
 * - Zernike Polynomial micro-aberrations (Trefoil, Coma, Spherical Aberration) & Astigmatic Bowtie
 * - 10-Second Excimer Laser Wavefront Reshaping Simulation with ablation depth counter & pulse scan
 * - Live Diagnostic Telemetry HUD (K1/K2 Keratometry, Pachymetry, RMS Error, Projected Acuity)
 * - Touch & Mouse 3D orbital rotation with inertia damping & hardware acceleration
 * - Controls integrated directly into the viewport card for seamless mobile & desktop operation
 * - Attributed to Dr. Matthew Marano, MD (Livingston, NJ Diagnostic Suite)
 * - Performance-optimized with IntersectionObserver auto-pause
 */

(function () {
  'use strict';

  window.initCornealTopography = function initCornealTopography() {
    var container = document.getElementById('corneal-topography-container');
    if (!container) return;

    // Prevent duplicate initializations
    if (container.getAttribute('data-initialized') === 'true') return;
    container.setAttribute('data-initialized', 'true');

    // State Variables
    var state = {
      astigmatism: -1.75, // Diopters
      axis: 90,           // Degrees (Steep axis)
      hoaRms: 0.62,       // µm Higher-order aberration RMS
      myopia: -3.50,      // Diopters
      ablationProgress: 0,// 0.0 (Pre-Op) to 1.0 (Post-Op)
      isAblating: false,  // Laser animation active
      viewMode: '3d',     // '3d', 'axial', 'profile'
      rotX: 0.65,         // Pitch (rad) for 3D Oblique
      rotY: 0.45,         // Yaw (rad)
      targetRotX: 0.65,
      targetRotY: 0.45,
      isDragging: false,
      lastMouseX: 0,
      lastMouseY: 0,
      autoRotate: true,
      laserScanPos: 0,
      ablationDepthMicrons: 0
    };

    container.innerHTML = `
      <div class="topo-wrapper">
        <!-- Section Header -->
        <div class="topo-header">
          <div class="topo-badge-wrapper">
            <span class="topo-badge">Livingston Surgical &amp; Diagnostic Suite • Livingston, NJ</span>
          </div>
          <h3 class="topo-title">How CustomVue® LASIK Corrects Astigmatism in 3D</h3>
          <p class="topo-subtitle">
            Astigmatism means your cornea curves unevenly like a <strong>football</strong> instead of a symmetrical <strong>basketball</strong>, warping light rays into multiple blurry focal points. 
            See how <strong>CustomVue® wavefront mapping</strong> guides the excimer laser to smooth and equalize every microscopic meridian in just 10 seconds.
          </p>
        </div>

        <!-- Main Workspace (3D Stage with Embedded Controls + Astigmatism Treatment Education) -->
        <div class="topo-workspace-grid">
          <!-- Left: 3D Corneal Topography Viewport & Integrated Controls -->
          <div class="topo-viewport-card">
            <!-- Viewport Toolbar -->
            <div class="topo-viewport-toolbar">
              <div class="topo-view-tabs" role="tablist" aria-label="3D Topography View Mode">
                <button type="button" class="topo-tab-btn active" data-view="3d" role="tab" aria-selected="true">3D Oblique</button>
                <button type="button" class="topo-tab-btn" data-view="axial" role="tab" aria-selected="false">Axial Map</button>
                <button type="button" class="topo-tab-btn" data-view="profile" role="tab" aria-selected="false">Cross-Section</button>
              </div>
              <div class="topo-rotation-hint" id="topo-orbit-indicator" style="opacity: 1;">
                <span class="topo-orbit-icon">⟳</span> Drag or tap below to orbit
              </div>
            </div>

            <!-- Canvas Stage Container -->
            <div class="topo-stage-container" id="topo-stage-container" aria-label="Interactive 3D Corneal Elevation Mesh">
              <canvas id="corneal-topo-canvas" class="topo-canvas"></canvas>

              <!-- Real-Time Optical Status Overlay -->
              <div class="topo-stage-overlay-top">
                <div class="topo-status-tag" id="topo-status-tag">
                  <span class="topo-status-pulse"></span>
                  <span id="topo-status-label">PRE-OP: Astigmatic Bowtie Warping</span>
                </div>
                <div class="topo-scan-device-badge">WaveScan 3D Aberrometry</div>
              </div>

              <!-- Animated Laser Crosshair Overlay (Visible during ablation) -->
              <div class="topo-laser-crosshairs" id="topo-laser-crosshairs" style="display: none;">
                <div class="topo-laser-ring"></div>
                <div class="topo-laser-beam"></div>
                <div class="topo-laser-readout">
                  <span class="topo-laser-hz">500Hz PULSE ACTIVE</span>
                  <span class="topo-laser-depth" id="topo-laser-depth-readout">Reshaping: 0 µm</span>
                </div>
              </div>

              <!-- Topography Spectral Color Ramp Legend -->
              <div class="topo-spectral-legend" aria-label="Corneal Elevation Scale">
                <span class="topo-legend-title">Curvature (Diopters)</span>
                <div class="topo-legend-bar"></div>
                <div class="topo-legend-labels">
                  <span>Flatter (Blue)</span>
                  <span>43D (Green)</span>
                  <span>Steeper (Red)</span>
                </div>
              </div>
            </div>


            <!-- Primary Wavefront Reshaping Trigger Button -->
            <div class="topo-action-bar">
              <button type="button" id="topo-btn-simulate-laser" class="btn-topo-laser">
                <span class="topo-laser-icon">⚡</span>
                <span id="topo-btn-laser-text">Simulate 10-Second CustomVue® Reshaping</span>
                <span class="topo-laser-pulse-ring"></span>
              </button>
            </div>

            <!-- Integrated Astigmatism Controls -->
            <div class="topo-card-controls">
              <div class="topo-controls-mini-header">
                <span class="topo-controls-mini-title">Corneal Curvature Profiles:</span>
                <span class="topo-controls-mini-hint">Compare astigmatic distortion vs. corrected vision</span>
              </div>
              
              <div class="topo-presets-grid" role="group" aria-label="Diagnostic Topography Presets">
                <button type="button" class="topo-preset-btn active" data-preset="astigmatism">
                  <span class="topo-preset-dot dot-amber"></span>
                  <span>Moderate (-1.75D)</span>
                </button>
                <button type="button" class="topo-preset-btn" data-preset="myopia-hoa">
                  <span class="topo-preset-dot dot-red"></span>
                  <span>High (-2.50D)</span>
                </button>
                <button type="button" class="topo-preset-btn" data-preset="normal">
                  <span class="topo-preset-dot dot-cyan"></span>
                  <span>Spherical (0.00D)</span>
                </button>
                <button type="button" class="topo-preset-btn topo-preset-hd" data-preset="customvue">
                  <span class="topo-preset-dot dot-emerald"></span>
                  <span>✨ CustomVue® HD</span>
                </button>
              </div>

              <!-- Astigmatism Sliders -->
              <div class="topo-sliders-compact-grid">
                <div class="topo-slider-item">
                  <div class="topo-slider-header">
                    <label for="topo-astig-slider">Astigmatism Degree (Cylinder)</label>
                    <span id="topo-astig-val" class="topo-slider-badge">-1.75 D</span>
                  </div>
                  <input type="range" id="topo-astig-slider" min="-4.50" max="0.00" step="0.25" value="-1.75" aria-label="Astigmatism Diopters" />
                </div>

                <div class="topo-slider-item">
                  <div class="topo-slider-header">
                    <label for="topo-axis-slider">Steep Meridian Angle (Axis)</label>
                    <span id="topo-axis-val" class="topo-slider-badge">90°</span>
                  </div>
                  <input type="range" id="topo-axis-slider" min="0" max="180" step="5" value="90" aria-label="Astigmatism Axis Degrees" />
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Patient Education on Astigmatism & CustomVue + Projected Acuity + Dr. Marano Quote -->
          <div class="topo-telemetry-card">
            <div class="topo-hud-header">
              <h4 class="topo-hud-title">How CustomVue® Treats Astigmatism</h4>
            </div>

            <!-- Astigmatism Visual Education Cards -->
            <div class="topo-education-flow">
              <div class="topo-edu-card">
                <div class="topo-edu-icon">🏈</div>
                <div class="topo-edu-body">
                  <strong class="topo-edu-heading">The Astigmatic Cornea (Football Shape)</strong>
                  <p class="topo-edu-desc">
                    Notice the red and orange "bowtie" pattern on the 3D map. Light passing through the steeper vertical curve focuses at a different point than light passing through the flatter horizontal curve, causing ghosting, halos, and distorted edges.
                  </p>
                </div>
              </div>

              <div class="topo-edu-card">
                <div class="topo-edu-icon">🏀</div>
                <div class="topo-edu-body">
                  <strong class="topo-edu-heading">CustomVue® Wavefront Smoothing (Basketball Shape)</strong>
                  <p class="topo-edu-desc">
                    Unlike standard LASIK that applies an average stencil, CustomVue® measures over 1,200 optical coordinates. The cool excimer beam vaporizes microscopic imperfections along the steep meridian, equalizing the surface into a uniform optical dome.
                  </p>
                </div>
              </div>
            </div>

            <!-- Projected Visual Acuity Callout -->
            <div class="topo-acuity-callout">
              <div class="topo-acuity-header">
                <span class="topo-acuity-label">Projected Visual Acuity</span>
                <span class="topo-acuity-status" id="topo-acuity-tag">Current Map State</span>
              </div>
              <div class="topo-acuity-display">
                <div class="topo-acuity-val val-amber" id="topo-hud-acuity">20/40 (Uncorrected)</div>
                <div class="topo-acuity-target" id="topo-hud-acuity-sub">Target post-CustomVue®: 20/20 to 20/15 High-Definition</div>
              </div>
              <div class="topo-acuity-bar-wrap">
                <div class="topo-acuity-progress-bar" id="topo-acuity-progress-bar" style="width: 35%;"></div>
              </div>
            </div>

            <!-- Surgeon Clinical Insight Quote (Dr. Matthew Marano, MD) -->
            <div class="topo-surgeon-insight">
              <div class="topo-insight-avatar">
                <img src="./assets/dr-marano.jpg" alt="Dr. Matthew Marano, MD" loading="lazy" />
              </div>
              <div class="topo-insight-content">
                <strong class="topo-insight-surgeon">Dr. Matthew Marano, MD</strong>
                <span class="topo-insight-role">Board-Certified LASIK Surgeon • Marano Eye Care</span>
                <p class="topo-insight-quote">
                  “Astigmatism is simply an uneven curve. With 3D WaveScan® diagnostics and CustomVue® wavefront guidance, we map each patient’s optical fingerprint 25 times more accurately than glasses or contacts. We don't just treat astigmatism—we eliminate the microscopic irregularities that cause night glare, targeting standard-setting 20/20 and unlocking the possibility of 20/15 high-definition vision.”
                </p>
              </div>
            </div>

            <!-- Diagnostic CTA (Livingston Facility Exclusivity) -->
            <div class="topo-hud-cta-box">
              <button type="button" class="btn btn-primary topo-cta-btn" onclick="scrollToConsultationForm()">
                <span>Schedule Free 3D Wavefront Scan →</span>
              </button>
              <span class="topo-cta-reassurance">100% Free Diagnostic Scan • Exclusively at our Livingston, NJ Suite • $0 Obligation</span>
            </div>
          </div>
        </div>
      </div>
    `;

    // Canvas & Context Setup
    var canvas = document.getElementById('corneal-topo-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var stageContainer = document.getElementById('topo-stage-container');

    // Visual Acuity & Status DOM Elements
    var hudAcuity = document.getElementById('topo-hud-acuity');
    var hudAcuitySub = document.getElementById('topo-hud-acuity-sub');
    var acuityTag = document.getElementById('topo-acuity-tag');
    var acuityProgressBar = document.getElementById('topo-acuity-progress-bar');
    var statusTag = document.getElementById('topo-status-tag');
    var statusLabel = document.getElementById('topo-status-label');
    var laserCrosshairs = document.getElementById('topo-laser-crosshairs');
    var laserDepthReadout = document.getElementById('topo-laser-depth-readout');
    var btnLaser = document.getElementById('topo-btn-simulate-laser');
    var btnLaserText = document.getElementById('topo-btn-laser-text');

    // Slider DOM Elements
    var sliderAstig = document.getElementById('topo-astig-slider');
    var valAstig = document.getElementById('topo-astig-val');
    var sliderAxis = document.getElementById('topo-axis-slider');
    var valAxis = document.getElementById('topo-axis-val');

    // Preset & Tab Buttons
    var presetBtns = container.querySelectorAll('.topo-preset-btn');
    var viewTabBtns = container.querySelectorAll('.topo-tab-btn');

    function syncAutoRotBtn() {}

    // ─── Resize Canvas with Device Pixel Ratio ───────────────────────────
    var dpr = window.devicePixelRatio || 1;
    var cw = 0;
    var ch = 0;

    var _hasResized = false;
    function resizeCanvas() {
      if (!stageContainer || !canvas) return;
      var w = stageContainer.clientWidth;
      var h = stageContainer.clientHeight;
      if (!w || !h) {
        var rect = stageContainer.getBoundingClientRect();
        w = rect.width;
        h = rect.height;
      }
      if (w === 0 || h === 0) return;
      cw = w;
      ch = h;
      canvas.width = Math.floor(cw * dpr);
      canvas.height = Math.floor(ch * dpr);
      canvas.style.width = cw + 'px';
      canvas.style.height = ch + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      _hasResized = true;
    }
    if ('requestIdleCallback' in window) {
      requestIdleCallback(function() { if (!_hasResized) resizeCanvas(); });
    } else {
      setTimeout(function() { if (!_hasResized) resizeCanvas(); }, 250);
    }
    window.addEventListener('resize', function() {
      if (isVisible) resizeCanvas();
      else _hasResized = false;
    }, { passive: true });

    // ─── 3D Polar Mesh Generation & Elevation Calculation ──────────────────
    var RINGS = 18;
    var SECTORS = 36;

    /**
     * Computes the elevation (in screen coordinates + Diopters) for a polar coordinate (r, theta)
     * r: 0 (center) to 1 (periphery)
     * theta: angle in radians (0 to 2*PI)
     */
    function computeElevation(r, theta) {
      // Current ablation multiplier (1.0 = pre-op, 0.0 = completely flattened post-op)
      var preOpFactor = 1.0 - state.ablationProgress;

      // Base prolate corneal sphere (aspheric Q ≈ -0.26)
      var baseSag = Math.sqrt(Math.max(0, 1.25 - r * r * 0.95)) - 1.118;
      var baseDiopters = 43.50 - (r * 3.5); // Normal peripheral flattening

      // Astigmatism component (Orthogonal Bowtie: C * cos(2*(theta - axis)))
      var axisRad = (state.axis * Math.PI) / 180;
      var astigMag = Math.abs(state.astigmatism) * preOpFactor;
      var astigElevation = astigMag * 0.12 * Math.cos(2 * (theta - axisRad)) * Math.sin(r * Math.PI);
      var astigDiopters = astigMag * Math.cos(2 * (theta - axisRad)) * (1.0 - r * 0.3);

      // Higher-Order Aberrations (Trefoil + Coma + Spherical micro-irregularities)
      var hoaMag = state.hoaRms * preOpFactor;
      var trefoil = hoaMag * 0.08 * Math.cos(3 * theta) * (r * r);
      var coma = hoaMag * 0.06 * Math.sin(theta) * (r * r * r);
      var hoaElevation = (trefoil + coma) * Math.sin(r * Math.PI);
      var hoaDiopters = (trefoil + coma) * 8.0;

      // Laser Smoothing effect (Post-op aspheric transition)
      var postOpDiopters = 43.00 - (r * r * 1.5); // Perfectly smooth custom wavefront profile
      var totalDiopters = (baseDiopters + astigDiopters + hoaDiopters) * preOpFactor + postOpDiopters * state.ablationProgress;

      // Z height in 3D projection space
      var totalZ = (baseSag * 140) + (astigElevation * 90) + (hoaElevation * 110);

      return {
        z: totalZ,
        diopters: totalDiopters,
        r: r,
        theta: theta
      };
    }

    /**
     * Clinical Pentacam / WaveScan Spectral Color Palette
     * Blue (38D) -> Cyan (41D) -> Green (43.5D) -> Yellow (46D) -> Red (49D+)
     */
    function diopterToColor(d, alpha) {
      if (typeof alpha !== 'number') alpha = 1.0;
      // Normal range: 38.0 D to 48.0 D
      var t = (d - 38.0) / 10.0;
      t = Math.max(0.0, Math.min(1.0, t));

      var r = 0, g = 0, b = 0;
      if (t < 0.25) { // 38 to 40.5: Deep Blue to Cyan
        var u = t / 0.25;
        r = Math.floor(10 + u * 20);
        g = Math.floor(90 + u * 130);
        b = Math.floor(220 + u * 35);
      } else if (t < 0.50) { // 40.5 to 43.0: Cyan to Emerald Green
        var u = (t - 0.25) / 0.25;
        r = Math.floor(30 - u * 15);
        g = Math.floor(220 - u * 35);
        b = Math.floor(255 - u * 125);
      } else if (t < 0.75) { // 43.0 to 45.5: Emerald Green to Amber Yellow
        var u = (t - 0.50) / 0.25;
        r = Math.floor(15 + u * 230);
        g = Math.floor(185 + u * 20);
        b = Math.floor(130 - u * 110);
      } else { // 45.5 to 48.0+: Amber Yellow to Ruby Red
        var u = (t - 0.75) / 0.25;
        r = Math.floor(245 + u * 10);
        g = Math.floor(205 - u * 145);
        b = Math.floor(20 - u * 10);
      }
      return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
    }

    // ─── 3D Projection Pipeline ───────────────────────────────────────────
    function project3D(x, y, z, cx, cy) {
      var cosY = Math.cos(state.rotY);
      var sinY = Math.sin(state.rotY);
      var cosX = Math.cos(state.rotX);
      var sinX = Math.sin(state.rotX);

      // 1. Rotation around Y (Yaw)
      var x1 = x * cosY - z * sinY;
      var z1 = x * sinY + z * cosY;

      // 2. Rotation around X (Pitch)
      var y2 = y * cosX - z1 * sinX;
      var z2 = y * sinX + z1 * cosX;

      // 3. Perspective Projection
      var fov = 380;
      var distance = 360;
      var scale = fov / (distance + z2);

      return {
        px: cx + x1 * scale,
        py: cy + y2 * scale,
        depth: z2
      };
    }

    // ─── Animation & Render Loop ──────────────────────────────────────────
    var animFrameId = null;
    var isVisible = true;
    var lastTimestamp = 0;

    function render(timestamp) {
      if (!isVisible) return;
      if (!lastTimestamp) lastTimestamp = timestamp;
      var dt = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      // Clear canvas
      ctx.clearRect(0, 0, cw, ch);

      var cx = cw / 2;
      var cy = ch / 2 + 6;
      var currentRadius = Math.min(cw, ch) * 0.29;

      // Smooth camera interpolation
      state.rotX += (state.targetRotX - state.rotX) * 0.08;
      state.rotY += (state.targetRotY - state.rotY) * 0.08;

      // Auto rotation when idle
      if (state.autoRotate && !state.isDragging && state.viewMode === '3d') {
        state.targetRotY += 0.003;
      }

      // Handle View Mode Presets
      if (state.viewMode === 'axial') {
        state.targetRotX = 0.02;
        state.targetRotY = 0.0;
      } else if (state.viewMode === 'profile') {
        state.targetRotX = 1.35;
        state.targetRotY = 0.0;
      }

      // Handle Laser Ablation Simulation Progress
      if (state.isAblating) {
        state.ablationProgress += dt * 0.10; // 10-second total cycle
        state.laserScanPos += dt * 8.0;
        state.ablationDepthMicrons = Math.min(68, Math.floor(state.ablationProgress * 68));

        if (laserDepthReadout) {
          laserDepthReadout.textContent = 'Ablating: ' + state.ablationDepthMicrons + ' µm / 68 µm';
        }

        if (state.ablationProgress >= 1.0) {
          state.ablationProgress = 1.0;
          state.isAblating = false;
          onAblationComplete();
        }
        updateTelemetryHUD();
      }

      // Generate and Sort Quad Mesh Polygons for Painter's Algorithm Depth Rendering
      var quads = [];

      for (var ring = 0; ring < RINGS; ring++) {
        var r0 = ring / RINGS;
        var r1 = (ring + 1) / RINGS;

        for (var sec = 0; sec < SECTORS; sec++) {
          var t0 = (sec / SECTORS) * Math.PI * 2;
          var t1 = ((sec + 1) / SECTORS) * Math.PI * 2;

          var e00 = computeElevation(r0, t0);
          var e10 = computeElevation(r1, t0);
          var e11 = computeElevation(r1, t1);
          var e01 = computeElevation(r0, t1);

          var p00 = project3D(r0 * currentRadius * Math.cos(t0), r0 * currentRadius * Math.sin(t0), e00.z, cx, cy);
          var p10 = project3D(r1 * currentRadius * Math.cos(t0), r1 * currentRadius * Math.sin(t0), e10.z, cx, cy);
          var p11 = project3D(r1 * currentRadius * Math.cos(t1), r1 * currentRadius * Math.sin(t1), e11.z, cx, cy);
          var p01 = project3D(r0 * currentRadius * Math.cos(t1), r0 * currentRadius * Math.sin(t1), e01.z, cx, cy);

          var avgDepth = (p00.depth + p10.depth + p11.depth + p01.depth) / 4;
          var avgDiopter = (e00.diopters + e10.diopters + e11.diopters + e01.diopters) / 4;

          quads.push({
            p00: p00, p10: p10, p11: p11, p01: p01,
            depth: avgDepth,
            diopter: avgDiopter
          });
        }
      }

      // Sort back-to-front (furthest depth drawn first)
      quads.sort(function (a, b) { return b.depth - a.depth; });

      // Draw all mesh quads with smooth gradients
      for (var q = 0; q < quads.length; q++) {
        var poly = quads[q];

        ctx.beginPath();
        ctx.moveTo(poly.p00.px, poly.p00.py);
        ctx.lineTo(poly.p10.px, poly.p10.py);
        ctx.lineTo(poly.p11.px, poly.p11.py);
        ctx.lineTo(poly.p01.px, poly.p01.py);
        ctx.closePath();

        // Shading with elevation color
        ctx.fillStyle = diopterToColor(poly.diopter, 0.88);
        ctx.fill();

        // Subtle wireframe grid line
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.stroke();
      }

      // Draw Center Pupil Optical Ring (6.0mm Laser Blend Zone)
      drawOpticalZoneRings(cx, cy, currentRadius);

      // Draw Laser Scanning Beam if Active
      if (state.isAblating) {
        drawLaserAblationBeam(cx, cy, currentRadius);
      }

      animFrameId = requestAnimationFrame(render);
    }

    /**
     * Renders clinical 3.0mm central optical zone and 6.0mm ablation border
     */
    function drawOpticalZoneRings(cx, cy, radius) {
      if (state.viewMode === 'profile') return;

      var centerPt = project3D(0, 0, computeElevation(0, 0).z, cx, cy);

      // Center crosshair
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerPt.px - 8, centerPt.py);
      ctx.lineTo(centerPt.px + 8, centerPt.py);
      ctx.moveTo(centerPt.px, centerPt.py - 8);
      ctx.lineTo(centerPt.px, centerPt.py + 8);
      ctx.stroke();

      // 6.0mm Optical Zone Ring
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(226, 184, 87, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);

      for (var i = 0; i <= 36; i++) {
        var theta = (i / 36) * Math.PI * 2;
        var elev = computeElevation(0.65, theta);
        var pt = project3D(radius * 0.65 * Math.cos(theta), radius * 0.65 * Math.sin(theta), elev.z, cx, cy);
        if (i === 0) ctx.moveTo(pt.px, pt.py);
        else ctx.lineTo(pt.px, pt.py);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    /**
     * Renders 500Hz Scanning Laser Pulse Visual FX
     */
    function drawLaserAblationBeam(cx, cy, radius) {
      var scanR = (0.2 + 0.45 * Math.sin(state.laserScanPos * 3)) * radius;
      var scanAngle = state.laserScanPos * 4;
      var elev = computeElevation(scanR / radius, scanAngle);
      var laserPt = project3D(scanR * Math.cos(scanAngle), scanR * Math.sin(scanAngle), elev.z, cx, cy);

      // Laser Impact Flash
      var grad = ctx.createRadialGradient(laserPt.px, laserPt.py, 2, laserPt.px, laserPt.py, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.3, 'rgba(16, 185, 129, 0.9)');
      grad.addColorStop(0.7, 'rgba(0, 240, 255, 0.4)');
      grad.addColorStop(1, 'rgba(0, 240, 255, 0)');

      ctx.beginPath();
      ctx.arc(laserPt.px, laserPt.py, 32, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Laser Ray Trace from Top Center
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(laserPt.px, laserPt.py);
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.75)';
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }

    // ─── UI & Telemetry Synchronization ──────────────────────────────────
    function updateTelemetryHUD() {
      var preFactor = 1.0 - state.ablationProgress;
      var currentAstig = state.astigmatism * preFactor;

      if (hudAcuity) {
        if (state.ablationProgress > 0.8) {
          hudAcuity.textContent = '20/15 High-Definition';
          hudAcuity.className = 'topo-acuity-val val-emerald';
        } else if (state.ablationProgress > 0.4) {
          hudAcuity.textContent = '20/20 Standard Sharp';
          hudAcuity.className = 'topo-acuity-val val-emerald';
        } else {
          var cyl = Math.abs(currentAstig);
          if (cyl >= 2.0) {
            hudAcuity.textContent = '20/60 (Uncorrected)';
          } else if (cyl >= 1.0) {
            hudAcuity.textContent = '20/40 (Uncorrected)';
          } else if (cyl > 0) {
            hudAcuity.textContent = '20/25 (Mild Astig.)';
          } else {
            hudAcuity.textContent = '20/20 (Symmetrical)';
          }
          hudAcuity.className = cyl === 0 ? 'topo-acuity-val val-emerald' : 'topo-acuity-val val-amber';
        }
      }

      if (hudAcuitySub) {
        if (state.ablationProgress > 0.8) {
          hudAcuitySub.textContent = '✓ Astigmatic bowtie eliminated • Symmetrical prolate dome';
        } else if (state.ablationProgress > 0.4) {
          hudAcuitySub.textContent = '⚡ Wavefront smoothing in progress • Meridians equalizing...';
        } else {
          hudAcuitySub.textContent = 'Target post-CustomVue®: 20/20 to 20/15 High-Definition';
        }
      }

      if (acuityTag) {
        if (state.ablationProgress > 0.8) {
          acuityTag.textContent = 'CustomVue® Corrected';
          acuityTag.className = 'topo-acuity-status status-hd';
        } else if (state.isAblating) {
          acuityTag.textContent = 'Reshaping Active';
          acuityTag.className = 'topo-acuity-status status-active';
        } else {
          acuityTag.textContent = 'Pre-Treatment';
          acuityTag.className = 'topo-acuity-status status-pre';
        }
      }

      if (acuityProgressBar) {
        var pct = 30 + Math.floor(state.ablationProgress * 70);
        if (state.astigmatism === 0 && state.ablationProgress === 0) pct = 90;
        acuityProgressBar.style.width = pct + '%';
      }

      if (statusLabel && statusTag) {
        if (state.isAblating) {
          statusLabel.textContent = 'PULSING: Equalizing Astigmatic Curvature...';
          statusTag.className = 'topo-status-tag status-pulsing';
        } else if (state.ablationProgress > 0.8) {
          statusLabel.textContent = 'POST-OP: Symmetrical Basketball Curve (20/15 HD)';
          statusTag.className = 'topo-status-tag status-success';
        } else {
          var label = Math.abs(currentAstig) > 0 
            ? 'PRE-OP: Astigmatic Bowtie Warping'
            : 'PRE-OP: Symmetrical Surface';
          statusLabel.textContent = label;
          statusTag.className = Math.abs(currentAstig) > 0 ? 'topo-status-tag status-preop' : 'topo-status-tag status-success';
        }
      }
    }

    function onAblationComplete() {
      if (laserCrosshairs) laserCrosshairs.style.display = 'none';
      if (btnLaser) {
        btnLaser.classList.remove('ablating');
        btnLaser.classList.add('completed');
      }
      if (btnLaserText) {
        btnLaserText.textContent = '✓ 10-Sec Wavefront Ablation Complete (Reset)';
      }
      updateTelemetryHUD();
    }

    function startAblationSimulation() {
      if (state.ablationProgress >= 1.0) {
        // Reset to Pre-Op
        state.ablationProgress = 0;
        state.isAblating = false;
        if (btnLaser) btnLaser.classList.remove('completed', 'ablating');
        if (btnLaserText) btnLaserText.textContent = 'Simulate 10-Second CustomVue® Reshaping';
        updateTelemetryHUD();
        return;
      }

      state.isAblating = true;
      state.ablationProgress = 0;
      if (laserCrosshairs) laserCrosshairs.style.display = 'flex';
      if (btnLaser) btnLaser.classList.add('ablating');
      if (btnLaserText) btnLaserText.textContent = '⚡ Excimer Laser Pulse Active (500Hz)...';
      updateTelemetryHUD();
    }

    // ─── Event Listeners ──────────────────────────────────────────────────
    if (btnLaser) {
      btnLaser.addEventListener('click', startAblationSimulation);
    }

    // Slider Listeners
    if (sliderAstig) {
      sliderAstig.addEventListener('input', function () {
        state.astigmatism = parseFloat(this.value);
        if (valAstig) valAstig.textContent = state.astigmatism.toFixed(2) + ' D';
        state.ablationProgress = 0;
        if (btnLaser) btnLaser.classList.remove('completed');
        if (btnLaserText) btnLaserText.textContent = 'Simulate 10-Second CustomVue® Reshaping';
        updateTelemetryHUD();
      });
    }

    if (sliderAxis) {
      sliderAxis.addEventListener('input', function () {
        state.axis = parseInt(this.value, 10);
        if (valAxis) valAxis.textContent = state.axis + '°';
        state.ablationProgress = 0;
        if (btnLaser) btnLaser.classList.remove('completed');
        if (btnLaserText) btnLaserText.textContent = 'Simulate 10-Second CustomVue® Reshaping';
        updateTelemetryHUD();
      });
    }

    // Preset Buttons
    presetBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        presetBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        var preset = btn.getAttribute('data-preset');
        if (preset === 'astigmatism') {
          state.astigmatism = -1.75;
          state.axis = 90;
          state.hoaRms = 0.62;
          state.ablationProgress = 0;
        } else if (preset === 'myopia-hoa') {
          state.astigmatism = -2.50;
          state.axis = 45;
          state.hoaRms = 0.88;
          state.ablationProgress = 0;
        } else if (preset === 'normal') {
          state.astigmatism = 0.00;
          state.axis = 90;
          state.hoaRms = 0.15;
          state.ablationProgress = 0;
        } else if (preset === 'customvue') {
          state.astigmatism = -1.75;
          state.axis = 90;
          state.hoaRms = 0.62;
          state.ablationProgress = 1.0;
        }

        // Sync Slider UI values
        if (sliderAstig) { sliderAstig.value = state.astigmatism; if (valAstig) valAstig.textContent = state.astigmatism.toFixed(2) + ' D'; }
        if (sliderAxis) { sliderAxis.value = state.axis; if (valAxis) valAxis.textContent = state.axis + '°'; }

        if (state.ablationProgress >= 1.0) {
          if (btnLaser) { btnLaser.classList.remove('ablating'); btnLaser.classList.add('completed'); }
          if (btnLaserText) btnLaserText.textContent = '✓ CustomVue® Wavefront Profile (Reset)';
        } else {
          if (btnLaser) btnLaser.classList.remove('completed', 'ablating');
          if (btnLaserText) btnLaserText.textContent = 'Simulate 10-Second CustomVue® Reshaping';
        }

        updateTelemetryHUD();
      });
    });

    // View Mode Tabs
    viewTabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        viewTabBtns.forEach(function (b) { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        state.viewMode = btn.getAttribute('data-view');
        if (state.viewMode === '3d') {
          state.targetRotX = 0.65;
          state.targetRotY = 0.45;
          state.autoRotate = true;
        } else if (state.viewMode === 'axial') {
          state.targetRotX = 0.02;
          state.targetRotY = 0.0;
          state.autoRotate = false;
        } else if (state.viewMode === 'profile') {
          state.targetRotX = 1.35;
          state.targetRotY = 0.0;
          state.autoRotate = false;
        }
        var hint = document.getElementById('topo-orbit-indicator');
        if (hint) {
          hint.style.opacity = state.viewMode === '3d' ? '1' : '0';
        }
      });
    });

    // ─── Touch & Mouse 3D Orbit Drag Handling ────────────────────────────
    function onPointerDown(clientX, clientY) {
      state.isDragging = true;
      state.autoRotate = false;
      state.lastMouseX = clientX;
      state.lastMouseY = clientY;
      syncAutoRotBtn();
    }

    function onPointerMove(clientX, clientY) {
      if (!state.isDragging || state.viewMode !== '3d') return;
      var dx = clientX - state.lastMouseX;
      var dy = clientY - state.lastMouseY;
      state.lastMouseX = clientX;
      state.lastMouseY = clientY;

      state.targetRotY += dx * 0.008;
      state.targetRotX = Math.max(0.1, Math.min(1.4, state.targetRotX + dy * 0.008));
    }

    function onPointerUp() {
      state.isDragging = false;
    }

    // Mouse Events
    stageContainer.addEventListener('mousedown', function (e) {
      onPointerDown(e.clientX, e.clientY);
    });
    window.addEventListener('mousemove', function (e) {
      onPointerMove(e.clientX, e.clientY);
    });
    window.addEventListener('mouseup', onPointerUp);

    // Touch Events with Smart Gesture Disambiguation (Prevents Vertical Page Scroll Hijacking)
    var touchStartX = 0;
    var touchStartY = 0;
    var touchMode = null; // null | 'orbit' | 'scroll'

    stageContainer.addEventListener('touchstart', function (e) {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        state.lastMouseX = touchStartX;
        state.lastMouseY = touchStartY;
        touchMode = null;
      }
    }, { passive: true });

    window.addEventListener('touchmove', function (e) {
      if (e.touches.length !== 1 || state.viewMode !== '3d') return;
      var curX = e.touches[0].clientX;
      var curY = e.touches[0].clientY;
      var dx = curX - touchStartX;
      var dy = curY - touchStartY;

      if (!touchMode) {
        // If vertical movement exceeds horizontal, user is scrolling down the page
        if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 7) {
          touchMode = 'scroll';
          state.isDragging = false;
          return;
        }
        // If horizontal movement exceeds vertical, user intentionally wants to orbit the 3D model
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 7) {
          touchMode = 'orbit';
          state.isDragging = true;
          state.autoRotate = false;
          syncAutoRotBtn();
        }
      }

      if (touchMode === 'orbit' && state.isDragging) {
        var moveDx = curX - state.lastMouseX;
        var moveDy = curY - state.lastMouseY;
        state.lastMouseX = curX;
        state.lastMouseY = curY;
        state.targetRotY += moveDx * 0.008;
        state.targetRotX = Math.max(0.1, Math.min(1.4, state.targetRotX + moveDy * 0.008));
      }
    }, { passive: true });

    window.addEventListener('touchend', function () {
      touchMode = null;
      state.isDragging = false;
    });

    // ─── IntersectionObserver for Zero CPU Waste when Off-Screen ─────────
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            if (!_hasResized || cw === 0) resizeCanvas();
            if (!animFrameId) animFrameId = requestAnimationFrame(render);
          } else if (!isVisible && animFrameId) {
            cancelAnimationFrame(animFrameId);
            animFrameId = null;
          }
        });
      }, { threshold: 0.05 });
      observer.observe(stageContainer);
    }

    // Start Rendering
    updateTelemetryHUD();
    if (isVisible) {
      animFrameId = requestAnimationFrame(render);
    }
  };

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initCornealTopography);
  } else {
    window.initCornealTopography();
  }
})();
