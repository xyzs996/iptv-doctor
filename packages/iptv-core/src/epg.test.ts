import { describe, expect, it } from "vitest";
import { analyzeEpgMatches, renderFixedEpgM3U } from "./epg";

const xmltv = `<?xml version="1.0" encoding="UTF-8"?>
<tv>
  <channel id="fox.us">
    <display-name>FOX</display-name>
  </channel>
  <channel id="fs1.us">
    <display-name>FS1</display-name>
  </channel>
</tv>`;

describe("EPG matching", () => {
  it("reports matched and missing tvg-id values with display-name suggestions", () => {
    const result = analyzeEpgMatches(
      "#EXTM3U\n#EXTINF:-1 tvg-id=\"fox.us\",FOX\nhttps://example.com/fox.m3u8\n#EXTINF:-1,FS1\nhttps://example.com/fs1.m3u8\n",
      xmltv
    );

    expect(result.summary).toEqual({ total: 2, matched: 1, missing: 1 });
    expect(result.channels).toEqual([
      expect.objectContaining({ name: "FOX", tvgId: "fox.us", status: "matched" }),
      expect.objectContaining({ name: "FS1", tvgId: undefined, status: "missing", suggestedTvgId: "fs1.us" })
    ]);
  });

  it("writes a fixed M3U using suggested XMLTV channel ids", () => {
    const fixed = renderFixedEpgM3U(
      "#EXTM3U\n#EXTINF:-1 group-title=\"Sports\",FS1\nhttps://example.com/fs1.m3u8\n",
      xmltv
    );

    expect(fixed).toContain('#EXTINF:-1 tvg-id="fs1.us" group-title="Sports",FS1');
    expect(fixed).toContain("https://example.com/fs1.m3u8");
  });
});
