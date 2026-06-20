import { describe, expect, it } from "vitest";
import { renderShieldsBadgeJson } from "./badge";

describe("renderShieldsBadgeJson", () => {
  it("renders Shields endpoint JSON from diagnostics", () => {
    const json = renderShieldsBadgeJson(
      [
        {
          channel: { name: "OK", url: "https://example.com/ok.m3u8" },
          status: "ok",
          code: "OK",
          message: "ok",
          checkedAt: "2026-06-20T00:00:00.000Z",
          urlHost: "example.com"
        },
        {
          channel: { name: "Fail", url: "udp://239.0.0.1:1234" },
          status: "fail",
          code: "FAIL_UNSUPPORTED",
          message: "unsupported",
          checkedAt: "2026-06-20T00:00:00.000Z",
          urlHost: ""
        }
      ],
      { now: () => new Date("2026-06-20T00:14:00.000Z") }
    );

    expect(JSON.parse(json)).toEqual({
      schemaVersion: 1,
      label: "IPTV health",
      message: "50% online, 1 failed, last checked 14m ago",
      color: "orange"
    });
  });
});
