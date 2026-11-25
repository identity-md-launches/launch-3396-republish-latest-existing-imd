import { SubscribeLink } from "./SubscribeLink";

/** Compact, in-flow subscription note that separates free reading, collecting and subscribing. */
export function SubscribeSection() {
  return <section className="subscribe" id="subscribe" aria-labelledby="subscribe-h">
    <div className="subscribe-copy">
      <h2 id="subscribe-h" className="h-section">Subscribe to The IMD Daily<span className="section-dot" aria-hidden="true">.</span></h2>
      <p>Follow the IMD ecosystem, one edition at a time. Subscriptions are available through Paper Route. Visit the subscription page to review current pricing, delivery details and terms.</p>
      <SubscribeLink className="btn btn-subscribe">Subscribe via Paper Route <span aria-hidden="true">↗</span></SubscribeLink>
    </div>
    <WaysToRead />
  </section>;
}

/** The three separate options, shared by the front page and About. */
export function WaysToRead() {
  return <dl className="ways">
    <div><dt>Read</dt><dd>Access the newspaper and its PDFs for free. No wallet, no account.</dd></div>
    <div><dt>Collect</dt><dd>Collect an individual edition with the existing onchain flow: 0.1 IMD per copy from your wallet on Ethereum, during that edition’s 24-hour window.</dd></div>
    <div><dt>Subscribe</dt><dd>Visit Paper Route to review and purchase a subscription. Its pricing, delivery details and terms are set on Paper Route’s own website.</dd></div>
  </dl>;
}
