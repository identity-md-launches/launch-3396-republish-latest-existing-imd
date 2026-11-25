import { describe, expect, it } from "vitest";
import { canonicalFor, isLegacyHost, legacyRedirectTarget, newAddressFor } from "../src/lib/origin";
import { CANONICAL_ORIGIN, LEGACY_ORIGIN, LEGACY_ORIGINS, SUBSCRIBE_URL } from "../src/config";

const at = (href: string) => { const u = new URL(href); return { hostname: u.hostname, pathname: u.pathname, search: u.search, hash: u.hash }; };

describe("domain transition", () => {
  it("keeps the exact requested addresses", () => {
    expect(CANONICAL_ORIGIN).toBe("https://imddaily.imd.site");
    expect(LEGACY_ORIGIN).toBe("https://the-imd-daily-free-to-read-colle.sites.imd.fun");
    expect(LEGACY_ORIGINS).toContain("https://the-imd-daily.sites.imd.fun");
    expect(SUBSCRIBE_URL).toBe("https://paper-route.imd.site/");
  });
  it("maps legacy paths, queries and hash routes to the new origin", () => {
    expect(legacyRedirectTarget(at(`${LEGACY_ORIGIN}/`))).toBe("https://imddaily.imd.site/");
    expect(legacyRedirectTarget(at(`${LEGACY_ORIGIN}/?ref=x#/read/1`))).toBe("https://imddaily.imd.site/?ref=x#/read/1");
    expect(legacyRedirectTarget(at(`${LEGACY_ORIGIN}/index.html#/issue/1`))).toBe("https://imddaily.imd.site/index.html#/issue/1");
    expect(legacyRedirectTarget(at(`${LEGACY_ORIGIN}/#/archive`))).toBe("https://imddaily.imd.site/#/archive");
    expect(legacyRedirectTarget(at("https://the-imd-daily.sites.imd.fun/#/collection"))).toBe("https://imddaily.imd.site/#/collection");
    expect(newAddressFor(at(`${LEGACY_ORIGIN}/#/publisher`))).toBe("https://imddaily.imd.site/#/publisher");
  });
  it("never redirects elsewhere, the publisher desk, or an explicit stay", () => {
    expect(legacyRedirectTarget(at("https://imddaily.imd.site/#/read/1"))).toBeNull();
    expect(legacyRedirectTarget(at("https://daily.imd.fun/#/read/1"))).toBeNull();
    expect(legacyRedirectTarget(at("https://gateway.example/ipfs/cid/#/"))).toBeNull();
    expect(legacyRedirectTarget(at(`${LEGACY_ORIGIN}/#/publisher`))).toBeNull();
    expect(legacyRedirectTarget(at(`${LEGACY_ORIGIN}/?stay=1#/read/1`))).toBeNull();
    expect(legacyRedirectTarget(at(`${LEGACY_ORIGIN}/#/publishers-guide`))).not.toBeNull();
    expect(isLegacyHost(at("https://imddaily.imd.site/"))).toBe(false);
  });
  it("names the canonical page on the new address for every host", () => {
    expect(canonicalFor(at("https://imddaily.imd.site/"))).toBe("https://imddaily.imd.site/");
    expect(canonicalFor(at(`${LEGACY_ORIGIN}/`))).toBe("https://imddaily.imd.site/");
    expect(canonicalFor(at("https://gateway.example/ipfs/cid/"))).toBe("https://imddaily.imd.site/");
  });
});
