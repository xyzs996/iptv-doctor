import { chmodSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { generateICalendar, generateM3UPlaceholder, generateWorldCupGuideHtml, generateXMLTV } from "../packages/match2epg/src/generators";
import { getWorldCup2026Dataset } from "../packages/sports-data/src/worldcup2026";
import { renderCleanM3U } from "../packages/iptv-core/src/clean";
import type { ChannelDiagnostic } from "../packages/iptv-core/src/diagnostics";
import { renderJsonReport } from "../packages/iptv-core/src/diagnostics";
import { renderDiagnosticsHtml } from "../packages/iptv-core/src/report";

export interface ReleaseArtifact {
  name: string;
  path: string;
}

export function generateReleaseArtifacts(outDir: string): ReleaseArtifact[] {
  mkdirSync(outDir, { recursive: true });

  const dataset = getWorldCup2026Dataset();
  const sampleDiagnostics = createSampleDiagnostics();
  const files: Array<[string, string]> = [
    ["iptv-doctor-linux-x64", createPosixLauncher()],
    ["iptv-doctor-macos-arm64", createPosixLauncher()],
    ["iptv-doctor-windows-x64.cmd", createWindowsLauncher()],
    ["worldcup-2026-us.xmltv", generateXMLTV(dataset, "US")],
    ["worldcup-2026-us.ics", generateICalendar(dataset)],
    ["worldcup-2026-us-placeholder.m3u", generateM3UPlaceholder(dataset, "US")],
    ["worldcup-2026-guide.html", generateWorldCupGuideHtml(dataset, "US")],
    ["sample-report.html", renderDiagnosticsHtml(sampleDiagnostics)],
    ["sample-report.json", renderJsonReport(sampleDiagnostics)],
    ["sample-clean.m3u", renderCleanM3U(sampleDiagnostics)]
  ];

  return files.map(([name, content]) => {
    const path = join(outDir, name);
    writeFileSync(path, content);
    if (name === "iptv-doctor-linux-x64" || name === "iptv-doctor-macos-arm64") {
      chmodSync(path, 0o755);
    }
    return { name, path };
  });
}

function createPosixLauncher(): string {
  return `#!/usr/bin/env sh
set -eu
exec npx iptv-doctor "$@"
`;
}

function createWindowsLauncher(): string {
  return `@echo off
npx iptv-doctor %*
`;
}

function createSampleDiagnostics(): ChannelDiagnostic[] {
  const checkedAt = "2026-06-20T00:00:00.000Z";
  return [
    {
      channel: {
        name: "FOX",
        tvgId: "fox.us",
        groupTitle: "World Cup 2026",
        url: "https://example.invalid/add-your-legal-stream"
      },
      status: "ok",
      code: "OK",
      message: "Playlist is readable.",
      latencyMs: 430,
      httpStatus: 200,
      contentType: "application/vnd.apple.mpegurl",
      playlistItems: 1,
      sampledSegments: 1,
      checkedAt,
      urlHost: "example.invalid"
    },
    {
      channel: {
        name: "FS1",
        tvgId: "fs1.us",
        groupTitle: "World Cup 2026",
        url: "https://example.invalid/slow-legal-stream"
      },
      status: "warn",
      code: "WARN_SLOW",
      message: "Response exceeded 2500ms slow threshold.",
      latencyMs: 2800,
      httpStatus: 200,
      contentType: "application/vnd.apple.mpegurl",
      playlistItems: 1,
      sampledSegments: 1,
      checkedAt,
      urlHost: "example.invalid"
    },
    {
      channel: {
        name: "Demo Broken",
        groupTitle: "World Cup 2026",
        url: "https://example.invalid/broken"
      },
      status: "fail",
      code: "FAIL_HTTP",
      message: "HTTP 404",
      latencyMs: 120,
      httpStatus: 404,
      checkedAt,
      urlHost: "example.invalid"
    }
  ];
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const outDir = process.argv[2] ?? "dist/release";
  for (const artifact of generateReleaseArtifacts(outDir)) {
    process.stdout.write(`${artifact.path}\n`);
  }
}
