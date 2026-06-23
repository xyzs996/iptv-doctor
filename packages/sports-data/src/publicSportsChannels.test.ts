import { describe, expect, it } from "vitest";
import { publicSportsChannels } from "./publicSportsChannels";

describe("publicSportsChannels", () => {
  it("contains enough public metadata to make the status index useful", () => {
    expect(publicSportsChannels.length).toBeGreaterThanOrEqual(100);
    expect(new Set(publicSportsChannels.map((channel) => channel.country)).size).toBeGreaterThanOrEqual(15);
  });

  it("uses stable ids and official web URLs without publishing streams", () => {
    const ids = new Set<string>();

    for (const channel of publicSportsChannels) {
      expect(ids.has(channel.id)).toBe(false);
      ids.add(channel.id);
      expect(channel.officialWebsite).toMatch(/^https:\/\//);
      expect(channel.officialWebsite).not.toMatch(/\.m3u8|\/live\/|token=|username=|password=/i);
      expect(channel.evidence.toLowerCase()).toContain("official");
    }
  });
});
