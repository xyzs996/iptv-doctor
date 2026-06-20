import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { runMatch2EpgCli } from "./cli";

function tempDir(): string {
  return mkdtempSync(join(tmpdir(), "match2epg-"));
}

describe("runMatch2EpgCli", () => {
  it("writes output when --out is supplied", () => {
    const output = join(tempDir(), "worldcup.xml");

    runMatch2EpgCli(["node", "match2epg", "xmltv", "US", "--out", output]);

    expect(readFileSync(output, "utf8")).toContain("<tv generator-info-name=\"match2epg\"");
  });

  it("keeps positional output path compatibility", () => {
    const output = join(tempDir(), "worldcup.ics");

    runMatch2EpgCli(["node", "match2epg", "ics", "US", output]);

    expect(readFileSync(output, "utf8")).toContain("BEGIN:VCALENDAR");
  });
});
