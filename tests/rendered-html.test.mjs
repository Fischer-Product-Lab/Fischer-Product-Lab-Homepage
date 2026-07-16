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
  assert.match(html, /\/favicon\.svg/);
  assert.match(html, /\/icon-512\.png/);
  assert.match(html, /\/favicon\.ico/);
  assert.match(html, /\/apple-touch-icon\.png/);
});

test("ships all five truthful product destinations and accessibility fallbacks", async () => {
  const [page, layout, css, products] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/products.ts", import.meta.url), "utf8"),
  ]);

  assert.match(products, /https:\/\/productpulse-fpl\.vercel\.app\//);
  assert.match(products, /https:\/\/vuln-board-fpl\.vercel\.app\/dashboard/);
  assert.match(products, /https:\/\/portfolio-health-fpl\.vercel\.app\//);
  assert.match(products, /https:\/\/trustdesk-fpl\.vercel\.app\//);
  assert.match(products, /https:\/\/agentops-fpl\.vercel\.app\//);
  assert.match(products, /as const/);
  assert.match(page, /sessionStorage/);
  assert.match(page, /prefers-reduced-motion/);
  assert.match(page, /aria-label="Product index"/);
  assert.match(page, /aria-label="Five product landmarks"/);
  assert.match(page, /Five questions\./);
  assert.match(page, /<a[\s\S]*href=\{product\.url\}/);
  assert.match(page, /rotunda/);
  assert.match(layout, /\/og\.png/);
  assert.match(layout, /\/favicon\.svg/);
  assert.match(layout, /\/icon-512\.png/);
  assert.match(layout, /\/favicon\.ico/);
  assert.match(layout, /\/apple-touch-icon\.png/);
  assert.match(css, /@media \(max-width:800px\)/);
  assert.match(css, /@media \(min-width:801px\)[\s\S]*?\.landscape\{z-index:9\}/);
  assert.match(css, /\.landmark-vulnboard \.annotation\{left:165%;bottom:72px\}/);
  assert.match(css, /\.landmark-portfoliohealth \.annotation\{left:125%\}/);
  assert.match(css, /\.landmark-agentops \.annotation\{left:40%\}/);
  assert.match(css, /\.annotation h3\{[^}]*font-size:clamp\(18px,1\.2vw,20px\)/);
  assert.match(css, /\.annotation > span:not\(\.annotation-meta\)\{[^}]*font-size:clamp\(10px,\.7vw,11px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /\.ridge \{[^}]*pointer-events: none/);
  assert.match(css, /\.rotunda-dome/);
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
  ]);
});
