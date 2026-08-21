import { products, type Product } from "./products";

function requireProduct(id: Product["id"]): Product {
  const product = products.find((entry) => entry.id === id);
  if (!product) {
    throw new Error(`${id} must remain in app/products.ts`);
  }
  return product;
}

const featured = requireProduct("trustdesk");

const CONTACT_EMAIL = "hello@fischerproductlab.com";

const metrics: Partial<Record<Product["id"], readonly [string, string, string, string]>> = {
  productpulse: ["WAU", "5,230", "Activation", "64.0%"],
  vulnboard: ["Risk score", "68", "SLA debt", "87 overdue"],
  portfoliohealth: ["Health", "69", "SLA risk", "8"],
  trustdesk: ["Open", "7", "Automation", "51%"],
  aurora: ["Lanes", "4", "Checks", "2 / 2"],
  agentops: ["Agents", "8", "Launch ready", "3"],
  programforge: ["Portfolio", "75", "Decisions", "4"],
  orrery: ["Surfaces", "5", "Patterns", "11"],
};

function productCta(product: Product) {
  return "ctaLabel" in product ? product.ctaLabel : "Open the demo";
}

function ShieldMark() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
      <path
        fill="currentColor"
        d="M8 1.4 13.2 3.2v4.4c0 3.1-2.2 5.7-5.2 6.9C5 13.3 2.8 10.7 2.8 7.6V3.2L8 1.4Z"
        opacity="0.22"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        d="M8 1.8 12.8 3.4v4.1c0 2.8-2 5.2-4.8 6.3C5.2 12.7 3.2 10.3 3.2 7.5V3.4L8 1.8Z"
      />
    </svg>
  );
}

function DocumentMark() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        d="M4.2 2.4h5.1L11.8 5v8.6H4.2V2.4Z"
      />
      <path fill="none" stroke="currentColor" strokeWidth="1.2" d="M9.2 2.5V5h2.5" />
    </svg>
  );
}

/**
 * Faithful in-page chrome of TrustDesk’s Northwind questionnaire —
 * published synthetic product surface, not a generic dashboard.
 * Queue figures are the verified TrustDesk metrics already shipped on this site.
 */
