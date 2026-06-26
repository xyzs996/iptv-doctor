#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { getWorldCup2026Dataset } from "../packages/sports-data/src/index.js";

const root = resolve(fileURLToPath(import.meta.url), "../..");
const publicDir = resolve(root, "apps/worldcup-tv-guide/public");
const siteUrl = "https://xyzs996.github.io/iptv-doctor";

type StatusIndex = { updatedAt: string };

function renderSitemap(index: StatusIndex, worldCupCountries: string[]): string {
  const today = index.updatedAt.slice(0, 10);
  const staticPaths = ["", "status-index.html", "iptv-playlist-checker.html", "m3u-checker.html", "world-cup-2026-tv-guide.html"];
  const countryPaths = Array.from(new Set(Object.values(index as any).flatMap((r: any) => r?.country ? [`countries/${String(r.country).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.html`] : [])));
  const worldCupPaths = [
    "world-cup-2026-tv-guide.html",
    ...worldCupCountries.map((cc) => `world-cup-2026-tv-guide-${cc}.html`)
  ];
  const allPaths = Array.from(new Set([...staticPaths, ...countryPaths, ...worldCupPaths]));
  const urls = allPaths.map((path) => {
    const loc = path ? `${siteUrl}/${path}` : `${siteUrl}/`;
    const priority = path === "" ? "1.0" : path.startsWith("world-cup-2026") ? "0.9" : "0.8";
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${priority}</priority>
  </url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;
}

function main(): void {
  mkdirSync(publicDir, { recursive: true });
  const index: StatusIndex = JSON.parse(readFileSync(resolve(publicDir, "status-index.json"), "utf-8"));
  const countries = Object.keys(getWorldCup2026Dataset().broadcasters).map((c) => c.toLowerCase());
  writeFileSync(resolve(publicDir, "sitemap.xml"), renderSitemap(index, countries));
  writeFileSync(resolve(publicDir, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
  process.stdout.write(`Regenerated sitemap with ${countries.length} World Cup countries\n`);
}

main();
