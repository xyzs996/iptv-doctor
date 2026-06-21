import { CalendarDays, Download, Github, Package, Tv } from "lucide-react";
import { useEffect, useState } from "react";
import { generateICalendar, generateM3UPlaceholder, generateXMLTV } from "@bjia666/match2epg";
import { getWorldCup2026Dataset } from "iptv-sports-data";
import { summarizeLocalPlaylist, type LocalPlaylistSummary } from "./localPlaylist";

const dataset = getWorldCup2026Dataset();
const usChannels = dataset.broadcasters.US?.channels ?? [];

interface StatusIndex {
  updatedAt: string;
  sourceMode: string;
  summary: {
    total: number;
    online: number;
    slow: number;
    offline: number;
    healthScore: number;
    countries: number;
  };
  records: Array<{
    id: string;
    name: string;
    country: string;
    category: string;
    status: "ok" | "warn" | "fail";
    latencyMs?: number;
    urlHost: string;
    checkedAt: string;
  }>;
}

function statusLabel(status: StatusIndex["records"][number]["status"]): string {
  if (status === "ok") return "online";
  if (status === "warn") return "slow";
  return "offline";
}

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
  const [statusIndex, setStatusIndex] = useState<StatusIndex | undefined>();
  const summaryItems = statusIndex
    ? [
        { value: statusIndex.summary.total, label: "entries checked" },
        { value: statusIndex.summary.online, label: "online" },
        { value: statusIndex.summary.offline, label: "offline" },
        { value: `${statusIndex.summary.healthScore}%`, label: "health score" }
      ]
    : [
        { value: dataset.tournament.matchCount, label: "matches" },
        { value: dataset.tournament.teamCount, label: "teams" },
        { value: dataset.tournament.hostCountries.length, label: "hosts" },
        { value: usChannels.length, label: "US paths" }
      ];

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}status-index.json`)
      .then((response) => (response.ok ? response.json() : undefined))
      .then((value: StatusIndex | undefined) => setStatusIndex(value))
      .catch(() => setStatusIndex(undefined));
  }, []);

  async function handleLocalPlaylist(file: File | undefined): Promise<void> {
    if (!file) return;
    const text = await file.text();
    setLocalSummary(summarizeLocalPlaylist(text));
  }

  return (
    <main className="shell">
      <section className="toolbar">
        <div>
          <p className="eyebrow">IPTV playlist checker</p>
          <h1>IPTV Doctor</h1>
          <p className="dek">
            Check M3U and M3U8 playlists, clean dead IPTV channels, fix XMLTV EPG IDs, and export legal World Cup 2026 metadata.
          </p>
        </div>
        <div className="actions">
          <a className="button-link" href="https://github.com/xyzs996/iptv-doctor" target="_blank" rel="noreferrer">
            <Github size={16} /> GitHub
          </a>
          <a className="button-link" href="https://www.npmjs.com/package/iptv-doctor" target="_blank" rel="noreferrer">
            <Package size={16} /> npm
          </a>
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
        {summaryItems.map((item) => (
          <div key={item.label}><strong>{item.value}</strong><span>{item.label}</span></div>
        ))}
      </section>

      {statusIndex ? (
        <section className="panel status-panel">
          <div className="panel-title">
            <div>
              <p className="eyebrow">Auto-updated index</p>
              <h2>Live IPTV Status Index</h2>
            </div>
            <div className="status-actions">
              <a href={`${import.meta.env.BASE_URL}status-index.json`}>JSON</a>
              <a href={`${import.meta.env.BASE_URL}status-index.csv`}>CSV</a>
              <span>{new Date(statusIndex.updatedAt).toLocaleString()}</span>
            </div>
          </div>
          <div className="status-table">
            {statusIndex.records.slice(0, 10).map((record) => (
              <article className="status-row" key={record.id}>
                <strong>{record.name}</strong>
                <span>{record.country} · {record.category}</span>
                <span className={`status-pill ${record.status}`}>{statusLabel(record.status)}</span>
                <span>{typeof record.latencyMs === "number" ? `${record.latencyMs} ms` : "-"}</span>
                <span>{record.urlHost}</span>
              </article>
            ))}
          </div>
        </section>
      ) : null}

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
        <h2>Local M3U Playlist Preview</h2>
        <p>Parse an M3U or M3U8 playlist in your browser. The file stays on this device.</p>
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

      <section className="search-panel">
        <article>
          <h2>M3U / M3U8 checker</h2>
          <p>Detect broken IPTV playlist entries, slow HLS manifests, and failed media segment samples before match day.</p>
        </article>
        <article>
          <h2>XMLTV EPG fixer</h2>
          <p>Compare playlist `tvg-id` values with XMLTV display names and generate fixed M3U output from the CLI.</p>
        </article>
        <article>
          <h2>GitHub Actions health reports</h2>
          <p>Run `xyzs996/iptv-doctor@v1` in CI and publish HTML, JSON, CSV, and Shields-compatible badge artifacts.</p>
        </article>
      </section>
    </main>
  );
}
