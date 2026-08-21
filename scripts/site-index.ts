/**
 * The machine-readable indexes: `sitemap.xml`, `robots.txt` and `llms.txt`.
 *
 * ## Why these three live in one file
 *
 * They used to live in two. `generate-status-index.ts` derived the sitemap
 * from the pages it had just written, and `regenerate-sitemap.ts` carried a
 * second, hand-maintained copy that rebuilt the path list from scratch. The
 * second copy lost. Its country expression read `country` off the top-level
 * values of the status index -- where `records` is an array and has no such
 * field -- so it produced nothing, and it never had a line for channel pages
 * at all. Whenever it ran last, it overwrote a 274-page sitemap with a 66-page
 * one: 63 country pages and 211 channel pages, all live, all answering 200,
 * and not one of them named anywhere a crawler looks.
 *
 * So there is now one list of addresses, built once, and every index is a
 * rendering of that list. Two files cannot disagree about what the site
 * publishes when neither of them decides it.
 *
 * ## Why `llms.txt`
 *
 * The sitemap says which addresses exist. It does not say what any of them
 * answers, so a program asked "which broadcasters in Argentina are up" has to
 * fetch and parse pages until it finds one. `llms.txt` answers it in a single
 * request. Its content is derived the same way as the sitemap's: from the
 * paths that survived an existence check, never from a hand-kept list.
 */
import type { StatusIndex, StatusIndexRecord } from "./generate-status-index.js";

export const SITE_URL = "https://xyzs996.github.io/iptv-doctor";

/** Addresses this site publishes, split by what each index may name. */
export interface SiteAddresses {
  /** HTML pages. The app root is the empty string. */
  pages: string[];
  /** Everything published that is not a page: JSON, CSV, XMLTV, M3U, iCalendar. */
  files: string[];
}

export function slug(value: string): string {
  // The fallback matters: a name that is entirely punctuation would otherwise
  // slug to nothing and the page would be written as `channels/.html`.
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "channel";
}

/**
 * Every address the site actually serves.
 *
 * `generated` is the page list from `renderStaticPages`; `worldCupCountries`
 * are the codes the guide generator covers. `exists` is asked about every
 * candidate before it is kept -- the guide pages and the XMLTV files are
 * written by a different script on a different schedule, and an index that
 * names one of them before it has run is exactly the failure these files are
 * built to avoid.
 */
export function collectAddresses(options: {
  generated: string[];
  worldCupCountries: string[];
  exists: (path: string) => boolean;
}): SiteAddresses {
  const { generated, worldCupCountries, exists } = options;
  const here = (path: string): boolean => exists(path === "" ? "index.html" : path);

  const pages = ["", ...generated, "world-cup-2026-tv-guide.html"];
  const files = ["status-index.json", "status-index.csv", "status-badge.json", "worldcup-2026.ics"];
  for (const code of worldCupCountries) {
    pages.push(`world-cup-2026-tv-guide-${code}.html`);
    files.push(`worldcup-2026-${code}.xmltv`, `worldcup-2026-${code}-placeholder.m3u`);
  }

  return {
    pages: Array.from(new Set(pages)).filter(here),
    files: Array.from(new Set(files)).filter(here)
  };
}

