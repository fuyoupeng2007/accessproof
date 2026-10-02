# Verification

Final polish 3.0.1: 19/19 synthetic browser tests; actual axe-core 4.13.0 comparison repeated on ten overlapping-rule fixtures after a placeholder-classification correction, with 10/10 barrier-classification agreement. Separate educational review prompts remain. See devpost/AXE-COMPARISON.md for boundaries and findings. No overall competitor performance or coverage equivalence claimed.

2026-10-02, actual local Chromium DOM parsing. Baseline 5/12; version 2 12/12 fixed cases; version 3 18/18 including six additional review and import cases. See tests.js for every fixture and assertion.

Browser journey: broken sample scan; human note and reviewed flag restored after reload; unrelated new source issue retains stable reviewed evidence; changed evidence invalidates previous review; disappearance/new/retained counts shown; real Markdown/JSON downloads saved and checked; JSON imports rederive findings rather than trusting reported rules; language switching retains notes; stale source disables export; invalid/oversized import produces feedback. Injection/resource probe showed no executed source script and zero requests to source image/iframe URLs. Mobile viewport/document width 390/390 and desktop 1440/1440, no page errors. Print media inspected; OS print/PDF dialog not automated. Direct file URL exercised. QA files ignored from source distribution.

No full accessibility compliance, paid competitor trial, screen-reader user study, security audit or real-user impact measurement is claimed.
