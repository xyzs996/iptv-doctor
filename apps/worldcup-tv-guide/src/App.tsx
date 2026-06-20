import { CalendarDays, Download, Tv } from "lucide-react";
import { useState } from "react";
import { generateICalendar, generateM3UPlaceholder, generateXMLTV } from "@bjia666/match2epg";
import { getWorldCup2026Dataset } from "iptv-sports-data";
import { summarizeLocalPlaylist, type LocalPlaylistSummary } from "./localPlaylist";

const dataset = getWorldCup2026Dataset();
const usChannels = dataset.broadcasters.US?.channels ?? [];

function downloadFile(name: string, content: string, type: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

export function App() {
  const [localSummary, setLocalSummary] = useState<LocalPlaylistSummary | undefined>();

  async function handleLocalPlaylist(file: File | undefined): Promise<void> {
    if (!file) return;
    const text = await file.text();
    setLocalSummary(summarizeLocalPlaylist(text));
  }

  return (
    <main className="shell">
      <section className="toolbar">
        <div>
          <p className="eyebrow">Legal IPTV metadata</p>
          <h1>World Cup TV Guide</h1>
        </div>
        <div className="actions">
          <button onClick={() => downloadFile("worldcup-2026-us.xml", generateXMLTV(dataset, "US"), "application/xml")}>
            <Download size={16} /> XMLTV
          </button>
          <button onClick={() => downloadFile("worldcup-2026.ics", generateICalendar(dataset), "text/calendar")}>
            <CalendarDays size={16} /> iCal
          </button>
          <button onClick={() => downloadFile("worldcup-2026-us.m3u", generateM3UPlaceholder(dataset, "US"), "audio/x-mpegurl")}>
            <Tv size={16} /> M3U
          </button>
        </div>
      </section>

      <section className="summary">
        <div><strong>{dataset.tournament.matchCount}</strong><span>matches</span></div>
        <div><strong>{dataset.tournament.teamCount}</strong><span>teams</span></div>
        <div><strong>{dataset.tournament.hostCountries.length}</strong><span>hosts</span></div>
        <div><strong>{usChannels.length}</strong><span>US paths</span></div>
      </section>

      <section className="grid">
        <div className="panel">
          <h2>Schedule</h2>
          <div className="match-list">
            {dataset.fixtures.map((fixture) => (
              <article className="match-row" key={fixture.id}>
                <time>{new Date(fixture.kickoffUtc).toLocaleString()}</time>
                <div>
                  <strong>{fixture.homeTeam} vs {fixture.awayTeam}</strong>
                  <span>{fixture.stage} · {fixture.venue}, {fixture.city}</span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="panel">
          <h2>US Viewing</h2>
          <div className="channel-list">
            {usChannels.map((channel) => (
              <article className="channel-row" key={channel.id}>
                <strong>{channel.name}</strong>
                <span>{channel.language} · {channel.kind}</span>
                <a href={channel.website} target="_blank" rel="noreferrer">Official site</a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="panel local-panel">
        <h2>Local Playlist Preview</h2>
        <p>Parse an M3U file in your browser. The file stays on this device.</p>
        <input
          aria-label="Local M3U file"
          type="file"
          accept=".m3u,.m3u8,audio/x-mpegurl"
          onChange={(event) => void handleLocalPlaylist(event.target.files?.[0])}
        />
        {localSummary ? (
          <div className="local-summary">
            <strong>{localSummary.total} channels parsed locally</strong>
            <div className="chips">
              {localSummary.groups.map((item) => (
                <span key={item.group}>{item.group}: {item.count}</span>
              ))}
            </div>
            <p>{localSummary.channels.slice(0, 6).join(", ")}</p>
          </div>
        ) : null}
      </section>
    </main>
  );
}
