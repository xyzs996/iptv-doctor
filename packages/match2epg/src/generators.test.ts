import { describe, expect, it } from "vitest";
import { getWorldCup2026Dataset } from "iptv-sports-data";
import { generateICalendar, generateM3UPlaceholder, generateWorldCupGuideHtml, generateXMLTV } from "./generators";

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
});
