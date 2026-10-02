# AccessProof

Offline HTML accessibility preflight for small community website teams. Paste source, inspect element evidence and repair patterns, record review decisions, rescan changed source, and export a portable review.

## Try it

Open index.html directly, or `npm start` then http://127.0.0.1:4318 (Node 20+ recommended). No npm install, runtime dependency, account or API key. Input stays in this browser. The source is parsed in a detached HTML template and never mounted; its scripts and resources are not loaded.

Choose the broken sample, check source, write a decision and mark it reviewed. Change one element and rescan: findings with unchanged evidence keep notes, changed evidence resets review. Choose the improved sample and rescan to see findings disappear. Export Markdown or JSON, or import the JSON to restore and recheck the review. Source changes block export until rescanned. Clear local work on shared devices.

## Scope

Document language/title, missing alt attributes, meaningful form/button/link names, frame names, duplicate identifiers, heading-order prompts and a main-landmark prompt. Hidden/inert ancestry and basic inline display/visibility are handled. Empty image alt is permitted for decoration; meaning must be reviewed by a person. Suggested repair patterns require adaptation and do not automatically rewrite source.

Review status means a local user has reviewed a finding; it does not mean the problem was fixed. Missing-source findings disappearing is a source comparison, not proof of accessibility. Every report includes manual keyboard, layout and screen-reader checks.

## Two further iterations

Version 1 baseline passed 5/12 fixed synthetic browser cases. Version 2 passed 12/12 after correcting hidden-content and label handling and adding structural prompts. Version 3 retained 12/12 and passed six additional persistence/import/comparison cases (18/18 total). Real browser checks cover actual downloads and import, refresh, English/Chinese, script/resource isolation and mobile width. [Comparison and iteration evidence](devpost/ITERATIONS.md).

Open tests.html or http://127.0.0.1:4318/tests.html to run the in-browser regression set. These are small handwritten examples, not a coverage/accuracy estimate. `node --check core.js`, app.js, server.cjs and tests.js verify syntax.

## Remaining limitations

This is a narrow static-source tool, not a WCAG conformance audit. It does not evaluate CSS classes, computed contrast, runtime JavaScript, shadow DOM, keyboard behavior, screen-reader announcements or content meaning. Name calculation is a documented subset, not the complete accessible-name algorithm. Source HTML metadata detection uses conservative token matching; malformed source can mislead it. Evidence is a browser-normalized excerpt up to 800 characters, not exact original line mapping. Identical duplicate elements can be hard to distinguish across revisions. Input limit is 100,000 characters, note limit 3,000, import limit 1 MB. Very large documents may exceed browser storage; export backups. Only Chromium was exercised, without a user usability study or broad compatibility certification.

## Provenance

Created 2026-10-02 under the user's instruction to build and publish multiple hackathon candidates. Codex assisted with all code, design, documentation and fictional samples. The official [Devpost Learn Skill Pack](https://github.com/challengepost/learn-ai-basics) structure was consulted for scope, PRD and specification; no learner interview or personal reflection is fabricated. Runtime is rule-based, not AI inference. No unrelated existing application code or third-party library is incorporated. [W3C WAI guidance](https://www.w3.org/WAI/tutorials/forms/labels/) and official axe/Pa11y/WAVE documentation informed the comparison; no competitor account or performance trial is claimed. Formal contest entry requires a Devpost receipt.

License: MIT.
