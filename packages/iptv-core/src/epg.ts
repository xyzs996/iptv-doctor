import { renderCleanM3U } from "./clean.js";
import type { M3UChannel } from "./m3u.js";
import { parseM3U } from "./m3u.js";
import type { ChannelDiagnostic } from "./diagnostics.js";

export interface XmltvChannel {
  id: string;
  displayNames: string[];
}

export interface EpgChannelMatch {
  name: string;
  url: string;
  tvgId?: string;
  status: "matched" | "missing";
  suggestedTvgId?: string;
}

export interface EpgMatchResult {
  summary: {
    total: number;
    matched: number;
    missing: number;
  };
  availableIds: string[];
  channels: EpgChannelMatch[];
}

export function analyzeEpgMatches(playlistInput: string, xmltvInput: string): EpgMatchResult {
  const channels = parseM3U(playlistInput);
  const xmltvChannels = parseXmltvChannels(xmltvInput);
  const ids = new Set(xmltvChannels.map((channel) => channel.id));
  const byName = new Map<string, string>();

  for (const channel of xmltvChannels) {
    byName.set(normalize(channel.id), channel.id);
    for (const name of channel.displayNames) {
      byName.set(normalize(name), channel.id);
    }
  }

  const matches = channels.map((channel) => {
    const matched = channel.tvgId ? ids.has(channel.tvgId) : false;
    const suggestedTvgId = matched ? undefined : suggestTvgId(channel, byName);
    return {
      name: channel.name,
      url: channel.url,
      tvgId: channel.tvgId,
      status: matched ? "matched" : "missing",
      suggestedTvgId
    } satisfies EpgChannelMatch;
  });

  return {
    summary: {
      total: matches.length,
      matched: matches.filter((match) => match.status === "matched").length,
      missing: matches.filter((match) => match.status === "missing").length
    },
    availableIds: [...ids].sort(),
    channels: matches
  };
}

export function renderFixedEpgM3U(playlistInput: string, xmltvInput: string): string {
  const channels = parseM3U(playlistInput);
  const matches = analyzeEpgMatches(playlistInput, xmltvInput);
  const suggestedByUrl = new Map(matches.channels.map((match) => [match.url, match.suggestedTvgId]));
  const diagnostics: ChannelDiagnostic[] = channels.map((channel) => ({
    channel: {
      ...channel,
      tvgId: channel.tvgId ?? suggestedByUrl.get(channel.url)
    },
    status: "ok",
    code: "OK",
    message: "EPG ID fixed locally.",
    checkedAt: new Date(0).toISOString(),
    urlHost: safeHost(channel.url)
  }));

  return renderCleanM3U(diagnostics);
}

function parseXmltvChannels(input: string): XmltvChannel[] {
  const channels: XmltvChannel[] = [];
  const channelPattern = /<channel\b[^>]*\bid=(["'])(.*?)\1[^>]*>([\s\S]*?)<\/channel>/gi;
  let match: RegExpExecArray | null;

  while ((match = channelPattern.exec(input)) !== null) {
    channels.push({
      id: decodeXml(match[2]),
      displayNames: [...match[3].matchAll(/<display-name\b[^>]*>([\s\S]*?)<\/display-name>/gi)].map((item) =>
        decodeXml(stripTags(item[1]).trim())
      )
    });
  }

  return channels;
}

function suggestTvgId(channel: M3UChannel, byName: Map<string, string>): string | undefined {
  return byName.get(normalize(channel.tvgName ?? "")) ?? byName.get(normalize(channel.name));
}

function normalize(value: string): string {
  return value.trim().toLowerCase().replaceAll(/\s+/g, " ");
}

function stripTags(value: string): string {
  return value.replaceAll(/<[^>]+>/g, "");
}

function decodeXml(value: string): string {
  return value
    .replaceAll("&quot;", "\"")
    .replaceAll("&apos;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&");
}

function safeHost(value: string): string {
  try {
    return new URL(value).host;
  } catch {
    return "";
  }
}
