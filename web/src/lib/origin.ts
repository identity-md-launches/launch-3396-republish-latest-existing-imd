import { CANONICAL_ORIGIN, LEGACY_ORIGINS } from "../config";

type Loc = Pick<Location, "hostname" | "pathname" | "search" | "hash">;

const host = (origin: string) => new URL(origin).hostname;

/** True on one of the earlier addresses that served this newspaper. */
export function isLegacyHost(loc: Pick<Location, "hostname">): boolean {
  return LEGACY_ORIGINS.some((o) => host(o) === loc.hostname);
}

/** The same page on the new address: path, query and `#/` route kept. */
export function newAddressFor(loc: Loc): string {
  return `${CANONICAL_ORIGIN}${loc.pathname}${loc.search}${loc.hash}`;
}

/**
 * Where a visitor on a legacy address should go, keeping path, query and hash route, or null to stay.
 * The publisher desk stays on the legacy address: the upload service authorises origins one by one and
 * the new origin must be added there before a publisher can sign in from it.
 */
export function legacyRedirectTarget(loc: Loc): string | null {
  if (!isLegacyHost(loc)) return null;
  if (/^#\/?publisher(\/|$)/.test(loc.hash)) return null;
  if (new URLSearchParams(loc.search).has("stay")) return null;
  return newAddressFor(loc);
}

/**
 * The address search engines and shares should use for the page being viewed. Routes are hash routes
 * on one page, so on any other host (an IPFS gateway path, a preview) the canonical page is the root.
 */
export function canonicalFor(loc: Loc): string {
  const known = loc.hostname === host(CANONICAL_ORIGIN) || isLegacyHost(loc);
  return `${CANONICAL_ORIGIN}${known ? loc.pathname : "/"}`;
}

/** The new host proves it serves this export by returning our 48×45 favicon over valid HTTPS. */
export const PROBE_SIZE = { width: 48, height: 45 } as const;

/** How long the start-up probe may take before the visitor is left on the page with a notice. */
export const PROBE_TIMEOUT_MS = 2500;

function probeCanonical(timeoutMs = PROBE_TIMEOUT_MS): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    const done = (ok: boolean) => { clearTimeout(t); img.onload = img.onerror = null; resolve(ok); };
    const t = setTimeout(() => done(false), timeoutMs);
    img.onload = () => done(img.naturalWidth === PROBE_SIZE.width && img.naturalHeight === PROBE_SIZE.height);
    img.onerror = () => done(false);
    img.src = `${CANONICAL_ORIGIN}/favicon.png?probe=${Date.now()}`;
  });
}

const INTERACTIONS = ["pointerdown", "keydown", "wheel", "touchstart"] as const;

/**
 * Runs once at start-up. Reading is never blocked: the page renders while the probe runs. The redirect
 * happens only if the new host answers before the visitor has touched the page, so nobody is moved
 * away from a PDF they have started reading; otherwise the migration notice in the header stays.
 */
export function startOriginTransition() {
  const link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (link) link.href = canonicalFor(location);
  if (!legacyRedirectTarget(location)) return;
  let touched = false;
  const onTouch = () => { touched = true; };
  INTERACTIONS.forEach((e) => addEventListener(e, onTouch, { once: true, passive: true, capture: true }));
  void probeCanonical().then((ok) => {
    INTERACTIONS.forEach((e) => removeEventListener(e, onTouch, { capture: true }));
    const target = ok && !touched && legacyRedirectTarget(location);
    if (target) location.replace(target);
  });
}
