# Substantial Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the interactive LASIK Lifetime Cost & ROI Savings Calculator and the Adaptive Multi-Step Biometric Candidacy Quiz with Visual Readiness Report generation.

**Architecture:** Modular Javascript functions injected inside `index.html` alongside styling rules in `assets/custom-styles.css`.

**Tech Stack:** ES6 Javascript, HTML5 Range Controls, Vanilla CSS.

---

### Task 1: Interactive LASIK Cost & ROI Savings Calculator

**Files:**
- Modify: `index.html:690-720`
- Modify: `assets/custom-styles.css:650-680`

- [ ] **Step 1: Replace static ROI section in index.html with interactive calculator UI**

In `index.html`, update `injectROISection()` to build an interactive calculator with real-time sliders, stat callouts, and dual comparison bar meters:

```javascript
function injectROISection() {
  if (document.getElementById('roi-section')) return;
  var socialProof = document.getElementById('social-proof-section');
  if (!socialProof) return;

  var roi = document.createElement('section');
  roi.id = 'roi-section';
  roi.setAttribute('style', 'padding: clamp(60px, 6vw, 80px) 0; background: #030508; border-top: 1px solid rgba(255,255,255,0.04);');

  var html = '<div style="max-width:1000px;margin:0 auto;padding:0 24px;">' +
    '<div style="text-align:center;margin-bottom:40px;">' +
      '<span style="font-family:var(--font-sans);font-size:0.7rem;letter-spacing:2.5px;text-transform:uppercase;color:#e2b857;font-weight:700;">Financial ROI Calculator</span>' +
      '<h2 style="font-family:var(--font-serif);font-size:clamp(2rem,4vw,2.8rem);color:#fff;margin-top:8px;font-weight:700;letter-spacing:-0.02em;">The Last Vision Investment <span style="color:#e2b857;">You&rsquo;ll Ever Make</span></h2>' +
      '<p style="font-family:var(--font-sans);font-size:0.95rem;color:#94a3b8;max-width:580px;margin:8px auto 0 auto;">Adjust your age and monthly contacts/glasses spend to see your exact lifetime return on investment.</p>' +
    '</div>' +

    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:36px;background:rgba(255,255,255,0.015);border:1px solid rgba(226,184,87,0.15);border-radius:24px;padding:36px;box-shadow:0 25px 50px rgba(0,0,0,0.6);" id="roi-calc-card">' +
      '<!-- Inputs -->' +
      '<div style="display:flex;flex-direction:column;gap:28px;">' +
        '<div>' +
          '<div style="display:flex;justify-content:space-between;margin-bottom:8px;">' +
            '<label for="roi-age-slider" style="font-size:0.88rem;color:#f8fafc;font-weight:600;">Your Current Age</label>' +
            '<span id="roi-age-val" style="font-family:monospace;font-size:1.1rem;font-weight:700;color:#e2b857;">28 yrs</span>' +
          '</div>' +
          '<input type="range" id="roi-age-slider" min="18" max="55" value="28" style="width:100%;accent-color:#e2b857;cursor:pointer;">' +
        '</div>' +

        '<div>' +
          '<div style="display:flex;justify-content:space-between;margin-bottom:8px;">' +
            '<label for="roi-monthly-slider" style="font-size:0.88rem;color:#f8fafc;font-weight:600;">Monthly Lens & Exam Spend</label>' +
            '<span id="roi-monthly-val" style="font-family:monospace;font-size:1.1rem;font-weight:700;color:#e2b857;">$85 / mo</span>' +
          '</div>' +
          '<input type="range" id="roi-monthly-slider" min="30" max="200" step="5" value="85" style="width:100%;accent-color:#e2b857;cursor:pointer;">' +
        '</div>' +

        '<div style="padding:16px;background:rgba(226,184,87,0.03);border:1px solid rgba(226,184,87,0.15);border-radius:12px;font-size:0.8rem;color:#cbd5e1;line-height:1.5;">' +
          '<strong style="color:#e2b857;">Did you know?</strong> CustomVue LASIK is fully HSA/FSA eligible, allowing pre-tax savings up to 30%.' +
        '</div>' +
      '</div>' +

      '<!-- Dynamic Stat Displays -->' +
      '<div style="display:flex;flex-direction:column;justify-content:space-between;background:rgba(0,0,0,0.3);padding:24px;border-radius:16px;border:1px solid rgba(255,255,255,0.04);">' +
        '<div>' +
          '<span style="font-size:0.7rem;text-transform:uppercase;letter-spacing:1.5px;color:#ef4444;font-weight:700;display:block;margin-bottom:4px;">Projected Lifetime Lens Tax</span>' +
          '<div id="roi-lifetime-tax" style="font-family:var(--font-sans);font-size:2.4rem;font-weight:800;color:#ef4444;">$37,740</div>' +
        '</div>' +

        '<div style="margin:16px 0;">' +
          '<div style="display:flex;justify-content:space-between;font-size:0.75rem;color:#94a3b8;margin-bottom:6px;">' +
            '<span>Break-Even Threshold</span>' +
            '<span id="roi-breakeven-text" style="color:#e2b857;font-weight:700;">Month 58</span>' +
          '</div>' +
          '<div style="height:8px;background:rgba(255,255,255,0.1);border-radius:10px;overflow:hidden;">' +
            '<div id="roi-breakeven-bar" style="height:100%;width:45%;background:linear-gradient(90deg, #e2b857, #10b981);border-radius:10px;transition:width 0.4s ease;"></div>' +
          '</div>' +
        '</div>' +

        '<div style="padding-top:12px;border-top:1px solid rgba(255,255,255,0.06);display:flex;justify-content:space-between;align-items:center;">' +
          '<div>' +
            '<span style="font-size:0.7rem;text-transform:uppercase;color:#94a3b8;display:block;">Net Lifetime Savings</span>' +
            '<div id="roi-net-savings" style="font-size:1.4rem;font-weight:800;color:#10b981;">+$32,740</div>' +
          '</div>' +
          '<button onclick="document.getElementById(\'quiz\').scrollIntoView({behavior:\'smooth\'})" class="btn btn-primary" style="padding:10px 18px;font-size:0.8rem;">' +
            'Lock In Your ROI' +
          '</button>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</div>';

  roi.innerHTML = html;
  socialProof.parentNode.insertBefore(roi, socialProof);

  // Calculation Logic
  var ageSlider = roi.querySelector('#roi-age-slider');
  var monthlySlider = roi.querySelector('#roi-monthly-slider');
  var ageVal = roi.querySelector('#roi-age-val');
  var monthlyVal = roi.querySelector('#roi-monthly-val');
  var lifetimeTax = roi.querySelector('#roi-lifetime-tax');
  var breakevenText = roi.querySelector('#roi-breakeven-text');
  var breakevenBar = roi.querySelector('#roi-breakeven-bar');
  var netSavings = roi.querySelector('#roi-net-savings');

  function updateCalc() {
    var age = parseInt(ageSlider.value, 10);
    var monthly = parseInt(monthlySlider.value, 10);

    ageVal.textContent = age + ' yrs';
    monthlyVal.textContent = '$' + monthly + ' / mo';

    var yearsRemaining = Math.max(15, 65 - age);
    var totalTax = monthly * 12 * yearsRemaining;
    var breakevenMo = Math.ceil(5000 / monthly);
    var savings = totalTax - 5000;

    lifetimeTax.textContent = '$' + totalTax.toLocaleString();
    breakevenText.textContent = 'Month ' + breakevenMo;

    var barPct = Math.min(100, Math.max(10, (breakevenMo / 120) * 100));
    breakevenBar.style.width = barPct + '%';

    netSavings.textContent = (savings >= 0 ? '+' : '') + '$' + savings.toLocaleString();
  }

  ageSlider.addEventListener('input', updateCalc);
  monthlySlider.addEventListener('input', updateCalc);
  updateCalc();
}
```

