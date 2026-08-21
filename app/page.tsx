"use client";

import { useEffect, useRef, useState } from "react";
import { products, type Product, type ProductId } from "./products";

const metrics: Record<ProductId, readonly [string, string, string, string]> = {
  productpulse: ["WAU", "5,230", "Activation", "64.0%"],
  vulnboard: ["Risk score", "68", "SLA debt", "87 overdue"],
  portfoliohealth: ["Health", "69", "SLA risk", "8"],
  trustdesk: ["Open", "7", "Automation", "51%"],
  aurora: ["Lanes", "4", "Checks", "2 / 2"],
  agentops: ["Agents", "8", "Launch ready", "3"],
  programforge: ["Portfolio", "75", "Decisions", "4"],
  orrery: ["Surfaces", "5", "Patterns", "11"],
};

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

function ProductIndex({ compact = false }: { compact?: boolean }) {
  return (
    <nav className={compact ? "product-index compact" : "product-index"} aria-label="Product index">
      <span className="index-label">Product index</span>
      <div className="index-links">
        {products.map((product, index) => (
          <a key={product.id} href={product.url} target="_blank" rel="noreferrer">
            <span>0{index + 1}</span> {product.name}
          </a>
        ))}
      </div>
    </nav>
  );
}

function InterfaceFragment({ product }: { product: Product }) {
  const [labelA, valueA, labelB, valueB] = metrics[product.id];
  return (
    <div className="interface-fragment" aria-hidden="true">
      <span className="fragment-bar" />
      <div><small>{labelA}</small><b>{valueA}</b></div>
      <div><small>{labelB}</small><b>{valueB}</b></div>
      <i><span /><span /><span /><span /><span /></i>
    </div>
  );
}

function Monument({ product }: { product: Product }) {
  if (product.id === "productpulse") {
    return (
      <div className="monument observatory" aria-hidden="true">
        <div className="observatory-roof" />
        <div className="columns">{Array.from({ length: 6 }, (_, i) => <i key={i} />)}</div>
        <InterfaceFragment product={product} />
        <span className="monument-base" />
      </div>
    );
  }

  if (product.id === "vulnboard") {
    return (
      <div className="monument pyramids" aria-hidden="true">
        <i className="pyramid pyramid-back" /><i className="pyramid pyramid-main" /><i className="pyramid pyramid-small" />
        <InterfaceFragment product={product} />
        <span className="scan-line" />
      </div>
    );
  }

  if (product.id === "trustdesk") {
    return (
      <div className="monument covenant" aria-hidden="true">
        <div className="stones">{Array.from({ length: 7 }, (_, i) => <i key={i} />)}</div>
        <div className="evidence-thread" />
        <InterfaceFragment product={product} />
      </div>
    );
  }

  if (product.id === "portfoliohealth") {
    return (
      <div className="monument rotunda" aria-hidden="true">
        <div className="rotunda-dome"><i /><i /><i /></div>
        <div className="rotunda-columns">{Array.from({ length: 6 }, (_, i) => <i key={i} />)}</div>
        <InterfaceFragment product={product} />
        <span className="rotunda-base" />
      </div>
    );
  }

  if (product.id === "aurora") {
    return (
      <div className="monument aurora-observatory" aria-hidden="true">
        <div className="aurora-ribbons">
          <i className="aurora-ribbon aurora-ribbon-a" />
          <i className="aurora-ribbon aurora-ribbon-b" />
          <i className="aurora-ribbon aurora-ribbon-c" />
        </div>
        <span className="aurora-horizon" />
        <div className="aurora-dome"><i className="aurora-aperture" /></div>
        <div className="aurora-station">
          <i className="aurora-pier aurora-pier-left" />
          <InterfaceFragment product={product} />
          <i className="aurora-pier aurora-pier-right" />
        </div>
      </div>
    );
  }

  if (product.id === "agentops") {
    return (
      <div className="monument control-tower" aria-hidden="true">
        <i className="signal signal-a" /><i className="signal signal-b" />
        <div className="tower-crown"><span /><span /><span /></div>
        <div className="tower-body"><InterfaceFragment product={product} /></div>
        <div className="tower-wing left" /><div className="tower-wing right" />
      </div>
    );
  }

  if (product.id === "programforge") {
    return (
      <div className="monument hephaestus-forge" aria-hidden="true">
        <span className="heph-side-roof" />
        <span className="heph-pediment" />
        <div className="heph-frieze">
          {Array.from({ length: 8 }, (_, i) => <i key={i} />)}
        </div>
        <div className="heph-naos">
          <div className="heph-dependencies"><i /><i /><i /></div>
          <InterfaceFragment product={product} />
          <span className="heph-hearth" />
        </div>
        <div className="heph-front-columns">
          {Array.from({ length: 6 }, (_, i) => <i key={i} />)}
        </div>
        <div className="heph-side-columns">
          {Array.from({ length: 5 }, (_, i) => <i key={i} />)}
        </div>
        <div className="heph-embers"><i /><i /><i /></div>
        <span className="heph-steps" />
      </div>
    );
  }

  if (product.id === "orrery") {
    return (
      <div className="monument meridian-armillary" aria-hidden="true">
        <div className="orrery-rings">
          <i className="orrery-orbit orrery-orbit-a"><span /></i>
          <i className="orrery-orbit orrery-orbit-b"><span /></i>
          <i className="orrery-orbit orrery-orbit-c"><span /></i>
          <div className="orrery-surfaces">
            {Array.from({ length: 5 }, (_, i) => <i key={i} />)}
          </div>
          <span className="orrery-needs-you" />
        </div>
        <div className="orrery-telescope">
          <i className="orrery-lens" />
          <i className="orrery-collar orrery-collar-a" />
          <i className="orrery-collar orrery-collar-b" />
        </div>
        <div className="orrery-fork"><i /><i /></div>
        <div className="orrery-pier"><InterfaceFragment product={product} /></div>
        <span className="orrery-summit" />
      </div>
    );
  }

  const exhaustiveProduct: never = product;
  return exhaustiveProduct;
}

