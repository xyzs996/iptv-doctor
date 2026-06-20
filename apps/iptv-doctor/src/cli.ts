#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { generateICalendar, generateM3UPlaceholder, generateWorldCupGuideHtml, generateXMLTV } from "match2epg";
import { getWorldCup2026Dataset, type CountryCode } from "iptv-sports-data";
import { IPTV_DOCTOR_MCP_TOOLS, runIptvDoctorMcpServer } from "./mcp.js";
import {
  parseM3U,
  probePlaylist,
  analyzeEpgMatches,
  renderShieldsBadgeJson,
  renderCleanM3U,
  renderCsvReport,
  renderDiagnosticsHtml,
  renderFixedEpgM3U,
  renderJsonReport,
  type ChannelDiagnostic,
  type ProbeOptions
} from "iptv-doctor-core";

function usage(): string {
  return `Usage:
  iptv-doctor check <playlist.m3u> --report report.html [--json report.json] [--csv report.csv] [--badge badge.json]
  iptv-doctor clean <playlist.m3u> --out clean.m3u
  iptv-doctor epg check <playlist.m3u> <guide.xml> --json epg.json
  iptv-doctor epg fix <playlist.m3u> <guide.xml> --out fixed.m3u
  iptv-doctor report <report.json> [--html report.html] [--csv report.csv] [--badge badge.json]
  iptv-doctor badge <report.json> --out badge.json
  iptv-doctor mcp [--list-tools]
  iptv-doctor worldcup --country US --format xmltv|ics|m3u|html --out worldcup.xml`;
}

export interface IptvDoctorCliOptions extends ProbeOptions {
  stdout?: (value: string) => void;
}

export async function runIptvDoctorCli(argv = process.argv, options: IptvDoctorCliOptions = {}): Promise<void> {
  const command = argv[2];

  if (!command || command === "--help" || command === "-h" || command === "help") {
    writeStdout(options, `${usage()}\n`);
    return;
  }

  if (command === "check") {
    await runCheck(argv.slice(3), options);
    return;
  }

  if (command === "clean") {
    await runClean(argv.slice(3), options);
    return;
  }

  if (command === "worldcup") {
    runWorldCup(argv.slice(3));
    return;
  }

  if (command === "epg") {
    runEpg(argv.slice(3));
    return;
  }

  if (command === "badge") {
    runBadge(argv.slice(3), options);
    return;
  }

  if (command === "report") {
    runReport(argv.slice(3), options);
    return;
  }

  if (command === "mcp") {
    await runMcp(argv.slice(3), options);
    return;
  }

  throw new Error(usage());
}

async function runCheck(args: string[], options: IptvDoctorCliOptions): Promise<void> {
  const input = args[0];
  if (!input) throw new Error(usage());
  const report = readFlag(args, "--report") ?? "iptv-doctor-report.html";
  const json = readFlag(args, "--json");
  const csv = readFlag(args, "--csv");
  const badge = readFlag(args, "--badge");

  const playlist = readFileSync(input, "utf8");
  const channels = parseM3U(playlist);
  const diagnostics = await probePlaylist(channels, options);
  writeFileSync(report, renderDiagnosticsHtml(diagnostics));
  if (json) writeFileSync(json, renderJsonReport(diagnostics));
  if (csv) writeFileSync(csv, renderCsvReport(diagnostics));
  if (badge) writeFileSync(badge, renderShieldsBadgeJson(diagnostics));
  process.stdout.write(`Checked ${channels.length} channels. Report written to ${report}\n`);
}

async function runClean(args: string[], options: IptvDoctorCliOptions): Promise<void> {
  const input = args[0];
  const output = readFlag(args, "--out");
  if (!input || !output) throw new Error(usage());

  const playlist = readFileSync(input, "utf8");
  const channels = parseM3U(playlist);
  const diagnostics = await probePlaylist(channels, options);
  writeFileSync(output, renderCleanM3U(diagnostics));
  process.stdout.write(`Wrote clean playlist to ${output}\n`);
}

