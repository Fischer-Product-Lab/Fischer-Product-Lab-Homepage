import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html", host: "fpl.test" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the complete Fischer Product Lab journey", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Fischer Product Lab \| Many paths\. One laboratory\./);
  assert.match(html, /Independent products for clearer decisions/);
  assert.match(html, /The frontier/i);
  assert.match(html, /Choose a path/i);
  assert.match(html, /Inside the lab/i);
  assert.match(html, /Field notes/i);
  assert.match(html, /The builder/i);
  assert.match(html, /What should/i);
  assert.match(html, /Product index/i);
  assert.match(html, /Portfolio Health/i);
  assert.match(html, /The Confluence Rotunda/i);
  assert.match(html, /Aurora/i);
  assert.match(html, /The Aurora Observatory/i);
  assert.match(html, /Explore the simulation/i);
  assert.match(html, /ProgramForge/i);
  assert.match(html, /The Forge of Hephaestus/i);
  assert.match(html, /Explore the dashboard/i);
  assert.match(html, /ORRERY/);
  assert.match(html, /The Meridian Armillary/i);
  assert.match(html, /Explore the instrument/i);
  assert.equal((html.match(/aria-label="[^"]+ on GitHub"/g) ?? []).length, 8);
  assert.match(html, /annotation-meta"><b>ProductPulse<\/b><span>43\.1 \/ A<\/span>/);
  assert.match(html, /\/favicon\.svg/);
  assert.match(html, /\/icon-512\.png/);
  assert.match(html, /\/favicon\.ico/);
  assert.match(html, /\/apple-touch-icon\.png/);
});

test("title card wins first paint and keeps the wordmark off the gold beam", async () => {
  const response = await render();
  const html = await response.text();

  assert.match(html, /class="title-card"/);
  assert.match(html, /title-card-plaque/);
  assert.match(html, /id="title-card-wordmark"/);
  assert.match(html, /Click to enter/);
  assert.match(html, /sessionStorage\.getItem\("fpl-entered"\)/);
  assert.match(html, /classList\.add\("entered"\)/);
  assert.match(html, /prefers-reduced-motion: reduce/);

  const scriptIdx = html.search(/sessionStorage\.getItem\("fpl-entered"\)/);
  const cardIdx = html.search(/class="title-card"/);
  const landscapeIdx = html.search(/class="frontier"/);
  assert.notEqual(scriptIdx, -1);
  assert.notEqual(cardIdx, -1);
  assert.notEqual(landscapeIdx, -1);
  assert.ok(scriptIdx < cardIdx, "boot script must run before the title card markup");
  assert.ok(cardIdx < landscapeIdx, "title card must precede the landscape in first HTML");
});

test("ships all eight truthful product destinations and accessibility fallbacks", async () => {
  const [page, layout, css, products] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/products.ts", import.meta.url), "utf8"),
  ]);

  assert.match(products, /https:\/\/productpulse-fpl\.vercel\.app\//);
  assert.match(products, /https:\/\/github\.com\/Fischer-Product-Lab\/productpulse/);
  assert.match(products, /https:\/\/vuln-board-fpl\.vercel\.app\/dashboard/);
  assert.match(products, /https:\/\/github\.com\/Fischer-Product-Lab\/VulnBoard/);
  assert.match(products, /https:\/\/portfolio-health-fpl\.vercel\.app\//);
  assert.match(products, /https:\/\/github\.com\/Fischer-Product-Lab\/portfolio-health/);
  assert.match(products, /https:\/\/trustdesk-fpl\.vercel\.app\//);
  assert.match(products, /https:\/\/github\.com\/Fischer-Product-Lab\/trustdesk/);
  assert.match(products, /https:\/\/agentops-fpl\.vercel\.app\//);
  assert.match(products, /https:\/\/github\.com\/Fischer-Product-Lab\/agentops/);
  assert.match(products, /https:\/\/aurora-fpl\.vercel\.app/);
  assert.match(products, /https:\/\/github\.com\/Fischer-Product-Lab\/aurora-fpl/);
  assert.match(products, /https:\/\/program-forge-fpl\.vercel\.app\//);
  assert.match(products, /https:\/\/github\.com\/Fischer-Product-Lab\/ProgramForge/);
  assert.doesNotMatch(products, /https:\/\/programforge-fpl\.vercel\.app/i);
  assert.doesNotMatch(products, /https:\/\/program-forge\.vercel\.app\//i);
  assert.match(products, /https:\/\/orrery-orpin\.vercel\.app\//);
  assert.match(products, /https:\/\/github\.com\/Fischer-Product-Lab\/FPL-Orrery/);
  assert.doesNotMatch(products, /aurora[^\n]*t-fischer2\.chatgpt\.site/i);
  assert.match(products, /as const/);
  assert.match(page, /sessionStorage/);
  assert.match(page, /prefers-reduced-motion/);
  assert.match(page, /title-card/);
  assert.match(page, /title-card-plaque/);
  assert.match(page, /\/title-card\.webp/);
  assert.match(page, /keydown/);
  assert.match(page, /TITLE_ENTER_KEYS/);
  assert.match(page, /Escape/);
  assert.match(page, /Click to enter/);
  assert.match(page, /A laboratory for trust, security, and AI/);
  assert.match(page, /useState\(false\)/);
  assert.doesNotMatch(page, /useState\(true\)/);
  assert.doesNotMatch(page, /ready && !entered/);
  assert.doesNotMatch(page, /TITLE_HOLD_MS/);
  assert.doesNotMatch(page, /Enter the landscape/);
  assert.doesNotMatch(page, /Skip introduction/);
  assert.match(layout, /sessionStorage\.getItem\("fpl-entered"\)/);
  assert.match(layout, /classList\.add\("entered"\)/);
  assert.match(layout, /dangerouslySetInnerHTML/);
  assert.match(page, /aria-label="Product index"/);
  assert.match(page, /aria-label="Eight product landmarks"/);
  assert.match(page, /Eight questions\./);
  assert.match(page, /<a[\s\S]*href=\{product\.url\}/);
  assert.match(page, /<b>\{product\.name\}<\/b>/);
  assert.doesNotMatch(page, /annotation-meta"><b>\{product\.status\}<\/b>/);
  assert.match(page, /aria-label=\{`\$\{product\.name\} on GitHub`\}/);
  assert.match(page, /rotunda/);
  assert.match(layout, /\/og\.png/);
  assert.match(layout, /\/favicon\.svg/);
  assert.match(layout, /\/icon-512\.png/);
  assert.match(layout, /\/favicon\.ico/);
  assert.match(layout, /\/apple-touch-icon\.png/);
  assert.match(css, /@media \(max-width:800px\)/);
  assert.match(css, /--title-navy: #0B1220/);
  assert.match(css, /--title-ivory: #F4EFE4/);
  assert.match(css, /--title-gold: #C4A35A/);
  assert.match(css, /\.title-card-grain/);
  assert.match(css, /\.title-card-light/);
  assert.match(css, /\.title-card-plate/);
  assert.match(css, /\.title-card-enter/);
  assert.match(css, /\.title-card-plaque/);
  assert.match(css, /\.title-card-plaque\{[^}]*background: var\(--title-navy\)/);
  assert.match(css, /html\.entered \.title-card/);
  assert.match(css, /\.title-card\.is-yielding/);
  assert.match(css, /clamp\(56px, 12\.8vw, 168px\)/);
  assert.doesNotMatch(css, /text-shadow: 0 0 64px rgba\(11,18,32,\.55\)/);
  assert.match(css, /@media \(min-width:801px\)[\s\S]*?\.landscape\{z-index:9\}/);
  assert.match(css, /\.landmark-vulnboard \.annotation\{left:165%;bottom:72px\}/);
  assert.match(css, /\.landmark-portfoliohealth \.annotation\{left:220%\}/);
  assert.match(css, /\.landmark-agentops \.annotation\{left:40%\}/);
  assert.match(css, /\.annotation h3\{[^}]*font-size:clamp\(18px,1\.2vw,20px\)/);
  assert.match(css, /\.annotation-meta b\{[^}]*text-transform:none/);
  assert.match(css, /\.annotation > span:not\(\.annotation-meta\)\{[^}]*font-size:clamp\(10px,\.7vw,11px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /\.ridge \{[^}]*pointer-events: none/);
  assert.match(css, /\.rotunda-dome/);
  assert.match(css, /\.aurora-ribbons/);
  assert.match(css, /\.landmark-aurora/);
  assert.match(css, /\.path-aurora/);
  assert.match(css, /\.hephaestus-forge/);
  assert.match(css, /\.landmark-programforge/);
  assert.match(css, /\.path-programforge/);
  assert.match(css, /\.landmark-programforge \.annotation/);
  assert.match(css, /\.meridian-armillary/);
  assert.match(css, /\.orrery-needs-you/);
  assert.match(css, /\.landmark-orrery/);
  assert.match(css, /\.path-orrery/);
  assert.match(css, /\.landmark-orrery \.annotation/);
  assert.doesNotMatch(page, /canvas|three|WebGL/i);
  await Promise.all([
    access(new URL("public/og.png", root)),
    access(new URL("public/favicon.svg", root)),
    access(new URL("public/favicon.ico", root)),
    access(new URL("public/favicon-16x16.png", root)),
    access(new URL("public/favicon-32x32.png", root)),
    access(new URL("public/favicon-48x48.png", root)),
    access(new URL("public/apple-touch-icon.png", root)),
    access(new URL("public/icon-512.png", root)),
    access(new URL("public/landscape-hero.webp", root)),
    access(new URL("public/landscape-hero-mobile.webp", root)),
    access(new URL("public/title-card.webp", root)),
  ]);
});
