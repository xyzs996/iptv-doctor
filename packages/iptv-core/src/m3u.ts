export interface M3UChannel {
  name: string;
  url: string;
  tvgId?: string;
  tvgName?: string;
  groupTitle?: string;
}

export type M3UParseIssueCode = "EmptyPlaylistError" | "InvalidExtinfWarning";

export interface M3UParseIssue {
  code: M3UParseIssueCode;
  severity: "error" | "warning";
  line?: number;
  message: string;
}

export interface M3UParseResult {
  channels: M3UChannel[];
  issues: M3UParseIssue[];
}

function parseAttributes(line: string): Record<string, string> {
  const attributes: Record<string, string> = {};
  const pattern = /([\w-]+)="([^"]*)"/g;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(line)) !== null) {
    attributes[match[1]] = match[2];
  }

  return attributes;
}

function parseName(line: string, attrs: Record<string, string>): string {
  const commaIndex = line.lastIndexOf(",");
  const name = commaIndex >= 0 ? line.slice(commaIndex + 1).trim() : "";
  return name || attrs["tvg-name"] || attrs["tvg-id"] || "Unnamed Channel";
}

export function parseM3U(input: string): M3UChannel[] {
  return parseM3UWithIssues(input).channels;
}

export function parseM3UWithIssues(input: string): M3UParseResult {
  const channels: M3UChannel[] = [];
  const issues: M3UParseIssue[] = [];
  const lines = input.split(/\r?\n/);

  if (input.trim() === "") {
    return {
      channels,
      issues: [
        {
          code: "EmptyPlaylistError",
          severity: "error",
          message: "Playlist is empty."
        }
      ]
    };
  }

  let pending: Omit<M3UChannel, "url"> | undefined;

  for (const [index, rawLine] of lines.entries()) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line.startsWith("#EXTINF")) {
      const attrs = parseAttributes(line);
      if (!line.includes(",")) {
        issues.push({
          code: "InvalidExtinfWarning",
          severity: "warning",
          line: index + 1,
          message: "EXTINF row does not include a display name after a comma."
        });
      }
      pending = {
        name: parseName(line, attrs),
        tvgId: attrs["tvg-id"],
        tvgName: attrs["tvg-name"],
        groupTitle: attrs["group-title"]
      };
      continue;
    }

    if (line.startsWith("#")) {
      continue;
    }

    channels.push({
      ...(pending ?? { name: line }),
      url: line
    });
    pending = undefined;
  }

  return { channels, issues };
}
