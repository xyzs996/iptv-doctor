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

## 🌐 Languages

English (this README) · [简体中文](README_CN.md) · [Español](README_ES.md) · [Português](README_PT.md) · [日本語](README_JA.md) · [한국어](README_KO.md) · [العربية](README_AR.md)

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
Live status pages:

- https://xyzs996.github.io/iptv-doctor/status-index.html
- https://xyzs996.github.io/iptv-doctor/iptv-playlist-checker.html
- https://xyzs996.github.io/iptv-doctor/m3u-checker.html
- https://xyzs996.github.io/iptv-doctor/world-cup-2026-tv-guide.html

<!-- status-index:start -->
## Live IPTV Status Index

Auto-updated by GitHub Actions every 2 hours for official viewing paths and private M3U health checks. Public outputs never include stream URLs; private source URLs are reduced to host names and short hashes. Star this repo if you want a reusable IPTV status index and playlist health workflow.

| Metric | Value |
|---|---:|
| Last updated | 2026-06-26T01:35:47.459Z |
| Source mode | official websites |
| Total entries checked | 212 |
| Online | 156 |
| Slow / warning | 13 |
| Offline | 43 |
| Health score | 77% |
| Countries | 63 |
| Categories | 2 |

| Country | Entry | Status | Latency ms | Host | Checked at |
|---|---|---|---:|---|---|
| AU | 7plus Sport | ONLINE | 866 | 7plus.com.au | 2026-06-26T01:35:31.465Z |
| PT | A Bola | ONLINE | 372 | www.abola.pt | 2026-06-26T01:35:23.230Z |
| AU | ABC Sport | ONLINE | 398 | www.abc.net.au | 2026-06-26T01:35:27.757Z |
| JP | ABEMA | ONLINE | 519 | abema.tv | 2026-06-26T01:34:47.761Z |
| JP | ABEMA Sports | ONLINE | 555 | abema.tv | 2026-06-26T01:35:31.469Z |
| AE | Abu Dhabi Sports | ONLINE | 1561 | adsports.ae | 2026-06-26T01:34:15.143Z |
| CL | ADN Deportes | ONLINE | 1219 | www.adnradio.cl | 2026-06-26T01:35:37.583Z |
| QA | Al Kass | ONLINE | 180 | www.alkass.net | 2026-06-26T01:34:52.915Z |
| QA | Al Kass Sports | ONLINE | 344 | www.alkass.net | 2026-06-26T01:35:41.905Z |
| PE | América Televisión | ONLINE | 760 | www.americatv.com.pe | 2026-06-26T01:34:50.437Z |
| DE | ARD / Das Erste | ONLINE | 2011 | www.daserste.de | 2026-06-26T01:34:27.681Z |
| SA | Arriyadiyah | ONLINE | 1289 | www.arriyadiyah.com | 2026-06-26T01:35:41.906Z |
| ES | AS | ONLINE | 334 | as.com | 2026-06-26T01:35:20.572Z |
| MY | Astro Arena | ONLINE | 246 | www.astro.com.my | 2026-06-26T01:35:45.643Z |
| GB | BBC | ONLINE | 126 | www.bbc.co.uk | 2026-06-26T01:34:33.752Z |
| GB | BBC iPlayer | ONLINE | 522 | www.bbc.co.uk | 2026-06-26T01:34:33.754Z |
| GB | BBC Sport | ONLINE | 381 | www.bbc.co.uk | 2026-06-26T01:35:11.620Z |
| QA | beIN SPORTS MENA | ONLINE | 2475 | www.beinsports.com | 2026-06-26T01:34:50.440Z |
| DE | BILD Sport | ONLINE | 833 | sportbild.bild.de | 2026-06-26T01:35:20.570Z |
| US | Bleacher Report | ONLINE | 612 | bleacherreport.com | 2026-06-26T01:35:09.391Z |

Machine-readable outputs:

- [status-index.json](data/status-index.json)
- [status-index.csv](data/status-index.csv)
- [status-badge.json](data/status-badge.json)

Crawlable pages:

- [Live IPTV Status Index](https://xyzs996.github.io/iptv-doctor/status-index.html)
- [IPTV Playlist Checker](https://xyzs996.github.io/iptv-doctor/iptv-playlist-checker.html)
- [M3U Checker](https://xyzs996.github.io/iptv-doctor/m3u-checker.html)
- [World Cup 2026 TV Guide](https://xyzs996.github.io/iptv-doctor/world-cup-2026-tv-guide.html)

Generated from official broadcaster and public sports website metadata. No stream URLs are stored or published.
<!-- status-index:end -->

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

---

## 🔖 Keywords

People find this repo by searching for:

`iptv playlist checker`, `m3u checker`, `m3u8 checker`, `hls checker`, `iptv cleaner`, `m3u cleaner`, `iptv playlist cleaner`, `free iptv status index`, `xmltv epg fixer`, `epg checker`, `iptv doctor`, `github actions iptv health check`, `iptv status badge`, `kodi iptv setup`, `jellyfin iptv`, `plex iptv`, `world cup 2026 tv guide`, `fifa world cup 2026 broadcasters`, `where to watch world cup 2026`, `world cup 2026 streaming`, `world cup 2026 free to air`, `legal iptv tools`, `iptv diagnostics`, `iptv channel checker`, `playlist validator`, `stream url checker`, `hls playlist validator`, `iptv epg generator`, `m3u editor`, `iptv automation`.

---

## ❓ FAQ

**Q: Does IPTV Doctor provide free IPTV streams or M3U playlists?**
A: No. IPTV Doctor only checks playlists and websites you already own or that are publicly listed as official broadcasters. We never host, share, or link to unauthorized stream URLs.

**Q: Can I use this to check if my IPTV subscription M3U is still working?**
A: Yes. Run `iptv-doctor check playlist.m3u` to detect dead channels, slow hosts, and EPG mismatches.

**Q: What is the World Cup 2026 TV guide?**
A: A searchable directory of official broadcasters and free/paid streaming options for 61 countries, with XMLTV, iCalendar, and placeholder M3U metadata.

**Q: Is the status index updated automatically?**
A: Yes. GitHub Actions refreshes the IPTV status index and World Cup pages on a scheduled basis.

**Q: Can I self-host the report on GitHub Pages?**
A: Yes. The `status-index.yml` workflow publishes JSON, CSV, badge, and HTML pages to GitHub Pages.

**Q: Does it work with Kodi, Jellyfin, Plex, and VLC?**
A: Yes. The cleaned M3U and fixed XMLTV outputs are compatible with Kodi, Jellyfin, Plex, VLC, IPTVnator, and any standard IPTV player.

---

## 📚 Glossary

- **IPTV**: Internet Protocol television; TV content delivered over IP networks.
- **M3U / M3U8**: Playlist file formats used by IPTV players and streaming apps.
- **HLS**: HTTP Live Streaming, an adaptive bitrate streaming protocol by Apple.
- **XMLTV**: A file format for TV listings and electronic program guides (EPG).
- **EPG**: Electronic Program Guide; the schedule metadata mapped to channels.
- **tvg-id**: An XMLTV identifier used to link an M3U channel to its EPG entry.
- **EPG fixer**: A tool that detects and repairs mismatched `tvg-id` values between a playlist and a guide.
- **Status index**: A regularly checked table of website or stream endpoint health.
- **Placeholder M3U**: An M3U file with channel metadata but no actual stream URL.
- **Compliance scan**: A check that verifies no unauthorized stream URLs are present in outputs.
