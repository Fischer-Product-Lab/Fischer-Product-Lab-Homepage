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

test("server-renders the Fischer Product Lab cinematic portfolio", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Fischer Product Lab \| A security and AI product laboratory\./);
  assert.match(html, /Public, synthetic, read-only enterprise demonstrations/);
  assert.match(html, /A security and AI/);
  assert.match(html, /product laboratory/);
  assert.match(html, /See the products/);
  assert.match(html, /Open TrustDesk/);
  assert.match(html, /Product index/i);
  assert.match(html, /Featured TrustDesk product/);
  assert.match(html, /Northwind Capital/);
  assert.match(html, /trustdesk · questionnaires \/ qn-001/);
  assert.match(html, /ProductPulse/);
  assert.match(html, /VulnBoard/);
  assert.match(html, /Portfolio Health/);
  assert.match(html, /TrustDesk/);
  assert.match(html, /Aurora/);
  assert.match(html, /Explore the simulation/);
  assert.match(html, /AgentOps/);
  assert.match(html, /ProgramForge/);
  assert.match(html, /Explore the dashboard/);
  assert.match(html, /ORRERY/);
  assert.match(html, /Explore the instrument/);
  assert.match(html, /hello@fischerproductlab\.com/);
  assert.equal((html.match(/aria-label="[^"]+ on GitHub"/g) ?? []).length, 8);
  assert.match(html, /\/favicon\.svg/);
  assert.match(html, /\/icon-512\.png/);
  assert.match(html, /\/favicon\.ico/);
  assert.match(html, /\/apple-touch-icon\.png/);
});

test("ships all eight truthful product destinations and the locked visual language", async () => {
  const [page, layout, css, products, design] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/products.ts", import.meta.url), "utf8"),
    readFile(new URL("../DESIGN.md", import.meta.url), "utf8"),
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

  assert.match(page, /featured\.url/);
  assert.match(page, /aria-label="Product index"/);
  assert.match(page, /<a[\s\S]*href=\{product\.url\}/);
  assert.match(page, /aria-label=\{`\$\{product\.name\} on GitHub`\}/);
  assert.match(page, /hello@fischerproductlab\.com/);
  assert.match(page, /Northwind Capital/);
  assert.doesNotMatch(page, /sessionStorage/);
  assert.doesNotMatch(page, /Enter the landscape/);
  assert.doesNotMatch(page, /trusted by/i);
  assert.doesNotMatch(page, /canvas|three|WebGL/i);

  assert.match(layout, /Geist/);
  assert.match(layout, /Geist_Mono/);
  assert.match(layout, /\/og\.png/);
  assert.match(layout, /\/favicon\.svg/);
  assert.match(layout, /\/icon-512\.png/);
  assert.match(layout, /\/favicon\.ico/);
  assert.match(layout, /\/apple-touch-icon\.png/);

  assert.match(css, /#0b1220/i);
  assert.match(css, /#f4efe4/i);
  assert.match(css, /#c4a35a/i);
  assert.match(css, /\.marketing-grain/);
  assert.match(css, /\.marketing-light/);
  assert.match(css, /\.product-window/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /:focus-visible|:focus\b/);
  assert.doesNotMatch(css, /--threshold-horizon/);
  assert.doesNotMatch(css, /\.rotunda-dome/);

  assert.match(design, /#0B1220/);
  assert.match(design, /#F4EFE4/);
  assert.match(design, /#C4A35A/);
  assert.match(design, /Kill list/);
  assert.match(design, /No Inter/);

  await Promise.all([
    access(new URL("public/og.png", root)),
    access(new URL("public/favicon.svg", root)),
    access(new URL("public/favicon.ico", root)),
    access(new URL("public/favicon-16x16.png", root)),
    access(new URL("public/favicon-32x32.png", root)),
    access(new URL("public/favicon-48x48.png", root)),
    access(new URL("public/apple-touch-icon.png", root)),
    access(new URL("public/icon-512.png", root)),
  ]);
});
