<!--
  SEO: iptv playlist checker, m3u cleaner, m3u8 checker, hls checker, xmltv epg fixer,
  world cup 2026 tv guide, fifa world cup 2026 broadcasters, where to watch world cup 2026,
  iptv doctor, free iptv status index, kodi iptv cleaner, jellyfin iptv setup, plex iptv
-->

<div align="center">

# 🏆 IPTV Doctor — World Cup 2026 TV Guide & Playlist Checker

**Open-source IPTV playlist checker, M3U/M3U8 cleaner, XMLTV EPG fixer, and FIFA World Cup 2026 broadcaster guide.**

[![Live IPTV status](https://img.shields.io/endpoint?url=https%3A%2F%2Fxyzs996.github.io%2Fiptv-doctor%2Fstatus-badge.json)](https://xyzs996.github.io/iptv-doctor/status-index.json)
[![npm](https://img.shields.io/npm/v/iptv-doctor)](https://www.npmjs.com/package/iptv-doctor)
[![GitHub Pages](https://img.shields.io/badge/live-demo-blue)](https://xyzs996.github.io/iptv-doctor/)
[![World Cup 2026 countries](https://img.shields.io/badge/World%20Cup%202026-61%20countries-brightgreen)](https://xyzs996.github.io/iptv-doctor/world-cup-2026-tv-guide.html)

[Live Demo](https://xyzs996.github.io/iptv-doctor/) · [World Cup TV Guide](https://xyzs996.github.io/iptv-doctor/world-cup-2026-tv-guide.html) · [IPTV Status Index](https://xyzs996.github.io/iptv-doctor/status-index.html) · [npm package](https://www.npmjs.com/package/iptv-doctor)

</div>

---

## 🌍 FIFA World Cup 2026 TV Guide by Country

The easiest way to find **official, legal broadcasters and streaming options** for every FIFA World Cup 2026 country. No pirated streams. No paid channel lists. No Xtream credentials. We only store metadata — never stream URLs.

| 📊 Metric | Value |
|---|---:|
| Countries covered | **61** |
| Official channels | **103** |
| Free-to-air / free-to-stream options | **67** |
| Sample fixtures mapped | **6** |

**Quick links:**

- [🌐 All countries](https://xyzs996.github.io/iptv-doctor/world-cup-2026-tv-guide.html)
- [🇺🇸 United States](https://xyzs996.github.io/iptv-doctor/world-cup-2026-tv-guide-us.html) · [🇨🇦 Canada](https://xyzs996.github.io/iptv-doctor/world-cup-2026-tv-guide-ca.html) · [🇲🇽 Mexico](https://xyzs996.github.io/iptv-doctor/world-cup-2026-tv-guide-mx.html)
- [🇬🇧 UK](https://xyzs996.github.io/iptv-doctor/world-cup-2026-tv-guide-gb.html) · [🇩🇪 Germany](https://xyzs996.github.io/iptv-doctor/world-cup-2026-tv-guide-de.html) · [🇫🇷 France](https://xyzs996.github.io/iptv-doctor/world-cup-2026-tv-guide-fr.html)
- [🇧🇷 Brazil](https://xyzs996.github.io/iptv-doctor/world-cup-2026-tv-guide-br.html) · [🇦🇷 Argentina](https://xyzs996.github.io/iptv-doctor/world-cup-2026-tv-guide-ar.html) · [🇯🇵 Japan](https://xyzs996.github.io/iptv-doctor/world-cup-2026-tv-guide-jp.html)
- [🇦🇺 Australia](https://xyzs996.github.io/iptv-doctor/world-cup-2026-tv-guide-au.html) · [🇮🇳 India](https://xyzs996.github.io/iptv-doctor/world-cup-2026-tv-guide-in.html) · [🇿🇦 South Africa](https://xyzs996.github.io/iptv-doctor/world-cup-2026-tv-guide-za.html)

**Downloadable metadata per country:** XMLTV · iCalendar · placeholder M3U (no stream URLs).

---

## 📺 IPTV Playlist Checker & M3U Cleaner

IPTV Doctor checks your own legal M3U/M3U8 playlist, finds dead IPTV channels, cleans dead streams, fixes XMLTV `tvg-id` mismatches, and produces shareable HTML, JSON, CSV, and Shields badge reports.

```bash
npx iptv-doctor check playlist.m3u --report report.html --json report.json --csv report.csv
```

### Capabilities

| Need | Command | Output |
|---|---|---|
| Check playlist | `iptv-doctor check` | HTML/JSON/CSV diagnostics and optional badge JSON |
| Remove dead streams | `iptv-doctor clean` | Fresh M3U |
| Fix EPG IDs | `iptv-doctor epg check/fix` | JSON audit or fixed M3U |
| Render saved diagnostics | `iptv-doctor report` | HTML/CSV/badge from JSON |
| Publish badge | `iptv-doctor badge` | Shields endpoint JSON |
| World Cup metadata | `iptv-doctor worldcup` | XMLTV/iCal/placeholder M3U/HTML guide |
| MCP metadata tools | `iptv-doctor mcp` | stdio MCP server |

### Report Preview

```txt
IPTV Doctor Report
Health Score: 83%

Channel       Status   Latency   Segments   Code
FOX           OK       430ms     1          OK
FS1           WARN     2800ms    1          WARN_SLOW
Demo Broken   FAIL     120ms                FAIL_HTTP
```

---

## 🛰️ Live IPTV Status Index

Auto-updated IPTV status index for official sports and public TV websites. Public outputs never include stream URLs, credentials, or paid channel lists.

| Metric | Value |
|---|---:|
| Total entries checked | see badge |
| Countries | see badge |
| Categories | Public Sports, World Cup 2026 |

- [status-index.json](data/status-index.json)
- [status-index.csv](data/status-index.csv)
- [status-badge.json](data/status-badge.json)
- [Live IPTV Status Index](https://xyzs996.github.io/iptv-doctor/status-index.html)

---

## 🚀 Quick Start

```bash
pnpm install
pnpm --filter iptv-doctor doctor check playlist.m3u --report report.html --json report.json --csv report.csv
pnpm test
pnpm typecheck
pnpm build
```

### Docker

```bash
docker run --rm -v "$PWD:/work" ghcr.io/xyzs996/iptv-doctor check /work/playlist.m3u --report /work/report.html
```

### GitHub Action

```yaml
- uses: xyzs996/iptv-doctor@v1
  with:
    playlist: playlist.m3u
    report: report.html
    json: report.json
    csv: report.csv
    badge: badge.json
```

---

## 🌐 Languages

- English (this README)
- [简体中文](README_CN.md) · [Español](README_ES.md) · [Português](README_PT.md) · [日本語](README_JA.md) · [한국어](README_KO.md) · [العربية](README_AR.md)

---

## 🤝 Contribute

- **Add a channel or country:** Use the issue templates to request official broadcaster metadata.
- **Report expired/offline sources:** Open an issue with the channel name and country.
- **Star this repo:** It helps more people discover free, legal IPTV tools and keeps the World Cup guide updated.

**Do not submit** stream URLs, paid channel lists, account credentials, Xtream/Stalker portals, tokenized links, or DRM bypass instructions.

---

## 📁 Monorepo Layout

- `apps/iptv-doctor`: flagship CLI
- `packages/iptv-core`: parser, probe engine, diagnostics, clean output, reports, compliance scan
- `packages/match2epg`: EPG generation engine for World Cup metadata
- `packages/sports-data`: tournament and legal viewing metadata
- `apps/worldcup-tv-guide`, `apps/wc26-mcp-tv`, `apps/spoiler-free-iptv`, `apps/public-sports-tv-index`: campaign pages and examples

---

## 📄 License

[MIT](LICENSE)
