import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseM3U, probePlaylist, type ChannelDiagnostic, type DiagnosticStatus, type M3UChannel } from "../packages/iptv-core/src/index.js";
import { getWorldCup2026Dataset, publicSportsChannels } from "../packages/sports-data/src/index.js";

export type StatusSourceMode = "official-websites" | "private-m3u";

export interface StatusIndexRecord {
  id: string;
  name: string;
  country: string;
  category: string;
  language?: string;
  status: DiagnosticStatus;
  code: string;
  latencyMs?: number;
  httpStatus?: number;
  checkedAt: string;
  urlHost: string;
  urlHash: string;
  officialWebsite?: string;
  evidence?: string;
}

export interface StatusIndex {
  updatedAt: string;
  sourceMode: StatusSourceMode;
  sourceNote: string;
  summary: {
    total: number;
    online: number;
    slow: number;
    offline: number;
    healthScore: number;
    countries: number;
    categories: number;
  };
  records: StatusIndexRecord[];
}

export interface StaticPage {
  path: string;
  html: string;
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = resolve(root, "data");
const publicDir = resolve(root, "apps/worldcup-tv-guide/public");
const readmePath = resolve(root, "README.md");
const siteUrl = "https://xyzs996.github.io/iptv-doctor";

async function main(): Promise<void> {
  const index = await generateStatusIndex();
  writeOutputs(index);
  updateReadme(index);
}

async function generateStatusIndex(): Promise<StatusIndex> {
  const privateM3U = await readPrivateM3U();
  if (privateM3U) {
    const channels = parseM3U(privateM3U).slice(0, getLimit());
    const diagnostics = await probePlaylist(channels, { concurrency: 12, timeoutMs: 7000, sampleSegments: 1 });
    return buildIndex("private-m3u", "Generated from a private M3U supplied by GitHub Actions secrets. Stream URLs are never published.", diagnostics);
  }

  const channels = officialWebsiteChannels();
  const diagnostics = await probeOfficialWebsites(channels, { concurrency: 8, timeoutMs: 7000, slowThresholdMs: 2500 });
  return buildIndex(
    "official-websites",
    "Generated from official broadcaster and public sports website metadata. No stream URLs are stored or published.",
    diagnostics
  );
}

async function probeOfficialWebsites(
  channels: M3UChannel[],
  options: { concurrency: number; timeoutMs: number; slowThresholdMs: number }
): Promise<ChannelDiagnostic[]> {
  const diagnostics: ChannelDiagnostic[] = [];
  for (let index = 0; index < channels.length; index += options.concurrency) {
    const batch = channels.slice(index, index + options.concurrency);
    diagnostics.push(...(await Promise.all(batch.map((channel) => probeOfficialWebsite(channel, options)))));
  }
  return diagnostics;
}

async function probeOfficialWebsite(
  channel: M3UChannel,
  options: { timeoutMs: number; slowThresholdMs: number }
): Promise<ChannelDiagnostic> {
  const checkedAt = new Date().toISOString();
  let url: URL;
  try {
    url = new URL(channel.url);
  } catch {
    return {
      channel,
      status: "fail",
      code: "FAIL_UNSUPPORTED",
      message: "Official website URL is invalid.",
      checkedAt,
      urlHost: ""
    };
  }

  const started = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs);

