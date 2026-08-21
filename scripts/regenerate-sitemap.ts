#!/usr/bin/env node
/**
 * Rebuild `sitemap.xml`, `robots.txt` and `llms.txt` from the status index
 * already on disk, without re-checking anything over the network.
 *
 * This script used to carry its own copy of the path list, which is how the
 * published sitemap came to name 66 addresses while the site served far more.
 * It now calls the same writer the scheduled run calls; see `site-index.ts`
 * for why there is only one list of addresses.
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { writeSiteIndexes, type StatusIndex } from "./generate-status-index.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = resolve(root, "apps/worldcup-tv-guide/public");

function main(): void {
  const index: StatusIndex = JSON.parse(
    readFileSync(resolve(publicDir, "status-index.json"), "utf-8")
  );
  const addresses = writeSiteIndexes(index, publicDir);
  process.stdout.write(
    `Regenerated sitemap, robots and llms.txt: ${addresses.pages.length} pages, ` +
      `${addresses.files.length} data files\n`
  );
}

main();
