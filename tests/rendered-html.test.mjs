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
});

test("ships all four truthful product destinations and accessibility fallbacks", async () => {
  const [page, layout, css, products] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/products.ts", import.meta.url), "utf8"),
  ]);

  assert.match(products, /https:\/\/productpulse-fpl\.vercel\.app\//);
  assert.match(products, /https:\/\/vuln-board-fpl\.vercel\.app\/dashboard/);
  assert.match(products, /https:\/\/trustdesk-fpl\.vercel\.app\//);
  assert.match(products, /https:\/\/agentops-fpl\.vercel\.app\//);
  assert.match(products, /as const/);
  assert.match(page, /sessionStorage/);
  assert.match(page, /prefers-reduced-motion/);
  assert.match(page, /aria-label="Product index"/);
  assert.match(page, /<a[\s\S]*href=\{product\.url\}/);
  assert.match(layout, /\/og\.png/);
  assert.match(css, /@media \(max-width:800px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /:focus-visible/);
  assert.doesNotMatch(page, /canvas|three|WebGL/i);
  await Promise.all([
    access(new URL("public/og.png", root)),
    access(new URL("public/landscape-hero.webp", root)),
    access(new URL("public/landscape-hero-mobile.webp", root)),
  ]);
});
