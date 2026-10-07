# Domain Glossary (Marano Eye Care Portal)

This glossary documents the authoritative domain language, seams, and module concepts for the Marano Eye Care custom LASIK web architecture.

---

## Architecture Vocabulary

- **Module**: A coherent unit of software encapsulating behavior behind a defined interface.
- **Interface**: The narrow, testable surface through which a module is invoked and verified.
- **Depth**: The ratio of encapsulated implementation complexity to interface surface area. Deep modules have simple interfaces hiding significant work.
- **Seam**: A clean boundary where behavior can be observed, intercepted, or substituted without modifying callers.
- **Adapter**: A translation boundary between a module's interface and an external dependency or service (e.g. GA4, Google Ads, CallRail).
- **Leverage**: The multiplier achieved when multiple callers consume a single deepened interface.
- **Locality**: The principle that state, logic, and configuration needed to understand and alter a behavior reside in one place.
- **The Deletion Test**: If deleting a module concentrates complexity rather than scattering it, the module was shallow. Deep modules absorb and organize complexity.

---

## Domain Models & Seams

### 1. Telemetry & Conversion Engine (`assets/telemetry.js`)
- **Interface**: `window.MaranoTelemetry` (`track()`, `reportConversion()`, `reportLead()`, `setMockMode()`) and declarative HTML attributes (`data-track`, `data-track-category`).
- **Primary Google Ads Account**: `AW-18197167741` (campaign remarketing & traffic tracking).
- **Conversion Google Ads Account**: `AW-17962563730` (conversion goals: `IsEZCL66_dscEJLxm_VC` for appointments, `P12NCJ6IgdwcEJLxm_VC` for lead forms).
- **GA4 Measurement**: `G-71SK3LQF49`.
- **Google Tag Container**: `GT-WKTZM5GN`.
- **Enhanced Conversions**: Normalizes patient contact parameters (first name, last name, phone, email) into SHA-256 compliant user data objects.
- **De-duplication Guard**: Prevents double-firing conversion beacons when form events and fetch requests fire concurrently.
- **Mock Test Adapter**: In-memory test harness enabled via `MaranoTelemetry.setMockMode(true)` allowing automated headless verification without external network pings.

### 2. Candidacy Diagnostic & Consultation Engine (`assets/diagnostic-consultation.js`)
- **Module**: Candidacy Diagnostic Screener & Consultation Flow (`#quiz`, `#adaptive-quiz-container`, `#hero-mc-card`).
- **Interface**: `window.MaranoDiagnostic` (`initQuiz()`, `initConsultation()`, `evaluateCandidacy()`, `setMockMode()`).
- **Encapsulated Implementation**: 60-Second adaptive candidacy qualification scoring, phone normalization, multi-step booking state machine, and in-memory test harness.
- **Domain Purpose**: Evaluates age, prescription stability, corneal history, and timeline, producing preliminary qualification and funneling qualified candidates into direct surgical consultation booking.

### 3. Biometric Optical Simulation Suite
- **Module**: Night-driving wavefront simulator (`assets/vision-simulator.min.js`) and 3D Pentacam corneal topography visualizer (`assets/corneal-topography.js`).
- **Interface**: `window.MaranoOptical` (ablation depth calculations, Zernike aberration evaluations, and refractive ray-tracing models) and `window.initCornealTopography()`.
- **Domain Purpose**: Demonstrates higher-order aberration (HOA) correction (20/15 vs. 20/20) and cold excimer photoablation mechanics across both 3D Pentacam corneal topography and 2D refractive ray-tracing visualizers.

### 4. Multi-Page Educational Portal
- **`index.html`**: Flagship conversion-optimized landing page with retained high-engagement tools (Quiz, Vision Simulator, ROI Calculator).
- **`/technology.html`**: WaveScan® 3D Iris aberrometry, cold UV excimer laser physics, and corneal biophysics.
- **`/procedure-journey.html`**: 5-stage CustomVue procedural breakdown and 24-hour hour-by-hour recovery scrubber.
- **`/surgeons.html`**: Surgical credentials of Dr. Matthew Marano & Dr. Sherief Raouf, hospital leadership, and the 5 Buyer Questions Dossier.
- **`/pricing-financing.html`**: All-inclusive transparent pricing, 0% APR financing terms, and pre-tax HSA/FSA savings models.
