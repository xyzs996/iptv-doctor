#!/usr/bin/env node
import { writeFileSync } from "node:fs";
import { getWorldCup2026Dataset } from "@iptv-star/sports-data";
import { generateICalendar, generateM3UPlaceholder, generateXMLTV } from "./generators.js";

type Format = "xmltv" | "ics" | "m3u";

function parseArgs(argv: string[]): { format: Format; country: "US" | "CA" | "MX"; output?: string } {
  const args = argv.slice(2);
  const format = (args[0] ?? "xmltv") as Format;
  const country = ((args[1]?.startsWith("--") ? undefined : args[1]) ?? "US") as "US" | "CA" | "MX";
  const output = readFlag(args, "--out") ?? readPositionalOutput(args);

  if (!["xmltv", "ics", "m3u"].includes(format)) {
    throw new Error("Usage: match2epg <xmltv|ics|m3u> [US|CA|MX] [--out output]");
  }

  if (!["US", "CA", "MX"].includes(country)) {
    throw new Error("Country must be one of US, CA, MX.");
  }

  return { format, country, output };
}

function readFlag(args: string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index < 0) return undefined;
  const value = args[index + 1];
  return value && !value.startsWith("--") ? value : undefined;
}

function readPositionalOutput(args: string[]): string | undefined {
  const value = args[2];
  return value && !value.startsWith("--") ? value : undefined;
}

export function runMatch2EpgCli(argv = process.argv): void {
  const args = parseArgs(argv);
  const dataset = getWorldCup2026Dataset();
  const output =
    args.format === "xmltv"
      ? generateXMLTV(dataset, args.country)
      : args.format === "ics"
        ? generateICalendar(dataset)
        : generateM3UPlaceholder(dataset, args.country);

  if (args.output) {
    writeFileSync(args.output, output);
    return;
  }

  process.stdout.write(output);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runMatch2EpgCli();
}
