import { describe, expect, it } from "vitest";
import { getWorldCup2026Dataset } from "iptv-sports-data";
import {
  generateCountryWorldCupGuidePage,
  generateICalendar,
  generateM3UPlaceholder,
  generateWorldCupCountryIndexPage,
  generateWorldCupGuideHtml,
  generateXMLTV
} from "./generators";

describe("match2epg generators", () => {
  const dataset = getWorldCup2026Dataset();

  it("generates XMLTV with stable channel and programme identifiers", () => {
    const xmltv = generateXMLTV(dataset, "US");

    expect(xmltv).toContain("<tv generator-info-name=\"match2epg\"");
    expect(xmltv).toContain("<channel id=\"fox.us\">");
    expect(xmltv).toContain("<programme");
    expect(xmltv).toContain("Mexico vs South Africa");
    expect(xmltv).toContain("Status: scheduled");
  });

  it("generates an iCalendar feed for matches", () => {
    const ics = generateICalendar(dataset);

    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("UID:wc26-001@match2epg");
    expect(ics).toContain("SUMMARY:Mexico vs South Africa");
    expect(ics).toContain("STATUS:TENTATIVE");
  });

  it("generates placeholder M3U entries without embedding stream URLs", () => {
    const m3u = generateM3UPlaceholder(dataset, "US");

    expect(m3u).toContain("#EXTM3U");
    expect(m3u).toContain("tvg-id=\"fox.us\"");
    expect(m3u).toContain("https://example.invalid/add-your-legal-stream");
  });

  it("generates a shareable HTML guide for the World Cup pack", () => {
    const html = generateWorldCupGuideHtml(dataset, "US");

    expect(html).toContain("<title>World Cup 2026 IPTV Pack</title>");
    expect(html).toContain("Mexico vs South Africa");
    expect(html).toContain("scheduled");
    expect(html).toContain("FOX");
    expect(html).toContain("No stream URLs are included");
  });

  // Counted against the live sitemap on 2026-08-22: 62 of this site's 340
  // pages ended without any way out to the sibling projects, and all 62 were
  // these guides -- every country page plus the index the repository lists as
  // its home page. Every criterion that had asked "does a page link out" until
  // then checked the status index or the checker, which had carried one since
  // they were written, so the question was green the whole time it was broken.
  //
  // This counts instead: every country in the dataset, plus the index.
  it("every guide page it generates ends with a way out, not just the sampled one", () => {
    const countries = Object.keys(dataset.broadcasters) as Array<keyof typeof dataset.broadcasters>;
    expect(countries.length).toBeGreaterThan(20);

    const pages = countries.map((country) => generateCountryWorldCupGuidePage(dataset, country as never));
    pages.push(generateWorldCupCountryIndexPage(dataset));

    for (const html of pages) {
      const footer = html.split("<footer>")[1] ?? "";
      expect(footer).toContain("llm-api-pricing/figures.html");
      expect(footer).toContain("github.com/xyzs996/iptv-doctor");
    }
  });

  // The star is measured, not assumed: it is the only reader action this
  // account has ever recorded. A criterion that only asked whether the link
  // exists would stay green if it were moved below the sibling list.
  it("the star comes before the list of other projects", () => {
    const footer = generateWorldCupCountryIndexPage(dataset).split("<footer>")[1] ?? "";

    expect(footer.indexOf("github.com/xyzs996/iptv-doctor")).toBeLessThan(
      footer.indexOf("llm-api-pricing/figures.html")
    );
  });
});
