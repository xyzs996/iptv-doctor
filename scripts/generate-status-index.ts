import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { parseM3U, probePlaylist, type ChannelDiagnostic, type DiagnosticStatus, type M3UChannel } from "../packages/iptv-core/src/index.js";
import { getWorldCup2026Dataset, publicSportsChannels } from "../packages/sports-data/src/index.js";

type StatusSourceMode = "official-websites" | "private-m3u";

interface StatusIndexRecord {
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

interface StatusIndex {
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

const root = resolve(dirname(new URL(import.meta.url).pathname), "..");
const dataDir = resolve(root, "data");
const publicDir = resolve(root, "apps/worldcup-tv-guide/public");
const readmePath = resolve(root, "README.md");

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
  const topRows = index.records.slice(0, 12).map((record) =>
    `| ${record.country} | ${record.name} | ${statusLabel(record.status)} | ${record.latencyMs ?? "-"} | ${record.urlHost} | ${record.checkedAt} |`
  );

  return `## Live IPTV Status Index

Auto-updated by GitHub Actions every 2 hours for official viewing paths and private M3U health checks. Public outputs never include stream URLs; private source URLs are reduced to host names and short hashes.

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

${index.sourceNote}`;
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

await main();