  try {
    const response = await fetch(channel.url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal
    });
    const latencyMs = Date.now() - started;
    const slow = latencyMs > options.slowThresholdMs;
    return {
      channel,
      status: response.ok ? (slow ? "warn" : "ok") : "fail",
      code: response.ok ? (slow ? "WARN_SLOW" : "OK") : "FAIL_HTTP",
      message: response.ok ? "Official website is reachable." : `HTTP ${response.status}`,
      latencyMs,
      httpStatus: response.status,
      contentType: response.headers.get("content-type") ?? undefined,
      checkedAt,
      urlHost: url.host
    };
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError";
    return {
      channel,
      status: "fail",
      code: aborted ? "FAIL_TIMEOUT" : "FAIL_TLS",
      message: error instanceof Error ? error.message : String(error),
      checkedAt,
      urlHost: url.host
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function readPrivateM3U(): Promise<string | undefined> {
  if (process.env.STATUS_INDEX_M3U_TEXT?.trim()) return process.env.STATUS_INDEX_M3U_TEXT;

  if (process.env.STATUS_INDEX_M3U_FILE?.trim()) {
    return readFileSync(resolve(root, process.env.STATUS_INDEX_M3U_FILE), "utf8");
  }

  if (process.env.STATUS_INDEX_M3U_URL?.trim()) {
    const response = await fetch(process.env.STATUS_INDEX_M3U_URL);
    if (!response.ok) throw new Error(`Unable to fetch STATUS_INDEX_M3U_URL: HTTP ${response.status}`);
    return response.text();
  }

  return undefined;
}

function officialWebsiteChannels(): M3UChannel[] {
  const dataset = getWorldCup2026Dataset();
  const broadcasters = Object.values(dataset.broadcasters)
    .flatMap((region) => region?.channels ?? [])
    .map((channel) => ({
      name: channel.name,
      url: channel.website,
      tvgId: channel.id,
      tvgName: channel.name,
      groupTitle: `${channel.country} World Cup 2026`
    }));

  const publicChannels = publicSportsChannels.map((channel) => ({
    name: channel.name,
    url: channel.officialWebsite,
    tvgId: channel.id,
    tvgName: channel.name,
    groupTitle: `${channel.country} Public Sports`
  }));

  return dedupeChannels([...broadcasters, ...publicChannels]).slice(0, getLimit());
}

function getLimit(): number {
  const value = Number(process.env.STATUS_INDEX_LIMIT ?? "250");
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : 250;
}

function dedupeChannels(channels: M3UChannel[]): M3UChannel[] {
  const seen = new Set<string>();
  return channels.filter((channel) => {
    const key = `${channel.name}:${channel.url}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function buildIndex(sourceMode: StatusSourceMode, sourceNote: string, diagnostics: ChannelDiagnostic[]): StatusIndex {
  const records = diagnostics.map(toRecord);
  const online = records.filter((item) => item.status === "ok").length;
  const slow = records.filter((item) => item.status === "warn").length;
  const offline = records.filter((item) => item.status === "fail").length;
  const total = records.length;
  const healthScore = total === 0 ? 0 : Math.round(((online + slow * 0.5) / total) * 100);

  return {
    updatedAt: new Date().toISOString(),
    sourceMode,
    sourceNote,
    summary: {
      total,
      online,
      slow,
      offline,
      healthScore,
      countries: new Set(records.map((item) => item.country)).size,
      categories: new Set(records.map((item) => item.category)).size
    },
    records: records.sort((left, right) => statusWeight(left.status) - statusWeight(right.status) || left.name.localeCompare(right.name))
  };
}

function toRecord(diagnostic: ChannelDiagnostic): StatusIndexRecord {
  const official = findOfficialMetadata(diagnostic.channel);
  const urlHash = createHash("sha256").update(diagnostic.channel.url).digest("hex").slice(0, 16);
  const group = diagnostic.channel.groupTitle ?? "Ungrouped";
  const [country, ...categoryParts] = group.split(" ");

  return {
    id: diagnostic.channel.tvgId || diagnostic.channel.tvgName || `${slug(diagnostic.channel.name)}-${urlHash}`,
    name: diagnostic.channel.name,
    country: official?.country ?? country,
    category: categoryParts.join(" ") || group,
    language: official?.language,
    status: diagnostic.status,
    code: diagnostic.code,
    latencyMs: diagnostic.latencyMs,
    httpStatus: diagnostic.httpStatus,
    checkedAt: diagnostic.checkedAt,
    urlHost: diagnostic.urlHost,
    urlHash,
    officialWebsite: official?.officialWebsite,
    evidence: official?.evidence
  };
}

function findOfficialMetadata(channel: M3UChannel):
  | { country: string; language?: string; officialWebsite?: string; evidence?: string }
  | undefined {
  const publicChannel = publicSportsChannels.find((item) => item.id === channel.tvgId);
  if (publicChannel) {
    return {
      country: publicChannel.country,
      language: publicChannel.language,
      officialWebsite: publicChannel.officialWebsite,
      evidence: publicChannel.evidence
    };
  }

  const broadcaster = Object.values(getWorldCup2026Dataset().broadcasters)
    .flatMap((region) => region?.channels ?? [])
    .find((item) => item.id === channel.tvgId);
  if (!broadcaster) return undefined;

  return {
    country: broadcaster.country,
    language: broadcaster.language,
    officialWebsite: broadcaster.website,
    evidence: broadcaster.notes
  };
}

function statusWeight(status: DiagnosticStatus): number {
  if (status === "ok") return 0;
  if (status === "warn") return 1;
  return 2;
}

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "channel";
}

function writeOutputs(index: StatusIndex): void {
  mkdirSync(dataDir, { recursive: true });
  mkdirSync(publicDir, { recursive: true });

  const json = `${JSON.stringify(index, null, 2)}\n`;
  const csv = renderCsv(index);
  const badge = `${JSON.stringify(renderBadge(index), null, 2)}\n`;

  for (const dir of [dataDir, publicDir]) {
    writeFileSync(resolve(dir, "status-index.json"), json);
    writeFileSync(resolve(dir, "status-index.csv"), csv);
    writeFileSync(resolve(dir, "status-badge.json"), badge);
  }

  for (const page of renderStaticPages(index)) {
    const target = resolve(publicDir, page.path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, page.html);
  }

  const worldCupCountries = Object.keys(getWorldCup2026Dataset().broadcasters).map((c) => c.toLowerCase());
  writeFileSync(resolve(publicDir, "sitemap.xml"), renderSitemap(index, worldCupCountries));
  writeFileSync(resolve(publicDir, "robots.txt"), renderRobots());
}

function renderCsv(index: StatusIndex): string {
  const rows = index.records.map((record) =>
    [
      record.name,
      record.country,
      record.category,
      record.language ?? "",
      record.status,
      record.code,
      record.latencyMs ?? "",
      record.httpStatus ?? "",
      record.urlHost,
      record.urlHash,
      record.checkedAt
    ]
      .map((value) => `"${String(value).replaceAll('"', '""')}"`)
      .join(",")
  );
  return `${["name,country,category,language,status,code,latencyMs,httpStatus,urlHost,urlHash,checkedAt", ...rows].join("\n")}\n`;
}

function renderBadge(index: StatusIndex): { schemaVersion: 1; label: string; message: string; color: string } {
  const { online, total, healthScore } = index.summary;
  return {
    schemaVersion: 1,
    label: "IPTV status",
    message: `${online}/${total} online · ${healthScore}%`,
    color: healthScore >= 80 ? "brightgreen" : healthScore >= 50 ? "yellow" : "red"
  };
}

function updateReadme(index: StatusIndex): void {
  const readme = readFileSync(readmePath, "utf8");
  const start = "<!-- status-index:start -->";
  const end = "<!-- status-index:end -->";
  const section = `${start}\n${renderReadmeSection(index)}\n${end}`;
  let nextReadme: string;

  if (readme.includes(start) && readme.includes(end)) {
    nextReadme = readme.replace(new RegExp(`${start}[\\s\\S]*?${end}`), section);
  } else {
    const insertAfter = "npm package: https://www.npmjs.com/package/iptv-doctor\n";
    nextReadme = readme.replace(insertAfter, `${insertAfter}\n${section}\n`);
  }

  writeFileSync(readmePath, `${nextReadme.trimEnd()}\n`);
}

function renderReadmeSection(index: StatusIndex): string {
  const topRows = index.records.slice(0, 20).map((record) =>
    `| ${record.country} | ${record.name} | ${statusLabel(record.status)} | ${record.latencyMs ?? "-"} | ${record.urlHost} | ${record.checkedAt} |`
  );

  return `## Live IPTV Status Index

Auto-updated by GitHub Actions every 2 hours for official viewing paths and private M3U health checks. Public outputs never include stream URLs; private source URLs are reduced to host names and short hashes. Star this repo if you want a reusable IPTV status index and playlist health workflow.

| Metric | Value |
|---|---:|
| Last updated | ${index.updatedAt} |
| Source mode | ${sourceModeLabel(index.sourceMode)} |
| Total entries checked | ${index.summary.total} |
| Online | ${index.summary.online} |
| Slow / warning | ${index.summary.slow} |
| Offline | ${index.summary.offline} |
| Health score | ${index.summary.healthScore}% |
| Countries | ${index.summary.countries} |
| Categories | ${index.summary.categories} |

| Country | Entry | Status | Latency ms | Host | Checked at |
|---|---|---|---:|---|---|
${topRows.join("\n")}

Machine-readable outputs:

- [status-index.json](data/status-index.json)
- [status-index.csv](data/status-index.csv)
- [status-badge.json](data/status-badge.json)

Crawlable pages:

- [Live IPTV Status Index](${siteUrl}/status-index.html)
- [IPTV Playlist Checker](${siteUrl}/iptv-playlist-checker.html)
- [M3U Checker](${siteUrl}/m3u-checker.html)
- [World Cup 2026 TV Guide](${siteUrl}/world-cup-2026-tv-guide.html)

${index.sourceNote}`;
}

export function renderStaticPages(index: StatusIndex): StaticPage[] {
  const pages: StaticPage[] = [
    {
      path: "status-index.html",
      html: renderSeoPage(index, {
        path: "status-index.html",
        title: "Live IPTV Status Index",
        description: "Auto-updated IPTV status index with official website checks, country pages, channel pages, JSON, CSV, and badge output.",
        heading: "Live IPTV Status Index",
        records: index.records
      })
    },
    {
      path: "iptv-playlist-checker.html",
      html: renderSeoPage(index, {
        path: "iptv-playlist-checker.html",
        title: "IPTV Playlist Checker",
        description: "Open-source IPTV playlist checker for M3U, M3U8, HLS, XMLTV, GitHub Actions health reports, and Shields badges.",
        heading: "IPTV Playlist Checker",
        intro: "Use IPTV Doctor to check your own legal M3U or M3U8 playlist, detect broken HLS manifests, sample media segments, and publish health reports from CI.",
        records: index.records.slice(0, 50)
      })
    },
    {
      path: "m3u-checker.html",
      html: renderSeoPage(index, {
        path: "m3u-checker.html",
        title: "M3U Checker and M3U8 Cleaner",
        description: "Check M3U and M3U8 playlists, clean dead IPTV entries, inspect host health, and export JSON or CSV diagnostics.",
        heading: "M3U Checker and M3U8 Cleaner",
        intro: "This page is a static entry point for users searching for M3U checker, M3U8 checker, HLS checker, and playlist cleaner workflows.",
        records: index.records.slice(0, 50)
      })
    },
    {
      path: "world-cup-2026-tv-guide.html",
      html: renderSeoPage(index, {
        path: "world-cup-2026-tv-guide.html",
        title: "World Cup 2026 TV Guide Metadata",
        description: "Legal World Cup 2026 TV metadata, official broadcaster website checks, XMLTV, iCalendar, and placeholder M3U workflows.",
        heading: "World Cup 2026 TV Guide Metadata",
        intro: "IPTV Doctor stores official website metadata and placeholder guide data only. It does not publish stream URLs or paid channel lists.",
        records: index.records.filter((record) => record.category.includes("World Cup")).slice(0, 80)
      })
    }
  ];

  for (const [country, records] of groupBy(index.records, (record) => record.country)) {
    pages.push({
      path: `countries/${slug(country)}.html`,
      html: renderSeoPage(index, {
        path: `countries/${slug(country)}.html`,
        title: `${country} IPTV Status Index`,
        description: `${country} official IPTV and sports website status checks with latency, host, JSON, and CSV metadata.`,
        heading: `${country} IPTV Status Index`,
        intro: `Auto-updated public metadata for ${country}. No stream URLs are published.`,
        records
      })
    });
  }

  for (const record of index.records) {
    pages.push({
      path: `channels/${slug(record.name)}.html`,
      html: renderSeoPage(index, {
        path: `channels/${slug(record.name)}.html`,
        title: `${record.name} IPTV Status`,
        description: `${record.name} official website status, host metadata, latency, country, category, and IPTV Doctor diagnostics.`,
        heading: `${record.name} IPTV Status`,
        intro: `${record.name} is tracked as public metadata only. IPTV Doctor stores host names and URL hashes, not stream URLs.`,
        records: [record]
      })
    });
  }

  return pages;
}

function renderSeoPage(
  index: StatusIndex,
  options: { path: string; title: string; description: string; heading: string; intro?: string; records: StatusIndexRecord[] }
): string {
  const canonical = `${siteUrl}/${options.path}`;
  const rows = options.records
    .map(
      (record) => `<tr>
  <td>${escapeHtml(record.country)}</td>
  <td>${escapeHtml(record.name)}</td>
  <td>${escapeHtml(statusLabel(record.status))}</td>
  <td>${escapeHtml(String(record.latencyMs ?? "-"))}</td>
  <td>${escapeHtml(record.urlHost)}</td>
  <td>${escapeHtml(record.checkedAt)}</td>
</tr>`
    )
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(options.title)} - IPTV Doctor</title>
  <meta name="description" content="${escapeHtml(options.description)}">
  <meta name="robots" content="index,follow">
  <link rel="canonical" href="${escapeHtml(canonical)}">
  <link rel="alternate" type="application/json" href="${siteUrl}/status-index.json" title="Live IPTV Status Index JSON">
  <link rel="alternate" type="text/csv" href="${siteUrl}/status-index.csv" title="Live IPTV Status Index CSV">
  <script type="application/ld+json">${JSON.stringify(datasetJsonLd(index, options.title, options.description), null, 2)}</script>
  <style>
    body { background: #f6f8f4; color: #172026; font-family: Inter, ui-sans-serif, system-ui, sans-serif; margin: 0; }
    main { margin: 0 auto; max-width: 1120px; padding: 32px; }
    a { color: #163d57; font-weight: 700; }
    h1 { font-size: 36px; line-height: 1.05; margin: 0 0 10px; }
    p { color: #52626d; line-height: 1.55; max-width: 820px; }
    .summary { display: grid; gap: 1px; grid-template-columns: repeat(4, minmax(0, 1fr)); margin: 24px 0; }
    .summary div { background: #e5ece3; padding: 16px; }
    .summary strong { color: #163d57; display: block; font-size: 28px; }
    table { background: white; border: 1px solid #d7dfd5; border-collapse: collapse; width: 100%; }
    th, td { border-bottom: 1px solid #e4e8e0; padding: 10px 12px; text-align: left; }
    th { background: #edf3f7; font-size: 13px; text-transform: uppercase; }
    nav { display: flex; flex-wrap: wrap; gap: 12px; margin: 20px 0; }
    @media (max-width: 760px) { main { padding: 20px; } .summary { grid-template-columns: repeat(2, minmax(0, 1fr)); } table { font-size: 13px; } }
  </style>
</head>
<body>
<main>
  <h1>${escapeHtml(options.heading)}</h1>
  <p>${escapeHtml(options.intro ?? "Auto-updated official IPTV and sports website status metadata. Public outputs never include stream URLs, credentials, or paid channel lists.")}</p>
  <nav>
    <a href="${siteUrl}/">App</a>
    <a href="${siteUrl}/status-index.json">JSON</a>
    <a href="${siteUrl}/status-index.csv">CSV</a>
    <a href="https://github.com/xyzs996/iptv-doctor">GitHub</a>
  </nav>
  <section class="summary">
    <div><strong>${index.summary.total}</strong><span>entries checked</span></div>
    <div><strong>${index.summary.online}</strong><span>online</span></div>
    <div><strong>${index.summary.offline}</strong><span>offline</span></div>
    <div><strong>${index.summary.healthScore}%</strong><span>health score</span></div>
  </section>
  <table>
    <thead><tr><th>Country</th><th>Entry</th><th>Status</th><th>Latency ms</th><th>Host</th><th>Checked at</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
</main>
</body>
</html>
`;
}

function datasetJsonLd(index: StatusIndex, name: string, description: string): object {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name,
    description,
    url: `${siteUrl}/status-index.json`,
    dateModified: index.updatedAt,
    distribution: [
      { "@type": "DataDownload", encodingFormat: "application/json", contentUrl: `${siteUrl}/status-index.json` },
      { "@type": "DataDownload", encodingFormat: "text/csv", contentUrl: `${siteUrl}/status-index.csv` }
    ],
    keywords: ["IPTV status index", "IPTV playlist checker", "M3U checker", "M3U8 checker", "HLS checker"]
  };
}

function renderSitemap(index: StatusIndex, worldCupCountries: string[] = []): string {
  const today = index.updatedAt.slice(0, 10);
  const staticPaths = ["", ...renderStaticPages(index).map((page) => page.path)];
  const worldCupPaths = [
    "world-cup-2026-tv-guide.html",
    ...worldCupCountries.map((cc) => `world-cup-2026-tv-guide-${cc}.html`)
  ];
  const allPaths = Array.from(new Set([...staticPaths, ...worldCupPaths]));
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

function renderRobots(): string {
  return `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;
}

function groupBy<T>(items: T[], keyOf: (item: T) => string): Map<string, T[]> {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const key = keyOf(item);
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }
  return groups;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

function statusLabel(status: DiagnosticStatus): string {
  if (status === "ok") return "ONLINE";
  if (status === "warn") return "SLOW";
  return "OFFLINE";
}

function sourceModeLabel(sourceMode: StatusSourceMode): string {
  if (sourceMode === "private-m3u") return "private M3U";
  return "official websites";
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
