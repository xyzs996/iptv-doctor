import { describe, expect, it } from "vitest";
import { parseM3U, parseM3UWithIssues } from "./m3u";

describe("parseM3U", () => {
  it("parses channel metadata and URLs from an M3U playlist", () => {
    const playlist = `#EXTM3U
#EXTINF:-1 tvg-id="fox.us" tvg-name="FOX" group-title="Sports",FOX
https://example.com/fox.m3u8
#EXTINF:-1 tvg-id="fs1.us" group-title="Sports",FS1
https://example.com/fs1.m3u8`;

    expect(parseM3U(playlist)).toEqual([
      {
        name: "FOX",
        url: "https://example.com/fox.m3u8",
        tvgId: "fox.us",
        tvgName: "FOX",
        groupTitle: "Sports"
      },
      {
        name: "FS1",
        url: "https://example.com/fs1.m3u8",
        tvgId: "fs1.us",
        groupTitle: "Sports"
      }
    ]);
  });

  it("reports an empty playlist with a named parse error", () => {
    expect(parseM3UWithIssues("")).toEqual({
      channels: [],
      issues: [
        {
          code: "EmptyPlaylistError",
          severity: "error",
          message: "Playlist is empty."
        }
      ]
    });
  });

  it("warns on invalid EXTINF rows and continues parsing", () => {
    expect(
      parseM3UWithIssues(`#EXTM3U
#EXTINF:-1 tvg-id="broken"
https://example.com/broken.m3u8
#EXTINF:-1,OK
https://example.com/ok.m3u8`)
    ).toEqual({
      channels: [
        {
          name: "broken",
          url: "https://example.com/broken.m3u8",
          tvgId: "broken"
        },
        {
          name: "OK",
          url: "https://example.com/ok.m3u8"
        }
      ],
      issues: [
        {
          code: "InvalidExtinfWarning",
          severity: "warning",
          line: 2,
          message: "EXTINF row does not include a display name after a comma."
        }
      ]
    });
  });
});
