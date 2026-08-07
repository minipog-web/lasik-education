# P0 Conversion Remediation Implementation Plan

> **For agentic workers:** Execute inline in this session. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate P0 mobile, rendering, form-reliability, and candidacy-language defects.

**Architecture:** Keep the existing single-page HTML/vanilla JavaScript architecture. Add small scoped CSS and defensive state handling to the current micro-commitment flow.

**Tech Stack:** HTML, CSS, vanilla JavaScript, local HTTP server, browser automation.

---

### Task 1: Correct rendering and mobile containment

**Files:**
- Modify: `index.html`

- [x] Hide the static server fallback only after JavaScript successfully mounts the app.
- [x] Add a max-600px responsive block that makes injected grids one column and contains tab overflow.
- [x] Verify with a 390px browser viewport that page scroll width does not exceed viewport width.

### Task 2: Make form outcomes truthful and recoverable

**Files:**
- Modify: `index.html`

- [x] Change the submit handler to await `fetch()` and require `response.ok`.
- [x] Render submitting and error states without erasing user data.
- [x] Verify both a success response and a forced error response.

### Task 3: Make screener language non-diagnostic

**Files:**
- Modify: `index.html`

- [x] Replace diagnostic probability, report, and reservation language with an educational summary and consultation next step.
- [x] Verify the rendered flow contains no clinical conclusion.
