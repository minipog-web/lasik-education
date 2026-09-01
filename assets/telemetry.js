/**
 * Marano Eye Care — Telemetry & Conversion Tracking Architecture
 * Isolated Telemetry Module: GA4, Google Ads, GTM & Micro-Conversions
 */
(function(window, document) {
  'use strict';

  // 1. Ensure dataLayer and gtag exist
  window.dataLayer = window.dataLayer || [];
  function gtagStub() {
    window.dataLayer.push(arguments);
  }
  if (typeof window.gtag !== 'function') {
    window.gtag = gtagStub;
  }

  // 2. Core Telemetry Dispatcher
  function trackEvent(eventName, params) {
    params = params || {};
    var payload = Object.assign({
      event: eventName,
      timestamp: new Date().toISOString()
    }, params);

    window.dataLayer.push(payload);
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    }
  }

  // Helper function to delay opening a URL until a gtag event is sent
  function gtagSendEvent(url) {
    var callback = function () {
      if (typeof url === 'string') {
        window.location = url;
      }
    };
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'ads_conversion_Form_1', {
        'event_callback': callback,
        'event_timeout': 2000
      });
    } else {
      callback();
    }
    return false;
  }

  // Google Ads Book Appointment Conversion Tracking
  function reportConversion(url) {
    var callback = function () {
      if (typeof url !== 'undefined') {
        window.location = url;
      }
    };
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'conversion', {
        'send_to': 'AW-17962563730/IsEZCL66_dscEJLxm_VC',
        'event_callback': callback
      });
    } else {
      callback();
    }
    return false;
  }

  // Helper for URL parameters in serialized form bodies
  function getParam(body, key) {
    var match = new RegExp('(?:^|&)' + key + '=([^&]*)').exec(body);
    return match ? decodeURIComponent(match[1].replace(/\+/g, ' ')) : null;
  }

  // 3. Intercept Fetch Consultation Form Submissions & Enhanced Conversions
  var originalFetch = window.fetch;
  if (originalFetch) {
    window.fetch = function() {
      var args = arguments;
      var url = args[0];
      var options = args[1];
      if (url === '/' && options && options.method === 'POST' && typeof options.body === 'string' && options.body.indexOf('form-name=consultation') !== -1) {
        var nameVal = getParam(options.body, 'name') || '';
        var emailVal = getParam(options.body, 'email') || '';
        var phoneVal = getParam(options.body, 'phone') || '';
        var locationVal = getParam(options.body, 'location') || 'Livingston';
        var preferredContact = getParam(options.body, 'preferred_contact') || 'email';
        var timeframeVal = getParam(options.body, 'timeframe') || '';

        var nameParts = nameVal.trim().split(/\s+/);
        var firstName = nameParts[0] || '';
        var lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
        var cleanPhone = phoneVal.replace(/[^\d+]/g, '');
        var cleanEmail = emailVal.toLowerCase().trim();

        var userData = {
          email: cleanEmail,
          phone_number: cleanPhone,
          address: {
            first_name: firstName,
            last_name: lastName
          }
        };

        var utmSrc = getParam(options.body, 'utm_source') || '';
        var utmMed = getParam(options.body, 'utm_medium') || '';
        var utmCam = getParam(options.body, 'utm_campaign') || '';
        var utmCon = getParam(options.body, 'utm_content') || '';
        var utmTerm = getParam(options.body, 'utm_term') || '';
        var gclidVal = getParam(options.body, 'gclid') || '';

        trackEvent('generate_lead', {
          lead_type: 'consultation_request',
          form_name: 'consultation',
          location: locationVal,
          preferred_contact: preferredContact,
          timeframe: timeframeVal,
          value: 150.00,
          currency: 'USD',
          utm_source: utmSrc,
          utm_medium: utmMed,
          utm_campaign: utmCam,
          utm_content: utmCon,
          utm_term: utmTerm,
          gclid: gclidVal
        });

        trackEvent('form_submission', {
          form_name: 'consultation',
          location: locationVal,
          preferred_contact: preferredContact,
          utm_source: utmSrc,
          utm_medium: utmMed,
          utm_campaign: utmCam,
          utm_content: utmCon,
          utm_term: utmTerm,
          gclid: gclidVal
        });

        window.dataLayer.push({
          event: 'ads_conversion_submit_lead',
          send_to: 'AW-17962563730/udUdCIWWp9gcEJLxm_VC',
          value: 150.00,
          currency: 'USD',
          user_data: userData
        });

        if (typeof window.gtag === 'function') {
          window.gtag('event', 'conversion', {
            'send_to': 'AW-17962563730/udUdCIWWp9gcEJLxm_VC',
            'value': 150.00,
            'currency': 'USD',
            'user_data': userData
          });
        }
      }
      return originalFetch.apply(this, args);
    };
  }

  // 4. Form Field Engagement & Start Tracking
  var formStarted = false;
  document.addEventListener('focusin', function(e) {
    if (e.target && e.target.form && (e.target.form.name === 'consultation' || e.target.closest('#hero-mc-card'))) {
      if (!formStarted) {
        formStarted = true;
        trackEvent('form_start', {
          form_name: 'consultation',
          first_field: e.target.name || e.target.id
        });
      }
      trackEvent('form_field_focus', {
        field_name: e.target.name || e.target.id
      });
    }
  }, true);

  // 5. User Interaction Tracking (Declarative & Delegated)
  document.addEventListener('click', function(e) {
    var target = e.target;
    while (target && target !== document.body) {
      // Declarative data-track attribute handler
      var trackAttr = target.getAttribute && target.getAttribute('data-track');
      if (trackAttr) {
        trackEvent(trackAttr, {
          element_id: target.id || null,
          element_text: (target.innerText || target.textContent || '').trim().slice(0, 100)
        });
      }

      // Click-to-Call Link Tracking
      if (target.tagName === 'A' && target.href && target.href.indexOf('tel:') === 0) {
        var phoneNum = target.href.replace('tel:', '');
        trackEvent('phone_click', {
          phone_number: phoneNum,
          link_text: (target.innerText || target.textContent || '').trim(),
          event_category: 'contact',
          event_label: 'click_to_call'
        });
        window.dataLayer.push({
          event: 'ads_conversion_phone_call',
          phone_number: phoneNum
        });
        break;
      }

      // Google Maps Directions Click
      if (target.tagName === 'A' && target.href && target.href.indexOf('google.com/maps') !== -1) {
        trackEvent('maps_directions_click', {
          destination: (target.innerText || target.textContent || '').trim(),
          link_url: target.href
        });
        break;
      }

      // Outbound Link Tracking
      if (target.tagName === 'A' && target.href && target.hostname && target.hostname !== window.location.hostname) {
        trackEvent('outbound_click', {
          outbound_domain: target.hostname,
          link_url: target.href,
          link_text: (target.innerText || target.textContent || '').trim()
        });
      }

      // Vision Simulator Preset & HD Buttons
      if (target.classList && target.classList.contains('sim-preset-btn')) {
        var isHD = target.classList.contains('sim-preset-hd');
        trackEvent(isHD ? 'vision_simulator_hd_click' : 'vision_simulator_preset_click', {
          preset_name: (target.innerText || target.textContent || '').trim(),
          sphere: target.getAttribute('data-sphere') || '0',
          cylinder: target.getAttribute('data-cyl') || '0'
        });
        break;
      }

      // CTA Button Tracking
      if (target.tagName === 'BUTTON' || (target.className && typeof target.className === 'string' && target.className.indexOf('btn') !== -1)) {
        var btnText = (target.innerText || target.textContent || '').trim().replace(/\s+/g, ' ');
        if (btnText && !trackAttr) {
          trackEvent('cta_click', {
            cta_label: btnText,
            button_id: target.id || null,
            event_category: 'engagement'
          });
        }
        break;
      }

      // Lifestyle Tab Switch Tracking
      if (target.classList && target.classList.contains('lifestyle-tab-btn')) {
        var tabId = target.getAttribute('data-tab');
        trackEvent('lifestyle_tab_select', {
          tab_id: tabId,
          tab_label: (target.innerText || target.textContent || '').trim()
        });
        break;
      }

      // Technology Tab Switch Tracking
      if (target.classList && target.classList.contains('laser-suite-tab')) {
        trackEvent('technology_tab_select', {
          technology_id: target.id,
          technology_name: (target.innerText || target.textContent || '').trim()
        });
        break;
      }

      target = target.parentNode;
    }
  }, true);

  // 6. ROI Cost Calculator Interaction Tracking
  var calcDebounceTimer = null;
  document.addEventListener('input', function(e) {
    if (e.target && e.target.id && e.target.id.indexOf('roi-') === 0) {
      clearTimeout(calcDebounceTimer);
      calcDebounceTimer = setTimeout(function() {
        var ageEl = document.getElementById('roi-age-slider');
        var monthlyEl = document.getElementById('roi-monthly-slider');
        var hsaEl = document.getElementById('roi-hsa-toggle');
        trackEvent('calculator_interaction', {
          calculator_name: 'lasik_roi_cost',
          age: ageEl ? ageEl.value : null,
          monthly_spend: monthlyEl ? monthlyEl.value : null,
          hsa_applied: hsaEl ? hsaEl.checked : false
        });
      }, 800);
    }
  });

  // 7. Scroll Depth Milestones (25%, 50%, 75%, 90%)
  var trackedMilestones = {};
  function trackScrollDepth() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    var scrollPct = Math.round((scrollTop / docHeight) * 100);

    var milestones = [25, 50, 75, 90];
    milestones.forEach(function(m) {
      if (scrollPct >= m && !trackedMilestones[m]) {
        trackedMilestones[m] = true;
        trackEvent('scroll_depth', {
          percent_scrolled: m,
          event_category: 'engagement'
        });
      }
    });
  }

  var scrollTimer = null;
  window.addEventListener('scroll', function() {
    if (!scrollTimer) {
      scrollTimer = setTimeout(function() {
        scrollTimer = null;
        trackScrollDepth();
      }, 250);
    }
  }, { passive: true });

  // 8. Time on Page Engagement Milestones (30s, 60s, 120s)
  [30, 60, 120].forEach(function(seconds) {
    setTimeout(function() {
      if (!document.hidden) {
        trackEvent('user_engagement_time', {
          engaged_seconds: seconds
        });
      }
    }, seconds * 1000);
  });

  // 9. Eligibility Quiz Monitoring
  var quizCompletedSent = false;
  var quizStartedSent = false;
  var quizObserver = new MutationObserver(function() {
    var rootEl = document.getElementById('root');
    if (!rootEl) return;

    if (!quizStartedSent) {
      var quizCard = rootEl.querySelector('#hero-mc-card');
      if (quizCard) {
        quizStartedSent = true;
        trackEvent('quiz_start', {
          quiz_name: '60_sec_lasik_eligibility'
        });
      }
    }

    if (!quizCompletedSent) {
      var resultsHeader = rootEl.querySelector('h3');
      if (resultsHeader) {
        var text = (resultsHeader.innerText || resultsHeader.textContent || '').trim();
        if (text === 'Initial Biometrics Approved' || text === 'Assessment Report Prepared') {
          quizCompletedSent = true;
          var resultType = text === 'Initial Biometrics Approved' ? 'eligible' : 'review';
          trackEvent('quiz_complete', {
            quiz_name: '60_sec_lasik_eligibility',
            quiz_result: resultType,
            assessment_status: text
          });
          trackEvent('generate_lead', {
            lead_type: 'quiz_completion',
            quiz_result: resultType,
            value: 100.00,
            currency: 'USD'
          });
        }
      }
    }
  });

  window.addEventListener('load', function() {
    var rootEl = document.getElementById('root') || document.body;
    quizObserver.observe(rootEl, {
      childList: true,
      subtree: true
    });
  });

  // Expose global telemetry API
  window.gtagSendEvent = gtagSendEvent;
  window.gtag_report_conversion = reportConversion;
  window.MaranoTelemetry = {
    trackEvent: trackEvent,
    reportConversion: reportConversion,
    gtagSendEvent: gtagSendEvent
  };

})(window, document);
