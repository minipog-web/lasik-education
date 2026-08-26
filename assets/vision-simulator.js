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
          <span class="sim-badge">Interactive Optical Lab</span>
          <h3 class="sim-title">Interactive Vision &amp; LASIK Clarity Simulator</h3>
          <p class="sim-subtitle">Slide the split-divider or adjust prescription sliders to simulate your optical focus before vs. after Custom Wavefront LASIK.</p>
        </div>

        <div class="sim-stage-container" id="sim-stage">
          <canvas id="vision-sim-canvas-post" class="sim-canvas"></canvas>
          <canvas id="vision-sim-canvas-pre" class="sim-canvas sim-canvas-clipped"></canvas>

          <div class="sim-overlay-badge sim-badge-left" id="sim-badge-pre">
            <span class="sim-status-dot dot-red"></span> PRE: <span id="sim-telemetry-pre">-2.00D / -1.50D @ 90°</span>
          </div>

          <div class="sim-overlay-badge sim-badge-right">
            <span class="sim-status-dot dot-green"></span> POST: 20/15 HD (0.00D)
          </div>
          
          <div class="sim-split-divider" id="sim-divider" style="left: 50%;">
            <div class="sim-handle" aria-label="Drag to compare pre and post LASIK vision">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 8L22 12L18 16M6 8L2 12L6 16"/></svg>
            </div>
          </div>
        </div>

        <!-- Horizontal Scroll / Swipe Presets Bar -->
        <div class="sim-presets-grid" role="group" aria-label="Vision Condition Presets">
          <button type="button" class="sim-preset-btn active" data-sphere="-2.00" data-cyl="0" data-axis="0">Mild Nearsighted (-2.00 D)</button>
          <button type="button" class="sim-preset-btn" data-sphere="-6.00" data-cyl="0" data-axis="0">High Nearsighted (-6.00 D)</button>
          <button type="button" class="sim-preset-btn" data-sphere="0" data-cyl="-2.50" data-axis="90">Astigmatism (-2.50 D @ 90°)</button>
          <button type="button" class="sim-preset-btn" data-sphere="3.00" data-cyl="0" data-axis="0">Farsightedness (+3.00 D)</button>
          <button type="button" class="sim-preset-btn sim-preset-hd" id="sim-preset-hd">✨ CustomWavefront LASIK</button>
        </div>

        <!-- Mobile Parameter Tab Switcher -->
        <div class="sim-mobile-tabs" role="tablist" aria-label="Optical Parameter Controls">
          <button type="button" class="sim-tab-btn active" data-tab="sphere" role="tab" aria-selected="true" aria-controls="sim-group-sphere">Sphere (Myopia)</button>
          <button type="button" class="sim-tab-btn" data-tab="cyl" role="tab" aria-selected="false" aria-controls="sim-group-cyl">Cylinder (Astigmatism)</button>
          <button type="button" class="sim-tab-btn" data-tab="axis" role="tab" aria-selected="false" aria-controls="sim-group-axis">Axis Angle</button>
        </div>

        <!-- Controls Panel (Desktop 3-col / Mobile Active Single-Row with Step Buttons) -->
        <div class="sim-controls-panel">
          <div class="sim-control-group mobile-active" id="sim-group-sphere">
            <div class="sim-control-header">
              <label for="sim-sphere-slider">Sphere (Myopia / Hyperopia)</label>
              <span id="sim-sphere-val" class="sim-val-badge">-2.00 D</span>
            </div>
            <div class="sim-slider-row">
              <button type="button" class="sim-step-btn sim-step-minus" data-slider="sim-sphere-slider" data-step="-0.25" aria-label="Decrease Sphere by 0.25 Diopters">−</button>
              <input type="range" id="sim-sphere-slider" min="-10.00" max="4.00" step="0.25" value="-2.00" aria-label="Sphere Diopter Slider">
              <button type="button" class="sim-step-btn sim-step-plus" data-slider="sim-sphere-slider" data-step="0.25" aria-label="Increase Sphere by 0.25 Diopters">+</button>
            </div>
          </div>

          <div class="sim-control-group" id="sim-group-cyl">
            <div class="sim-control-header">
              <label for="sim-cyl-slider">Cylinder (Astigmatism Power)</label>
              <span id="sim-cyl-val" class="sim-val-badge">-1.50 D</span>
            </div>
            <div class="sim-slider-row">
              <button type="button" class="sim-step-btn sim-step-minus" data-slider="sim-cyl-slider" data-step="-0.25" aria-label="Decrease Cylinder by 0.25 Diopters">−</button>
              <input type="range" id="sim-cyl-slider" min="-5.00" max="0.00" step="0.25" value="-1.50" aria-label="Cylinder Magnitude Slider">
              <button type="button" class="sim-step-btn sim-step-plus" data-slider="sim-cyl-slider" data-step="0.25" aria-label="Increase Cylinder by 0.25 Diopters">+</button>
            </div>
          </div>

          <div class="sim-control-group" id="sim-group-axis">
            <div class="sim-control-header">
              <label for="sim-axis-slider">Astigmatism Axis Angle</label>
              <span id="sim-axis-val" class="sim-val-badge">90°</span>
            </div>
            <div class="sim-slider-row">
              <button type="button" class="sim-step-btn sim-step-minus" data-slider="sim-axis-slider" data-step="-5" aria-label="Decrease Axis by 5 degrees">−</button>
              <input type="range" id="sim-axis-slider" min="0" max="180" step="1" value="90" aria-label="Axis Angle Slider">
              <button type="button" class="sim-step-btn sim-step-plus" data-slider="sim-axis-slider" data-step="5" aria-label="Increase Axis by 5 degrees">+</button>
            </div>
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

    // High-Resolution 4K HD Night Driving Asset
    var bgImg = new Image();
    bgImg.src = './assets/hd_night_highway_scene.png?v=5';

    var imgLoaded = false;
    bgImg.onload = function () {
      imgLoaded = true;
      updateSimulation();
    };

    // Trigger initial render immediately
    setTimeout(updateSimulation, 100);
    setTimeout(updateSimulation, 400);

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
      if (!stage) return;
      var cssW = stage.clientWidth || 800;
      var cssH = stage.clientHeight || 380;
      var dpr = Math.max(2, window.devicePixelRatio || 1);

      // High-DPI Retina resolution canvas scaling to eliminate blurriness
      canvasPre.width = canvasPost.width = Math.round(cssW * dpr);
      canvasPre.height = canvasPost.height = Math.round(cssH * dpr);

      ctxPost.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctxPre.setTransform(dpr, 0, 0, dpr, 0, 0);
      
      // Set high-quality image smoothing
      ctxPost.imageSmoothingEnabled = true;
      ctxPost.imageSmoothingQuality = 'high';
      ctxPre.imageSmoothingEnabled = true;
      ctxPre.imageSmoothingQuality = 'high';

      if (!imgLoaded) {
        ctxPost.fillStyle = '#060b18';
        ctxPost.fillRect(0, 0, cssW, cssH);
        ctxPost.fillStyle = '#e2b857';
        ctxPost.font = '700 13px Inter, sans-serif';
        ctxPost.fillText('Loading 4K HD Scene...', cssW / 2 - 70, cssH / 2);
        return;
      }

      // 1. Post-LASIK HD 20/15 Canvas
      ctxPost.clearRect(0, 0, cssW, cssH);
      drawImageCover(ctxPost, bgImg, cssW, cssH);

      // 2. Pre-LASIK Refractive Error Physics Math
      var absSphere = Math.abs(sphere);
      var absCyl = Math.abs(cylinder);

      var blurPx = (absSphere * 2.2) + (absCyl * 1.2);
      var rad = (axis - 90) * Math.PI / 180;
      var scaleX = 1 + (absCyl * 0.05 * Math.abs(Math.cos(rad)));
      var scaleY = 1 + (absCyl * 0.05 * Math.abs(Math.sin(rad)));

      ctxPre.clearRect(0, 0, cssW, cssH);
      ctxPre.save();

      if (blurPx > 0.1 || absCyl > 0.1) {
        ctxPre.filter = 'blur(' + blurPx.toFixed(1) + 'px) contrast(' + Math.max(0.75, 1 - (blurPx * 0.02)).toFixed(2) + ')';
        ctxPre.translate(cssW / 2, cssH / 2);
        ctxPre.rotate(rad);
        ctxPre.scale(scaleX, scaleY);
        ctxPre.rotate(-rad);
        ctxPre.translate(-cssW / 2, -cssH / 2);

        drawImageCover(ctxPre, bgImg, cssW, cssH);
      } else {
        drawImageCover(ctxPre, bgImg, cssW, cssH);
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
          telemetryPre.textContent = '20/20 (0.00D)';
          telemetryPre.style.color = '#10b981';
        } else {
          var sphStr = (sphere > 0 ? '+' : '') + sphere.toFixed(2) + 'D';
          var cylStr = cylinder < 0 ? ' / ' + cylinder.toFixed(2) + 'D @ ' + axis + '°' : '';
          telemetryPre.textContent = sphStr + cylStr;
          telemetryPre.style.color = '#ef4444';
        }
      }
    }

    // Split Handle Drag Controls
    var isDragging = false;
    function setSplitFromMouse(e) {
      var rect = stage.getBoundingClientRect();
      var pageX = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
      if (typeof pageX !== 'number') return;
      var x = pageX - rect.left;
      splitPos = Math.max(0.05, Math.min(0.95, x / rect.width));
      updateSimulation();
    }

    stage.addEventListener('mousedown', function (e) { isDragging = true; setSplitFromMouse(e); });
    stage.addEventListener('touchstart', function (e) { isDragging = true; setSplitFromMouse(e); }, { passive: true });
    window.addEventListener('mousemove', function (e) { if (isDragging) setSplitFromMouse(e); });
    window.addEventListener('touchmove', function (e) { if (isDragging) setSplitFromMouse(e); }, { passive: true });
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

      var sphValEl = document.getElementById('sim-sphere-val');
      var cylValEl = document.getElementById('sim-cyl-val');
      var axisValEl = document.getElementById('sim-axis-val');

      if (sphValEl) {
        sphValEl.textContent = (sphere > 0 ? '+' : '') + sphere.toFixed(2) + ' D';
        sphValEl.style.transform = 'scale(1.1)';
        sphValEl.style.transition = 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(function() { sphValEl.style.transform = 'scale(1)'; }, 150);
      }
      if (cylValEl) {
        cylValEl.textContent = cylinder.toFixed(2) + ' D';
        cylValEl.style.transform = 'scale(1.1)';
        cylValEl.style.transition = 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(function() { cylValEl.style.transform = 'scale(1)'; }, 150);
      }
      if (axisValEl) {
        axisValEl.textContent = axis + '°';
        axisValEl.style.transform = 'scale(1.1)';
        axisValEl.style.transition = 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(function() { axisValEl.style.transform = 'scale(1)'; }, 150);
      }

      updateSimulation();
    }

    sphereSlider.addEventListener('input', syncInputValues);
    cylSlider.addEventListener('input', syncInputValues);
    axisSlider.addEventListener('input', syncInputValues);

    // Stepper Button Listeners (− / +)
    var stepBtns = container.querySelectorAll('.sim-step-btn');
    stepBtns.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        var targetSliderId = btn.getAttribute('data-slider');
        var stepVal = parseFloat(btn.getAttribute('data-step')) || 0;
        var targetInput = document.getElementById(targetSliderId);
        if (targetInput) {
          var minVal = parseFloat(targetInput.min);
          var maxVal = parseFloat(targetInput.max);
          var curVal = parseFloat(targetInput.value);
          var nextVal = Math.min(maxVal, Math.max(minVal, curVal + stepVal));
          if (targetSliderId === 'sim-axis-slider') {
            targetInput.value = Math.round(nextVal);
          } else {
            targetInput.value = nextVal.toFixed(2);
          }
          syncInputValues();
        }
      });
    });

    // Mobile Tab Switcher Logic
    var mobileTabBtns = container.querySelectorAll('.sim-tab-btn');
    var controlGroups = container.querySelectorAll('.sim-control-group');

    function setActiveTab(tabKey) {
      mobileTabBtns.forEach(function(btn) {
        var isMatch = btn.getAttribute('data-tab') === tabKey;
        btn.classList.toggle('active', isMatch);
        btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
      });
      controlGroups.forEach(function(grp) {
        var isMatch = grp.id === 'sim-group-' + tabKey;
        grp.classList.toggle('mobile-active', isMatch);
      });
    }

    mobileTabBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var tabKey = btn.getAttribute('data-tab');
        setActiveTab(tabKey);
      });
    });

    // Presets Click Handler
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
          var sph = parseFloat(btn.getAttribute('data-sphere')) || 0;
          var cyl = parseFloat(btn.getAttribute('data-cyl')) || 0;
          var ax = parseInt(btn.getAttribute('data-axis'), 10) || 0;
          sphereSlider.value = sph;
          cylSlider.value = cyl;
          axisSlider.value = ax;

          // If astigmatism preset, smartly switch mobile tab to Cylinder
          if (cyl !== 0 && window.innerWidth <= 768) {
            setActiveTab('cyl');
          } else if (sph !== 0 && window.innerWidth <= 768) {
            setActiveTab('sphere');
          }
        }
        syncInputValues();
      });
    });

    window.addEventListener('resize', updateSimulation, { passive: true });
    updateSimulation();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initVisionSimulator);
  } else {
    window.initVisionSimulator();
  }
})();
