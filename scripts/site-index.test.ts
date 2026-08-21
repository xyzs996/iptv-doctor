import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { renderStaticPages, writeSiteIndexes, type StatusIndex } from "./generate-status-index";
import { SITE_URL, collectAddresses, renderLlms, renderSitemap } from "./site-index";

const fixture: StatusIndex = {
  updatedAt: "2026-06-26T01:35:47.459Z",
  sourceMode: "official-websites",
  sourceNote: "Generated from official metadata. No stream URLs are stored or published.",
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
      checkedAt: "2026-06-26T01:35:47.459Z",
      urlHost: "www.foxsports.com",
      urlHash: "abc123",
      officialWebsite: "https://www.foxsports.com/",
      evidence: "Official broadcaster site."
    },
    {
      id: "telemundo.us",
      name: "Telemundo Deportes",
      country: "US",
      category: "World Cup 2026",
      language: "Spanish",
      status: "fail",
      code: "FAIL_TIMEOUT",
      checkedAt: "2026-06-26T01:35:47.459Z",
      urlHost: "www.telemundodeportes.com",
      urlHash: "def456",
      officialWebsite: "https://www.telemundodeportes.com/",
      evidence: "Official broadcaster site."
    },
    {
      id: "tudn.mx",
      name: "TUDN",
      country: "MX",
      category: "Public Sports",
      language: "Spanish",
      status: "ok",
      code: "OK",
      latencyMs: 160,
      httpStatus: 200,
      checkedAt: "2026-06-26T01:35:47.459Z",
      urlHost: "www.tudn.com",
      urlHash: "ghi789",
      officialWebsite: "https://www.tudn.com/",
      evidence: "Official broadcaster site."
    }
  ]
};

const generated = renderStaticPages(fixture).map((page) => page.path);

/**
 * A site where everything the generators can produce is on disk, except the
 * two things a real publish is missing at some point: Mexico's country page
 * (written by a run that has not happened) and Argentina's XMLTV file (the
 * World Cup generator covers more countries than the guide pages do).
 */
const onDisk = new Set<string>([
  "index.html",
  ...generated.filter((path) => path !== "countries/mx.html"),
  "world-cup-2026-tv-guide.html",
  "world-cup-2026-tv-guide-us.html",
  "world-cup-2026-tv-guide-ar.html",
  "status-index.json",
  "status-index.csv",
  "status-badge.json",
  "worldcup-2026.ics",
  "worldcup-2026-us.xmltv",
  "worldcup-2026-us-placeholder.m3u",
  "worldcup-2026-ar-placeholder.m3u"
]);

function addresses() {
  return collectAddresses({
    generated,
    worldCupCountries: ["us", "ar", "br"],
    exists: (path) => onDisk.has(path)
  });
}

describe("collectAddresses", () => {
  it("keeps every page the status index generator writes", () => {
    const { pages } = addresses();

    expect(pages).toContain("status-index.html");
    expect(pages).toContain("iptv-playlist-checker.html");
    expect(pages).toContain("m3u-checker.html");
    // The bug this file exists for: country and channel pages were live and
    // named in no index at all.
    expect(pages).toContain("countries/us.html");
    expect(pages).toContain("channels/fox.html");
    expect(pages).toContain("channels/telemundo-deportes.html");
    expect(pages).toContain("channels/tudn.html");
  });

  it("drops any address that is not on disk", () => {
    const { pages, files } = addresses();

    // Never published: the generator writes no page for it.
    expect(pages).not.toContain("countries/mx.html");
    // Covered by the World Cup dataset, but its guide page has not been built.
    expect(pages).not.toContain("world-cup-2026-tv-guide-br.html");
    expect(files).not.toContain("worldcup-2026-br.xmltv");
    expect(files).not.toContain("worldcup-2026-ar.xmltv");
    expect(files).toContain("worldcup-2026-us.xmltv");
  });

  it("serves the site root as an address of its own", () => {
    expect(addresses().pages).toContain("");
  });
});

describe("renderSitemap", () => {
  it("names every collected page and nothing else", () => {
    const collected = addresses();
    const xml = renderSitemap(collected, fixture.updatedAt);
    const locs = Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g)).map((match) => match[1]);

    expect(locs).toHaveLength(collected.pages.length);
    expect(locs.length).toBeGreaterThanOrEqual(8);
    expect(locs).toContain(`${SITE_URL}/`);
    expect(locs).toContain(`${SITE_URL}/channels/fox.html`);
    expect(locs).toContain(`${SITE_URL}/countries/us.html`);
    expect(locs).not.toContain(`${SITE_URL}/countries/mx.html`);
  });

  it("stamps the day the index was checked", () => {
    expect(renderSitemap(addresses(), fixture.updatedAt)).toContain("<lastmod>2026-06-26</lastmod>");
  });
});

