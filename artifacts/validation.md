# Validation — The IMD Daily at https://imddaily.imd.site/ (2026-11-25)

Worker report. The verifier (profile `none`) checks paths and bytes only; nothing here is an
independent certification.

## 1. Scope, starting point and assumptions

- **Latest version identified.** Update job `b824bf82-6fc0-4bcf-88c7-b023ebdeada1` (version 4 of 4)
  points at `identity-md-launches/launch-2368-the-imd-daily` PR #4. Its delivered commit is
  `30a8f76634cb97a6c5245177a32c50fb47e48e3a` (branch `identitymd/job-b824bf82`, equal to `main`). The job
  references no newer repository. Its published build is IPFS
  `bafybeicu3oucpw5tt7aahmdxmuhafevis2do72hhndouxf25sb6emgmwpa`. The gateway copy and the old address
  both serve `assets/index-Da7vgc1m.js`, the same file as `30a8f76:dist/`.
- **Reproduced before changing anything.** `npm ci && npm run build` on `30a8f76` produced a `dist/`
  byte-identical to the committed one (`diff -rq` empty).
- **Kept from that version:** the nav Subscribe item, homepage section, footer link, removed uppercase
  eyebrow, all design tokens, artwork, fonts, routes, reader, downloads, archive, My Collection,
  per-edition collecting, publisher desk, vault and About.
- **Unchanged:** contracts (`DAILY 0xb8fd…a9c5`, `VAULT 0x3343…23c0`, IMD `0xd34a…63b7`), ABIs
  (hash check below), chain 1, publisher `0x48E4E74fE1d0c14404cEB57B9fec5b21329C6ec9`, prices,
  windows, edition data and the upload service default `https://the-imd-daily.duckdns.org`.
- **Changed in this revision:**
  - `web/src/config.ts:58` `CANONICAL_ORIGIN = https://imddaily.imd.site`; adds `LEGACY_ORIGINS`.
  - `web/index.html:8-21` canonical, `og:url`, `og:image`, `twitter:image` → new address.
  - `web/src/components/SubscribeSection.tsx:8` exact requested description; `:17-21` Read / Collect /
    Subscribe list, shared with About.
  - `web/src/pages/About.tsx:12-15` "Read, collect or subscribe" explanation and Paper Route link.
  - `web/src/lib/origin.ts` adds a guarded redirect and fixes the canonical link on gateway paths.
  - `web/src/components/MigrationNotice.tsx` adds the notice for previous addresses only.
  - `web/src/pages/Publisher.tsx:80` adds a pending-`ALLOWED_ORIGINS` hint.
  - `web/src/styles.css:161-167`, `server/env.example`, `docs/DOMAIN-MIGRATION.md`,
    `docs/VPS_SETUP.md`, README, DESIGN.md.
  - `.gitignore` adds `node_modules/`. Its path budget is 0 bytes, because the rule only excludes.
- **Assumption:** the IMD plane publishes this `dist/` under the `imddaily` name after acceptance. No
  publishing command was run, per the delivery rules.

## 2. Deployment state (observed, not simulated)

| Check | Result |
| --- | --- |
| `https://imddaily.imd.site/` | TLS valid (curl `ssl_verify_result` 0), HTTP **404 "No such site"**: not yet assigned at build time |
| Old address | HTTP 200, still serves the `30a8f76` export (no notice; that build predates this one) |
| `https://paper-route.imd.site/` | HTTP 200, title "Paper Route" |
| Upload service `/health` | 200 `ok:true`, version 1.0.0 |
| CORS preflight from old origin | allowed |
| CORS preflight from `https://imddaily.imd.site` | **refused** (no `access-control-allow-origin`) → pending owner action |

Not done, because this job has no access: assigning the hostname, a server-side 301 on the old
host, repointing the old name, and changing the VPS `.env`. The exact steps are in
`docs/DOMAIN-MIGRATION.md`.

## 3. Commands and results (final source)

