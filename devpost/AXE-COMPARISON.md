# Actual comparison with axe-core 4.13.0

2026-10-02, Chromium. The same ten controlled synthetic HTML fixtures were scanned by AccessProof as detached source and by axe in a rendered browser document. External fixture requests were blocked. Axe was run with seven overlapping rules: image-alt, label, button-name, link-name, frame-title, document-title, html-has-lang. This comparison excludes contrast, other axe rules and runtime behavior; it is not an overall accuracy or coverage comparison.

| Fixture | AccessProof before polish | axe violation for corresponding rule | Final classification |
| --- | --- | --- | --- |
| Missing image alt | Barrier | Yes | Barrier |
| Decorative empty alt | None | No | None |
| Placeholder-only input | Barrier | No | Review prompt |
| Empty label/input | Barrier | Yes | Barrier |
| aria-labelledby text | None | No | None |
| Hidden ancestor controls | None | No | None |
| Empty button | Barrier | Yes | Barrier |
| Image-named button | None | No | None |
| Empty link | Barrier | Yes | Barrier |
| Untitled iframe | Barrier | Yes | Barrier |

The initial binary barrier classification agreed on 9/10. The mismatch led to a real correction: placeholder-only controls now receive a persistent-label review prompt, since a placeholder can contribute a name while disappearing during use. The repeated barrier-only classification comparison agrees on 10/10 for this narrow synthetic set, while AccessProof retains its separate educational prompt. No axe findings were incomplete for these selected corresponding rules in this run.

Test-only axe package was obtained from npm and remains in ignored qa/. It is not bundled with the application. [Official axe documentation](https://github.com/dequelabs/axe-core), [W3C labeling guidance](https://www.w3.org/WAI/tutorials/forms/labels/). This complements the documentation comparisons with Pa11y and WAVE, whose applications were not executed.
