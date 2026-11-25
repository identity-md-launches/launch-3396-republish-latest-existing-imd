import { CANONICAL_ORIGIN } from "../config";
import { isLegacyHost, newAddressFor } from "../lib/origin";

/** Shown only on an earlier address: the same page on the new one is one tap away. */
export function MigrationNotice() {
  if (!isLegacyHost(location)) return null;
  return <p className="migration" role="note">
    <span>The IMD Daily has moved to <strong>{new URL(CANONICAL_ORIGIN).host}</strong>.</span>
    <a href={newAddressFor(location)}>Continue at the new address <span aria-hidden="true">→</span></a>
  </p>;
}
