import { describe, expect, it } from "vitest";
import { summarizeLocalPlaylist } from "./localPlaylist";

describe("summarizeLocalPlaylist", () => {
  it("summarizes a local M3U without network access", () => {
    expect(
      summarizeLocalPlaylist(`#EXTM3U
#EXTINF:-1 tvg-id="fox.us" group-title="Sports",FOX
https://example.com/fox.m3u8
#EXTINF:-1 group-title="News",News
https://example.com/news.m3u8`)
    ).toEqual({
      total: 2,
      groups: [
        { group: "News", count: 1 },
        { group: "Sports", count: 1 }
      ],
      channels: ["FOX", "News"]
    });
  });
});
