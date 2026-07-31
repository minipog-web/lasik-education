(function () {
  'use strict';

  window.initVisionSimulator = function initVisionSimulator() {
    var container = document.getElementById('vision-simulator-container');
    if (!container) return;

    var sphere = -2.00;
    var cylinder = -1.50;
    var axis = 90;
    var splitPos = 0.5;

    container.innerHTML = `
      <div class="sim-wrapper">
        <div class="sim-header">
          <span class="sim-badge">Wavefront Diagnostic Optical Physics</span>
          <h3 class="sim-title">LASIK Refractive Error & 20/15 HD Acuity Simulator</h3>
          <p class="sim-subtitle">Simulate real-world Sphere defocus (Myopia/Hyperopia), corneal Astigmatism axis rotation, and night glare contrast against 20/15 Custom LASIK clarity.</p>
        </div>

        <div class="sim-stage-container" id="sim-stage">
          <canvas id="vision-sim-canvas-post" class="sim-canvas"></canvas>
          <canvas id="vision-sim-canvas-pre" class="sim-canvas sim-canvas-clipped"></canvas>

          <div class="sim-overlay-badge sim-badge-left" id="sim-badge-pre">
            <span class="sim-status-dot dot-red"></span> PRE-LASIK: <span id="sim-telemetry-pre">UNCORRECTED (-2.00D / -1.50D @ 90°)</span>
          </div>

          <div class="sim-overlay-badge sim-badge-right">
            <span class="sim-status-dot dot-green"></span> POST-LASIK: 20/15 HD ACUITY (0.00D ABERRATION)
          </div>
          
          <div class="sim-split-divider" id="sim-divider" style="left: 50%;">
            <div class="sim-handle">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 8L22 12L18 16M6 8L2 12L6 16"/></svg>
            </div>
          </div>
        </div>

        <div class="sim-presets-grid">
          <button class="sim-preset-btn active" data-sphere="-2.00" data-cyl="0" data-axis="0">Mild Myopia (-2.00 D)</button>
          <button class="sim-preset-btn" data-sphere="-6.00" data-cyl="0" data-axis="0">High Myopia (-6.00 D)</button>
          <button class="sim-preset-btn" data-sphere="0" data-cyl="-2.50" data-axis="90">Vertical Astigmatism (-2.50 D @ 90°)</button>
          <button class="sim-preset-btn" data-sphere="+3.00" data-cyl="0" data-axis="0">Hyperopia (+3.00 D Farsightedness)</button>
          <button class="sim-preset-btn sim-preset-hd" id="sim-preset-hd">✨ Wavefront 20/15 HD LASIK</button>
        </div>

        <div class="sim-controls-panel">
          <div class="sim-control-group">
            <div class="sim-control-header">
              <label for="sim-sphere-slider">Sphere (Myopia / Hyperopia Defocus)</label>
              <span id="sim-sphere-val" class="sim-val-badge">-2.00 D</span>
            </div>
            <input type="range" id="sim-sphere-slider" min="-10.00" max="4.00" step="0.25" value="-2.00" aria-label="Sphere Diopter Slider">
          </div>

          <div class="sim-control-group">
            <div class="sim-control-header">
              <label for="sim-cyl-slider">Cylinder (Astigmatism Magnitude)</label>
              <span id="sim-cyl-val" class="sim-val-badge">-1.50 D</span>
            </div>
            <input type="range" id="sim-cyl-slider" min="-5.00" max="0.00" step="0.25" value="-1.50" aria-label="Cylinder Magnitude Slider">
          </div>

          <div class="sim-control-group">
            <div class="sim-control-header">
              <label for="sim-axis-slider">Astigmatism Axis Angle</label>
              <span id="sim-axis-val" class="sim-val-badge">90°</span>
            </div>
            <input type="range" id="sim-axis-slider" min="0" max="180" step="1" value="90" aria-label="Axis Angle Slider">
          </div>
        </div>
      </div>
    `;

    var canvasPre = document.getElementById('vision-sim-canvas-pre');
    var canvasPost = document.getElementById('vision-sim-canvas-post');
    var ctxPre = canvasPre.getContext('2d');
    var ctxPost = canvasPost.getContext('2d');
    var stage = document.getElementById('sim-stage');
    var divider = document.getElementById('sim-divider');

    var offscreenCanvas = document.createElement('canvas');
    var offCtx = offscreenCanvas.getContext('2d');

    // High-Resolution 4K HD Night Driving Asset
    var bgImg = new Image();
    bgImg.src = './assets/hd_night_highway_scene.png';

    var imgLoaded = false;
    bgImg.onload = function () {
      imgLoaded = true;
      updateSimulation();
    };

    // Trigger initial render immediately
    setTimeout(updateSimulation, 100);
    setTimeout(updateSimulation, 500);

    // Aspect-ratio preserving Cover Math to prevent stretching/distortion
    function drawImageCover(ctx, img, width, height) {
      var imgW = img.naturalWidth || img.width || 1920;
      var imgH = img.naturalHeight || img.height || 1080;
      var imgRatio = imgW / imgH;
      var targetRatio = width / height;
      var renderW, renderH, offsetX, offsetY;

      if (targetRatio > imgRatio) {
        renderW = width;
        renderH = width / imgRatio;
        offsetX = 0;
        offsetY = (height - renderH) / 2;
      } else {
        renderH = height;
        renderW = height * imgRatio;
        offsetX = (width - renderW) / 2;
        offsetY = 0;
      }
      ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
    }

    function updateSimulation() {
      var cssW = stage.clientWidth || 800;
      var cssH = stage.clientHeight || 450;
      var dpr = Math.max(2, window.devicePixelRatio || 1);

      // High-DPI Retina resolution canvas scaling to eliminate blurriness
      canvasPre.width = canvasPost.width = offscreenCanvas.width = Math.round(cssW * dpr);
      canvasPre.height = canvasPost.height = offscreenCanvas.height = Math.round(cssH * dpr);

      ctxPost.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctxPre.setTransform(dpr, 0, 0, dpr, 0, 0);
      offCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!imgLoaded) {
        ctxPost.fillStyle = '#060b18';
        ctxPost.fillRect(0, 0, cssW, cssH);
        ctxPost.fillStyle = '#e2b857';
        ctxPost.font = '700 14px Inter, sans-serif';
        ctxPost.fillText('Loading 4K HD Scene...', cssW / 2 - 80, cssH / 2);
        return;
      }

      // 1. Post-LASIK HD 20/15 Canvas (Crisp Aspect-Ratio Preserved Image)
      ctxPost.clearRect(0, 0, cssW, cssH);
      drawImageCover(ctxPost, bgImg, cssW, cssH);

      // 2. Base Offscreen HD Canvas
      offCtx.clearRect(0, 0, cssW, cssH);
      drawImageCover(offCtx, bgImg, cssW, cssH);

      // 3. Pre-LASIK Refractive Error Physics Math
      var absSphere = Math.abs(sphere);
      var absCyl = Math.abs(cylinder);

      var blurPx = (absSphere * 2.2) + (absCyl * 1.2);
      var rad = (axis - 90) * Math.PI / 180;
      var scaleX = 1 + (absCyl * 0.12 * Math.cos(rad));
      var scaleY = 1 + (absCyl * 0.12 * Math.sin(rad));

      ctxPre.clearRect(0, 0, cssW, cssH);
      ctxPre.save();

      if (blurPx > 0.1 || absCyl > 0.1) {
        ctxPre.filter = 'blur(' + blurPx.toFixed(1) + 'px) contrast(' + Math.max(0.75, 1 - (blurPx * 0.02)).toFixed(2) + ')';
        ctxPre.translate(cssW / 2, cssH / 2);
        ctxPre.rotate(rad);
        ctxPre.scale(scaleX, scaleY);
        ctxPre.rotate(-rad);
        ctxPre.translate(-cssW / 2, -cssH / 2);

        ctxPre.drawImage(offscreenCanvas, 0, 0, cssW, cssH);
      } else {
        ctxPre.drawImage(offscreenCanvas, 0, 0, cssW, cssH);
      }

      ctxPre.restore();

      // Clip Path position adjustment
      var clipW = cssW * splitPos;
      canvasPre.style.clipPath = 'polygon(0 0, ' + clipW + 'px 0, ' + clipW + 'px 100%, 0 100%)';
      divider.style.left = clipW + 'px';

      // Telemetry readout update
      var telemetryPre = document.getElementById('sim-telemetry-pre');
      if (telemetryPre) {
        if (sphere === 0 && cylinder === 0) {
          telemetryPre.textContent = 'EMMETROPIA (20/20 NORMAL)';
          telemetryPre.style.color = '#10b981';
        } else {
          var sphStr = (sphere > 0 ? '+' : '') + sphere.toFixed(2) + 'D';
          var cylStr = cylinder < 0 ? ' / ' + cylinder.toFixed(2) + 'D @ ' + axis + '°' : '';
          telemetryPre.textContent = 'UNCORRECTED (' + sphStr + cylStr + ')';
          telemetryPre.style.color = '#ef4444';
        }
      }
    }

    // Split Handle Drag Controls
    var isDragging = false;
    function setSplitFromMouse(e) {
      var rect = stage.getBoundingClientRect();
      var pageX = e.touches ? e.touches[0].clientX : e.clientX;
      var x = pageX - rect.left;
      splitPos = Math.max(0.05, Math.min(0.95, x / rect.width));
      updateSimulation();
    }

    stage.addEventListener('mousedown', function (e) { isDragging = true; setSplitFromMouse(e); });
    stage.addEventListener('touchstart', function (e) { isDragging = true; setSplitFromMouse(e); });
    window.addEventListener('mousemove', function (e) { if (isDragging) setSplitFromMouse(e); });
    window.addEventListener('touchmove', function (e) { if (isDragging) setSplitFromMouse(e); });
    window.addEventListener('mouseup', function () { isDragging = false; });
    window.addEventListener('touchend', function () { isDragging = false; });

    // Slider Listeners
    var sphereSlider = document.getElementById('sim-sphere-slider');
    var cylSlider = document.getElementById('sim-cyl-slider');
    var axisSlider = document.getElementById('sim-axis-slider');

    function syncInputValues() {
      sphere = parseFloat(sphereSlider.value);
      cylinder = parseFloat(cylSlider.value);
      axis = parseInt(axisSlider.value, 10);

      document.getElementById('sim-sphere-val').textContent = (sphere > 0 ? '+' : '') + sphere.toFixed(2) + ' D';
      document.getElementById('sim-cyl-val').textContent = cylinder.toFixed(2) + ' D';
      document.getElementById('sim-axis-val').textContent = axis + '°';

      updateSimulation();
    }

    sphereSlider.addEventListener('input', syncInputValues);
    cylSlider.addEventListener('input', syncInputValues);
    axisSlider.addEventListener('input', syncInputValues);

    // Presets
    var presetBtns = container.querySelectorAll('.sim-preset-btn');
    presetBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        presetBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        if (btn.id === 'sim-preset-hd') {
          sphereSlider.value = 0;
          cylSlider.value = 0;
          axisSlider.value = 0;
        } else {
          sphereSlider.value = btn.getAttribute('data-sphere');
          cylSlider.value = btn.getAttribute('data-cyl');
          axisSlider.value = btn.getAttribute('data-axis');
        }
        syncInputValues();
      });
    });

    window.addEventListener('resize', updateSimulation);
    updateSimulation();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initVisionSimulator);
  } else {
    window.initVisionSimulator();
  }
})();