export function renderSitemap(addresses: SiteAddresses, updatedAt: string): string {
  const today = updatedAt.slice(0, 10);
  const urls = addresses.pages.map((path) => {
    const loc = path ? `${SITE_URL}/${path}` : `${SITE_URL}/`;
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

export function renderRobots(): string {
  return `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
}

const STATUS_WORD: Record<string, string> = { ok: "online", warn: "slow", fail: "unreachable" };

function url(path: string): string {
  return path ? `${SITE_URL}/${path}` : `${SITE_URL}/`;
}

function summary(index: StatusIndex): string {
  const { total, online, slow, offline, healthScore, countries } = index.summary;
  return `# IPTV Doctor

> Reachability of ${total} official broadcaster and public-sports websites across ${countries} countries, published as HTML, JSON and CSV. No account, no API key. ${url("")}

Last checked ${index.updatedAt}: ${online} online, ${slow} slow, ${offline} unreachable — a health score of ${healthScore} out of 100. Each record is one HTTP request to a broadcaster's own public website, with the latency and status code it returned.

## Boundary

This is metadata about official websites and nothing else. No stream URL is stored, published or derivable from anything here: records carry the host name and a hash, never an address to play. The checker exists so that people can test the legal playlists they already hold, and the guide data is placeholder metadata for that purpose. ${index.sourceNote}`;
}

function tools(addresses: SiteAddresses): string {
  const known: Array<[string, string, string]> = [
    ["status-index.html", "Live status index", "every tracked site with its last result, sortable by country and category."],
    ["iptv-playlist-checker.html", "IPTV playlist checker", "how to check an M3U or M3U8 playlist you already hold, including from CI."],
    ["m3u-checker.html", "M3U checker and cleaner", "detect dead entries and broken HLS manifests, export JSON or CSV diagnostics."]
  ];
  const lines = known
    .filter(([path]) => addresses.pages.includes(path))
    .map(([path, title, blurb]) => `- [${title}](${url(path)}): ${blurb}`);
  if (lines.length === 0) return "";
  return `## Pages\n\n${lines.join("\n")}`;
}

function dataset(index: StatusIndex, addresses: SiteAddresses): string {
  const lines: string[] = [];
  if (addresses.files.includes("status-index.json")) {
    const csv = addresses.files.includes("status-index.csv")
      ? ` · the same rows as CSV ${url("status-index.csv")}`
      : "";
    lines.push(`- All ${index.summary.total} records in one request: ${url("status-index.json")}${csv}`);
  }
  if (addresses.files.includes("status-badge.json")) {
    lines.push(`- Shields endpoint for the current health score: ${url("status-badge.json")}`);
  }
  if (lines.length === 0) return "";
  return `## Dataset

${lines.join("\n")}

One record carries \`name\`, \`country\`, \`category\`, \`language\`, \`status\` (\`ok\`, \`warn\` or \`fail\`), \`code\`, \`latencyMs\`, \`httpStatus\`, \`checkedAt\`, \`urlHost\`, \`urlHash\`, \`officialWebsite\` and \`evidence\`. \`latencyMs\` is the full response time of that request. \`checkedAt\` is when that row was proved, not when the file was written.`;
}

function countries(index: StatusIndex, addresses: SiteAddresses): string {
  const grouped = new Map<string, StatusIndexRecord[]>();
  for (const record of index.records) {
    const list = grouped.get(record.country) ?? [];
    list.push(record);
    grouped.set(record.country, list);
  }

  const lines: string[] = [];
  for (const [country, records] of Array.from(grouped).sort((a, b) => b[1].length - a[1].length)) {
    const path = `countries/${slug(country)}.html`;
    if (!addresses.pages.includes(path)) continue;
    const online = records.filter((record) => record.status === "ok").length;
    lines.push(
      `- ${country} — ${records.length} tracked, ${online} online on the last check. ${url(path)}`
    );
  }
  if (lines.length === 0) return "";
  return `## By country\n\n${lines.join("\n")}`;
}

function channels(index: StatusIndex, addresses: SiteAddresses): string {
  // One page per slug: two records that slug the same way overwrite each
  // other on disk, so the last one written is the one the page describes.
  const byPath = new Map<string, StatusIndexRecord>();
  for (const record of index.records) {
    byPath.set(`channels/${slug(record.name)}.html`, record);
  }

  const lines: string[] = [];
  for (const [path, record] of byPath) {
    if (!addresses.pages.includes(path)) continue;
    const latency = record.latencyMs === undefined ? "" : `, ${record.latencyMs} ms`;
    const official = record.officialWebsite ? ` · official site ${record.officialWebsite}` : "";
    lines.push(
      `- ${record.name} (${record.country}, ${record.category}) — ` +
        `${STATUS_WORD[record.status] ?? record.status}${latency}. ${url(path)}${official}`
    );
  }
  if (lines.length === 0) return "";
  return `## By channel\n\n${lines.join("\n")}`;
}

function worldCup(addresses: SiteAddresses): string {
  const guides = addresses.pages.filter((path) => /^world-cup-2026-tv-guide-[a-z]{2}\.html$/.test(path));
  if (guides.length === 0) return "";

  const lines = guides.map((path) => {
    const code = path.slice("world-cup-2026-tv-guide-".length, -".html".length);
    const extras = [
      [`worldcup-2026-${code}.xmltv`, "XMLTV"],
      [`worldcup-2026-${code}-placeholder.m3u`, "placeholder M3U"]
    ]
      .filter(([file]) => addresses.files.includes(file))
      .map(([file, label]) => ` · ${label} ${url(file)}`)
      .join("");
    return `- ${code.toUpperCase()} — ${url(path)}${extras}`;
  });

  const calendar = addresses.files.includes("worldcup-2026.ics")
    ? `\n\nEvery match as one iCalendar file: ${url("worldcup-2026.ics")}`
    : "";
  const index = addresses.pages.includes("world-cup-2026-tv-guide.html")
    ? `\n\nCountry index: ${url("world-cup-2026-tv-guide.html")}`
    : "";

  return `## World Cup 2026 by country

Which broadcaster holds the rights in each country, with guide metadata for the playlist tools above. Rights information only — no stream is published or implied.${index}

${lines.join("\n")}${calendar}`;
}

/**
 * The three threads that answer instead of asking.
 *
 * ⚠ **They existed and nothing pointed at them.** All three were opened,
 * all three answer 200, and the READMEs and this index between them carried
 * zero links: the discussion tab is not a place anyone browses to. That is
 * the same defect the sibling repositories were just fixed for — the thing
 * is fine, there is simply no route to it.
 *
 * ⚠ **The notes say what each thread holds, and no more.** These threads
 * answer in prose; unlike the sibling repositories' threads they carry no
 * measured figure, so nothing here may promise one. The measured numbers on
 * this project live in the status index above, which is where a note that
 * claimed them would send someone looking — and they would not find them in
 * the thread.
 */
export const THREAD_QA: Array<[number, string, string]> = [
  [1, "How do I check an IPTV M3U playlist with GitHub Actions?",
    "the workflow shape, which parts of a playlist the Action reads, and why the playlist URL stays in Secrets while only the summary is published"],
  [2, "What is the difference between an IPTV checker, M3U checker, and HLS checker?",
    "what each of the three actually tests, which one catches a malformed entry and which one catches a dead endpoint"],
  [3, "Can IPTV Doctor help with World Cup 2026 TV guide and public sports channels?",
    "which broadcaster metadata is published per country, what the guide pages carry, and the line this project does not cross"]
];

export const REPO_URL = "https://github.com/xyzs996/iptv-doctor";

function answers(): string {
  const lines = THREAD_QA.map(
    ([number, question, note]) => `- **${question}** — ${note}. ${REPO_URL}/discussions/${number}`
  );
  return `## Questions answered in full

${lines.join("\n")}`;
}

function elsewhere(): string {
  return `## Elsewhere

- Source and the checker that produces this data: https://github.com/xyzs996/iptv-doctor
- Everything published from this account: https://xyzs996.github.io/

Sibling projects by the same maintainer. Same idea: public data readable without an account, each with its own machine index.

- Free proxy health list — verified HTTP, HTTPS, SOCKS4 and SOCKS5 proxies, re-checked every 30 minutes, published with the measured share that answers again. https://xyzs996.github.io/free-proxy-health-list/llms.txt
- Free LLM API catalog — permanent free tiers for language models, every published limit linked to the page it was read from. https://xyzs996.github.io/free-llm-api/llms.txt
- AI coding field notes — write-ups on what AI coding agents actually cost, and a dataset of every figure they cite, each row kept with the sentence it was published in. https://xyzs996.github.io/ai-coding-field-notes/llms.txt`;
}

export function renderLlms(index: StatusIndex, addresses: SiteAddresses): string {
  const sections = [
    summary(index),
    tools(addresses),
    dataset(index, addresses),
    worldCup(addresses),
    countries(index, addresses),
    channels(index, addresses),
    answers(),
    elsewhere()
  ];
  return `${sections.filter((section) => section).join("\n\n")}\n`;
}
