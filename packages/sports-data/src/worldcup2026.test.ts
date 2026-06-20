import { describe, expect, it } from "vitest";
import { getWorldCup2026Dataset } from "./worldcup2026";

describe("getWorldCup2026Dataset", () => {
  it("returns a legal-viewing-ready World Cup dataset", () => {
    const dataset = getWorldCup2026Dataset();

    expect(dataset.tournament.name).toBe("FIFA World Cup 2026");
    expect(dataset.tournament.matchCount).toBe(104);
    expect(dataset.fixtures.length).toBeGreaterThanOrEqual(6);
    expect(dataset.fixtures[0]).toMatchObject({
      id: "wc26-001",
      status: "scheduled",
      homeTeam: "Mexico",
      awayTeam: "South Africa",
      venue: "Estadio Azteca",
      city: "Mexico City"
    });
    expect(new Set(dataset.fixtures.map((fixture) => fixture.status))).toEqual(new Set(["scheduled", "unknown"]));
    expect(dataset.broadcasters.US?.channels.map((channel) => channel.name)).toContain("FOX");
  });
});