function Landmark({
  product,
  active,
  onActivate,
  onDeactivate,
  onNavigate,
}: {
  product: Product;
  active: boolean;
  onActivate: (id: ProductId) => void;
  onDeactivate: () => void;
  onNavigate: (event: React.MouseEvent<HTMLAnchorElement>, product: Product) => void;
}) {
  const annotationCta = "ctaLabel" in product ? product.ctaLabel : "Enter";
  const githubUrl = "githubUrl" in product ? product.githubUrl : null;

  return (
    <article
      className={`landmark landmark-${product.id}${active ? " is-active" : ""}`}
      onMouseLeave={onDeactivate}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) onDeactivate();
      }}
    >
      <a
        className="landmark-link"
        href={product.url}
        aria-label={`${product.name}: ${product.routeLabel}`}
        onFocus={() => onActivate(product.id)}
        onMouseEnter={() => onActivate(product.id)}
        onClick={(event) => onNavigate(event, product)}
      >
        <span className="route" aria-hidden="true"><i /><i /><i /></span>
        <Monument product={product} />
        <span className="landmark-name">{product.name}</span>
      </a>
      <div className="annotation">
        <span className="annotation-meta"><b>{product.name}</b><span>{product.coordinate}</span></span>
        <p>{product.eyebrow}</p>
        <h3>{product.landmark}</h3>
        <span>{product.tagline}</span>
        <div className="annotation-actions">
          <a href={product.url} target="_blank" rel="noreferrer">{annotationCta} <i aria-hidden="true">↗</i></a>
          {githubUrl && <a className="annotation-source" href={githubUrl} target="_blank" rel="noreferrer" aria-label={`${product.name} on GitHub`}>GitHub <i aria-hidden="true">↗</i></a>}
        </div>
      </div>
    </article>
  );
}

function SectionMark({ number, children }: { number: string; children: React.ReactNode }) {
  return <p className="section-mark"><span>{number}</span>{children}</p>;
}

const TITLE_HOLD_MS = 3200;
const TITLE_YIELD_MS = 720;