function runEpg(args: string[]): void {
  const subcommand = args[0];
  const playlistPath = args[1];
  const guidePath = args[2];
  if (!subcommand || !playlistPath || !guidePath) throw new Error(usage());

  const playlist = readFileSync(playlistPath, "utf8");
  const guide = readFileSync(guidePath, "utf8");

  if (subcommand === "check") {
    const json = readFlag(args, "--json");
    const result = `${JSON.stringify(analyzeEpgMatches(playlist, guide), null, 2)}\n`;
    if (json) {
      writeFileSync(json, result);
    } else {
      process.stdout.write(result);
    }
    return;
  }

  if (subcommand === "fix") {
    const output = readFlag(args, "--out");
    if (!output) throw new Error(usage());
    writeFileSync(output, renderFixedEpgM3U(playlist, guide));
    process.stdout.write(`Wrote EPG-fixed playlist to ${output}\n`);
    return;
  }

  throw new Error(usage());
}

function runBadge(args: string[], options: IptvDoctorCliOptions): void {
  const input = args[0];
  const output = readFlag(args, "--out");
  if (!input || !output) throw new Error(usage());

  const diagnostics = readDiagnosticsReport(input);

  writeFileSync(output, renderShieldsBadgeJson(diagnostics));
  writeStdout(options, `Wrote health badge JSON to ${output}\n`);
}

function runReport(args: string[], options: IptvDoctorCliOptions): void {
  const input = args[0];
  if (!input) throw new Error(usage());

  const html = readFlag(args, "--html");
  const csv = readFlag(args, "--csv");
  const badge = readFlag(args, "--badge");
  if (!html && !csv && !badge) throw new Error(usage());

  const diagnostics = readDiagnosticsReport(input);
  if (html) writeFileSync(html, renderDiagnosticsHtml(diagnostics));
  if (csv) writeFileSync(csv, renderCsvReport(diagnostics));
  if (badge) writeFileSync(badge, renderShieldsBadgeJson(diagnostics));
  writeStdout(options, `Rendered report assets from ${input}\n`);
}

async function runMcp(args: string[], options: IptvDoctorCliOptions): Promise<void> {
  if (args.includes("--list-tools")) {
    writeStdout(options, `${IPTV_DOCTOR_MCP_TOOLS.join("\n")}\n`);
    return;
  }

  await runIptvDoctorMcpServer();
}

function runWorldCup(args: string[]): void {
  const country = (readFlag(args, "--country") ?? "US") as CountryCode;
  const format = readFlag(args, "--format") ?? "xmltv";
  const output = readFlag(args, "--out");
  if (!output) throw new Error(usage());

  if (!["US", "CA", "MX"].includes(country)) {
    throw new Error("World Cup country must be one of US, CA, MX.");
  }

  const dataset = getWorldCup2026Dataset();
  const content =
    format === "xmltv"
      ? generateXMLTV(dataset, country)
      : format === "ics"
        ? generateICalendar(dataset)
        : format === "m3u"
          ? generateM3UPlaceholder(dataset, country)
          : format === "html"
            ? generateWorldCupGuideHtml(dataset, country)
          : undefined;

  if (!content) throw new Error("World Cup format must be one of xmltv, ics, m3u, html.");
  writeFileSync(output, content);
  process.stdout.write(`Wrote World Cup ${format} metadata to ${output}\n`);
}

function readFlag(args: string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
}

function readDiagnosticsReport(input: string): ChannelDiagnostic[] {
  const parsed = JSON.parse(readFileSync(input, "utf8")) as { diagnostics?: ChannelDiagnostic[] };
  if (!Array.isArray(parsed.diagnostics)) {
    throw new Error("Input must be a JSON diagnostics report generated by iptv-doctor check --json.");
  }
  return parsed.diagnostics;
}

function writeStdout(options: IptvDoctorCliOptions, value: string): void {
  (options.stdout ?? process.stdout.write.bind(process.stdout))(value);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runIptvDoctorCli().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
