export type CountryCode = string;

export interface TournamentInfo {
  name: string;
  edition: number;
  startDate: string;
  endDate: string;
  hostCountries: string[];
  teamCount: number;
  matchCount: number;
}

export type BroadcasterKind = "broadcast" | "streaming" | "public";

export interface Broadcaster {
  id: string;
  name: string;
  country: CountryCode;
  language: string;
  kind: BroadcasterKind;
  /** Whether the viewing path is free-to-air / free-to-stream. */
  isFree?: boolean;
  website: string;
  notes: string;
}

export interface BroadcasterRegion {
  country: CountryCode;
  label: string;
  channels: Broadcaster[];
}

export type FixtureStatus = "scheduled" | "live" | "finished" | "postponed" | "unknown";

export interface Fixture {
  id: string;
  stage: string;
  status: FixtureStatus;
  kickoffUtc: string;
  homeTeam: string;
  awayTeam: string;
  venue: string;
  city: string;
  country: string;
  broadcasterIdsByCountry: Partial<Record<CountryCode, string[]>>;
}

export interface SportsDataset {
  tournament: TournamentInfo;
  broadcasters: Partial<Record<CountryCode, BroadcasterRegion>>;
  fixtures: Fixture[];
}

export interface PublicSportsChannel {
  id: string;
  name: string;
  country: CountryCode;
  language: string;
  sports: string[];
  officialWebsite: string;
  evidence: string;
  epgId?: string;
}
