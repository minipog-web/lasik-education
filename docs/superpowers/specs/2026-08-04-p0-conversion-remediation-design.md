# P0 Conversion Remediation Design

**Status:** Approved

## Scope

Repair the landing page defects identified in the conversion audit without altering the wider content strategy.

## Design

### Responsive layout

Add a small, consolidated mobile override block in `index.html`. At viewports up to 600px, constrain dynamic sections to the viewport, stack their two-column grids, and let the science tabs scroll horizontally inside their own container rather than widening the document. The body must not horizontally scroll at 390px.

### Static fallback

The static HTML remains in `#root` so a no-JavaScript visitor sees useful content. After JavaScript loads, the existing application replaces `#root`; the external static H1 and static shell are removed/hidden so content is not duplicated. A body class is set only after the application has successfully mounted.

### Lead submission

The micro-commitment form enters a submitting state with a disabled button and status message. It moves to confirmation only after `fetch()` resolves with `response.ok`. A failed response or network error retains entered values, re-enables submission, and presents an inline retry plus the practice phone number. The error uses an `aria-live` region.

### Candidacy language

The screener is explicitly educational. It may summarize the visitor's stated needs, but it cannot declare candidate probability, a clinical result, or a reserved diagnosis. Final messaging directs visitors to a comprehensive consultation for candidacy determination.

## Acceptance Criteria

- At a 390px viewport, `document.documentElement.scrollWidth` is no greater than `innerWidth`.
- Only one visible primary page is rendered with JavaScript enabled; no static fallback repeats after the footer.
- Form confirmation is never displayed after non-2xx or rejected requests.
- Failure preserves field values and offers an accessible, actionable recovery state.
- The lead flow contains no language suggesting it determined candidacy.
