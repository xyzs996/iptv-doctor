import { createDiagnosticsSummary, type ChannelDiagnostic } from "./diagnostics.js";
import type { M3UChannel } from "./m3u.js";

export interface UncheckedChannelDiagnostic {
  channel: M3UChannel;
  status: "unchecked" | "ok" | "error";
  message: string;
}

export function createUncheckedDiagnostics(channels: M3UChannel[]): UncheckedChannelDiagnostic[] {
  return channels.map((channel) => ({
    channel,
    status: "unchecked",
    message: "Network probe not run. Use this report as a playlist inventory."
  }));
}

export function renderDiagnosticsHtml(diagnostics: ChannelDiagnostic[]): string {
  const summary = createDiagnosticsSummary(diagnostics);
  const distribution = Object.entries(summary.errorDistribution)
    .map(([code, count]) => `<li>${escapeHtml(code)}: ${count}</li>`)
    .join("");
  const groups = Object.entries(summary.groupSummary)
    .map(
      ([group, item]) =>
        `<tr><td>${escapeHtml(group)}</td><td>${item.total}</td><td>${item.ok}</td><td>${item.warn}</td><td>${item.fail}</td></tr>`
    )
    .join("\n");
  const slowest = summary.slowest
    .map((item) => `<li>${escapeHtml(item.channel.name)}: ${item.latencyMs}ms</li>`)
    .join("");
  const rows = diagnostics
    .map(
      (item) => `<tr>
  <td>${escapeHtml(item.channel.name)}</td>
  <td>${escapeHtml(item.channel.tvgId ?? "")}</td>
  <td>${escapeHtml(item.channel.groupTitle ?? "")}</td>
  <td>${escapeHtml(item.status.toUpperCase())}</td>
  <td>${escapeHtml(item.code)}</td>
  <td>${item.latencyMs ?? ""}</td>
  <td>${item.httpStatus ?? ""}</td>
  <td>${item.sampledSegments ?? ""}</td>
  <td>${escapeHtml(item.checkedAt)}</td>
  <td>${escapeHtml(item.urlHost)}</td>
  <td>${escapeHtml(item.message)}</td>
  <td><code>${escapeHtml(item.channel.url)}</code></td>
</tr>`
    )
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>IPTV Doctor Report</title>
  <style>
    body { font-family: Inter, ui-sans-serif, system-ui, sans-serif; margin: 32px; color: #172026; background: #f7f9fb; }
    h1 { font-size: 28px; margin: 0 0 8px; }
    p { color: #53616d; }
    .summary { display: grid; grid-template-columns: repeat(4, minmax(120px, 1fr)); gap: 12px; margin: 24px 0; }
    .metric { background: white; border: 1px solid #d8e0e7; padding: 14px; }
    .metric strong { display: block; font-size: 28px; color: #163d57; }
    .commands { background: #0f1720; color: #edf7ff; padding: 16px; border-radius: 6px; overflow-x: auto; }
    .commands code { color: inherit; white-space: pre; }
    table { width: 100%; border-collapse: collapse; background: white; border: 1px solid #d8e0e7; }
    th, td { padding: 10px 12px; border-bottom: 1px solid #e7edf2; text-align: left; font-size: 14px; vertical-align: top; }
    th { background: #edf3f7; color: #24313a; }
    code { word-break: break-all; white-space: normal; }
  </style>
</head>
<body>
  <h1>IPTV Doctor Report</h1>
  <p>IPTV Doctor does not provide streams, paid channel lists, Xtream credentials, Stalker portals, MAC lists, or DRM bypass tools.</p>
  <section class="summary" aria-label="Health summary">
    <div class="metric"><strong>${summary.healthScore}%</strong><span>Health Score</span></div>
    <div class="metric"><strong>${summary.ok}</strong><span>OK</span></div>
    <div class="metric"><strong>${summary.warn}</strong><span>WARN</span></div>
    <div class="metric"><strong>${summary.fail}</strong><span>FAIL</span></div>
  </section>
  <h2>Error Distribution</h2>
  <ul>${distribution || "<li>No errors</li>"}</ul>
  <h2>Slowest Channels</h2>
  <ul>${slowest || "<li>No latency data</li>"}</ul>
  <h2>Copy Commands</h2>
  <pre class="commands"><code>npx iptv-doctor report report.json --html report.html --csv report.csv --badge badge.json
npx iptv-doctor clean playlist.m3u --out clean.m3u
npx iptv-doctor badge report.json --out badge.json</code></pre>
  <h2>Group Summary</h2>
  <table>
    <thead><tr><th>Group</th><th>Total</th><th>OK</th><th>WARN</th><th>FAIL</th></tr></thead>
    <tbody>${groups}</tbody>
  </table>
  <h2>Details</h2>
  <table>
    <thead><tr><th>Name</th><th>EPG ID</th><th>Group</th><th>Status</th><th>Code</th><th>Latency</th><th>HTTP</th><th>Segments</th><th>Checked At</th><th>Host</th><th>Message</th><th>URL</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>
`;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;");
}
