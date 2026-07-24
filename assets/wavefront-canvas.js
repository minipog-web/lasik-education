(function() {
  function initWavefrontCanvas() {
    var wrapper = document.querySelector('.hero-image-card');
    if (!wrapper || document.getElementById('wavefront-canvas')) return;

    var canvas = document.createElement('canvas');
    canvas.id = 'wavefront-canvas';
    canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;z-index:2;pointer-events:none;border-radius:24px;';
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

      // Concentric Topographical Elevation Rings
      ctx.strokeStyle = 'rgba(226, 184, 87, 0.18)';
      ctx.lineWidth = 1;

      for (var r = 1; r <= 4; r++) {
        ctx.beginPath();
        ctx.arc(centerX + (mouse.x - 0.5) * 25, centerY + (mouse.y - 0.5) * 25, radius * (r / 4), 0, Math.PI * 2);
        ctx.stroke();
      }

      // Wavefront 10,240 Micro-Node Matrix Simulation
      for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
          var u = j / (cols - 1);
          var v = i / (rows - 1);
          var px = (u - 0.5) * radius * 2.2 + centerX + (mouse.x - 0.5) * 35 * (u - 0.5);
          var py = (v - 0.5) * radius * 2.2 + centerY + (mouse.y - 0.5) * 35 * (v - 0.5);

          var dist = Math.hypot(px - (centerX + (mouse.x - 0.5) * 25), py - (centerY + (mouse.y - 0.5) * 25));
          if (dist < radius) {
            var alpha = (1 - dist / radius) * 0.75;
            ctx.fillStyle = alpha > 0.45 ? '#e2b857' : 'rgba(168, 85, 247, ' + alpha + ')';
            ctx.beginPath();
            ctx.arc(px, py, alpha > 0.45 ? 2.5 : 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Optical Targeting Reticle Focus
      var reticleX = centerX + (mouse.x - 0.5) * 45;
      var reticleY = centerY + (mouse.y - 0.5) * 45;
      ctx.strokeStyle = '#e2b857';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(reticleX, reticleY, 20, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(reticleX - 26, reticleY);
      ctx.lineTo(reticleX + 26, reticleY);
      ctx.moveTo(reticleX, reticleY - 26);
      ctx.lineTo(reticleX, reticleY + 26);
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