export default function Home() {
  const [entered, setEntered] = useState(true);
  const [yielding, setYielding] = useState(false);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState<ProductId | null>(null);
  const [departing, setDeparting] = useState<ProductId | null>(null);
  const reducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const titleCardRef = useRef<HTMLElement>(null);
  const enteredRef = useRef(true);
  const yieldingRef = useRef(false);
  const enterLandscapeRef = useRef<() => void>(() => {});

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const seen = window.sessionStorage.getItem("fpl-entered") === "true";
      const skip = seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      enteredRef.current = skip;
      setEntered(skip);
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function enterLandscape() {
    if (enteredRef.current || yieldingRef.current) return;
    yieldingRef.current = true;
    window.sessionStorage.setItem("fpl-entered", "true");
    setYielding(true);
    window.setTimeout(() => {
      enteredRef.current = true;
      setEntered(true);
      heroRef.current?.focus();
    }, reducedMotion ? 0 : TITLE_YIELD_MS);
  }

  enterLandscapeRef.current = enterLandscape;

  useEffect(() => {
    if (!ready || entered) return;
    titleCardRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      enterLandscapeRef.current();
    };

    const auto = window.setTimeout(() => enterLandscapeRef.current(), TITLE_HOLD_MS);
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(auto);
      window.removeEventListener("keydown", onKey);
    };
  }, [ready, entered]);

  function navigate(event: React.MouseEvent<HTMLAnchorElement>, product: Product) {
    if (reducedMotion || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    setDeparting(product.id);
    window.setTimeout(() => window.location.assign(product.url), 620);
  }

  function moveLandscape(event: React.MouseEvent<HTMLElement>) {
    if (reducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    event.currentTarget.style.setProperty("--px", x.toFixed(2));
    event.currentTarget.style.setProperty("--py", y.toFixed(2));
  }

  return (
    <main className={`${entered ? "has-entered" : "at-threshold"}${departing ? ` is-departing departing-${departing}` : ""}`}>
      <a className="skip-link" href="#frontier" onClick={enterLandscape}>Skip to the landscape</a>
      <header className="site-header">
        <a className="wordmark" href="#frontier" aria-label="Fischer Product Lab home">
          <span>FPL</span><b>Fischer Product Lab</b>
        </a>
        <span className="edition">FIELD ED. 01 · 41.8781° N</span>
      </header>
      <ProductIndex compact />

      {ready && !entered && (
        <section
          ref={titleCardRef}
          className={`title-card${yielding ? " is-yielding" : ""}`}
          aria-labelledby="title-card-wordmark"
          aria-describedby="title-card-line"
          tabIndex={-1}
          onClick={enterLandscape}
        >
          <div className="title-card-void" aria-hidden="true">
            <span className="title-card-grain" />
            <i className="title-card-light" />
          </div>
          <div className="title-card-copy">
            <h1 id="title-card-wordmark">Fischer Product Lab</h1>
            <span className="title-card-rule" aria-hidden="true" />
            <p id="title-card-line">A laboratory for trust, security, and AI.</p>
          </div>
        </section>
      )}

      <section
        className="frontier"
        id="frontier"
        ref={heroRef}
        tabIndex={-1}
        aria-labelledby="frontier-title"
        onMouseMove={moveLandscape}
      >
        <div className="sky-plane"><span className="moon" /></div>
        <picture className="hero-atmosphere">
          <source media="(max-width: 800px)" srcSet="/landscape-hero-mobile.webp" />
          <img
            src="/landscape-hero.webp"
            alt=""
            width={1672}
            height={941}
            decoding="async"
            fetchPriority="high"
          />
        </picture>
        <div className="basin-light" aria-hidden="true"><i /><i /></div>
        <div className="contour-plane" aria-hidden="true" />
        <div className="ridge ridge-far" aria-hidden="true" />
        <div className="fog fog-back" aria-hidden="true" />
        <div className="ridge ridge-mid" aria-hidden="true" />
        <div className="fog fog-middle" aria-hidden="true" />
        <div className="hero-copy">
          <SectionMark number="01">The frontier</SectionMark>
          <h1 id="frontier-title">Many paths.<br />One laboratory.</h1>
          <p>Independent products for clearer decisions, stronger trust, and better-operated systems.</p>
          <a className="text-link" href="#paths">Choose a path <span aria-hidden="true">↓</span></a>
        </div>
        <div className="landscape" role="group" aria-label="Eight product landmarks">
          {products.map((product) => (
            <Landmark
              key={product.id}
              product={product}
              active={active === product.id}
              onActivate={setActive}
              onDeactivate={() => setActive(null)}
              onNavigate={navigate}
            />
          ))}
        </div>
        <div className="fog fog-front" aria-hidden="true" />
        <div className="ridge ridge-front" aria-hidden="true" />
        <p className="frontier-instruction">Focus a route to reveal its destination</p>
      </section>

      <section className="paths section-shell" id="paths" aria-labelledby="paths-title">
        <div className="section-heading">
          <SectionMark number="02">Choose a path</SectionMark>
          <h2 id="paths-title">Eight questions.<br />Eight working answers.</h2>
          <p>Each route leads to a live product. The landscape remains; the instruments come into focus.</p>
        </div>
        <div className="path-list">
          {products.map((product, index) => (
            <a key={product.id} className={`path-row path-${product.id}`} href={product.url} target="_blank" rel="noreferrer">
              <span className="path-number">0{index + 1}</span>
              <span className="path-monument"><Monument product={product} /></span>
              <span className="path-copy">
                <small>{product.eyebrow}</small>
                <strong>{product.name}</strong>
                <span>{product.tagline}</span>
              </span>
              <span className="path-action"><i>{product.status}</i>{product.routeLabel} ↗</span>
            </a>
          ))}
        </div>
      </section>

      <section className="inside-lab section-shell" id="lab" aria-labelledby="lab-title">
        <div className="lab-orbit" aria-hidden="true"><i /><i /><i /><span>FPL</span></div>
        <div className="lab-copy">
          <SectionMark number="03">Inside the lab</SectionMark>
          <h2 id="lab-title">The work begins<br />with a useful question.</h2>
          <p>What signal is missing? Where does service health begin to drift? Where does trust slow down? Which risk needs an owner? How should agent work stay controlled when a plan or specialist fails? What should be ready before launch? Are the right cross-team initiatives on track, unblocked, and ready for leadership decision? How should people supervise long-running agents without reducing the work to a chat transcript?</p>
          <p>Each product begins as a question. The lab is where we build the answer.</p>
        </div>
        <p className="lab-note">Some paths lead to finished products. Others remain experiments. All of them move the work forward.</p>
      </section>

      <section className="field-notes section-shell" aria-labelledby="notes-title">
        <div className="section-heading compact-heading">
          <SectionMark number="04">Field notes</SectionMark>
          <h2 id="notes-title">Observations from the ridge.</h2>
        </div>
        <div className="notes-list">
          <article><span>NOTE 01 · SIGNAL</span><h3>A metric earns its place when it changes a decision.</h3><p>Clarity is subtraction before it is visualization.</p></article>
          <article><span>NOTE 02 · TRUST</span><h3>Evidence becomes useful when people can move it together.</h3><p>Proof, ownership, and timing belong in the same view.</p></article>
          <article><span>NOTE 03 · READINESS</span><h3>Launch is a governance state, not a calendar date.</h3><p>Good systems make the conditions visible.</p></article>
        </div>
      </section>

      <section className="builder section-shell" aria-labelledby="builder-title">
        <div className="builder-portrait" role="img" aria-label="Founder portrait placeholder">
          <span>F</span><small>PORTRAIT / 01</small>
        </div>
        <div className="builder-copy">
          <SectionMark number="05">The builder</SectionMark>
          <h2 id="builder-title">Independent by design.</h2>
          <p className="builder-lede">Fischer Product Lab is a place for building focused software around consequential work.</p>
          <blockquote>“I build tools that make complex operations easier to see, explain, and improve.”</blockquote>
          <span>Founder note · Fischer Product Lab</span>
        </div>
      </section>

      <section className="open-path section-shell" id="contact" aria-labelledby="contact-title">
        <span className="horizon-mark" aria-hidden="true"><i /></span>
        <SectionMark number="06">Open a new path</SectionMark>
        <h2 id="contact-title">What should<br />exist next?</h2>
        <p>The lab is always listening for the next useful question.</p>
        <a className="primary-link" href="mailto:hello@fischerproductlab.com">Start a conversation <span aria-hidden="true">↗</span></a>
      </section>

      <footer className="footer" id="product-index">
        <div className="footer-wordmark"><span>FPL</span><b>Fischer<br />Product Lab</b></div>
        <ProductIndex />
        <div className="footer-meta">
          <a href="mailto:hello@fischerproductlab.com">Contact</a>
          <a href="#frontier">Return to frontier ↑</a>
          <span>© {new Date().getFullYear()} Fischer Product Lab</span>
        </div>
      </footer>
    </main>
  );
}
