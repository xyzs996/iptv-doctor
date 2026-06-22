# IPTV Doctor - IPTV Playlist Checker, M3U Cleaner, and XMLTV EPG Fixer

[![Live IPTV status](https://img.shields.io/endpoint?url=https%3A%2F%2Fxyzs996.github.io%2Fiptv-doctor%2Fstatus-badge.json)](https://xyzs996.github.io/iptv-doctor/status-index.json)
[![npm](https://img.shields.io/npm/v/iptv-doctor)](https://www.npmjs.com/package/iptv-doctor)
[![GitHub Pages](https://img.shields.io/badge/live-demo-blue)](https://xyzs996.github.io/iptv-doctor/)

IPTV Doctor is an open-source IPTV playlist checker for M3U, M3U8, HLS, XMLTV, and World Cup 2026 metadata workflows. It checks your own legal playlist, finds broken channels, cleans dead streams, fixes EPG IDs, and produces shareable HTML, JSON, CSV, and Shields badge reports.

No pirated streams. No paid channel lists. No Xtream credentials. IPTV Doctor does not host or distribute channels; bring your own legal playlist.

```bash
npx iptv-doctor check playlist.m3u --report report.html --json report.json --csv report.csv
```

Live demo and browser-local M3U preview: https://xyzs996.github.io/iptv-doctor/

npm package: https://www.npmjs.com/package/iptv-doctor

<!-- status-index:start -->
## Live IPTV Status Index

Auto-updated by GitHub Actions every 2 hours for official viewing paths and private M3U health checks. Public outputs never include stream URLs; private source URLs are reduced to host names and short hashes.

| Metric | Value |
|---|---:|
| Last updated | 2026-06-22T09:44:39.665Z |
| Source mode | official websites |
| Total entries checked | 12 |
| Online | 11 |
| Slow / warning | 0 |
| Offline | 1 |
| Health score | 92% |
| Countries | 4 |
| Categories | 2 |

| Country | Entry | Status | Latency ms | Host | Checked at |
|---|---|---|---:|---|---|
| CA | CTV | ONLINE | 530 | www.ctv.ca | 2026-06-22T09:44:32.124Z |
| GLOBAL | FIFA+ | ONLINE | 226 | www.plus.fifa.com | 2026-06-22T09:44:32.665Z |
| US | FOX | ONLINE | 211 | www.foxsports.com | 2026-06-22T09:44:32.092Z |
| US | FS1 | ONLINE | 180 | www.foxsports.com | 2026-06-22T09:44:32.121Z |
| US | Peacock | ONLINE | 380 | www.peacocktv.com | 2026-06-22T09:44:32.123Z |
| GLOBAL | Red Bull TV | ONLINE | 507 | www.redbull.com | 2026-06-22T09:44:32.665Z |
| US | Telemundo | ONLINE | 249 | www.telemundo.com | 2026-06-22T09:44:32.122Z |
| MX | Televisa | ONLINE | 537 | www.televisa.com | 2026-06-22T09:44:32.127Z |
| CA | TSN | ONLINE | 420 | www.tsn.ca | 2026-06-22T09:44:32.124Z |
| US | Tubi Sports | ONLINE | 2216 | tubitv.com | 2026-06-22T09:44:32.666Z |
| MX | TUDN | ONLINE | 486 | www.tudn.com | 2026-06-22T09:44:32.125Z |
| GLOBAL | Olympics Channel | OFFLINE | - | olympics.com | 2026-06-22T09:44:32.664Z |

Machine-readable outputs:

- [status-index.json](data/status-index.json)
- [status-index.csv](data/status-index.csv)
- [status-badge.json](data/status-badge.json)

Generated from official broadcaster and public sports website metadata. No stream URLs are stored or published.
<!-- status-index:end -->

## Why People Search For IPTV Doctor

- **IPTV playlist checker**: detect dead M3U/M3U8 entries, HTTP failures, slow HLS playlists, and broken media segments.
- **M3U playlist cleaner**: remove failed channels and write a fresh playlist for VLC, Kodi, Plex, Jellyfin, or IPTVnator.
- **XMLTV EPG fixer**: audit and repair `tvg-id` mismatches between an M3U playlist and a `guide.xml` file.
- **HLS stream checker**: sample media segments instead of only testing the manifest URL.
- **GitHub Actions IPTV health check**: publish report artifacts and badge JSON from CI.
- **World Cup 2026 IPTV metadata**: generate legal XMLTV, iCalendar, placeholder M3U, and browser-local guide assets without stream URLs.

## Report Preview

```txt
IPTV Doctor Report
Health Score: 83%

Channel       Status   Latency   Segments   Code
FOX           OK       430ms     1          OK
FS1           WARN     2800ms    1          WARN_SLOW
Demo Broken   FAIL     120ms                FAIL_HTTP
```

## Quick Start

Use the published CLI when you just want to inspect a playlist:

```bash
npx iptv-doctor check playlist.m3u --report report.html --json report.json --csv report.csv
npx iptv-doctor report report.json --html report.html --csv report.csv --badge badge.json
npx iptv-doctor clean playlist.m3u --out clean.m3u
npx iptv-doctor epg check playlist.m3u guide.xml --json epg.json
npx iptv-doctor epg fix playlist.m3u guide.xml --out fixed.m3u
npx iptv-doctor badge report.json --out badge.json
npx iptv-doctor mcp --list-tools
npx iptv-doctor worldcup --country US --format xmltv --out worldcup.xml
npx iptv-doctor worldcup --country US --format html --out worldcup-guide.html
```

## Capabilities

| Need | Command | Output |
|---|---|---|
| Check playlist | `iptv-doctor check` | HTML/JSON/CSV diagnostics and optional badge JSON |
| Render saved diagnostics | `iptv-doctor report` | HTML/CSV/badge from JSON |
| Remove dead streams | `iptv-doctor clean` | Fresh M3U |
| Fix EPG IDs | `iptv-doctor epg check/fix` | JSON audit or fixed M3U |
| Publish badge | `iptv-doctor badge` | Shields endpoint JSON |
| World Cup metadata | `iptv-doctor worldcup` | XMLTV/iCal/placeholder M3U/HTML guide |
| MCP metadata tools | `iptv-doctor mcp` | stdio MCP server |
| Compliance guard | `pnpm compliance:scan` | CI failure on disallowed content |

## GitHub Action

Use `.github/workflows/iptv-health-example.yml` as a copyable template. The composite action in `action.yml` writes `report.html`, `report.json`, `report.csv`, and `badge.json`.

```yaml
- uses: xyzs996/iptv-doctor@v1
  with:
    playlist: playlist.m3u
    report: report.html
    json: report.json
    csv: report.csv
    badge: badge.json
```

## Release Artifacts

```bash
node --import tsx scripts/generate-release-artifacts.ts dist/release
```

The publish workflow generates World Cup XMLTV/iCal/placeholder M3U/HTML guide artifacts plus sample report and clean playlist files.
It also emits Linux, macOS, and Windows launcher artifacts that call `npx iptv-doctor` for a low-friction release entry point.

## Docker

```bash
docker run --rm -v "$PWD:/work" ghcr.io/xyzs996/iptv-doctor check /work/playlist.m3u --report /work/report.html
```

## Monorepo Layout

- `apps/iptv-doctor`: flagship CLI.
- `packages/iptv-core`: parser, probe engine, diagnostics, clean output, reports, compliance scan.
- `packages/match2epg`: EPG generation engine for `iptv-doctor worldcup`.
- `packages/sports-data`: tournament and legal viewing metadata.
- `apps/worldcup-tv-guide`, `apps/wc26-mcp-tv`, `apps/spoiler-free-iptv`, `apps/public-sports-tv-index`: campaign pages and later-stage examples.

## Documentation

- [Acceptance criteria](docs/acceptance-criteria.md): public quality checklist for the CLI, reports, compliance guard, and release packaging.
- [Release runbook](docs/release-runbook.md): public release and verification steps.
- [How-to guides](docs/how-to): focused guides for GitHub Actions health checks, M3U cleanup, EPG fixes, shareable reports, and World Cup metadata.

## Commands

```bash
pnpm install
pnpm --filter iptv-doctor doctor check playlist.m3u --report report.html --json report.json --csv report.csv
pnpm test
pnpm typecheck
pnpm build
```
