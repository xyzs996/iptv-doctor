import { existsSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { generateReleaseArtifacts } from "../../../scripts/generate-release-artifacts";
import { verifyExternalPublication } from "../../../scripts/verify-external-publish";

const root = resolve(import.meta.dirname, "../../..");

describe("release assets", () => {
  it("includes a composite GitHub Action for playlist checks", () => {
    expect(existsSync(resolve(root, "action.yml"))).toBe(true);
    const action = readFileSync(resolve(root, "action.yml"), "utf8");
    expect(action).toContain("iptv-doctor");
    expect(action).toContain("--badge");
  });

  it("includes Docker packaging and publish workflow", () => {
    expect(readFileSync(resolve(root, "Dockerfile"), "utf8")).toContain("pnpm --filter iptv-doctor doctor");
    expect(readFileSync(resolve(root, ".github/workflows/publish.yml"), "utf8")).toContain("ghcr.io");
    expect(readFileSync(resolve(root, ".github/workflows/publish.yml"), "utf8")).toContain("npm publish");
    expect(readFileSync(resolve(root, ".github/workflows/publish.yml"), "utf8")).toContain("NPM_TOKEN is not configured; skipping npm publish");
    expect(readFileSync(resolve(root, ".github/workflows/publish.yml"), "utf8")).toContain("generate-release-artifacts");
    expect(readFileSync(resolve(root, ".github/workflows/publish.yml"), "utf8")).toContain("softprops/action-gh-release");
  });

  it("warns contributors not to paste private IPTV data into issues", () => {
    const template = readFileSync(resolve(root, ".github/ISSUE_TEMPLATE/bug_report.md"), "utf8");

    expect(template).toContain("Do not paste private playlist URLs");
    expect(template).toContain("credentials");
  });

  it("includes a GitHub Pages workflow for the browser-local demo", () => {
    const workflow = readFileSync(resolve(root, ".github/workflows/pages.yml"), "utf8");
    const viteConfig = readFileSync(resolve(root, "apps/worldcup-tv-guide/vite.config.ts"), "utf8");

    expect(workflow).toContain("worldcup-tv-guide");
    expect(workflow).toContain("@iptv-star/iptv-core build");
    expect(workflow).toContain("@iptv-star/sports-data build");
    expect(workflow).toContain("@iptv-star/match2epg build");
    expect(workflow).toContain("upload-pages-artifact");
    expect(workflow).toContain("deploy-pages");
    expect(viteConfig).toContain('base: "/iptv-doctor/"');
    expect(readFileSync(resolve(root, "apps/worldcup-tv-guide/public/badge.json"), "utf8")).toContain("\"schemaVersion\": 1");
  });

  it("includes star-focused how-to documentation and a report screenshot block", () => {
    const readme = readFileSync(resolve(root, "README.md"), "utf8");

    expect(readme).toContain("IPTV Doctor Report");
    expect(readme).toContain("npx iptv-doctor check");
    for (const name of [
      "github-actions-health-check.md",
      "clean-dead-m3u-channels.md",
      "fix-xmltv-epg-ids.md",
      "worldcup-2026-iptvnator.md",
      "shareable-health-report.md"
    ]) {
      expect(existsSync(resolve(root, "docs/how-to", name))).toBe(true);
    }
  });

  it("includes an external publishing runbook and preflight verifier", () => {
    const runbook = readFileSync(resolve(root, "docs/release-runbook.md"), "utf8");
    const verifier = readFileSync(resolve(root, "scripts/verify-external-publish.ts"), "utf8");

    expect(runbook).toContain("GitHub Action");
    expect(runbook).toContain("npm publish");
    expect(runbook).toContain("ghcr.io");
    expect(runbook).toContain("badge.json");
    expect(verifier).toContain("NPM_TOKEN");
    expect(verifier).toContain("GITHUB_REPOSITORY");
  });

  it("verifies external publication endpoints when publish metadata is supplied", async () => {
    const requested: string[] = [];
    const result = await verifyExternalPublication(
      {
        githubRepository: "xyzs996/iptv-doctor",
        npmPackage: "iptv-doctor",
        ghcrImage: "ghcr.io/xyzs996/iptv-doctor",
        badgeEndpointUrl: "https://example.com/badge.json"
      },
      {
        fetchImpl: async (url) => {
          requested.push(String(url));
          if (String(url).includes("registry.npmjs.org")) return new Response(JSON.stringify({ name: "iptv-doctor" }), { status: 200 });
          if (String(url).includes("api.github.com")) return new Response(JSON.stringify({ ref: "refs/tags/v1" }), { status: 200 });
          if (String(url).includes("ghcr.io")) return new Response(JSON.stringify({ schemaVersion: 2 }), { status: 200 });
          return new Response(JSON.stringify({ schemaVersion: 1, label: "IPTV health", message: "100% online" }), { status: 200 });
        }
      }
    );

    expect(result.every((item) => item.ok)).toBe(true);
    expect(requested).toEqual([
      "https://registry.npmjs.org/iptv-doctor",
      "https://api.github.com/repos/xyzs996/iptv-doctor/git/ref/tags/v1",
      "https://ghcr.io/v2/xyzs996/iptv-doctor/manifests/latest",
      "https://example.com/badge.json"
    ]);
  });

  it("marks the CLI package publish-ready", () => {
    const pkg = JSON.parse(readFileSync(resolve(root, "apps/iptv-doctor/package.json"), "utf8")) as {
      private?: boolean;
      publishConfig?: { access?: string };
      files?: string[];
      bin?: Record<string, string>;
      dependencies?: Record<string, string>;
    };

    expect(pkg.private).toBe(false);
    expect(pkg.publishConfig?.access).toBe("public");
    expect(pkg.files).toContain("dist");
    expect(pkg.files).toContain("bin");
    expect(pkg.bin?.["iptv-doctor"]).toBe("./bin/iptv-doctor.mjs");
    expect(pkg.dependencies?.tsx).toBeUndefined();
  });

  it("keeps published workspace packages free of test files", () => {
    for (const packagePath of [
      "packages/iptv-core/package.json",
      "packages/sports-data/package.json",
      "packages/match2epg/package.json"
    ]) {
      const pkg = JSON.parse(readFileSync(resolve(root, packagePath), "utf8")) as { files?: string[] };

      expect(pkg.files).toBeDefined();
      expect(pkg.files).toContain("dist");
      expect(pkg.files?.some((entry) => entry.includes(".test."))).toBe(false);
    }
  });

  it("marks match2epg package bin executable through a Node wrapper", () => {
    const pkg = JSON.parse(readFileSync(resolve(root, "packages/match2epg/package.json"), "utf8")) as {
      files?: string[];
      bin?: Record<string, string>;
      dependencies?: Record<string, string>;
    };

    expect(pkg.files).toContain("bin");
    expect(pkg.bin?.match2epg).toBe("./bin/match2epg.mjs");
    expect(pkg.dependencies?.tsx).toBeUndefined();
    expect(readFileSync(resolve(root, "packages/match2epg/bin/match2epg.mjs"), "utf8")).toContain("../dist/cli.js");
  });

  it("generates release artifacts listed in the project proposal", () => {
    const outDir = mkdtempSync(resolve(tmpdir(), "iptv-release-"));

    const artifacts = generateReleaseArtifacts(outDir);

    expect(artifacts.map((artifact) => artifact.name).sort()).toEqual([
      "iptv-doctor-linux-x64",
      "iptv-doctor-macos-arm64",
      "iptv-doctor-windows-x64.cmd",
      "sample-clean.m3u",
      "sample-report.html",
      "sample-report.json",
      "worldcup-2026-guide.html",
      "worldcup-2026-us-placeholder.m3u",
      "worldcup-2026-us.ics",
      "worldcup-2026-us.xmltv"
    ]);
    expect(readFileSync(resolve(outDir, "iptv-doctor-linux-x64"), "utf8")).toContain("npx iptv-doctor");
    expect(readFileSync(resolve(outDir, "iptv-doctor-windows-x64.cmd"), "utf8")).toContain("npx iptv-doctor");
    expect(readFileSync(resolve(outDir, "worldcup-2026-guide.html"), "utf8")).toContain("World Cup 2026 IPTV Pack");
    expect(readFileSync(resolve(outDir, "sample-report.json"), "utf8")).toContain("\"healthScore\"");
  });
});
