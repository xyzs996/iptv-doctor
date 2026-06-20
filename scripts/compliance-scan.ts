#!/usr/bin/env node
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { scanComplianceText } from "../packages/iptv-core/src/compliance";

const root = process.cwd();
const ignoredDirectories = new Set([".git", "node_modules", "dist", "build", ".next", "coverage", "docs"]);
const ignoredExtensions = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".lock"]);
const ignoredSuffixes = [".tsbuildinfo", ".test.ts", ".test.tsx"];

const files = collectFiles(root);
const findings = files.flatMap((file) => scanComplianceText(readFileSync(file, "utf8"), relative(root, file)));

if (findings.length > 0) {
  for (const finding of findings) {
    console.error(`${finding.file}:${finding.line} ${finding.code} ${finding.message}`);
  }
  process.exit(1);
}

console.log(`Compliance scan passed (${files.length} files scanned).`);

function collectFiles(directory: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(directory)) {
    if (ignoredDirectories.has(entry)) continue;
    const path = join(directory, entry);
    const repoPath = relative(root, path);
    const stats = statSync(path);
    if (stats.isDirectory()) {
      files.push(...collectFiles(path));
      continue;
    }
    if (ignoredExtensions.has(extension(entry))) continue;
    if (ignoredSuffixes.some((suffix) => entry.endsWith(suffix))) continue;
    if (repoPath === "packages/iptv-core/src/compliance.ts") continue;
    if (repoPath === "scripts/compliance-scan.ts") continue;
    files.push(path);
  }
  return files;
}

function extension(file: string): string {
  const dot = file.lastIndexOf(".");
  return dot >= 0 ? file.slice(dot) : "";
}
