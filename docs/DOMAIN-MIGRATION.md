# Moving The IMD Daily to https://imddaily.imd.site

Canonical address: **https://imddaily.imd.site/** (IMD site name `imddaily`, selected in the website
order). Previous working address: https://the-imd-daily-free-to-read-colle.sites.imd.fun/ (also
`the-imd-daily.sites.imd.fun`). The older plan for `daily.imd.fun` is superseded and never resolved.

The IMD publishing plane pins the committed `dist/` to IPFS and assigns it the `imddaily` name after
this job is accepted. This job does not run a publishing command itself.

## Observed while building this revision (2026-11-25)

| Check | Result |
| --- | --- |
| `https://imddaily.imd.site/` | HTTPS valid (curl verify result 0), HTTP **404 "No such site"**: name not yet assigned when this revision was built |
| Old address | HTTP 200, serves `assets/index-Da7vgc1m.js` = commit `30a8f76` export = IPFS `bafybeicu3oucpw5tt7aahmdxmuhafevis2do72hhndouxf25sb6emgmwpa` |
| Upload service `/health` | 200 `{"ok":true,"version":"1.0.0","publicFileOrigin":"https://the-imd-daily.duckdns.org"}` |
| CORS preflight, `Origin: https://the-imd-daily-free-to-read-colle.sites.imd.fun` | allowed (`access-control-allow-origin` echoed) |
| CORS preflight, `Origin: https://imddaily.imd.site` | **not allowed** (204 without `access-control-allow-origin`) |

## What the export does on each host

- **On imddaily.imd.site:** `canonical`, `og:url`, `og:image` and `twitter:image` in `web/index.html`
  point here. The runtime canonical link is `https://imddaily.imd.site` + path.
- **On a previous address** (`LEGACY_ORIGINS` in `web/src/config.ts`): a one-line notice above the
  masthead links to the same path, query and `#/` route on the new address. The page also loads
  `https://imddaily.imd.site/favicon.png`. If that returns this site's 48×45 favicon within 2.5 s
  *and the visitor has not yet pressed, tapped, scrolled with the wheel or typed*, the page is
  replaced by the same route on the new address. A reader who has started reading is never moved.
  The publisher desk (`#/publisher`) and any URL with `?stay` are never redirected.
- **On an IPFS gateway path:** no notice, no redirect; the canonical link is `https://imddaily.imd.site/`.

This only reaches visitors of the old address if the old name serves this export. Old-site changes
that could not be applied by this job: a server-side 301 and repointing the old name, because this
job has no gateway access.

## Pending owner and administrator actions

1. **Assign the name (IMD plane).** Publish this commit's `dist/` as `imddaily`, then confirm
   `curl -I https://imddaily.imd.site/` returns 200 with a valid certificate and serves the same
   `assets/index-*.js` named in `dist/index.html`.
2. **Old address (IMD gateway administrator, optional).** Prefer a server-side 301 from
   `the-imd-daily-free-to-read-colle.sites.imd.fun` to `https://imddaily.imd.site` with path and
   query kept, excluding nothing (hash routes travel with the browser). Without one, repointing the
   old name to this export enables the notice and the guarded browser-side redirect.
3. **Upload service (publisher, PENDING).** On the VPS behind `https://the-imd-daily.duckdns.org`,
   in `server/.env`, add the exact new origin and keep the old ones, then restart:

   ```
   ALLOWED_ORIGINS=https://imddaily.imd.site,https://the-imd-daily-free-to-read-colle.sites.imd.fun,https://the-imd-daily.sites.imd.fun
   ```

   ```sh
   cd server && docker compose up -d
   curl -si -X OPTIONS -H 'Origin: https://imddaily.imd.site' -H 'Access-Control-Request-Method: POST' \
     https://the-imd-daily.duckdns.org/api/auth/challenge | grep -i access-control-allow-origin
   ```

   The grep must print `access-control-allow-origin: https://imddaily.imd.site`. No wildcard:
   sign-in and uploads stay limited to the listed origins and the publisher wallet
   `0x48E4E74fE1d0c14404cEB57B9fec5b21329C6ec9`. The sign-in challenge binds the requesting origin
   (`URI:` line and domain in `server/src/app.mjs`), so no other wallet-authentication setting
   changes. `PUBLIC_FILE_ORIGIN` and stored files are unchanged; published PDF, cover and metadata
   URLs live on chain. Until this is done, the publisher desk on the new address says so and links
   to the desk on the previous address, which keeps working.

Browser storage is per origin: visitors on the new address reconnect their wallet once, and the
publisher re-saves a custom upload-service origin only if one was saved on the old address.
