import { describe, expect, it } from "vitest";
import { scanComplianceText } from "./compliance";

describe("scanComplianceText", () => {
  it("allows placeholder examples", () => {
    expect(scanComplianceText("https://example.com/legal-placeholder.m3u8", "README.md")).toEqual([]);
  });

  it("flags Xtream credentials and Stalker portal markers", () => {
    const findings = scanComplianceText(
      "http://provider.test/get.php?username=alice&password=secret&type=m3u\nstalker_portal\nmac=00:1A:79:12:34:56",
      "bad.txt"
    );

    expect(findings.map((finding) => finding.code)).toEqual(
      expect.arrayContaining(["XTREAM_CREDENTIALS", "STALKER_PORTAL", "MAC_PORTAL"])
    );
  });

  it("flags softcam keys and secret-looking stream URLs", () => {
    const findings = scanComplianceText("SOFTCAM KEYS\nhttps://stream.example.tv/live/channel.m3u8?token=secret", "bad.txt");

    expect(findings.map((finding) => finding.code)).toEqual(expect.arrayContaining(["SOFTCAM_KEY", "SECRET_STREAM_URL"]));
  });

  it("flags bulk real-looking stream lists", () => {
    const findings = scanComplianceText(
      `#EXTM3U
#EXTINF:-1,One
http://stream-one.com/live.m3u8
#EXTINF:-1,Two
http://stream-two.com/live.m3u8
#EXTINF:-1,Three
http://stream-three.com/live.m3u8`,
      "playlist.txt"
    );

    expect(findings.map((finding) => finding.code)).toContain("BULK_STREAM_LIST");
  });
});
