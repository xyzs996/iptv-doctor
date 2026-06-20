import { describe, expect, it } from "vitest";
import {
  createDiagnosticsSummary,
  getDefaultProbeOptions,
  probeChannel,
  probePlaylist,
  renderCsvReport,
  renderJsonReport
} from "./diagnostics";
import { renderDiagnosticsHtml } from "./report";

function response(body: string, init: { status?: number; contentType?: string } = {}): Response {
  return new Response(body, {
    status: init.status ?? 200,
    headers: {
      "content-type": init.contentType ?? "application/vnd.apple.mpegurl"
    }
  });
}

describe("probeChannel", () => {
  it("uses documented default probe settings", () => {
    expect(getDefaultProbeOptions()).toEqual({
      timeoutMs: 8000,
      concurrency: 16,
      slowThresholdMs: 2500,
      sampleSegments: 1
    });
  });

  it("classifies a readable HLS manifest as ok and counts playlist items", async () => {
    const fetchImpl = async () =>
      response(`#EXTM3U
#EXT-X-VERSION:3
#EXTINF:8.0,
segment-1.ts`);

    const diagnostic = await probeChannel(
      { name: "FOX", url: "https://example.com/live/fox.m3u8", tvgId: "fox.us", groupTitle: "Sports" },
      { fetchImpl, now: () => new Date("2026-06-20T00:00:00Z"), clock: async () => 120 }
    );

    expect(diagnostic).toMatchObject({
      status: "ok",
      code: "OK",
      latencyMs: 120,
      httpStatus: 200,
      contentType: "application/vnd.apple.mpegurl",
      playlistItems: 1,
      checkedAt: "2026-06-20T00:00:00.000Z",
      urlHost: "example.com"
    });
  });

  it("samples the first HLS media segment relative to the manifest URL", async () => {
    const requested: string[] = [];
    const fetchImpl = async (url: string | URL | Request) => {
      requested.push(String(url));
      return requested.length === 1
        ? response(`#EXTM3U
#EXT-X-VERSION:3
#EXTINF:8.0,
segments/segment-1.ts`)
        : response("segment-bytes", { contentType: "video/mp2t" });
    };

    const diagnostic = await probeChannel(
      { name: "FOX", url: "https://example.com/live/fox.m3u8" },
      { fetchImpl, clock: async () => 120 }
    );

    expect(requested).toEqual(["https://example.com/live/fox.m3u8", "https://example.com/live/segments/segment-1.ts"]);
    expect(diagnostic).toMatchObject({
      status: "ok",
      code: "OK",
      sampledSegments: 1
    });
  });

  it("maps failed HLS segment samples to manifest failures", async () => {
    const fetchImpl = async (_url: string | URL | Request) =>
      response(`#EXTM3U
#EXT-X-VERSION:3
#EXTINF:8.0,
segment-1.ts`);

    const diagnostic = await probeChannel(
      { name: "Broken Segment", url: "https://example.com/live/broken.m3u8" },
      {
        fetchImpl: async (url) =>
          String(url).endsWith(".ts")
            ? response("missing", { status: 404, contentType: "text/plain" })
            : fetchImpl(url),
        clock: async () => 120
      }
    );

    expect(diagnostic).toMatchObject({
      status: "fail",
      code: "FAIL_MANIFEST"
    });
  });

  it("classifies slow successful responses as warn", async () => {
    const diagnostic = await probeChannel(
      { name: "Slow", url: "https://example.com/slow.m3u8" },
      {
        fetchImpl: async () => response("#EXTM3U\n#EXTINF:8,\nsegment.ts"),
        clock: async () => 3000
      }
    );

    expect(diagnostic.status).toBe("warn");
    expect(diagnostic.code).toBe("WARN_SLOW");
  });

  it("maps HTTP failures to FAIL_HTTP", async () => {
    const diagnostic = await probeChannel(
      { name: "Gone", url: "https://example.com/gone.m3u8" },
      { fetchImpl: async () => response("not found", { status: 404, contentType: "text/plain" }) }
    );

    expect(diagnostic).toMatchObject({
      status: "fail",
      code: "FAIL_HTTP",
      httpStatus: 404
    });
  });

  it("maps invalid HLS manifests to FAIL_MANIFEST", async () => {
    const diagnostic = await probeChannel(
      { name: "Invalid", url: "https://example.com/not-hls.m3u8" },
      { fetchImpl: async () => response("hello", { contentType: "text/plain" }) }
    );

    expect(diagnostic.status).toBe("fail");
    expect(diagnostic.code).toBe("FAIL_MANIFEST");
  });

  it("maps unsupported protocols without fetching", async () => {
    const diagnostic = await probeChannel({ name: "UDP", url: "udp://239.0.0.1:1234" });

    expect(diagnostic.status).toBe("fail");
    expect(diagnostic.code).toBe("FAIL_UNSUPPORTED");
  });

  it("maps DNS, TLS, and timeout failures to named codes", async () => {
    await expect(
      probeChannel(
        { name: "DNS", url: "https://missing.example.com/live.m3u8" },
        { fetchImpl: async () => Promise.reject(new Error("getaddrinfo ENOTFOUND missing.example.com")) }
      )
    ).resolves.toMatchObject({ status: "fail", code: "FAIL_DNS" });

    await expect(
      probeChannel(
        { name: "TLS", url: "https://badcert.example.com/live.m3u8" },
        { fetchImpl: async () => Promise.reject(new Error("certificate has expired")) }
      )
    ).resolves.toMatchObject({ status: "fail", code: "FAIL_TLS" });

    await expect(
      probeChannel(
        { name: "Timeout", url: "https://slow.example.com/live.m3u8" },
        { timeoutMs: 1, fetchImpl: async () => new Promise<Response>(() => undefined) }
      )
    ).resolves.toMatchObject({ status: "fail", code: "FAIL_TIMEOUT" });
  });
});

describe("probePlaylist reports", () => {
  it("summarizes diagnostics and renders JSON, CSV, and HTML reports", async () => {
    const diagnostics = await probePlaylist(
      [
        { name: "OK", url: "https://example.com/ok.m3u8", groupTitle: "Sports" },
        { name: "Gone", url: "https://example.com/gone.m3u8", groupTitle: "Sports" }
      ],
      {
        fetchImpl: async (url) =>
          String(url).includes("gone")
            ? response("gone", { status: 500, contentType: "text/plain" })
            : response("#EXTM3U\n#EXTINF:8,\nsegment.ts"),
        clock: async () => 100
      }
    );

    expect(createDiagnosticsSummary(diagnostics)).toMatchObject({
      total: 2,
      ok: 1,
      warn: 0,
      fail: 1,
      healthScore: 50
    });
    expect(renderJsonReport(diagnostics)).toContain("\"healthScore\": 50");
    expect(renderCsvReport(diagnostics)).toContain("name,status,code,latencyMs,httpStatus,contentType,playlistItems,sampledSegments,urlHost,url");
    expect(renderDiagnosticsHtml(diagnostics)).toContain("Health Score");
    expect(renderDiagnosticsHtml(diagnostics)).toContain("Segments");
    expect(renderDiagnosticsHtml(diagnostics)).toContain("Checked At");
    expect(renderDiagnosticsHtml(diagnostics)).toContain("npx iptv-doctor report report.json");
    expect(renderDiagnosticsHtml(diagnostics)).toContain("IPTV Doctor does not provide streams");
  });
});
