import type { M3UChannel } from "./m3u.js";

export type DiagnosticStatus = "ok" | "warn" | "fail";

export type DiagnosticCode =
  | "OK"
  | "WARN_SLOW"
  | "FAIL_DNS"
  | "FAIL_TLS"
  | "FAIL_HTTP"
  | "FAIL_MANIFEST"
  | "FAIL_TIMEOUT"
  | "FAIL_UNSUPPORTED";

export interface ProbeOptions {
  timeoutMs?: number;
  concurrency?: number;
  slowThresholdMs?: number;
  sampleSegments?: number;
  fetchImpl?: typeof fetch;
  now?: () => Date;
  clock?: (operation: () => Promise<Response>) => Promise<number>;
}

export interface ChannelDiagnostic {
  channel: M3UChannel;
  status: DiagnosticStatus;
  code: DiagnosticCode;
  message: string;
  latencyMs?: number;
  httpStatus?: number;
  contentType?: string;
  playlistItems?: number;
  sampledSegments?: number;
  checkedAt: string;
  urlHost: string;
}

export interface DiagnosticsSummary {
  total: number;
  ok: number;
  warn: number;
  fail: number;
  healthScore: number;
  errorDistribution: Record<string, number>;
  groupSummary: Record<string, { total: number; ok: number; warn: number; fail: number }>;
  slowest: ChannelDiagnostic[];
}

const DEFAULTS = {
  timeoutMs: 8000,
  concurrency: 16,
  slowThresholdMs: 2500,
  sampleSegments: 1
};

export function getDefaultProbeOptions(): Required<Pick<ProbeOptions, "timeoutMs" | "concurrency" | "slowThresholdMs" | "sampleSegments">> {
  return DEFAULTS;
}

export async function probeChannel(channel: M3UChannel, options: ProbeOptions = {}): Promise<ChannelDiagnostic> {
  const checkedAt = (options.now ?? (() => new Date()))().toISOString();
  const urlInfo = parseUrl(channel.url);

  if (!urlInfo || !["http:", "https:"].includes(urlInfo.protocol)) {
    return failure(channel, "FAIL_UNSUPPORTED", "Only HTTP and HTTPS playlist URLs are supported.", checkedAt, urlInfo?.host ?? "");
  }

  const fetchImpl = options.fetchImpl ?? fetch;
  const timeoutMs = options.timeoutMs ?? DEFAULTS.timeoutMs;
  const started = Date.now();

  try {
    const response = await withTimeout(() => fetchImpl(channel.url), timeoutMs);
    const latencyMs = options.clock ? await options.clock(async () => response) : Date.now() - started;
    const contentType = response.headers.get("content-type") ?? undefined;

    if (!response.ok) {
      return {
        channel,
        status: "fail",
        code: "FAIL_HTTP",
        message: `HTTP ${response.status}`,
        latencyMs,
        httpStatus: response.status,
        contentType,
        checkedAt,
        urlHost: urlInfo.host
      };
    }

    const body = await response.text();
    if (!isHlsManifest(body, channel.url)) {
      return {
        channel,
        status: "fail",
        code: "FAIL_MANIFEST",
        message: "Response is not a readable M3U/HLS manifest.",
        latencyMs,
        httpStatus: response.status,
        contentType,
        checkedAt,
        urlHost: urlInfo.host
      };
    }

    const playlistItems = countPlaylistItems(body);
    const sampledSegments = await sampleMediaSegments(body, channel.url, fetchImpl, timeoutMs, options.sampleSegments ?? DEFAULTS.sampleSegments);
    const slowThresholdMs = options.slowThresholdMs ?? DEFAULTS.slowThresholdMs;
    const slow = latencyMs > slowThresholdMs;

    return {
      channel,
      status: slow ? "warn" : "ok",
      code: slow ? "WARN_SLOW" : "OK",
      message: slow ? `Response exceeded ${slowThresholdMs}ms slow threshold.` : "Playlist is readable.",
      latencyMs,
      httpStatus: response.status,
      contentType,
      playlistItems,
      sampledSegments,
      checkedAt,
      urlHost: urlInfo.host
    };
  } catch (error) {
    const code = classifyFetchError(error);
    return failure(channel, code, error instanceof Error ? error.message : String(error), checkedAt, urlInfo.host);
  }
}

export async function probePlaylist(channels: M3UChannel[], options: ProbeOptions = {}): Promise<ChannelDiagnostic[]> {
  const concurrency = Math.max(1, options.concurrency ?? DEFAULTS.concurrency);
  const diagnostics: ChannelDiagnostic[] = [];

  for (let index = 0; index < channels.length; index += concurrency) {
    const batch = channels.slice(index, index + concurrency);
    diagnostics.push(...(await Promise.all(batch.map((channel) => probeChannel(channel, options)))));
  }

  return diagnostics;
}

