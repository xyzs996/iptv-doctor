import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { runIptvDoctorCli } from "./cli";

function tempDir(): string {
  return mkdtempSync(join(tmpdir(), "iptv-doctor-"));
}

describe("runIptvDoctorCli", () => {
  it("prints usage for --help without throwing", async () => {
    const writes: string[] = [];

    await runIptvDoctorCli(["node", "iptv-doctor", "--help"], {
      stdout: (value) => writes.push(value)
    });

    expect(writes.join("")).toContain("Usage:");
    expect(writes.join("")).toContain("iptv-doctor check");
  });

  it("checks a playlist and writes HTML plus JSON reports", async () => {
    const dir = tempDir();
    const playlist = join(dir, "playlist.m3u");
    const html = join(dir, "report.html");
    const json = join(dir, "report.json");
    const badge = join(dir, "badge.json");
    await import("node:fs").then((fs) =>
      fs.writeFileSync(playlist, "#EXTM3U\n#EXTINF:-1 tvg-id=\"fox.us\",FOX\nhttps://example.com/fox.m3u8\n")
    );

    await runIptvDoctorCli(["node", "iptv-doctor", "check", playlist, "--report", html, "--json", json, "--badge", badge], {
      fetchImpl: async () => new Response("#EXTM3U\n#EXTINF:8,\nsegment.ts")
    });

    expect(readFileSync(html, "utf8")).toContain("IPTV Doctor Report");
    expect(readFileSync(json, "utf8")).toContain("\"diagnostics\"");
    expect(readFileSync(badge, "utf8")).toContain("\"schemaVersion\"");
  });

  it("cleans a playlist into a fresh M3U", async () => {
    const dir = tempDir();
    const playlist = join(dir, "playlist.m3u");
    const clean = join(dir, "clean.m3u");
    await import("node:fs").then((fs) =>
      fs.writeFileSync(
        playlist,
        "#EXTM3U\n#EXTINF:-1,OK\nhttps://example.com/ok.m3u8\n#EXTINF:-1,Gone\nhttps://example.com/gone.m3u8\n"
      )
    );

    await runIptvDoctorCli(["node", "iptv-doctor", "clean", playlist, "--out", clean], {
      fetchImpl: async (url) =>
        String(url).includes("gone")
          ? new Response("gone", { status: 404 })
          : new Response("#EXTM3U\n#EXTINF:8,\nsegment.ts")
    });

    const output = readFileSync(clean, "utf8");
    expect(output).toContain("OK");
    expect(output).not.toContain("Gone");
  });

  it("writes World Cup XMLTV through the flagship CLI", async () => {
    const dir = tempDir();
    const output = join(dir, "worldcup.xml");

    await runIptvDoctorCli(["node", "iptv-doctor", "worldcup", "--country", "US", "--format", "xmltv", "--out", output]);

    expect(readFileSync(output, "utf8")).toContain("<tv generator-info-name=\"match2epg\"");
  });

  it("writes World Cup HTML guide through the flagship CLI", async () => {
    const dir = tempDir();
    const output = join(dir, "worldcup.html");

    await runIptvDoctorCli(["node", "iptv-doctor", "worldcup", "--country", "US", "--format", "html", "--out", output]);

    expect(readFileSync(output, "utf8")).toContain("World Cup 2026 IPTV Pack");
  });

  it("checks and fixes EPG ids through the flagship CLI", async () => {
    const dir = tempDir();
    const playlist = join(dir, "playlist.m3u");
    const guide = join(dir, "guide.xml");
    const json = join(dir, "epg.json");
    const fixed = join(dir, "fixed.m3u");
    await import("node:fs").then((fs) => {
      fs.writeFileSync(playlist, "#EXTM3U\n#EXTINF:-1,FS1\nhttps://example.com/fs1.m3u8\n");
      fs.writeFileSync(guide, "<tv><channel id=\"fs1.us\"><display-name>FS1</display-name></channel></tv>");
    });

    await runIptvDoctorCli(["node", "iptv-doctor", "epg", "check", playlist, guide, "--json", json]);
    await runIptvDoctorCli(["node", "iptv-doctor", "epg", "fix", playlist, guide, "--out", fixed]);

    expect(readFileSync(json, "utf8")).toContain("\"suggestedTvgId\": \"fs1.us\"");
    expect(readFileSync(fixed, "utf8")).toContain('tvg-id="fs1.us"');
  });

  it("renders a badge from an existing JSON diagnostics report", async () => {
    const dir = tempDir();
    const report = join(dir, "report.json");
    const badge = join(dir, "badge.json");
    await import("node:fs").then((fs) =>
      fs.writeFileSync(
        report,
        JSON.stringify({
          diagnostics: [
            {
              channel: { name: "FOX", url: "https://example.com/fox.m3u8" },
              status: "ok",
              code: "OK",
              message: "ok",
              checkedAt: "2026-06-20T00:00:00.000Z",
              urlHost: "example.com"
            }
          ]
        })
      )
    );

    await runIptvDoctorCli(["node", "iptv-doctor", "badge", report, "--out", badge]);

    expect(readFileSync(badge, "utf8")).toContain("\"message\": \"100% online, 0 failed");
  });

  it("renders HTML, CSV, and badge assets from an existing JSON diagnostics report", async () => {
    const dir = tempDir();
    const report = join(dir, "report.json");
    const html = join(dir, "report.html");
    const csv = join(dir, "report.csv");
    const badge = join(dir, "badge.json");
    await import("node:fs").then((fs) =>
      fs.writeFileSync(
        report,
        JSON.stringify({
          diagnostics: [
            {
              channel: { name: "FOX", url: "https://example.com/fox.m3u8", tvgId: "fox.us" },
              status: "ok",
              code: "OK",
              message: "ok",
              checkedAt: "2026-06-20T00:00:00.000Z",
              urlHost: "example.com",
              latencyMs: 100,
              httpStatus: 200,
              playlistItems: 1,
              sampledSegments: 1
            }
          ]
        })
      )
    );

    await runIptvDoctorCli(["node", "iptv-doctor", "report", report, "--html", html, "--csv", csv, "--badge", badge]);

    expect(readFileSync(html, "utf8")).toContain("IPTV Doctor Report");
    expect(readFileSync(csv, "utf8")).toContain("sampledSegments");
    expect(readFileSync(badge, "utf8")).toContain("\"message\": \"100% online, 0 failed");
  });

  it("lists MCP tools through the flagship CLI", async () => {
    const writes: string[] = [];

    await runIptvDoctorCli(["node", "iptv-doctor", "mcp", "--list-tools"], {
      stdout: (value) => writes.push(value)
    });

    expect(writes.join("")).toContain("list_worldcup_matches");
    expect(writes.join("")).toContain("generate_us_xmltv");
  });
});