function TrustDeskWindow() {
  return (
    <div className="product-window overflow-hidden rounded-xl bg-canvas">
      <div className="flex items-center gap-3 border-b border-hairline bg-surface px-3 py-2.5">
        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-ivory/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-ivory/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-ivory/15" />
        </div>
        <div className="mx-auto flex h-7 max-w-md flex-1 items-center justify-center rounded-md border border-hairline bg-canvas px-3 font-mono text-[11px] tracking-normal text-ink-faint">
          trustdesk · questionnaires / qn-001
        </div>
      </div>

      <div className="flex min-h-[28rem] bg-canvas">
        <aside className="hidden w-44 shrink-0 border-r border-hairline bg-surface/40 p-3 sm:block">
          <div className="flex items-center gap-2 px-1 py-1">
            <span className="flex h-7 w-7 items-center justify-center rounded-md border border-gold/40 bg-gold/10 text-gold">
              <ShieldMark />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-tight text-ink">TrustDesk</span>
              <span className="text-[9px] uppercase tracking-[0.16em] text-ink-faint">FPL</span>
            </span>
          </div>
          <div className="mt-4 px-1 text-[9px] font-medium uppercase tracking-[0.16em] text-ink-faint">
            Trust Operations
          </div>
          <ul className="mt-2 space-y-0.5 text-[12px]">
            {["Dashboard", "Questionnaires", "Control Library", "Executive Brief"].map((label, i) => (
              <li
                key={label}
                className={`relative rounded-md px-2.5 py-1.5 ${
                  i === 1 ? "bg-surface-2 text-ink" : "text-ink-muted"
                }`}
              >
                {i === 1 && (
                  <span className="absolute top-1/2 left-0 h-3.5 w-0.5 -translate-y-1/2 rounded-full bg-gold" />
                )}
                {label}
              </li>
            ))}
          </ul>
          <dl className="mt-6 grid grid-cols-2 gap-2 border-t border-hairline px-1 pt-3">
            <div>
              <dt className="text-[9px] uppercase tracking-[0.14em] text-ink-faint">Open</dt>
              <dd className="mt-1 font-mono text-sm text-ivory">7</dd>
            </div>
            <div>
              <dt className="text-[9px] uppercase tracking-[0.14em] text-ink-faint">Automation</dt>
              <dd className="mt-1 font-mono text-sm text-ivory">51%</dd>
            </div>
          </dl>
        </aside>

        <div className="min-w-0 flex-1 space-y-4 p-4 sm:p-5">
          <header className="rounded-xl border border-hairline bg-surface p-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="text-xl font-semibold tracking-tight text-ink">Northwind Capital</h3>
              <span className="rounded-sm border border-review/40 bg-review/10 px-2 py-0.5 font-mono text-[10px] tracking-[0.12em] text-review uppercase">
                At Risk
              </span>
            </div>
            <p className="mt-1 text-[12px] text-ink-faint">qn-001 · Financial Services</p>
          </header>

          <article className="rounded-xl border border-hairline bg-surface p-4">
            <div className="min-w-0">
              <span className="text-[11px] tracking-wider text-ink-faint uppercase">
                Encryption &amp; Data Protection · q-001
              </span>
              <h4 className="mt-1 text-base font-semibold text-ink">
                Describe how customer data is encrypted at rest and in transit.
              </h4>
            </div>

            <div className="mt-4 rounded-lg border border-hairline bg-surface-2/40 p-3">
              <div className="flex items-center gap-2 text-[11px] tracking-wider text-ink-faint uppercase">
                <DocumentMark />
                Drafted response
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
                Customer data is encrypted at rest using AES-256 across all production data stores
                and backups, and in transit using TLS 1.2 or higher with legacy protocols disabled.
              </p>
            </div>

            <div className="mt-4">
              <h5 className="mb-2 text-[13px] font-medium text-ink">Mapped evidence</h5>
              <ul className="space-y-2">
                <li className="flex items-center justify-between gap-3 rounded-lg border border-hairline bg-surface-2/30 px-3 py-2">
                  <span className="min-w-0">
                    <span className="block font-mono text-[11px] text-gold-soft">SEC-ENC-001</span>
                    <span className="block truncate text-[13px] text-ink-muted">Encryption at Rest</span>
                  </span>
                  <span className="rounded-sm border border-approved/35 bg-approved/10 px-2 py-0.5 font-mono text-[10px] text-approved uppercase">
                    Current
                  </span>
                </li>
                <li className="flex items-center justify-between gap-3 rounded-lg border border-hairline bg-surface-2/30 px-3 py-2">
                  <span className="min-w-0">
                    <span className="block font-mono text-[11px] text-gold-soft">SEC-ENC-002</span>
                    <span className="block truncate text-[13px] text-ink-muted">Encryption in Transit</span>
                  </span>
                  <span className="rounded-sm border border-approved/35 bg-approved/10 px-2 py-0.5 font-mono text-[10px] text-approved uppercase">
                    Current
                  </span>
                </li>
              </ul>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="marketing">
      <div className="marketing-grain" aria-hidden />

      <a className="skip-link" href="#products">
        Skip to the product index
      </a>

      <div className="relative z-10 flex min-h-dvh flex-col">
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
          <a href="#top" className="flex items-baseline gap-3" aria-label="Fischer Product Lab home">
            <span className="marketing-type-body font-medium tracking-tight text-ivory">FPL</span>
            <span className="marketing-type-meta text-gold">Fischer Product Lab</span>
          </a>
          <a
            href="#products"
            className="marketing-type-meta text-ivory/70 transition-colors hover:text-gold"
          >
            Product index
          </a>
        </header>

        <main id="top" className="flex flex-1 flex-col">
          <section className="mx-auto flex w-full max-w-6xl flex-col items-center px-6 pt-10 pb-8 text-center sm:pt-16">
            <p className="marketing-type-meta marketing-rise text-gold">
              Portfolio laboratory · public · synthetic · read-only
            </p>
            <h1 className="marketing-type-display marketing-rise marketing-rise-delay-1 mt-6 max-w-5xl text-ivory">
              A security and AI
              <br />
              product laboratory.
            </h1>
            <p className="marketing-type-body marketing-rise marketing-rise-delay-2 mx-auto mt-6 max-w-xl text-ivory/70">
              Public, synthetic, read-only enterprise demonstrations. Portfolio
              credibility you can open — trust, risk, readiness, and agent control.
            </p>
            <div className="marketing-rise marketing-rise-delay-3 mt-9 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#products"
                className="marketing-type-body inline-flex h-11 items-center rounded-sm bg-ivory px-6 font-medium text-navy transition-opacity hover:opacity-90"
              >
                See the products
              </a>
              <a
                href={featured.url}
                target="_blank"
                rel="noreferrer"
                className="marketing-type-body inline-flex h-11 items-center rounded-sm border border-gold/45 px-6 font-medium text-ivory transition-colors hover:border-gold hover:text-gold"
              >
                Open TrustDesk
              </a>
            </div>
          </section>

          <section
            className="marketing-rise marketing-rise-delay-4 relative mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6"
            aria-label="Featured TrustDesk product"
          >
            <div className="marketing-light" aria-hidden />
            <a
              href={featured.url}
              target="_blank"
              rel="noreferrer"
              className="relative z-10 block rounded-xl outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
            >
              <span className="sr-only">
                Open TrustDesk, the featured live demo from Fischer Product Lab
              </span>
              <TrustDeskWindow />
            </a>
          </section>

          <section
            id="products"
            className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 pb-24"
            aria-labelledby="products-title"
          >
            <p className="marketing-type-meta text-gold">Product index</p>
            <h2 id="products-title" className="marketing-type-title mt-3 max-w-2xl text-ivory">
              Eight working products. Each one opens a live demonstration.
            </h2>
            <nav aria-label="Product index">
              <ol className="mt-12 divide-y divide-hairline border-y border-hairline">
                {products.map((product, index) => {
                  const pair = metrics[product.id];
                  return (
                    <li key={product.id} className="py-8">
                      <article className="grid gap-4 lg:grid-cols-[4.5rem_8rem_minmax(0,1fr)_auto] lg:items-start lg:gap-8">
                        <span className="font-mono text-[length:var(--type-body)] text-gold tabular-nums">
                          0{index + 1}
                        </span>
                        <span className="marketing-type-meta text-ivory/70">{product.status}</span>
                        <div className="min-w-0">
                          <h3 className="text-[1.35rem] font-medium tracking-tight text-ivory">
                            {product.name}
                          </h3>
                          <p className="marketing-type-meta mt-2 text-gold">{product.eyebrow}</p>
                          <p className="marketing-type-body mt-3 max-w-xl text-ivory/70">
                            {product.tagline}
                          </p>
                          {pair && (
                            <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[12px] tracking-wide text-ink-muted uppercase">
                              <div className="flex gap-2">
                                <dt className="text-ink-faint">{pair[0]}</dt>
                                <dd className="text-ivory">{pair[1]}</dd>
                              </div>
                              <div className="flex gap-2">
                                <dt className="text-ink-faint">{pair[2]}</dt>
                                <dd className="text-ivory">{pair[3]}</dd>
                              </div>
                            </dl>
                          )}
                        </div>
                        <div className="flex flex-col items-start gap-3 lg:items-end">
                          <a
                            href={product.url}
                            target="_blank"
                            rel="noreferrer"
                            className="marketing-type-body inline-flex items-center rounded-sm border border-gold/45 px-4 py-2 font-medium text-ivory transition-colors hover:border-gold hover:text-gold"
                          >
                            {productCta(product)}
                          </a>
                          <a
                            className="marketing-type-meta text-ivory/45 transition-colors hover:text-gold"
                            href={product.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`${product.name} on GitHub`}
                          >
                            GitHub
                          </a>
                        </div>
                      </article>
                    </li>
                  );
                })}
              </ol>
            </nav>
          </section>

          <section
            className="mx-auto w-full max-w-6xl px-6 pb-24"
            aria-labelledby="lab-title"
          >
            <p className="marketing-type-meta text-gold">The laboratory</p>
            <h2 id="lab-title" className="marketing-type-title mt-3 max-w-2xl text-ivory">
              Built to make consequential operations easier to see and decide.
            </h2>
            <p className="marketing-type-body mt-5 max-w-xl text-ivory/70">
              Each product begins as a useful question. The lab is where we ship
              the working answer — then leave it public, synthetic, and read-only.
            </p>
            <a
              className="marketing-type-body mt-8 inline-flex h-11 items-center rounded-sm border border-gold/45 px-6 font-medium text-ivory transition-colors hover:border-gold hover:text-gold"
              href={`mailto:${CONTACT_EMAIL}`}
            >
              Start a conversation
            </a>
          </section>
        </main>

        <footer className="mx-auto w-full max-w-6xl border-t border-hairline px-6 py-8" id="product-index">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="marketing-type-body font-medium tracking-tight text-ivory">
                Fischer Product Lab
              </p>
              <p className="marketing-type-meta mt-2 text-ivory/45">
                © {new Date().getFullYear()} Fischer Product Lab
              </p>
            </div>
            <nav aria-label="Footer product index">
              <p className="marketing-type-meta text-gold">Product index</p>
              <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2">
                {products.map((product) => (
                  <a
                    key={product.id}
                    href={product.url}
                    target="_blank"
                    rel="noreferrer"
                    className="marketing-type-meta text-ivory/55 transition-colors hover:text-gold"
                  >
                    {product.name}
                  </a>
                ))}
              </div>
            </nav>
            <div className="flex flex-col gap-2 md:items-end">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="marketing-type-meta text-ivory/55 transition-colors hover:text-gold"
              >
                Contact
              </a>
              <a
                href="#top"
                className="marketing-type-meta text-ivory/55 transition-colors hover:text-gold"
              >
                Return to top
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