export function createDiagnosticsSummary(diagnostics: ChannelDiagnostic[]): DiagnosticsSummary {
  const summary: DiagnosticsSummary = {
    total: diagnostics.length,
    ok: diagnostics.filter((item) => item.status === "ok").length,
    warn: diagnostics.filter((item) => item.status === "warn").length,
    fail: diagnostics.filter((item) => item.status === "fail").length,
    healthScore: 0,
    errorDistribution: {},
    groupSummary: {},
    slowest: diagnostics
      .filter((item) => typeof item.latencyMs === "number")
      .sort((left, right) => (right.latencyMs ?? 0) - (left.latencyMs ?? 0))
      .slice(0, 10)
  };

  summary.healthScore = summary.total === 0 ? 0 : Math.round(((summary.ok + summary.warn * 0.5) / summary.total) * 100);

  for (const item of diagnostics) {
    if (item.status === "fail" || item.status === "warn") {
      summary.errorDistribution[item.code] = (summary.errorDistribution[item.code] ?? 0) + 1;
    }
    const group = item.channel.groupTitle ?? "Ungrouped";
    summary.groupSummary[group] ??= { total: 0, ok: 0, warn: 0, fail: 0 };
    summary.groupSummary[group].total += 1;
    summary.groupSummary[group][item.status] += 1;
  }

  return summary;
}

export function renderJsonReport(diagnostics: ChannelDiagnostic[]): string {
  return `${JSON.stringify({ summary: createDiagnosticsSummary(diagnostics), diagnostics }, null, 2)}\n`;
}

export function renderCsvReport(diagnostics: ChannelDiagnostic[]): string {
  const header = "name,status,code,latencyMs,httpStatus,contentType,playlistItems,sampledSegments,urlHost,url";
  const rows = diagnostics.map((item) =>
    [
      item.channel.name,
      item.status,
      item.code,
      item.latencyMs ?? "",
      item.httpStatus ?? "",
      item.contentType ?? "",
      item.playlistItems ?? "",
      item.sampledSegments ?? "",
      item.urlHost,
      item.channel.url
    ]
      .map(csvCell)
      .join(",")
  );
  return `${[header, ...rows].join("\n")}\n`;
}

function failure(channel: M3UChannel, code: DiagnosticCode, message: string, checkedAt: string, urlHost: string): ChannelDiagnostic {
  return {
    channel,
    status: "fail",
    code,
    message,
    checkedAt,
    urlHost
  };
}

function parseUrl(value: string): URL | undefined {
  try {
    return new URL(value);
  } catch {
    return undefined;
  }
}

async function withTimeout(operation: () => Promise<Response>, timeoutMs: number): Promise<Response> {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      operation(),
      new Promise<Response>((_, reject) => {
        timeout = setTimeout(() => reject(new Error(`Timed out after ${timeoutMs}ms`)), timeoutMs);
      })
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

function isHlsManifest(body: string, _url: string): boolean {
  return body.trimStart().startsWith("#EXTM3U");
}

function countPlaylistItems(body: string): number {
  return body.split(/\r?\n/).filter((line) => line.trim().startsWith("#EXTINF")).length;
}

async function sampleMediaSegments(
  body: string,
  manifestUrl: string,
  fetchImpl: typeof fetch,
  timeoutMs: number,
  sampleSegments: number
): Promise<number> {
  if (sampleSegments <= 0) return 0;

  const segments = findMediaSegments(body).slice(0, sampleSegments);
  let sampled = 0;

  for (const segment of segments) {
    const segmentUrl = new URL(segment, manifestUrl).toString();
    const response = await withTimeout(() => fetchImpl(segmentUrl), timeoutMs);
    if (!response.ok) {
      throw new Error(`Segment sample failed with HTTP ${response.status}`);
    }
    sampled += 1;
  }

  return sampled;
}

function findMediaSegments(body: string): string[] {
  return body
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));
}

function classifyFetchError(error: unknown): DiagnosticCode {
  const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
  if (message.includes("timed out") || message.includes("abort")) return "FAIL_TIMEOUT";
  if (message.includes("segment sample failed")) return "FAIL_MANIFEST";
  if (message.includes("dns") || message.includes("enotfound") || message.includes("getaddrinfo")) return "FAIL_DNS";
  if (message.includes("tls") || message.includes("certificate") || message.includes("ssl")) return "FAIL_TLS";
  return "FAIL_TLS";
}

function csvCell(value: unknown): string {
  const stringValue = String(value);
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replaceAll("\"", "\"\"")}"`;
  }
  return stringValue;
}
