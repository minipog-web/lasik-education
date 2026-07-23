# Visual Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the LASIK Education landing page with a dynamic interactive 3D wavefront corneal visualizer, a 24-hour interactive recovery timeline scrubber, and high-craft dark-mode HUD micro-interactions.

**Architecture:** Vanilla HTML5 Canvas, modern ES6 Javascript, and modular CSS enhancements applied to `index.html` and `assets/custom-styles.css`.

**Tech Stack:** HTML5 Canvas, Vanilla CSS, ES6 Javascript.

---

### Task 1: 3D Wavefront Corneal Map Visualizer

**Files:**
- Create: `assets/wavefront-canvas.js`
- Modify: `index.html:195-205`

- [ ] **Step 1: Create the HTML5 Canvas Wavefront script**

Create `assets/wavefront-canvas.js` with interactive 3D particle mesh and cursor tracking:

```javascript
(function() {
  function initWavefrontCanvas() {
    var wrapper = document.querySelector('.hero-image-card');
    if (!wrapper || document.getElementById('wavefront-canvas')) return;

    var canvas = document.createElement('canvas');
    canvas.id = 'wavefront-canvas';
    canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;z-index:2;pointer-events:none;';
    wrapper.appendChild(canvas);

    var ctx = canvas.getContext('2d');
    var width, height;
    var mouse = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };

    function resize() {
      width = canvas.width = wrapper.clientWidth;
      height = canvas.height = wrapper.clientHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    wrapper.addEventListener('mousemove', function(e) {
      var rect = wrapper.getBoundingClientRect();
      mouse.targetX = (e.clientX - rect.left) / rect.width;
      mouse.targetY = (e.clientY - rect.top) / rect.height;
    });

    var rows = 14;
    var cols = 20;

    function render() {
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      var centerX = width / 2;
      var centerY = height / 2;
      var radius = Math.min(width, height) * 0.42;

      ctx.strokeStyle = 'rgba(226, 184, 87, 0.15)';
      ctx.lineWidth = 1;

      for (var r = 1; r <= 4; r++) {
        ctx.beginPath();
        ctx.arc(centerX + (mouse.x - 0.5) * 30, centerY + (mouse.y - 0.5) * 30, radius * (r / 4), 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.fillStyle = 'rgba(226, 184, 87, 0.6)';
      for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
          var u = j / (cols - 1);
          var v = i / (rows - 1);
          var px = (u - 0.5) * radius * 2.2 + centerX + (mouse.x - 0.5) * 40 * (u - 0.5);
          var py = (v - 0.5) * radius * 2.2 + centerY + (mouse.y - 0.5) * 40 * (v - 0.5);

          var dist = Math.hypot(px - (centerX + (mouse.x - 0.5) * 30), py - (centerY + (mouse.y - 0.5) * 30));
          if (dist < radius) {
            var alpha = (1 - dist / radius) * 0.7;
            ctx.fillStyle = alpha > 0.4 ? '#e2b857' : 'rgba(168, 85, 247, ' + alpha + ')';
            ctx.beginPath();
            ctx.arc(px, py, alpha > 0.4 ? 2.5 : 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      var reticleX = centerX + (mouse.x - 0.5) * 60;
      var reticleY = centerY + (mouse.y - 0.5) * 60;
      ctx.strokeStyle = '#e2b857';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(reticleX, reticleY, 18, 0, Math.PI * 2);
      ctx.stroke();

      requestAnimationFrame(render);
    }
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWavefrontCanvas);
  } else {
    initWavefrontCanvas();
  }
})();
```

- [ ] **Step 2: Link script in index.html**

Add `<script src="./assets/wavefront-canvas.js"></script>` right before closing head tag in `index.html`.

---

### Task 2: Interactive 24-Hour Recovery Scrubber

**Files:**
- Modify: `index.html:678-690`
- Modify: `assets/custom-styles.css:638-650`

- [ ] **Step 1: Enhance timeline strip with interactive scrubber UI**

In `index.html` within `injectTimelineStrip()`, replace static grid markup with dynamic timeline slider control:

```javascript
var stages = [
  { hour: '0h', title: 'Procedure Complete', text: 'Flap seated with natural osmotic pressure. Initial resting phase in recovery lounge.' },
  { hour: '4h', title: 'Cellular Sealing', text: 'Epithelial alignment active. Baseline optical clarity begins restoring rapidly.' },
  { hour: '12h', title: 'HD Acuity Restored', text: '95%+ visual sharpness reached. Night glare sensitivity rapidly subsides.' },
  { hour: '24h', title: 'Full Active Freedom', text: 'Cleared for high-density screen work, driving, and active daily pursuits.' }
];
```

Render an interactive range slider `<input type="range" min="0" max="3" value="3" id="timeline-scrubber">` and step dot indicators. Add click & slide listeners to dynamically highlight active stage text.

- [ ] **Step 2: Add timeline scrubber styles in custom-styles.css**

Add timeline scrubber track, thumb, active node glow, and transition styles to `assets/custom-styles.css`.

---

### Task 3: Tactile Dark-Mode HUD Badges & CTA Light-Sweep Animations

**Files:**
- Modify: `assets/custom-styles.css:355-405`

- [ ] **Step 1: Add HUD Wavelength tags and CTA hover shimmers**

Ensure `.steps-progress-dot.active-radar-dot` displays glowing laser telemetry tags (`SYS_OK // 1053nm` and `SYS_OK // 193nm`).
Add light-sweep shimmer keyframes and high-contrast WCAG AAA focus indicators to all primary buttons and glass panels.

---

## Plan Verification

- **Automated / Manual Test:** Load `index.html` in browser, verify Canvas renders over hero card, verify moving cursor moves reticle, test timeline scrubber slider, verify WCAG focus states.