| Command (in `web/`) | Result | Output |
| --- | --- | --- |
| `npm run typecheck` (`tsc --noEmit`) | exit 0 | `artifacts/checks/typecheck.txt` |
| `npm test` (vitest) | 3 files, 20/20 tests | `artifacts/checks/web-tests.txt` |
| `npm run check:abi` | both ABI hashes match | `artifacts/checks/abi-check.txt` |
| `npm run build` | exit 0; `dist/index.html` uses `./assets/…`, `./favicon.png` | `artifacts/checks/build.txt` |
| `node .imd/reads/skills/design-critic/scripts/taste.mjs --out test/scratch/taste` | **16/16** pass (render, layout, targets, contrast, casing, tracking, eyebrows, type-sizes, type-faces, glyphs, slogans, repetition, copy-budget, chrome, motion, share) | `artifacts/checks/taste.json` |
| Headless Chromium interaction script (Playwright 1.x, `test/scratch/interact.mjs`) | **61/61** pass | `artifacts/checks/browser-results.json` |

The other `artifacts/checks/*` files (caddy, restore, server-tests, export-integrity, reproduced-*,
submission-budget) and the older `artifacts/browser/*` images come from earlier revisions and were
not re-run. Server code is unchanged. The stale earlier-revision screenshot `artifacts/browser/front-empty-390.png` (empty-archive state, no longer reachable with 34 live editions) was removed to keep the listed screenshots within their 1 MiB budget.

### Interaction script

The committed `dist/` is served under `https://imddaily.imd.site` and the old host by Playwright
request interception. Chain reads (public RPCs), PDFs and covers on the VPS, and Paper Route stay
live. It is read-only: no signature, transaction or upload. Per width (1440, 390, 320):

- head metadata: canonical, `og:url`, `og:image` on the new address; relative favicon
- no notice on the new address
- the header Subscribe item is visible and on screen
- every `paper-route` link (≥3 per page) is exactly `https://paper-route.imd.site/`, `_blank`,
  `rel="noopener noreferrer"`
- the section heading, description and button copy match the brief exactly; the list is
  Read / Collect / Subscribe; the section sits below the edition introduction; no prices other than
  the onchain 0.1 IMD, and no renewal, guarantee or cancellation wording
- clicking the button opens a new tab at exactly `https://paper-route.imd.site/`
- no horizontal overflow
- direct load + reload of `#/archive`, `#/collection`, `#/about`, `#/vault`, `#/publisher`,
  `#/issue/1` and an unknown route (Page not found)
- About lists Read / Collect / Subscribe and has one Paper Route link
- the archive shows **34 real editions**, and search filters to 0 on nonsense input
- 1440 and 390 only: the wallet sheet opens without connecting (Browser wallet / Coinbase Wallet;
  "Reading and downloads never need a wallet") and closes on Escape
- 1440 and 390 only: the PDF reader renders a canvas and Next moves page 1 → 2
- 1440 only: Download PDF saves `imd-daily-34.pdf`, 3,110,643 bytes, starting with `%PDF-`
- no page errors

Legacy-host behaviors:

- probe fails → stays, notice links to `https://imddaily.imd.site/#/archive`
- probe succeeds, untouched → `https://imddaily.imd.site/?ref=x#/issue/1`
- probe succeeds but the reader pressed a key or clicked first → stays
- `#/publisher` is never redirected
- the publisher desk on the new origin shows the `ALLOWED_ORIGINS` hint and a link to the old desk

