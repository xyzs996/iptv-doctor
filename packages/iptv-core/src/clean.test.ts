import { describe, expect, it } from "vitest";
import { renderCleanM3U } from "./clean";

describe("renderCleanM3U", () => {
  it("keeps ok and warn channels and removes failed channels", () => {
    const output = renderCleanM3U([
      {
        channel: { name: "FOX", url: "https://example.com/fox.m3u8", tvgId: "fox.us", groupTitle: "Sports" },
        status: "ok",
        code: "OK",
        message: "ok",
        checkedAt: "2026-06-20T00:00:00.000Z",
        urlHost: "example.com"
      },
      {
        channel: { name: "Slow", url: "https://example.com/slow.m3u8", tvgId: "slow.us", groupTitle: "Sports" },
        status: "warn",
        code: "WARN_SLOW",
        message: "slow",
        checkedAt: "2026-06-20T00:00:00.000Z",
        urlHost: "example.com"
      },
      {
        channel: { name: "Gone", url: "https://example.com/gone.m3u8", tvgId: "gone.us", groupTitle: "Sports" },
        status: "fail",
        code: "FAIL_HTTP",
        message: "http 404",
        checkedAt: "2026-06-20T00:00:00.000Z",
        urlHost: "example.com"
      }
    ]);

    expect(output).toContain("#EXTM3U");
    expect(output).toContain("tvg-id=\"fox.us\"");
    expect(output).toContain("tvg-id=\"slow.us\"");
    expect(output).not.toContain("gone.us");
  });
});
