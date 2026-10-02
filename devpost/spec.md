---
doc: spec
status: draft
---
# AccessProof specification

HTML/CSS/plain JavaScript. A detached HTML template holds parsed input; content is queried but never mounted. Element evidence is rendered with textContent, not inserted as source HTML. Rules identify document metadata, alt attributes, form/button names and structural prompts. Input bounded to 100,000 characters; notes to 3,000. No external API, dependency or asset. Optional Node loopback server on 4318 serves an allowlist.

Report model: version, language, original source, findings with stable key/rule/severity/title/explanation/fix/evidence/location, human review flag and note. Derived findings are recomputed on restore/import. Changed evidence invalidates old review. Markdown contains evidence and suggested repair patterns; JSON supports portable review. Previous scan allows comparison while local persistence retains editor source separately for stale-export detection.

Verification uses actual Chromium DOM parsing in tests.html, a fixed synthetic regression set and interactive browser scenarios. No Node DOM implementation or simulated WCAG conformance claim.

Development began 2026-10-02. Codex assisted with all application code, examples, design and documentation. No existing third-party project code was copied; official skill structures and accessibility guidance were consulted, not redistributed.
