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

function freeLabel(isFree?: boolean): string {
  if (isFree === true) return "Free";
  if (isFree === false) return "Paid";
  return "";
}

export function generateWorldCupGuideHtml(dataset: SportsDataset, country: CountryCode): string {
  const region = dataset.broadcasters[country];
  const channels = region?.channels ?? [];
  const channelCards = channels
    .map(
      (channel) => `<article>
  <h3>${xmlEscape(channel.name)}</h3>
  <p>${xmlEscape(channel.language)} · ${xmlEscape(channel.kind)}${channel.isFree !== undefined ? ` · ${freeLabel(channel.isFree)}` : ""}</p>
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

export function generateCountryWorldCupGuidePage(dataset: SportsDataset, country: CountryCode): string {
  const region = dataset.broadcasters[country];
  const channels = region?.channels ?? [];
  const countryName = region?.label ?? country;
  const freeCount = channels.filter((c) => c.isFree === true).length;
  const paidCount = channels.filter((c) => c.isFree === false).length;

  const channelRows = channels
    .map(
      (channel) => `<tr>
  <td><a href="${xmlEscape(channel.website)}" target="_blank" rel="noreferrer">${xmlEscape(channel.name)}</a></td>
  <td>${xmlEscape(channel.language)}</td>
  <td>${xmlEscape(channel.kind)}</td>
  <td>${freeLabel(channel.isFree) || "-"}</td>
</tr>`
    )
    .join("\n");

  const matches = dataset.fixtures
    .filter((fixture) => (fixture.broadcasterIdsByCountry[country] ?? []).length > 0)
    .map(
      (fixture) => `<tr>
  <td>${xmlEscape(fixture.stage)}</td>
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
  <title>World Cup 2026 TV Guide — ${xmlEscape(countryName)}</title>
  <meta name="description" content="Official World Cup 2026 broadcasters and streaming options for ${xmlEscape(countryName)}. No stream URLs. Download XMLTV, iCal and placeholder M3U.">
  <link rel="canonical" href="https://xyzs996.github.io/iptv-doctor/world-cup-2026-tv-guide-${country.toLowerCase()}.html">
  <style>
    body { font-family: Inter, ui-sans-serif, system-ui, sans-serif; margin: 0; color: #172026; background: #f6f8f4; }
    main { margin: 0 auto; max-width: 960px; padding: 32px; }
    h1 { font-size: 34px; margin: 0 0 8px; }
    p { color: #52626d; line-height: 1.55; }
    .summary { display: grid; gap: 1px; grid-template-columns: repeat(4, minmax(0, 1fr)); margin: 24px 0; }
    .summary div { background: #e5ece3; padding: 16px; }
    .summary strong { color: #163d57; display: block; font-size: 26px; }
    table { background: white; border: 1px solid #d7dfd5; border-collapse: collapse; width: 100%; margin: 20px 0; }
    th, td { border-bottom: 1px solid #e4e8e0; padding: 10px 12px; text-align: left; }
    th { background: #edf3f7; font-size: 13px; text-transform: uppercase; }
    a { color: #163d57; font-weight: 700; }
    .actions { display: flex; flex-wrap: wrap; gap: 10px; margin: 16px 0; }
    .actions a { background: #163d57; color: white; padding: 8px 14px; border-radius: 6px; text-decoration: none; font-size: 14px; }
    @media (max-width: 760px) { main { padding: 20px; } .summary { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  </style>
</head>
<body>
<main>
  <h1>World Cup 2026 TV Guide</h1>
  <p>Official broadcasters and streaming options for <strong>${xmlEscape(countryName)}</strong>. This page lists legal viewing paths only — no stream URLs are hosted or published.</p>
  <div class="actions">
    <a href="worldcup-2026-${country.toLowerCase()}.xmltv" download>Download XMLTV</a>
    <a href="worldcup-2026.ics" download>Download iCal</a>
    <a href="worldcup-2026-${country.toLowerCase()}-placeholder.m3u" download>Download M3U Placeholder</a>
  </div>
  <section class="summary">
    <div><strong>${channels.length}</strong><span>channels</span></div>
    <div><strong>${freeCount}</strong><span>free</span></div>
    <div><strong>${paidCount}</strong><span>paid</span></div>
    <div><strong>${dataset.fixtures.filter((f) => (f.broadcasterIdsByCountry[country] ?? []).length > 0).length}</strong><span>sample fixtures</span></div>
  </section>
  <h2>Channels</h2>
  <table>
    <thead><tr><th>Channel</th><th>Language</th><th>Type</th><th>Cost</th></tr></thead>
    <tbody>${channelRows}</tbody>
  </table>
  <h2>Sample Fixtures</h2>
  <table>
    <thead><tr><th>Stage</th><th>Match</th><th>Kickoff UTC</th><th>Venue</th></tr></thead>
    <tbody>${matches}</tbody>
  </table>
  <p><a href="world-cup-2026-tv-guide.html">← All countries</a></p>
</main>
</body>
</html>
`;
}

export function generateWorldCupCountryIndexPage(dataset: SportsDataset): string {
  const regions = Object.values(dataset.broadcasters).filter((r): r is NonNullable<typeof r> => r !== undefined);
  const totalChannels = regions.reduce((sum, r) => sum + r.channels.length, 0);
  const totalFree = regions.reduce((sum, r) => sum + r.channels.filter((c) => c.isFree === true).length, 0);
  const countryCards = regions
    .sort((a, b) => a.label.localeCompare(b.label))
    .map(
      (region) => {
        const free = region.channels.filter((c) => c.isFree === true).length;
        const paid = region.channels.filter((c) => c.isFree === false).length;
        return `<a class="card" href="world-cup-2026-tv-guide-${region.country.toLowerCase()}.html">
  <h3>${xmlEscape(region.label)}</h3>
  <p>${region.channels.length} channels · ${free} free · ${paid} paid</p>
</a>`;
      }
    )
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>World Cup 2026 TV Guide by Country</title>
  <meta name="description" content="Find official FIFA World Cup 2026 broadcasters and streaming options for every country. No stream URLs. Download XMLTV, iCal and M3U placeholders.">
  <link rel="canonical" href="https://xyzs996.github.io/iptv-doctor/world-cup-2026-tv-guide.html">
  <style>
    body { font-family: Inter, ui-sans-serif, system-ui, sans-serif; margin: 0; color: #172026; background: #f6f8f4; }
    main { margin: 0 auto; max-width: 1120px; padding: 32px; }
    h1 { font-size: 38px; margin: 0 0 10px; }
    p { color: #52626d; line-height: 1.55; }
    .summary { display: grid; gap: 1px; grid-template-columns: repeat(3, minmax(0, 1fr)); margin: 24px 0; }
    .summary div { background: #e5ece3; padding: 16px; }
    .summary strong { color: #163d57; display: block; font-size: 28px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; margin: 24px 0; }
    .card { background: white; border: 1px solid #d7dfd5; padding: 16px; border-radius: 8px; text-decoration: none; color: inherit; }
    .card h3 { margin: 0 0 6px; color: #163d57; }
    .card p { margin: 0; font-size: 14px; }
    @media (max-width: 760px) { main { padding: 20px; } .summary { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
<main>
  <h1>World Cup 2026 TV Guide by Country</h1>
  <p>Find official broadcasters and streaming options for every FIFA World Cup 2026 country. All paths are legal metadata only — no stream URLs are hosted or published.</p>
  <section class="summary">
    <div><strong>${regions.length}</strong><span>countries</span></div>
    <div><strong>${totalChannels}</strong><span>channels</span></div>
    <div><strong>${totalFree}</strong><span>free options</span></div>
  </section>
  <div class="grid">${countryCards}</div>
</main>
</body>
</html>
`;
}
