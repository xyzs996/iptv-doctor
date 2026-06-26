#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  generateCountryWorldCupGuidePage,
  generateICalendar,
  generateM3UPlaceholder,
  generateWorldCupCountryIndexPage,
  generateWorldCupGuideHtml,
  generateXMLTV
} from "../packages/match2epg/src/generators";
import { getWorldCup2026Dataset } from "../packages/sports-data/src/worldcup2026";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = resolve(root, "apps/worldcup-tv-guide/public");
const dataset = getWorldCup2026Dataset();

function main(): void {
  mkdirSync(publicDir, { recursive: true });

  const files: Array<[string, string]> = [
    ["world-cup-2026-tv-guide.html", generateWorldCupCountryIndexPage(dataset)],
    ["worldcup-2026.ics", generateICalendar(dataset)]
  ];

  for (const country of Object.keys(dataset.broadcasters)) {
    files.push([`worldcup-2026-${country.toLowerCase()}.xmltv`, generateXMLTV(dataset, country)]);
    files.push([`worldcup-2026-${country.toLowerCase()}-placeholder.m3u`, generateM3UPlaceholder(dataset, country)]);
    files.push([`world-cup-2026-tv-guide-${country.toLowerCase()}.html`, generateCountryWorldCupGuidePage(dataset, country)]);
  }

  // Backwards-compatible legacy US guide
  files.push(["worldcup-2026-us.xmltv", generateXMLTV(dataset, "US")]);
  files.push(["worldcup-2026-us-placeholder.m3u", generateM3UPlaceholder(dataset, "US")]);
  files.push(["worldcup-2026-us-guide.html", generateWorldCupGuideHtml(dataset, "US")]);

  for (const [name, content] of files) {
    writeFileSync(resolve(publicDir, name), content);
  }

  process.stdout.write(`Generated ${files.length} World Cup pages in ${publicDir}\n`);
}

main();