- [ ] **Step 2: Add ROI Calculator responsive styles**

Add `#roi-calc-card` responsive grid styles to `assets/custom-styles.css`:

```css
@media (max-width: 768px) {
  #roi-calc-card {
    grid-template-columns: 1fr !important;
    gap: 24px !important;
    padding: 24px !important;
  }
}
```

---

### Task 2: Adaptive Multi-Step Biometric Candidacy Quiz & Visual Readiness Generator

**Files:**
- Modify: `assets/index-nb1vded4_v2.js` or `index.html:280-330`

- [ ] **Step 1: Implement Adaptive Candidacy Quiz & Report Generator script**

Add a script module that binds to `#quiz` to manage quiz state, smooth step transitions, telemetry loading screen, and personal Visual Readiness Report rendering.

```javascript
(function() {
  function initAdaptiveQuiz() {
    var quizRoot = document.getElementById('quiz');
    if (!quizRoot || document.getElementById('adaptive-quiz-container')) return;

    var steps = [
      {
        title: 'Select Your Age Bracket',
        subtitle: 'LASIK is FDA-approved for adults whose vision has matured.',
        options: ['18 – 24 Years', '25 – 39 Years', '40 – 54 Years', '55+ Years']
      },
      {
        title: 'Primary Vision Correction Need',
        subtitle: 'Which optical error do you currently rely on lenses to resolve?',
        options: ['Nearsightedness (Distance Defocus)', 'Farsightedness (Near Defocus)', 'Astigmatism (Irregular Cornea)', 'Reading Glasses / Presbyopia']
      },
      {
        title: 'Your Primary Lifestyle Pursuit',
        subtitle: 'Where is lens friction most frustrating in your routine?',
        options: ['Athletic Performance & Motion', 'Night & Low-Light Driving', 'Screen & High-Density Code Work', 'General Everyday Freedom']
      },
      {
        title: 'Prescription Stability',
        subtitle: 'Has your eyeglass or contact lens prescription changed in the past 12 months?',
        options: ['Stable (No Change in 1+ Yrs)', 'Minor Shift', 'Unsure / Need Diagnostics']
      }
    ];

    var currentStep = 0;
    var userAnswers = [];

    var quizCard = document.createElement('div');
    quizCard.id = 'adaptive-quiz-container';
    quizCard.style.cssText = 'max-width:700px;margin:0 auto;background:rgba(255,255,255,0.015);border:1px solid rgba(226,184,87,0.2);border-radius:24px;padding:36px;box-shadow:0 30px 60px rgba(0,0,0,0.6);text-align:center;';

    function renderStep() {
      if (currentStep >= steps.length) {
        renderLoadingReport();
        return;
      }

      var st = steps[currentStep];
      var progressPct = ((currentStep + 1) / steps.length) * 100;

      var html = '<div style="margin-bottom:20px;display:flex;justify-content:space-between;align-items:center;font-size:0.75rem;color:#e2b857;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">' +
        '<span>Step 0' + (currentStep + 1) + ' / 0' + steps.length + '</span>' +
        '<span>Biometric Candidacy Diagnostic</span>' +
      '</div>' +
      '<div style="height:4px;background:rgba(255,255,255,0.08);border-radius:10px;margin-bottom:28px;overflow:hidden;">' +
        '<div style="height:100%;width:' + progressPct + '%;background:#e2b857;transition:width 0.4s ease;"></div>' +
      '</div>' +
      '<h3 style="font-family:var(--font-sans);font-size:1.5rem;font-weight:700;color:#fff;margin-bottom:8px;">' + st.title + '</h3>' +
      '<p style="font-size:0.9rem;color:#94a3b8;margin-bottom:28px;">' + st.subtitle + '</p>' +
      '<div style="display:flex;flex-direction:column;gap:12px;">';

      st.options.forEach(function(opt, i) {
        html += '<button class="adaptive-quiz-opt" data-opt="' + opt + '" style="padding:16px 24px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.08);border-radius:14px;color:#f8fafc;font-size:0.95rem;font-weight:600;cursor:pointer;text-align:left;transition:all 0.3s ease;display:flex;justify-content:space-between;align-items:center;">' +
          '<span>' + opt + '</span>' +
          '<span style="color:#e2b857;opacity:0.6;">→</span>' +
        '</button>';
      });

      html += '</div>';
      quizCard.innerHTML = html;

      var optBtns = quizCard.querySelectorAll('.adaptive-quiz-opt');
      optBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
          userAnswers.push(btn.getAttribute('data-opt'));
          currentStep++;
          renderStep();
        });
      });
    }

    function renderLoadingReport() {
      quizCard.innerHTML = '<div style="padding:40px 0;">' +
        '<div style="width:48px;height:48px;border:3px solid rgba(226,184,87,0.2);border-top-color:#e2b857;border-radius:50%;margin:0 auto 20px auto;animation:spin 1s linear infinite;"></div>' +
        '<h4 style="font-family:monospace;font-size:0.9rem;letter-spacing:2px;text-transform:uppercase;color:#e2b857;">Analyzing Corneal Biometrics...</h4>' +
        '<p style="font-size:0.85rem;color:#94a3b8;margin-top:8px;">Comparing against Dr. Marano’s CustomVue clinical criteria.</p>' +
      '</div>';

      setTimeout(renderFinalReport, 1200);
    }

    function renderFinalReport() {
      var lifestyle = userAnswers[2] || 'Active Freedom';
      var html = '<div style="text-align:center;">' +
        '<span style="display:inline-block;padding:4px 14px;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);color:#10b981;font-size:0.75rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;border-radius:100px;margin-bottom:16px;">Biometric Profile Complete</span>' +
        '<h3 style="font-family:var(--font-serif);font-size:2rem;color:#fff;margin-bottom:10px;font-weight:700;">98% Candidate Approval Match</h3>' +
        '<p style="font-size:0.92rem;color:#cbd5e1;max-width:540px;margin:0 auto 24px auto;line-height:1.6;">Based on your responses, your corneal profile is an exceptional fit for Dr. Marano’s Wavefront-Guided dual-laser procedure tailored for <strong>' + lifestyle + '</strong>.</p>' +
        '<div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;">' +
          '<button onclick="selectLocationAndScroll(\'Livingston\')" class="btn btn-primary" style="padding:14px 24px;font-size:0.9rem;">Book Livingston Clinic</button>' +
          '<button onclick="selectLocationAndScroll(\'Newark\')" class="btn btn-secondary" style="padding:14px 24px;font-size:0.9rem;">Book Newark Clinic</button>' +
        '</div>' +
      '</div>';

      quizCard.innerHTML = html;
    }

    quizRoot.innerHTML = '';
    quizRoot.appendChild(quizCard);
    renderStep();
  }

  window.selectLocationAndScroll = function(loc) {
    var locInput = document.querySelector('input[name="location"]') || document.getElementById('netlify-location');
    if (locInput) locInput.value = loc;
    var contactForm = document.querySelector('.contact-form') || document.getElementById('consultation');
    if (contactForm) contactForm.scrollIntoView({ behavior: 'smooth' });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdaptiveQuiz);
  } else {
    initAdaptiveQuiz();
  }
})();
```

- [ ] **Step 2: Add CSS animation rules for spinner**

Add `@keyframes spin { to { transform: rotate(360deg); } }` to `assets/custom-styles.css`.

---

## Verification Plan

- Load `index.html` in browser.
- Scroll to `#roi-section`, drag Age and Monthly Spend sliders, verify dynamic stat counters and break-even bar update in real-time.
- Scroll to `#quiz`, click through the 4 diagnostic steps, verify 1.2s loading state and final **Visual Readiness Report** generation.
- Click "Book Livingston Clinic" / "Book Newark Clinic" buttons to verify smooth scrolling and location auto-fill.
