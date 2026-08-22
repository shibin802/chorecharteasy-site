# Design QA — split workbench homepage

## Comparison target

- Source visual truth: `C:\Users\shibi\.codex\generated_images\01a02507-2c70-7a83-98df-db6408191aab\exec-49295701-6a61-4014-bb52-a14b1564609f.png`
- Desktop implementation: `C:\Users\shibi\Documents\Codex\2026-08-21\ni\work\product-design-audit-20260822\19-workbench-desktop-final.png`
- Mobile implementation: `C:\Users\shibi\Documents\Codex\2026-08-21\ni\work\product-design-audit-20260822\20-workbench-mobile-final.png`
- Full-view comparison: `C:\Users\shibi\Documents\Codex\2026-08-21\ni\work\product-design-audit-20260822\21-source-vs-implementation-final.png`
- Focused comparison: `C:\Users\shibi\Documents\Codex\2026-08-21\ni\work\product-design-audit-20260822\22-source-vs-implementation-focused.png`
- State: default Weekly starter, ages 5–6, US Letter, no print dialog open.

## Viewport and normalization

- Requested desktop CSS viewport: 1440 × 1024 at device scale factor 1. In-app browser content capture: 1425 × 1013 pixels after browser scrollbar/chrome reservation.
- Source pixels: 1487 × 1058. Implementation pixels: 1425 × 1013.
- Full-view comparison normalized both images to 720 × 512 panels on one 1440 × 544 canvas.
- Focused comparison cropped the first-workbench region from each source and normalized both to 720 × 315 panels.
- Requested mobile CSS viewport: 390 × 844. In-app browser content capture: 375 × 812 pixels.

## Findings

No actionable P0, P1, or P2 mismatches remain.

- Fonts and typography: the selected mock's editorial serif hero is reproduced with Georgia while the existing Bricolage Grotesque and Atkinson Hyperlegible system remains in the header, controls, and chart. Final headline wrapping is three lines at desktop and remains readable on mobile.
- Spacing and layout rhythm: the split boundary, left narrative rail, quick-start row, editor title, chart grid, and compact bottom notice follow the source proportions. The optional-settings disclosure adds a small intentional row so the existing nickname and multiple-kids functions remain available.
- Colors and tokens: the implementation retains the source-aligned warm canvas, dark ink, teal, coral, mustard, and ruled green-gray borders using the existing project tokens.
- Image quality and asset fidelity: the existing real logo asset is retained. The source contains no raster hero imagery. Existing line icons are reused; no placeholder imagery was introduced.
- Copy and content: core promises remain intact: free, no sign-up, ages 3–12, editable tasks, and Letter/A4 printing. Starter labels are adapted to the real product's Weekly, Morning, Blank, and Multiple Kids modes.
- Responsiveness: the mobile first viewport now reaches the age selector and starter heading; the proof list is removed from the narrow first screen to avoid delaying the product experience. The consent notice remains dismissible and its close target is 44 × 44 pixels.
- Accessibility: semantic headings, landmarks, labels, pressed states, live status, table caption, checkbox labels, focus styles, and 44-pixel critical touch targets remain present.

## Comparison history

1. First implementation pass
   - Earlier P1: mobile first view still ended before the maker controls.
   - Fix: compressed the hero, shortened supporting copy, removed repeated benefit rows from the narrow first screen, and brought the age selector into the initial viewport.
   - Evidence after fix: `20-workbench-mobile-final.png`.
   - Earlier P2: the consent close target was 32 pixels and the feedback control competed with or sat behind the consent notice.
   - Fix: increased the close target to 44 pixels, tightened the mobile notice, moved the desktop feedback trigger above it, and hides the feedback trigger on mobile until the notice is closed.

2. Source-alignment pass
   - Earlier P1: the hero used the existing sans display face and the four-button age selector occupied two rows, drifting from the selected mock.
   - Fix: added the editorial serif hero treatment and a compact native age selector while preserving the real age-band behavior.
   - Earlier P2: the optional settings row pushed the editor farther down than the source.
   - Fix: reduced the disclosure row to a compact single line.
   - Post-fix evidence: `21-source-vs-implementation-final.png` and `22-source-vs-implementation-focused.png`.

## Primary interactions tested

- Changed age from 5–6 to 7–9 and created the selected starter.
- Edited the chart title.
- Checked a weekday task box.
- Opened and closed print preview and confirmed the edited title carried into the print sheet.
- Checked browser console warnings and errors; none were present.

## Follow-up polish

- P3: the source mock shows three rows and a mustard note, while the real product keeps five age-based starter rows and an explicit `Create this draft` action. These are intentional functional differences.

## Implementation checklist

- [x] Split hero and workbench match the selected direction.
- [x] Core chart creation, editing, local draft, and print flow work.
- [x] Desktop and mobile layouts verified in the in-app browser.
- [x] Consent and feedback controls do not obstruct the primary mobile task.
- [x] Automated repository checks pass.

final result: passed
