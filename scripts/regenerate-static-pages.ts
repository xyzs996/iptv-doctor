#!/usr/bin/env node
/**
 * Re-render the crawlable HTML pages from the status index already on disk.
 *
 * `status:index` does the same thing, but only after re-checking every
 * official website over the network -- which is right when the data is what
 * changed, and wrong when the page template is. A template change would
 * otherwise sit unpublished until the next scheduled run, and would arrive
 * mixed into a diff of several hundred changed status rows.
 *
 * Reads `apps/worldcup-tv-guide/public/status-index.json` and writes only the
 * `.html` files. It touches no JSON, CSV, badge, sitemap, or README output:
 * the status numbers in the regenerated pages are the ones already committed,
 * so nothing here can claim a check happened that did not.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { renderStaticPages, type StatusIndex } from "./generate-status-index.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = resolve(root, "apps/worldcup-tv-guide/public");

function main(): void {
  const index: StatusIndex = JSON.parse(
    readFileSync(resolve(publicDir, "status-index.json"), "utf-8")
  );
  const pages = renderStaticPages(index);
  for (const page of pages) {
    const target = resolve(publicDir, page.path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, page.html);
  }
  process.stdout.write(`Regenerated ${pages.length} pages from ${index.updatedAt}\n`);
}

main();
