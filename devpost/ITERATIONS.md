# Comparison and measured iterations

Official documentation comparison, not trials of logged-in commercial products:

| Tool | Documented strength | AccessProof boundary / lesson |
| --- | --- | --- |
| [axe-core](https://github.com/dequelabs/axe-core) | Browser testing engine with numerous accessibility rules, integration and incomplete findings for human review. | AccessProof has a small source-only rule set; avoid suggesting equivalent coverage or conformance. |
| [Pa11y](https://pa11y.org/) | CLI, dashboard, CI and repeated website testing. | Add revision comparison; no hosted scanning/CI claims. |
| [WAVE](https://wave.webaim.org/) | Browser/URL evaluation and human-review support; extensions handle dynamic and protected pages. | Keep educational element evidence and a real manual-check section. |

Form-label logic is grounded in the [W3C WAI labels tutorial](https://www.w3.org/WAI/tutorials/forms/labels/). Empty labels and unresolved aria-labelledby references need care; placeholders are not labels.

Version 1 baseline: six source checks, simple label lookup and position-based IDs. Fixed 12-case synthetic browser set created before iteration. Version 2 target: meaningful label resolution, hidden ancestry, image-button names, duplicate IDs, iframe titles and heading review. Version 3 target: stable evidence keys, review retention/invalidation, imported report reanalysis and before/after comparison. Results will be recorded after each completed iteration. No real-user or competitor performance experiment is claimed.

Baseline actually measured in Chromium: 5/12. Version-1 failures: hidden ancestors, resolved references, empty labels, image-only buttons, duplicate IDs, unnamed frames and heading-order prompts. These are regression evidence, not a statistical accessibility coverage estimate.

Version 2 measured 12/12 on the fixed set. Version 3 measured 18/18: the same 12 plus evidence-stable review retention, changed-evidence invalidation, forged-import reanalysis, disappearance comparison, exported human notes/source, and unquoted/commented language handling. Actual browser verified no source-script execution, zero source image/iframe requests, reload retention, no page errors and 390/390 mobile width. UI export/import checks are recorded in VERIFICATION.md.

Remaining shortcomings: static-name subset and inline-only visibility differ from real accessible-name/CSS behavior; no computed contrast, runtime/shadow DOM, live site monitoring or keyboard automation; normalized evidence excerpts have no exact source lines; duplicate identical nodes can shift identity. Manual review and actual rendered-page testing are still required. These capabilities remain strengths of the documented established products; this prototype does not replace them.
