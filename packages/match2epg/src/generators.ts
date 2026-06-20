import type { CountryCode, Fixture, SportsDataset } from "iptv-sports-data";

const PLACEHOLDER_STREAM_URL = "https://example.invalid/add-your-legal-stream";

function xmlEscape(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;");
}

function textEscape(value: string): string {
  return value.replaceAll("\\", "\\\\").replaceAll("\n", "\\n").replaceAll(",", "\\,").replaceAll(";", "\\;");
}

function formatXMLTVDate(value: string): string {
  const date = new Date(value);
  const pad = (input: number) => input.toString().padStart(2, "0");
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())} +0000`;
}

function formatICSDate(value: string): string {
  return formatXMLTVDate(value).replace(" +0000", "Z");
}

function endTime(value: string, minutes = 120): string {
  return new Date(new Date(value).getTime() + minutes * 60_000).toISOString();
}

function matchTitle(fixture: Fixture): string {
  return `${fixture.homeTeam} vs ${fixture.awayTeam}`;
}

function iCalendarStatus(fixture: Fixture): string {
  if (fixture.status === "postponed") return "CANCELLED";
  if (fixture.status === "live" || fixture.status === "finished") return "CONFIRMED";
  return "TENTATIVE";
}

export function generateXMLTV(dataset: SportsDataset, country: CountryCode): string {
  const region = dataset.broadcasters[country];
  const channels = region?.channels ?? [];
  const channelIds = new Set(channels.map((channel) => channel.id));
  const lines = [
    "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
    "<tv generator-info-name=\"match2epg\" generator-info-url=\"https://github.com/xyzs996/iptv-doctor\">"
  ];

  for (const channel of channels) {
    lines.push(`  <channel id="${xmlEscape(channel.id)}">`);
    lines.push(`    <display-name>${xmlEscape(channel.name)}</display-name>`);
    lines.push(`    <url>${xmlEscape(channel.website)}</url>`);
    lines.push("  </channel>");
  }

  for (const fixture of dataset.fixtures) {
    const ids = fixture.broadcasterIdsByCountry[country] ?? [];
    for (const broadcasterId of ids.filter((id) => channelIds.has(id))) {
      lines.push(
        `  <programme start="${formatXMLTVDate(fixture.kickoffUtc)}" stop="${formatXMLTVDate(endTime(fixture.kickoffUtc))}" channel="${xmlEscape(broadcasterId)}">`
      );
      lines.push(`    <title lang="en">${xmlEscape(matchTitle(fixture))}</title>`);
      lines.push(`    <sub-title lang="en">${xmlEscape(fixture.stage)}</sub-title>`);
      lines.push(
        `    <desc lang="en">${xmlEscape(`${fixture.venue}, ${fixture.city}. Status: ${fixture.status}. Add your legal stream URL in your IPTV player.`)}</desc>`
      );
      lines.push("    <category lang=\"en\">Football</category>");
      lines.push("  </programme>");
    }
  }

  lines.push("</tv>");
  return `${lines.join("\n")}\n`;
}

export function generateICalendar(dataset: SportsDataset): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//iptv-doctor//match2epg//EN",
    `X-WR-CALNAME:${textEscape(dataset.tournament.name)}`
  ];

  for (const fixture of dataset.fixtures) {
    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${fixture.id}@match2epg`);
    lines.push(`DTSTAMP:${formatICSDate(new Date().toISOString())}`);
    lines.push(`DTSTART:${formatICSDate(fixture.kickoffUtc)}`);
    lines.push(`DTEND:${formatICSDate(endTime(fixture.kickoffUtc))}`);
    lines.push(`SUMMARY:${textEscape(matchTitle(fixture))}`);
    lines.push(`LOCATION:${textEscape(`${fixture.venue}, ${fixture.city}`)}`);
    lines.push(`STATUS:${iCalendarStatus(fixture)}`);
    lines.push(`DESCRIPTION:${textEscape(`${fixture.stage} - ${dataset.tournament.name} - Status: ${fixture.status}`)}`);
    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");
  return `${lines.join("\r\n")}\r\n`;
}

export function generateM3UPlaceholder(dataset: SportsDataset, country: CountryCode): string {
  const region = dataset.broadcasters[country];
  const lines = ["#EXTM3U"];

  for (const channel of region?.channels ?? []) {
    lines.push(
      `#EXTINF:-1 tvg-id="${channel.id}" tvg-name="${channel.name}" group-title="${dataset.tournament.name}",${channel.name}`
    );
    lines.push(PLACEHOLDER_STREAM_URL);
  }

  return `${lines.join("\n")}\n`;
}

export function generateWorldCupGuideHtml(dataset: SportsDataset, country: CountryCode): string {
  const region = dataset.broadcasters[country];
  const channels = region?.channels ?? [];
  const channelCards = channels
    .map(
      (channel) => `<article>
  <h3>${xmlEscape(channel.name)}</h3>
  <p>${xmlEscape(channel.language)} · ${xmlEscape(channel.kind)}</p>
  <a href="${xmlEscape(channel.website)}">Official site</a>
</article>`
    )
    .join("\n");
  const matches = dataset.fixtures
    .map(
      (fixture) => `<tr>
  <td>${xmlEscape(fixture.stage)}</td>
  <td>${xmlEscape(fixture.status)}</td>
  <td>${xmlEscape(fixture.homeTeam)} vs ${xmlEscape(fixture.awayTeam)}</td>
  <td>${xmlEscape(fixture.kickoffUtc)}</td>
  <td>${xmlEscape(`${fixture.venue}, ${fixture.city}`)}</td>
</tr>`
    )
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>World Cup 2026 IPTV Pack</title>
  <style>
    body { font-family: Inter, ui-sans-serif, system-ui, sans-serif; margin: 32px; color: #172026; background: #f7f9fb; }
    h1 { margin: 0 0 8px; }
    p { color: #53616d; }
    .channels { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin: 24px 0; }
    article, table { background: white; border: 1px solid #d8e0e7; }
    article { padding: 14px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border-bottom: 1px solid #e7edf2; padding: 10px 12px; text-align: left; }
    th { background: #edf3f7; }
  </style>
</head>
<body>
  <h1>World Cup 2026 IPTV Pack</h1>
  <p>No stream URLs are included. Add your own legal playlist or provider URLs in your IPTV player.</p>
  <section class="channels">${channelCards}</section>
  <table>
    <thead><tr><th>Stage</th><th>Status</th><th>Match</th><th>Kickoff UTC</th><th>Venue</th></tr></thead>
    <tbody>${matches}</tbody>
  </table>
</body>
</html>
`;
}
