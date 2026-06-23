import { describe, expect, it } from "vitest";
import { renderStaticPages, type StatusIndex } from "./generate-status-index";

const fixture: StatusIndex = {
  updatedAt: "2026-06-23T00:00:00.000Z",
  sourceMode: "official-websites",
  sourceNote: "Generated from official metadata.",
  summary: {
    total: 3,
    online: 2,
    slow: 0,
    offline: 1,
    healthScore: 67,
    countries: 2,
    categories: 2
  },
  records: [
    {
      id: "fox.us",
      name: "FOX",
      country: "US",
      category: "World Cup 2026",
      language: "English",
      status: "ok",
      code: "OK",
      latencyMs: 120,
      httpStatus: 200,
      checkedAt: "2026-06-23T00:00:00.000Z",
      urlHost: "www.foxsports.com",
      urlHash: "abc123",
      officialWebsite: "https://www.foxsports.com/",
      evidence: "Official broadcaster site."
    },
    {
      id: "tudn.mx",
      name: "TUDN",
      country: "MX",
      category: "World Cup 2026",
      language: "Spanish",
      status: "ok",
      code: "OK",
      latencyMs: 160,
      httpStatus: 200,
      checkedAt: "2026-06-23T00:00:00.000Z",
      urlHost: "www.tudn.com",
      urlHash: "def456",
      officialWebsite: "https://www.tudn.com/",
      evidence: "Official broadcaster site."
    },
    {
      id: "olympics.global",
      name: "Olympics Channel",
      country: "GLOBAL",
      category: "Public Sports",
      language: "English",
      status: "fail",
      code: "FAIL_TIMEOUT",
      checkedAt: "2026-06-23T00:00:00.000Z",
      urlHost: "olympics.com",
      urlHash: "ghi789",
      officialWebsite: "https://olympics.com/",
      evidence: "Official Olympics web property."
    }
  ]
};

describe("renderStaticPages", () => {
  it("renders index, topic, country, and channel pages for SEO crawlers", () => {
    const pages = renderStaticPages(fixture);
    const paths = pages.map((page) => page.path).sort();

    expect(paths).toContain("status-index.html");
    expect(paths).toContain("iptv-playlist-checker.html");
    expect(paths).toContain("m3u-checker.html");
    expect(paths).toContain("world-cup-2026-tv-guide.html");
    expect(paths).toContain("countries/us.html");
    expect(paths).toContain("channels/fox.html");
    expect(paths).toContain("channels/olympics-channel.html");
  });

  it("includes crawlable table content and dataset structured data", () => {
    const statusPage = renderStaticPages(fixture).find((page) => page.path === "status-index.html");

    expect(statusPage?.html).toContain("<title>Live IPTV Status Index");
    expect(statusPage?.html).toContain('"@type": "Dataset"');
    expect(statusPage?.html).toContain("<td>FOX</td>");
    expect(statusPage?.html).toContain("status-index.json");
  });
});
