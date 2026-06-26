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
    expect(readFileSync(resolve(root, ".github/workflows/publish.yml"), "utf8")).toContain('publish_if_missing "iptv-doctor-core"');
    expect(readFileSync(resolve(root, ".github/workflows/publish.yml"), "utf8")).toContain('publish_if_missing "@bjia666/match2epg"');
    expect(readFileSync(resolve(root, ".github/workflows/publish.yml"), "utf8")).toContain('publish_if_missing "iptv-doctor"');
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
    expect(workflow).toContain("iptv-doctor-core build");
    expect(workflow).toContain("iptv-sports-data build");
    expect(workflow).toContain("match2epg build");
    expect(workflow).toContain("upload-pages-artifact");
    expect(workflow).toContain("deploy-pages");
    expect(viteConfig).toContain('base: "/iptv-doctor/"');
    expect(readFileSync(resolve(root, "apps/worldcup-tv-guide/public/badge.json"), "utf8")).toContain("\"schemaVersion\": 1");
  });

  it("includes public how-to documentation and a report screenshot block", () => {
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
        fetchImpl: async (url, init) => {
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

  it("follows the GHCR bearer-token challenge when verifying image manifests", async () => {
    const requested: string[] = [];
    const result = await verifyExternalPublication(
      {
        githubRepository: "xyzs996/iptv-doctor",
        npmPackage: "iptv-doctor",
        ghcrImage: "ghcr.io/xyzs996/iptv-doctor",
        badgeEndpointUrl: "https://example.com/badge.json"
      },
      {
        fetchImpl: async (url, init) => {
          requested.push(String(url));
          if (String(url).includes("registry.npmjs.org")) return new Response(JSON.stringify({ name: "iptv-doctor" }), { status: 200 });
          if (String(url).includes("api.github.com")) return new Response(JSON.stringify({ ref: "refs/tags/v1" }), { status: 200 });
          if (String(url).includes("ghcr.io/token")) return new Response(JSON.stringify({ token: "registry-token" }), { status: 200 });
          if (String(url).includes("ghcr.io")) {
            const authorized = init?.headers ? JSON.stringify(init.headers).includes("registry-token") : false;
            return authorized
              ? new Response(JSON.stringify({ schemaVersion: 2 }), { status: 200 })
              : new Response("auth required", {
                  status: 401,
                  headers: {
                    "www-authenticate":
                      'Bearer realm="https://ghcr.io/token",service="ghcr.io",scope="repository:xyzs996/iptv-doctor:pull"'
                  }
                });
          }
          return new Response(JSON.stringify({ schemaVersion: 1, label: "IPTV health", message: "demo online" }), { status: 200 });
        }
      }
    );

    expect(result.find((item) => item.name === "ghcr")?.ok).toBe(true);
    expect(requested).toContain("https://ghcr.io/token?service=ghcr.io&scope=repository%3Axyzs996%2Fiptv-doctor%3Apull");
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

  it("generates release artifacts for the public release bundle", () => {
    const outDir = mkdtempSync(resolve(tmpdir(), "iptv-release-"));

    const artifacts = generateReleaseArtifacts(outDir);

    expect(artifacts.map((artifact) => artifact.name).sort()).toEqual([
      "iptv-doctor-linux-x64",
      "iptv-doctor-macos-arm64",
      "iptv-doctor-windows-x64.cmd",
      "sample-clean.m3u",
      "sample-report.html",
      "sample-report.json",
      "worldcup-2026-ae-placeholder.m3u",
      "worldcup-2026-ae.xmltv",
      "worldcup-2026-ar-placeholder.m3u",
      "worldcup-2026-ar.xmltv",
      "worldcup-2026-at-placeholder.m3u",
      "worldcup-2026-at.xmltv",
      "worldcup-2026-au-placeholder.m3u",
      "worldcup-2026-au.xmltv",
      "worldcup-2026-be-placeholder.m3u",
      "worldcup-2026-be.xmltv",
      "worldcup-2026-bg-placeholder.m3u",
      "worldcup-2026-bg.xmltv",
      "worldcup-2026-br-placeholder.m3u",
      "worldcup-2026-br.xmltv",
      "worldcup-2026-ca-placeholder.m3u",
      "worldcup-2026-ca.xmltv",
      "worldcup-2026-ch-placeholder.m3u",
      "worldcup-2026-ch.xmltv",
      "worldcup-2026-cl-placeholder.m3u",
      "worldcup-2026-cl.xmltv",
      "worldcup-2026-cn-placeholder.m3u",
      "worldcup-2026-cn.xmltv",
      "worldcup-2026-co-placeholder.m3u",
      "worldcup-2026-co.xmltv",
      "worldcup-2026-cr-placeholder.m3u",
      "worldcup-2026-cr.xmltv",
      "worldcup-2026-cz-placeholder.m3u",
      "worldcup-2026-cz.xmltv",
      "worldcup-2026-de-placeholder.m3u",
      "worldcup-2026-de.xmltv",
      "worldcup-2026-dk-placeholder.m3u",
      "worldcup-2026-dk.xmltv",
      "worldcup-2026-dz-placeholder.m3u",
      "worldcup-2026-dz.xmltv",
      "worldcup-2026-ec-placeholder.m3u",
      "worldcup-2026-ec.xmltv",
      "worldcup-2026-eg-placeholder.m3u",
      "worldcup-2026-eg.xmltv",
      "worldcup-2026-es-placeholder.m3u",
      "worldcup-2026-es.xmltv",
      "worldcup-2026-fi-placeholder.m3u",
      "worldcup-2026-fi.xmltv",
      "worldcup-2026-fr-placeholder.m3u",
      "worldcup-2026-fr.xmltv",
      "worldcup-2026-gb-placeholder.m3u",
      "worldcup-2026-gb.xmltv",
      "worldcup-2026-gr-placeholder.m3u",
      "worldcup-2026-gr.xmltv",
      "worldcup-2026-guide.html",
      "worldcup-2026-hr-placeholder.m3u",
      "worldcup-2026-hr.xmltv",
      "worldcup-2026-hu-placeholder.m3u",
      "worldcup-2026-hu.xmltv",
      "worldcup-2026-id-placeholder.m3u",
      "worldcup-2026-id.xmltv",
      "worldcup-2026-ie-placeholder.m3u",
      "worldcup-2026-ie.xmltv",
      "worldcup-2026-il-placeholder.m3u",
      "worldcup-2026-il.xmltv",
      "worldcup-2026-in-placeholder.m3u",
      "worldcup-2026-in.xmltv",
      "worldcup-2026-ir-placeholder.m3u",
      "worldcup-2026-ir.xmltv",
      "worldcup-2026-it-placeholder.m3u",
      "worldcup-2026-it.xmltv",
      "worldcup-2026-jp-placeholder.m3u",
      "worldcup-2026-jp.xmltv",
      "worldcup-2026-kr-placeholder.m3u",
      "worldcup-2026-kr.xmltv",
      "worldcup-2026-ma-placeholder.m3u",
      "worldcup-2026-ma.xmltv",
      "worldcup-2026-mx-placeholder.m3u",
      "worldcup-2026-mx.xmltv",
      "worldcup-2026-my-placeholder.m3u",
      "worldcup-2026-my.xmltv",
      "worldcup-2026-ng-placeholder.m3u",
      "worldcup-2026-ng.xmltv",
      "worldcup-2026-nl-placeholder.m3u",
      "worldcup-2026-nl.xmltv",
      "worldcup-2026-no-placeholder.m3u",
      "worldcup-2026-no.xmltv",
      "worldcup-2026-nz-placeholder.m3u",
      "worldcup-2026-nz.xmltv",
      "worldcup-2026-pe-placeholder.m3u",
      "worldcup-2026-pe.xmltv",
      "worldcup-2026-ph-placeholder.m3u",
      "worldcup-2026-ph.xmltv",
      "worldcup-2026-pl-placeholder.m3u",
      "worldcup-2026-pl.xmltv",
      "worldcup-2026-pt-placeholder.m3u",
      "worldcup-2026-pt.xmltv",
      "worldcup-2026-qa-placeholder.m3u",
      "worldcup-2026-qa.xmltv",
      "worldcup-2026-ro-placeholder.m3u",
      "worldcup-2026-ro.xmltv",
      "worldcup-2026-rs-placeholder.m3u",
      "worldcup-2026-rs.xmltv",
      "worldcup-2026-ru-placeholder.m3u",
      "worldcup-2026-ru.xmltv",
      "worldcup-2026-sa-placeholder.m3u",
      "worldcup-2026-sa.xmltv",
      "worldcup-2026-se-placeholder.m3u",
      "worldcup-2026-se.xmltv",
      "worldcup-2026-sg-placeholder.m3u",
      "worldcup-2026-sg.xmltv",
      "worldcup-2026-sk-placeholder.m3u",
      "worldcup-2026-sk.xmltv",
      "worldcup-2026-th-placeholder.m3u",
      "worldcup-2026-th.xmltv",
      "worldcup-2026-tn-placeholder.m3u",
      "worldcup-2026-tn.xmltv",
      "worldcup-2026-tr-placeholder.m3u",
      "worldcup-2026-tr.xmltv",
      "worldcup-2026-tv-guide-ae.html",
      "worldcup-2026-tv-guide-ar.html",
      "worldcup-2026-tv-guide-at.html",
      "worldcup-2026-tv-guide-au.html",
      "worldcup-2026-tv-guide-be.html",
      "worldcup-2026-tv-guide-bg.html",
      "worldcup-2026-tv-guide-br.html",
      "worldcup-2026-tv-guide-ca.html",
      "worldcup-2026-tv-guide-ch.html",
      "worldcup-2026-tv-guide-cl.html",
      "worldcup-2026-tv-guide-cn.html",
      "worldcup-2026-tv-guide-co.html",
      "worldcup-2026-tv-guide-cr.html",
      "worldcup-2026-tv-guide-cz.html",
      "worldcup-2026-tv-guide-de.html",
      "worldcup-2026-tv-guide-dk.html",
      "worldcup-2026-tv-guide-dz.html",
      "worldcup-2026-tv-guide-ec.html",
      "worldcup-2026-tv-guide-eg.html",
      "worldcup-2026-tv-guide-es.html",
      "worldcup-2026-tv-guide-fi.html",
      "worldcup-2026-tv-guide-fr.html",
      "worldcup-2026-tv-guide-gb.html",
      "worldcup-2026-tv-guide-gr.html",
      "worldcup-2026-tv-guide-hr.html",
      "worldcup-2026-tv-guide-hu.html",
      "worldcup-2026-tv-guide-id.html",
      "worldcup-2026-tv-guide-ie.html",
      "worldcup-2026-tv-guide-il.html",
      "worldcup-2026-tv-guide-in.html",
      "worldcup-2026-tv-guide-ir.html",
      "worldcup-2026-tv-guide-it.html",
      "worldcup-2026-tv-guide-jp.html",
      "worldcup-2026-tv-guide-kr.html",
      "worldcup-2026-tv-guide-ma.html",
      "worldcup-2026-tv-guide-mx.html",
      "worldcup-2026-tv-guide-my.html",
      "worldcup-2026-tv-guide-ng.html",
      "worldcup-2026-tv-guide-nl.html",
      "worldcup-2026-tv-guide-no.html",
      "worldcup-2026-tv-guide-nz.html",
      "worldcup-2026-tv-guide-pe.html",
      "worldcup-2026-tv-guide-ph.html",
      "worldcup-2026-tv-guide-pl.html",
      "worldcup-2026-tv-guide-pt.html",
      "worldcup-2026-tv-guide-qa.html",
      "worldcup-2026-tv-guide-ro.html",
      "worldcup-2026-tv-guide-rs.html",
      "worldcup-2026-tv-guide-ru.html",
      "worldcup-2026-tv-guide-sa.html",
      "worldcup-2026-tv-guide-se.html",
      "worldcup-2026-tv-guide-sg.html",
      "worldcup-2026-tv-guide-sk.html",
      "worldcup-2026-tv-guide-th.html",
      "worldcup-2026-tv-guide-tn.html",
      "worldcup-2026-tv-guide-tr.html",
      "worldcup-2026-tv-guide-ua.html",
      "worldcup-2026-tv-guide-us.html",
      "worldcup-2026-tv-guide-uy.html",
      "worldcup-2026-tv-guide-vn.html",
      "worldcup-2026-tv-guide-za.html",
      "worldcup-2026-ua-placeholder.m3u",
      "worldcup-2026-ua.xmltv",
      "worldcup-2026-us-guide.html",
      "worldcup-2026-us-placeholder.m3u",
      "worldcup-2026-us-placeholder.m3u",
      "worldcup-2026-us.xmltv",
      "worldcup-2026-us.xmltv",
      "worldcup-2026-uy-placeholder.m3u",
      "worldcup-2026-uy.xmltv",
      "worldcup-2026-vn-placeholder.m3u",
      "worldcup-2026-vn.xmltv",
      "worldcup-2026-za-placeholder.m3u",
      "worldcup-2026-za.xmltv",
      "worldcup-2026.ics"
    ]);
    expect(readFileSync(resolve(outDir, "iptv-doctor-linux-x64"), "utf8")).toContain("npx iptv-doctor");
    expect(readFileSync(resolve(outDir, "iptv-doctor-windows-x64.cmd"), "utf8")).toContain("npx iptv-doctor");
    expect(readFileSync(resolve(outDir, "worldcup-2026-guide.html"), "utf8")).toContain("World Cup 2026 TV Guide by Country");
    expect(readFileSync(resolve(outDir, "sample-report.json"), "utf8")).toContain("\"healthScore\"");
  });
});