describe("renderLlms", () => {
  const text = () => renderLlms(fixture, addresses());

  it("opens with the site name and a one-line summary carrying the measured counts", () => {
    const lines = text().split("\n");

    expect(lines[0]).toBe("# IPTV Doctor");
    expect(lines[2].startsWith("> ")).toBe(true);
    expect(lines[2]).toContain("3 official broadcaster");
    expect(lines[2]).toContain("2 countries");
    expect(text()).toContain("2 online, 0 slow, 1 unreachable");
    expect(text()).toContain("2026-06-26T01:35:47.459Z");
  });

  it("names no address the site does not serve", () => {
    const collected = addresses();
    const served = new Set([
      ...collected.pages.map((path) => (path ? `${SITE_URL}/${path}` : `${SITE_URL}/`)),
      ...collected.files.map((path) => `${SITE_URL}/${path}`)
    ]);
    const named = Array.from(text().matchAll(new RegExp(`${SITE_URL}/\\S*`, "g")))
      // Strip the markdown and sentence punctuation an address can end up against.
      .map((match) => match[0].replace(/[).,:;]+$/, ""));

    expect(named.length).toBeGreaterThanOrEqual(15);
    for (const address of named) {
      expect(served).toContain(address);
    }
  });

  it("gives every channel its result and the official site it was read from", () => {
    const body = text();

    expect(body).toContain(
      `- FOX (US, World Cup 2026) — online, 120 ms. ${SITE_URL}/channels/fox.html · official site https://www.foxsports.com/`
    );
    expect(body).toContain("- Telemundo Deportes (US, World Cup 2026) — unreachable.");
  });

  it("does not link a country whose page was never written", () => {
    const body = text();

    expect(body).toContain(`- US — 2 tracked, 1 online on the last check. ${SITE_URL}/countries/us.html`);
    expect(body).not.toContain("countries/mx.html");
    // The records are still counted in the summary; only the link is withheld.
    expect(body).toContain("across 2 countries");
  });

  it("offers each World Cup country only the files that exist for it", () => {
    const body = text();

    expect(body).toContain(
      `- US — ${SITE_URL}/world-cup-2026-tv-guide-us.html · XMLTV ${SITE_URL}/worldcup-2026-us.xmltv`
    );
    expect(body).toContain(`- AR — ${SITE_URL}/world-cup-2026-tv-guide-ar.html · placeholder M3U`);
    expect(body).not.toContain("worldcup-2026-ar.xmltv");
    expect(body).not.toMatch(/^- BR /m);
  });

  it("states the boundary a reader of this data has to know", () => {
    const body = text();

    expect(body).toContain("## Boundary");
    expect(body).toContain("No stream URL is stored, published or derivable");
    expect(body).toContain(fixture.sourceNote);
  });

  it("points a machine reader at the sibling machine indexes", () => {
    const body = text();

    expect(body).toContain("https://xyzs996.github.io/free-proxy-health-list/llms.txt");
    expect(body).toContain("https://xyzs996.github.io/free-llm-api/llms.txt");
    expect(body).toContain("https://xyzs996.github.io/ai-coding-field-notes/llms.txt");
    expect(body).toContain("https://github.com/xyzs996/iptv-doctor");
  });

  it("writes all three indexes and finds the home page Vite builds outside public/", () => {
    const root = mkdtempSync(resolve(tmpdir(), "iptv-site-"));
    const publicDir = resolve(root, "public");
    mkdirSync(resolve(publicDir, "countries"), { recursive: true });
    mkdirSync(resolve(publicDir, "channels"), { recursive: true });
    // The app entry lives beside public/, not inside it.
    writeFileSync(resolve(root, "index.html"), "<html></html>");
    for (const page of renderStaticPages(fixture)) {
      writeFileSync(resolve(publicDir, page.path), page.html);
    }
    writeFileSync(resolve(publicDir, "status-index.json"), "{}");

    const written = writeSiteIndexes(fixture, publicDir);
    const sitemap = readFileSync(resolve(publicDir, "sitemap.xml"), "utf-8");

    expect(written.pages).toContain("");
    expect(sitemap).toContain(`<loc>${SITE_URL}/</loc>`);
    expect(sitemap).toContain(`<loc>${SITE_URL}/channels/fox.html</loc>`);
    expect(readFileSync(resolve(publicDir, "robots.txt"), "utf-8")).toContain("Sitemap:");
    expect(readFileSync(resolve(publicDir, "llms.txt"), "utf-8")).toContain("# IPTV Doctor");
  });

  it("ends with one newline and carries no trailing whitespace", () => {
    const body = text();

    expect(body.endsWith("\n")).toBe(true);
    expect(body.endsWith("\n\n")).toBe(false);
    for (const line of body.split("\n")) {
      expect(line).toBe(line.trimEnd());
    }
  });
});
