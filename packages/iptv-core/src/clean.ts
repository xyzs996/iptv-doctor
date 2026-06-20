import type { ChannelDiagnostic } from "./diagnostics.js";

export function renderCleanM3U(diagnostics: ChannelDiagnostic[]): string {
  const lines = ["#EXTM3U"];

  for (const item of diagnostics) {
    if (item.status === "fail") continue;

    const attrs = [
      item.channel.tvgId ? `tvg-id="${escapeAttribute(item.channel.tvgId)}"` : undefined,
      item.channel.tvgName ? `tvg-name="${escapeAttribute(item.channel.tvgName)}"` : undefined,
      item.channel.groupTitle ? `group-title="${escapeAttribute(item.channel.groupTitle)}"` : undefined
    ]
      .filter(Boolean)
      .join(" ");

    lines.push(`#EXTINF:-1${attrs ? ` ${attrs}` : ""},${item.channel.name}`);
    lines.push(item.channel.url);
  }

  return `${lines.join("\n")}\n`;
}

function escapeAttribute(value: string): string {
  return value.replaceAll("\"", "&quot;");
}