Known non-2xx on both origins, identical before this change: public RPCs refuse wide `eth_getLogs`
ranges (publicnode 403 "Archive requests require a personal token", drpc 400 "ranges over 100
blocks"). `indexPublications` (`web/src/lib/issues.ts:85`) halves its range and editions still load
through direct reads. Also expected, and pending: `/health` on the upload service is CORS-blocked
from the new origin.

Screenshots: `artifacts/browser/390.png` (1x) and `artifacts/browser/1440.png` (0.6x device scale, to fit the screenshot budget) are first screens on the new
origin. At 390 px the nameplate, nav with Subscribe, the latest cover and **Read the edition** are
visible. More screenshots (subscribe section, About, legacy notice, reader, wallet sheet, routes)
were viewed in `test/scratch/interact/`, which is not submitted.

### Wallet-dependent checks (not performed; need the publisher's or a collector's wallet)

These were not performed:

- connecting a real wallet and switching networks
- approve + mint of a copy (real funds)
- vault withdrawal (publisher only, real funds)
- publisher sign-in (wallet signature) and upload from the new origin, which is also blocked until
  `ALLOWED_ORIGINS` is updated
- publishing an edition

The collection and vault code is unchanged from `30a8f76`. Earlier revisions covered it with fixture
tests (`web/scripts/validate-revision.mjs`); those were not re-run here.

## 4. Better Interface review (pinned `.imd/reads/skills/better-interface/REFERENCE.md`)

**Scope:** changed surfaces and their shared components: header nav, homepage subscription section,
About, footer, migration notice, publisher-desk hint and the origin transition. Unchanged surfaces
were re-checked only through the probe and the interaction script.

**Browser:** no `browser` tool was provided. Rendered checks used Playwright headless Chromium
scripts plus screenshots I viewed myself.

| Domain | Status | Evidence |
| --- | --- | --- |
| Accessibility | Checked | Native `<a>`/`<dl>`/`<p role="note">`; visually hidden "(opens Paper Route in a new tab)" on every external subscribe link (`SubscribeLink.tsx:6`); notice link `min-height: 44px` (`styles.css:164`); probe `targets` pass; wallet sheet Escape close verified. Not verified: screen-reader session, native 200% zoom, forced colors. |
| Layout | Checked | Section below edition strip, About list single column (`styles.css:165-166`, logical `border-inline-start`); no overflow at 320/390/1440; notice wraps centered at 390 (viewed). Not verified: RTL, intermediate widths 760–1100 for this revision. |
| Writing | Checked | Brief copy verbatim; options named Read / Collect / Subscribe in both places; terms consistent ("Subscribe via Paper Route"). |
| Typography | Checked | Reuses `.h-section`, `.h-sub`, `--fs-small`; no new sizes (probe `type-sizes`, `type-faces` pass). |
| Colors | Checked | Only existing tokens. Notice on `--color-frame` `#070D10` (`.paper` has no background): ink-soft 9.56:1, cyan link 10.21:1, ink 17.18:1, computed from the opaque token values; probe `contrast` pass on the page. |
| UI | Checked | Existing `.btn`, `.text-link` states reused; no new motion; notice has no hover-only affordance. |

### Findings and fixes

| # | Severity | Location | Evidence | Fix / recheck |
| --- | --- | --- | --- | --- |
| 1 | MEDIUM | `web/src/lib/origin.ts:55-74` (was a 5 s probe with no guard) | Previous critic finding, reproduced in script: the legacy host could `location.replace` a reader after reading started | Redirect only if the probe succeeds within 2.5 s **and** no pointerdown/keydown/wheel/touchstart; the notice remains otherwise. Rechecked: "reader already interacting → no redirect" pass |
| 2 | LOW | `web/src/components/SubscribeSection.tsx:20` (was "asks for no signature, approval or payment") | Previous critic finding: reads as denying the signatures the collect flow requires | Replaced with neutral Paper Route wording; recheck by copy assertion |
| 3 | MEDIUM | `web/src/components/SubscribeSection.tsx:8` | Description differed from the brief's copy | Exact brief text; asserted at 3 widths |
| 4 | MEDIUM | `web/src/pages/About.tsx:12-15` | About had no subscription explanation | Added the shared Read / Collect / Subscribe list and link; asserted |
| 5 | LOW | `web/src/lib/origin.ts:33` | On an IPFS gateway, canonical became `<old host>/ipfs/<cid>/`, a URL that does not exist | Canonical is `https://imddaily.imd.site/` off-host; unit test |
| 6 | MEDIUM | `web/src/pages/Publisher.tsx:80` | On the new origin, the desk said only "not answering its health check" (CORS refusal, observed) | Hint names `ALLOWED_ORIGINS` and links to the old desk; asserted + screenshot viewed |

Remaining limitations:

- the real hostname was not visited serving this build
- WebKit, physical devices and screen readers were not tested
- the wallet actions listed above were not performed

## 5. Pending owner actions

1. IMD plane: assign `imddaily` to this commit's `dist/`, then confirm HTTPS 200 and that
   `assets/index-*.js` matches.
2. Gateway administrator (optional): 301 from the old host, or repoint the old name to this export.
3. **Publisher (pending):** set `ALLOWED_ORIGINS=https://imddaily.imd.site,https://the-imd-daily-free-to-read-colle.sites.imd.fun,https://the-imd-daily.sites.imd.fun`
   in the VPS `server/.env`, run `docker compose up -d`, then run the curl check in
   `docs/DOMAIN-MIGRATION.md`.

## 6. Completion

**Complete for the stated scope** of source, export and local validation. **Deployment is
incomplete:** the hostname and the upload-service origin are pending, and wallet actions are untested.
