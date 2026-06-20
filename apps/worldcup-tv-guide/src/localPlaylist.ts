import { parseM3U } from "@iptv-star/iptv-core";

export interface LocalPlaylistSummary {
  total: number;
  groups: Array<{ group: string; count: number }>;
  channels: string[];
}

export function summarizeLocalPlaylist(input: string): LocalPlaylistSummary {
  const channels = parseM3U(input);
  const groupCounts = new Map<string, number>();

  for (const channel of channels) {
    const group = channel.groupTitle ?? "Ungrouped";
    groupCounts.set(group, (groupCounts.get(group) ?? 0) + 1);
  }

  return {
    total: channels.length,
    groups: [...groupCounts.entries()]
      .map(([group, count]) => ({ group, count }))
      .sort((left, right) => left.group.localeCompare(right.group)),
    channels: channels.map((channel) => channel.name)
  };
}
